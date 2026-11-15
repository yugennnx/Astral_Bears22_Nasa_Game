# Independent Regression Report — 5834e11

**Date:** November 15, 2026. **Version:** 1.10.1. **Tested commit:** `5834e11ec5f9a5b731efd3fe73a84d15b7cb27b1`.

**Previous review:** [Repository review of 761bb66](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/c5c8076/docs/design/repository-review-761bb66.md), published in `c5c8076`.

**AI/SI disclosure:** Prepared with OpenAI Codex. Temporary browser probes and this report were AI-generated for an independent follow-up requested by the team. No game source, game data, artwork, translation or dependency was modified by this review. Publication adds this report and AI contribution records only. Screenshots and temporary harnesses are retained outside the repository; the reproduction steps below require no private files.

## Result

**The eight original findings are verified fixed.** The additional phone-layout improvement to 5B is also verified. Engine outcomes and the four special endings remain unchanged. No P0/P1 defect was confirmed in this follow-up.

**One additional P2 interface issue remains:** switching language during the second step of 2C replaces the current question with the activity's generic introduction. The answers, mathematical outcome and resource state remain intact. This is a newly identified case, not evidence that this patch introduced it; the relevant redraw logic was unchanged by `5834e11`.

The three items Claude deliberately left unchanged—long scrolling special endings, pacing, and permanent automated browser regression tests—remain open backlog items. They are not recorded as failed attempts to fix the original eight findings.

## Verification of the previous findings

| Previous finding | Result | Evidence |
| --- | --- | --- |
| P1: 2C answers covered by the desktop task banner | **PASS — fixed** | All three labels, 7° / 74° / 30°, are fully in view and not covered by the banner/HUD at 1280×720 and in the 375×812 touch-enabled probe. Their desktop label boxes start at approximately y=475, below the banner. Both wrong and correct answers can be selected. |
| P2: Hint button cannot receive clicks/taps | **PASS — fixed** | Computed pointer behavior is `auto`, the control is 44×44 pixels, real pointer activation changes the guidance, and a real touch tap works. The dark question mark on yellow is visibly clearer. |
| P2: Prediction explanation implies solar production overnight | **PASS — fixed** | Both languages now include the remaining daylight and the following night; the English clear-sky explanation explicitly states that panels make no power at night and the battery supplies the base. The numerical model is unchanged. |
| P2: Incorrect 2A allocation marked complete | **PASS — fixed** | With normal animations, giving all three cubes to the lamp produces `finished: false`, readable dark-red retry text, and a retained Hint button. It does not enter the green completion state. Valid 2A allocations complete in the full playthroughs. |
| P2: Pending fact lost on reload | **PASS — fixed** | Reloading the uncollected Sol 3 Veggie card offers it again. After collecting it, the journal changes from `dusty-world, moxie` to `dusty-world, moxie, veggie-garden`. The restored card appears once and the expected ten-decision outcome is preserved. |
| P2: Source of the twelve suggestions unclear | **PASS — fixed** | The contribution account now separates OpenAI Codex-assisted review suggestions, the team's selection/direction, and Claude-assisted implementation. The underlying-idea attestation is unchanged. |
| P3: Saved name blank on replay | **PASS — fixed** | After a mission as Arda, New Mission prefills `Arda`. The replay Skip ahead control still appears. |
| P3: Design status incorrectly says unimplemented | **PASS — fixed** | The plan and handoff prominently identify themselves as the original design implemented in v1.9.0 and link to the integration notes. Old six-sol wording is explicitly historical. |
| Additional observation: 5B third target mostly outside phone view | **PASS — improved** | The third scan target moves from x=1360 to x=1180 and its camera framing changes accordingly. The former center-outside-viewport condition was not reproduced in the exercised 375-pixel phone routes; pointer selection completes the task. |

