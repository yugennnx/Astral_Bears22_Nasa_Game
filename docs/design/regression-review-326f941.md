# Independent Regression Report — 326f941

**Date:** November 15, 2026. **Version:** 1.10.2. **Tested commit:** `326f941162cfb37cfde8bb2e0bfacf766a59507c`.

**Previous report:** [Independent regression report for 5834e11](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/8a359ea/docs/design/regression-review-5834e11.md).

**AI/SI disclosure:** Prepared with OpenAI Codex at the team's request. Browser harnesses and this report were AI-generated. Test harnesses and screenshots remain outside the repository. No runtime code, data, balance, translation, dependency or artwork was modified during this review; publication adds documentation and AI contribution records only. This is automated verification and code review, not a child playtest.

## Result

**The requested P2 fix is verified:** changing language during a thinking task now preserves and translates the active question, hint or retry message. The original 2C second-question failure was not reproduced. There was no confirmed P0/P1/P2 regression in the exercised cases.

Fifteen playthrough scenarios reached their expected outcomes, all 29 choice IDs were exercised, and all four special endings were displayed in English desktop and Turkish phone runs. Four focused scenarios verified **28 language changes** while keeping resources, Science and decision history unchanged.

One low-priority **P3 language-metadata/HUD refresh observation** remains, documented below. It does not invalidate the current-prompt fix or prevent completion.

The three items deliberately deferred by the team—long scrolling special endings, overall pacing, and permanent browser tests—are still open. They are not classified as failed fixes in this report.

## What changed

`326f941` stores the current message key and error state in `app.taskLine`. Custom activities now send translation keys rather than already-translated strings. Activity redraw translates the stored key, while progress updates and activity start/end clear it. The Hint action stores its key as well.

The patch changes no production-engine code, scene effect, mission-profile value, Science target, or special-ending condition. The package version is now 1.10.2.

