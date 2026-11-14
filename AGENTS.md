# Project Instructions

## Active Project

- Use `docs/design/story-plan.md`, `src/game/scenes.js`, and `docs/design/story-data-contract.md` as the active six-sol prototype. Preserve the latest mission profiles and low-power life-support rules unless the team explicitly changes them.
- The companion's display name is **DUTİ**; its code ID is `duti`.
- Use English in code, story, UI, documentation, and materials linked for submission. Save UTF-8 files.
- Archive files are historical context, not the active game engine.
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
- Never assert that disqualification is impossible or that this audit is official approval. Never rewrite Git history to obscure development timing or authorship.

## Checks Before Publishing

```sh
npm run check   # = node tools/check_story_data.mjs && node tools/check_disclosures.mjs
git diff --check
```

Review current upstream changes before editing or pushing. Preserve other contributors' work. Keep the reference checker distinct from a production engine and do not describe a data-only module as a playable game.
