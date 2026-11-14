/**
 * Browser interface for Compass Outpost: a full-screen, no-scroll game.
 * Each sol happens in its own location; story, choices and results appear as pop-ups.
 * Game rules live in src/game/engine.js; this file only displays and collects choices.
 * AI-assisted generation: Anthropic Claude. See AI_USAGE.md and ai-usage.json.
 */
import { MISSION, SCENES, SCENE_ORDER, ENDINGS, NASA_SOURCES } from "../game/scenes.js";
import {
  createGame, pickProfileId, getProfile, getScene, getChoices, getForecast,
  choose, finishFeedback, finishTransition, isDustyAfter,
} from "../game/engine.js";
import { t, ts, signed, getLanguage, setLanguage } from "../i18n/index.js";
import { icon, duti, dutiAvatar, weatherIcon } from "./art.js";
import { titleWorld, sceneWorld, nightWorld, LOCATIONS } from "./world.js";
import { animate, stagger } from "../../assets/vendor/animejs/anime.esm.min.js";
import confetti from "../../assets/vendor/canvas-confetti/confetti.module.mjs";

const SAVE_KEY = "compass-outpost-save-v2";
const RESOURCE_KEYS = MISSION.resourceKeys;
const TOTAL_SOLS = SCENE_ORDER.length;
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const wait = ms => new Promise(resolve => setTimeout(resolve, reducedMotion() ? 0 : ms));
const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

const PHOTOS = {
  sunset: { src: "assets/nasa/gale-crater-sunset-PIA19400.jpg", creditKey: "photo.sunset", link: "https://images.nasa.gov/details/PIA19400" },
  rim: { src: "assets/nasa/jezero-crater-rim-PIA26373.jpg", creditKey: "photo.rim", link: "https://images.nasa.gov/details/PIA26373" },
  floor: { src: "assets/nasa/jezero-crater-floor-PIA24765.jpg", creditKey: "photo.floor", link: "https://images.nasa.gov/details/PIA24765" },
};
const CARD_PHOTOS = { "power-shortage": "floor", "solar-radiation-alert": "sunset" };

/* screen: title | briefing | intro | story | choices | result | transition | ledger | ending */
const app = {
  screen: "title",
  game: null,
  line: 0,
  selected: null,
  seenCards: [],
  lastProfileId: null,
  resumeScreen: null,
  worldKey: "",
  hudShown: null,
  introToken: null,
  cinemaToken: null,
};

const $ = selector => document.querySelector(selector);
const worldEl = $("#world");
const topbarEl = $("#topbar");
const hudEl = $("#hud");
const layerEl = $("#layer");
const modal = $("#modal");

let typing = null; // active typewriter

/* ---------- saving ---------- */

function save() {
  try {
    if (app.screen !== "title") app.resumeScreen = app.screen;
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      language: getLanguage(), game: app.game, screen: app.resumeScreen,
      lastProfileId: app.lastProfileId, seenCards: app.seenCards,
    }));
  } catch { /* storage can be unavailable; the game still works */ }
}

function load() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY) ?? "null"); } catch { return null; }
}

const canResume = () => Boolean(app.game && app.resumeScreen && app.game.status === "playing");

/* ---------- small helpers ---------- */

function levelOf(value) {
  if (value <= 0) return "empty";
  if (value <= 3) return "critical";
  if (value <= 5) return "low";
  return "good";
}

function chips(effects, { zeroNote = true } = {}) {
  const list = [...RESOURCE_KEYS, "science"].filter(key => effects[key]).map(key =>
    `<span class="chip chip--${key} ${effects[key] > 0 ? "is-gain" : "is-cost"}">${icon(key)}<b>${signed(effects[key])}</b><span>${esc(t(`res.${key}`))}</span></span>`);
  if (!list.length && zeroNote) list.push(`<span class="chip chip--none">${esc(t("choices.noCost"))}</span>`);
  return `<span class="chips">${list.join("")}</span>`;
}

function pop(selector, extra = {}) {
  if (reducedMotion()) return;
  const list = layerEl.querySelectorAll(selector);
  if (!list.length) return;
  animate(list, { opacity: [0, 1], scale: [0.86, 1], translateY: [24, 0], duration: 520, ease: "outBack(1.6)", ...extra });
}

function dutiMood() {
  const game = app.game;
  if (!game) return "happy";
  if (app.screen === "ending") return game.status === "success" ? "proud" : game.status === "partial" ? "thinking" : "sad";
  if (app.screen === "result" && game.pending) {
    const fx = game.pending.effects;
    if (fx.safety < 0) return "worried";
    if (fx.science > 0) return "proud";
    return "happy";
  }
  if (game.sceneId === "solar-radiation-alert") return "alert";
  if (Math.min(...RESOURCE_KEYS.map(key => game.resources[key])) <= 3) return "worried";
  if (game.sceneId === "power-shortage" || game.sceneId === "message-from-earth") return "thinking";
  return "happy";
}

/* ---------- world (background location) ---------- */

function setWorld(key, html, { zoom = true } = {}) {
  if (app.worldKey === key) return;
  app.worldKey = key;
  const next = document.createElement("div");
  next.className = "world-scene";
  next.innerHTML = html;
  worldEl.append(next);
  const old = [...worldEl.children].slice(0, -1);
  if (reducedMotion()) {
    old.forEach(node => node.remove());
    return;
  }
  animate(next, { opacity: [0, 1], scale: zoom ? [1.12, 1] : [1, 1], duration: 1100, ease: "outCubic" });
  old.forEach(node => animate(node, { opacity: [1, 0], duration: 700, ease: "linear", onComplete: () => node.remove() }));
}

const signLabels = () => ({ lab: t("sign.lab"), route: t("sign.route"), plants: t("sign.plants"), mars: t("sign.mars"), earth: t("sign.earth") });

