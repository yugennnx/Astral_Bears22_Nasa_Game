// Reference model for validating story data. This is not the production engine.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { MISSION, SCENE_ORDER, SCENES, ENDINGS, NASA_SOURCES } from "../src/game/scenes.js";

const effectKeys = [...MISSION.resourceKeys, "science"];
const flagNames = new Set(Object.keys(MISSION.initialState.flags));
const choiceIds = new Set();
const plan = await readFile(new URL("../story-plan.md", import.meta.url), "utf8");
const sourceText = await readFile(new URL("../src/game/scenes.js", import.meta.url), "utf8");

function checkEffects(effects) {
  assert.deepEqual(Object.keys(effects).sort(), [...effectKeys].sort());
  for (const value of Object.values(effects)) assert(Number.isInteger(value));
  assert(effects.science >= 0);
}

function checkFlags(flags = {}) {
  for (const [key, value] of Object.entries(flags)) {
    assert(flagNames.has(key), `Unknown flag: ${key}`);
    if (typeof MISSION.initialState.flags[key] === "boolean") {
      assert.equal(typeof value, "boolean", `Flag must be boolean: ${key}`);
    }
    if (key === "greenhouseMode") assert(["full", "minimum", "off"].includes(value));
    if (key === "stormResponse") assert(["shelter", "robot", "outside"].includes(value));
    if (key === "finalTask") assert(["lab", "field", "greenhouse", "report"].includes(value));
  }
}

function checkFeedback(blocks) {
  assert(blocks.length > 0);
  for (const block of blocks) {
    assert(["narrator", "duti"].includes(block.speakerId));
    assert.equal(typeof block.text, "string");
    assert(block.text.length > 0);
  }
}

function checkVariants(item) {
  for (const variant of item.variants ?? []) {
    assert(flagNames.has(variant.when.flag), `Unknown variant flag: ${variant.when.flag}`);
    assert(Object.hasOwn(variant.when, "equals"));
    if (variant.overrides.effects) checkEffects(variant.overrides.effects);
    checkFlags(variant.overrides.setFlags);
    if (variant.overrides.feedback) checkFeedback(variant.overrides.feedback);
  }
}

function resolve(item, state) {
  const variant = item.variants?.find(({ when }) => state.flags[when.flag] === when.equals);
  return { ...item, ...(variant?.overrides ?? {}) };
}

assert.equal(MISSION.robot.displayName, "DUTİ");
assert.equal(MISSION.robot.id, "duti");
assert.equal(MISSION.language, "en");
assert(!sourceText.includes("PİKO"));
assert.equal(SCENE_ORDER.length, 6);
assert.equal(new Set(SCENE_ORDER).size, 6);
assert.deepEqual(Object.keys(SCENES).sort(), [...SCENE_ORDER].sort());
assert.deepEqual(MISSION.initialState.resources, { energy: 8, oxygen: 8, safety: 8 });
assert.equal(MISSION.initialState.science, 0);
assert.equal(MISSION.scienceTarget, MISSION.successRequirements.science);
assert.deepEqual(Object.keys(ENDINGS).sort(), ["failed", "partial", "success"]);

for (const [index, id] of SCENE_ORDER.entries()) {
  const scene = SCENES[id];
  assert.equal(scene.id, id);
  assert.equal(scene.sol, index + 1);
  assert.equal(scene.nextSceneId, SCENE_ORDER[index + 1] ?? null);
  assert(scene.choices.length >= 2 && scene.choices.length <= 3);
  checkFeedback(scene.story);
  if (scene.scienceCard) {
    for (const sourceId of scene.scienceCard.sourceIds) {
      assert(NASA_SOURCES[sourceId], `Unknown NASA source: ${sourceId}`);
    }
  }
  for (const choice of scene.choices) {
    assert(!choiceIds.has(choice.id), `Duplicate choice: ${choice.id}`);
    assert(choice.id.startsWith(String(scene.sol)));
    assert(plan.includes(`| ${choice.id} |`), `Choice missing from story plan: ${choice.id}`);
    choiceIds.add(choice.id);
    checkEffects(choice.effects);
    checkFlags(choice.setFlags);
    checkFlags(choice.setFlagsAfterFeedback);
    checkFeedback(choice.feedback);
    checkVariants(choice);
    assert(choice.label && choice.futureConsequence);
  }
  if (index === SCENE_ORDER.length - 1) {
    assert.equal(scene.transition, null);
  } else {
    checkEffects(scene.transition.effects);
    checkVariants(scene.transition);
    assert.equal(scene.transition.effects.oxygen, -1);
  }
}
assert.equal(choiceIds.size, 17);
for (const source of Object.values(NASA_SOURCES)) {
  const url = new URL(source.url);
  assert.equal(url.protocol, "https:");
  assert(url.hostname === "nasa.gov" || url.hostname.endsWith(".nasa.gov"));
}

function available(choice, state) {
  if (state.resources.safety < (choice.requirements?.minSafety ?? 0)) return false;
  return ["energy", "oxygen"].every(key => state.resources[key] + choice.effects[key] >= 0);
}

