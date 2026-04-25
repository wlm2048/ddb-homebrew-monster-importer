# DnD Beyond Homebrew Monster Importer — Roadmap
> Last updated: April 2026
> Current version: 2.0.0

---

## Status

### Phase 1 — JSON → Form Fill ✅ Complete

- [x] Confirm all DnD Beyond form field IDs from live HTML
- [x] Build main form filler (stats, ability scores, rich text, checkboxes)
- [x] Build sub-page chain (Senses, Skills, Movement, Languages)
- [x] Handle TinyMCE init timing
- [x] Handle jQuery/Select2 widgets
- [x] Anti-automation save-click guard (user clicks Save, script resumes on redirect)
- [x] sessionStorage state machine to survive page navigations
- [x] "Fill Form Only" and "Import & Save All" modes
- [x] "Load Sample" button in modal
- [x] Test end-to-end with Gutterwight — imports 100% correctly ✅
- [x] Write JSON schema reference (`README.md`)
- [x] Add tested fixture (`fixtures/gutterwight.json`)

### Phase 2 — Export from DnD Beyond ⬜ Not started

- [ ] Identify which fields are readable from the edit page DOM
- [ ] Build export function that produces a JSON blob matching the Phase 1 schema
- [ ] Add "Export JSON" button to the edit page modal
- [ ] Test round-trip: export Gutterwight → re-import → verify no data loss

### Phase 3 — Quality of Life ⬜ Not started

- [ ] Validate JSON against schema before attempting fill, surface friendly errors
- [ ] Warn on unknown lookup values (damage types, languages, etc.) before filling
- [ ] Add a "dry run" mode that logs what would be set without touching the DOM
- [x] Split the single-file script into a `src/` tree with a Node.js build step (`node build.js` / `npm run build`)
- [ ] Periodically audit SELECT OPTION VALUE MAPS in `src/constants.js` against live DnD Beyond HTML — use `dumpFormFields()` in the browser console to re-confirm numeric option values for monster types, sizes, damage adjustments, languages, etc.

---

## Known Issues

- **`initiativeBonus` field:** leaving blank correctly defers to DEX mod, but the field still renders as empty on the DnD Beyond form rather than showing the calculated value — cosmetic only, saves and displays correctly.
- **Languages sub-page:** requires the entity ID from the edit page link. If the monster was just created (no edit page visit yet), the language queue stalls with a clear error message. Workaround: save the monster once manually, then re-run import.
- **TinyMCE fallback:** if TinyMCE fails to initialise within 5 seconds the script writes directly to the textarea. Rich text still saves but live preview in the editor may be blank until page reload.

---

## Example Fixture

`fixtures/gutterwight.json` — a CR 5 undead with traits, recharge action, sub-page data (senses, skills, movement, languages). Use as a reference when building your own JSON.