function worldForScene() {
  const game = app.game;
  const scene = getScene(game);
  const dusty = scene.transition ? isDustyAfter(game, scene.sol) : false;
  const location = LOCATIONS[scene.id];
  const resKey = location === "power" || location === "final" ? JSON.stringify(game.resources) : "";
  setWorld(`scene:${scene.id}:${JSON.stringify(game.flags)}:${resKey}:${getLanguage()}`,
    sceneWorld(scene.id, game, { dusty, photoSrc: PHOTOS.rim.src, labels: signLabels() }));
}

/* ---------- top bar and HUD ---------- */

function renderTopbar() {
  const inGame = Boolean(app.game) && app.screen !== "title";
  const sol = app.game?.sol ?? 1;
  const done = app.screen === "ending" && app.game?.status !== "failed";
  const scene = inGame ? getScene(app.game) : null;
  const hasFact = inGame && scene?.scienceCard && ["story", "choices", "result"].includes(app.screen);
  topbarEl.innerHTML = `
    <button class="brand" data-action="home" aria-label="${esc(t("nav.home"))}">
      <span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="#e2703a"/><circle cx="20" cy="20" r="17" fill="none" stroke="#f2c38b" stroke-width="2.5"/><path d="M20 8l4 12-4 12-4-12Z" fill="#fff6e6"/><path d="M20 20h4l-4 12-4-12Z" fill="#0b1026" opacity=".55"/><circle cx="20" cy="20" r="2.2" fill="#0b1026"/></svg></span>
      <span class="brand-name">${esc(t("brand.name"))}</span>
    </button>
    <ol class="sols" ${inGame ? `aria-label="${esc(t("hud.sol", { n: sol, total: TOTAL_SOLS }))}"` : "hidden"}>
      ${SCENE_ORDER.map((id, i) => {
        const n = i + 1;
        const cls = n < sol || done ? "is-done" : n === sol ? "is-now" : "";
        return `<li class="${cls}"><span>${n}</span></li>`;
      }).join("")}
    </ol>
    <div class="topbar-actions">
      ${hasFact ? `<button class="pill pill--fact" data-action="science-card">${icon("satellite")}<span>${esc(t("nav.fact"))}</span></button>` : ""}
      <button class="pill pill--icon" data-action="sources" aria-label="${esc(t("nav.sources"))}" title="${esc(t("nav.sources"))}">${icon("info")}</button>
      <button class="pill" data-action="language" aria-label="${esc(t("lang.label"))}">${icon("globe")}<span>${esc(t("lang.switchTo"))}</span></button>
    </div>`;
}

function gaugeHtml(key, value) {
  const level = levelOf(value);
  return `
  <div class="gauge gauge--${key} is-${level}" data-gauge="${key}" role="img" aria-label="${esc(t("hud.gauge", { name: t(`res.${key}`), value, level: t(`level.${level}`) }))}">
    <span class="gauge-icon">${icon(key)}</span>
    <span class="gauge-body">
      <span class="gauge-top"><span class="gauge-name">${esc(t(`res.${key}`))}</span><b class="gauge-num">${value}</b></span>
      <span class="gauge-bar">${Array.from({ length: 10 }, (_, i) => `<i class="${i < value ? "on" : ""}"></i>`).join("")}</span>
      <span class="gauge-level">${level === "good" ? "" : icon("warning")}${esc(t(`level.${level}`))}</span>
    </span>
  </div>`;
}

function scienceHtml(value) {
  const target = MISSION.scienceTarget;
  return `
  <div class="gauge gauge--science ${value >= target ? "is-met" : ""}" data-gauge="science" role="img" aria-label="${esc(t("hud.science", { n: value, target }))}">
    <span class="gauge-icon">${icon("science")}</span>
    <span class="gauge-body">
      <span class="gauge-top"><span class="gauge-name">${esc(t("res.science"))}</span><b class="gauge-num">${value}<small>/${target}</small></b></span>
      <span class="stars">${Array.from({ length: Math.max(target, value) }, (_, i) => `<i class="${i < value ? "on" : ""} ${i >= target ? "bonus" : ""}">${icon("star")}</i>`).join("")}</span>
    </span>
  </div>`;
}

function renderHud(resources, science) {
  if (!resources) {
    hudEl.innerHTML = "";
    hudEl.hidden = true;
    app.hudShown = null;
    return;
  }
  hudEl.hidden = false;
  hudEl.innerHTML = RESOURCE_KEYS.map(key => gaugeHtml(key, resources[key])).join("") + scienceHtml(science);
  app.hudShown = { resources: { ...resources }, science };
}

function bumpGauge(key, delta) {
  const el = hudEl.querySelector(`[data-gauge="${key}"]`);
  if (!el || reducedMotion()) return;
  el.classList.remove("bump-up", "bump-down");
  void el.offsetWidth;
  el.classList.add(delta > 0 ? "bump-up" : "bump-down");
}

/** Fly "+2" chips from a source element to the HUD gauges, then update the HUD. */
async function flyEffects(fromEl, effects, after) {
  const keys = [...RESOURCE_KEYS, "science"].filter(key => effects[key]);
  if (!keys.length || reducedMotion() || !fromEl) {
    renderHud(after.resources, after.science);
    return;
  }
  const from = fromEl.getBoundingClientRect();
  await Promise.all(keys.map((key, index) => new Promise(resolve => {
    const target = hudEl.querySelector(`[data-gauge="${key}"]`)?.getBoundingClientRect();
    const node = document.createElement("div");
    node.className = `flyer chip chip--${key} ${effects[key] > 0 ? "is-gain" : "is-cost"}`;
    node.innerHTML = `${icon(key)}<b>${signed(effects[key])}</b>`;
    document.body.append(node);
    const startX = from.left + from.width / 2 - 30 + (index - (keys.length - 1) / 2) * 76;
    const startY = from.top + from.height / 2;
    node.style.left = `${startX}px`;
    node.style.top = `${startY}px`;
    const dx = target ? target.left + target.width / 2 - startX - 30 : 0;
    const dy = target ? target.top + target.height / 2 - startY - 14 : -200;
    animate(node, {
      translateX: [0, dx], translateY: [0, dy], scale: [1.25, 0.6], opacity: [1, 1, 0],
      delay: 250 + index * 140, duration: 900, ease: "inOutCubic",
      onComplete: () => { node.remove(); resolve(); },
    });
  })));
  renderHud(after.resources, after.science);
  keys.forEach(key => bumpGauge(key, effects[key]));
}

