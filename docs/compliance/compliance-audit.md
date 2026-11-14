# 2026 Space Apps Repository Audit

**Date:** November 14, 2026
**Baseline reviewed:** `ca5b5ec`
**Scope:** The repository's story, scene data, reference checker, curated NASA summaries, active documentation, and archived design.
**AI/SI disclosure:** Prepared with OpenAI ChatGPT/Codex; Claude contributions are separately credited in [AI_USAGE.md](../../AI_USAGE.md).

This is a project-maintenance audit, not official NASA approval or a guarantee of eligibility. The user asked that **only official 2026 Space Apps website pages** establish competition requirements. The audit follows that restriction. Earlier chat recommendations are design context, not official rules.

## Official Rule Sources

The following pages were read directly on the official website on November 14, 2026:

1. [Build a Junior Astronaut Mission Trainer — Details](https://www.spaceappschallenge.org/2026/challenges/junior-astronaut-mission-trainer/?tab=details): challenge objective and optional design considerations.
2. [The challenge's Resources tab](https://www.spaceappschallenge.org/2026/challenges/junior-astronaut-mission-trainer/?tab=resources): listed NASA resources, including DONKI, Open APIs, OSDR, RadLab, and Mars Trek.
3. [2026 Project Submission Guide](https://www.spaceappschallenge.org/resources/project-submission-guide/): submission fields, AI/SI disclosure, English, public access, and demo limits. The page is dated November 13, 2026.
4. [2026 Judging & Awards Guide](https://www.spaceappschallenge.org/resources/judging-awards-guide/): eligibility, team requirements, English, and judging criteria. The page is dated November 13, 2026.
5. [2026 Participant FAQs](https://www.spaceappschallenge.org/resources/participant-faqs/): event dates, team participation, no early challenge development, and AI/SI assistance. The page is dated November 13, 2026.
6. [2026 Participant Terms and Conditions](https://www.spaceappschallenge.org/legal/): rights, attribution, distribution, prohibited submission content, and participant responsibilities. The page identifies the 2026 terms and an August 7, 2026 update.

Third-party participant guides, prior-year rules, search-result snippets, and GitHub discussions are not used as rule authorities. Official NASA scientific archives are used separately to check scientific data, not to invent competition rules.

## Required Rules Versus Project Choices

| Topic | What the Official Pages Require or Describe | Repository Status |
| --- | --- | --- |
| AI/SI assistance | Allowed; disclose where/how it was used. Code/data require descriptive attribution and metadata. The underlying solution idea should come from the team. | Added AI_USAGE.md, ai-usage.json, file notices, exported metadata and credits text. User attested the underlying idea originated with the team. Human final review remains necessary. |
| Particular disclosure filename or AI GitHub identity | The guide does not specify `AI_USAGE.md`, a co-author trailer, an AI teammate account, or uploading a model. | The chosen files implement the description/metadata requirement. The assistants remain tools, not participants. |
| English | Submission and linked materials must be English; non-English demo narration requires English subtitles. | Active documents, data descriptions and archived explanatory text rendered in English. Archived internal simulator keys are retained to preserve behavior; they are not active UI text. |
| NASA data/resource | The submission guide requires at least one NASA data/resource for a Global Award. Meaningful integration is a judging criterion. | DONKI is challenge-listed and used by the Scene 5 card; MEDA supports Scene 2. Their display/use in the playable frontend is still pending. |
| Six scenes / six sols / 0–10 / Science target 6 | These are not mandatory event rules. The challenge calls for an educational decision experience and permits varied formats. | Team/prototype design choices, with fictional numerical coefficients explicitly labeled. |
| Number of indicators, browser access, replayability | The Details page labels its considerations optional; it encourages accessibility, manageable systems and meaningful trade-offs. | Three indicators, delayed choices and three mission profiles are present in data. Browser usability and child playtests await the frontend. |
| Demo | Video at most 30 seconds, or a presentation of at most seven slides including title/intro. | Not created in this repository. |
| Public links | Linked final project and demo must be accessible without login/permission. | GitHub reported this repository public during audit. Deployed game/demo links remain pending and must be checked separately. |
| Attribution and rights | Cite all used data/resources/tools; ensure rights and required license documentation. Original work must be freely available without restriction or OSI-compliant as described by the terms. | Added source inventory and AI credits. Team explicitly deferred a project-license decision; no license was added. Rights review remains open. |
| Timing and registration | No challenge-specific development before the hackathon; members must meet registration/team/event conditions. | User reported a November 14, 09:00 start. Visible commits start at 13:35 +03:00 that day. This does not independently prove creation times, registration, or the registered event's time zone. |

## Corrections Made by This Audit

- Added accurate OpenAI ChatGPT/Codex and Anthropic Claude attribution, selected prompt summaries, a machine-readable artifact inventory, and future-contributor instructions.
- Recorded the team's statement that it originated the underlying idea. Planned unique choice-sequence events and DUTİ conversations are labeled as planned, not implemented.
- Translated README, the v1.2 report, curated-data descriptions, archived design explanations, and archived simulator annotations/display labels into English. The archived model functions were checked for unchanged computation after stripping docstrings.
- Kept v1.2 mission profiles, low-power life support, all 17 choices and existing resource effects. No balance change is introduced by this audit.
- Corrected the description of panel rewards: profiles offer one, two, or three dusty stages; ending text must count only bonuses actually received.
- Replaced the suggested DONKI-to-Mars event match with an explicit statement that the event-level connection is not established. The records remain independently attributed examples.
- Preserved distinct shock and bulk CME analyses, avoiding an ambiguous shared direction/speed pairing. Saved the unmodified NASA API response and its SHA-256.
- Recomputed MEDA sample ranges using exact decimal conversion and stated rounding. Sol 290 minimum: −76.9 → **−76.8 °C**; Sol 313 maximum: −1.6 → **−1.5 °C**; Sol 330 maximum: −9.7 → **−9.6 °C**. Other stored extrema remain unchanged. Source-file hashes and method limitations are recorded.
- Described Safety as the current crew's abstract operational margin, not a medical diagnosis or a future crew's inherited health condition.
- Left the project license unset as explicitly requested. No history rewrite or retrospective change to commit authors/timestamps was made.

## Checks and Their Limits

Run:

```sh
node tools/check_story_data.mjs
node tools/check_disclosures.mjs
python tools/verify_nasa_sources.py
```

The first checker covers the data model and all profiles. The second checks provenance inventory and source metadata. The optional Python command checks selected original scientific records with TLS verification enabled. None is a production game engine, a child usability study, a rights certificate, or an organizer judgment.

## Remaining Submission Tasks

- Build and playtest the decision engine and browser frontend; show sources, archive labels, data qualifications, and AI/SI credits in the actual product.
- Add a publicly accessible project demo within the official length/slide limit and verify all final links without login.
- Review all generated story/code, complete the official SI/tool and references fields, and accurately describe the team's original work.
- Resolve project licensing and any third-party asset rights before making a final rights attestation. The license decision is currently deferred by the user.
- Verify both participants' registration, shared Local/Universal Event, team membership, applicable time zone and deadline. The reported global event name alone does not identify the registered local event.
- For future generated images/video, include visible generation labels; generated audio requires descriptive text and metadata. Follow the guide's NASA-branding restriction and individually check NASA/third-party media rights. No media asset is currently included here.
- Submit through the official project page before the applicable deadline. A GitHub push is not the project submission.

The audit does not mark these unfinished items as passed and cannot promise that disqualification is impossible.

## Status Update — Version 1.3.0 (November 14, 2026)

> AI/SI disclosure: this addendum was drafted with Anthropic Claude. The audit above was prepared with OpenAI ChatGPT/Codex and reflects baseline `ca5b5ec`; it is left unchanged.

Changes since the audit that affect its findings:

- **Playable prototype added.** `index.html`, `src/game/engine.js`, `src/ui/` and `src/i18n/` implement the six-sol game. The engine is compared path-by-path with the reference model by `tools/check_engine.mjs`. This addresses the first remaining task in part: the game exists and shows sources, archival labels, data qualifications and AI/SI credits, but it has **not** been playtested with children and is **not yet deployed** to a public link.
- **NASA data is displayed in the product.** The Scene 2 (MEDA) and Scene 5 (DONKI / Mars article) science cards show the source titles, observation dates, archival labels, the full `dataNote`, and links. The NASA Sources window lists every source and photograph.
- **Media added.** Three NASA photographs and AI-assisted SVG illustrations are now included; see [references.md](references.md). Illustrations carry a visible "AI-assisted illustration" label. The team should confirm the label wording against the official guide and confirm NASA media usage guidance.
- **Third-party components added.** Anime.js (MIT), canvas-confetti (ISC) and the Fredoka typeface (OFL-1.1) are vendored with their license texts.
- **Language.** English remains the primary and default language of the game and all linked materials. An optional Turkish interface was added by team decision. The submission page, demo and documentation must still be in English.

Still open: public deployment and link check without login, demo (30-second video or seven slides), human review of generated code and text, project license decision, registration/event checks, and the official form submission.
