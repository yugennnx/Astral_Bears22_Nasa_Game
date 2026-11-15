# Activity Layout and Language Verification — 1.11.1

**Date:** November 15, 2026. **Baseline:** `13c49e7` (v1.11.0). **Fix version:** v1.11.1.

> AI/SI disclosure: OpenAI Codex generated the fixes, temporary browser probes and this report at the team's request. The original implementation remains credited to Anthropic Claude; story-design contributions retain their separate attribution. See [AI_USAGE.md](../../AI_USAGE.md) and [ai-usage.json](../../ai-usage.json). This is automated browser verification and source review, not a child playtest, screen-reader certification or NASA approval.

## Result

**PASS within the tested scope.** The reported stale activity translations and overlapping/obscured task controls were reproduced and corrected. All 29 choice activities can be completed with real pointer/touch input at the four tested sizes. Activity-language changes retain the task's state and displayed resource values. All five special endings remain reachable and work in the tested full playthroughs.

The decision engine, scene data, NASA observations, numerical effects, success requirements and five ending predicates are unchanged. Changes are presentation, localization, package-version and supporting documentation only.

## Reproduced issues and fixes

| Finding | Change | Verification |
| --- | --- | --- |
| The task banner translated, but existing SVG device/card labels, remaining-cube text and accessible target names stayed in the previous language. | Bind SVG text and accessible names to translation keys/values, then update existing nodes. Do not restart the task. | Both language directions checked before and during tasks, including allocated cubes, selected/sorted clues, progress and visible HUD totals. |
| World art contained unlocalized `TOMORROW`, `SOL 2` and `~20 min` labels. | Pass localized equipment labels into world/memory props; redraw the activity backdrop with the original task state during language changes. | Turkish labels render, and switching to English updates them without changing game state. |
| The instruction banner visually covered note/clue cards on short landscape screens; a laboratory target was under the HUD. | Fit matching world/task artwork into a measured region below the actual HUD, separate from instructions. Short landscape screens place instructions beside the task. | Every active target's center accepts pointer input, its bounds stay on screen and clear of both HUD and instructions. |
| Panel-cleaning, shelter and greenhouse targets overlapped; expanding rings could spill into neighboring targets with normal animations. | Space or resize those presentation targets, keep rings within their hit areas and make decorative rings ignore pointer input. | No overlapping target bounds in task-step checks; normal-animation task runs also pass. |
| The long MEDA source/date/unit sentence was clipped on phones. | Wrap translated text inside its existing data panel. | Both comparison steps retain the source note in both languages. |
| Science stars/numbers could overflow their gauge. | Let the gauge's grid track and stars shrink inside the available width. | Inspected desktop/phone screenshots and the tested language-switch HUD checks. |
| The 7A wrong-order explanation was immediately replaced by a progress redraw; its next-card Hint was not updated reliably because target events stopped bubbling. | Show the error after resetting progress and update the next-card marker for pointer and keyboard events. | Wrong-answer feedback stays visible/translatable and the correct three-note sequence completes. |
| The visitor fiction note in the mission report used a style hidden on phones. | Give the report note its own visible fiction-note presentation. | Fiction label/note remain visible on encounter pages, phone report and Journal. |

Main code: [activities](../../src/ui/activities.js), [screen rendering](../../src/ui/app.js), [styles](../../src/ui/styles.css), [world labels](../../src/ui/world.js), [interface strings](../../src/i18n/ui.js).

## Browser evidence

Tests used locally served files in installed Google Chrome through Playwright. Input was real browser click/touch activation; task controls were not bypassed with forced DOM events or keyboard fallbacks. Temporary probes and screenshots remain outside the repository.

| Test group | Result |
| --- | --- |
| 29 activities × four sizes: 1280×720, 375×812, 360×640, 844×390 | **116/116 passed**, with reduced motion. Every activity completed; all step targets were visible, unblocked and separate from the HUD/instruction banner. |
| Language switching within those activity cases | **1004 switches passed**. Existing SVG labels and accessible names match the selected language; task state, cubes/clues, progress and visible HUD values are preserved. Hints and 7A/9A wrong-answer states were exercised. |
| Normal-animation focused runs: 2A, 2C, 5B, 6C, 7A, 9A at 1280×720 and 375×812 | **12/12 passed**, including **116 language switches**. Tests wait for asynchronous robot/task actions to finish before advancing. |
| Previous question/Hint/error regressions, including the greenhouse-off 6C report task | **Six focused scenarios passed 34 language switches**; current question/error styling, document language, HUD labels and displayed totals, progress and Hint metadata remain correct. |
| Keyboard and resize checks for 2A, 2C, 5B, 6C, 7A and 9A | **12/12 passed**. Activate controls with Enter, change viewport during the task, then complete it. Progress, allocated cubes, sorted clues and resource values survive the resize; targets remain visible and clear. Clue selection in 9A also uses pointer input. |
| Complete mission flows | **17/17 expected outcomes**: 13 successes, three deliberately partial missions and one deliberate stop. These outcome counts are not test failures. All 29 choice IDs were exercised collectively. |
| Five special endings in full flows | Each passed in English desktop and Turkish phone runs, including the visitors witness. Expected resources, Science and ending ID match. |
| Focused ending navigation: five endings × 1280×720, 375×812 and 360×640 | **15/15 passed**, with **225 page checks**. Verified localized prose, language switches without page/resource reset, Back/Next, skip, report, read-again and Journal entries. No tested short page required scrolling; buttons were visible and clickable. |
| Uncaught page exceptions | None in the successful test groups above. |

The complete-flow checks also retained ordinary success, the Sol 8 greenhouse gate, the warned 5C route, an early resource stop, an in-progress save/resume, player-name persistence, replay skipping and pending fact-card reload behavior.

## Repository checks

- `npm run check`: **PASS** for story data, production engine, translations (293 story strings / 484 interface strings), independent five-ending design model and disclosure inventory (56 artifacts).
- `git diff --check`: **PASS**, no whitespace errors.
- Relative Markdown links: **99 checked / zero broken**, including the new report links.

The expected full-engine totals remain standard **8064 success / 14580 partial / 192 stopped**, dusty-season **6598 / 13289 / 640**, and small-oxygen-supply **6395 / 13309 / 97**. The existing independent checks cover all profiles; the full browser playthroughs use the standard profile. No new source-data download is necessary for this UI-only patch.

## Limits and handoff

No new confirmed functional issue remains in this review's language/task-control scope. Actual Safari/Firefox and physical-device behavior, assistive-technology pronunciation, public deployment and learning/engagement with children are not certified here. Touch-enabled Chrome viewports are emulation, not physical-phone testing. Overall pacing, permanent repository browser tests and submission/demo work remain separate tasks. This patch does not change the team's deferred license decision or assert competition eligibility.

Tuğra should pull the current `main` with a clean/safely preserved working copy and use the five-ending runtime/data as the current source of truth. The old story-only appendix and earlier reports remain history; the visitor ending has been implemented since v1.11.0.