/* ---------- typewriter dialog ---------- */

function typeInto(el, text) {
  stopTyping();
  el.setAttribute("aria-label", text);
  if (reducedMotion()) {
    el.textContent = text;
    return;
  }
  const chars = [...text];
  let index = 0;
  el.textContent = "";
  typing = { el, text, timer: setInterval(() => {
    index += 2;
    el.textContent = chars.slice(0, index).join("");
    if (index >= chars.length) stopTyping();
  }, 22) };
}

function stopTyping(finish = false) {
  if (!typing) return false;
  clearInterval(typing.timer);
  if (finish) typing.el.textContent = typing.text;
  typing = null;
  return true;
}

function dialogHtml(block, counter) {
  const isDuti = block.speakerId === "duti";
  const caption = block.caption ? `<span class="dialog-caption">${icon("clock")}${esc(ts(block.caption))}</span>` : "";
  return `
  <div class="dialog ${isDuti ? "dialog--duti" : "dialog--narrator"}" data-action="advance" role="button" tabindex="0" aria-live="polite">
    ${isDuti ? `<div class="dialog-portrait">${duti(dutiMood())}</div>` : ""}
    <div class="dialog-box">
      <div class="dialog-name">${isDuti ? esc(MISSION.robot.displayName) : esc(t("dialog.story"))}${caption}</div>
      <p class="dialog-text" data-text></p>
      <div class="dialog-foot"><span class="dialog-counter">${counter}</span><span class="dialog-next">${esc(t("dialog.next"))}${icon("arrow")}</span></div>
    </div>
  </div>`;
}

function showLine(block, counter) {
  layerEl.innerHTML = dialogHtml(block, counter);
  const dialog = layerEl.querySelector(".dialog");
  if (!reducedMotion()) {
    animate(dialog.querySelector(".dialog-box"), { opacity: [0, 1], translateY: [40, 0], duration: 420, ease: "outCubic" });
    const portrait = dialog.querySelector(".dialog-portrait");
    if (portrait) animate(portrait, { opacity: [0, 1], translateX: [-60, 0], rotate: [-8, 0], duration: 600, ease: "outBack(1.4)" });
  }
  typeInto(dialog.querySelector("[data-text]"), ts(block.text));
  dialog.focus({ preventScroll: true });
}

/* ---------- screens ---------- */

function showTitle() {
  app.screen = "title";
  stopTyping();
  setWorld(`title:${getLanguage()}`, titleWorld(), { zoom: false });
  renderHud(null);
  layerEl.innerHTML = `
  <section class="title">
    <div class="title-text">
      <p class="eyebrow">NASA Space Apps Challenge 2026</p>
      <h1 data-focus tabindex="-1">${esc(ts(MISSION.title))}</h1>
      <p class="lead">${esc(t("brand.tagline"))}</p>
      <ul class="badges">
        <li>${icon("star")}${esc(t("title.badgeAges"))}</li>
        <li>${icon("clock")}${esc(t("title.badgeTime"))}</li>
        <li>${icon("satellite")}${esc(t("title.badgeData"))}</li>
      </ul>
      <div class="actions">
        ${canResume()
          ? `<button class="btn btn--primary btn--big" data-action="resume">${esc(t("title.resume"))}${icon("arrow")}</button>
             <button class="btn btn--ghost" data-action="new-game">${esc(t("title.newMission"))}</button>`
          : `<button class="btn btn--primary btn--big" data-action="new-game">${esc(ts(MISSION.messages.start))}${icon("arrow")}</button>`}
      </div>
    </div>
    <div class="title-duti">${duti("happy", { wave: true })}</div>
    <p class="footnote">${esc(t("art.aiNote"))}</p>
  </section>`;
  if (!reducedMotion()) {
    animate(layerEl.querySelectorAll(".title-text > *"), { opacity: [0, 1], translateY: [30, 0], delay: stagger(110, { start: 250 }), duration: 700, ease: "outCubic" });
    animate(layerEl.querySelector(".title-duti"), { opacity: [0, 1], translateY: [120, 0], rotate: [-12, 0], delay: 500, duration: 1100, ease: "outElastic(1, .6)" });
  }
  finishRender();
}

function showBriefing() {
  app.screen = "briefing";
  const game = app.game;
  const profile = getProfile(game);
  setWorld(`brief:${game.profileId}`, sceneWorld("welcome-to-mars", game, { dusty: false }));
  renderHud(game.resources, game.science);
  layerEl.innerHTML = `
  <div class="popup popup--briefing" role="dialog" aria-labelledby="brief-title">
    <div class="popup-duti">${duti("happy", { wave: true })}</div>
    <p class="eyebrow">${icon("satellite")}${esc(t("briefing.heading"))}</p>
    <h2 id="brief-title" data-focus tabindex="-1">${esc(ts(MISSION.openingCard.title))}</h2>
    <p class="lead">${esc(ts(MISSION.openingCard.text))}</p>
    <p class="glossary">${icon("info")}${esc(ts(MISSION.openingCard.glossary))}</p>
    <div class="brief-grid">
      <div class="brief-box">
        <p class="label">${esc(t("briefing.profile"))}</p>
        <h3>${esc(ts(profile.title))}</h3>
        <p class="small">${esc(ts(profile.briefing))}</p>
      </div>
      <div class="brief-box">
        <p class="label">${esc(t("briefing.forecast"))}</p>
        <ol class="forecast-strip">${getForecast(profile).map(day => `
          <li class="${day.dusty ? "is-dusty" : ""}">
            ${weatherIcon(day.dusty)}<b>${esc(t(day.dusty ? "weather.dusty" : "weather.clear"))}</b><span>${esc(t("briefing.afterSol", { n: day.sol }))}</span>
          </li>`).join("")}</ol>
      </div>
    </div>
    <p class="goal">${icon("science")}${esc(t("briefing.goal", { n: MISSION.scienceTarget }))}</p>
    <p class="fineprint">${esc(ts(MISSION.profileNote))}</p>
    <div class="actions actions--end"><button class="btn btn--primary btn--big" data-action="begin">${esc(t("briefing.begin"))}${icon("arrow")}</button></div>
  </div>`;
  pop(".popup");
  if (!reducedMotion()) animate(layerEl.querySelectorAll(".forecast-strip li"), { opacity: [0, 1], translateY: [20, 0], delay: stagger(90, { start: 450 }), duration: 450, ease: "outBack(2)" });
  finishRender();
}

