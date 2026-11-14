/**
 * Browser interface for Compass Outpost. Renders screens from the engine state.
 * Game rules live in src/game/engine.js; this file only displays and collects choices.
 * AI-assisted generation: Anthropic Claude. See AI_USAGE.md and ai-usage.json.
 */
import { MISSION, SCENES, SCENE_ORDER, ENDINGS, NASA_SOURCES } from "../game/scenes.js";
import {
  createGame, pickProfileId, getProfile, getScene, getChoices, getForecast,
  choose, finishFeedback, finishTransition, isDustyAfter,
} from "../game/engine.js";
import { t, ts, signed, getLanguage, setLanguage } from "../i18n/index.js";
import { icon, duti, dutiAvatar, outpostArt, weatherIcon } from "./art.js";
import { animate, stagger } from "../../assets/vendor/animejs/anime.esm.min.js";
import confetti from "../../assets/vendor/canvas-confetti/confetti.module.mjs";

const SAVE_KEY = "compass-outpost-save-v1";
const RESOURCE_KEYS = MISSION.resourceKeys;
const TOTAL_SOLS = SCENE_ORDER.length;
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const PHOTOS = {
  sunset: { src: "assets/nasa/gale-crater-sunset-PIA19400.jpg", creditKey: "photo.sunset", link: "https://images.nasa.gov/details/PIA19400" },
  rim: { src: "assets/nasa/jezero-crater-rim-PIA26373.jpg", creditKey: "photo.rim", link: "https://images.nasa.gov/details/PIA26373" },
  floor: { src: "assets/nasa/jezero-crater-floor-PIA24765.jpg", creditKey: "photo.floor", link: "https://images.nasa.gov/details/PIA24765" },
};
const CARD_PHOTOS = { "power-shortage": "rim", "solar-radiation-alert": "sunset", "welcome-to-mars": "floor" };

const app = {
  screen: "title", // title | briefing | scene | feedback | transition | ending
  game: null,
  storyIndex: 0,
  selectedChoice: null,
  feedbackIndex: 0,
  lastProfileId: null,
  resumeScreen: null, // last in-game screen, kept while the title screen is open
};

const stage = document.querySelector("#stage");
const topbar = document.querySelector("#topbar");
const modal = document.querySelector("#modal");

const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

/* ---------- saving ---------- */

function save() {
  try {
    if (app.screen !== "title") app.resumeScreen = app.screen;
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      language: getLanguage(), game: app.game, screen: app.resumeScreen, lastProfileId: app.lastProfileId,
    }));
  } catch { /* storage may be unavailable (private mode); the game still works */ }
}

function load() {
  try {
    return JSON.parse(localStorage.getItem(SAVE_KEY) ?? "null");
  } catch {
    return null;
  }
}

const canResume = () => Boolean(app.game && app.resumeScreen && app.game.status === "playing");

/* ---------- shared pieces ---------- */

function levelOf(value) {
  if (value <= 0) return "empty";
  if (value <= 3) return "critical";
  if (value <= 5) return "low";
  return "good";
}

function gauge(key, value, { compact = false } = {}) {
  const level = levelOf(value);
  const segments = Array.from({ length: 10 }, (_, i) => `<span class="seg${i < value ? " is-on" : ""}"></span>`).join("");
  const levelIcon = level === "good" ? "check" : "warning";
  return `
  <div class="gauge gauge--${key} is-${level}${compact ? " gauge--compact" : ""}" data-gauge="${key}" role="img"
       aria-label="${esc(t("hud.gauge", { name: t(`res.${key}`), value, level: t(`level.${level}`) }))}">
    <div class="gauge-head">
      <span class="gauge-name">${icon(key)}<span>${esc(t(`res.${key}`))}</span></span>
      <span class="gauge-value"><b data-gauge-number>${value}</b><small>/10</small></span>
    </div>
    <div class="gauge-bar">${segments}</div>
    <div class="gauge-level" data-gauge-level>${icon(levelIcon)}<span>${esc(t(`level.${level}`))}</span></div>
  </div>`;
}

function scienceMeter(value) {
  const target = MISSION.scienceTarget;
  const pips = Array.from({ length: Math.max(target, value) }, (_, i) =>
    `<span class="pip${i < value ? " is-on" : ""}${i >= target ? " pip--bonus" : ""}">${icon("star")}</span>`).join("");
  return `
  <div class="science${value >= target ? " is-met" : ""}" role="img" aria-label="${esc(`${t("res.science")}: ${t("hud.scienceGoal", { n: value, target })}`)}">
    <div class="gauge-head">
      <span class="gauge-name">${icon("science")}<span>${esc(t("res.science"))}</span></span>
      <span class="gauge-value"><b>${value}</b><small>/${target}</small></span>
    </div>
    <div class="pips">${pips}</div>
  </div>`;
}

