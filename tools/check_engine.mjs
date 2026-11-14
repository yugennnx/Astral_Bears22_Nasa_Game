// AI-assisted generation: Anthropic Claude. See AI_USAGE.md and ai-usage.json.
// Plays every reachable path through the production engine and compares the results
// with the independent reference model in tools/check_story_data.mjs.
import assert from "node:assert/strict";
import { MISSION } from "../src/game/scenes.js";
import {
  createGame, getChoices, choose, finishFeedback, finishTransition, pickProfileId, getForecast,
} from "../src/game/engine.js";

// Same expected totals as the reference model. Update both files together.
const expectedCounts = {
  standard: { success: 103, partial: 219, failed: 41 },
  "dusty-season": { success: 95, partial: 214, failed: 51 },
  "small-oxygen-supply": { success: 77, partial: 199, failed: 45 },
};

function playAll(profileId) {
  const endings = [];
  (function explore(state) {
    for (const option of getChoices(state)) {
      if (!option.available) {
        assert.throws(() => choose(state, option.id));
        continue;
      }
      let next = choose(state, option.id);
      assert.deepEqual(next.pending?.after.resources ?? next.resources, option.after, "Preview must match the applied decision");
      if (next.phase === "feedback") {
        next = finishFeedback(next);
        // The forecast shown before the choice must equal the transition that is applied.
        if (option.transition && next.lastTransition && next.phase !== "ended") {
          assert.deepEqual(next.lastTransition.effects, option.transition.effects);
          assert.deepEqual(next.resources, option.afterTransition);
        }
      }
      if (next.phase === "transition") next = finishTransition(next);
      if (next.phase === "ended") {
        assert(next.ending && next.ending.status === next.status);
        endings.push(next);
      } else {
        assert.equal(next.phase, "scene");
        explore(next);
      }
    }
  })(createGame(profileId));
  return endings;
}

const byProfile = {};
for (const profile of MISSION.profiles) {
  const endings = playAll(profile.id);
  const counts = { success: 0, partial: 0, failed: 0 };
  for (const ending of endings) counts[ending.status]++;
  assert.deepEqual(counts, expectedCounts[profile.id], `Engine totals differ from the reference model for ${profile.id}`);
  assert.equal(Math.max(...endings.map(state => state.science)), 8);
  for (const state of endings) {
    for (const key of MISSION.resourceKeys) assert(state.resources[key] >= 0 && state.resources[key] <= 10);
    if (state.status === "failed") assert(state.ending.reasonKey, "A stopped mission needs a reason");
    assert(["ready", "limited", "at-risk"].includes(state.ending.nextCrew.food.status));
  }
  byProfile[profile.id] = { endings, counts };
  assert.equal(getForecast(profile.id).filter(day => day.dusty).length, profile.dustyAfterScenes.length);
}

// Documented example paths (standard profile).
const examples = [
  { path: ["1A", "2A", "3A", "4B", "5B", "6B"], resources: [2, 3, 8], science: 7, status: "success" },
  { path: ["1B", "2C", "3A", "4B", "5B", "6C"], resources: [3, 3, 9], science: 6, status: "success" },
  { path: ["1B", "2B", "3B", "4C", "5B", "6A"], resources: [2, 4, 9], science: 7, status: "success" },
  { path: ["1B", "2A", "3B", "4A", "5A", "6C"], resources: [5, 5, 9], science: 2, status: "partial" },
  { path: ["1A", "2B", "3A", "4B", "5A"], resources: [6, 0, 8], science: 3, status: "failed" },
];
for (const example of examples) {
  const ending = byProfile.standard.endings.find(state => state.history.join() === example.path.join());
  assert(ending, `Missing documented path: ${example.path}`);
  assert.deepEqual(MISSION.resourceKeys.map(key => ending.resources[key]), example.resources);
  assert.equal(ending.science, example.science);
  assert.equal(ending.status, example.status);
}
const stopped = byProfile.standard.endings.find(state => state.history.join() === "1A,2B,3A,4B,5A");
assert.equal(stopped.ending.reasonKey, "oxygen");
assert.equal(stopped.ending.during, "transition");
const panelRun = byProfile["dusty-season"].endings.find(state => state.history[0] === "1A" && state.history.length === 6);
assert.equal(panelRun.ending.highlights.panelBonusCount, 3);

// Earth's guidance unlocks only after the reply card has been read.
let state = createGame("standard");
for (const id of ["1B", "2A", "3B"]) state = finishTransition(finishFeedback(choose(state, id)));
state = choose(state, "4A");
assert.equal(state.flags.earthGuide, false);
state = finishFeedback(state);
assert.equal(state.flags.earthGuide, true);
state = finishTransition(state);
assert.equal(getChoices(state).find(option => option.id === "5B").effects.energy, -1);

// Engine calls must not mutate earlier states or the scene data.
const fresh = createGame("standard");
const snapshot = JSON.stringify(fresh);
choose(fresh, "1A");
assert.equal(JSON.stringify(fresh), snapshot);
assert.deepEqual(MISSION.initialState.resources, { energy: 8, oxygen: 8, safety: 8 });

// Random profile selection avoids repeating the previous profile.
for (let i = 0; i < 20; i++) assert.notEqual(pickProfileId(Math.random, "standard"), "standard");

console.log("Engine verified against the reference model:");
for (const [id, { counts }] of Object.entries(byProfile)) {
  console.log(`  ${id}: ${counts.success} success, ${counts.partial} partial, ${counts.failed} stopped.`);
}
console.log("Previews match applied effects, forecasts match transitions, example paths and delayed Earth reply verified.");
