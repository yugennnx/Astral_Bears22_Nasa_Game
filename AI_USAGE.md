# AI/SI Use Disclosure

**Project:** Compass Outpost: Ten Sols of Questions
**Team repository:** Astral_Bears22_Nasa_Game
**Updated:** November 15, 2026

This project includes text, code, and documentation generated or revised with **OpenAI ChatGPT/Codex and Anthropic Claude**. This disclosure is part of the project and should remain accessible to reviewers. Machine-readable file-level provenance is recorded in [`ai-usage.json`](ai-usage.json).

## Tool and Scope

- **Providers:** OpenAI and Anthropic.
- **Tools:** ChatGPT conversational assistance, the Codex coding assistant, and Claude. The user confirmed Claude use for both the initial repository files and the later v1.2 update on November 14, 2026.
- **Exact model identifiers:** Not reliably recorded; no model/version is claimed for either provider.
- **Purpose:** Help develop the team's selected narrative format into a scene draft; translate and organize content; encode choices, state flags, and conditional rewards; write a reference checker and integration guide; research primary sources; and prepare this disclosure audit.
- **Not an AI team member:** The assistant is a tool. It is not registered as a participant and is not a NASA representative or an endorsement.

## Contributions Evidenced by the Conversation

### Directions supplied by the team

The user specified a browser-based project, a narrative decision-tree format, a two-person division of work, a cartoon visual style combined with NASA photographs, nonnegative resource indicators on a ten-point scale, English story/code, and the robot name **DUTİ**. The team requested the story draft, translation, scene-data implementation, and GitHub publication.

### Material proposed or produced by the assistant

The assistant proposed or expanded the six-scene story, working title, DUTİ dialogue, detailed choices, numerical costs and rewards, state-flag connections, ending descriptions, English translation, `src/game/scenes.js`, the initial `tools/check_story_data.mjs`, and `docs/design/story-data-contract.md`. The assistant ran automated checks and Git commands at the user's request.

The assistant also generated the English wording, metadata, and source-audit corrections added by the current compliance review. AI-assisted source summaries are distinct from NASA's original observations. Resource scores and mission profiles are game assumptions; they are not NASA measurements.

On November 15, 2026, the user asked to pause engine work, complete Sols 7–10 with curiosity-led storytelling, and add discoverable endings caused by specific earlier choices, then publish an implementation-ready handoff. OpenAI ChatGPT/Codex generated the new ten-sol story plan, first-six narrative framing, twelve new choices and feedback, four special ending texts and predicates, proposed balance values, JSON design, integration checklist, and independent design enumerator/balance report. It also added documentation links, the expansion-check script, and provenance records. Existing first-six mechanical data are inherited from the separately credited scene module. At the time, the new expansion was design-only: the six-sol engine, scene module, artwork, and translations were unchanged. See the 1.9.0 update below. The checks establish numerical reachability, not child engagement or completed human review.

### Claude-assisted contributions confirmed by the team

The user confirmed that **Anthropic Claude** was used for the original ten-sol design, its Python simulator, and initial curated DONKI/MEDA JSON files in commit `d304c77`. The user also confirmed Claude use for commit `ca5b5ec`, which revised the active prototype with NASA-data cards, mission profiles, low-power life support, the next-crew report, and supporting documentation/checks.

Anthropic Claude was also used, at the user's request on November 14, 2026, for the **1.2.1 repository restructure**: grouping documentation under `docs/design/`, `docs/compliance/` and `docs/changelog/`, renaming the curated data files to `data/nasa-events.json` and `data/meda-jezero.json`, adding `package.json`, `CHANGELOG.md`, `.gitattributes` and `.editorconfig`, and updating path references. No gameplay values, story text or data values were changed.

Anthropic Claude was also used, at the user's request on November 14, 2026, for the **1.3.0 playable prototype**: the decision engine (`src/game/engine.js`), the browser interface and styles (`index.html`, `src/ui/`), the SVG illustrations, the Turkish translation of story and interface text (`src/i18n/`), the engine and translation checks, the selection and crediting of three NASA photographs, and the vendoring of open-source libraries. The team chose the direction in answer to design questions: dark space theme with warm Mars tones, DUTİ as a brown teddy-bear-like robot, code-drawn SVG plus NASA photographs, phone and desktop layouts, English as the main language with a Turkish option, soft animations without sound, and the use of additional libraries. Claude generated the implementation; it has not yet been reviewed line by line by the team or playtested with children.

