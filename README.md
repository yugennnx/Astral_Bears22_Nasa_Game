# Compass Outpost: Ten Sols of Questions

An English narrative decision game for ages 7–12, developed for the 2026 NASA Space Apps challenge [Build a Junior Astronaut Mission Trainer](https://www.spaceappschallenge.org/2026/challenges/junior-astronaut-mission-trainer/?tab=details).

Players manage Energy, Oxygen, and Safety alongside companion robot **DUTİ**, aiming to earn at least 10 Science Points over ten sols. Decisions have resource or opportunity costs and can change later options.

**Fifth-ending story design:** [The Visitors Beyond the Window](docs/design/ten-sol-story-plan.md#planned-fifth-ending-the-visitors-beyond-the-window) supplies the explicitly fictional ending, clues, unlock contract and numerical witnesses implemented in v1.11.0. Version 1.11.1 fixes activity layout and live translations; see [the browser verification report](docs/design/ui-regression-1.11.1.md).

## AI/SI Attribution

This repository contains AI-assisted text, code, translations, and documentation produced with **OpenAI ChatGPT/Codex and Anthropic Claude**. The team attests that it determined the underlying game idea before using AI. Substantial generated implementation/story details remain explicitly attributed.

- [AI_USAGE.md](AI_USAGE.md): tools, contribution history, selected prompt summaries, team attestation, and a submission-form draft.
- [ai-usage.json](ai-usage.json): machine-readable file-level provenance.
- [docs/compliance/compliance-audit.md](docs/compliance/compliance-audit.md): verified requirements, corrections, and outstanding submission tasks.
- [docs/compliance/references.md](docs/compliance/references.md): data, tools, sources, and licensing status.

The eventual interface must retain the source cards and show the supplied credits/about information. A repository disclosure does not complete the official submission form.

## Current Implementation

The repository contains a **playable browser prototype**: a decision engine, a responsive interface (phone and desktop), ten sols with DUTİ, NASA science cards, an ending report with five hidden special endings, and save/resume. English is the primary language; Turkish is an optional interface language chosen by the team. A public deployment link and the submission demo are still to be added, and no playtest with children has been run yet.

## Play Locally

Requires Python 3 (any static file server works). From the repository root:

```sh
npm start
```

Then open <http://localhost:5173>. The game has no build step and no runtime network requests: libraries, fonts, and photographs are stored in `assets/`.

**Active ruleset (ten sols, v1.9.0):** [src/game/scenes.js](src/game/scenes.js) and [src/game/engine.js](src/game/engine.js), with the ten-sol design in [data/ten-sol-story-design.json](data/ten-sol-story-design.json) and [docs/design/ten-sol-story-plan.md](docs/design/ten-sol-story-plan.md). Integration details are in [docs/design/ten-sol-integration-notes.md](docs/design/ten-sol-integration-notes.md). Chapter One (Sols 1–6) is described in [docs/design/story-plan.md](docs/design/story-plan.md), including the v1.2 mission profiles and low-power life-support rule.

**Ten-sol edition:** the [English story and four discoverable endings](docs/design/ten-sol-story-plan.md), the [implementation handoff](docs/design/ten-sol-implementation-handoff.md), the [machine-readable design](data/ten-sol-story-design.json) and the [balance report with full example paths](docs/design/ten-sol-balance-report.md) are implemented in the playable game (version 1.9.0). Run `npm run check:expansion` for the independent design model and `npm run check:engine` for the production-engine comparison.

## Repository Structure

```text
.
├── index.html                    # Game entry point (no build step)
├── src/game/scenes.js            # Scene data, rules, NASA source cards, credits metadata
├── src/game/engine.js            # Decision engine (pure functions)
├── src/ui/                       # Interface, SVG artwork drawn in code, styles
├── src/i18n/                     # English interface strings and optional Turkish translation
├── assets/                       # NASA photographs, vendored libraries, typeface
├── data/
│   ├── nasa-events.json          # Curated DONKI CME record + attributed NASA Mars finding
│   ├── meda-jezero.json          # Perseverance MEDA temperature summaries (with source hashes)
│   ├── source-audit.json         # Source verification receipts
│   └── raw/                      # Unmodified NASA API responses (byte-exact, hashed)
├── docs/
│   ├── design/                   # story-plan.md, story-data-contract.md, ten-sol-*.md
│   ├── compliance/               # compliance-audit.md, references.md
│   └── changelog/                # Detailed release notes
├── tools/                        # Reference checks and source verification
├── archive/ten-sol-design-v0/    # Retired design history (not active rules)
├── AI_USAGE.md · ai-usage.json   # AI/SI disclosure and file-level provenance
├── AGENTS.md                     # Contributor and AI-assistant instructions
└── CHANGELOG.md
```

| File | Purpose |
| --- | --- |
| [docs/design/story-plan.md](docs/design/story-plan.md) | Chapter One story (Sols 1–6): dialogue, choices, costs, and delayed consequences |
| [src/game/scenes.js](src/game/scenes.js) | English scene data, conditional choices, credits metadata, and NASA source cards |
| [docs/design/story-data-contract.md](docs/design/story-data-contract.md) | Shared data contract and frontend/engine handoff |
| [data/nasa-events.json](data/nasa-events.json) | Curated DONKI record and a separately attributed NASA Mars observation |
| [data/meda-jezero.json](data/meda-jezero.json) | Recomputed MEDA sensor-temperature summaries with source-file hashes |
| [data/source-audit.json](data/source-audit.json) | Source audit receipts and precise verification method |
| [src/game/engine.js](src/game/engine.js) | Decision engine used by the game; pure functions over a JSON state |
| [src/ui/app.js](src/ui/app.js) · [src/ui/art.js](src/ui/art.js) | Interface screens and AI-assisted SVG illustrations drawn in code |
| [src/i18n/](src/i18n/) | Interface strings (English) and the optional Turkish translation |
| [tools/check_story_data.mjs](tools/check_story_data.mjs) | Scene and mission-profile reference checks |
| [tools/check_engine.mjs](tools/check_engine.mjs) | Plays every path through the engine and compares it with the reference model |
| [tools/check_i18n.mjs](tools/check_i18n.mjs) | Turkish translation coverage and placeholder checks |
| [tools/check_disclosures.mjs](tools/check_disclosures.mjs) | AI/SI metadata and attribution checks |
| [tools/verify_nasa_sources.py](tools/verify_nasa_sources.py) | Optional online recheck of the cited original data |
| [CHANGELOG.md](CHANGELOG.md) · [docs/changelog/v1.2.md](docs/changelog/v1.2.md) | Version history and the detailed v1.2 report |
| [archive/ten-sol-design-v0/](archive/ten-sol-design-v0/) | Retired design history; excluded from the active gameplay rules |

## Local Checks

Requires Node.js 20 or newer. From the repository root:

```sh
npm run check
```

This runs the current story, engine, translation and disclosure checks, plus the independent ten-sol design enumeration and the production-engine comparison for all ten sols. Optional primary-source verification with Python and network access:

```sh
npm run verify:sources
```

These are data, rule and metadata checks. The interface was exercised manually in a desktop and a phone-sized browser viewport; this is not a child playtest or NASA eligibility approval.

## Data and Rights

DONKI is listed in the challenge's NASA resources. MEDA data are provided through NASA's Planetary Data System. The scene module links these references to science cards; the frontend must still demonstrate their actual use. Curated summaries are archival, not live, and all gameplay coefficients are fictional educational values. The DONKI record is not a Mars surface-dose measurement or a confirmed match to the separately reported Mars event.

**License decision deferred by the team on November 14, 2026.** No project-wide license has been selected or added. Do not describe this repository as Apache-2.0-licensed. The competition's licensing requirements and NASA's default distribution provision are documented in [docs/compliance/references.md](docs/compliance/references.md); final rights/license review remains outstanding.

This is an independent participant project. NASA data citations do not imply NASA endorsement or permission to use NASA branding.
