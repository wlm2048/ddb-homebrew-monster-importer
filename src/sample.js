    // =========================================================================
    // SAMPLE JSON
    // Loaded via the "Load Sample (Gutterwight)" button in the import modal.
    // Keep in sync with fixtures/monsters/gutterwight.json — that file is the canonical
    // tested fixture; this is just the in-modal convenience copy.
    // =========================================================================

    function buildSampleJson() {
        return JSON.stringify({
            // ---- Core stat block ----
            name: "Gutterwight",
            statBlockType: "5.5e",
            monsterType: "undead",
            size: "medium",
            alignment: "neutral evil",
            cr: "5",
            ac: 17,
            acType: "Natural Armor",
            initiativeBonus: "",
            passivePerception: 14,
            hp: 102,
            hpDieCount: 12,
            hpDieValue: 8,
            hpModifier: 48,
            str: 16, dex: 14, con: 18, int: 7, wis: 12, cha: 8,
            savingThrows: ["con", "wis"],
            damageAdjustments: [
                "bludgeoning - resistance",
                "slashing - resistance"
            ],
            conditionImmunities: ["charmed", "poisoned"],
            environments: ["underdark", "urban"],
            gear: "",
            languageNote: "Only languages it knew in life",
            // ---- Rich text ----
            traits: "<p><em><strong>Filth Regeneration.</strong></em> The gutterwight regains 10 hit points at the start of its turn if it is in dim light or darkness, or touching water or sewage. If it takes acid or fire damage, this trait doesn't function until the end of its next turn.</p><p><em><strong>Grate-Creeper.</strong></em> The gutterwight can move through spaces as narrow as 4 inches without squeezing, provided they connect to a drain, grate, or pipe opening.</p><p><em><strong>Stench of the Underflow.</strong></em> A creature that starts its turn within 10 feet of the gutterwight must succeed on a DC 13 Constitution saving throw or be poisoned until the start of its next turn. On a success, the creature is immune to this stench for 24 hours.</p><p><em><strong>Sunshy.</strong></em> While in bright light, the gutterwight has disadvantage on attack rolls.</p>",
            actions: "<p><strong>Multiattack.</strong> The gutterwight makes two Rake attacks.</p><p><em><strong>Rake.</strong></em> <em>Melee Weapon Attack:</em> +6 to hit, reach 5 ft., one target. <em>Hit:</em> 12 (2d8 + 3) slashing damage. If the target is grappled by the gutterwight, the hit deals an additional 7 (2d6) bludgeoning damage.</p><p><em><strong>Hook and Haul (Recharge 5\u20136).</strong></em> <em>Melee Weapon Attack:</em> +6 to hit, reach 10 ft., one creature. <em>Hit:</em> 9 (2d6 + 3) piercing damage and the target must succeed on a DC 14 Strength saving throw or be grappled (escape DC 14) and pulled up to 10 feet toward the gutterwight.</p>",
            bonusActions: "<p><em><strong>Drain-Slip.</strong></em> If the gutterwight is within 5 feet of a drain, grate, or sewer opening, it moves up to half its speed without provoking opportunity attacks.</p>",
            reactions: "",
            characteristics: "<p>A revenant-like horror of sodden rags, clotted hair, and grate-bent iron. It hates light and loves the reek of the undercity. Its elongated limbs move with unsettling fluidity and it speaks only in guttered whispers.</p>",
            isLegendary: false,
            legendaryActions: "",
            isMythic: false,
            mythicActions: "",
            hasLair: false,
            lairDescription: "",
            // ---- Sub-page data (filled on separate pages after main form saves) ----
            senses: [
                { type: "darkvision", notes: "60 ft." }
            ],
            skills: [
                { name: "stealth" },
                { name: "perception" }
            ],
            movement: [
                { type: "walk",  speed: 30 },
                { type: "climb", speed: 20 }
            ],
            languages: [
                { name: "common", notes: "understands but does not speak" }
            ]
        }, null, 2);
    }