async function showIntro() {
  app.screen = "intro";
  stopTyping();
  const scene = getScene(app.game);
  worldForScene();
  renderHud(app.game.resources, app.game.science);
  layerEl.innerHTML = `
  <div class="intro" data-action="intro-done" role="button" tabindex="0">
    <div class="intro-card">
      <p class="intro-sol">${esc(t("intro.sol", { n: scene.sol }))}</p>
      <h2 class="intro-title" data-focus tabindex="-1">${esc(ts(scene.title))}</h2>
      <p class="intro-loc">${icon("star")}${esc(t(`loc.${LOCATIONS[scene.id]}`))}</p>
    </div>
    <p class="intro-tap">${esc(t("intro.tap"))}</p>
  </div>`;
  finishRender();
  if (!reducedMotion()) {
    animate(layerEl.querySelector(".intro-sol"), { opacity: [0, 1], letterSpacing: ["0.6em", "0.18em"], duration: 900, ease: "outCubic" });
    animate(layerEl.querySelector(".intro-title"), { opacity: [0, 1], translateY: [40, 0], scale: [0.9, 1], delay: 200, duration: 800, ease: "outBack(1.5)" });
    animate(layerEl.querySelector(".intro-loc"), { opacity: [0, 1], delay: 600, duration: 600 });
  }
  const token = `${app.game.history.length}:${scene.id}`;
  app.introToken = token;
  await wait(2600);
  if (app.screen === "intro" && app.introToken === token) startStory();
}

function startStory() {
  app.screen = "story";
  app.line = 0;
  renderStoryLine();
}

function renderStoryLine() {
  const scene = getScene(app.game);
  app.screen = "story";
  worldForScene();
  renderHud(app.game.resources, app.game.science);
  showLine(scene.story[app.line], `${app.line + 1} / ${scene.story.length}`);
  finishRender({ focus: false });
}

function afterStory() {
  const scene = getScene(app.game);
  showChoices();
  if (scene.scienceCard && !app.seenCards.includes(scene.id)) {
    app.seenCards.push(scene.id);
    save();
    scienceCardModal();
  }
}

function disabledText(reason) {
  if (reason.type === "minSafety") return t("choices.needSafety", reason);
  const label = ts(reason.type === "energy" ? MISSION.messages.insufficientEnergy : MISSION.messages.insufficientOxygen);
  return `${label}. ${t("choices.needAmount", reason)}`;
}

function forecastHtml(option, scene) {
  const parts = [];
  if (option.usesUpReserve.length) parts.push(`<p class="alert">${icon("warning")}${esc(ts(MISSION.messages.reserveWarning))}</p>`);
  if (!scene.transition) return `<div class="forecast"><p class="forecast-head">${icon("star")}${esc(t("forecast.final"))}</p>${parts.join("")}</div>`;
  const tr = option.transition;
  if (!tr) return parts.length ? `<div class="forecast">${parts.join("")}</div>` : "";
  if (tr.panelBonus) parts.push(`<p class="note">${icon("energy")}${esc(ts(MISSION.messages.panelBonus))}</p>`);
  if (tr.lowPower) parts.push(`<p class="alert">${icon("warning")}${esc(ts(MISSION.messages.lowPower))}</p>`);
  if (option.oxygenRunsOut) parts.push(`<p class="alert alert--strong">${icon("warning")}${esc(ts(MISSION.messages.oxygenTransitionWarning))}</p>`);
  return `
  <div class="forecast">
    <p class="forecast-head">${weatherIcon(tr.dusty)}${esc(t(tr.dusty ? "forecast.dusty" : "forecast.clear"))}</p>
    <p class="forecast-line">${esc(ts(MISSION.messages.forecast, { energy: signed(tr.effects.energy), oxygen: signed(tr.effects.oxygen) }))}</p>
    ${parts.join("")}
  </div>`;
}

function cardHtml(option, scene) {
  const selected = app.selected === option.id;
  const letter = option.id.slice(-1);
  return `
  <article class="card-choice ${selected ? "is-selected" : ""} ${option.available ? "" : "is-locked"}">
    <button class="card-hit" data-action="select" data-choice="${option.id}" aria-pressed="${selected}" ${option.available ? "" : 'aria-disabled="true"'}>
      <span class="card-letter">${option.available ? letter : icon("lock")}</span>
      <span class="card-label">${esc(ts(option.label))}</span>
      ${chips(option.effects)}
      ${option.warning ? `<span class="alert alert--strong">${icon("warning")}${esc(ts(option.warning))}</span>` : ""}
      ${option.available ? "" : `<span class="alert">${icon("lock")}${esc(disabledText(option.disabledReason))}</span>`}
    </button>
    ${selected ? `
    <div class="card-more">
      <p class="later"><b>${esc(t("choices.later"))}:</b> ${esc(ts(option.futureConsequence))}</p>
      ${forecastHtml(option, scene)}
      <button class="btn btn--primary" data-action="confirm" data-choice="${option.id}">${esc(t("choices.confirm"))}${icon("arrow")}</button>
    </div>` : ""}
  </article>`;
}

