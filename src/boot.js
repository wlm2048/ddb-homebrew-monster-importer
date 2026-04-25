    // =========================================================================
    // BOOT
    // Determines which page we're on and takes appropriate action.
    // =========================================================================

    function boot() {
        const path = window.location.pathname;

        const isMainForm = path.includes('/homebrew/creations/create-monster')
                        || path.includes('/homebrew/creations/monsters/');
        const isSubPage  = path.includes('/monster/senses/create/')
                        || path.includes('/monster/skills/create/')
                        || path.includes('/monster/movement/create/')
                        || path.includes('/entity/language/create/');

        const payload = loadPayload();

        // --- Sub-page with active import run ---
        if (isSubPage && payload) {
            // Give DnD Beyond time to initialise its form JS
            setTimeout(() => runSubPage(payload), 900);
            return;
        }

        // --- Sub-page without a run (manual navigation) ---
        if (isSubPage) return;

        // --- Main edit/create page ---
        if (isMainForm) {
            injectButton();

            // Returned from all sub-pages successfully
            if (payload && Array.isArray(payload.queue) && payload.queue.length === 0) {
                showBanner('✓ All sub-pages complete! Monster fully imported.');
                clearPayload();
                return;
            }

            // We have a payload but monsterId is null — we just arrived on the edit
            // page after saving from the create page. Extract IDs now and continue.
            if (payload && Array.isArray(payload.queue) && payload.queue.length > 0
                    && !payload.monsterId) {
                const { monsterId, entityId } = extractIds();
                if (monsterId) {
                    payload.monsterId = monsterId;
                    payload.entityId  = entityId;
                    payload.editUrl   = window.location.href;
                    savePayload(payload);
                    showBanner(`✓ Monster saved. Navigating to: ${payload.queue.join(' → ')}…`, '#2c5aa0');
                    setTimeout(() => navigateToNext(payload), 1500);
                } else {
                    setTimeout(() => {
                        const { monsterId: id2, entityId: eid2 } = extractIds();
                        if (id2) {
                            payload.monsterId = id2;
                            payload.entityId  = eid2;
                            payload.editUrl   = window.location.href;
                            savePayload(payload);
                            showBanner(`✓ Monster saved. Navigating to: ${payload.queue.join(' → ')}…`, '#2c5aa0');
                            setTimeout(() => navigateToNext(payload), 1000);
                        } else {
                            showBanner('⚠ Could not extract monster ID. Use Import & Save All manually.', '#c0392b');
                            clearPayload();
                        }
                    }, 2000);
                }
                return;
            }

            // Returning to edit page after a sub-page cycle — navigate to next
            if (payload && Array.isArray(payload.queue) && payload.queue.length > 0) {
                showBanner(`✓ Saved. Navigating to next: ${payload.queue[0]}…`, '#2c5aa0');
                setTimeout(() => navigateToNext(payload), 1200);
                return;
            }

            console.log('[BCN Importer v2] Ready. Click "⬇ Import JSON" to begin.');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})();
