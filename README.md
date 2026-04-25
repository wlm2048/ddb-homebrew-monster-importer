# DnD Beyond Homebrew Monster Importer

A Tampermonkey userscript that fills the DnD Beyond homebrew monster form from a JSON file, including all sub-pages (Senses, Skills, Movement, Languages).

Tested with DnD Beyond's 2024 form layout (5.5e stat blocks).

---

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser.
2. Open Tampermonkey → **Create a new script**.
3. Paste the full contents of [`bcn-importer.user.js`](bcn-importer.user.js) and save.

The script activates automatically on any DnD Beyond homebrew monster create or edit page.

---

## Usage

1. Go to **DnD Beyond → Homebrew → Create Monster** (or open an existing monster for editing).
2. Click the **⬇ Import JSON** button (fixed bottom-right of the page).
3. Paste your monster JSON into the modal. Use **Load Sample (Gutterwight)** to see a working example.
4. Click **Fill & Continue** (create page) or **Import & Save All** (edit page).
5. Follow the on-screen prompts — the script will ask you to click Save at each step to avoid DnD Beyond's anti-automation redirect.

### Create page vs Edit page

| Mode | Page | What it does |
|---|---|---|
| Fill & Continue | Create | Fills the main form, saves payload, you click Save — script continues to sub-pages after redirect |
| Import & Save All | Edit | Fills main form + auto-navigates through Senses → Skills → Movement → Languages |
| Fill Form Only | Edit | Fills the main form only, no navigation |

---

## JSON Format

See [JSON_Reference.md](JSON_Reference.md) for the full field reference, valid enum values, and HTML formatting guide for rich text fields.

A working example is in [`fixtures/monsters/gutterwight.json`](fixtures/monsters/gutterwight.json) — a CR 5 undead with traits, a recharge action, and all sub-page data.

---

## Generating Monsters with AI

You can use ChatGPT, Claude, or any AI assistant to generate import-ready JSON. Copy the prompt below, paste it into your AI of choice, then append your monster description at the end.

<details>
<summary>📋 Copy AI Generation Prompt</summary>

