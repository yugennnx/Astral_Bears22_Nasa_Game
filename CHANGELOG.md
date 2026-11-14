# Changelog

> AI/SI disclosure: drafted with Anthropic Claude. See [AI_USAGE.md](AI_USAGE.md) and [ai-usage.json](ai-usage.json).

All notable changes to this project. Gameplay numbers are fictional educational values; NASA observations are cited separately.

## 1.5.0 — A scene for every choice (2026-11-14)

- Before each decision, DUTİ points at the parts of the location that matter (spotlight with a short explanation, e.g. how many battery bars are left).
- After each decision, the player does the chosen job by tapping the scene: 17 hands-on activities (clean the panels, carry boxes to the shelter, turn the oxygen valve, find the rock with crystals, draw the night-temperature graph, switch grow lights, send a message and wait for the reply, lead the crew into the shelter, plant flags on the new route, harvest plants, and more).
- After DUTİ's feedback, a collectible "Did you know?" fact card appears. Each card cites a NASA page that was checked on November 14, 2026 (MOXIE, Veggie, Mars facts, Perseverance samples, signal delay, the May 2024 solar storm, MEDA temperatures). The ending shows how many cards were collected.
- New NASA sources in the scene module: MOXIE (2023), Mars facts, Perseverance rock samples.
- Game rules and resource values are unchanged; activities are presentation only.

## 1.4.0 — Immersive redesign (2026-11-14)

- Full-screen game with no page scrolling: story, choices, results and transitions open as pop-ups; tap anywhere (or press Space) to continue.
- Every sol now happens in its own location: Mars seen from space (title), landing site, power room, greenhouse, radio room, solar storm outside, and the crater rim over a real NASA panorama (PIA26373).
- New animations: scene title cards, typewriter dialog with DUTİ, cards dealt in, numbers that fly into the gauges, a sunset–night–sunrise time-lapse between sols, and location details that react to choices and resources (battery cells, oxygen tank, grow lights, cleaned panels, travelling message).
- Turkish rewritten in simple, natural language for children; "sol" is shown as "Mars günü" because "sol" also means "left" in Turkish.
- A visible "AI-assisted illustration" label stays on screen during play.

## 1.3.0 — Playable prototype (2026-11-14)

- Added the decision engine (`src/game/engine.js`), verified path-by-path against the reference model (`npm run check:engine`).
- Added the browser game (`index.html`, `src/ui/`): title, briefing, six scenes, feedback, transitions, NASA science cards, ending report, save/resume, phone and desktop layouts.
- English is the primary language; Turkish is an optional interface language (`src/i18n/`).
- DUTİ and the outpost are original SVG drawings made in code. Three NASA photographs (PIA19400, PIA26373, PIA24765) are credited in the game.
- Vendored open-source libraries: Anime.js 4.5.0 (MIT), canvas-confetti 1.9.4 (ISC), Fredoka typeface (OFL-1.1).
- Run locally with `npm start`, then open http://localhost:5173.

## 1.2.1 — Repository structure (2026-11-14)

- Grouped documentation: `docs/design/` (story plan, data contract), `docs/compliance/` (rules audit, references), `docs/changelog/` (detailed release notes).
- Renamed curated data files to kebab-case: `data/nasa-events.json`, `data/meda-jezero.json`.
- Added `package.json` (`npm run check`), `.gitattributes` (LF; `data/raw/**` kept byte-exact) and `.editorconfig`.
- Updated every path reference, the provenance inventory and README. No gameplay values, story text or data values changed.
- Follow-up from the Codex review of `e0e4e60`: fixed the remaining `story-plan.md` path in the `src/game/scenes.js` header, added `.gitignore`, `.gitattributes` and `.editorconfig` to `ai-usage.json`, and extended `tools/check_disclosures.mjs` so repository dotfiles also require file-level provenance.

## 1.2 — Compliance and AI/SI audit (`ad37f8c`)

- Added AI/SI disclosure (`AI_USAGE.md`, `ai-usage.json`, `AGENTS.md`), official 2026 rules audit and references inventory.
- Saved the unmodified DONKI API response with SHA-256; recomputed MEDA summaries with source-file hashes.
- More conservative science wording: the DONKI record and the Mars article are presented as independent examples.

## 1.2 — Real NASA data and mission profiles (`ca5b5ec`)

- Replaced the 2017 solar event with the May 2024 DONKI CME record and the Curiosity RAD finding; added a MEDA temperature card.
- Added low-power life support, three mission profiles and the next-crew readiness report. Details: [docs/changelog/v1.2.md](docs/changelog/v1.2.md).

## 1.1 — Six-scene story and scene data (`fe4703d`, `51431a5`)

- Six-scene story plan with DUTİ, JavaScript scene data, integration guide and reference checker.

## 0.1 — Initial ten-sol design (`d304c77`) — archived

- Retired design and Python simulator, kept in [archive/ten-sol-design-v0/](archive/ten-sol-design-v0/).