function hud(resources, science) {
  return `
  <div class="hud enter" aria-label="${esc(t("ending.finalState"))}">
    ${RESOURCE_KEYS.map(key => gauge(key, resources[key])).join("")}
    ${scienceMeter(science)}
  </div>`;
}

function effectChips(effects, { showZeroNote = true } = {}) {
  const chips = [...RESOURCE_KEYS, "science"]
    .filter(key => effects[key])
    .map(key => `<span class="chip chip--${key} ${effects[key] > 0 ? "chip--gain" : "chip--cost"}">${icon(key)}<b>${signed(effects[key])}</b> ${esc(t(`res.${key}`))}</span>`);
  if (!chips.length && showZeroNote) chips.push(`<span class="chip chip--none">${esc(t("scene.noCost"))}</span>`);
  return `<div class="chips">${chips.join("")}</div>`;
}

function bubble(block, expression = "happy") {
  const caption = block.caption ? `<span class="bubble-caption">${icon("clock")}${esc(ts(block.caption))}</span>` : "";
  if (block.speakerId === "duti") {
    return `<div class="bubble bubble--duti enter"><div class="bubble-avatar">${dutiAvatar(expression)}</div>
      <div class="bubble-body"><span class="bubble-name">${esc(MISSION.robot.displayName)}</span>${caption}<p>${esc(ts(block.text))}</p></div></div>`;
  }
  return `<div class="bubble bubble--narrator enter"><div class="bubble-body">${caption}<p>${esc(ts(block.text))}</p></div></div>`;
}

function solDots(currentSol, done = false) {
  return `<ol class="sols" aria-label="${esc(t("hud.sol", { n: currentSol, total: TOTAL_SOLS }))}">${
    SCENE_ORDER.map((id, i) => {
      const n = i + 1;
      const state = n < currentSol || done ? "is-done" : n === currentSol ? "is-now" : "";
      return `<li class="${state}"><span>${n}</span></li>`;
    }).join("")}</ol>`;
}

function renderTopbar() {
  const inGame = Boolean(app.game) && app.screen !== "title";
  topbar.innerHTML = `
    <button class="brand" data-action="home" aria-label="${esc(t("nav.home"))}">
      <span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="#e2703a"/><circle cx="20" cy="20" r="17" fill="none" stroke="#f2c38b" stroke-width="2.500"/><path d="M20 8l4 12-4 12-4-12Z" fill="#fff6e6"/><path d="M20 20l4 0-4 12-4-12Z" fill="#0b1026" opacity=".55"/><circle cx="20" cy="20" r="2.200" fill="#0b1026"/></svg></span>
      <span class="brand-name">${esc(t("brand.name"))}</span>
    </button>
    <div class="topbar-mid">${inGame ? solDots(app.game.sol, app.screen === "ending" && app.game.status !== "failed") : ""}</div>
    <div class="topbar-actions">
      <button class="pill" data-action="sources">${icon("satellite")}<span>${esc(t("nav.sources"))}</span></button>
      <button class="pill pill--lang" data-action="language" aria-label="${esc(t("lang.label"))}">${icon("globe")}<span>${esc(t("lang.switchTo"))}</span></button>
    </div>`;
}

/* ---------- screens ---------- */

function titleScreen() {
  const resumable = canResume();
  return `
  <section class="screen screen--title">
    <div class="title-photo" style="background-image:url('${PHOTOS.sunset.src}')" aria-hidden="true"></div>
    <div class="title-content">
      <div class="title-duti enter">${duti("happy", { wave: true })}</div>
      <div class="title-text">
        <p class="eyebrow enter">NASA Space Apps Challenge 2026</p>
        <h1 class="enter" data-focus tabindex="-1">${esc(ts(MISSION.title))}</h1>
        <p class="lead enter">${esc(t("brand.tagline"))}</p>
        <ul class="badges enter">
          <li>${icon("star")}${esc(t("title.badgeAges"))}</li>
          <li>${icon("clock")}${esc(t("title.badgeTime"))}</li>
          <li>${icon("satellite")}${esc(t("title.badgeData"))}</li>
        </ul>
        <div class="actions enter">
          ${resumable ? `<button class="btn btn--primary" data-action="resume">${esc(t("title.resume"))}${icon("arrow")}</button>
          <button class="btn btn--ghost" data-action="new-game">${esc(t("title.newMission"))}</button>`
          : `<button class="btn btn--primary btn--big" data-action="new-game">${esc(ts(MISSION.messages.start))}${icon("arrow")}</button>`}
        </div>
      </div>
    </div>
    <p class="photo-credit enter">${esc(t("title.photoCredit"))} ${esc(t("art.aiNote"))}</p>
  </section>`;
}