function showChoices({ animateIn = true } = {}) {
  app.screen = "choices";
  stopTyping();
  const scene = getScene(app.game);
  const options = getChoices(app.game);
  worldForScene();
  renderHud(app.game.resources, app.game.science);
  layerEl.innerHTML = `
  <div class="popup popup--choices" role="dialog" aria-labelledby="choices-title">
    <div class="popup-head">
      <div class="popup-avatar">${dutiAvatar(dutiMood())}</div>
      <div class="popup-head-text">
        <p class="eyebrow">${esc(t("intro.sol", { n: scene.sol }))} · ${esc(ts(scene.title))}</p>
        <h2 id="choices-title" data-focus tabindex="-1">${esc(t("choices.title"))}</h2>
      </div>
      <button class="btn btn--small btn--ghost" data-action="reread">${icon("restart")}<span>${esc(t("choices.reread"))}</span></button>
    </div>
    <div class="cards cards--${options.length}">${options.map(option => cardHtml(option, scene)).join("")}</div>
    ${app.selected ? "" : `<p class="hint">${esc(t("choices.pick"))}</p>`}
  </div>`;
  if (animateIn) {
    pop(".popup", { duration: 450 });
    if (!reducedMotion()) animate(layerEl.querySelectorAll(".card-choice"), { opacity: [0, 1], translateY: [50, 0], rotate: () => [Math.random() * 6 - 3, 0], delay: stagger(110, { start: 200 }), duration: 650, ease: "outBack(1.7)" });
  }
  finishRender({ focus: animateIn });
}

async function confirmChoice(choiceId) {
  if (app.busy) return;
  app.busy = true;
  try {
    const before = { resources: { ...app.game.resources }, science: app.game.science };
    const source = layerEl.querySelector(".card-choice.is-selected") ?? layerEl.querySelector(".popup");
    app.game = choose(app.game, choiceId);
    app.selected = null;
    app.screen = "result";
    const pending = app.game.pending;
    if (app.game.phase === "ended") {
      await flyEffects(source, pending.effects, pending.after);
      await wait(500);
      showEnding();
      return;
    }
    worldForScene();
    renderHud(before.resources, before.science);
    layerEl.innerHTML = `
    <div class="popup popup--result" role="dialog" aria-labelledby="result-title">
      <p class="eyebrow">${icon("check")}${esc(t("result.title"))}</p>
      <h2 id="result-title" data-focus tabindex="-1">${esc(ts(pending.label))}</h2>
      <div class="result-chips">${Object.values(pending.effects).some(Boolean) ? chips(pending.effects, { zeroNote: false }) : `<p class="small">${esc(t("result.noChange"))}</p>`}</div>
    </div>`;
    finishRender();
    pop(".popup", { duration: 420 });
    await flyEffects(layerEl.querySelector(".result-chips"), pending.effects, pending.after);
    await wait(650);
    app.line = 0;
    renderFeedbackLine();
  } finally {
    app.busy = false;
  }
}

function renderFeedbackLine() {
  const pending = app.game.pending;
  app.screen = "result";
  worldForScene();
  renderHud(app.game.resources, app.game.science);
  showLine(pending.feedback[app.line], `${app.line + 1} / ${pending.feedback.length}`);
  finishRender({ focus: false });
}

async function showTransition() {
  app.screen = "transition";
  stopTyping();
  const game = app.game;
  const tr = game.lastTransition;
  const scene = getScene(game);
  const nextSol = scene.sol + 1;
  renderHud(tr.before, game.science);
  setWorld(`night:${scene.id}:${game.history.length}`, nightWorld(tr.dusty), { zoom: false });
  layerEl.innerHTML = `
  <div class="cinema" data-action="skip-cinema" role="button" tabindex="0">
    <p class="cinema-title" data-cinema-title data-focus tabindex="-1">${esc(t("transition.night"))}</p>
    <p class="cinema-sub">${esc(t("transition.between", { a: scene.sol, b: nextSol }))}</p>
    <span class="cinema-skip">${esc(t("transition.skip"))}${icon("arrow")}</span>
  </div>`;
  finishRender();
  const token = `${scene.id}:${game.history.length}`;
  app.cinemaToken = token;
  if (!reducedMotion()) {
    const sky = worldEl.querySelector(".world-scene:last-child");
    const dusk = sky?.querySelector(".w-dusk");
    const stars = sky?.querySelector(".w-night-stars");
    const sun = sky?.querySelector(".w-sun--arc");
    const phobos = sky?.querySelector(".w-phobos");
    const deimos = sky?.querySelector(".w-deimos");
    if (sun) animate(sun, { translateX: [1300, 1560], translateY: [260, 760], duration: 1600, ease: "inQuad" });
    if (dusk) animate(dusk, { opacity: [1, 0], duration: 1500, ease: "inOutSine" });
    if (stars) animate(stars, { opacity: [0, 1], delay: 900, duration: 900 });
    if (phobos) animate(phobos, { translateX: [-80, 1700], translateY: [300, 160], delay: 900, duration: 2600, ease: "linear" });
    if (deimos) animate(deimos, { translateX: [1700, 200], translateY: [120, 90], delay: 900, duration: 3200, ease: "linear" });
    animate(layerEl.querySelector(".cinema-title"), { opacity: [0, 1], translateY: [20, 0], duration: 800, ease: "outCubic" });
    animate(layerEl.querySelector(".cinema-sub"), { opacity: [0, 1], delay: 400, duration: 800 });
    await wait(2600);
    if (app.cinemaToken !== token || app.screen !== "transition") return;
    const title = layerEl.querySelector("[data-cinema-title]");
    if (title) {
      title.textContent = t("transition.morning");
      animate(title, { opacity: [0, 1], scale: [0.9, 1], duration: 600, ease: "outBack(2)" });
    }
    if (dusk) animate(dusk, { opacity: [0, 0.65], duration: 1300, ease: "inOutSine" });
    if (sun) animate(sun, { translateX: [60, 260], translateY: [760, 420], duration: 1500, ease: "outQuad" });
    if (stars) animate(stars, { opacity: [1, 0.2], duration: 1300 });
    await wait(1500);
    if (app.cinemaToken !== token || app.screen !== "transition") return;
  }
  showLedger();
}

