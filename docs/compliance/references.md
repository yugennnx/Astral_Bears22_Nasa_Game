# References, Provenance, and Rights Status

> AI/SI disclosure: this inventory was drafted with OpenAI ChatGPT/Codex. Earlier curated data and v1.2 contributions used Anthropic Claude, as confirmed by the team. See [AI_USAGE.md](../../AI_USAGE.md) and [ai-usage.json](../../ai-usage.json).

## Competition Rules

Only the official 2026 Space Apps website pages listed in [compliance-audit.md](compliance-audit.md) establish competition requirements for this project. The sources below serve scientific attribution and tool-credit purposes, not alternative competition rules.

## Scientific Sources Actually Referenced

| Source | Local Record / Use | Qualification |
| --- | --- | --- |
| [NASA DONKI](https://ccmc.gsfc.nasa.gov/tools/DONKI/) and [CME record 2024-05-20T05:36:00-CME-001](https://ccmc.gsfc.nasa.gov/DONKI/view/CME/31034/-1) | `data/nasa-events.json`, unmodified `data/raw/donki-cme-2024-05-20.json`; Scene 5 archival science card | Near-Sun CME analyses, not measured Mars dose. No confirmed match to the independently reported Mars event. DONKI is listed on the challenge's Resources tab. |
| [NASA — May 2024 Mars solar-storm observations](https://www.nasa.gov/missions/mars-science-laboratory/curiosity-rover/nasa-watches-mars-light-up-during-epic-solar-storm/) | Attributed findings in `data/nasa-events.json`; Scene 5 science card | The 8,100-microgray figure comes from this article. It is not converted to the game's Safety score. |
| [NASA PDS MEDA catalogue](https://pds.nasa.gov/ds-view/pds/viewBundle.jsp?identifier=urn:nasa:pds:mars2020_meda) and [official PDS Atmospheres Node MEDA archive](https://pds-atmospheres.nmsu.edu/data_and_services/atmospheres_data/PERSEVERANCE/meda.html) | `data/meda-jezero.json`; Scene 2 science card | Source CSV URLs and hashes are recorded. Simple sensor sample extrema are not a global climate description, dust measurement, or fully quality-filtered derived product. |
| [NASA — Speaking Percy's Language](https://science.nasa.gov/blog/speaking-percys-language-how-to-talk-so-perseverance-will-listen/) | Scene 4 communication explanation | The story's one-way 20-minute delay is a scenario value; actual delay varies. |
| [NASA — Growing Plants in Space](https://www.nasa.gov/exploration-research-and-technology/growing-plants-in-space/) | Scene 3 educational card | The fictional Mars greenhouse is not NASA's existing space-station facility. Plants are already growing before the mission. |

| [NASA — MOXIE completes Mars mission](https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/) (September 6, 2023) | Fact cards after choices 2A and 4C | 122 g of oxygen in total, about what a small dog breathes in 10 hours; best rate 12 g per hour. |
| [NASA — Mars: Facts](https://science.nasa.gov/mars/facts/) | Fact cards after choices 1A, 3C and 6B | Dusty, cold desert world; thin atmosphere mostly of carbon dioxide, nitrogen and argon; as cold as about −153 °C; a sol lasts about 24.6 hours. |
| [NASA — Mars Rock Samples](https://science.nasa.gov/mission/mars-2020-perseverance/mars-rock-samples/) | Fact cards after choices 2B and 6A | 43 tubes brought to Mars, 38 for samples; samples collected for potential future return. |

| [NASA — Sunset in Mars' Gale Crater](https://science.nasa.gov/resource/sunset-in-mars-gale-crater/) | Exploration discovery on the crater rim | Fine dust lets blue light glow near the Sun at sunset (Curiosity, Sol 956). |

Exploration discoveries (`src/ui/discoveries.js`) reuse "Mars: Facts" (two moons Phobos and Deimos, red colour from rusting iron, Olympus Mons, dust storms, thin carbon-dioxide air, no global magnetic field, about 1.5 AU from the Sun, hazy reddish daytime sky), MOXIE, Veggie, Perseverance samples, the signal-delay blog, the DONKI record and the May 2024 storm article. Items about the fictional outpost are labelled "Our outpost" in the journal; general science items (photosynthesis, light speed, Earth's Moon) carry no source.

Fact cards also reuse the DONKI/Mars-storm article, MEDA data, "Growing Plants in Space" and "Speaking Percy's Language" listed above. All fact cards were checked against their pages on November 14, 2026; claims that could not be verified were not used.

MEDA citation supplied by the archive: **J.A. Rodriguez-Manfredi et al. (2021), The Mars Environmental Dynamics Analyzer, MEDA, NASA Planetary Data System, DOI 10.17189/1522849.** The NMSU domains above host NASA's PDS Atmospheres Node; they are the identified scientific archive, not a third-party participant rule guide.

See [data/source-audit.json](../../data/source-audit.json) for retrieval checks, source hashes and the exact decimal/rounding method. NASA records are external observations. Claude/ChatGPT/Codex-assisted wording, selection, curation, and fictional coefficients are labeled separately.

## Tools Used

- OpenAI ChatGPT/Codex: story/detail drafting, English translation, initial JavaScript data/reference model, integration documentation, source/audit work, and Git operations.
- Anthropic Claude: initial design/Python model/data curation, v1.2 revisions, the 1.2.1 restructure, and the 1.3.0 playable prototype (engine, interface, SVG illustrations, Turkish translation), as reported by the team.
- JavaScript and Node.js built-ins: scene-data, engine, translation and metadata checks. The browser game vendors Anime.js and canvas-confetti (see below); no package manager install is needed to run it.
- Python standard library: archived reference model and the current source-verification utility.
- Git and GitHub CLI: version control and publication at the user's request.

These tool names are credits, not product endorsements or competition-rule authorities. Exact AI model identifiers were not reliably provided.

## Media and Future Assets

Status as of version 1.3.0 (playable prototype). No video or audio asset is included.

### NASA photographs (downloaded from the NASA Image and Video Library on November 14, 2026)

| File | NASA ID and title | Credit line | Use |
| --- | --- | --- | --- |
| `assets/nasa/gale-crater-sunset-PIA19400.jpg` | [PIA19400 — Sunset in Mars' Gale Crater](https://images.nasa.gov/details/PIA19400) (Curiosity, Sol 956, April 15, 2015) | NASA/JPL-Caltech/MSSS/Texas A&M Univ. | Scene 5 science card |
| `assets/nasa/jezero-crater-rim-PIA26373.jpg` | [PIA26373 — Perseverance Rover's View Up Crater](https://images.nasa.gov/details/PIA26373) (August 4, 2024) | NASA/JPL-Caltech/ASU/MSSS | Background of the Sol 6 crater-rim location and the ending |
| `assets/nasa/jezero-crater-floor-PIA24765.jpg` | [PIA24765 — Perseverance's Office on Mars](https://images.nasa.gov/details/PIA24765) (2021) | NASA/JPL-Caltech/ASU/MSSS | Scene 2 science card |

The files are the resized versions served by NASA (`~orig`, `~large`, `~medium`) and are otherwise unmodified; the interface crops and darkens them with CSS only. Each photograph is credited in the game (caption or credit line, and the NASA Sources window). The photographs illustrate Mars; they are not measurements of the events described in the science cards, and their captions give their own dates. The team should still confirm NASA media usage guidance before the final submission.

### Illustrations

DUTİ, the Mars locations (`src/ui/world.js`), the icons, the compass mark and the favicon are original SVG drawings written in code with Anthropic Claude's assistance (`src/ui/art.js`, `src/ui/world.js`, `src/ui/app.js`, `assets/favicon.svg`). They contain no NASA insignia or branding. The interface shows a persistent "AI-generated SVG illustration" label and explanatory notes. The favicon carries an AI watermark and descriptive SVG metadata. Original generation used Claude; later Codex revisions are recorded per file. NASA photographs are credited separately.

### Third-party libraries and typeface (vendored, unmodified)

| Component | Version | License | Files |
| --- | --- | --- | --- |
| [Anime.js](https://animejs.com/) | 4.5.0 | MIT | `assets/vendor/animejs/` |
| [canvas-confetti](https://github.com/catdad/canvas-confetti) | 1.9.4 | ISC | `assets/vendor/canvas-confetti/` |
| [Fredoka](https://fonts.google.com/specimen/Fredoka) via Fontsource | 5.3.0 | SIL Open Font License 1.1 | `assets/fonts/fredoka/` |

License texts are stored next to the files. These components keep their own licenses regardless of the project's license.

Before adding an asset, record its exact source, creator/credit line, applicable permission/license, modifications, and any generation tool. NASA branding has separate restrictions. The official submission guide links [NASA's Brand Guidelines](https://www.nasa.gov/nasa-brand-center/brand-guidelines/); media guidance is available at [NASA Images and Media](https://www.nasa.gov/nasa-brand-center/images-and-media/). Do not apply the project's license to NASA or third-party material or imply NASA endorsement.

## Project License: Apache-2.0

The user authorized Apache-2.0 on November 15, 2026, superseding the November 14 deferral. The canonical [LICENSE](../../LICENSE) text was downloaded unmodified from the Apache Software Foundation. [LICENSING.md](../../LICENSING.md) states the applicable contributor-rights scope and third-party exclusions.

The official [2026 Terms](https://www.spaceappschallenge.org/legal/) accept unrestricted/OSI-compatible original work and name Apache 2.0 as NASA's default distribution license when none is specified. The team now selects it explicitly. NASA observations/photos and third-party libraries/fonts retain their own terms; this choice does not certify all rights or final eligibility.

## Development and Verification Tools (1.12.0)

- **Node.js and npm:** local static serving, package management and checks. They are not runtime services or NASA data.
- **@playwright/test 1.65.1:** exact development dependency for Chromium browser tests, Apache-2.0; [official project](https://github.com/microsoft/playwright). Its dependency tree is recorded in `package-lock.json`; installed package license files remain in the development installation. No Playwright runtime is shipped to players.
- **GitHub Actions:** repository checks use official checkout v7.0.1, setup-node v7.1.0 and upload-artifact v7.0.2, pinned to release commit SHAs in `.github/workflows/quality.yml`. This does not publish a site or submit the NASA form.
- **OpenAI Codex:** 1.12.0 code/documentation/test revisions; earlier Claude-generated artwork and implementation remain separately attributed in AI_USAGE.md and ai-usage.json. Current code-drawn art carries the visible label “AI-generated SVG illustration”; NASA photographs keep separate credits.

The team must include any other tools actually used in its final references. A dependency's license is not a project-wide license decision, and test configuration is not proof that its remote CI run has passed.
