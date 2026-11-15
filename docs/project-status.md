# Current Project Status

> AI/SI disclosure: prepared with OpenAI Codex. See [AI_USAGE.md](../AI_USAGE.md) and [ai-usage.json](../ai-usage.json).

**Release: 1.12.0. Updated: November 15, 2026. Baseline reviewed: `d5776a7` (1.11.9).** This is the active status page. Older reports and design notes describe their own dated commits.

## Implemented

| Area | Current behavior |
| --- | --- |
| Campaign | Ten sols, 29 choices, three mission profiles |
| Rules | Energy/Oxygen/Safety 0–10, Science target 10, low-power life support, Sol 6 reserve, Sol 8 greenhouse gate |
| Outcomes | Ordinary success, partial and stopped missions; five history-dependent special endings |
| Visitor ending | Fiction label/note before the encounter, on its pages, in the report and Journal; no resources, rescue or Science bonus |
| Language | English primary; optional Turkish, including in-progress task labels and accessible names |
| Interaction | Pointer/touch/keyboard controls, Hint, observe-first devices, five thinking-task types and other hands-on tasks |
| Persistence | In-progress save/resume, completed page/report review, immediate ending discovery registration, per-mission finds and persistent Journal |
| NASA resources | Archival MEDA comparison, DONKI/source cards, sourced educational facts and NASA photographs |
| Local development | Node static server, locked development dependencies, numerical/documentation checks, permanent Chromium suite and CI workflow |

## This release

- A special ending is saved to the Journal before the player finishes its pages. Reload resumes the exact page; completed ordinary, partial and stopped reports can also be reviewed. Unknown/mismatched saved special endings are not offered for review.
- Task cameras contain required controls on narrow screens. A previous cover/crop fallback could cut off targets; the permanent viewport tests guard against it.
- Explicitly focused controls retain their native keyboard activation immediately after navigation; the reading-area debounce remains.
- The MEDA activity compares recorded temperatures without assigning day/night times that the curated extrema do not establish. Rounded values and their 74-degree difference remain unchanged.
- README, runtime contract, handoff, story metadata, compliance overview and AI records distinguish current features from development history.

Verification evidence is recorded in [the 1.12.0 review](design/release-review-1.12.0.md). Local tests are not a physical-device, accessibility-certification, child-learning or NASA-eligibility certificate. A CI workflow is configured; its actual run status must be checked separately.

## Team actions before submission

| Priority | Action | Owner | Completion evidence |
| --- | --- | --- | --- |
| Required | Confirm all members' Universal Event registration and team membership | Team Owner | Actual Members tab, no pending member |
| Required | Complete the eight English project-form sections | Submission editor | Saved official form; source/SI entries reviewed |
| Required | Provide a public demo within the official limits | Team | Tested external demo link |
| Required | Verify final-project link and referenced materials without login | Team | Private-window check; a public repository is accepted |
| Required | Resolve rights/license attestation | Team | Apache-2.0 selection recorded; team must still verify third-party rights/credits |
| Required | Submit for judging and retain confirmation before deadline | Team Owner | Official success banner/message |
| Recommended | Publish a direct playable URL | Developer | Anonymous desktop/phone check; GitHub Pages itself is not mandatory |
| Recommended | Review generated content and conduct a short child playtest | Team | Factual dated findings, without overstating learning gains |

The user reports Universal Event participation and a Team Owner residing in Türkiye. These are team statements, not independently inspected registration records. The official Universal deadline is November 15, 2026 at 23:59 in the Team Owner's area of residence: 23:59 Türkiye time for the reported residence. See [the submission checklist](submission-checklist.md).

The user authorized Apache-2.0 on November 15, 2026; [licensing scope](../LICENSING.md) and the root license are now present. Third-party rights approval is not inferred. The official form, demo, hosted link and participant registrations have not been certified by this maintenance work.

## Later product work

- Measure reading level, session length and learning with target-age children.
- Evaluate pacing, optional DUTİ conversations and a side-by-side alternative-choice replay.
- Broaden real-device, Safari/Firefox and assistive-technology checks.
- Split the large UI controller and consolidate accumulated styles when time allows; preserve the tested behavior.

These product/testing improvements are not additional NASA submission documents. Do not delay an otherwise valid official submission solely to add optional polish.