function showLedger() {
  if (app.screen !== "transition") return;
  app.cinemaToken = null;
  app.screen = "ledger";
  const game = app.game;
  const tr = game.lastTransition;
  const scene = getScene(game);
  const nextSol = scene.sol + 1;
  layerEl.innerHTML = `
  <div class="popup popup--ledger" role="dialog" aria-labelledby="ledger-title">
    <p class="eyebrow">${weatherIcon(tr.dusty)}${esc(t(tr.dusty ? "weather.dusty" : "weather.clear"))} · ${esc(t("transition.between", { a: scene.sol, b: nextSol }))}</p>
    <h2 id="ledger-title" data-focus tabindex="-1">${esc(t("transition.morning"))}</h2>
    <ul class="ledger">
      <li><span class="ledger-icon ledger-icon--energy">${icon("energy")}</span><div><b>${esc(t("transition.battery"))} ${signed(tr.effects.energy)}</b>
        <p>${esc(ts(tr.dusty ? MISSION.messages.dustyStage : MISSION.messages.clearStage))}</p>
        ${tr.panelBonus ? `<p class="note">${icon("check")}${esc(ts(MISSION.messages.panelBonus))}</p>` : ""}</div></li>
      <li><span class="ledger-icon ledger-icon--oxygen">${icon("oxygen")}</span><div><b>${esc(t("transition.crewAir"))} ${signed(tr.effects.oxygen)}</b>
        ${tr.lowPower ? `<p class="alert">${icon("warning")}${esc(ts(MISSION.messages.lowPower))}</p>` : ""}</div></li>
    </ul>
    ${tr.note ? `<p class="fineprint">${icon("info")}${esc(ts(tr.note))}</p>` : ""}
    <div class="lesson"><p class="label">${icon("star")}${esc(t("transition.lesson"))}</p><p>${esc(ts(scene.learningGoal))}</p></div>
    <div class="actions actions--end"><button class="btn btn--primary btn--big" data-action="next-sol">${esc(t("transition.toSol", { n: nextSol }))}${icon("arrow")}</button></div>
  </div>`;
  finishRender();
  pop(".popup", { duration: 450 });
  if (!reducedMotion()) animate(layerEl.querySelectorAll(".ledger li"), { opacity: [0, 1], translateX: [-30, 0], delay: stagger(160, { start: 250 }), duration: 500, ease: "outCubic" });
  if (app.hudShown && JSON.stringify(app.hudShown.resources) !== JSON.stringify(tr.after)) {
    setTimeout(() => flyEffects(layerEl.querySelector(".ledger"), tr.effects, { resources: tr.after, science: game.science }), reducedMotion() ? 0 : 500);
  } else {
    renderHud(tr.after, game.science);
  }
}

function showEnding() {
  app.screen = "ending";
  stopTyping();
  const game = app.game;
  const ending = game.ending;
  const copy = ENDINGS[ending.status];
  const h = ending.highlights;
  const items = [];
  if (h.panelBonusCount) items.push(["good", t("ending.hl.panel", { n: h.panelBonusCount })]);
  if (h.shelterHelped) items.push(["good", t("ending.hl.shelter")]);
  if (h.earthGuideHelped) items.push(["good", t("ending.hl.earth")]);
  if (h.sampleHelped) items.push(["good", t("ending.hl.sample")]);
  if (h.greenhouseStudied) items.push(["good", t("ending.hl.greenhouse")]);
  if (h.lowPowerCount) items.push(["warn", t("ending.hl.lowPower", { n: h.lowPowerCount })]);
  if (h.riskyOutdoorWork) items.push(["warn", t("ending.hl.risky")]);
  if (!items.length) items.push(["info", t("ending.hl.none")]);
  const reasons = [];
  if (ending.status === "failed") {
    reasons.push(ts(ENDINGS.failed.reasons[ending.reasonKey]));
    reasons.push(t("ending.stoppedOn", { n: ending.sol }));
  } else if (!ending.scienceMet) {
    reasons.push(t("ending.scienceShort", { n: ending.scienceTarget - ending.science }));
  }
  const crew = ending.nextCrew;
  const sceneId = ending.status === "success" ? "final-mission" : game.sceneId;
  setWorld(`end:${ending.status}:${game.history.join()}:${getLanguage()}`, sceneWorld(sceneId, game, { photoSrc: PHOTOS.rim.src, labels: signLabels() }));
  renderHud(ending.resources, ending.science);
  layerEl.innerHTML = `
  <div class="popup popup--ending is-${ending.status}" role="dialog" aria-labelledby="end-title">
    <div class="end-hero">
      <div class="end-duti">${duti(dutiMood(), { wave: ending.status === "success" })}</div>
      <div>
        <p class="eyebrow">${esc(ts(getProfile(game).title))}</p>
        <h2 id="end-title" data-focus tabindex="-1">${esc(ts(copy.title))}</h2>
        <p class="lead">${esc(ts(copy.text))}</p>
        ${reasons.map(text => `<p class="alert alert--strong">${icon("info")}${esc(text)}</p>`).join("")}
      </div>
    </div>
    <div class="end-grid">
      <section class="end-box">
        <h3>${esc(t("ending.why"))}</h3>
        <ul class="list">${items.map(([kind, text]) => `<li class="is-${kind}">${icon(kind === "good" ? "check" : kind === "warn" ? "warning" : "info")}<span>${esc(text)}</span></li>`).join("")}</ul>
      </section>
      <section class="end-box">
        <h3>${esc(ts(MISSION.nextCrewReport.title))}</h3>
        <ul class="list">
          <li class="is-${crew.food.status === "ready" ? "good" : "warn"}">${icon(crew.food.status === "ready" ? "check" : "warning")}<span>${esc(ts(crew.food.text))}</span></li>
          <li class="is-${crew.safety.status === "ready" ? "good" : "warn"}">${icon(crew.safety.status === "ready" ? "check" : "warning")}<span>${esc(ts(crew.safety.text))}</span></li>
        </ul>
      </section>
    </div>
    <div class="actions actions--center">
      <button class="btn btn--primary btn--big" data-action="new-game">${icon("restart")}${esc(ts(MISSION.messages.tryAgain))}</button>
      <button class="btn btn--ghost" data-action="mission-log">${icon("star")}${esc(t("ending.log"))}</button>
    </div>
    <p class="fineprint center">${esc(t("ending.newForecast"))}</p>
  </div>`;
  finishRender();
  pop(".popup", { duration: 600 });
  if (!reducedMotion()) {
    animate(layerEl.querySelector(".end-duti"), { translateY: [80, 0], rotate: [-10, 0], duration: 1000, delay: 200, ease: "outElastic(1, .6)" });
    animate(layerEl.querySelectorAll(".end-box"), { opacity: [0, 1], translateY: [30, 0], delay: stagger(140, { start: 450 }), duration: 520, ease: "outCubic" });
    if (ending.status === "success") {
      setTimeout(() => {
        confetti({ particleCount: 160, spread: 95, origin: { y: 0.35 }, colors: ["#ffc93c", "#4fd1ff", "#7be495", "#e2703a", "#c79bff"] });
        setTimeout(() => confetti({ particleCount: 90, angle: 60, spread: 70, origin: { x: 0, y: 0.7 } }), 400);
        setTimeout(() => confetti({ particleCount: 90, angle: 120, spread: 70, origin: { x: 1, y: 0.7 } }), 650);
      }, 400);
    }
  }
}

