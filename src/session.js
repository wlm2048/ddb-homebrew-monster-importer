    // =========================================================================
    // SESSION STORAGE — persist the queue across page loads
    //
    // Payload shape stored in sessionStorage:
    // {
    //   data:      { ...original monster JSON, with senses/skills/movement/languages
    //                arrays consumed one entry at a time as sub-pages complete },
    //   monsterId: "6398993",
    //   entityId:  "779871897",   // from language link; null if not found
    //   editUrl:   "https://www.dndbeyond.com/homebrew/creations/monsters/…/edit",
    //   queue:     ["senses","skills","movement","languages"],  // remaining page types
    //   done:      [],            // page types already completed
    // }
    // =========================================================================

    function loadPayload() {
        try { return JSON.parse(sessionStorage.getItem(SS_KEY)); } catch (e) { return null; }
    }
    function savePayload(p) { sessionStorage.setItem(SS_KEY, JSON.stringify(p)); }
    function clearPayload() { sessionStorage.removeItem(SS_KEY); }

    // Build initial queue — only sub-page types that have data
    function buildQueue(data) {
        const q = [];
        if (Array.isArray(data.senses)    && data.senses.length)    q.push('senses');
        if (Array.isArray(data.skills)    && data.skills.length)    q.push('skills');
        if (Array.isArray(data.movement)  && data.movement.length)  q.push('movement');
        if (Array.isArray(data.languages) && data.languages.length) q.push('languages');
        return q;
    }

    // Pull monster ID and entity ID out of the sub-page links on the edit page
    function extractIds() {
        const langLink = document.querySelector('a[href*="/entity/language/create/"]');
        if (langLink) {
            const m = langLink.href.match(/\/entity\/language\/create\/(\d+)-(\d+)/);
            if (m) return { monsterId: m[1], entityId: m[2] };
        }
        const sensesLink = document.querySelector('a[href*="/monster/senses/create/"]')
                        || document.querySelector('a[href*="/monster/skills/create/"]')
                        || document.querySelector('a[href*="/monster/movement/create/"]');
        if (sensesLink) {
            const m = sensesLink.href.match(/\/monster\/\w+\/create\/(\d+)/);
            if (m) return { monsterId: m[1], entityId: null };
        }
        return { monsterId: null, entityId: null };
    }

    // Navigate to the first URL in the queue
    function navigateToNext(payload) {
        const next = payload.queue[0];
        const { monsterId, entityId } = payload;

        const urls = {
            senses:    `https://www.dndbeyond.com/monster/senses/create/${monsterId}`,
            skills:    `https://www.dndbeyond.com/monster/skills/create/${monsterId}`,
            movement:  `https://www.dndbeyond.com/monster/movement/create/${monsterId}`,
            languages: `https://www.dndbeyond.com/entity/language/create/${monsterId}-${entityId}`,
        };

        const url = urls[next];
        if (!url || url.includes('undefined') || url.includes('null')) {
            const msg = next === 'languages' && !entityId
                ? `Cannot navigate to languages — entity ID not found. Open the edit page once, then re-run.`
                : `Cannot build URL for "${next}" — monsterId: ${monsterId}`;
            showBanner('⚠ ' + msg, '#c0392b');
            console.error('[BCN]', msg);
            return;
        }

        savePayload(payload);
        showBanner(`⏳ Moving to ${next} page…`, '#2c5aa0');
        window.location.href = url;
    }

    // Called after a sub-page type is fully done (or empty): remove from queue and advance
    function advanceQueue(payload) {
        if (payload.queue.length === 0) {
            clearPayload();
            showBanner('✓ All done! Returning to monster edit page…', '#1a6b2e');
            setTimeout(() => { window.location.href = payload.editUrl; }, 1500);
        } else {
            navigateToNext(payload);
        }
    }
