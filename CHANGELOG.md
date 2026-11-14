# Changelog

> AI/SI disclosure: drafted with Anthropic Claude. See [AI_USAGE.md](AI_USAGE.md) and [ai-usage.json](ai-usage.json).

All notable changes to this project. Gameplay numbers are fictional educational values; NASA observations are cited separately.

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
