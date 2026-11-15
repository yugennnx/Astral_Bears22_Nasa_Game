# Ten-Sol Runtime and Save Contract

> AI/SI disclosure: rewritten for the current runtime with OpenAI Codex. Earlier contract and implementation contributions remain credited in [AI_USAGE.md](../../AI_USAGE.md) and [ai-usage.json](../../ai-usage.json).

**Current contract: 1.12.0.** This replaces the former six-sol runtime description. [Chapter One](story-plan.md) is narrative history; its former Science target of 6 is not the current win condition.

## Modules and state

`src/game/scenes.js` exports `MISSION`, `SCENES` (an object keyed by scene ID), `SCENE_ORDER`, `ENDINGS`, `SPECIAL_ENDINGS`, `NASA_SOURCES` and `AI_DISCLOSURE`. `src/game/engine.js` implements pure functions over JSON-compatible state. UI activities never award resources independently.

The engine's state contains:

- `sol`, `sceneId`, `profileId`: the current location and one of the three mission profiles.
- `resources`: integer `energy`, `oxygen`, `safety`, each clamped to 0–10 after an effect group.
- `science`: cumulative, uncapped integer research progress; success target 10, current reachable maximum 15.
- `flags`: preparation, greenhouse, Earth guidance, research, signal, capsule, broadcast and final-action state; `checkpointSuppliesReleased` prevents duplicate supply release.
- `history`: ordered choice IDs, one per completed decision; current-run history alone selects a special ending.
- `phase`: `scene`, `feedback`, `transition` or `ended`.
- `status`: `playing`, `success`, `partial` or `failed`.
- `pending`, `lastTransition`, `log`, `ending`: engine-owned applied effects, feedback, transition and outcome details.

Create state with `createGame(profileId)`, not by editing the shared initial state. `getChoices(state)` exposes resolved effects, availability, warnings, projected transition and checkpoint. `choose(state, choiceId)` validates the phase and option, records it once and returns a new state. Old states and scene data must remain unchanged.

## Choice and transition order

1. Resolve the first matching conditional variant; its effect object replaces the base effect object.
2. Check minimum Safety, history gates and upfront Energy/Oxygen costs. Costs greater than reserves disable an option; exact depletion is warned about.
3. Apply immediate effects and flags, clamp the three resources, accumulate Science and append the decision once. Any resource at zero stops the mission immediately.
4. Show feedback in order. `finishFeedback` applies delayed flags. Earth guidance cannot benefit the decision that is still awaiting its reply feedback.
5. After a surviving Sol 6 decision and its feedback, release the already-stored reserve once: Energy +2, Oxygen +4. It is not an instant delivery from Earth.
6. Apply the shared transition after Sols 1–9 only. Clear recharge is +1 Energy; dusty recharge is 0, plus +1 for serviced panels. Oxygen use is −1, plus another −1 if Energy immediately after the decision was at most 2. The Sol 6 supply release does not change that low-power snapshot.
7. Check depletion again. `finishTransition` opens the next scene and detects a state with no available choice. There is no transition after Sol 10.
8. At Sol 10, full success requires Energy ≥1, Oxygen ≥1, Safety ≥4 and Science ≥10. Surviving but missing research/Safety requirements is partial. Exhaustion/no available choice is failed.

## Profiles and gates

| Profile | Initial Energy / Oxygen / Safety | Dust after sols |
| --- | --- | --- |
| standard | 8 / 8 / 8 | 2, 4, 8 |
| dusty-season | 8 / 8 / 8 | 2, 3, 4, 7, 8 |
| small-oxygen-supply | 8 / 7 / 8 | 2, 8 |

The Sol 6 exploration task needs Safety ≥6. The Sol 8 living-tray option needs 3A or 3B in current history. A collected sample improves 6A; greenhouse mode changes 6C and its correct activity/report. Preserve these resolved variants and the explicit 5C risk warning.

## Five special endings

Success is evaluated before special-ending selection. The engine validates a complete ordered ten-choice history and matches `allChoices` plus every `anyChoiceGroups` group. The five implemented predicates are mutually exclusive. They grant no resources and cannot replace a partial/failed outcome. See [the story plan](ten-sol-story-plan.md#developer-spoilers-five-discoverable-endings) for the complete chains, including the explicitly fictional visitors ending.

The ending report contains actual resources/Science, current-run highlights and the next-crew food/Safety report. A shut-down greenhouse changes that report even when a research mission succeeds. Safety is an abstract operational margin, not radiation dose or medical recovery.

## Browser persistence

The UI uses `compass-outpost-save-v3` for the ten-sol mission and its current screen/language/page, pending fact, predictions, score and current-mission `found` IDs. `compass-outpost-profile-v1` contains the optional name, persistent discoveries/facts/endings and replay-reading history. Sound preferences have a separate local key.

- Do not reinterpret old six-sol saves as this campaign or fabricate missing history.
- A new mission clears current `found` IDs; it does not clear the persistent Journal.
- Activities use the committed decision with pre-decision displayed totals; changing language must not apply effects twice or reset a task.
- A valid special ending is recorded when its pages first open. Reload can resume the exact ending page; a completed report remains reviewable. The Journal must not unlock an ending from another run's discoveries or a malformed saved ending.
- Do not retroactively assign a new special ending to an old completed ordinary-success save.
- Storage can be unavailable. The game remains playable, but browser persistence cannot then be guaranteed.

English remains primary; optional Turkish must cover all visible story/interface strings. Preserve NASA archival labels, data qualifications, AI art labels and visitor fiction notes in both languages. Exact storage behavior is presentation state, not part of the resource simulation.

## Verification and history

Run `npm run check` and `npm run check:browser`. The production-engine comparison and the independent design enumeration remain separate calculations. Browser tests exercise actual controls and save/reload; none is a child learning study or organizer approval. See [project status](../project-status.md) and [maintenance](../maintenance.md).

The former contract is retained in Git history; historical integration decisions are in [ten-sol-integration-notes.md](ten-sol-integration-notes.md). The current contract above takes precedence over their past-tense implementation notes.
