    // =========================================================================
    // SUB-PAGE FILLERS
    // Each filler fills ONE entry on the current sub-page and returns true/false.
    // After a successful fill the caller saves the payload and submits the form.
    // DnD Beyond redirects back to the same create URL so the script fires again
    // for the next item automatically.
    // =========================================================================

    // /monster/senses/create/{monsterId}
    // Confirmed field IDs from live HTML:
    //   field-sense      (Select2: 1=Blindsight 2=Darkvision 3=Tremorsense 4=Truesight 5=Unknown)
    //   field-sense-note (text input for "60 ft." etc.)
    // Note: no "Devil's Sight" option exists — use type "unknown" for that.
    function fillSensePage(sense) {
        const typeVal = SENSE_TYPES[normalise(sense.type)];
        if (!typeVal) {
            showBanner(`⚠ Unknown sense type: "${sense.type}". Valid: blindsight, darkvision, tremorsense, truesight, unknown`, '#c0392b');
            return false;
        }
        // field-sense is a Select2 — must use jQuery .val().trigger('change')
        const jqEl = window.jQuery ? jQuery('#field-sense') : null;
        if (jqEl && jqEl.length && jqEl.data('select2')) {
            jqEl.val(String(typeVal)).trigger('change');
        } else {
            // Fallback: set underlying <select> directly
            if (!setSelect('field-sense', String(typeVal))) {
                const found = findSelectByOptionText(sense.type);
                if (!found) { showBanner(`⚠ field-sense not found. See console.`, '#c0392b'); return false; }
                found.el.value = found.value;
                found.el.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
        if (sense.notes !== undefined) setInput('field-sense-note', sense.notes);
        return true;
    }

    // /monster/skills/create/{monsterId}
    // Confirmed field IDs from live HTML:
    //   field-skill           (Select2: skill IDs confirmed above)
    //   field-value           (text: flat bonus, e.g. "5" — leave blank to use proficiency auto-calc)
    //   field-additional-bonus (text: extra bonus on top, usually blank)
    // NOTE: there is NO proficiency type select. DnD Beyond auto-calculates from CR.
    // Use field-value only if you want to hard-override the displayed bonus.
    function fillSkillPage(skill) {
        const skillId = SKILL_IDS[normalise(skill.name)];
        if (!skillId) {
            showBanner(`⚠ Unknown skill: "${skill.name}". Check SKILL_IDS map.`, '#c0392b');
            return false;
        }
        // field-skill is a Select2
        const jqEl = window.jQuery ? jQuery('#field-skill') : null;
        if (jqEl && jqEl.length && jqEl.data('select2')) {
            jqEl.val(String(skillId)).trigger('change');
        } else {
            if (!setSelect('field-skill', String(skillId))) {
                const found = findSelectByOptionText(skill.name);
                if (!found) { showBanner(`⚠ field-skill not found. See console.`, '#c0392b'); return false; }
                found.el.value = found.value;
                found.el.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
        // Optional flat bonus override — only set if explicitly provided
        if (skill.value !== undefined)           setInput('field-value', skill.value);
        if (skill.additionalBonus !== undefined) setInput('field-additional-bonus', skill.additionalBonus);
        return true;
    }

    // /monster/movement/create/{monsterId}
    // Confirmed field IDs from live HTML:
    //   field-movement-type (select: 1=Walk 2=Burrow 3=Climb 4=Fly 5=Swim)
    //   field-speed         (text: numeric speed in feet)
    //   field-note          (textarea: optional note e.g. "(hover)")
    // NOTE: no hover checkbox — use notes: "(hover)" for hover fly speed.
    function fillMovementPage(movement) {
        const typeVal = MOVEMENT_TYPES[normalise(movement.type)];
        if (!typeVal) {
            showBanner(`⚠ Unknown movement type: "${movement.type}". Valid: walk, burrow, climb, fly, swim`, '#c0392b');
            return false;
        }
        if (!setSelect('field-movement-type', String(typeVal))) {
            const found = findSelectByOptionText(movement.type);
            if (!found) { showBanner(`⚠ field-movement-type not found. See console.`, '#c0392b'); return false; }
            found.el.value = found.value;
            found.el.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (movement.speed !== undefined) setInput('field-speed', movement.speed);
        if (movement.notes !== undefined) setInput('field-note', movement.notes);
        return true;
    }

    // /entity/language/create/{monsterId}-{entityId}
    // Confirmed field IDs from live HTML:
    //   field-language (Select2: full language list with confirmed IDs above)
    //   field-note     (text: free-form note, e.g. "but does not speak")
    // NOTE: no separate "speaks/understands" field — just the language + a note.
    function fillLanguagePage(language) {
        const langId = LANGUAGE_IDS[normalise(language.name)];
        let set = false;
        if (langId) {
            // field-language is a Select2
            const jqEl = window.jQuery ? jQuery('#field-language') : null;
            if (jqEl && jqEl.length && jqEl.data('select2')) {
                jqEl.val(String(langId)).trigger('change');
                set = true;
            } else {
                set = setSelect('field-language', String(langId));
            }
        }
        if (!set) {
            const found = findSelectByOptionText(language.name);
            if (found) {
                found.el.value = found.value;
                found.el.dispatchEvent(new Event('change', { bubbles: true }));
                set = true;
            }
        }
        if (!set) {
            showBanner(`⚠ Could not find language: "${language.name}". Check LANGUAGE_IDS map.`, '#c0392b');
            return false;
        }
        // field-note holds any free-form note ("but does not speak", etc.)
        // language.description is also accepted as an alias for note
        const noteVal = language.notes !== undefined ? language.notes
                      : language.description !== undefined ? language.description
                      : undefined;
        if (noteVal !== undefined) setInput('field-note', noteVal);
        return true;
    }
