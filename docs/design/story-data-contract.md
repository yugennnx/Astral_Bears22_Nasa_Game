# Six-Sol Story Data: Integration Guide

**Planned continuation:** the [ten-sol story](ten-sol-story-plan.md), [JSON design](../../data/ten-sol-story-design.json), and [implementation handoff](ten-sol-implementation-handoff.md) define a future ten-sol edition. They do not change the current runtime contract below. In particular, the present final scene and Science target remain six-sol rules until that edition is integrated.

> AI/SI disclosure: generated/revised with OpenAI ChatGPT/Codex and Anthropic Claude. See [AI_USAGE.md](../../AI_USAGE.md) and [ai-usage.json](../../ai-usage.json) for contribution scope and the team's idea-origin attestation.

This guide describes the English scene data in `src/game/scenes.js`, based on `story-plan.md`. The companion's display name is **DUTİ** and the code identifier is `duti`.

The retired ten-sol design and its Python simulator are kept only for history in `archive/ten-sol-design-v0/`. The active rules are `story-plan.md` (v1.2) and this scene data. See `docs/changelog/v1.2.md` for what changed.

## Exports

```js
import {
  MISSION,
  SCENE_ORDER,
  SCENES,
  ENDINGS,
  NASA_SOURCES,
} from "./game/scenes.js";

const initialState = structuredClone(MISSION.initialState);
const firstScene = SCENES[initialState.sceneId];

console.log(MISSION.robot.displayName); // DUTİ
console.log(firstScene.title); // Welcome to Mars
console.log(firstScene.story); // Ordered English dialogue blocks
console.log(firstScene.choices); // The first scene's two choices
```

The relative import above assumes the caller is `src/main.js`. Adjust the path for another caller.

- `MISSION`: identity, starting state, bounds, success thresholds, opening text, common English labels, shared transition rules (`recharge`, `lifeSupport`), mission `profiles`, and the `nextCrewReport` texts.
- `SCENE_ORDER`: the six scene IDs in order.
- `SCENES`: complete English story blocks, choices, conditional variants, feedback, transitions, and source-card references.
- `ENDINGS`: English outcome messages. Add actual totals and specific causes from game state.
- `NASA_SOURCES`: attribution links. These are reference records, not live API responses or raw measurement datasets.
- `AI_DISCLOSURE`: exported AI/SI provenance metadata. It is also exposed as `MISSION.aiDisclosure`; show `MISSION.creditsCard` in the eventual credits/about/source view.

Treat all exports as read-only templates. Clone the starting state for every new game. Keep the game state in the engine or the application's state store, rather than mutating scene definitions.

## Scene Shape

```js
{
  id: "power-shortage",
  sol: 2,
  title: "Power Shortage",
  visualKey: "power-budget",
  story: [{ speakerId: "duti", text: "..." }],
  learningGoal: "...",
  choices: [/* two or three choices */],
  transition: { note: "optional extra explanation" }, // values come from MISSION rules + profile
  nextSceneId: "greenhouse-problem"
}
```

`speakerId` is either `narrator` or `duti`. Preserve the order of `story` blocks. `visualKey` is an asset lookup key; the corresponding images are still to be created or selected.

The final scene has `transition: null` and `nextSceneId: null`.

## Choice Shape

```js
{
  id: "2B",
  label: "Collect a rock sample outside",
  effects: { energy: -1, oxygen: -2, safety: 0, science: 2 },
  setFlags: { sampleCollected: true },
  futureConsequence: "The final laboratory study will award 4 Science instead of 2.",
  feedback: [{ speakerId: "duti", text: "..." }]
}
```

Negative Energy or Oxygen effects are upfront costs. Positive values are gains. A negative Safety effect is a risk consequence. Science is mission progress, kept outside `state.resources`; do not clamp it to the target of 6.

Optional fields:

- `requirements.minSafety`: a minimum Safety value before selection. Choice 6B requires 6.
- `warning`: a player-visible risk warning, especially for 5C.
- `setFlags`: apply with the decision's immediate effects.
- `setFlagsAfterFeedback`: apply only after the final feedback card has been acknowledged. Choice 4A unlocks `earthGuide` after the reply arrives.
- `variants`: conditional overrides resolved from earlier state.

Do not invent an extra resource charge from `futureConsequence`; that field explains effects already represented elsewhere in the data.

## Resolving Conditional Variants

A variant has this shape:

```js
{
  when: { flag: "sampleCollected", equals: true },
  overrides: {
    effects: { energy: -2, oxygen: 0, safety: 0, science: 4 },
    feedback: [{ speakerId: "duti", text: "..." }],
    futureConsequence: "..."
  }
}
```

Resolution contract for the future engine:

1. Start with the base choice or transition.
2. Find the first variant for which `state.flags[when.flag] === when.equals`.
3. Replace the named top-level fields with `overrides`.
4. `effects`, `setFlags`, and `feedback` are complete replacements when provided. Do not add base and variant effects together.
5. If no variant matches, keep the base fields.
6. Resolve before displaying costs, forecasts, feedback previews, or selectable options.

In particular:

