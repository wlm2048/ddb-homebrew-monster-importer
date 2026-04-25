# BCN Monster Importer — JSON Reference

This document describes the JSON format used by the BCN Monster Importer Tampermonkey script to create homebrew monsters on DnD Beyond.

Paste a completed JSON object into the Import modal on the monster create or edit page. Required fields are marked **required** — all others are optional and can be omitted entirely or left as empty strings.

---

## Top-Level Structure

```json
{
  "name": "...",
  "statBlockType": "5.5e",
  "monsterType": "...",
  "size": "...",
  "alignment": "...",
  "cr": "...",
  "ac": 0,
  "acType": "...",
  "initiativeBonus": "",
  "passivePerception": 0,
  "hp": 0,
  "hpDieCount": 0,
  "hpDieValue": 8,
  "hpModifier": 0,
  "str": 10, "dex": 10, "con": 10, "int": 10, "wis": 10, "cha": 10,
  "savingThrows": [],
  "damageAdjustments": [],
  "conditionImmunities": [],
  "environments": [],
  "gear": "",
  "languageNote": "",
  "traits": "",
  "actions": "",
  "bonusActions": "",
  "reactions": "",
  "characteristics": "",
  "isLegendary": false,
  "legendaryActions": "",
  "isMythic": false,
  "mythicActions": "",
  "hasLair": false,
  "lairDescription": "",
  "senses": [],
  "skills": [],
  "movement": [],
  "languages": []
}
```

---

## Fields

### Identity

