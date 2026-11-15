# Project Instructions

## Active Project

- The active game is the ten-sol edition (1.12.0): ten sols, 29 choices and five special endings. Read `docs/project-status.md` first. Its rules live in `src/game/scenes.js`, `data/ten-sol-story-design.json` and `docs/design/ten-sol-story-plan.md`; the current state/save contract is `docs/design/story-data-contract.md`. `docs/design/story-plan.md` describes historical Chapter One (Sols 1–6). Preserve the mission profiles and low-power life-support rules unless the team explicitly changes them.
- Preserve the Sol 6 checkpoint, Sol 8 greenhouse gate, Science target 10 and five ending predicates. The visitors are explicitly fictional and award no bonus or rescue. Run `npm run check:expansion` for the independent design model and `npm run check:engine` for the production-engine comparison; keep them separate. Do not mix the former six-sol target of 6 with the current ten-sol target of 10.
- The companion's display name is **DUTİ**; its code ID is `duti`.
- Use English in code, story, documentation, and materials linked for submission. English is the game's primary and default interface language. By team decision (November 14, 2026) the game also offers an optional Turkish interface in `src/i18n/`; keep English complete and keep Turkish in sync (`npm run check:i18n`). Save UTF-8 files.
- The playable game is `index.html` + `src/game/engine.js` + `src/ui/`. Keep rules in the engine, not in the interface. Archive files are historical context, not the active game engine.
- Layout: design docs in `docs/design/`, rules/references in `docs/compliance/`, release notes in `CHANGELOG.md` and `docs/changelog/`, curated data in `data/` (kebab-case names), unmodified NASA responses in `data/raw/`.

## AI/SI Attribution

- Read `AI_USAGE.md`, `ai-usage.json`, and `docs/compliance/compliance-audit.md` before contributing.
- Disclose AI-generated or AI-revised text, code, and metadata accurately. Update the artifact inventory when adding or revising files. Do not claim human-only authorship, human review, a specific model, or original idea ownership without evidence.
- Preserve the per-file provenance comments/notices and the exported `AI_DISCLOSURE` metadata in the scene module.
- New generated images/videos need visible generation labels; audio needs descriptive attribution and metadata. Follow the current official rules and verify rights before adding assets. Do not generate or modify protected NASA branding/design elements.
- Do not publish unrelated personal chat content, credentials, or private reasoning transcripts as provenance. Use project-specific prompt summaries and factual contribution descriptions.

## Verified Rules and Submission Limits

- Use only official 2026 `spaceappschallenge.org` pages linked in `docs/compliance/compliance-audit.md` as competition-rule authorities. A previous chat, GitHub discussion, third-party guide, or search snippet is not a rule authority for this project. NASA scientific archives serve as data sources, separately from competition rules.
- The official guide permits AI/SI assistance but places a boundary around generating the team's underlying solution idea. Record the actual human contributions and unresolved originality questions honestly; an attribution file alone does not certify eligibility.
- Attribute every source and tool, keep raw observations separate from AI-assisted summaries and game assumptions, and show sources in the eventual interface.
- The official submission guide requires at least one NASA data/resource for a Global Award. DONKI is also listed on this challenge's Resources tab. Source links in a data module do not prove that a working interface displays/uses them.
- The submission page and linked materials must be English. The demo is at most 30 seconds of video or seven slides including title/intro. Video in another language requires English subtitles.
- Public links must work without login. Team registration, local event timing, originality, media rights, licensing, and final form submission remain human/team responsibilities unless verified.
- The Universal Event requires 2–6 registered teammates; the deadline follows the Team Owner's residence. The user reports Universal participation and an owner in Türkiye: November 15, 2026, 23:59 Türkiye time. This does not independently certify the actual registration or form.
- A public repository is accepted as a final-project link; GitHub Pages is optional. Save Progress is not Submit for Judging. Use `docs/submission-checklist.md`; do not invent additional mandatory files, public team identities or a requirement to upload an AI model/chat history.
- Never assert that disqualification is impossible or that this audit is official approval. Never rewrite Git history to obscure development timing or authorship.

## Checks Before Publishing

```sh
npm run check   # story data, engine, translations and disclosures
npm run check:browser   # actual controls, responsive layout, language and save/reload
git diff --check
```

Review current upstream changes before editing or pushing. Preserve other contributors' work. Keep the reference checker (`tools/check_story_data.mjs`) independent from the production engine so that `tools/check_engine.mjs` remains a real comparison. Illustrations drawn with AI assistance must keep their visible label.
