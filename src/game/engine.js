/**
 * Decision engine for the ten-sol Compass Outpost game (Sol 6 is a checkpoint, Sol 10 the end).
 * Pure functions: every call returns a new state and never mutates scene data.
 * Rules come from src/game/scenes.js and docs/design/story-data-contract.md.
 * All numeric effects are game-design assumptions, not NASA measurements.
 * AI-assisted generation: Anthropic Claude. See AI_USAGE.md and ai-usage.json.
 */
import { MISSION, SCENES, SCENE_ORDER, SPECIAL_ENDINGS } from "./scenes.js";

const RESOURCE_KEYS = MISSION.resourceKeys;
const { min: MIN, max: MAX } = MISSION.resourceBounds;
const clamp = value => Math.max(MIN, Math.min(MAX, value));
const clone = value => structuredClone(value);

/** Pick a mission profile at random. Pass `avoidId` to get a different one on replay. */
export function pickProfileId(random = Math.random, avoidId = null) {
  const pool = MISSION.profiles.filter(profile => profile.id !== avoidId);
  const list = pool.length ? pool : MISSION.profiles;
  return list[Math.floor(random() * list.length) % list.length].id;
}

export function getProfile(stateOrId) {
  const id = typeof stateOrId === "string" ? stateOrId : stateOrId.profileId;
  const profile = MISSION.profiles.find(item => item.id === id);
  if (!profile) throw new Error(`Unknown mission profile: ${id}`);
  return profile;
}

/** Start a new game. The state is plain JSON so it can be saved and restored. */
export function createGame(profileId = MISSION.defaultProfileId) {
  const profile = getProfile(profileId);
  const state = clone(MISSION.initialState);
  state.profileId = profile.id;
  state.resources = clone(profile.startResources);
  state.phase = "scene"; // "scene" | "feedback" | "transition" | "ended"
  state.pending = null;
  state.lastTransition = null;
  state.log = [];
  state.ending = null;
  return state;
}

/** Apply the first matching conditional variant (complete replacement of named fields). */
export function resolveVariant(item, flags) {
  const variant = item.variants?.find(({ when }) => flags[when.flag] === when.equals);
  return variant ? { ...item, ...variant.overrides } : item;
}

export function isDustyAfter(profileOrState, sol) {
  const profile = profileOrState.dustyAfterScenes ? profileOrState : getProfile(profileOrState);
  return profile.dustyAfterScenes.includes(sol);
}

/**
 * Shared transition after a scene's decision.
 * `energyAfterDecision` decides whether life support drops into low-power mode.
 */
export function computeTransition(state, scene, energyAfterDecision, flags = state.flags) {
  if (!scene.transition) return null;
  const { recharge, lifeSupport } = MISSION;
  const dusty = isDustyAfter(state, scene.sol);
  const panelBonus = dusty && flags.panelsServiced ? recharge.panelBonusWhenDusty : 0;
  const lowPower = energyAfterDecision <= lifeSupport.lowPowerEnergyAtMost;
  return {
    dusty,
    panelBonus,
    lowPower,
    note: scene.transition.note ?? null,
    effects: {
      energy: (dusty ? recharge.dusty : recharge.clear) + panelBonus,
      oxygen: lifeSupport.oxygenPerStage + (lowPower ? lifeSupport.lowPowerExtraOxygen : 0),
      safety: 0,
      science: 0,
    },
  };
}

function applyEffects(resources, effects) {
  const next = { ...resources };
  for (const key of RESOURCE_KEYS) next[key] = clamp(next[key] + (effects[key] ?? 0));
  return next;
}

/** Sol 6: the reserve compartment opens once, after a surviving decision and its feedback. */
const checkpointDue = (state, scene) => Boolean(MISSION.checkpoint)
  && scene.sol === MISSION.checkpoint.afterSol && !state.flags[MISSION.checkpoint.onceFlag];

const exhaustedKey = resources => RESOURCE_KEYS.find(key => resources[key] <= MIN) ?? null;

