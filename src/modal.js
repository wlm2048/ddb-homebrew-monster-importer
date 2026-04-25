    // =========================================================================
    // UI — import button + modal (only injected on main edit page)
    // =========================================================================

    function openImportModal(isCreatePage) {
        document.getElementById('bcn-import-modal')?.remove();

        const overlay = document.createElement('div');
        overlay.id = 'bcn-import-modal';
        overlay.style.cssText = `
            position:fixed;inset:0;background:rgba(0,0,0,0.78);
            z-index:99998;display:flex;align-items:center;justify-content:center;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background:#1a1e21;border:1px solid #555;border-radius:8px;
            padding:24px;width:720px;max-width:95vw;max-height:90vh;
            display:flex;flex-direction:column;gap:14px;
            color:#ddd;font-family:sans-serif;font-size:14px;
        `;

        const instructions = isCreatePage
            ? `<strong style="color:#beb;">Fill Form Only</strong> — you're on the Create page.
               The script will fill all fields. <strong style="color:#f0ad4e;">Click Save yourself</strong>
               when ready — DnD Beyond will redirect to the edit page, where the script will
               automatically continue to Senses → Skills → Movement → Languages.<br>
               <span style="color:#f0ad4e;">⚠ "Import &amp; Save All" is disabled here because the monster
               doesn't have an ID yet. Use Fill &amp; Continue instead.</span>`
            : `<strong style="color:#beb;">Import &amp; Save All</strong> — fills this form, saves it, then
               automatically visits Senses → Skills → Movement → Languages sub-pages and fills those too,
               then returns here.<br>
               <strong style="color:#beb;">Fill Form Only</strong> — fills this page only, no save or navigation.`;

        modal.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <h2 style="margin:0;font-size:19px;color:#fff;">BCN Monster Importer <span style="font-size:13px;color:#888;font-weight:normal;">v2.0</span></h2>
                <button id="bcn-close-btn" style="background:none;border:none;color:#aaa;font-size:26px;cursor:pointer;line-height:1;padding:0 4px;">×</button>
            </div>
            <div style="background:#1e2a1e;border:1px solid #3a5a3a;border-radius:4px;padding:10px 14px;font-size:13px;color:#9db;line-height:1.6;">
                ${instructions}
            </div>
            <textarea id="bcn-json-input" spellcheck="false" style="
                flex:1;min-height:320px;background:#0d1012;color:#cfc;
                border:1px solid #555;border-radius:4px;padding:10px;
                font-family:monospace;font-size:12px;resize:vertical;tab-size:2;
            " placeholder="Paste monster JSON here…"></textarea>
            <div id="bcn-error-msg" style="color:#f88;font-size:12px;min-height:16px;"></div>
            <div style="display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;">
                <button id="bcn-sample-btn" style="
                    background:#2a3540;color:#ccc;border:1px solid #555;
                    padding:8px 16px;border-radius:4px;cursor:pointer;font-size:13px;">
                    Load Sample (Gutterwight)
                </button>
                <button id="bcn-fillonly-btn" style="
                    background:#2a3540;color:#ccc;border:1px solid #555;
                    padding:8px 16px;border-radius:4px;cursor:pointer;font-size:13px;">
                    ${isCreatePage ? 'Fill &amp; Continue →' : 'Fill Form Only'}
                </button>
                ${isCreatePage ? '' : `
                <button id="bcn-import-btn" style="
                    background:#1a6b2e;color:#fff;border:none;
                    padding:8px 22px;border-radius:4px;cursor:pointer;
                    font-size:13px;font-weight:700;letter-spacing:.3px;">
                    Import &amp; Save All →
                </button>`}
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        document.getElementById('bcn-close-btn')
            .addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

        document.getElementById('bcn-sample-btn').addEventListener('click', () => {
            document.getElementById('bcn-json-input').value = buildSampleJson();
            document.getElementById('bcn-error-msg').textContent = '';
        });

        // "Fill Form Only" on edit page, or "Fill & Continue" on create page
        document.getElementById('bcn-fillonly-btn').addEventListener('click', () => {
            const raw = document.getElementById('bcn-json-input').value.trim();
            const errEl = document.getElementById('bcn-error-msg');
            if (!raw) { errEl.textContent = 'Paste your JSON first.'; return; }
            let data;
            try { data = JSON.parse(raw); }
            catch (e) { errEl.textContent = 'Invalid JSON: ' + e.message; return; }
            errEl.textContent = '';
            overlay.remove();
            setTimeout(() => {
                const errs = fillMainForm(data);
                if (isCreatePage) {
                    // Stash the payload so sub-pages run after DnD Beyond redirects
                    // to the edit URL. We don't have a monsterId yet so queue is stored
                    // but navigation won't fire until we land on the edit page.
                    const queue = buildQueue(data);
                    if (queue.length > 0) {
                        const payload = { data, monsterId: null, entityId: null,
                                          editUrl: null, queue, done: [] };
                        savePayload(payload);
                        showBanner('✓ Form filled. Click Save — the script will handle sub-pages after redirect.', '#1a6b2e');
                    } else {
                        showBanner('✓ Form filled. Click Save to create the monster.');
                    }
                } else {
                    if (errs.length) alert('[BCN] Warnings:\n' + errs.map(e => '• ' + e).join('\n'));
                    else showBanner('✓ Form filled. Review and click Save Changes when ready.');
                }
            }, 100);
        });

        // "Import & Save All" — edit page only
        const importBtn = document.getElementById('bcn-import-btn');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                const raw = document.getElementById('bcn-json-input').value.trim();
                const errEl = document.getElementById('bcn-error-msg');
                if (!raw) { errEl.textContent = 'Paste your JSON first.'; return; }
                let data;
                try { data = JSON.parse(raw); }
                catch (e) { errEl.textContent = 'Invalid JSON: ' + e.message; return; }
                errEl.textContent = '';
                overlay.remove();
                setTimeout(() => startImport(data), 100);
            });
        }
    }

    function injectButton() {
        if (document.getElementById('bcn-import-open-btn')) return;

        const path = window.location.pathname;
        const isCreatePage = path === '/homebrew/creations/create-monster'
                          || path === '/homebrew/creations/create-monster/create';

        const btn = document.createElement('button');
        btn.id = 'bcn-import-open-btn';
        btn.type = 'button';
        btn.textContent = '⬇ Import JSON';
        btn.style.cssText = `
            position:fixed;bottom:24px;right:24px;z-index:99999;
            background:#1a6b2e;color:#fff;border:none;padding:10px 18px;
            border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;
            box-shadow:0 2px 8px rgba(0,0,0,0.4);
        `;
        btn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            openImportModal(isCreatePage);
        });

        // Anchor to the page <header> which exists before TinyMCE touches anything
        // and is completely outside the form DOM. insertAdjacentElement on the header
        // cannot be captured by TinyMCE iframe initialisation.
        const anchor = document.querySelector('header.page-header')
                    || document.querySelector('#site-main')
                    || document.querySelector('#site');
        if (anchor) {
            anchor.insertAdjacentElement('beforebegin', btn);
        } else {
            // True last resort — use a MutationObserver to immediately move it
            // if TinyMCE captures it
            document.body.appendChild(btn);
            new MutationObserver(() => {
                if (btn.parentNode !== document.body) {
                    document.body.appendChild(btn);
                }
            }).observe(document.body, { childList: true, subtree: false });
        }
    }
