// AI-assisted generation: OpenAI ChatGPT/Codex. See AI_USAGE.md and ai-usage.json.
// Design-only enumeration; this does not extend or import the production engine.
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { MISSION, SCENES, SCENE_ORDER } from "../src/game/scenes.js";

const design = JSON.parse(await readFile(new URL("../data/ten-sol-story-design.json", import.meta.url), "utf8"));
const plan = await readFile(new URL("../docs/design/ten-sol-story-plan.md", import.meta.url), "utf8");
const scenes = [
  ...SCENE_ORDER.map(id => ({
    ...SCENES[id], ...design.sceneOverrides.find(item => item.id === id),
    choices: SCENES[id].choices.map(choice => ({ ...choice, ...design.choiceTextOverrides.find(item => item.id === choice.id) })),
  })),
  ...design.scenes,
];
const keys = MISSION.resourceKeys;
const allIds = new Set(scenes.flatMap(scene => scene.choices.map(choice => choice.id)));
const flagNames = new Set([...Object.keys(MISSION.initialState.flags), ...Object.keys(design.initialFlags)]);
const clamp = value => Math.max(MISSION.resourceBounds.min, Math.min(MISSION.resourceBounds.max, value));
const resolve = (choice, flags) => ({ ...choice, ...choice.variants?.find(v => flags[v.when.flag] === v.when.equals)?.overrides });
const alive = state => keys.every(key => state.resources[key] > 0);
const successful = state => state.science >= design.scienceTarget && keys.every(key => state.resources[key] >= design.successRequirements[key]);
const matches = (ending, history) => ending.allChoices.every(id => history.includes(id))
  && ending.anyChoiceGroups.every(group => group.some(id => history.includes(id)));

assert.equal(design.status, "design-only-not-loaded-by-runtime");
assert.equal(design.totalSols, 10);
assert.equal(design.scienceTarget, 10);
assert.equal(design.successRequirements.science, design.scienceTarget);
assert.equal(scenes.length, 10);
assert.equal(allIds.size, 29);
assert.equal(new Set(scenes.map(scene => scene.id)).size, 10);
assert.equal(design.specialEndings.length, 4);
assert.equal(new Set(design.specialEndings.map(ending => ending.id)).size, 4);
assert.equal(new Set(design.specialEndings.map(ending => ending.priority)).size, 4);
assert.equal(design.checkpoint.afterSol, 6);
assert.equal(design.initialFlags[design.checkpoint.onceFlag], false);
assert.deepEqual(design.checkpoint.effects, { energy: 2, oxygen: 4, safety: 0, science: 0 });

function checkEffects(effects) {
  assert.deepEqual(Object.keys(effects).sort(), [...keys, "science"].sort());
  for (const value of Object.values(effects)) assert(Number.isInteger(value));
}
function checkFlags(flags = {}) {
  for (const key of Object.keys(flags)) assert(flagNames.has(key), `Unknown flag: ${key}`);
}
function checkBlocks(blocks) {
  assert(blocks.length > 0);
  for (const item of blocks) {
    assert(["narrator", "duti"].includes(item.speakerId));
    assert.equal(typeof item.text, "string");
    assert(item.text.trim().length > 0);
    assert(plan.includes(item.text), "Story plan and JSON prose differ");
  }
}
for (const [index, scene] of scenes.entries()) {
  assert.equal(scene.sol, index + 1);
  assert.equal(scene.nextSceneId, scenes[index + 1]?.id ?? null);
  assert.equal(Boolean(scene.transition), index < 9);
  assert(scene.choices.length >= 2 && scene.choices.length <= 3);
  checkBlocks(scene.story);
  for (const choice of scene.choices) {
    assert(choice.id.startsWith(String(scene.sol)));
    assert(plan.includes(`| ${choice.id} |`));
    checkEffects(choice.effects);
    checkFlags(choice.setFlags);
    checkFlags(choice.setFlagsAfterFeedback);
    for (const id of choice.requiresAnyChoice ?? []) assert(allIds.has(id));
    if (scene.sol >= 7) checkBlocks(choice.feedback);
    for (const variant of choice.variants ?? []) {
      assert(flagNames.has(variant.when.flag));
      if (variant.overrides.effects) checkEffects(variant.overrides.effects);
      checkFlags(variant.overrides.setFlags);
    }
  }
}
checkBlocks(design.checkpoint.feedback);
for (const patch of design.choiceTextOverrides) {
  assert(allIds.has(patch.id));
  assert(Object.keys(patch).every(key => ["id", "futureConsequence", "feedback", "warning"].includes(key)));
  if (patch.feedback) checkBlocks(patch.feedback);
}
for (const ending of design.specialEndings) {
  assert(plan.includes(ending.id));
  for (const id of [...ending.allChoices, ...ending.anyChoiceGroups.flat()]) assert(allIds.has(id));
  checkBlocks(ending.story);
}