Anthropic Claude was also used for the **1.4.0 redesign** requested by the team after playtesting the prototype themselves: a full-screen pop-up flow without page scrolling, a separate illustrated location for each sol (`src/ui/world.js`), richer animations, and a rewrite of the Turkish text in simpler language. The team's feedback (too static, one location, scrolling needed, weak Turkish) set the goals; Claude generated the implementation.

Anthropic Claude was also used for the **1.5.0 update**: after playing 1.4.0 the team asked for a scene for every choice, longer and deeper scenes, hands-on tapping tasks, and DUTİ showing the situation before each decision. Claude generated `src/ui/activities.js`, `src/game/facts.js`, the fact-card texts and their Turkish translations. Each fact was checked against the linked NASA page with a web-fetch helper; facts that could not be verified (an InSight end-of-mission claim and an August 2015 lettuce claim) were left out.

Anthropic Claude was also used for the **1.6.0 update**: the team asked for more freedom and curiosity ("the child should discover things on their own, not only through fact cards and tasks"), the child's name, crew-style address and a predict-then-observe step. Claude generated `src/ui/discoveries.js`, the exploration and journal interface, the prediction step and their English/Turkish texts. Facts were checked against NASA pages with a web-fetch helper; claims that could not be verified (a gravity percentage, dust devils, the apparent size of the Sun) were left out.

Anthropic Claude was also used for the **1.7.0 update** (November 15, 2026): sound, kinder endings and situation-based predictions. Claude generated `src/ui/sound.js` (sound effects and a soft wind ambience synthesised in the browser), the sound switch, the careful warnings before choices that could stop the mission, the failed-mission "What happened" and "Ideas for next time" screens, the storm vignette on Sol 5, and their English/Turkish interface strings. The 1.7.0 changes were checked with `npm run check`; browser checks are recorded in the team's test notes. No team member has reviewed this code line by line.

Anthropic Claude was also used for the **1.8.0 update** (November 15, 2026): easier exploration, clearer discoveries and fact cards that do not repeat within a mission. Claude generated the keyboard and click controls for moving the story on, the pulsing rings and star badges on discoveries, the secret sparkle, the reworked explore panel and look buttons, the Mars Journal fact-card section with its counter badge, the per-choice fact-card pools, the choice cards without "Later" consequences, six rewritten discovery notes and the moved activity targets, together with their English/Turkish interface strings. The 1.8.0 changes were checked with `npm run check`; browser checks are recorded in the team's test notes. No team member has reviewed this code line by line.

This audit adds OpenAI ChatGPT/Codex-assisted English translations, metadata, primary-source checks, and wording corrections to those contributions. It does not claim that Claude generated NASA's underlying observations. Claude's exact prompts and model version were not provided in this session.

### 1.9.0 update (ten-sol edition in the playable game)

On November 15, 2026, Anthropic Claude implemented the team's ten-sol design in the playable game as version 1.9.0. The story prose, scene structure, choice texts and numerical design are the teammate's OpenAI ChatGPT/Codex text (`data/ten-sol-story-design.json`, `docs/design/ten-sol-story-plan.md`, `docs/design/ten-sol-implementation-handoff.md`). Claude generated the runtime integration from that design: the scene data in `src/game/scenes.js`, the Sol 6 checkpoint, the Sol 8 greenhouse gate, the special endings and their selection in `src/game/engine.js`, the save version, the Mars Journal ending section, the Sols 7–10 spotlights, tasks and discoveries (`src/ui/activities.js`, `src/ui/discoveries.js`, `src/ui/world.js`, `src/game/facts.js`), the English and Turkish interface and story strings, the checks that compare the engine with the design, and the integration notes in `docs/design/ten-sol-integration-notes.md`. Claude made small status and integration changes to the ChatGPT/Codex-generated JSON design and independent enumerator. This disclosure does not certify human review of the code, and no human review is claimed here.

### 1.10.0 update (play-test suggestions)

