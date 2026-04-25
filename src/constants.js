    // =========================================================================
    // SELECT OPTION VALUE MAPS
    // These numeric IDs are taken from the live DnD Beyond HTML.
    // If DnD Beyond updates their form, re-confirm each map using dumpFormFields()
    // and cross-check against the relevant <select> element on the live page.
    // =========================================================================

    const MONSTER_TYPES = {
        aberration: 1, beast: 2, celestial: 3, construct: 4,
        dragon: 6, elemental: 7, fey: 8, fiend: 9, giant: 10,
        humanoid: 11, monstrosity: 13, ooze: 14, plant: 15,
        undead: 16, unknown: 17
    };

    const SIZES = {
        tiny: 2, small: 3, medium: 4, 'medium or small': 10,
        large: 5, huge: 6, gargantuan: 7,
        sm: 3, med: 4, lg: 5
    };

    const ALIGNMENTS = {
        'lawful good': 1, 'neutral good': 2, 'chaotic good': 3,
        'lawful neutral': 4, neutral: 5, 'chaotic neutral': 6,
        'lawful evil': 7, 'neutral evil': 8, 'chaotic evil': 9,
        'any alignment': 11, 'unaligned': 10,
        'any evil alignment': 13, 'any good alignment': 14,
        'any chaotic alignment': 15, 'any non-lawful alignment': 19,
        'any non-good alignment': 18
    };

    const CR_VALUES = {
        '0': 1, '1/8': 2, '1/4': 3, '1/2': 4,
        '1': 5, '2': 6, '3': 7, '4': 8, '5': 9,
        '6': 10, '7': 11, '8': 12, '9': 13, '10': 14,
        '11': 15, '12': 16, '13': 17, '14': 18, '15': 19,
        '16': 20, '17': 21, '18': 22, '19': 23, '20': 24,
        '21': 25, '22': 26, '23': 27, '24': 29, '25': 30,
        '26': 31, '27': 32, '28': 33, '29': 34, '30': 35
    };

    const SAVING_THROWS = { str: 1, dex: 2, con: 3, int: 4, wis: 5, cha: 6 };

    const DAMAGE_ADJUSTMENTS = {
        'bludgeoning - resistance': 1,
        'piercing - resistance': 2,
        'slashing - resistance': 3,
        'lightning - resistance': 4,
        'thunder - resistance': 5,
        'poison - resistance': 6,
        'cold - resistance': 7,
        'radiant - resistance': 8,
        'fire - resistance': 9,
        'necrotic - resistance': 10,
        'acid - resistance': 11,
        'psychic - resistance': 12,
        'bludgeoning, piercing, and slashing from nonmagical attacks - resistance': 13,
        'bludgeoning, piercing, and slashing from nonmagical attacks that aren\'t silvered - resistance': 14,
        'bludgeoning, piercing, and slashing from nonmagical attacks that aren\'t adamantine - resistance': 15,
        'bludgeoning - immunity': 17,
        'piercing - immunity': 18,
        'slashing - immunity': 19,
        'lightning - immunity': 20,
        'thunder - immunity': 21,
        'poison - immunity': 22,
        'cold - immunity': 23,
        'radiant - immunity': 24,
        'fire - immunity': 25,
        'necrotic - immunity': 26,
        'acid - immunity': 27,
        'psychic - immunity': 28,
        'bludgeoning, piercing, and slashing from nonmagical attacks - immunity': 29,
        'bludgeoning, piercing, and slashing from nonmagical attacks that aren\'t silvered - immunity': 30,
        'bludgeoning, piercing, and slashing from nonmagical attacks that aren\'t adamantine - immunity': 31,
        'bludgeoning - vulnerability': 33,
        'piercing - vulnerability': 34,
        'slashing - vulnerability': 35,
        'cold - vulnerability': 39,
        'fire - vulnerability': 41,
        'necrotic - vulnerability': 42,
        'force - resistance': 47,
        'force - immunity': 48,
        'all - resistance': 53,
        'all - immunity': 89,
    };

    const CONDITION_IMMUNITIES = {
        blinded: 1, charmed: 2, deafened: 3, exhaustion: 4,
        frightened: 5, grappled: 6, incapacitated: 7, invisible: 8,
        paralyzed: 9, petrified: 10, poisoned: 11, prone: 12,
        restrained: 13, stunned: 14, unconscious: 15
    };

    const ENVIRONMENTS = {
        any: 13, arctic: 1, coastal: 2, desert: 3, forest: 4,
        grassland: 5, hill: 6, mountain: 7, swamp: 8, underdark: 9,
        underwater: 10, urban: 11,
        'planar (shadowfell)': 12, 'planar (abyss)': 18,
        'planar (nine hells)': 19, 'planar (feywild)': 21,
    };

    // Sense type → DnD Beyond option value
    // Confirmed from live HTML: field-sense, options 1–5
    const SENSE_TYPES = {
        'blindsight': 1,
        'darkvision': 2,
        'tremorsense': 3,
        'truesight': 4,
        'unknown': 5,
        "devil's sight": 5, 'devils sight': 5,
    };

    // Skill name → DnD Beyond skill ID
    // Confirmed from live HTML: field-skill select
    const SKILL_IDS = {
        acrobatics: 3, 'animal handling': 11, arcana: 6, athletics: 2,
        deception: 16, history: 7, insight: 12, intimidation: 17,
        investigation: 8, medicine: 13, nature: 9, perception: 14,
        performance: 18, persuasion: 19, religion: 10, 'sleight of hand': 4,
        stealth: 5, survival: 15
    };

    // Movement type → option value
    // Confirmed from live HTML: field-movement-type select
    const MOVEMENT_TYPES = {
        burrow: 2, climb: 3, fly: 4, swim: 5, walk: 1,
    };

    // Language name → DnD Beyond language ID
    // Confirmed from live HTML: field-language select
    const LANGUAGE_IDS = {
        common: 1, dwarvish: 2, elvish: 3, giant: 4, gnomish: 5,
        goblin: 6, halfling: 7, orc: 8, abyssal: 9, celestial: 10,
        draconic: 11, 'deep speech': 12, infernal: 13, primordial: 14,
        sylvan: 15, undercommon: 16, druidic: 23, telepathy: 18,
        aquan: 19, auran: 20, ignan: 21, terran: 22,
        "thieves' cant": 46, 'thieves cant': 46,
        all: 35, 'all languages': 35, none: 128,
        // Expanded list from live HTML
        aarakocra: 36, aartuk: 88, abanasinian: 89, aglarondan: 151,
        aklo: 146, alzhedo: 152, angulotl: 121, ankeshelian: 126,
        archosauric: 167, birdfolk: 102, 'black speech': 129,
        'blink dog': 33, bothii: 51, bullywug: 38, caligni: 147,
        capran: 138, cervan: 103, chessentan: 153, chondathan: 154,
        'citlanés': 74, 'common sign language': 127,
        'communication spores': 166, daelkyr: 62, daemonic: 148,
        dalish: 130, damaran: 155, dara: 142, darakhul: 109,
        demodand: 101, derro: 110, djaynaian: 75, dohwar: 86,
        dunlendish: 136, eluran: 139, eonic: 111, ergot: 90,
        erina: 112, 'feather speech': 104, 'giant eagle': 24,
        'giant elk': 25, 'giant owl': 26, gibberling: 123, gith: 39,
        gnoll: 27, godstongue: 76, grell: 40, grippli: 70, grung: 47,
        hadozee: 87, halri: 77, hedge: 105, 'hook horror': 41,
        howler: 143, "huginn's speech": 124, 'ice toad': 55,
        iluskan: 156, istarian: 91, ixitxachitl: 52, jerbeen: 106,
        kenderspeak: 92, kharolian: 93, khur: 94, khuzdul: 131,
        kothian: 95, kraul: 60, kruthik: 73, "kuran'zoi": 122,
        lantanese: 157, lemurfolk: 113, leonin: 69, loxodan: 114,
        loxodon: 59, mapach: 107, marquesian: 67, maynah: 78,
        midani: 158, millitaur: 115, minotaur: 58, modron: 42,
        mulhorandi: 159, 'naku naku': 144, naush: 68, necril: 149,
        nerakese: 96, netherese: 54, nordmaarian: 97,
        'northern tongue': 125, "n'warian": 79, ogre: 98, olman: 56,
        orkish: 132, otyugh: 28, quirapu: 80, quori: 57, rashemi: 160,
        ravenfolk: 116, reghedjic: 161, riedran: 64, sahuagin: 29,
        sensan: 81, sespech: 162, shankhi: 82, sindarin: 133,
        'skin cant': 165, skitterwidget: 71, slaad: 37, solamnic: 99,
        sphinx: 30, swallybog: 141, thayan: 53, 'thri-kreen': 43,
        tilia: 140, tletlahtolli: 83, tlincalli: 48, torum: 145,
        tosculi: 117, troglodyte: 44, trollkin: 118, turmic: 163,
        'umber hulk': 45, umbral: 119, untheric: 164, varisian: 150,
        vedalken: 61, vegepygmy: 49, 'void speech': 120, vulpin: 108,
        'warg-speech': 134, westron: 135, 'winter wolf': 31, worg: 32,
        xingyu: 84, yeti: 34, yikaria: 50, zabaani: 85, zemnian: 66,
        ziklight: 72,
    };