function briefingScreen() {
  const profile = getProfile(app.game);
  const forecast = getForecast(profile).map(day => `
    <li class="${day.dusty ? "is-dusty" : "is-clear"}">
      ${weatherIcon(day.dusty)}
      <b>${esc(t(day.dusty ? "weather.dusty" : "weather.clear"))}</b>
      <span>${esc(t("briefing.afterSol", { n: day.sol }))}</span>
    </li>`).join("");
  return `
  <section class="screen screen--briefing">
    <div class="briefing-photo" style="background-image:url('${PHOTOS.floor.src}')" aria-hidden="true"></div>
    <div class="briefing-grid">
      <div class="card card--speech enter">
        <div class="speech-duti">${duti("happy")}</div>
        <div>
          <p class="eyebrow">${esc(t("briefing.heading"))}</p>
          <h2 data-focus tabindex="-1">${esc(ts(MISSION.openingCard.title))}</h2>
          <p>${esc(ts(MISSION.openingCard.text))}</p>
          <p class="glossary">${icon("info")}${esc(ts(MISSION.openingCard.glossary))}</p>
        </div>
      </div>
      <div class="card enter">
        <p class="eyebrow">${esc(t("briefing.profile"))}</p>
        <h3>${esc(ts(profile.title))}</h3>
        <p>${esc(ts(profile.briefing))}</p>
        <h4>${esc(t("briefing.forecast"))}</h4>
        <ol class="forecast-strip">${forecast}</ol>
        <p class="fineprint">${esc(ts(MISSION.profileNote))}</p>
      </div>
      <div class="card enter">
        <h4>${esc(t("briefing.supplies"))}</h4>
        <div class="hud hud--inline">${RESOURCE_KEYS.map(key => gauge(key, app.game.resources[key])).join("")}</div>
        <p class="goal">${icon("science")}${esc(t("briefing.goal", { n: MISSION.scienceTarget }))}</p>
        <div class="actions">
          <button class="btn btn--primary btn--big" data-action="begin">${esc(t("briefing.begin"))}${icon("arrow")}</button>
        </div>
      </div>
    </div>
    <p class="photo-credit enter">${esc(t(PHOTOS.floor.creditKey))} ${esc(t("art.aiNote"))}</p>
  </section>`;
}

function artPanel({ phase = "day", dusty = false, tag = "", flags = app.game.flags } = {}) {
  const scene = getScene(app.game);
  return `
  <div class="art enter">
    ${outpostArt({ sceneId: scene.id, flags, dusty, phase, label: ts(scene.title) })}
    <div class="art-duti">${duti(dutiMood())}</div>
    ${tag ? `<div class="art-tag">${tag}</div>` : ""}
    <span class="art-ai">${esc(t("art.aiLabel"))}</span>
  </div>`;
}

function dutiMood() {
  const game = app.game;
  if (app.screen === "ending") return game.status === "success" ? "proud" : game.status === "partial" ? "thinking" : "sad";
  if (game.sceneId === "solar-radiation-alert" && app.screen === "scene") return "alert";
  const lowest = Math.min(...RESOURCE_KEYS.map(key => game.resources[key]));
  if (lowest <= 3) return "worried";
  if (app.screen === "feedback") {
    const { effects } = game.pending;
    if (effects.safety < 0) return "worried";
    if (effects.science > 0) return "proud";
    return "happy";
  }
  if (game.sceneId === "power-shortage" || game.sceneId === "message-from-earth") return "thinking";
  return "happy";
}

function disabledText(reason) {
  if (reason.type === "minSafety") return t("scene.needSafety", reason);
  const label = ts(reason.type === "energy" ? MISSION.messages.insufficientEnergy : MISSION.messages.insufficientOxygen);
  return `${label}. ${t("scene.needAmount", reason)}`;
}