function available(state, choice) {
  return state.resources.safety >= (choice.requirements?.minSafety ?? 0)
    && state.resources.energy + choice.effects.energy >= 0
    && state.resources.oxygen + choice.effects.oxygen >= 0
    && (!choice.requiresAnyChoice || choice.requiresAnyChoice.some(id => state.history.includes(id)));
}
function applyEffects(state, effects) {
  for (const key of keys) state.resources[key] = clamp(state.resources[key] + effects[key]);
  state.science += effects.science;
}
function advance(previous, scene, choice, dust) {
  const state = structuredClone(previous);
  state.history.push(choice.id);
  applyEffects(state, choice.effects);
  Object.assign(state.flags, choice.setFlags);
  // No supplies or recharge may revive a resource depleted by a decision.
  if (!alive(state)) return state;
  const postDecisionEnergy = state.resources.energy;
  Object.assign(state.flags, choice.setFlagsAfterFeedback);
  if (scene.sol === design.checkpoint.afterSol) {
    assert.equal(state.flags[design.checkpoint.onceFlag], false);
    applyEffects(state, design.checkpoint.effects);
    state.flags[design.checkpoint.onceFlag] = true;
  }
  if (scene.sol < design.totalSols) {
    const dusty = dust.includes(scene.sol);
    applyEffects(state, {
      energy: dusty ? MISSION.recharge.dusty + (state.flags.panelsServiced ? MISSION.recharge.panelBonusWhenDusty : 0) : MISSION.recharge.clear,
      oxygen: MISSION.lifeSupport.oxygenPerStage + (postDecisionEnergy <= MISSION.lifeSupport.lowPowerEnergyAtMost ? MISSION.lifeSupport.lowPowerExtraOxygen : 0),
      safety: 0, science: 0,
    });
  }
  return state;
}

// Guard the two easy-to-miss checkpoint boundaries and the new availability gate.
const boundary = { resources: { energy: 1, oxygen: 1, safety: 8 }, science: 0, history: [], flags: { ...MISSION.initialState.flags, ...design.initialFlags } };
const depleted = advance(boundary, scenes[5], { id: "6C", effects: { energy: -1, oxygen: 0, safety: 0, science: 1 } }, []);
assert.equal(depleted.resources.energy, 0);
assert.equal(depleted.flags.checkpointSuppliesReleased, false);
const lowPower = advance({ ...boundary, resources: { energy: 3, oxygen: 1, safety: 8 } }, scenes[5], { id: "6C", effects: { energy: -1, oxygen: 0, safety: 0, science: 1 } }, []);
assert.deepEqual(lowPower.resources, { energy: 5, oxygen: 3, safety: 8 });
assert.equal(available({ ...boundary, resources: { energy: 8, oxygen: 8, safety: 8 }, history: ["3C"] }, scenes[7].choices[0]), false);