Useful implementation anchors: [new 2C answer placement](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/5834e11/src/ui/activities.js#L763), [Hint styling](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/5834e11/src/ui/styles.css#L876), [2A validation before completion](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/5834e11/src/ui/activities.js#L725), [pending-card serialization](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/5834e11/src/ui/app.js#L98), [pending-card restoration](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/5834e11/src/ui/app.js#L1662).

## Automated repository and data checks

| Check | Result |
| --- | --- |
| `npm run check` | **PASS**: story, production engine, translations, independent expansion model, disclosures. |
| Standard profile | **8064 success / 14580 partial / 192 stopped**, matching the reference model. |
| Dusty-season profile | **6598 success / 13289 partial / 640 stopped**, matching the reference model. |
| Small-oxygen-supply profile | **6395 success / 13309 partial / 97 stopped**, matching the reference model. |
| Science and endings | Target **10**, maximum reachable **15**; every choice remains on a successful path and every special ending remains reachable in every profile. |
| Translation coverage | **269 story strings and 415 interface strings**, with matching placeholders. This is a structural check, not a child reading-level assessment. |
| Attribution before this report's publication | **51 artifacts** verified, including the previous review. |
| Existing relative Markdown links at the tested commit | **75 checked; 0 broken** across a 60-file tracked repository. |
| Whitespace | `git diff --check c5c8076 5834e11` passed. |
| NASA source snapshots | The cached original MEDA CSVs reproduce the three stored temperature summaries, sample counts and hashes. The cached DONKI response reproduces the recorded start and separate shock/bulk analyses. Raw-source integrity checks pass. These were cached-snapshot checks, not a fresh download of every scientific source. |

The patch changes no engine rule, scene effect, success threshold or special-ending predicate. The solar explanation is consistent with the distinction between daytime charging and nighttime battery use in [NASA's Mars surface-power discussion](https://www.nasa.gov/wp-content/uploads/2024/12/acr24-mars-surface-power-decision.pdf).

## Browser regression coverage

**Nineteen playthrough scenarios reached their expected outcomes:** 14 successful missions, four deliberately partial missions, and one deliberate resource stop. These are expected scenario outcomes, not counts of failed tests. Collectively they exercise all **29 choices**. No uncaught page exceptions were recorded in the completed runs.

The test matrix includes:

- All four special endings at 1280×720 in English and 375×812 in Turkish.
- Ordinary success, partial completion, the warned 5C risk, a resource stop, and the locked 8A option after shutting down the greenhouse.
- Resume from a saved choice screen, reload during an uncollected fact card, name persistence and replay skipping.
- A dusty-season playthrough at 1366×768 in English and a small-oxygen-supply playthrough at 390×844 in Turkish.
- Two complete normal-motion runs: ordinary success at 1280×720 in English and partial completion at 375×812 in Turkish. Other complete runs used reduced motion for deterministic traversal.
- Four focused probes: normal-motion 2A retry feedback; desktop 2C visibility/language/answer handling; touch-enabled phone 2C, Hint and mute persistence; and a 1366-pixel fact-card pointer/stability check.

The touch-enabled probe used browser touch input, not a simulated JavaScript click handler. Wrong answers, Hint, a correct answer and the mute control were exercised; mute remained stored as `off` after reload. The correct 2C answer awarded exactly one Science Point and preserved the expected resources/history.

### Special-ending results

| Ending | Standard-profile history | Final E / O / S | Science | UI result |
| --- | --- | --- | --- | --- |
| The Stone That Kept Time | 1A 2B 3A 4C 5A 6A 7A 8A 9A 10A | 4 / 3 / 8 | 11 | PASS, English desktop and Turkish phone |
| The Smallest Garden on Mars | 1A 2A 3A 4A 5B 6C 7B 8A 9A 10B | 5 / 4 / 8 | 10 | PASS, English desktop and Turkish phone |
| DUTİ's Secret Constellation | 1B 2A 3A 4B 5A 6B 7B 8B 9B 10C | 5 / 4 / 9 | 10 | PASS, English desktop and Turkish phone |
| The Lantern Network | 1A 2A 3A 4A 5B 6A 7B 8C 9A 10A | 5 / 4 / 8 | 10 | PASS, English desktop and Turkish phone |

The same Stone path also passed in dusty season at **4 / 3 / 8, Science 11**, and with the smaller oxygen supply at **4 / 2 / 8, Science 11**.

### Automation observations

Initial normal-motion attempts needed better synchronization with the observe-device demonstration, disabled card-collection button and long message-sending activity. The temporary harness was corrected to wait for completion/progress instead of clicking an in-flight control again; the final normal-motion runs completed.

At 1366×768, Playwright's locator stability check repeatedly timed out on one fact-card button. A focused measurement recorded identical button bounds over 30 samples, and a normal mouse click at its verified unobscured center collected the card and advanced to the morning summary. The dusty-season full run used this checked coordinate-click fallback for two cards. No forced DOM events, style modifications or game-source changes were used. This is recorded as an automation limitation, not a confirmed player-facing progression defect.

## Additional remaining issue

### P2 — Switching language during 2C loses the current question

**Location:** [app.js:1346–1349](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/5834e11/src/ui/app.js#L1346).

**Reproduction:**

1. Start the English 2C measurement task.
2. Select B (−77 °C), reaching the second question with 7° / 74° / 30° answers.
3. Switch the interface to Turkish using the top-bar language button.

**Expected:** The current temperature-difference question is translated, and the child still knows what the three numbers answer.

**Actual:** The question changes from “From −3 °C down to −77 °C: how many degrees colder is the night?” to the generic introduction “Gerçek Perseverance verisi: Jezero Krateri'nde tek bir Mars gününden iki hava ölçümü.” The three numerical answers remain. This was reproduced on desktop and in the touch-enabled phone context.

The activity's `redraw()` branch uses `t(current.task)`, which describes the start of the activity, rather than its current substep. Hint and wrong-answer messages can still be displayed in the new language; the task can still be completed. Resources and Science were correct afterward. The relevant redraw branch did not change in this patch, so this is an additional remaining finding rather than a newly introduced regression.

**Recommendation:** Keep the active task substep/prompt key in presentation state and translate that prompt on redraw. Preserve the current question, hint or error state as appropriate instead of restoring the initial task description. Add a regression test that switches language after entering the second step and asserts that the translated difference question remains visible.

## Explicitly deferred work

| Item acknowledged by Claude/the team | Verification and interpretation |
| --- | --- |
| Long, scrolling special-ending screen | **Still open, intentionally unchanged.** For the Stone ending, content/visible height was 998/527 pixels on the tested desktop and 1247/683 on the phone. All story/evidence content remains present and scrollable. Short story pages or a clearer visual payoff remain product recommendations, not a failure of the present fix scope. |
| Long overall pacing | **Still open, intentionally unchanged.** The story/spotlight/exploration/choice/task/feedback/transition structure remains. Scripted interaction counts depend on motion settings and whether typing/cutscenes are skipped; they are not measurements of children's reading speed, attention or play time. Child observation is still needed. |
| Permanent automated browser regression tests | **Still open, intentionally unchanged.** The repository check commands remain data/engine/i18n/disclosure checks. This independent review's temporary browser harnesses were run outside the repo and were not added to the project's test suite. Do not describe them as installed CI coverage. |

## Recommended next work for Tuğra

1. Address the current-prompt language-switch case without changing the tested resource model.
2. Add permanent browser tests for visible 2C answers, real Hint pointer/touch activation, invalid 2A retry, pending-card reload, name prefill and the language-switch substep.
3. Keep special-ending pagination and pacing as separate product changes. Test those with children before combining them with another large mechanics change.

No further adjustment to engine values or ending predicates is supported by this regression result. This review did not test every browser engine, physical device, or assistive technology and did not include a child playtest or a deployed-production certification.
