// Reference model for validating story data. This is not the production engine.
// AI-assisted generation/revision: OpenAI ChatGPT/Codex and Anthropic Claude. See AI_USAGE.md and ai-usage.json.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { MISSION, SCENE_ORDER, SCENES, ENDINGS, NASA_SOURCES } from "../src/game/scenes.js";

const effectKeys = [...MISSION.resourceKeys, "science"];
const flagNames = new Set(Object.keys(MISSION.initialState.flags));
const choiceIds = new Set();
const plan = await readFile(new URL("../docs/design/story-plan.md", import.meta.url), "utf8");
const sourceText = await readFile(new URL("../src/game/scenes.js", import.meta.url), "utf8");
const medaSummary = JSON.parse(await readFile(new URL("../data/meda-jezero.json", import.meta.url), "utf8"));
const nasaEvents = JSON.parse(await readFile(new URL("../data/nasa-events.json", import.meta.url), "utf8"));

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
    // Transition values come from MISSION.recharge, MISSION.lifeSupport and the mission profile.
    for (const key of Object.keys(scene.transition)) assert.equal(key, "note", `Unexpected transition field: ${key}`);
  }
}
assert.equal(choiceIds.size, 17);

// Mission profiles, shared transition rules and the next-crew report.
assert.deepEqual(MISSION.recharge, { clear: 1, dusty: 0, panelBonusWhenDusty: 1 });
assert.equal(MISSION.lifeSupport.oxygenPerStage, -1);
const profileIds = MISSION.profiles.map(profile => profile.id);
assert.equal(new Set(profileIds).size, profileIds.length);
assert(profileIds.includes(MISSION.defaultProfileId));
assert.equal(MISSION.initialState.profileId, MISSION.defaultProfileId);
const defaultProfile = MISSION.profiles.find(profile => profile.id === MISSION.defaultProfileId);
assert.deepEqual(MISSION.initialState.resources, defaultProfile.startResources);
for (const profile of MISSION.profiles) {
  assert(profile.title && profile.briefing);
  // Scene 2's story describes a power shortage, so every profile must have dust after Scene 2.
  assert(profile.dustyAfterScenes.includes(2), `${profile.id} must include dust after Scene 2`);
  for (const sceneNumber of profile.dustyAfterScenes) assert(sceneNumber >= 1 && sceneNumber <= 5);
  for (const key of MISSION.resourceKeys) {
    const value = profile.startResources[key];
    assert(Number.isInteger(value) && value >= 1 && value <= 10);
  }
}
assert.deepEqual(Object.keys(MISSION.nextCrewReport.food).sort(), ["full", "minimum", "off"]);
for (const source of Object.values(NASA_SOURCES)) {
  const url = new URL(source.url);
  assert.equal(url.protocol, "https:");
  assert(url.hostname === "nasa.gov" || url.hostname.endsWith(".nasa.gov"));
  if (source.localData) {
    await readFile(new URL(`../${source.localData}`, import.meta.url), "utf8");
  }
}
const selectedSol = medaSummary.sols.find(item => item.sol === 290);
assert(selectedSol && Math.round(selectedSol.airTemp_minC) === -77 && Math.round(selectedSol.airTemp_maxC) === -3);
assert.equal(nasaEvents.events[0].id, "2024-05-20T05:36:00-CME-001");
assert(SCENES["solar-radiation-alert"].scienceCard.dataNote.includes("has not established"));
assert(SCENES["power-shortage"].scienceCard.dataNote.includes("quality flags are not applied"));

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

// Shared transition after the decision: recharge depends on the profile's dust forecast,
// and very low battery puts life support into low-power mode (extra Oxygen loss).
function transitionEffects(state, scene) {
  const profile = MISSION.profiles.find(item => item.id === state.profileId);
  const dusty = profile.dustyAfterScenes.includes(scene.sol);
  const { recharge, lifeSupport } = MISSION;
  const energy = dusty
    ? recharge.dusty + (state.flags.panelsServiced ? recharge.panelBonusWhenDusty : 0)
    : recharge.clear;
  const lowPower = state.resources.energy <= lifeSupport.lowPowerEnergyAtMost;
  const oxygen = lifeSupport.oxygenPerStage + (lowPower ? lifeSupport.lowPowerExtraOxygen : 0);
  return { energy, oxygen, safety: 0, science: 0 };
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
    applyEffects(next, transitionEffects(next, scene));
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

function exploreProfile(profile) {
  const found = [];
  let blocked = 0;
  function explore(state) {
    let usable = 0;
    for (const choice of SCENES[state.sceneId].choices) {
      const next = step(state, choice);
      if (!next) { blocked++; continue; }
      usable++;
      if (next.status === "playing") explore(next);
      else found.push(next);
    }
    if (!usable) found.push({ ...state, status: "failed" });
  }
  const start = structuredClone(MISSION.initialState);
  start.profileId = profile.id;
  start.resources = structuredClone(profile.startResources);
  explore(start);
  const totals = { success: 0, partial: 0, failed: 0 };
  for (const ending of found) totals[ending.status]++;
  return { endings: found, counts: totals, blocked };
}

// Expected path counts per profile. Recalculate and update these whenever a value changes.
const expectedCounts = {
  standard: { success: 103, partial: 219, failed: 41 },
  "dusty-season": { success: 95, partial: 214, failed: 51 },
  "small-oxygen-supply": { success: 77, partial: 199, failed: 45 },
};
const profileResults = {};
for (const profile of MISSION.profiles) {
  const result = exploreProfile(profile);
  profileResults[profile.id] = result;
  assert.deepEqual(result.counts, expectedCounts[profile.id], `Unexpected ending counts for ${profile.id}`);
  assert.equal(Math.max(...result.endings.map(state => state.science)), 8);
  // No single fixed strategy: every choice must stay on at least one successful path in every profile.
  for (const id of choiceIds) {
    assert(result.endings.some(state => state.status === "success" && state.history.includes(id)), `No success path uses ${id} in ${profile.id}`);
  }
}
const { endings, counts, blocked: blockedChoices } = profileResults[MISSION.defaultProfileId];

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
for (const [id, result] of Object.entries(profileResults)) {
  const c = result.counts;
  console.log(`Profile ${id}: ${c.success} success, ${c.partial} partial, ${c.failed} stopped; ${result.blocked} unavailable choices blocked.`);
}
console.log("All five documented paths match (standard profile); every choice appears on a successful path in every profile. Maximum Science: 8.");
