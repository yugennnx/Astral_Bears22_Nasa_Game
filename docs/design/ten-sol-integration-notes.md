# Ten-Sol Integration Notes (v1.9.0)

> AI/SI disclosure: written with Anthropic Claude for the team. See [AI_USAGE.md](../../AI_USAGE.md) and [ai-usage.json](../../ai-usage.json).

**Date:** November 15, 2026 · **For:** Aydan (author of the ten-sol design) · **From:** Tuğra's side of the repository

This note explains what happened to your ten-sol design package (`c3e626f`) after it reached `main`, what is now playable, where each part of your design lives in the code, and what we changed or left out on purpose. It also lists the work done on the game itself between v1.6.0 (the commit your design was based on) and v1.9.0.

## 1. Short version

- Your design is **merged and implemented**. The game now plays **ten sols** with your Sol 1–6 framing, the Sol 6 research-review checkpoint, Sols 7–10, the Sol 8 greenhouse gate, Science target 10, the extended dust forecasts, and all four special endings.
- The engine reproduces your balance report **exactly**. `npm run check` now runs a full enumeration of the production engine (about 23,000 complete paths per profile) and compares the totals with your independent checker: standard 8064 success / 14580 partial / 192 stopped; dusty-season 6598 / 13289 / 640; small-oxygen-supply 6395 / 13309 / 97. All five witness histories in your report give the same resources, Science and ending in the engine.
- `data/ten-sol-story-design.json` is now marked `"status": "implemented-in-runtime"`. Your checker still treats it as the independent source of truth.

## 2. Where each part of your design lives

| Design item | Implemented in | Notes |
| --- | --- | --- |
| `sceneOverrides` (titles and story for Sols 1–6) | `src/game/scenes.js` | Generated from the JSON, so the prose is identical. |
| `choiceTextOverrides` (2B, 3A, 3B, 3C, 5C) | `src/game/scenes.js` | Prose only; costs, flags, variants unchanged. |
| `scenes` (Sols 7–10, 12 choices, variants) | `src/game/scenes.js` | `explorationPrompt` and `hint` are design notes, so they are not shown to players. The developer-facing transition notes are not shown either. |
| `initialFlags` | `MISSION.initialState.flags` | `signalMethod`, `capsuleMode`, `broadcastMode`, `finalAction`, `checkpointSuppliesReleased`. |
| `checkpoint` (Sol 6 reserve: +2 Energy, +4 Oxygen, once) | `MISSION.checkpoint` + `src/game/engine.js` | Released only after a surviving decision and its feedback. Low-power Oxygen loss uses the Energy **right after the decision**, before supplies and recharge (exactly as in your timing rule). The two checkpoint cards follow the study feedback. The choice preview and the morning summary include the release. |
| `requiresAnyChoice` / `unavailableReason` (8A) | `engine.js` → `disabledReason: { type: "requires" }` | The card shows your reason text and cannot be chosen. |
| `profileDustyAfterScenes` | `MISSION.profiles[].dustyAfterScenes` | Briefings now name the later dust days too. |
| `specialEndings` + `endingResolution` | `SPECIAL_ENDINGS` in `scenes.js`, `specialEndingFor()` in `engine.js` | Only after a successful Sol 10. History must be complete and ordered (one valid choice per sol). Lowest `priority` wins. Endings grant nothing. |
| `fallbackEndings` | `ENDINGS` in `scenes.js` | The sentences that were instructions for developers ("Show the actual …") were removed from the player text. The interface shows the real shortfall instead. |
| Science target 10, success requirements | `MISSION.scienceTarget`, `MISSION.successRequirements` | |
| Save version (handoff step 1) | `src/ui/app.js` | New save key `compass-outpost-save-v3`. Old six-sol saves are ignored, never reinterpreted. |
| Ending journal (handoff "Ending presentation") | `src/ui/app.js` | The Mars Journal lists only endings already found. Titles, recipes and the total count stay hidden. One "Another story might be waiting…" invitation. |
| Living tray line | `MISSION.nextCrewReport.livingTray` | Shown in the next-crew report only when 8A actually happened. |

### Interface for Sols 7–10

Your design did not include art, so the new sols reuse existing locations with new spotlights, discoveries and tasks:

