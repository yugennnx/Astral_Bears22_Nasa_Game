# References, Provenance, and Rights Status

> AI/SI disclosure: this inventory was drafted with OpenAI ChatGPT/Codex. Earlier curated data and v1.2 contributions used Anthropic Claude, as confirmed by the team. See [AI_USAGE.md](../AI_USAGE.md) and [ai-usage.json](../ai-usage.json).

## Competition Rules

Only the official 2026 Space Apps website pages listed in [compliance-audit.md](compliance-audit.md) establish competition requirements for this project. The sources below serve scientific attribution and tool-credit purposes, not alternative competition rules.

## Scientific Sources Actually Referenced

| Source | Local Record / Use | Qualification |
| --- | --- | --- |
| [NASA DONKI](https://ccmc.gsfc.nasa.gov/tools/DONKI/) and [CME record 2024-05-20T05:36:00-CME-001](https://ccmc.gsfc.nasa.gov/DONKI/view/CME/31034/-1) | `data/nasa_events.json`, unmodified `data/raw/donki-cme-2024-05-20.json`; Scene 5 archival science card | Near-Sun CME analyses, not measured Mars dose. No confirmed match to the independently reported Mars event. DONKI is listed on the challenge's Resources tab. |
| [NASA — May 2024 Mars solar-storm observations](https://www.nasa.gov/missions/mars-science-laboratory/curiosity-rover/nasa-watches-mars-light-up-during-epic-solar-storm/) | Attributed findings in `data/nasa_events.json`; Scene 5 science card | The 8,100-microgray figure comes from this article. It is not converted to the game's Safety score. |
| [NASA PDS MEDA catalogue](https://pds.nasa.gov/ds-view/pds/viewBundle.jsp?identifier=urn:nasa:pds:mars2020_meda) and [official PDS Atmospheres Node MEDA archive](https://pds-atmospheres.nmsu.edu/data_and_services/atmospheres_data/PERSEVERANCE/meda.html) | `data/meda_jezero.json`; Scene 2 science card | Source CSV URLs and hashes are recorded. Simple sensor sample extrema are not a global climate description, dust measurement, or fully quality-filtered derived product. |
| [NASA — Speaking Percy's Language](https://science.nasa.gov/blog/speaking-percys-language-how-to-talk-so-perseverance-will-listen/) | Scene 4 communication explanation | The story's one-way 20-minute delay is a scenario value; actual delay varies. |
| [NASA — Growing Plants in Space](https://www.nasa.gov/exploration-research-and-technology/growing-plants-in-space/) | Scene 3 educational card | The fictional Mars greenhouse is not NASA's existing space-station facility. Plants are already growing before the mission. |

MEDA citation supplied by the archive: **J.A. Rodriguez-Manfredi et al. (2021), The Mars Environmental Dynamics Analyzer, MEDA, NASA Planetary Data System, DOI 10.17189/1522849.** The NMSU domains above host NASA's PDS Atmospheres Node; they are the identified scientific archive, not a third-party participant rule guide.

See [data/source-audit.json](../data/source-audit.json) for retrieval checks, source hashes and the exact decimal/rounding method. NASA records are external observations. Claude/ChatGPT/Codex-assisted wording, selection, curation, and fictional coefficients are labeled separately.

## Tools Used

- OpenAI ChatGPT/Codex: story/detail drafting, English translation, initial JavaScript data/reference model, integration documentation, source/audit work, and Git operations.
- Anthropic Claude: initial design/Python model/data curation and v1.2 revisions, as reported by the team.
- JavaScript and Node.js built-ins: scene-data checks and metadata checks; no third-party JavaScript package is currently bundled.
- Python standard library: archived reference model and the current source-verification utility.
- Git and GitHub CLI: version control and publication at the user's request.

These tool names are credits, not product endorsements or competition-rule authorities. Exact AI model identifiers were not reliably provided.

## Media and Future Assets

No image, video, audio, font package, or third-party visual template has been added to the reviewed repository. Suggested visual concepts and source links are not selected/licensed asset files.

Before adding an asset, record its exact source, creator/credit line, applicable permission/license, modifications, and any generation tool. NASA branding has separate restrictions. The official submission guide links [NASA's Brand Guidelines](https://www.nasa.gov/nasa-brand-center/brand-guidelines/); media guidance is available at [NASA Images and Media](https://www.nasa.gov/nasa-brand-center/images-and-media/). Do not apply the project's eventual license to NASA or third-party material or imply NASA endorsement.

## Project License: Deferred

The team explicitly asked on November 14, 2026 to defer the license decision. **No project license is added and no Apache-2.0 license status is claimed.** The separately prepared Apache text was only a proposal, outside this repository.

The official [2026 Terms and Conditions](https://www.spaceappschallenge.org/legal/) describe unrestricted/OSI-compatible availability for original work and state NASA's default Apache 2.0 distribution provision when no specific compliant license is identified. That provision is not represented here as a license selected by the team for this GitHub repository. Final licensing and rights attestations remain the team's responsibility.

NASA data and any future third-party assets retain their own source-specific rights and usage conditions. This audit is not a blanket grant of rights or legal approval.