```
You are a D&D 5e (2024 rules) monster designer. Create a complete homebrew monster stat block formatted as a single JSON object for the DnD Beyond Monster Importer script.

## JSON Schema Rules

Use ONLY these top-level fields (no others):
name, statBlockType, monsterType, size, alignment, cr, ac, acType, initiativeBonus,
passivePerception, hp, hpDieCount, hpDieValue, hpModifier, str, dex, con, int, wis, cha,
savingThrows, damageAdjustments, conditionImmunities, environments, gear, languageNote,
traits, actions, bonusActions, reactions, characteristics,
isLegendary, legendaryActions, isMythic, mythicActions, hasLair, lairDescription,
senses, skills, movement, languages

### Enum constraints — use ONLY values from these lists

monsterType: aberration, beast, celestial, construct, dragon, elemental, fey, fiend,
  giant, humanoid, monstrosity, ooze, plant, undead, unknown

size: tiny, small, medium, large, huge, gargantuan

alignment (pick one, exact string): "lawful good", "neutral good", "chaotic good",
  "lawful neutral", "neutral", "chaotic neutral", "lawful evil", "neutral evil",
  "chaotic evil", "unaligned", "any alignment", "any evil alignment",
  "any non-good alignment", "any chaotic alignment", "any non-lawful alignment"

cr: string — "0", "1/8", "1/4", "1/2", or "1" through "30"

savingThrows: array of zero or more of: "str", "dex", "con", "int", "wis", "cha"

damageAdjustments: each entry uses format "[damage type] - [adjustment type]"
  damage types: bludgeoning, piercing, slashing, acid, cold, fire, force, lightning,
    necrotic, poison, psychic, radiant, thunder
  special form: "bludgeoning, piercing, and slashing from nonmagical attacks - resistance"
  adjustment types: resistance, immunity, vulnerability

conditionImmunities: zero or more of: "blinded", "charmed", "deafened", "exhaustion",
  "frightened", "grappled", "incapacitated", "invisible", "paralyzed", "petrified",
  "poisoned", "prone", "restrained", "stunned", "unconscious"

environments: zero or more of: "any", "arctic", "coastal", "desert", "forest",
  "grassland", "hill", "mountain", "swamp", "underdark", "underwater", "urban"

### Hit point maths

hpModifier = CON modifier × hpDieCount  (CON modifier = floor((con - 10) / 2))
hp = floor((hpDieValue / 2 + 0.5) × hpDieCount) + hpModifier  (i.e. average roll + modifier)
hpDieValue must be one of: 4, 6, 8, 10, 12, 20
Typical die size by size: Tiny=4, Small=6, Medium=8, Large=10, Huge=12, Gargantuan=20
Verify the maths before outputting.

### Rich text fields (traits, actions, bonusActions, reactions, characteristics,
### legendaryActions, mythicActions, lairDescription)

These MUST be HTML strings. Use these exact patterns:

Named trait or ability:
  <p><em><strong>Ability Name.</strong></em> Description text.</p>

Multiattack (bold name only, no italic):
  <p><strong>Multiattack.</strong> The creature makes X attacks.</p>

Attack action:
  <p><em><strong>Attack Name.</strong></em> <em>Melee Weapon Attack:</em> +X to hit,
  reach Y ft., one target. <em>Hit:</em> N (XdY + Z) [damage type] damage.</p>

Ranged attack:
  <p><em><strong>Attack Name.</strong></em> <em>Ranged Spell Attack:</em> +X to hit,
  range Y ft., one target. <em>Hit:</em> N (XdY + Z) [damage type] damage.</p>

Recharge ability — use &#8211; for the en dash:
  <p><em><strong>Ability Name (Recharge 5&#8211;6).</strong></em> Description.</p>

Saving throw ability:
  <p><em><strong>Ability Name.</strong></em> Each creature within X ft. must make a
  DC Y [Ability] saving throw, taking N (XdY) [type] damage on a failed save,
  or half as much on a successful one.</p>

Innate spellcasting trait — list each spell on its own line using <br>:
  <p><em><strong>Spellcasting.</strong></em> The [creature] casts one of the following
  spells, requiring no material components, using [Ability] as the spellcasting ability
  (spell save DC X, +Y to hit with spell attacks):<br>
  At will: [spell], [spell]<br>
  3/day each: [spell], [spell]<br>
  1/day each: [spell], [spell]</p>

Lair actions — preamble paragraph followed by a bullet list:
  <p>On initiative count 20 (losing initiative ties), the [name] takes one of the
  following lair actions:</p><ul><li>First lair action effect.</li>
  <li>Second lair action effect.</li></ul>

Legendary actions — preamble paragraph followed by individual action entries:
  <p>The [name] can take X legendary actions, choosing from the options below...</p>
  <p><em><strong>Action Name.</strong></em> Description.</p>

If isLegendary, isMythic, or hasLair is false, set the matching text field to "".

### Passive Perception

passivePerception = 10 + WIS modifier + (proficiency bonus if Perception is a trained skill)
Proficiency bonus by CR: CR 0–4 = +2, CR 5–8 = +3, CR 9–12 = +4, CR 13–16 = +5,
  CR 17–20 = +6, CR 21–24 = +7, CR 25–28 = +8, CR 29–30 = +9

### Sub-page arrays

senses:    [{ "type": "darkvision|blindsight|tremorsense|truesight|unknown", "notes": "60 ft." }]
skills:    [{ "name": "perception" }]  — lowercase skill name, omit "value" unless overriding
movement:  [{ "type": "walk|burrow|climb|fly|swim", "speed": 30 }]
languages: [{ "name": "common", "notes": "optional qualifier" }]  — lowercase

Valid skill names: acrobatics, animal handling, arcana, athletics, deception, history,
  insight, intimidation, investigation, medicine, nature, perception, performance,
  persuasion, religion, sleight of hand, stealth, survival

Common language names: common, elvish, dwarvish, giant, gnomish, goblin, halfling, orc,
  abyssal, celestial, draconic, deep speech, infernal, primordial, sylvan, undercommon,
  telepathy, all

## Output rules

- Output ONLY the raw JSON object — no markdown code fences, no prose, no commentary.
- statBlockType must be "5.5e".
- Do not invent field names not listed above.
- All string values must be valid JSON (escape any quotes inside strings with \").
- Use spaces in damage dice expressions: "2d8 + 4" not "2d8+4".
- Damage output per round should be balanced for the CR using the 2024 Monster Manual benchmarks.
- Write characteristics (flavour text) in 2–3 sentences, present tense, third person.
- Verify HP maths before outputting.

## Monster to create
```