| Sol | Location | DUTİ spotlights | Discoveries (kind) | Tasks (choice → activity) |
| --- | --- | --- | --- | --- |
| 7 The Three-Note Mystery | Radio room | the signal screen, the rover | wave line (outpost), dish (outpost), "a pattern is a clue" (science) | 7A tick the three notes · 7B drive the rover to signal spots · 7C oxygen valve |
| 8 The Drawer Marked Tomorrow | Power room | the TOMORROW drawer, the battery | drawer label, saved energy (science), crew notes | 8A switch on the tray lights · 8B restore three pictures · 8C open the cassette |
| 9 Two Stories, One Signal | Landing site | the crew, the rover | log camera, rover memory, "two explanations" (science) | 9A compare three clues · 9B record three voices · 9C oxygen valve |
| 10 A Light for Who Comes Next | Crater rim | transmission desk, handover shelf | last evening, packed records, welcome note | 10A send to Earth · 10B carry boxes into the capsule · 10C write the welcome message |

All new props are labelled as **our outpost** (story world) or general science. No new NASA claim was added. Your note that no new factual NASA card is supplied was respected: Sols 7–10 reuse existing, already-sourced fact cards, and a card is never repeated within one mission.

## 3. Decisions that differ from the handoff (please review)

1. **No forecast and no "Later" text on choice cards.** Your handoff asks to show the resolved next-night forecast before every choice. In v1.8.0 the team decided (after a play test) to hide "Later" consequences and the night forecast to keep curiosity. The cards still show the cost now, and a **red warning** whenever a choice would stop the mission (immediately or tonight, including the Sol 6 supplies in that calculation). The full forecast is still on the briefing screen.
2. **No prediction question on the Sol 6 night.** The reserve release makes the "up / same / down" question confusing for children. The morning summary shows the reserve as its own line instead.
3. **Locations are reused** for Sols 7–10 (see the table). New art can replace them later without touching the rules.
4. **Developer notes are not shown** to players: `explorationPrompt`, `hint`, the transition notes of Sols 6–9, and the instruction sentences in `fallbackEndings`.

## 4. How the checks work now

| Command | What it checks |
| --- | --- |
| `npm run check:story` | All 10 scenes and 29 choices (structure, flags, sources). It still enumerates **Chapter One** (Sols 1–6 with the old six-sol target) as a regression check for the first half: 103 / 219 / 41 in the standard profile, as before. |
| `npm run check:engine` | Plays **every** path through the production engine for ten sols, compares totals with the reference model, checks the witness histories and their special endings, the Sol 6 checkpoint, the 8A gate, previews vs applied effects. |
| `npm run check:expansion` | Your independent ten-sol model. It now rebuilds Sols 1–6 from the base mechanics plus the JSON overrides (not from the engine) and requires that the runtime scene order and forecasts match the JSON. |
| `npm run check:i18n` | Every English story and interface string has Turkish text (the game's optional language). |
| `npm run check:disclosures` | File-level AI/SI provenance. |

## 5. Work done on the game between your base (v1.6.0) and v1.9.0

- **1.7.0 — Sound and kinder endings:** sound synthesised in code (Web Audio, no audio files) with a mute switch; red "Careful, Commander!" warning on mission-stopping choices; a failed mission shows "What happened" and "Ideas for next time"; prediction questions depend on the night; no celebration after risky or sad choices; Sol 5 storm effects, and the crew and robot take cover according to the choice.
- **1.8.0 — Easier to explore:** Space / Enter / click anywhere advances the story; discoveries have visible rings and star badges and were moved onto their drawings; slim explore panel; fact cards are kept in the Mars Journal and never repeat within a mission; low activity targets moved up.
- **1.9.0 — Ten sols:** your design, as described above.

The full list is in [CHANGELOG.md](../../CHANGELOG.md).

## 6. Browser checks done for 1.9.0

Automated browser runs (not a child play test):

- 1280 x 720, English, standard profile, path 1A 2B 3A 4C 5A 6A 7A 8A 9A 10A: ten sol markers, nine forecast days, Sol 6 checkpoint cards after the study feedback, the reserve line in the morning summary (Energy 3 → 6, Oxygen 3 → 6 for Sol 7), no prediction on the Sol 6 night, Sols 7–9 locations, spotlights, discoveries and tasks without raw text keys, and the ending "The Stone That Kept Time" with Energy 4 / Oxygen 3 / Safety 8 / Science 11, story, evidence and replay hint.
- Turkish: the same ending, its story and replay hint are translated. The Mars Journal lists the found ending and one "another story" invitation.
- Sol 8 after 3C: the 8A card is locked and shows the Turkish reason; it cannot be selected.
- 375 x 812: the top bar fits (sol dots, buttons inside 375 px), no horizontal scrolling.
- No game errors in the console.

Not yet run in the browser: a complete Turkish game from Sol 1 to Sol 10, and every one of the four special endings (all four are verified by the engine check).

## 7. Still open

- New artwork for Sols 7–10 (they reuse four locations).
- A human play test with children of the target age, in English and Turkish. Our automated browser checks are not a substitute.
- The team's license decision, the 30-second English demo, and the official submission form.