function forecastBlock(option, scene) {
  const warnings = [];
  if (option.usesUpReserve.length) warnings.push(ts(MISSION.messages.reserveWarning));
  if (!scene.transition) {
    return `<div class="forecast"><p class="forecast-head">${icon("star")}${esc(t("forecast.final"))}</p>
      ${warnings.map(text => `<p class="alert">${icon("warning")}${esc(text)}</p>`).join("")}</div>`;
  }
  if (!option.transition) {
    return `<div class="forecast">${warnings.map(text => `<p class="alert">${icon("warning")}${esc(text)}</p>`).join("")}</div>`;
  }
  const tr = option.transition;
  const notes = [];
  if (tr.panelBonus) notes.push(`<p class="note note--good">${icon("energy")}${esc(ts(MISSION.messages.panelBonus))}</p>`);
  if (tr.lowPower) notes.push(`<p class="alert">${icon("warning")}${esc(ts(MISSION.messages.lowPower))}</p>`);
  if (option.oxygenRunsOut) notes.push(`<p class="alert alert--strong">${icon("warning")}${esc(ts(MISSION.messages.oxygenTransitionWarning))}</p>`);
  return `
  <div class="forecast">
    <p class="forecast-head">${weatherIcon(tr.dusty)}<b>${esc(t(tr.dusty ? "forecast.dusty" : "forecast.clear"))}</b></p>
    <p class="forecast-line">${esc(ts(MISSION.messages.forecast, { energy: signed(tr.effects.energy), oxygen: signed(tr.effects.oxygen) }))}</p>
    ${notes.join("")}
  </div>`;
}

function choiceCard(option, scene) {
  const selected = app.selectedChoice === option.id;
  const letter = option.id.slice(-1);
  return `
  <div class="choice enter${selected ? " is-selected" : ""}${option.available ? "" : " is-locked"}">
    <button class="choice-main" data-action="select" data-choice="${option.id}" aria-pressed="${selected}" ${option.available ? "" : 'aria-disabled="true"'}>
      <span class="choice-letter" aria-hidden="true">${option.available ? letter : icon("lock")}</span>
      <span class="choice-text">
        <span class="choice-label">${esc(ts(option.label))}</span>
        ${effectChips(option.effects)}
        ${option.warning ? `<span class="alert alert--strong">${icon("warning")}${esc(ts(option.warning))}</span>` : ""}
        <span class="choice-later"><b>${esc(t("scene.later"))}:</b> ${esc(ts(option.futureConsequence))}</span>
        ${option.available ? "" : `<span class="alert">${icon("lock")}${esc(disabledText(option.disabledReason))}</span>`}
      </span>
    </button>
    ${selected && option.available ? `
    <div class="choice-extra">
      ${forecastBlock(option, scene)}
      <button class="btn btn--primary" data-action="confirm" data-choice="${option.id}">${esc(t("scene.confirm"))}${icon("arrow")}</button>
    </div>` : ""}
  </div>`;
}

function sceneScreen() {
  const game = app.game;
  const scene = getScene(game);
  const storyDone = app.storyIndex >= scene.story.length - 1;
  const shown = scene.story.slice(0, app.storyIndex + 1).map(block => bubble(block, dutiMood())).join("");
  const dustyNext = scene.transition ? isDustyAfter(game, scene.sol) : false;
  const tag = `<span>${esc(t("hud.sol", { n: scene.sol, total: TOTAL_SOLS }))}</span><b>${esc(ts(scene.title))}</b>`;
  const choices = storyDone ? `
    <h3 class="ask enter" data-focus tabindex="-1">${esc(t("scene.choose"))}</h3>
    <div class="choices">${getChoices(game).map(option => choiceCard(option, scene)).join("")}</div>
    ${app.selectedChoice ? "" : `<p class="hint enter">${esc(t("scene.pick"))}</p>`}` : `
    <div class="actions enter"><button class="btn btn--primary" data-action="story-next" data-focus>${esc(t("scene.next"))}${icon("arrow")}</button></div>`;
  return `
  <section class="screen screen--scene">
    ${hud(game.resources, game.science)}
    <div class="scene-grid">
      ${artPanel({ phase: scene.id === "solar-radiation-alert" ? "alert" : "day", tag })}
      <div class="panel">
        <div class="dialogue" aria-live="polite">${shown}</div>
        ${storyDone && scene.scienceCard ? `<button class="science-link enter" data-action="science-card">${icon("satellite")}<span>${esc(t("scene.nasaCard"))}: ${esc(ts(scene.scienceCard.title))}</span>${icon("arrow")}</button>` : ""}
        ${choices}
        ${scene.transition && storyDone ? `<p class="fineprint enter">${weatherIcon(dustyNext)} ${esc(t(dustyNext ? "forecast.dusty" : "forecast.clear"))} · ${esc(t("briefing.afterSol", { n: scene.sol }))}</p>` : ""}
      </div>
    </div>
  </section>`;
}

