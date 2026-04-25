    // =========================================================================
    // UTILITY HELPERS
    // =========================================================================

    function normalise(str) {
        return (str || '').toString().trim().toLowerCase();
    }

    function setInput(id, value) {
        const el = document.getElementById(id);
        if (!el) { console.warn('[DDB] input not found:', id); return false; }
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
    }

    function setSelect(id, value) {
        const el = document.getElementById(id);
        if (!el) { console.warn('[DDB] select not found:', id); return false; }
        el.value = value;
        el.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
    }

    function setCheckbox(realId, fakeContainerId, checked) {
        const real = document.getElementById(realId);
        if (!real) return;
        real.checked = checked;
        real.dispatchEvent(new Event('change', { bubbles: true }));
        const fakeContainer = fakeContainerId ? document.getElementById(fakeContainerId) : null;
        if (fakeContainer) {
            if (checked) fakeContainer.classList.add('checked');
            else fakeContainer.classList.remove('checked');
        }
    }

    function setSelect2(selectId, numericValues) {
        const el = document.getElementById(selectId);
        if (!el) { console.warn('[DDB] select2 not found:', selectId); return; }
        const jqEl = window.jQuery ? jQuery('#' + selectId) : null;
        if (jqEl && jqEl.data('select2')) {
            jqEl.val(numericValues.map(String)).trigger('change');
        } else {
            Array.from(el.options).forEach(opt => {
                opt.selected = numericValues.map(String).includes(opt.value);
            });
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    // Run callback once TinyMCE has initialised all its editors, or immediately if already done.
    function whenTinyMCEReady(cb) {
        if (window.tinyMCE && tinyMCE.editors && tinyMCE.editors.length > 0) {
            cb(); return;
        }
        const poll = setInterval(() => {
            if (window.tinyMCE && tinyMCE.editors && tinyMCE.editors.length > 0) {
                clearInterval(poll);
                setTimeout(cb, 200); // small extra settle delay
            }
        }, 200);
        setTimeout(() => { clearInterval(poll); cb(); }, 5000); // fallback
    }

    function setRichText(fieldId, html) {
        // Always write — empty string clears DnD Beyond's placeholder text.
        const content = html || '';
        const textarea = document.getElementById(fieldId);
        if (!textarea) { console.warn('[DDB] richtext not found:', fieldId); return; }

        // Always set the underlying textarea value — this covers fields that are
        // disabled (legendary, mythic, lair) where TinyMCE has no active instance.
        textarea.value = content;
        textarea.dispatchEvent(new Event('change', { bubbles: true }));

        // Also update the live TinyMCE editor if one exists for this field
        if (window.tinyMCE) {
            const editor = tinyMCE.get(fieldId);
            if (editor) { editor.setContent(content); editor.isNotDirty = false; }
        }
    }

    // Scan all <select> elements for an option whose text contains `needle`.
    // Returns { el, value } or null.
    function findSelectByOptionText(needle) {
        const n = normalise(needle);
        for (const sel of document.querySelectorAll('select')) {
            for (const opt of sel.options) {
                if (normalise(opt.text).includes(n)) return { el: sel, value: opt.value };
            }
        }
        return null;
    }

    // Log all form fields to console — invaluable when a sub-page has unknown IDs.
    function dumpFormFields() {
        console.group('[DDB] Form field inventory for: ' + window.location.pathname);
        document.querySelectorAll('input[id], select[id], textarea[id]').forEach(el => {
            const val = el.type === 'select-one' || el.type === 'select-multiple'
                ? `selected="${el.value}"` : `value="${el.value}"`;
            console.log(`  ${el.tagName}#${el.id} [${el.type || 'select'}] ${val}`);
        });
        console.groupEnd();
    }

    function showBanner(message, colour) {
        document.getElementById('ddb-banner')?.remove();
        const banner = document.createElement('div');
        banner.id = 'ddb-banner';
        banner.style.cssText = `
            position:fixed;top:16px;left:50%;transform:translateX(-50%);
            background:${colour || '#1a6b2e'};color:#fff;padding:12px 28px;
            border-radius:6px;font-size:14px;font-weight:600;
            z-index:99999;box-shadow:0 4px 16px rgba(0,0,0,0.5);
            max-width:700px;text-align:center;line-height:1.5;pointer-events:none;
        `;
        banner.textContent = message;
        document.body.appendChild(banner);
        if (colour !== '#c0392b') setTimeout(() => banner.remove(), 7000);
    }

    // Persistent prompt shown on sub-pages — stays until the user clicks Save.
    // Avoids DnD Beyond's anti-automation login redirect triggered by scripted submits.
    function showSavePrompt(statusText) {
        document.getElementById('ddb-save-prompt')?.remove();
        const prompt = document.createElement('div');
        prompt.id = 'ddb-save-prompt';
        prompt.style.cssText = `
            position:fixed;top:0;left:0;right:0;
            background:#1a3a5c;color:#fff;padding:14px 24px;
            display:flex;align-items:center;justify-content:space-between;gap:16px;
            z-index:99999;box-shadow:0 2px 12px rgba(0,0,0,0.5);
            font-family:sans-serif;font-size:13px;
        `;
        prompt.innerHTML = `
            <span style="flex:1;line-height:1.5;">
                <strong style="color:#7dd;">⬇ DDB Importer</strong> — ${statusText}
            </span>
            <button id="ddb-save-now-btn" style="
                background:#1a6b2e;color:#fff;border:none;padding:10px 22px;
                border-radius:4px;cursor:pointer;font-size:14px;font-weight:700;
                white-space:nowrap;flex-shrink:0;
            ">Click Save to continue →</button>
        `;
        document.body.appendChild(prompt);

        // Wire the button to the page's actual Save button so the user only needs
        // to click our clearly-visible button rather than hunting for DnD Beyond's
        document.getElementById('ddb-save-now-btn').addEventListener('click', () => {
            prompt.remove();
            if (window.tinyMCE) { try { tinyMCE.triggerSave(); } catch(e) {} }
            const saveBtn = document.querySelector('button[type=submit], input[type=submit]')
                         || document.querySelector('button.button');
            if (saveBtn) saveBtn.click();
        });
    }

    // Click the submit button on the page's main form.
    function submitPageForm() {
        if (window.tinyMCE) { try { tinyMCE.triggerSave(); } catch (e) {} }
        const form = document.querySelector('form');
        if (!form) { console.error('[DDB] No form to submit'); return; }
        const btn = form.querySelector('button[type=submit], input[type=submit]')
                 || form.querySelector('button.button')
                 || form.querySelector('button');
        if (btn) btn.click(); else form.submit();
    }
