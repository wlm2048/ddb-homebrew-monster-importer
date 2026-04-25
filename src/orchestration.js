    // =========================================================================
    // SUB-PAGE ORCHESTRATION
    // On each sub-page: fill the first item in the array, pop it, submit.
    // DnD Beyond sends us back to the same create URL, so we loop until empty.
    // When array is empty, move to the next queue entry (or back to edit page).
    // =========================================================================

    function runSubPage(payload) {
        const path = window.location.pathname;
        let pageType = null;
        if (path.includes('/monster/senses/create/'))   pageType = 'senses';
        if (path.includes('/monster/skills/create/'))   pageType = 'skills';
        if (path.includes('/monster/movement/create/')) pageType = 'movement';
        if (path.includes('/entity/language/create/'))  pageType = 'languages';
        if (!pageType) return;

        const items = payload.data[pageType];

        if (!Array.isArray(items) || items.length === 0) {
            // Nothing (or nothing left) for this type — advance
            payload.queue.shift();
            payload.done = payload.done || [];
            payload.done.push(pageType);
            advanceQueue(payload);
            return;
        }

        const item      = items[0];
        const remaining = items.slice(1);

        let filled = false;
        if (pageType === 'senses')    filled = fillSensePage(item);
        if (pageType === 'skills')    filled = fillSkillPage(item);
        if (pageType === 'movement')  filled = fillMovementPage(item);
        if (pageType === 'languages') filled = fillLanguagePage(item);

        if (!filled) {
            // Error banner already shown — stall so the user can see it.
            // Leave payload intact so they can manually fix and retry.
            return;
        }

        // Update payload with remaining items
        payload.data[pageType] = remaining;

        if (remaining.length === 0) {
            payload.queue.shift();
            payload.done = payload.done || [];
            payload.done.push(pageType);
        }

        savePayload(payload);

        // Build the "what's next" summary
        const leftInType = remaining.length;
        const nextUp = payload.queue.length > 0
            ? `Next: ${payload.queue.join(' → ')}`
            : 'Last entry — will return to edit page after save.';
        const itemSummary = leftInType > 0
            ? `${leftInType} more ${pageType} to go after this.`
            : `All ${pageType} done.`;

        // Show a persistent save prompt — user clicks Save themselves to avoid
        // DnD Beyond's anti-automation login redirects
        showSavePrompt(`Fields filled. ${itemSummary} ${nextUp}`);
    }

    // =========================================================================
    // MAIN FORM — full import + save + sub-page chain
    // =========================================================================

    function startImport(data) {
        const errors = fillMainForm(data);
        const { monsterId, entityId } = extractIds();
        const queue = buildQueue(data);

        if (errors.length) {
            alert('[BCN] Warnings:\n' + errors.map(e => '• ' + e).join('\n') + '\n\nAll other fields filled.');
        }

        if (queue.length === 0) {
            showBanner('✓ Form filled. Review then click Save Changes.');
            return;
        }

        if (!monsterId) {
            showBanner('⚠ Sub-page links not found — is this monster saved yet? Save it once manually, then re-import.', '#c0392b');
            return;
        }

        // Stash payload and prompt — user clicks Save, DnD Beyond redirects to edit,
        // script picks up the queue on arrival
        const payload = {
            data, monsterId, entityId,
            editUrl: window.location.href,
            queue, done: [],
        };
        savePayload(payload);
        showSavePrompt(`Form filled. Will continue to: ${queue.join(' → ')} after save.`);
    }