function changeRows(before, after) {
  const rows = RESOURCE_KEYS.filter(key => before.resources[key] !== after.resources[key]).map(key => `
    <li class="change change--${key}">${icon(key)}<span>${esc(t(`res.${key}`))}</span>
      <b>${before.resources[key]}</b>${icon("arrow")}<b>${after.resources[key]}</b>
      <em class="${after.resources[key] > before.resources[key] ? "up" : "down"}">${signed(after.resources[key] - before.resources[key])}</em></li>`);
  if (before.science !== after.science) {
    rows.push(`<li class="change change--science">${icon("science")}<span>${esc(t("res.science"))}</span>
      <b>${before.science}</b>${icon("arrow")}<b>${after.science}</b><em class="up">${signed(after.science - before.science)}</em></li>`);
  }
  return rows.length ? `<ul class="changes">${rows.join("")}</ul>` : `<p class="hint">${esc(t("feedback.noChange"))}</p>`;
}

function feedbackScreen() {
  const game = app.game;
  const pending = game.pending;
  const scene = getScene(game);
  const blocks = pending.feedback.slice(0, app.feedbackIndex + 1).map(block => bubble(block, dutiMood())).join("");
  const tag = `<span>${esc(t("hud.sol", { n: scene.sol, total: TOTAL_SOLS }))}</span><b>${esc(ts(scene.title))}</b>`;
  return `
  <section class="screen screen--scene screen--feedback">
    ${hud(pending.after.resources, pending.after.science)}
    <div class="scene-grid">
      ${artPanel({ phase: scene.id === "solar-radiation-alert" ? "alert" : "day", tag })}
      <div class="panel">
        <div class="card card--flat enter">
          <p class="eyebrow">${esc(t("feedback.youChose"))}</p>
          <h3 data-focus tabindex="-1">${esc(ts(pending.label))}</h3>
          <h4>${esc(t("feedback.changes"))}</h4>
          ${changeRows(pending.before, pending.after)}
        </div>
        <div class="dialogue" aria-live="polite">${blocks}</div>
        <div class="actions enter"><button class="btn btn--primary" data-action="feedback-next">${esc(ts(MISSION.messages.continue))}${icon("arrow")}</button></div>
      </div>
    </div>
  </section>`;
}

function transitionScreen() {
  const game = app.game;
  const tr = game.lastTransition;
  const scene = getScene(game);
  const nextSol = scene.sol + 1;
  const tag = `${icon("moon")}<b>${esc(t("transition.title", { a: scene.sol, b: nextSol }))}</b>`;
  return `
  <section class="screen screen--scene screen--transition">
    ${hud(game.resources, game.science)}
    <div class="scene-grid">
      ${artPanel({ phase: "night", dusty: tr.dusty, tag })}
      <div class="panel">
        <div class="card card--flat enter">
          <p class="eyebrow">${weatherIcon(tr.dusty)} ${esc(t(tr.dusty ? "forecast.dusty" : "forecast.clear"))}</p>
          <h3 data-focus tabindex="-1">${esc(t("transition.title", { a: scene.sol, b: nextSol }))}</h3>
          <ul class="ledger">
            <li>${icon("energy")}<div><b>${esc(t("transition.battery"))} ${signed(tr.effects.energy)}</b>
              <p>${esc(ts(tr.dusty ? MISSION.messages.dustyStage : MISSION.messages.clearStage))}</p>
              ${tr.panelBonus ? `<p class="note note--good">${icon("check")}${esc(ts(MISSION.messages.panelBonus))}</p>` : ""}</div></li>
            <li>${icon("oxygen")}<div><b>${esc(t("transition.crewAir"))} ${signed(tr.effects.oxygen)}</b>
              ${tr.lowPower ? `<p class="alert">${icon("warning")}${esc(ts(MISSION.messages.lowPower))}</p>` : ""}</div></li>
          </ul>
          ${changeRows({ resources: tr.before, science: game.science }, { resources: tr.after, science: game.science })}
          ${tr.note ? `<p class="fineprint">${icon("info")}${esc(ts(tr.note))}</p>` : ""}
        </div>
        <div class="card card--lesson enter">
          <p class="eyebrow">${icon("star")}${esc(t("transition.lesson"))}</p>
          <p>${esc(ts(scene.learningGoal))}</p>
        </div>
        <div class="actions enter"><button class="btn btn--primary" data-action="transition-next">${esc(t("transition.toSol", { n: nextSol }))}${icon("arrow")}</button></div>
      </div>
    </div>
  </section>`;
}