Relevant code: [current-prompt storage](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/326f941/src/ui/app.js#L855), [activity redraw](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/326f941/src/ui/app.js#L1350), [Hint message storage](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/326f941/src/ui/app.js#L1574), [message-key API](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/326f941/src/ui/activities.js#L581).

## Focused verification of the fix

| Scenario | Checks | Result |
| --- | --- | --- |
| 2C, English desktop, 1280×720 | Switch English → Turkish → English for question 1, wrong-answer feedback 1, question 2, Hint, and wrong-answer feedback 2 | **PASS: 10 language switches.** The correct substep text and error styling are preserved. |
| 2C, Turkish touch-enabled phone, 375×812 | Repeat the same question/error/Hint sequence in both directions using real browser touch input | **PASS: 10 language switches.** The difference question stays visible above 7° / 74° / 30° answers. |
| 2B, Turkish touch-enabled phone | Select an incorrect rock, switch the missing-feature explanation both ways, then switch Hint both ways and collect the correct rock | **PASS: 4 language switches.** No raw message key is displayed. |
| 2A, English desktop with normal animations | Switch initial instructions both ways; make an incorrect allocation and switch the retry message before the timed reset; verify reset clears the old message; switch Hint and complete a correct allocation | **PASS: 4 language switches.** Retry state is not marked finished, error styling is retained until reset, and reset returns to the localized task instructions. |

All 28 switch checks compared the visible text to the correct English/Turkish entry and checked the `is-miss` state. Each also compared the resource values, Science and history before/after the switch; none changed.

After correct completion, the focused scenarios produced these expected decision states, before the shared transition:

| Choice | Energy / Oxygen / Safety | Science | History |
| --- | --- | --- | --- |
| 2A | 6 / 10 / 9 | 0 | 1B, 2A |
| 2B | 7 / 5 / 9 | 2 | 1B, 2B |
| 2C, both focused contexts | 7 / 7 / 9 | 1 | 1B, 2C |

No uncaught page exceptions occurred in the focused tests.

## Broader browser regression

Fifteen independent scenarios completed with **11 expected successes, three deliberately partial outcomes, and one deliberate resource stop**. These are scenario outcomes, not counts of failed tests. Collectively they cover all 29 choices.

Coverage includes:

- All four special endings at 1280×720 in English and 375×812 in Turkish.
- Ordinary success, partial completion, warned risky 5C, a resource stop, and 8A disabled after 3C.
- 2A/2B/2C activity completion, working Hint activation, and visible 2C answers.
- Resume from a choice screen, reload before collecting a fact card, saved-name prefill and replay skipping.
- Sol 6 continuation and its reserve release, later scenes, and Sol 10 outcomes.

The broader browser routes used the standard profile and reduced motion; the normal-animation check in this cycle was the focused 2A retry scenario. Full normal-motion campaigns from the previous review were not claimed as fresh tests of this commit. Engine enumeration below checks all three profiles.

### Special-ending outcomes

| Ending | History | Final E / O / S | Science | English desktop / Turkish phone |
| --- | --- | --- | --- | --- |
| The Stone That Kept Time | 1A 2B 3A 4C 5A 6A 7A 8A 9A 10A | 4 / 3 / 8 | 11 | PASS / PASS |
| The Smallest Garden on Mars | 1A 2A 3A 4A 5B 6C 7B 8A 9A 10B | 5 / 4 / 8 | 10 | PASS / PASS |
| DUTİ's Secret Constellation | 1B 2A 3A 4B 5A 6B 7B 8B 9B 10C | 5 / 4 / 9 | 10 | PASS / PASS |
| The Lantern Network | 1A 2A 3A 4A 5B 6A 7B 8C 9A 10A | 5 / 4 / 8 | 10 | PASS / PASS |

The earlier name fix remained effective (`Arda` was prefilled on replay). The pending Veggie card was offered after reload and added once to the collection. No uncaught page exceptions were recorded in the 15 completed runs.

## Repository checks

| Check | Result |
| --- | --- |
| `npm run check` | **PASS**: story structure, production engine, translations, independent expansion model, and disclosures. |
| Standard profile | 8064 success / 14580 partial / 192 stopped, matching the reference model. |
| Dusty-season profile | 6598 success / 13289 partial / 640 stopped, matching the reference model. |
| Small-oxygen-supply profile | 6395 success / 13309 partial / 97 stopped, matching the reference model. |
| Science and reachability | Target 10; maximum reachable 15; all choices and special endings retain the design's reachability. |
| Translation coverage | 269 story strings and 415 interface strings with matching placeholders. |
| Attribution before publishing this report | 52 artifacts verified; stored raw-source hash and source receipts pass. |
| Relative Markdown links at the tested commit | 77 checked; 0 broken. |
| Whitespace | `git diff --check 8a359ea 326f941` passed. |

Scientific datasets and the NASA source-verification tool did not change in this patch. No new live scientific-source download or new competition-rule audit was performed in this cycle.

## Low-priority follow-up: P3 language metadata and HUD labels

While an activity is running, changing the language updates the prompt and top bar, but the activity redraw branch returns after `renderTopbar()` without a full render. As a result:

- `getLanguage()` correctly returns the new language and the current prompt is correctly translated.
- The document's `<html lang>` still contains the language from the last full render. In the desktop probe, Turkish task text coexisted with `lang="en"`; the phone probe reproduced the reverse direction.
- Existing HUD labels also retain their previous language until the next HUD render. The desktop screenshot showed English resource labels beside the correctly translated Turkish question.

This was not treated as a failure of current-prompt retention. It is a separate, pre-existing refresh detail; the early return already existed before this patch. It does not alter resources or stop the task. Out-of-date language metadata may matter to assistive tools, but actual screen-reader pronunciation was not tested.

**Reproduction:** Enter 2C in English, select the colder B reading, switch to Turkish, then inspect the visible question, resource labels and `document.documentElement.lang` before leaving the activity.

**Recommendation:** Refresh the document language and the HUD's localized labels in the activity redraw path while preserving the displayed resource totals, current question/error/Hint, focus and progress. The full-render path updates the document language at [app.js:1325](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/326f941/src/ui/app.js#L1325); the activity branch returns at [app.js:1358](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/326f941/src/ui/app.js#L1358).

## Deliberately deferred work

| Item supplied by Claude/the team | Status |
| --- | --- |
| Long scrolling special endings | **Still open by choice.** Text and evidence remain present and scrollable. Shorter story pages or distinct visual payoffs remain product work, not a failed fix in 1.10.2. |
| Overall pacing | **Still open by choice.** The main presentation sequence is unchanged. No child attention or play-time measurement is claimed by these scripted runs. |
| Permanent automated browser tests | **Still open by choice.** The repository still has no installed browser regression suite for these interaction cases. The temporary probes used for this report remain outside the repo and must not be described as CI coverage. |

For a future permanent suite, preserve the tests for question 1/question 2, errors, Hints, timed retry reset, touch activation, unchanged resource/history state, pending-card reload and document-language refresh.

The targeted P2 issue can be closed on this evidence. The P3 refresh observation and the three deferred product/testing items can be tracked separately. No game fixes were applied by this reviewer, and this result does not substitute for testing with children or testing every browser and physical device.