| Field | Required | Type | Notes |
|---|---|---|---|
| `name` | **required** | string | Monster name as it will appear on DnD Beyond |
| `statBlockType` | optional | string | `"5.5e"` (default) or `"5e"` |
| `monsterType` | **required** | string | See [Monster Types](#monster-types) |
| `size` | **required** | string | See [Sizes](#sizes) |
| `alignment` | optional | string | See [Alignments](#alignments) |
| `cr` | **required** | string | Challenge rating as a string: `"0"`, `"1/8"`, `"1/4"`, `"1/2"`, `"1"` … `"30"` |

### Combat Stats

| Field | Required | Type | Notes |
|---|---|---|---|
| `ac` | **required** | number | Armour Class |
| `acType` | optional | string | e.g. `"Natural Armor"`, `"Plate"`, `"Mage Armor"` |
| `initiativeBonus` | optional | number or `""` | Leave blank to use DEX modifier |
| `passivePerception` | **required** | number | |
| `hp` | **required** | number | Average hit points displayed |
| `hpDieCount` | **required** | number | Number of hit dice |
| `hpDieValue` | **required** | number | Die size: `4`, `6`, `8`, `10`, `12`, or `20` |
| `hpModifier` | optional | number | Flat HP modifier (usually CON mod × die count) |

### Ability Scores

All six are **required**.

```json
"str": 16, "dex": 14, "con": 18, "int": 7, "wis": 12, "cha": 8
```

### Saving Throw Proficiencies

Optional array. Include only the saves the monster is proficient in.

```json
"savingThrows": ["con", "wis"]
```

Valid values: `"str"`, `"dex"`, `"con"`, `"int"`, `"wis"`, `"cha"`

### Saving Throw Flat Bonus Overrides

Optional. Only include if you need to hard-override the auto-calculated bonus.

```json
"saveBonusStr": 5,
"saveBonusDex": 3,
"saveBonusCon": 7,
"saveBonusInt": 0,
"saveBonusWis": 4,
"saveBonusCha": 0
```

### Damage Adjustments

Optional array of resistance, immunity, and vulnerability strings.

```json
"damageAdjustments": [
  "bludgeoning - resistance",
  "slashing - resistance",
  "poison - immunity",
  "fire - vulnerability"
]
```

Format is always `"[damage type] - [adjustment type]"`. Common values:

**Adjustment types:** `resistance`, `immunity`, `vulnerability`

**Damage types:** `bludgeoning`, `piercing`, `slashing`, `acid`, `cold`, `fire`, `force`, `lightning`, `necrotic`, `poison`, `psychic`, `radiant`, `thunder`

**Nonmagical weapon variants:**
```
"bludgeoning, piercing, and slashing from nonmagical attacks - resistance"
"bludgeoning, piercing, and slashing from nonmagical attacks that aren't silvered - resistance"
"bludgeoning, piercing, and slashing from nonmagical attacks that aren't adamantine - resistance"
```

### Condition Immunities

Optional array.

```json
"conditionImmunities": ["charmed", "poisoned", "frightened"]
```

Valid values: `"blinded"`, `"charmed"`, `"deafened"`, `"exhaustion"`, `"frightened"`, `"grappled"`, `"incapacitated"`, `"invisible"`, `"paralyzed"`, `"petrified"`, `"poisoned"`, `"prone"`, `"restrained"`, `"stunned"`, `"unconscious"`

### Environments (Habitats)

Optional array.

```json
"environments": ["underdark", "urban"]
```

Valid values: `"any"`, `"arctic"`, `"coastal"`, `"desert"`, `"forest"`, `"grassland"`, `"hill"`, `"mountain"`, `"swamp"`, `"underdark"`, `"underwater"`, `"urban"`

### Misc Text

| Field | Required | Type | Notes |
|---|---|---|---|
| `gear` | optional | string | Items carried, e.g. `"6 Javelins, Chain Mail"` |
| `languageNote` | optional | string | Overrides the auto-generated languages line, e.g. `"Only languages it knew in life"` |

---

## Rich Text Fields

These fields accept HTML. Leave as `""` to clear the DnD Beyond placeholder text. The importer uses the TinyMCE WYSIWYG editor, so standard inline HTML tags work.

| Field | Notes |
|---|---|
| `traits` | Special traits / passive abilities |
| `actions` | Actions including Multiattack |
| `bonusActions` | Bonus actions |
| `reactions` | Reactions |
| `characteristics` | Monster description / flavour text |
| `legendaryActions` | Only used if `isLegendary: true` |
| `mythicActions` | Only used if `isMythic: true` |
| `lairDescription` | Only used if `hasLair: true` |

### HTML Formatting Guide

Use standard `<p>`, `<strong>`, `<em>`, and `<ul>`/`<li>` tags.

**Trait / action name pattern:**
```html
<p><em><strong>Trait Name.</strong></em> Description text here.</p>
```

**Bold name only (for multiattack etc.):**
```html
<p><strong>Multiattack.</strong> The creature makes two Claw attacks.</p>
```

**Attack action pattern:**
```html
<p><em><strong>Claw.</strong></em> <em>Melee Weapon Attack:</em> +6 to hit, reach 5 ft., one target. <em>Hit:</em> 9 (2d6 + 3) slashing damage.</p>
```

**Recharge ability:**
```html
<p><em><strong>Fire Breath (Recharge 5&#8211;6).</strong></em> Description here.</p>
```
Note: use `&#8211;` for the en dash in recharge ranges, or just `–` directly.

**Bullet list (for lair actions, regional effects etc.):**
```html
<ul>
  <li>First effect description.</li>
  <li>Second effect description.</li>
</ul>
```

### Legendary / Mythic / Lair Flags

```json
"isLegendary": false,
"legendaryActions": "",
"isMythic": false,
"mythicActions": "",
"hasLair": false,
"lairDescription": ""
```

Set the flag to `true` and provide the HTML content. If `false`, set the text to `""` — this clears DnD Beyond's placeholder text automatically.

---

## Sub-Page Data

These arrays are filled on separate DnD Beyond sub-pages after the main form saves. Each entry creates one record. The script walks through them one at a time, prompting you to click Save after each.

### Senses

```json
"senses": [
  { "type": "darkvision", "notes": "60 ft." },
  { "type": "blindsight", "notes": "30 ft. (blind beyond this radius)" }
]
```

| Field | Required | Values |
|---|---|---|
| `type` | **required** | `"blindsight"`, `"darkvision"`, `"tremorsense"`, `"truesight"`, `"unknown"` |
| `notes` | optional | Free text, e.g. `"60 ft."` |

### Skills

DnD Beyond auto-calculates the bonus from the monster's CR and proficiency. Leave `value` blank unless you need to hard-override the displayed number.

```json
"skills": [
  { "name": "stealth" },
  { "name": "perception" },
  { "name": "athletics", "value": "8" }
]
```

| Field | Required | Notes |
|---|---|---|
| `name` | **required** | Lowercase skill name (see below) |
| `value` | optional | Flat bonus override, e.g. `"8"` |
| `additionalBonus` | optional | Extra bonus on top of the calculated value |

**Valid skill names:** `acrobatics`, `animal handling`, `arcana`, `athletics`, `deception`, `history`, `insight`, `intimidation`, `investigation`, `medicine`, `nature`, `perception`, `performance`, `persuasion`, `religion`, `sleight of hand`, `stealth`, `survival`

### Movement

```json
"movement": [
  { "type": "walk", "speed": 30 },
  { "type": "climb", "speed": 20 },
  { "type": "fly", "speed": 60, "notes": "(hover)" }
]
```

| Field | Required | Notes |
|---|---|---|
| `type` | **required** | `"walk"`, `"burrow"`, `"climb"`, `"fly"`, `"swim"` |
| `speed` | **required** | Speed in feet as a number |
| `notes` | optional | Free text, e.g. `"(hover)"` — there is no separate hover checkbox |

### Languages

```json
"languages": [
  { "name": "common", "notes": "understands but does not speak" },
  { "name": "undercommon" }
]
```

| Field | Required | Notes |
|---|---|---|
| `name` | **required** | Language name (see below) |
| `notes` | optional | Free text qualifier, e.g. `"understands but does not speak"` |

**Common language names:** `common`, `dwarvish`, `elvish`, `giant`, `gnomish`, `goblin`, `halfling`, `orc`, `abyssal`, `celestial`, `draconic`, `deep speech`, `infernal`, `primordial`, `sylvan`, `undercommon`, `druidic`, `thieves' cant`, `aquan`, `auran`, `ignan`, `terran`, `telepathy`, `all`

Many more exotic languages are supported — use the exact name as it appears on DnD Beyond (lowercase).

---

## Lookup Tables

### Monster Types

`aberration`, `beast`, `celestial`, `construct`, `dragon`, `elemental`, `fey`, `fiend`, `giant`, `humanoid`, `monstrosity`, `ooze`, `plant`, `undead`, `unknown`

### Sizes

| JSON value | Display |
|---|---|
| `"tiny"` | Tiny |
| `"small"` | Small |
| `"medium"` | Medium |
| `"large"` | Large |
| `"huge"` | Huge |
| `"gargantuan"` | Gargantuan |

Foundry TSV shorthands `"sm"`, `"med"`, `"lg"` also accepted.

### Alignments

`"lawful good"`, `"neutral good"`, `"chaotic good"`, `"lawful neutral"`, `"neutral"`, `"chaotic neutral"`, `"lawful evil"`, `"neutral evil"`, `"chaotic evil"`, `"unaligned"`, `"any alignment"`, `"any evil alignment"`, `"any good alignment"`, `"any chaotic alignment"`, `"any non-lawful alignment"`, `"any non-good alignment"`

### Challenge Ratings

Use as a string: `"0"`, `"1/8"`, `"1/4"`, `"1/2"`, `"1"` through `"30"`

---

## Complete Example — Gutterwight

```json
{
  "name": "Gutterwight",
  "statBlockType": "5.5e",
  "monsterType": "undead",
  "size": "medium",
  "alignment": "neutral evil",
  "cr": "5",
  "ac": 17,
  "acType": "Natural Armor",
  "initiativeBonus": "",
  "passivePerception": 14,
  "hp": 102,
  "hpDieCount": 12,
  "hpDieValue": 8,
  "hpModifier": 48,
  "str": 16, "dex": 14, "con": 18, "int": 7, "wis": 12, "cha": 8,
  "savingThrows": ["con", "wis"],
  "damageAdjustments": [
    "bludgeoning - resistance",
    "slashing - resistance"
  ],
  "conditionImmunities": ["charmed", "poisoned"],
  "environments": ["underdark", "urban"],
  "gear": "",
  "languageNote": "Only languages it knew in life",
  "traits": "<p><em><strong>Filth Regeneration.</strong></em> The gutterwight regains 10 hit points at the start of its turn if it is in dim light or darkness, or touching water or sewage. If it takes acid or fire damage, this trait doesn't function until the end of its next turn.</p><p><em><strong>Grate-Creeper.</strong></em> The gutterwight can move through spaces as narrow as 4 inches without squeezing, provided they connect to a drain, grate, or pipe opening.</p>",
  "actions": "<p><strong>Multiattack.</strong> The gutterwight makes two Rake attacks.</p><p><em><strong>Rake.</strong></em> <em>Melee Weapon Attack:</em> +6 to hit, reach 5 ft., one target. <em>Hit:</em> 12 (2d8 + 3) slashing damage.</p>",
  "bonusActions": "<p><em><strong>Drain-Slip.</strong></em> If the gutterwight is within 5 feet of a drain or grate, it moves up to half its speed without provoking opportunity attacks.</p>",
  "reactions": "",
  "characteristics": "<p>A revenant-like horror of sodden rags, clotted hair, and grate-bent iron.</p>",
  "isLegendary": false,
  "legendaryActions": "",
  "isMythic": false,
  "mythicActions": "",
  "hasLair": false,
  "lairDescription": "",
  "senses": [
    { "type": "darkvision", "notes": "60 ft." }
  ],
  "skills": [
    { "name": "stealth" },
    { "name": "perception" }
  ],
  "movement": [
    { "type": "walk", "speed": 30 },
    { "type": "climb", "speed": 20 }
  ],
  "languages": [
    { "name": "common", "notes": "understands but does not speak" }
  ]
}
```

---

## Tips

- **HP formula:** `hpModifier` is typically `CON modifier × hpDieCount`. For CON 18 (+4) and 12 dice: `4 × 12 = 48`.
- **Leave rich text as `""`** for any section that doesn't apply — this clears DnD Beyond's placeholder text. Don't omit the field entirely.
- **The `languageNote` field** overrides the auto-generated languages line on the stat block. Use it for things like "understands Common but can't speak" at the stat block level rather than per-language.
- **Recharge en dashes:** Use `–` or `&#8211;` in ability names, not a hyphen. `(Recharge 5–6)` not `(Recharge 5-6)`.
- **Sub-pages are optional:** If a monster has no senses, skills, movement, or languages to add, omit those arrays or leave them empty (`[]`). The script skips empty arrays.
- **Multiple movement types** each need their own entry in the `movement` array.