function describeChoice(state, scene, rawChoice) {
  const choice = resolveVariant(rawChoice, state.flags);
  const { resources } = state;
  let disabledReason = null;
  const minSafety = choice.requirements?.minSafety ?? 0;
  if (resources.safety < minSafety) {
    disabledReason = { type: "minSafety", required: minSafety, current: resources.safety };
  } else if (choice.requiresAnyChoice && !choice.requiresAnyChoice.some(id => state.history.includes(id))) {
    disabledReason = { type: "requires", text: choice.unavailableReason };
  } else if (resources.energy + choice.effects.energy < 0) {
    disabledReason = { type: "energy", required: -choice.effects.energy, current: resources.energy };
  } else if (resources.oxygen + choice.effects.oxygen < 0) {
    disabledReason = { type: "oxygen", required: -choice.effects.oxygen, current: resources.oxygen };
  }

  const after = applyEffects(resources, choice.effects);
  const usesUpReserve = RESOURCE_KEYS.filter(key => choice.effects[key] < 0 && after[key] <= MIN);
  const flagsAfter = { ...state.flags, ...choice.setFlags, ...choice.setFlagsAfterFeedback };
  const transition = disabledReason || usesUpReserve.length
    ? null
    : computeTransition(state, scene, after.energy, flagsAfter);
  const checkpoint = transition && checkpointDue(state, scene) ? { ...MISSION.checkpoint.effects } : null;
  const afterTransition = transition ? applyEffects(checkpoint ? applyEffects(after, checkpoint) : after, transition.effects) : null;

  return {
    id: choice.id,
    label: choice.label,
    effects: choice.effects,
    warning: choice.warning ?? null,
    futureConsequence: choice.futureConsequence,
    available: !disabledReason,
    disabledReason,
    usesUpReserve,
    after,
    scienceAfter: state.science + choice.effects.science,
    transition,
    checkpoint,
    afterTransition,
    oxygenRunsOut: Boolean(afterTransition && afterTransition.oxygen <= MIN),
    energyRunsOut: Boolean(afterTransition && afterTransition.energy <= MIN),
  };
}

export function getScene(state) {
  return SCENES[state.sceneId];
}

/** Resolved choices for the current scene, including costs, availability and forecasts. */
export function getChoices(state) {
  const scene = getScene(state);
  return scene.choices.map(choice => describeChoice(state, scene, choice));
}

function endGame(state, status, reasonKey = null, during = null) {
  state.status = status;
  state.phase = "ended";
  state.ending = buildEnding(state, status, reasonKey, during);
  return state;
}

/** Make the decision for the current scene. Moves to the "feedback" phase (or ends the mission). */
export function choose(previous, choiceId) {
  if (previous.phase !== "scene" || previous.status !== "playing") {
    throw new Error("A decision can only be made while a scene is waiting for a choice.");
  }
  const scene = getScene(previous);
  const rawChoice = scene.choices.find(choice => choice.id === choiceId);
  if (!rawChoice) throw new Error(`Choice ${choiceId} does not belong to scene ${scene.id}.`);
  const described = describeChoice(previous, scene, rawChoice);
  if (!described.available) throw new Error(`Choice ${choiceId} is not available.`);
  const choice = resolveVariant(rawChoice, previous.flags);

  const state = clone(previous);
  const before = { resources: { ...state.resources }, science: state.science };
  state.resources = applyEffects(state.resources, choice.effects);
  state.science += choice.effects.science;
  Object.assign(state.flags, choice.setFlags);
  state.history.push(choice.id);
  state.pending = {
    sceneId: scene.id,
    sol: scene.sol,
    choiceId: choice.id,
    label: choice.label,
    effects: { ...choice.effects },
    feedback: checkpointDue(previous, scene) ? [...choice.feedback, ...MISSION.checkpoint.feedback] : choice.feedback,
    setFlagsAfterFeedback: choice.setFlagsAfterFeedback ?? null,
    before,
    after: { resources: { ...state.resources }, science: state.science },
  };
  state.log.push({ sceneId: scene.id, sol: scene.sol, choiceId: choice.id, label: choice.label, effects: { ...choice.effects }, transition: null });

  const emptied = exhaustedKey(state.resources);
  if (emptied) return endGame(state, "failed", emptied, "decision");
  state.phase = "feedback";
  return state;
}