</details>

**Example request** (append after the prompt above):

```
Create a CR 10 Aberration that has a high intelligence and can innately cast several mind control type spells. Add 2 lair actions that are appropriate for subterranean environments.
```

---

## Validating JSON

### VS Code
wires up automatically for any file in `fixtures/monsters/` or `my-fixtures/monsters/`. You'll see inline errors and autocomplete with no setup needed.

### Storing your own monsters locally

Create a `my-fixtures/monsters/` directory at the repo root to store monsters you don't want to commit (campaign creatures, works in progress, etc.). It is listed in `.gitignore` so it will never be pushed to GitHub. The schema applies there automatically in VS Code.

```bash
mkdir my-fixtures\monsters
```

To validate any other file, add this line at the top of your JSON:
```json
{ "$schema": "./monster.schema.json", ... }
```

### Command line (Node.js, no install required)
```bash
node -e "
const schema  = JSON.parse(require('fs').readFileSync('monster.schema.json', 'utf8'));
const monster = JSON.parse(require('fs').readFileSync('your-monster.json',   'utf8'));
const required = schema.required.filter(k => !(k in monster));
if (required.length) { console.error('Missing required fields:', required); process.exit(1); }
console.log('Required fields: OK');
const checks = [
  ['monsterType', schema.properties.monsterType.enum],
  ['size',        schema.properties.size.enum],
  ['cr',          schema.properties.cr.enum],
];
let ok = true;
for (const [field, valid] of checks) {
  if (monster[field] !== undefined && !valid.includes(monster[field]))
    { console.error(field + ': invalid value', JSON.stringify(monster[field])); ok = false; }
}
if (ok) console.log('All checked fields valid.');
"
```

### With ajv-cli (full schema validation)
```bash
npm install -g ajv-cli
ajv validate -s monster.schema.json -d your-monster.json
```

### Online
Paste the contents of `monster.schema.json` and your monster JSON into **[jsonschemavalidator.net](https://www.jsonschemavalidator.net/)**.

---

## Development

The deployed file (`bcn-importer.user.js`) is generated from the `src/` directory. Edit source files there, then rebuild:

```bash
node build.js
# or
npm run build
```

Source files in order:

| File | Contents |
|---|---|
| `src/header.js` | UserScript metadata block + IIFE opener |
| `src/constants.js` | SELECT OPTION VALUE MAPS (monster types, sizes, languages, etc.) |
| `src/utils.js` | DOM helpers, TinyMCE/Select2 shims, banner/prompt UI |
| `src/session.js` | sessionStorage state machine for cross-page navigation |
| `src/fill-main.js` | Main form filler |
| `src/fill-subpages.js` | Sub-page fillers (Senses, Skills, Movement, Languages) |
| `src/orchestration.js` | Sub-page loop + `startImport()` entry point |
| `src/sample.js` | `buildSampleJson()` — loads Gutterwight example into modal |
| `src/modal.js` | Import modal + floating button |
| `src/boot.js` | `boot()` + IIFE close |

See [ROADMAP.md](ROADMAP.md) for feature status and known issues.

---

## License

MIT