function endingScreen() {
  const game = app.game;
  const ending = game.ending;
  const copy = ENDINGS[ending.status];
  const highlights = [];
  const h = ending.highlights;
  if (h.panelBonusCount) highlights.push(["good", t("ending.hl.panel", { n: h.panelBonusCount })]);
  if (h.shelterHelped) highlights.push(["good", t("ending.hl.shelter")]);
  if (h.earthGuideHelped) highlights.push(["good", t("ending.hl.earth")]);
  if (h.sampleHelped) highlights.push(["good", t("ending.hl.sample")]);
  if (h.greenhouseStudied) highlights.push(["good", t("ending.hl.greenhouse")]);
  if (h.lowPowerCount) highlights.push(["warn", t("ending.hl.lowPower", { n: h.lowPowerCount })]);
  if (h.riskyOutdoorWork) highlights.push(["warn", t("ending.hl.risky")]);
  if (!highlights.length) highlights.push(["info", t("ending.hl.none")]);

  const reasons = [];
  if (ending.status === "failed") {
    reasons.push(ts(ENDINGS.failed.reasons[ending.reasonKey]));
    reasons.push(t("ending.stoppedOn", { n: ending.sol }));
  } else if (!ending.scienceMet) {
    reasons.push(t("ending.scienceShort", { n: ending.scienceTarget - ending.science }));
  }
  const crew = ending.nextCrew;
  const foodIcon = crew.food.status === "ready" ? "check" : "warning";
  const lessons = game.log.map(entry => SCENES[entry.sceneId].learningGoal);

  return `
  <section class="screen screen--ending is-${ending.status}">
    <div class="ending-hero enter">
      <div class="ending-duti">${duti(dutiMood())}</div>
      <div>
        <p class="eyebrow">${esc(ts(getProfile(game).title))}</p>
        <h1 data-focus tabindex="-1">${esc(ts(copy.title))}</h1>
        <p class="lead">${esc(ts(copy.text))}</p>
        ${reasons.map(text => `<p class="alert alert--strong">${icon("info")}${esc(text)}</p>`).join("")}
      </div>
    </div>
    ${hud(ending.resources, ending.science)}
    <div class="ending-grid">
      <div class="card enter">
        <h3>${esc(t("ending.why"))}</h3>
        <ul class="highlights">${highlights.map(([kind, text]) => `<li class="is-${kind}">${icon(kind === "good" ? "check" : kind === "warn" ? "warning" : "info")}<span>${esc(text)}</span></li>`).join("")}</ul>
      </div>
      <div class="card enter">
        <h3>${icon("leaf")} ${esc(ts(MISSION.nextCrewReport.title))}</h3>
        <ul class="highlights">
          <li class="is-${crew.food.status === "ready" ? "good" : "warn"}">${icon(foodIcon)}<span>${esc(ts(crew.food.text))}</span></li>
          <li class="is-${crew.safety.status === "ready" ? "good" : "warn"}">${icon(crew.safety.status === "ready" ? "check" : "warning")}<span>${esc(ts(crew.safety.text))}</span></li>
        </ul>
      </div>
      <div class="card enter">
        <h3>${esc(t("ending.decisions"))}</h3>
        <ol class="decisions">${game.log.map(entry => `<li><span class="sol-chip">${esc(t("ending.sol", { n: entry.sol }))}</span><div><b>${esc(ts(entry.label))}</b>${effectChips(entry.effects, { showZeroNote: false })}</div></li>`).join("")}</ol>
      </div>
      <div class="card enter">
        <h3>${esc(t("ending.lessons"))}</h3>
        <ul class="lessons">${lessons.map(text => `<li>${icon("star")}<span>${esc(ts(text))}</span></li>`).join("")}</ul>
      </div>
    </div>
    <div class="actions actions--center enter">
      <button class="btn btn--primary btn--big" data-action="new-game">${icon("restart")}${esc(ts(MISSION.messages.tryAgain))}</button>
      <button class="btn btn--ghost" data-action="sources">${icon("satellite")}${esc(t("nav.sources"))}</button>
    </div>
    <p class="fineprint center enter">${esc(t("ending.newForecast"))} ${esc(ts(MISSION.messages.disclaimer))} ${esc(t("art.aiNote"))}</p>
  </section>`;
}

/* ---------- modals ---------- */

function sourceList(ids) {
  return `<ul class="sources">${ids.map(id => {
    const source = NASA_SOURCES[id];
    const archival = source.kind.startsWith("archival");
    return `<li>
      <div><b>${esc(ts(source.title))}</b>
        <span class="source-meta">${esc(t(`kind.${source.kind}`))}${source.observationPeriod ? ` · ${esc(t("modal.observed"))}: ${esc(ts(source.observationPeriod))}` : ""}${archival ? ` · ${esc(t("modal.archival"))}` : ""}</span></div>
      <a class="pill" href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(t("modal.openSource"))}${icon("arrow")}</a>
    </li>`;
  }).join("")}</ul>`;
}

