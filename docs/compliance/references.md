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
| `assets/nasa/gale-crater-sunset-PIA19400.jpg` | [PIA19400 — Sunset in Mars' Gale Crater](https://images.nasa.gov/details/PIA19400) (Curiosity, Sol 956, April 15, 2015) | NASA/JPL-Caltech/MSSS/Texas A&M Univ. | Title background; Scene 5 science card |
| `assets/nasa/jezero-crater-rim-PIA26373.jpg` | [PIA26373 — Perseverance Rover's View Up Crater](https://images.nasa.gov/details/PIA26373) (August 4, 2024) | NASA/JPL-Caltech/ASU/MSSS | Scene 2 science card |
| `assets/nasa/jezero-crater-floor-PIA24765.jpg` | [PIA24765 — Perseverance's Office on Mars](https://images.nasa.gov/details/PIA24765) (2021) | NASA/JPL-Caltech/ASU/MSSS | Briefing background |

The files are the resized versions served by NASA (`~orig`, `~large`, `~medium`) and are otherwise unmodified; the interface crops and darkens them with CSS only. Each photograph is credited in the game (caption or credit line, and the NASA Sources window). The photographs illustrate Mars; they are not measurements of the events described in the science cards, and their captions give their own dates. The team should still confirm NASA media usage guidance before the final submission.

### Illustrations

DUTİ, the outpost scene, the icons, the compass mark and the favicon are original SVG drawings written in code with Anthropic Claude's assistance (`src/ui/art.js`, `src/ui/app.js`, `assets/favicon.svg`). They contain no NASA insignia or branding. Because they are AI-assisted, the interface shows a visible "AI-assisted illustration" label on scene art and a note on the title, briefing, ending and credits views.

### Third-party libraries and typeface (vendored, unmodified)

| Component | Version | License | Files |
| --- | --- | --- | --- |
| [Anime.js](https://animejs.com/) | 4.5.0 | MIT | `assets/vendor/animejs/` |
| [canvas-confetti](https://github.com/catdad/canvas-confetti) | 1.9.4 | ISC | `assets/vendor/canvas-confetti/` |
| [Fredoka](https://fonts.google.com/specimen/Fredoka) via Fontsource | 5.3.0 | SIL Open Font License 1.1 | `assets/fonts/fredoka/` |

License texts are stored next to the files. These components keep their own licenses regardless of the project's eventual license.

Before adding an asset, record its exact source, creator/credit line, applicable permission/license, modifications, and any generation tool. NASA branding has separate restrictions. The official submission guide links [NASA's Brand Guidelines](https://www.nasa.gov/nasa-brand-center/brand-guidelines/); media guidance is available at [NASA Images and Media](https://www.nasa.gov/nasa-brand-center/images-and-media/). Do not apply the project's eventual license to NASA or third-party material or imply NASA endorsement.

## Project License: Deferred

The team explicitly asked on November 14, 2026 to defer the license decision. **No project license is added and no Apache-2.0 license status is claimed.** The separately prepared Apache text was only a proposal, outside this repository.

The official [2026 Terms and Conditions](https://www.spaceappschallenge.org/legal/) describe unrestricted/OSI-compatible availability for original work and state NASA's default Apache 2.0 distribution provision when no specific compliant license is identified. That provision is not represented here as a license selected by the team for this GitHub repository. Final licensing and rights attestations remain the team's responsibility.

NASA data and any future third-party assets retain their own source-specific rights and usage conditions. This audit is not a blanket grant of rights or legal approval.
