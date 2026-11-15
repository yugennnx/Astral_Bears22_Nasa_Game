# Independent Regression Report — 6bd524b

**Date:** November 15, 2026. **Version:** 1.10.3. **Tested commit:** `6bd524b9269e8264a7109fb733c9cb3b394caff8`.

**Previous report:** [Regression review of 326f941](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/c58adfb/docs/design/regression-review-326f941.md).

**AI/SI disclosure:** Prepared with OpenAI Codex at the team's request. Temporary browser harnesses and this report were AI-generated. No game source, resource rule, scene data, translation or asset was modified during this review. Publication adds this report and AI contribution records only. Temporary harnesses/screenshots remain outside the repository. This is automated verification and code review, not a child playtest or a screen-reader certification.

## Result

**The previously reported P3 issue is verified fixed.** During an activity, switching language updates the document language, displayed HUD labels and full task banner while retaining the displayed numbers, progress, current question/Hint/error, and completed state when applicable.

The earlier P2 current-prompt fix also remains effective. **No new reproducible functional defect was found in this test scope.** This is not a claim that every browser, device or interaction is defect-free.

The three deliberately deferred items remain product/testing backlog: long scrolling special endings, overall pacing, and permanent browser regression tests. The team-reported GitHub Pages publication and planned 30-second demo are separate delivery tasks; neither was performed or certified by this review.

## Patch examined

The runtime change is limited to `src/ui/app.js`: it records task progress and rebuilds the localized task banner during an activity-language redraw. It explicitly updates `<html lang>` and calls `renderHud()` with the values already displayed in `app.hudShown`, then restores the current message and error style. No engine code, choice effects, mission profiles, special-ending predicates or science values changed.

Relevant source: [progress initialization](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/6bd524b/src/ui/app.js#L848), [progress updates](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/6bd524b/src/ui/app.js#L870), [language/HUD/banner redraw](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/6bd524b/src/ui/app.js#L1352).

## Focused browser results

Six focused scenarios passed **34 language-switch checks**. Tests compared the following before and after each switch:

- The real application language and `document.documentElement.lang` agree.
- The four HUD names match the selected language.
- Visible numerical values, resource bars and earned Science stars are unchanged.
- Task progress counts and dots are unchanged; the progress sentence is translated.
- Hint accessible label and tooltip are translated when the button is present.
- The current question/Hint/retry text and its `is-miss` styling are preserved.
- Engine resources, Science and decision history are unchanged by language switching.

| Focused scenario | Language switches | Result |
| --- | --- | --- |
| 2C, 1280×720 English desktop | 10 | PASS: both questions, both wrong-answer messages and Hint translate correctly in both directions. |
| 2C, 375×812 Turkish touch-enabled phone | 10 | PASS: the same substeps work with real browser touch input; the three numeric answers remain visible. |
| 2B, Turkish touch-enabled phone | 4 | PASS: wrong-rock feedback and Hint translate in both directions; the correct sample can still be collected. |
| 2A, English desktop with normal animations | 5 | PASS: initial instructions, timed retry feedback, Hint and completed banner translate correctly. Retry resets the old message; switching at 3/3 retains `is-finished`. |
| 1B generic shelter task | 3 | PASS: switching at 1/3 preserves progress and localizes the generic task and Hint. |
| 6C existing-records task, Turkish touch phone | 2 | PASS: the greenhouse-off activity variant retains its correct task text and 1/3 progress in both languages. |

### Displayed values were tested separately from committed engine values

This matters because the task intentionally displays pre-decision resource totals while the engine has already recorded the choice. The test therefore checked the visible HUD, not just the underlying saved state.

For example, during 2C the HUD remained **Energy 8 / Oxygen 7 / Safety 9 / Science 0 of 10** across language changes, even though the committed decision state was already **7 / 7 / 9 / Science 1**. Switching languages did not prematurely reveal or reapply the choice effects. After normal task completion, the committed state remained correct.

The generic 1B and the greenhouse-off 6C report variant also preserved their distinct pre-decision HUD values. The completed 2A check retained its completion state and progress while translating its closing text.

No uncaught page exceptions occurred in these focused scenarios. Actual screen-reader pronunciation was not tested; the DOM language and accessible Hint metadata were checked directly.

## Broader regression results

Fifteen playthrough scenarios reached their expected outcomes: **11 successes, three deliberately partial outcomes and one deliberate resource stop**. These are expected game results, not failed-test counts. All **29 choice IDs** were exercised collectively.

The runs covered all four special endings at 1280×720 in English and 375×812 in Turkish, ordinary success, partial completion, risky 5C, a resource stop, the 8A greenhouse gate, name persistence, replay skipping, resume and pending-card reload. No uncaught page exceptions were recorded.

| Special ending | Final Energy / Oxygen / Safety | Science | English desktop / Turkish phone |
| --- | --- | --- | --- |
| The Stone That Kept Time | 4 / 3 / 8 | 11 | PASS / PASS |
| The Smallest Garden on Mars | 5 / 4 / 8 | 10 | PASS / PASS |
| DUTİ's Secret Constellation | 5 / 4 / 9 | 10 | PASS / PASS |
| The Lantern Network | 5 / 4 / 8 | 10 | PASS / PASS |

The broad browser runs used the standard profile and reduced motion. Normal animation timing was exercised in the focused 2A scenario. All three resource profiles were exhaustively checked by the engine/model commands below; this report does not claim full browser runs for every profile or every normal-animation path.

## Repository checks

| Check | Result |
| --- | --- |
| `npm run check` | PASS: story, production engine, translations, independent design model and disclosures. |
| Standard profile | 8064 success / 14580 partial / 192 stopped, matching the independent model. |
| Dusty-season profile | 6598 success / 13289 partial / 640 stopped, matching the independent model. |
| Small-oxygen-supply profile | 6395 success / 13309 partial / 97 stopped, matching the independent model. |
| Science | Target remains 10; maximum reachable total remains 15. |
| Translations | 269 story strings and 415 interface strings have corresponding Turkish entries and matching placeholders. |
| Attribution before publishing this report | 53 artifacts verified, including raw-source hash and source receipts. |
| Relative Markdown links at the tested commit | 79 checked; 0 broken. |
| Whitespace | `git diff --check c58adfb 6bd524b` passed. |

There was no new scientific dataset or competition-rule change to audit in this patch. No new live NASA-source download or event-eligibility certification was performed.

## Open work kept separate from defect verification

| Item | Status |
| --- | --- |
| Long scrolling special endings | Intentionally unchanged. All ending content remains present and scrollable; shorter story pages/visual payoff remain product choices. |
| Overall pacing | Intentionally unchanged. Scripted runs do not establish children's reading speed or attention; child observation is still needed. |
| Permanent browser regression tests | Intentionally unchanged. The temporary probes for this review are not installed project tests or CI coverage. |
| GitHub Pages publication | Team-reported delivery task; no deployment was made in this review and a production link was not validated here. |
| Planned 30-second demo | Team-reported delivery task; no demo was created or reviewed here. |

The P3 finding from the previous report can be closed on this evidence. No further game-code fix is proposed from this cycle. Next work can be tracked as product decisions, permanent test coverage and delivery preparation; this conclusion remains limited to the browsers, fixtures and checks described above.
