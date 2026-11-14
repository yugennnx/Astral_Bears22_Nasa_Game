# Compass Outpost: Six Sols on Mars

An English narrative decision game for ages 7–12, developed for the 2026 NASA Space Apps challenge [Build a Junior Astronaut Mission Trainer](https://www.spaceappschallenge.org/2026/challenges/junior-astronaut-mission-trainer/?tab=details).

Players manage Energy, Oxygen, and Safety alongside companion robot **DUTİ**, aiming to earn at least 6 Science Points over six sols. Decisions have resource or opportunity costs and can change later options.

## AI/SI Attribution

This repository contains AI-assisted text, code, translations, and documentation produced with **OpenAI ChatGPT/Codex and Anthropic Claude**. The team attests that it determined the underlying game idea before using AI. Substantial generated implementation/story details remain explicitly attributed.

- [AI_USAGE.md](AI_USAGE.md): tools, contribution history, selected prompt summaries, team attestation, and a submission-form draft.
- [ai-usage.json](ai-usage.json): machine-readable file-level provenance.
- [docs/compliance/compliance-audit.md](docs/compliance/compliance-audit.md): verified requirements, corrections, and outstanding submission tasks.
- [docs/compliance/references.md](docs/compliance/references.md): data, tools, sources, and licensing status.

The eventual interface must retain the source cards and show the supplied credits/about information. A repository disclosure does not complete the official submission form.

## Current Implementation

The repository contains a scene-data module, curated NASA-data summaries, design documents, and reference validation tools. The production decision engine, playable frontend, deployed game, and submission demo are not yet implemented here.

**Active ruleset:** [docs/design/story-plan.md](docs/design/story-plan.md) and [src/game/scenes.js](src/game/scenes.js), including the v1.2 mission profiles and low-power life-support rule.

## Repository Structure

```text
.
├── src/game/scenes.js            # Scene data, rules, NASA source cards, credits metadata
├── data/
│   ├── nasa-events.json          # Curated DONKI CME record + attributed NASA Mars finding
│   ├── meda-jezero.json          # Perseverance MEDA temperature summaries (with source hashes)
│   ├── source-audit.json         # Source verification receipts
│   └── raw/                      # Unmodified NASA API responses (byte-exact, hashed)
├── docs/
│   ├── design/                   # story-plan.md, story-data-contract.md
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
| [docs/design/story-plan.md](docs/design/story-plan.md) | Six-scene story, dialogue, choices, costs, and delayed consequences |
| [src/game/scenes.js](src/game/scenes.js) | English scene data, conditional choices, credits metadata, and NASA source cards |
| [docs/design/story-data-contract.md](docs/design/story-data-contract.md) | Shared data contract and frontend/engine handoff |
| [data/nasa-events.json](data/nasa-events.json) | Curated DONKI record and a separately attributed NASA Mars observation |
| [data/meda-jezero.json](data/meda-jezero.json) | Recomputed MEDA sensor-temperature summaries with source-file hashes |
| [data/source-audit.json](data/source-audit.json) | Source audit receipts and precise verification method |
| [tools/check_story_data.mjs](tools/check_story_data.mjs) | Scene and mission-profile reference checks |
| [tools/check_disclosures.mjs](tools/check_disclosures.mjs) | AI/SI metadata and attribution checks |
| [tools/verify_nasa_sources.py](tools/verify_nasa_sources.py) | Optional online recheck of the cited original data |
| [CHANGELOG.md](CHANGELOG.md) · [docs/changelog/v1.2.md](docs/changelog/v1.2.md) | Version history and the detailed v1.2 report |
| [archive/ten-sol-design-v0/](archive/ten-sol-design-v0/) | Retired design history; excluded from the active gameplay rules |

## Local Checks

Requires Node.js 20 or newer. From the repository root:

```sh
npm run check
```

This runs `node tools/check_story_data.mjs` and `node tools/check_disclosures.mjs`. Optional primary-source verification with Python and network access:

```sh
npm run verify:sources
```

This is a data/reference-model check, not a browser playtest or NASA eligibility approval.

## Data and Rights

DONKI is listed in the challenge's NASA resources. MEDA data are provided through NASA's Planetary Data System. The scene module links these references to science cards; the frontend must still demonstrate their actual use. Curated summaries are archival, not live, and all gameplay coefficients are fictional educational values. The DONKI record is not a Mars surface-dose measurement or a confirmed match to the separately reported Mars event.

**License decision deferred by the team on November 14, 2026.** No project-wide license has been selected or added. Do not describe this repository as Apache-2.0-licensed. The competition's licensing requirements and NASA's default distribution provision are documented in [docs/compliance/references.md](docs/compliance/references.md); final rights/license review remains outstanding.

This is an independent participant project. NASA data citations do not imply NASA endorsement or permission to use NASA branding.
