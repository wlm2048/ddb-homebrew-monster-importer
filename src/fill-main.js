    // =========================================================================
    // MAIN FORM FILL
    // =========================================================================

    function fillMainForm(data) {
        const errors = [];

        setSelect('field-stat-block-type', normalise(data.statBlockType) === '5e' ? '0' : '1');

        if (data.name)    setInput('field-Name', data.name);
        if (data.version !== undefined) setInput('field-version', data.version);

        const typeVal = MONSTER_TYPES[normalise(data.monsterType)];
        if (typeVal) setSelect('field-monster-type', String(typeVal));
        else if (data.monsterType) errors.push(`Unknown monsterType: "${data.monsterType}"`);

        const sizeVal = SIZES[normalise(data.size)];
        if (sizeVal) setSelect('field-size', String(sizeVal));
        else if (data.size) errors.push(`Unknown size: "${data.size}"`);

        if (data.alignment) {
            const v = ALIGNMENTS[normalise(data.alignment)];
            if (v) setSelect('field-alignment', String(v));
            else errors.push(`Unknown alignment: "${data.alignment}"`);
        }

        if (data.cr !== undefined) {
            const v = CR_VALUES[String(data.cr).trim()];
            if (v) setSelect('field-challenge-rating', String(v));
            else errors.push(`Unknown CR: "${data.cr}"`);
        }

        // Defer all rich text writes until TinyMCE editors are fully initialised.
        // If we write before TinyMCE is ready the content goes into the textarea but
        // TinyMCE overwrites it with its placeholder when it initialises.
        whenTinyMCEReady(() => {
            setRichText('field-special-traits-description-wysiwyg',         data.traits          || '');
            setRichText('field-actions-description-wysiwyg',                data.actions         || '');
            setRichText('field-bonus-actions-description-wysiwyg',          data.bonusActions    || '');
            setRichText('field-reactions-description-wysiwyg',              data.reactions       || '');
            setRichText('field-monster-characteristics-description-wysiwyg',data.characteristics || '');
            // Always clear the conditional rich text fields to remove placeholders,
            // even when the monster isn't legendary/mythic/lair.
            setRichText('field-legendary-actions-description-wysiwyg',
                (data.isLegendary && data.legendaryActions) ? data.legendaryActions : '');
            setRichText('field-mythic-actions-description-wysiwyg',
                (data.isMythic && data.mythicActions) ? data.mythicActions : '');
            setRichText('field-lair-description-wysiwyg',
                (data.hasLair && data.lairDescription) ? data.lairDescription : '');
        });

        if (data.ac              !== undefined) setInput('field-armor-class',         data.ac);
        if (data.acType          !== undefined) setInput('field-armor-class-type',    data.acType);
        if (data.initiativeBonus !== undefined) setInput('field-initiative-bonus',    data.initiativeBonus);
        if (data.passivePerception !== undefined) setInput('field-passive-perception', data.passivePerception);
        if (data.hp              !== undefined) setInput('field-average-hit-points',  data.hp);
        if (data.hpDieCount      !== undefined) setInput('field-hit-points-die-count',data.hpDieCount);
        if (data.hpDieValue      !== undefined) setSelect('field-hit-points-die-value', String(data.hpDieValue));
        if (data.hpModifier      !== undefined) setInput('field-hit-points-modifier', data.hpModifier);

        if (data.str !== undefined) setInput('field-strength',    data.str);
        if (data.dex !== undefined) setInput('field-dexterity',   data.dex);
        if (data.con !== undefined) setInput('field-constitution', data.con);
        if (data.int !== undefined) setInput('field-intelligence', data.int);
        if (data.wis !== undefined) setInput('field-wisdom',      data.wis);
        if (data.cha !== undefined) setInput('field-charisma',    data.cha);

        if (Array.isArray(data.savingThrows) && data.savingThrows.length) {
            setSelect2('field-monster-saving-throw',
                data.savingThrows.map(s => SAVING_THROWS[normalise(s)]).filter(Boolean));
        }

        if (data.saveBonusStr !== undefined) setInput('field-strength-save-bonus',     data.saveBonusStr);
        if (data.saveBonusDex !== undefined) setInput('field-dexterity-save-bonus',    data.saveBonusDex);
        if (data.saveBonusCon !== undefined) setInput('field-constitution-save-bonus', data.saveBonusCon);
        if (data.saveBonusInt !== undefined) setInput('field-intelligence-save-bonus', data.saveBonusInt);
        if (data.saveBonusWis !== undefined) setInput('field-wisdom-save-bonus',       data.saveBonusWis);
        if (data.saveBonusCha !== undefined) setInput('field-charisma-save-bonus',     data.saveBonusCha);

        if (Array.isArray(data.damageAdjustments) && data.damageAdjustments.length) {
            const vals = data.damageAdjustments.map(s => DAMAGE_ADJUSTMENTS[normalise(s)]).filter(Boolean);
            const unk  = data.damageAdjustments.filter(s => !DAMAGE_ADJUSTMENTS[normalise(s)]);
            if (unk.length) errors.push(`Unknown damage adjustments: ${unk.join(', ')}`);
            setSelect2('field-damage-adjustment', vals);
        }

        if (Array.isArray(data.conditionImmunities) && data.conditionImmunities.length) {
            setSelect2('field-condition-immunity',
                data.conditionImmunities.map(s => CONDITION_IMMUNITIES[normalise(s)]).filter(Boolean));
        }

        if (Array.isArray(data.environments) && data.environments.length) {
            setSelect2('field-monster-environments',
                data.environments.map(s => ENVIRONMENTS[normalise(s)]).filter(Boolean));
        }

        if (data.gear         !== undefined) setInput('field-gear-description', data.gear);
        if (data.languageNote !== undefined) setInput('field-languages-note',   data.languageNote);

        setCheckbox('field-is-legendary', 'fc-fake-is-legendary', !!data.isLegendary);
        setCheckbox('field-is-mythic', 'fc-fake-is-mythic', !!data.isMythic);
        setCheckbox('field-has-lair', 'fc-fake-has-lair', !!data.hasLair);

        return errors;
    }