function photoFigure(key) {
  const photo = PHOTOS[key];
  return `<figure class="photo"><img src="${photo.src}" alt="${esc(t(photo.creditKey))}" loading="lazy">
    <figcaption><span class="tag">${esc(t("photo.realPhoto"))}</span> ${esc(t(photo.creditKey))}</figcaption></figure>`;
}

function openModal(html) {
  modal.innerHTML = `<div class="modal-inner">${html}</div>`;
  if (!modal.open) modal.showModal();
  modal.querySelector("[data-focus]")?.focus();
}

function scienceCardModal() {
  const scene = getScene(app.game);
  const card = scene.scienceCard;
  const photoKey = CARD_PHOTOS[scene.id];
  openModal(`
    <header class="modal-head"><p class="eyebrow">${icon("satellite")}${esc(t("scene.nasaCard"))}</p>
      <button class="icon-btn" data-action="close-modal" aria-label="${esc(t("modal.close"))}">${icon("close")}</button></header>
    <h2 data-focus tabindex="-1">${esc(ts(card.title))}</h2>
    ${photoKey && scene.id !== "welcome-to-mars" ? photoFigure(photoKey) : ""}
    <p class="lead">${esc(ts(card.text))}</p>
    ${card.dataNote ? `<details class="details"><summary>${esc(t("modal.details"))}</summary><p>${esc(ts(card.dataNote))}</p></details>` : ""}
    ${sourceList(card.sourceIds)}
    <div class="actions actions--center"><button class="btn btn--primary" data-action="close-modal">${esc(t("modal.gotIt"))}</button></div>`);
}

function sourcesModal() {
  openModal(`
    <header class="modal-head"><p class="eyebrow">${icon("satellite")}${esc(t("nav.sources"))}</p>
      <button class="icon-btn" data-action="close-modal" aria-label="${esc(t("modal.close"))}">${icon("close")}</button></header>
    <h2 data-focus tabindex="-1">${esc(t("modal.sourcesTitle"))}</h2>
    <p>${esc(t("modal.sourcesIntro"))}</p>
    <h3>${esc(t("modal.science"))}</h3>
    ${sourceList(Object.keys(NASA_SOURCES))}
    <h3>${esc(t("modal.photos"))}</h3>
    <ul class="sources">${Object.values(PHOTOS).map(photo => `<li><div><span class="source-meta">${esc(t(photo.creditKey))}</span></div>
      <a class="pill" href="${photo.link}" target="_blank" rel="noopener noreferrer">${esc(t("modal.openSource"))}${icon("arrow")}</a></li>`).join("")}</ul>
    <h3>${esc(ts(MISSION.creditsCard.title))}</h3>
    <p>${esc(ts(MISSION.creditsCard.text))}</p>
    <p><a href="${esc(MISSION.creditsCard.detailsDocument)}" target="_blank" rel="noopener noreferrer">${esc(t("modal.aiLink"))}</a></p>
    <h3>${esc(t("modal.tools"))}</h3>
    <p>${esc(t("modal.toolsText"))}</p>
    <p class="fineprint">${esc(ts(MISSION.messages.disclaimer))} ${esc(ts(MISSION.profileNote))}</p>
    <div class="actions actions--center"><button class="btn btn--primary" data-action="close-modal">${esc(t("modal.close"))}</button></div>`);
}

/* ---------- rendering and actions ---------- */

const SCREENS = {
  title: titleScreen,
  briefing: briefingScreen,
  scene: sceneScreen,
  feedback: feedbackScreen,
  transition: transitionScreen,
  ending: endingScreen,
};

function render({ animateIn = true, focus = true } = {}) {
  document.documentElement.lang = getLanguage();
  document.title = ts(MISSION.title);
  document.body.dataset.screen = app.screen;
  renderTopbar();
  stage.innerHTML = SCREENS[app.screen]();
  if (focus) stage.querySelector("[data-focus]")?.focus({ preventScroll: true });
  if (animateIn && !reducedMotion()) {
    animate(stage.querySelectorAll(".enter"), {
      opacity: [0, 1],
      translateY: [18, 0],
      delay: stagger(55),
      duration: 520,
      ease: "outCubic",
    });
  }
  if (app.screen === "ending" && app.game.status === "success" && animateIn && !reducedMotion()) {
    setTimeout(() => confetti({ particleCount: 140, spread: 85, origin: { y: 0.3 }, colors: ["#ffc93c", "#4fd1ff", "#7be495", "#e2703a", "#c79bff"] }), 350);
  }
  save();
}