const reports = [];
for (const profile of MISSION.profiles) {
  const dust = design.profileDustyAfterScenes[profile.id];
  assert.deepEqual(dust.filter(sol => sol <= 5), profile.dustyAfterScenes);
  assert(dust.every(sol => Number.isInteger(sol) && sol >= 1 && sol <= 9));
  const counts = { success: 0, partial: 0, stopped: 0 };
  const endingCounts = Object.fromEntries([...design.specialEndings.map(e => e.id), "ordinary-success"].map(id => [id, 0]));
  const witnesses = {};
  const successfulChoices = new Set();
  let maxScience = 0;
  function visit(state, index) {
    if (!alive(state)) { counts.stopped++; return; }
    if (index === scenes.length) {
      maxScience = Math.max(maxScience, state.science);
      if (!successful(state)) { counts.partial++; return; }
      counts.success++;
      state.history.forEach(id => successfulChoices.add(id));
      const endings = design.specialEndings.filter(e => matches(e, state.history)).sort((a, b) => a.priority - b.priority);
      assert(endings.length <= 1, `Overlapping endings: ${state.history.join(" ")}`);
      const id = endings[0]?.id ?? "ordinary-success";
      endingCounts[id]++;
      witnesses[id] ??= { history: state.history, resources: state.resources, science: state.science };
      return;
    }
    const scene = scenes[index];
    const choices = scene.choices.map(c => resolve(c, state.flags)).filter(c => available(state, c));
    if (!choices.length) { counts.stopped++; return; }
    for (const choice of choices) visit(advance(state, scene, choice, dust), index + 1);
  }
  visit({ resources: structuredClone(profile.startResources), science: 0, flags: { ...MISSION.initialState.flags, ...design.initialFlags }, history: [] }, 0);
  for (const id of allIds) assert(successfulChoices.has(id), `No successful path uses ${id} in ${profile.id}`);
  for (const id of Object.keys(endingCounts)) assert(endingCounts[id] > 0, `Unreachable ending ${id} in ${profile.id}`);
  assert(counts.partial > 0 && counts.stopped > 0);
  for (const ending of design.specialEndings) {
    const witness = witnesses[ending.id];
    for (const id of ending.allChoices) assert(!matches(ending, witness.history.filter(chosen => chosen !== id)));
    for (const group of ending.anyChoiceGroups) assert(!matches(ending, witness.history.filter(chosen => !group.includes(chosen))));
  }
  reports.push({ profile: profile.id, counts, maxScience, endingCounts, witnesses });
  console.log(`${profile.id}: ${counts.success} success, ${counts.partial} partial, ${counts.stopped} stopped; max Science ${maxScience}.`);
  for (const [id, witness] of Object.entries(witnesses)) console.log(`  ${id}: ${witness.history.join(" ")} => E${witness.resources.energy}/O${witness.resources.oxygen}/S${witness.resources.safety}, Science ${witness.science}`);
}
console.log("Ten-sol design verified: 10 scenes, 29 choices, four mutually exclusive special endings and ordinary success reachable in every profile; every choice appears on a successful path. Runtime remains six sols.");

if (process.argv.includes("--write-report")) {
  let report = "# Ten-Sol Design Balance Report\n\n> AI/SI disclosure: generated with OpenAI ChatGPT/Codex by the design checker. See [AI_USAGE.md](../../AI_USAGE.md) and [ai-usage.json](../../ai-usage.json).\n\n**Date:** November 15, 2026. These are exhaustive results for the proposed design, not the playable runtime or a child playtest. All scores are fictional. Reproduce with `npm run check:expansion`; regenerate with `node tools/check_ten_sol_design.mjs --write-report`.\n\nA stopped branch is counted when it stops; its unplayed future choices are not expanded. Success/partial counts are full ten-decision histories.\n";
  for (const result of reports) {
    report += `\n## ${result.profile}\n\nSuccess: ${result.counts.success}; partial: ${result.counts.partial}; stopped branches: ${result.counts.stopped}. Maximum reachable final Science: ${result.maxScience}.\n\n| Ending | Successful histories | One complete witness | Final E / O / S | Science |\n| --- | --- | --- | --- | --- |\n`;
    for (const [id, count] of Object.entries(result.endingCounts)) {
      const w = result.witnesses[id];
      report += `| ${id} | ${count} | ${w.history.join(" → ")} | ${w.resources.energy} / ${w.resources.oxygen} / ${w.resources.safety} | ${w.science} |\n`;
    }
  }
  report += "\nAll 29 choices appear on at least one successful history in each profile. Each special ending's required decisions are necessary for its predicate. There is no overlap among the four special predicates. Checkpoint depletion, pre-release low-power calculation, and the unavailable greenhouse-tray option were checked explicitly. The reference checker also verifies that the story and JSON prose agree.\n";
  await writeFile(new URL("../docs/design/ten-sol-balance-report.md", import.meta.url), report);
}
