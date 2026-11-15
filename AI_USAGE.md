# AI/SI Use Disclosure

**Project:** Compass Outpost: Ten Sols of Questions
**Team repository:** Astral_Bears22_Nasa_Game
**Updated:** November 15, 2026

This project includes text, code, and documentation generated or revised with **OpenAI ChatGPT/Codex and Anthropic Claude**. This disclosure is part of the project and should remain accessible to reviewers. Machine-readable file-level provenance is recorded in [`ai-usage.json`](ai-usage.json).

## Current contribution summary (1.12.0)

| Contributor or tool | Evidenced scope |
| --- | --- |
| Team | Attested underlying idea, narrative/platform direction, ten-sol/discoverable-ending goals, companion name, selection of suggestions and development requests. These statements are not an organizer ruling. |
| OpenAI ChatGPT/Codex | Detailed English story/ending design and numerical proposals, initial scene data/checks, source audits, independent reviews, 1.11.1 UI fixes and 1.12.0 repository alignment, persistence/science wording corrections, permanent browser tests, CI and documentation. |
| Anthropic Claude | Initial/continued implementation, translation, SVG/audio code, curated-data assistance, ten-sol and five-ending integration, and changes through 1.11.9 as evidenced by commit history. NASA's original observations are external. |

The active release has five implemented choice-history endings. Player-initiated optional DUTİ conversations remain planned. Current state and verification are in [project status](docs/project-status.md) and [release review](docs/design/release-review-1.12.0.md). Historic version descriptions below retain their dates; they do not override current status.

The changelog reports Antigravity-assisted reviews for earlier versions; their prompts, exact tool/model and separate artifact scope were not supplied here. That reported review is not certified as a human review. The team must include any additional tools actually used in its final form.

## Tool and Scope

- **Providers:** OpenAI and Anthropic.
- **Tools:** ChatGPT conversational assistance, the Codex coding assistant, and Claude. The user confirmed Claude use for both the initial repository files and the later v1.2 update on November 14, 2026.
- **Exact model identifiers:** Not consistently verified across contributions. Some commit trailers name a model; this record does not treat those trailers as a complete verified model inventory.
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

## Visitor-ending story handoff (November 15, 2026)