/** Call after the player has read every feedback card. Applies the shared transition. */
export function finishFeedback(previous) {
  if (previous.phase !== "feedback") throw new Error("No feedback is pending.");
  const state = clone(previous);
  const scene = getScene(state);
  Object.assign(state.flags, state.pending.setFlagsAfterFeedback);

  if (!scene.transition) return endGame(state, evaluateFinalStatus(state));

  const before = { ...state.resources };
  const energyAfterDecision = state.resources.energy; // low-power mode is decided before any supplies arrive
  let checkpoint = null;
  if (checkpointDue(state, scene)) {
    checkpoint = { ...MISSION.checkpoint.effects };
    state.resources = applyEffects(state.resources, checkpoint);
    state.flags[MISSION.checkpoint.onceFlag] = true;
  }
  const transition = computeTransition(state, scene, energyAfterDecision);
  state.resources = applyEffects(state.resources, transition.effects);
  state.lastTransition = { ...transition, checkpoint, sol: scene.sol, before, after: { ...state.resources } };
  state.log[state.log.length - 1].transition = { ...transition };

  const emptied = exhaustedKey(state.resources);
  if (emptied) return endGame(state, "failed", emptied, "transition");
  state.phase = "transition";
  return state;
}

/** Call after the player has seen the transition card. Opens the next scene. */
export function finishTransition(previous) {
  if (previous.phase !== "transition") throw new Error("No transition is pending.");
  const state = clone(previous);
  const scene = getScene(state);
  state.sceneId = scene.nextSceneId;
  state.sol = SCENES[scene.nextSceneId].sol;
  state.pending = null;
  state.phase = "scene";
  if (!getChoices(state).some(choice => choice.available)) return endGame(state, "failed", "noChoices", "scene");
  return state;
}

function evaluateFinalStatus(state) {
  const need = MISSION.successRequirements;
  const resourcesOk = RESOURCE_KEYS.every(key => state.resources[key] >= need[key]);
  return resourcesOk && state.science >= need.science ? "success" : "partial";
}

/** A complete, ordered history: exactly one choice from every sol, no duplicates. */
function validHistory(history) {
  return history.length === SCENE_ORDER.length
    && history.every((id, index) => SCENES[SCENE_ORDER[index]].choices.some(choice => choice.id === id));
}

/** The special ending earned by this run's own history (lowest priority number wins). */
export function specialEndingFor(history) {
  if (!validHistory(history)) return null;
  return [...SPECIAL_ENDINGS].sort((a, b) => a.priority - b.priority).find(ending =>
    ending.allChoices.every(id => history.includes(id))
    && ending.anyChoiceGroups.every(group => group.some(id => history.includes(id)))) ?? null;
}

function buildEnding(state, status, reasonKey, during) {
  const { nextCrewReport, successRequirements } = MISSION;
  const greenhouse = state.flags.greenhouseMode ?? "off";
  const safetyReady = state.resources.safety >= nextCrewReport.safety.ready.minSafety;
  const panelBonusCount = state.log.reduce((sum, entry) => sum + (entry.transition?.panelBonus ?? 0), 0);
  const lowPowerCount = state.log.filter(entry => entry.transition?.lowPower).length;
  return {
    status,
    special: status === "success" ? specialEndingFor(state.history)?.id ?? null : null,
    reasonKey, // "energy" | "oxygen" | "safety" | "noChoices" | null
    during, // "decision" | "transition" | "scene" | null
    sol: state.sol,
    resources: { ...state.resources },
    science: state.science,
    scienceTarget: successRequirements.science,
    scienceMet: state.science >= successRequirements.science,
    safetyMet: state.resources.safety >= successRequirements.safety,
    nextCrew: {
      food: { mode: greenhouse, ...nextCrewReport.food[greenhouse] },
      safety: safetyReady
        ? { status: "ready", text: nextCrewReport.safety.ready.text }
        : { status: "low", text: nextCrewReport.safety.low.text },
    },
    // Only outcomes that actually happened; the interface turns these into report lines.
    highlights: {
      panelBonusCount,
      lowPowerCount,
      shelterHelped: state.flags.shelterPrepared && state.flags.stormResponse === "shelter",
      earthGuideHelped: state.flags.earthGuide && state.flags.stormResponse === "robot",
      sampleHelped: state.flags.sampleCollected && state.flags.finalTask === "lab",
      greenhouseStudied: state.flags.finalTask === "greenhouse",
      riskyOutdoorWork: state.flags.stormResponse === "outside",
      livingTray: state.flags.capsuleMode === "garden",
    },
  };
}

/** Dust forecast for the whole mission, used by the briefing screen. */
export function getForecast(profileOrState) {
  const profile = profileOrState.dustyAfterScenes ? profileOrState : getProfile(profileOrState);
  return SCENE_ORDER.slice(0, -1).map((sceneId, index) => ({
    sol: index + 1,
    dusty: profile.dustyAfterScenes.includes(index + 1),
  }));
}