| Earlier State | Resolved Effect |
| --- | --- |
| `panelsServiced === true` | Every dusty transition of the current profile gives +1 Energy instead of 0. |
| `shelterPrepared === true` | 5A costs 0 Energy. |
| `earthGuide === true` | 5B costs 1 Energy. |
| `sampleCollected === true` | 6A awards 4 Science and uses rock-analysis feedback. |
| `greenhouseMode === "full"` | 6C becomes the greenhouse study, awards 3 Science, and sets `finalTask: "greenhouse"`. |
| `greenhouseMode === "minimum"` | 6C becomes the smaller greenhouse study and awards 2 Science. |
| `greenhouseMode === "off"` | 6C keeps its base report label, 1 Science, and `finalTask: "report"`. |

## Starting a Game: Mission Profiles

1. Pick one entry of `MISSION.profiles` at random (or let a teacher choose).
2. Clone `MISSION.initialState`, set `profileId`, and copy the profile's `startResources` into `resources`.
3. Show the profile `title` and `briefing` (plus `MISSION.profileNote`) before Scene 1, so the player can plan.

## Ending Report: Next-Crew Readiness

Every ending (success, partial, stopped) shows `MISSION.nextCrewReport.title`, the food line for `flags.greenhouseMode` (`full`, `minimum`, `off`; use `off` if Scene 3 was never reached), and the safety line (`ready` if Safety ≥ 6, otherwise `low`). This report does not change the win/lose result.

The safety line describes the current crew's abstract operational margin. It does not diagnose health or assign the current crew's exposure to a future crew.

## Applying a Decision

The engine is implemented in `src/game/engine.js` (`createGame`, `getChoices`, `choose`, `finishFeedback`, `finishTransition`). The scene module itself stays data-only. The steps below are the contract that the engine follows and that `tools/check_engine.mjs` verifies against the independent reference model.

The engine should:

1. Verify the game is playing, the current scene and sol match, and the choice belongs to that scene. Reject duplicate submissions while feedback or a transition is pending.
2. Resolve variants using the current state.
3. Check minimum Safety and upfront Energy/Oxygen costs. If a cost exceeds a reserve, disable the choice. If a cost exactly uses a reserve, show the exhaustion warning before the player selects it.
4. Apply immediate resource effects, clamp the three resources to 0–10, add Science, set immediate flags, and record the decision once.
5. Stop immediately if a resource is 0. Later recharge must not revive the mission.
6. Show the feedback cards in order. A `caption` marks a time skip; it is not a real-time countdown.
7. Apply `setFlagsAfterFeedback` only when feedback finishes.
8. Calculate and apply the scene's shared transition exactly once, then check for 0 again. Include the forecast before selection:
   - Energy: `recharge.clear` (+1) if the stage is clear; `recharge.dusty` (0) plus `recharge.panelBonusWhenDusty` (+1, only if `panelsServiced`) if the current profile lists this scene's sol in `dustyAfterScenes`.
   - Oxygen: `lifeSupport.oxygenPerStage` (−1), plus `lifeSupport.lowPowerExtraOxygen` (−1) if Energy after the decision is at most `lifeSupport.lowPowerEnergyAtMost` (2). Show `messages.lowPower` when this happens.
   - Show `scene.transition.note` when present.
9. Advance to `nextSceneId` and the next sol, or evaluate the final ending if there is no next scene. Scene 6 has no shared transition.
10. If no choice can be used, show a specific stopped-mission reason instead of an empty choice list.

Full success requires Energy ≥1, Oxygen ≥1, Safety ≥4, and Science ≥6. Reaching the final ending with resources remaining but insufficient Science/Safety is partial success.

## Frontend Handoff

Tuğra can use the first scene immediately to build the shared layout:

1. Show `MISSION.openingCard` and a `Start Mission` button.
2. Show the scene title, sol, and ordered story blocks.
3. Show Energy, Oxygen, and Safety as ten-part indicators, plus Science progress toward 6.
4. Show each resolved choice's label, resource changes, Science gain, future consequence, and warning.
5. Show disabled reasons with text, such as `Requires Safety 6. Current Safety: 4.`
6. Add decision feedback, transition forecasts, source cards, and the ending screen.
7. Show `MISSION.creditsCard` and the AI/SI disclosure link in a credits/about/source view. Preserve archival labels and the complete `scienceCard.dataNote` when present. A short card must not hide the qualification that the DONKI record has not been matched to the Mars radiation observation.

For mockups of later scenes, explicitly select the desired flag values and resolve variants. Rendering raw later-scene choices would show only their default version. Keep live rules in the engine so the frontend displays the same values it applies.

## Validation

From the repository root, run:

```sh
node tools/check_story_data.mjs
node tools/check_disclosures.mjs
```

The checker verifies scene links, source references, flag names, variant effects, all 17 choices, mission profiles, the documented example paths, and the reachable ending counts for every profile (every choice must stay winnable in every profile). It is a reference model for checking the data, not a production engine or a browser playtest.

No external JavaScript dependencies are needed. The current audit ran on local Node.js 26.8.1; installations on other team machines are not certified here. A frontend project with `"type": "module"` can import the scene file normally.