/** Re-render only the newest elements softly (used when revealing story lines or selecting a card). */
function refresh() {
  const scrollY = window.scrollY;
  render({ animateIn: false, focus: false });
  window.scrollTo({ top: scrollY });
}

function pulseNewest(selector) {
  if (reducedMotion()) return;
  const items = stage.querySelectorAll(selector);
  const last = items[items.length - 1];
  if (last) animate(last, { opacity: [0, 1], translateY: [14, 0], duration: 420, ease: "outCubic" });
}

function startNewGame() {
  const profileId = pickProfileId(Math.random, app.lastProfileId);
  app.lastProfileId = profileId;
  app.game = createGame(profileId);
  app.storyIndex = 0;
  app.selectedChoice = null;
  app.feedbackIndex = 0;
  app.screen = "briefing";
  window.scrollTo({ top: 0 });
  render();
}

function goToPhaseScreen() {
  const phase = app.game.phase;
  app.screen = phase === "ended" ? "ending" : phase;
  app.selectedChoice = null;
  if (phase === "scene") app.storyIndex = 0;
  if (phase === "feedback") app.feedbackIndex = 0;
  window.scrollTo({ top: 0 });
  render();
}

const actions = {
  home() {
    app.screen = "title";
    window.scrollTo({ top: 0 });
    render();
  },
  language() {
    setLanguage(getLanguage() === "en" ? "tr" : "en");
    refresh();
    if (modal.open) modal.close();
  },
  sources: sourcesModal,
  "science-card": scienceCardModal,
  "close-modal"() {
    modal.close();
  },
  "new-game": startNewGame,
  resume() {
    if (!canResume()) return;
    app.screen = app.resumeScreen === "briefing" ? "briefing" : app.game.phase === "ended" ? "ending" : app.game.phase;
    app.storyIndex = getScene(app.game).story.length - 1;
    app.feedbackIndex = app.game.pending ? app.game.pending.feedback.length - 1 : 0;
    app.selectedChoice = null;
    render();
  },
  begin() {
    app.screen = "scene";
    app.storyIndex = 0;
    window.scrollTo({ top: 0 });
    render();
  },
  "story-next"() {
    app.storyIndex += 1;
    refresh();
    const done = app.storyIndex >= getScene(app.game).story.length - 1;
    pulseNewest(".bubble");
    if (done && !reducedMotion()) {
      animate(stage.querySelectorAll(".choice, .ask, .science-link"), { opacity: [0, 1], translateY: [16, 0], delay: stagger(70, { start: 150 }), duration: 460, ease: "outCubic" });
    }
    (stage.querySelector("[data-action='story-next']") ?? stage.querySelector(".ask"))?.focus({ preventScroll: true });
  },
  select(target) {
    const id = target.dataset.choice;
    const option = getChoices(app.game).find(item => item.id === id);
    if (!option?.available) return;
    app.selectedChoice = app.selectedChoice === id ? null : id;
    refresh();
    const extra = stage.querySelector(".choice.is-selected .choice-extra");
    if (extra) {
      if (!reducedMotion()) animate(extra, { opacity: [0, 1], translateY: [-8, 0], duration: 320, ease: "outCubic" });
      extra.querySelector(".btn")?.focus({ preventScroll: true });
      extra.scrollIntoView({ block: "nearest", behavior: reducedMotion() ? "auto" : "smooth" });
    }
  },
  confirm(target) {
    app.game = choose(app.game, target.dataset.choice);
    goToPhaseScreen();
  },
  "feedback-next"() {
    if (app.feedbackIndex < app.game.pending.feedback.length - 1) {
      app.feedbackIndex += 1;
      refresh();
      pulseNewest(".bubble");
      return;
    }
    app.game = finishFeedback(app.game);
    goToPhaseScreen();
  },
  "transition-next"() {
    app.game = finishTransition(app.game);
    goToPhaseScreen();
  },
};

document.addEventListener("click", event => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  if (target.getAttribute("aria-disabled") === "true") return;
  actions[target.dataset.action]?.(target);
});
modal.addEventListener("click", event => {
  if (event.target === modal) modal.close(); // click on the backdrop
});

/* ---------- start ---------- */

const saved = load();
setLanguage(saved?.language ?? "en"); // English first; Turkish is opt-in
app.lastProfileId = saved?.lastProfileId ?? null;
if (saved?.game?.phase && saved.screen) {
  app.game = saved.game;
  app.resumeScreen = saved.screen;
}
render();