On November 15, 2026, Anthropic Claude implemented in version 1.10.0 a set of twelve review suggestions that a teammate shared in the team chat: an opening mystery, fewer forced screens, varied thinking tasks, clues that come back later, observing before explaining, lasting visual traces of choices, varied rhythm, DUTİ remembering earlier choices, hints toward the special endings without recipes, clearer prediction time frames, faster replays, and play-testing with children. Correction (recorded after the independent review in `docs/design/repository-review-761bb66.md`): the twelve specific suggestions were produced by an **OpenAI Codex-assisted review** that the team requested; the team chose which suggestions to implement and in what order; Claude generated the implementation. The separate attestation that the underlying game idea came from the team is unchanged. Claude generated the runtime code (including the new `src/ui/memories.js`, and changes in `src/ui/app.js`, `src/ui/world.js`, `src/ui/discoveries.js`, `src/ui/activities.js`, `src/ui/art.js` and `src/ui/styles.css`), the 61 new and 14 revised English and Turkish interface strings in `src/i18n/ui.js`, and the documentation updates. No rule, number or ten-sol design value was changed. The checks run automatically; no human has reviewed this code line by line, and the play-test with children is still open.

### Independent 1.10.1 regression review

On November 15, 2026, the team requested an independent follow-up on commit `5834e11` and publication of the results for Tuğra. OpenAI Codex prepared temporary browser probes, ran the existing checks and 19 playthrough scenarios plus four focused probes, and generated [the regression report](docs/design/regression-review-5834e11.md). The report verifies the earlier fixes, records an additional remaining language-switch issue, and separates the deliberately deferred ending/pacing/browser-test work. This publication changes documentation and contribution records only; game code and values were not revised. Temporary test harnesses and screenshots remain outside the repository. This is AI-assisted verification, not a child playtest or a completed human review.

### Independent 1.10.2 regression review

On November 15, 2026, OpenAI Codex independently verified commit `326f941` at the team's request. It generated temporary browser probes and [the follow-up report](docs/design/regression-review-326f941.md), ran 15 playthrough scenarios and four focused probes with 28 language-switch checks, and recorded the current-prompt fix as verified. The report separates a low-priority document-language/HUD refresh observation from the three deliberately deferred product/testing items. This publication adds documentation and AI contribution records only; no game fix was applied. Temporary harnesses and screenshots remain outside the repository. These are automated checks, not a child playtest or completed human review.

### Independent 1.10.3 regression review

On November 15, 2026, OpenAI Codex independently verified commit `6bd524b` in the ongoing review workflow. It generated temporary browser probes and [the follow-up report](docs/design/regression-review-6bd524b.md), ran 15 playthrough scenarios and six focused scenarios with 34 language switches, and verified the page-language/HUD/task-banner fix without changing displayed totals, progress or engine state. The report closes the previous P3 within the test scope and separates deliberately deferred product/testing work from team-reported delivery tasks. Only documentation and AI contribution records were published; no game code was changed. Temporary harnesses and screenshots remain outside the repository. These checks are not a child playtest or actual screen-reader testing.

## Selected Prompt Record

The following are English summaries or translations of project-related user requests, not a complete chat transcript:

1. **Story drafting:** Write the first six scenes, offer two or three choices per scene, specify numerical effects and later consequences, and define the Science target.
2. **Language and character:** Rename the companion robot DUTİ and rewrite the complete story in English for the project.
3. **Implementation handoff:** Prepare the team's next step while the frontend developer starts the interface draft. The assistant selected conversion of the story into JavaScript scene data.
4. **Publication:** Push the story plan, then the new scene-data step, to the team's GitHub repository.
5. **Audit:** Recheck the earlier conversation and the official challenge/rules, disclose AI contributions, inspect published work, and correct identified issues.
6. **Ten-sol continuation:** Complete the remaining four sols with engaging, curiosity-led scenes, create several special endings unlocked by specific choice histories, and push an English implementation handoff to the shared repository. The team supplied the desired duration, continuation scope, discovery/replay goal, and earlier idea of sequence-triggered unique events; Codex supplied the detailed prose, predicates, and balancing proposals.

Inputs included the team-provided requirements, challenge statement, earlier assistant-generated drafts, repository files, and publicly accessible official NASA/Space Apps sources. No private credentials are part of this disclosure. Private conversation details unrelated to the project are omitted.

## Originality: Team Attestation and Review Status