/* ---------- modals (sources, science card, mission log) ---------- */

function sourceList(ids) {
  return `<ul class="sources">${ids.map(id => {
    const source = NASA_SOURCES[id];
    const archival = source.kind.startsWith("archival");
    return `<li><div><b>${esc(ts(source.title))}</b>
      <span class="meta">${esc(t(`kind.${source.kind}`))}${source.observationPeriod ? ` · ${esc(t("modal.observed"))}: ${esc(ts(source.observationPeriod))}` : ""}${archival ? ` · ${esc(t("modal.archival"))}` : ""}</span></div>
      <a class="pill" href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(t("modal.openSource"))}${icon("arrow")}</a></li>`;
  }).join("")}</ul>`;
}

function openModal(html, variant = "") {
  stopTyping(true);
  modal.className = `modal ${variant}`;
  modal.innerHTML = `<div class="modal-inner">${html}</div>`;
  if (!modal.open) modal.showModal();
  modal.querySelector("[data-focus]")?.focus();
  if (!reducedMotion()) animate(modal, { opacity: [0, 1], scale: [0.9, 1], duration: 420, ease: "outBack(1.6)" });
}

function modalHead(label) {
  return `<header class="modal-head"><p class="eyebrow">${icon("satellite")}${esc(label)}</p>
    <button class="icon-btn" data-action="close-modal" aria-label="${esc(t("modal.close"))}">${icon("close")}</button></header>`;
}

function scienceCardModal() {
  const scene = getScene(app.game);
  const card = scene.scienceCard;
  if (!card) return;
  const photo = CARD_PHOTOS[scene.id] ? PHOTOS[CARD_PHOTOS[scene.id]] : null;
  openModal(`
    ${modalHead(t("science.badge"))}
    <h2 data-focus tabindex="-1">${esc(ts(card.title))}</h2>
    ${photo ? `<figure class="photo"><img src="${photo.src}" alt="${esc(t(photo.creditKey))}"><figcaption><span class="tag">${esc(t("photo.realPhoto"))}</span> ${esc(t(photo.creditKey))}</figcaption></figure>` : ""}
    <p class="lead">${esc(ts(card.text))}</p>
    ${card.dataNote ? `<details class="details"><summary>${esc(t("modal.details"))}</summary><p>${esc(ts(card.dataNote))}</p></details>` : ""}
    ${sourceList(card.sourceIds)}
    <div class="actions actions--center"><button class="btn btn--primary" data-action="close-modal">${esc(t("modal.gotIt"))}</button></div>`, "modal--science");
}

function sourcesModal() {
  openModal(`
    ${modalHead(t("nav.sources"))}
    <h2 data-focus tabindex="-1">${esc(t("modal.sourcesTitle"))}</h2>
    <p>${esc(t("modal.sourcesIntro"))}</p>
    <h3>${esc(t("modal.science"))}</h3>
    ${sourceList(Object.keys(NASA_SOURCES))}
    <h3>${esc(t("modal.photos"))}</h3>
    <ul class="sources">${Object.values(PHOTOS).map(photo => `<li><div><span class="meta">${esc(t(photo.creditKey))}</span></div>
      <a class="pill" href="${photo.link}" target="_blank" rel="noopener noreferrer">${esc(t("modal.openSource"))}${icon("arrow")}</a></li>`).join("")}</ul>
    <h3>${esc(ts(MISSION.creditsCard.title))}</h3>
    <p>${esc(ts(MISSION.creditsCard.text))}</p>
    <p>${esc(t("art.aiNote"))} ${esc(t("art.photoNote"))}</p>
    <p><a href="${esc(MISSION.creditsCard.detailsDocument)}" target="_blank" rel="noopener noreferrer">${esc(t("modal.aiLink"))}</a></p>
    <h3>${esc(t("modal.tools"))}</h3>
    <p>${esc(t("modal.toolsText"))}</p>
    <p class="fineprint">${esc(ts(MISSION.messages.disclaimer))} ${esc(ts(MISSION.profileNote))}</p>
    <div class="actions actions--center"><button class="btn btn--primary" data-action="close-modal">${esc(t("modal.close"))}</button></div>`);
}