function applyEffects(state, effects) {
  for (const key of MISSION.resourceKeys) {
    state.resources[key] = Math.max(0, Math.min(10, state.resources[key] + effects[key]));
    assert(state.resources[key] >= 0 && state.resources[key] <= 10);
  }
  state.science += effects.science;
}

function exhausted(state) {
  return MISSION.resourceKeys.some(key => state.resources[key] === 0);
}

function step(state, rawChoice) {
  const scene = SCENES[state.sceneId];
  const choice = resolve(rawChoice, state);
  if (!available(choice, state)) return null;
  const next = structuredClone(state);
  applyEffects(next, choice.effects);
  Object.assign(next.flags, choice.setFlags);
  next.history.push(choice.id);
  if (exhausted(next)) return { ...next, status: "failed" };

  // Each feedback card is considered acknowledged before continuing this model.
  Object.assign(next.flags, choice.setFlagsAfterFeedback);
  if (scene.transition) {
    applyEffects(next, resolve(scene.transition, next).effects);
    if (exhausted(next)) return { ...next, status: "failed" };
  }
  if (scene.nextSceneId) {
    next.sceneId = scene.nextSceneId;
    next.sol = SCENES[scene.nextSceneId].sol;
  } else {
    const passed = MISSION.resourceKeys.every(key => next.resources[key] >= MISSION.successRequirements[key])
      && next.science >= MISSION.scienceTarget;
    next.status = passed ? "success" : "partial";
  }
  return next;
}

const endings = [];
let blockedChoices = 0;
function explore(state) {
  let usable = 0;
  for (const choice of SCENES[state.sceneId].choices) {
    const next = step(state, choice);
    if (!next) { blockedChoices++; continue; }
    usable++;
    if (next.status === "playing") explore(next);
    else endings.push(next);
  }
  if (!usable) endings.push({ ...state, status: "failed" });
}
explore(structuredClone(MISSION.initialState));

const counts = { success: 0, partial: 0, failed: 0 };
for (const ending of endings) counts[ending.status]++;
assert.deepEqual(counts, { success: 103, partial: 219, failed: 41 });
assert.equal(blockedChoices, 51);
assert.equal(Math.max(...endings.map(state => state.science)), 8);
for (const id of choiceIds) {
  assert(endings.some(state => state.status === "success" && state.history.includes(id)), `No success path uses ${id}`);
}

const examples = [
  { path: ["1A", "2A", "3A", "4B", "5B", "6B"], resources: [2, 3, 8], science: 7, status: "success" },
  { path: ["1B", "2C", "3A", "4B", "5B", "6C"], resources: [3, 3, 9], science: 6, status: "success" },
  { path: ["1B", "2B", "3B", "4C", "5B", "6A"], resources: [2, 4, 9], science: 7, status: "success" },
  { path: ["1B", "2A", "3B", "4A", "5A", "6C"], resources: [5, 5, 9], science: 2, status: "partial" },
  { path: ["1A", "2B", "3A", "4B", "5A"], resources: [6, 0, 8], science: 3, status: "failed" },
];
for (const example of examples) {
  const ending = endings.find(state => state.history.join(",") === example.path.join(","));
  assert(ending, `Missing documented path: ${example.path}`);
  assert.deepEqual(MISSION.resourceKeys.map(key => ending.resources[key]), example.resources);
  assert.equal(ending.science, example.science);
  assert.equal(ending.status, example.status);
}

// Check the conditional copy as well as numeric ending totals.
const state = structuredClone(MISSION.initialState);
const finalChoices = SCENES["final-mission"].choices;
state.flags.greenhouseMode = "off";
assert.equal(resolve(finalChoices[2], state).label, "Prepare a report from existing records");
assert.equal(resolve(finalChoices[2], state).setFlags.finalTask, "report");
state.flags.greenhouseMode = "full";
assert.equal(resolve(finalChoices[2], state).effects.science, 3);
assert.equal(resolve(finalChoices[2], state).setFlags.finalTask, "greenhouse");
state.flags.greenhouseMode = "minimum";
assert.equal(resolve(finalChoices[2], state).effects.science, 2);
state.flags.sampleCollected = true;
assert.equal(resolve(finalChoices[0], state).effects.science, 4);
state.resources.safety = 5;
assert.equal(available(finalChoices[1], state), false);
state.resources.safety = 6;
assert.equal(available(finalChoices[1], state), true);
const earthChoice = SCENES["message-from-earth"].choices[0];
assert.equal(earthChoice.setFlags?.earthGuide, undefined);
assert.equal(earthChoice.setFlagsAfterFeedback.earthGuide, true);
assert.equal(earthChoice.feedback.length, 2);

console.log("Story data verified: 6 scenes, 17 choices, DUTİ, conditional feedback and source links.");
console.log(`Endings: ${counts.success} success, ${counts.partial} partial, ${counts.failed} stopped; ${blockedChoices} unavailable choices blocked.`);
console.log("All five documented paths match; every choice appears on a successful path. Maximum Science: 8.");