The 2026 [Project Submission Guide](https://www.spaceappschallenge.org/resources/project-submission-guide/) permits AI/SI assistance but says it should not generate the team's underlying solution idea. On November 14, 2026, the user stated that **the team had determined the underlying game idea before using AI** and that the design directions in the conversation reflect its ideas. This is a team attestation, not an independent organizer ruling.

The user also identified planned original features: unique events triggered by particular sequences of choices and special DUTİ conversations. These features are **planned**, not implemented in the current data module. The team-supplied idea is distinct from the substantial scene wording, numerical details, and code generated by the tools listed above.

Before submission, the team should review the generated story/code and accurately describe its own design decisions. Do not retrospectively present AI-generated details as entirely human-authored. No completed human code/content review or organizer eligibility certification is claimed here.

## Event Timing Report

The user reported that its 2026 NASA Space Apps event began **November 14, 2026 at 09:00**. Visible project commits begin that day at 13:35 +03:00. The registered Local/Universal Event identifier and its applicable time zone were not independently checked. Commit timestamps show when commits were recorded, not proof of when every underlying idea or file was created; Git history has not been rewritten.

## Media and Branding

As of version 1.3.0 the game contains **AI-assisted illustrations**: DUTİ, the outpost scene, the icons, the compass mark and the favicon are SVG drawings written in code with Anthropic Claude. They are not NASA images and contain no NASA insignia. The interface labels scene art "AI-assisted illustration" and repeats the note on the title, briefing, ending and credits views. No generated video or audio file is present; the game's sound is synthesised in code (see Audio below). If such assets are added later, disclose the generating tool and scope. The 2026 guide requires visible generation labels/watermarks for generated images/videos and descriptive text plus metadata for generated audio. Do not generate, contain, alter, or imitate NASA branding/design elements in generated content. The team should confirm that the label used here satisfies the guide's wording before submission.

NASA photographs/data require their own attribution and usage checks. A reference link is not a license for NASA logos or third-party copyrighted content. Participation in Space Apps does not mean NASA endorses this game.

## Audio

Every sound in the game is generated in code at run time by the Web Audio API (`src/ui/sound.js`: short effects from oscillators and a soft wind ambience from filtered noise), written with AI assistance from Anthropic Claude. No recorded, sampled, downloaded or AI-generated audio files are included. Sound starts only after the first tap, and players can mute it with the sound switch in the top bar; the choice is saved on the device.

## Submission Form Draft

**Draft for the team to review and place in the official form:**

> Our team determined the underlying game idea and design direction before using AI. We used Anthropic Claude for the initial design, curated NASA-data summaries and simulator, and the later mission-profile and life-support revisions. We used OpenAI ChatGPT/Codex to draft and translate detailed scenes, develop choice effects and conditional state data, generate the initial JavaScript reference checker and integration guide, prepare a ten-sol continuation with four choice-dependent special endings and a balance checker, which Anthropic Claude later implemented in the playable game (1.9.0), and help audit sources and disclosures. The tools generated substantial implementation and story details, which are disclosed in AI_USAGE.md and ai-usage.json. The team supplied the selected narrative format, platform and visual constraints, ten-point resource requirement, English-language requirement, and companion name DUTİ. NASA observations are attributed separately from AI-assisted summaries and fictional gameplay values. The team plans additional choice-sequence events and DUTİ conversations; these planned features are not claimed as implemented.

Fill the website's **Use of Super Intelligence (SI)** field and the relevant references fields. A GitHub disclosure supports those fields; it does not submit the project or replace the form.

## Official Basis

- [2026 Project Submission Guide](https://www.spaceappschallenge.org/resources/project-submission-guide/): AI/SI use, originality boundary, attribution, English materials, public links, and demo limits.
- [2026 Participant FAQs](https://www.spaceappschallenge.org/resources/participant-faqs/): allowed tools, team requirements, and no challenge-specific development before the event.
- [2026 Participant Terms and Conditions](https://www.spaceappschallenge.org/legal/): source attribution, rights, and open-source distribution.

Only the official 2026 Space Apps website pages above are used as competition-rule authorities in this audit. Third-party guides, search snippets, previous chat answers, and GitHub discussions are not used to establish requirements. File names such as `AI_USAGE.md` and `ai-usage.json` are this project's chosen way to implement the official descriptive-text/metadata requirement; the guide does not mandate those particular names or an AI co-author account.