function missionLogModal() {
  const game = app.game;
  openModal(`
    ${modalHead(t("ending.log"))}
    <h2 data-focus tabindex="-1">${esc(t("ending.decisions"))}</h2>
    <ol class="decisions">${game.log.map(entry => `<li><span class="sol-chip">${esc(t("ending.sol", { n: entry.sol }))}</span><div><b>${esc(ts(entry.label))}</b>${chips(entry.effects, { zeroNote: false })}</div></li>`).join("")}</ol>
    <h3>${esc(t("ending.lessons"))}</h3>
    <ul class="list">${game.log.map(entry => `<li class="is-info">${icon("star")}<span>${esc(ts(SCENES[entry.sceneId].learningGoal))}</span></li>`).join("")}</ul>
    <p class="fineprint">${esc(ts(MISSION.messages.disclaimer))}</p>
    <div class="actions actions--center"><button class="btn btn--primary" data-action="close-modal">${esc(t("modal.close"))}</button></div>`);
}

/* ---------- render bookkeeping ---------- */

function finishRender({ focus = true } = {}) {
  document.documentElement.lang = getLanguage();
  document.title = ts(MISSION.title);
  document.body.dataset.screen = app.screen;
  $(".ai-badge").textContent = t("art.aiLabel");
  renderTopbar();
  if (focus) layerEl.querySelector("[data-focus]")?.focus({ preventScroll: true });
  save();
}

/** Re-draw the current screen in the new language without losing progress. */
function redraw() {
  app.worldKey = "";
  switch (app.screen) {
    case "title": return showTitle();
    case "briefing": return showBriefing();
    case "intro": return startStory();
    case "story": return renderStoryLine();
    case "choices": return showChoices({ animateIn: false });
    case "result": return app.game.phase === "feedback" ? renderFeedbackLine() : showEnding();
    case "transition": case "ledger": app.screen = "transition"; return showLedger();
    case "ending": return showEnding();
    default: return showTitle();
  }
}

/** Open the right screen for the engine phase. */
function screenForPhase() {
  const phase = app.game.phase;
  if (phase === "ended") return showEnding();
  if (phase === "transition") return showTransition();
  if (phase === "feedback") { app.line = 0; return renderFeedbackLine(); }
  return showIntro();
}

/* ---------- actions ---------- */

function advance() {
  if (stopTyping(true)) return; // the first tap finishes the sentence
  if (app.screen === "story") {
    const scene = getScene(app.game);
    if (app.line < scene.story.length - 1) {
      app.line += 1;
      renderStoryLine();
    } else {
      afterStory();
    }
    return;
  }
  if (app.screen === "result" && app.game.phase === "feedback") {
    if (app.line < app.game.pending.feedback.length - 1) {
      app.line += 1;
      renderFeedbackLine();
      return;
    }
    app.game = finishFeedback(app.game);
    screenForPhase();
  }
}

function startNewGame() {
  if (modal.open) modal.close();
  const profileId = pickProfileId(Math.random, app.lastProfileId);
  app.lastProfileId = profileId;
  app.game = createGame(profileId);
  app.seenCards = [];
  app.selected = null;
  showBriefing();
}

const actions = {
  home: showTitle,
  language() {
    setLanguage(getLanguage() === "en" ? "tr" : "en");
    if (modal.open) modal.close();
    stopTyping();
    redraw();
  },
  sources: sourcesModal,
  "science-card": scienceCardModal,
  "mission-log": missionLogModal,
  "close-modal": () => modal.close(),
  "new-game": startNewGame,
  resume() {
    if (!canResume()) return;
    const screen = app.resumeScreen;
    if (screen === "briefing") return showBriefing();
    if (app.game.phase === "scene") return screen === "choices" ? showChoices() : showIntro();
    return screenForPhase();
  },
  begin: showIntro,
  "intro-done"() { if (app.screen === "intro") startStory(); },
  advance,
  reread() {
    app.selected = null;
    app.line = 0;
    renderStoryLine();
  },
  select(target) {
    const id = target.dataset.choice;
    const option = getChoices(app.game).find(item => item.id === id);
    if (!option?.available) return;
    app.selected = app.selected === id ? null : id;
    showChoices({ animateIn: false });
    const more = layerEl.querySelector(".card-more");
    if (more) {
      if (!reducedMotion()) animate(more, { opacity: [0, 1], translateY: [-10, 0], duration: 320, ease: "outCubic" });
      more.querySelector(".btn")?.focus({ preventScroll: true });
      more.scrollIntoView({ block: "nearest", behavior: reducedMotion() ? "auto" : "smooth" });
    }
  },
  confirm(target) { confirmChoice(target.dataset.choice); },
  "skip-cinema"() { if (app.screen === "transition") showLedger(); },
  "next-sol"() {
    app.game = finishTransition(app.game);
    screenForPhase();
  },
};

document.addEventListener("click", event => {
  const target = event.target.closest("[data-action]");
  if (!target || target.getAttribute("aria-disabled") === "true") return;
  actions[target.dataset.action]?.(target);
});

document.addEventListener("keydown", event => {
  if (modal.open || (event.key !== " " && event.key !== "Enter")) return;
  const focused = document.activeElement;
  if (focused && (focused.tagName === "BUTTON" || focused.tagName === "A")) return;
  if (app.screen === "story" || (app.screen === "result" && app.game?.phase === "feedback")) {
    event.preventDefault();
    advance();
  } else if (app.screen === "intro") {
    event.preventDefault();
    startStory();
  } else if (app.screen === "transition") {
    event.preventDefault();
    showLedger();
  }
});

modal.addEventListener("click", event => {
  if (event.target === modal) modal.close();
});

/* ---------- start ---------- */

const saved = load();
setLanguage(saved?.language ?? "en"); // English first; Turkish is opt-in
app.lastProfileId = saved?.lastProfileId ?? null;
app.seenCards = saved?.seenCards ?? [];
if (saved?.game?.phase && saved.screen) {
  app.game = saved.game;
  app.resumeScreen = saved.screen;
}
showTitle();