After an OpenAI ChatGPT/Codex discussion suggested a fictional visitor ending, the user selected **The Visitors Beyond the Window**, requested an exciting continuation of the existing story, and authorized publication for Tuğra to implement. OpenAI ChatGPT/Codex generated the detailed English conditional clues, six-choice predicate, five-page encounter, uncertainty/fiction wording, numerical witness analysis and implementation checklist in [the story appendix](docs/design/ten-sol-story-plan.md#planned-fifth-ending-the-visitors-beyond-the-window). It revised the story-plan/handoff/README/changelog links and these disclosure records. The user supplied the desired visitor theme and engagement goal; the detailed text and unlock recipe are AI-generated. A temporary probe evaluated the proposed predicate against the unchanged production engine in all profiles; it was not added as a permanent test. This publication is story/documentation only: no runtime, machine-readable design, translation, image/audio, save or license change is included. The fifth ending is not yet playable, and no child playtest, completed human review or NASA approval is claimed.

## 1.11.0 update (The Visitors Beyond the Window and clearer reasons)

Version 1.11.0 separates three kinds of contribution:

- **The fifth ending's story, clues and predicate.** The Visitors Beyond the Window, its conditional clues, six-choice predicate, five fictional pages and fiction wording were generated with **OpenAI ChatGPT/Codex** as part of the teammate's design (commit `cd71176`; appendix in [the ten-sol story plan](docs/design/ten-sol-story-plan.md#planned-fifth-ending-the-visitors-beyond-the-window)). The user supplied the visitor theme and engagement goal.
- **The education priority list.** The one-sentence "Why" lines, the 2C data-source line, the two new thinking tasks (7A and 9A) and the extra ending-report decision chains come from a priority list produced with **OpenAI Codex** assistance. The team chose which items to implement.
- **The implementation.** **Anthropic Claude** generated the runtime and presentation code: `src/ui/beats.js`, the special-ending pages and report, the visitor art drawn in code, the `SPECIAL_ENDINGS` entry and related scene data, the English and Turkish interface strings, the checks and these documentation updates. The beats' prose comes from the ChatGPT/Codex appendix. File-level scopes are recorded in [`ai-usage.json`](ai-usage.json).

No completed human code review, child playtest or browser verification is claimed for this version; browser checking is left to the team reviewer. The checks run for this version are automated data and numerical checks only.

## 1.11.1 corrections requested by the team

On November 15, 2026, the user reported English text remaining in the Turkish interface and overlapping activity controls after the Claude-assisted v1.11.0 update (`13c49e7`). OpenAI Codex reproduced the issues, generated the live SVG/accessible-label translation bindings, localized equipment labels, activity-camera layout, target/ring spacing, HUD sizing, note-task feedback corrections and visible phone-report fiction note, and updated release/status documentation. Codex also generated temporary browser test harnesses and [the verification report](docs/design/ui-regression-1.11.1.md), ran the repository checks and recorded file-level scopes. Existing Claude implementation and the separately credited story design remain attributed to their actual tools. No engine rule, choice effect, ending predicate, NASA measurement or license decision was changed. Temporary probes and screenshots remain outside the repository; no permanent browser suite, child playtest, human review certification or organizer approval is claimed.

## 1.12.0 repository alignment and verification

The user requested a professional correction of the latest shared repository and critical findings before final submission preparation, with no emoji and accurate official-rule compliance. OpenAI Codex worked from `d5776a7` (1.11.9), preserved the subsequent Claude UI/discovery changes and current game balance, fixed interrupted special-ending registration/review, removed unsupported day/night labels from the MEDA comparison, corrected task-camera clipping and focused-control keyboard debounce, added an exact Playwright development dependency/lockfile, permanent browser tests, a Node static server, documentation checks and pinned CI configuration, and rewrote current README/contract/handoff/status/submission/source documents. Historical reports and original provider contributions remain intact. The team's deferred license decision, real registrations, human review, child testing, demo and official submission were not silently marked complete.

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

The user identified sequence-triggered unique events and special DUTİ conversations as feature directions. Choice-history-triggered endings are implemented; optional player-initiated DUTİ conversations remain planned. Detailed generated prose and predicates retain the attribution above. The team-supplied idea is distinct from the substantial scene wording, numerical details, and code generated by the tools listed above.

Before submission, the team should review the generated story/code and accurately describe its own design decisions. Do not retrospectively present AI-generated details as entirely human-authored. No completed human code/content review or organizer eligibility certification is claimed here.

## Event Timing Report

The user reported that its 2026 NASA Space Apps event began **November 14, 2026 at 09:00**. Visible project commits begin that day at 13:35 +03:00. On November 15 the user reported Universal Event participation and a Team Owner residing in Türkiye. The official Universal deadline follows the owner's residence: November 15, 2026 at 23:59 Türkiye time for that reported residence. The actual event registration, owner identity and form have not been independently inspected. Commit timestamps show when commits were recorded, not proof of when every underlying idea or file was created; Git history has not been rewritten.

## Media and Branding

As of version 1.3.0 the game contains **AI-assisted illustrations**: DUTİ, the outpost scene, the icons, the compass mark and the favicon are SVG drawings written in code with Anthropic Claude. They are not NASA images and contain no NASA insignia. The current interface labels code-drawn art "AI-generated SVG illustration" and repeats the note on the title, briefing, ending and credits views. No generated video or audio file is present; the game's sound is synthesised in code (see Audio below). If such assets are added later, disclose the generating tool and scope. The 2026 guide requires visible generation labels/watermarks for generated images/videos and descriptive text plus metadata for generated audio. Do not generate, contain, alter, or imitate NASA branding/design elements in generated content. The team should confirm that the label used here satisfies the guide's wording before submission.

NASA photographs/data require their own attribution and usage checks. A reference link is not a license for NASA logos or third-party copyrighted content. Participation in Space Apps does not mean NASA endorses this game.

## Audio

Every sound in the game is generated in code at run time by the Web Audio API (`src/ui/sound.js`: short effects from oscillators and a soft wind ambience from filtered noise), written with AI assistance from Anthropic Claude. No recorded, sampled, downloaded or AI-generated audio files are included. Sound starts only after the first tap, and players can mute it with the sound switch in the top bar; the choice is saved on the device.

## Submission Form Draft

**Current English draft for the team to verify before copying into the official SI field:**

> Our team attests that it selected the underlying Mars outpost decision-game idea before using AI. We used OpenAI ChatGPT/Codex and Anthropic Claude for substantial detailed story and ending prose, numerical game-design proposals, code, Turkish translation, SVG illustrations, synthesized-audio code, documentation and automated verification. The team supplied design directions and selected which suggestions to implement. NASA observations and photographs are external attributed resources, not AI-generated measurements. Resource scores and fictional events are game assumptions. Code-generated illustrations carry a visible generation label; contribution scope and metadata are recorded in AI_USAGE.md and ai-usage.json. We do not claim that all generated details were human-authored or that automated tests establish child-learning outcomes. The team must add any other tools actually used and verify its final rights/originality declarations.

The official form's NASA-data and references sections must also be completed; this disclosure does not replace them. No private conversation transcript, credentials or personal reasoning record is required by this project's disclosure process. Project-specific prompt summaries and factual contribution descriptions are retained instead.

## Official Basis

- [2026 Project Submission Guide](https://www.spaceappschallenge.org/resources/project-submission-guide/): AI/SI use, originality boundary, attribution, English materials, public links, and demo limits.
- [2026 Participant FAQs](https://www.spaceappschallenge.org/resources/participant-faqs/): allowed tools, team requirements, and no challenge-specific development before the event.
- [2026 Participant Terms and Conditions](https://www.spaceappschallenge.org/legal/): source attribution, rights, and open-source distribution.

Only the official 2026 Space Apps website pages above are used as competition-rule authorities in this audit. Third-party guides, search snippets, previous chat answers, and GitHub discussions are not used to establish requirements. File names such as `AI_USAGE.md` and `ai-usage.json` are this project's chosen way to implement the official descriptive-text/metadata requirement; the guide does not mandate those particular names or an AI co-author account.

## Authorized licensing follow-up (November 15, 2026)

After initially deferring the decision, the user authorized Apache-2.0 if compatible with NASA rules. Codex reread the official 2026 Terms, which explicitly identify that license as NASA's default, downloaded the canonical Apache text unmodified, prepared LICENSING.md and updated current package/documentation/disclosure checks. The legal text is external, not generated by AI. NASA/third-party terms and final team rights declarations remain separate. This supersedes the earlier license deferral, not the historical development record.

## Submission demo (November 15, 2026)

The user requested a professional demo following the official rules. OpenAI Codex reread the central 2026 Project Submission Guide and Terms, generated English captions/layout/capture/encoding/verification scripts and a silent 29-second 1080p demo, and used actual controls in reachable production-engine states from e27dbd6. The video is visibly labeled AI-GENERATED DEMO throughout. Game artwork/story/code retain their existing ChatGPT/Codex and Claude attribution; NASA observations and the credited PIA26373 photograph are external, not AI-generated. No human footage/voice or personal participant name was recorded. Edited excerpts are explicitly identified; no continuous ten-sol run, human review, learning gain or NASA endorsement is claimed. FFmpeg via imageio-ffmpeg was an external temporary encoding helper; no encoder binary or raw footage is shipped. The official project form was not submitted by this work. See [demo details](docs/demo.md).
