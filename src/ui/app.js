/**
 * Browser interface for Compass Outpost: a full-screen, no-scroll game.
 * Each sol happens in its own location; story, choices and results appear as pop-ups.
 * Game rules live in src/game/engine.js; this file only displays and collects choices.
 * AI-assisted generation: Anthropic Claude. See AI_USAGE.md and ai-usage.json.
 * AI-assisted 1.12.0 revisions: OpenAI Codex (task camera, ending persistence/review and focused-control keyboard activation).
 * AI-assisted 1.11.1 revisions: OpenAI Codex (activity layout and in-progress language refresh).
 */
import { MISSION, SCENES, SCENE_ORDER, ENDINGS, SPECIAL_ENDINGS, NASA_SOURCES } from "../game/scenes.js";
import {
  createGame, pickProfileId, getProfile, getScene, getChoices, getForecast,
  choose, finishFeedback, finishTransition, isDustyAfter, computeTransition, specialEndingFor,
} from "../game/engine.js";
import { t, ts, signed, getLanguage, setLanguage } from "../i18n/index.js";
import { icon, duti, dutiAvatar, weatherIcon } from "./art.js";
import { titleWorld, sceneWorld, nightWorld, LOCATIONS } from "./world.js";
import { SPOTLIGHTS, spotlightSvg, activityFor, runActivity, pulseHint, refreshActivityLanguage } from "./activities.js";
import { memoriesFor } from "./memories.js";
import { storyBeats, feedbackBeats, VISITORS_ID } from "./beats.js";
import { visitorsArt } from "./world.js";
import { FACTS, FACT_BY_CHOICE, pickFact } from "../game/facts.js";
import { DISCOVERIES, DISCOVERY_SOURCES, secretSprite } from "./discoveries.js";
import { animate, stagger } from "../../assets/vendor/animejs/anime.esm.min.js";
import { play, unlockSound, soundEnabled, setSoundEnabled, setAmbience } from "./sound.js";
import confetti from "../../assets/vendor/canvas-confetti/confetti.module.mjs";

const SAVE_KEY = "compass-outpost-save-v3"; // v3 = ten-sol edition; older six-sol saves are not reused
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
  spot: 0,
  facts: [], // collected fact-card ids
  pendingFact: null,
  activityId: null,
  busy: false,
  predict: null, // { sol, resource, guess, actual }
  score: { right: 0, total: 0 },
};

/* The player's profile (name and Mars Journal) stays on this device across missions. */
const PROFILE_KEY = "compass-outpost-profile-v1";
const profile = (() => {
  try {
    const stored = JSON.parse(localStorage.getItem(PROFILE_KEY) ?? "null");
    return {
      name: String(stored?.name ?? "").slice(0, 16),
      discoveries: Array.isArray(stored?.discoveries) ? stored.discoveries : [],
      facts: Array.isArray(stored?.facts) ? stored.facts.filter(id => id in FACTS) : [],
      endings: Array.isArray(stored?.endings) ? stored.endings.filter(id => SPECIAL_ENDINGS.some(e => e.id === id)) : [],
      seen: Array.isArray(stored?.seen) ? stored.seen.filter(item => typeof item === "string").slice(-200) : [],
    };
  } catch {
    return { name: "", discoveries: [], facts: [], endings: [], seen: [] };
  }
})();
function saveProfile() {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch { /* optional */ }
}
const playerName = () => profile.name.trim();
const hasSeen = key => profile.seen.includes(key);
function markSeen(key) {
  if (hasSeen(key)) return;
  profile.seen.push(key);
  saveProfile();
}

const $ = selector => document.querySelector(selector);
const worldEl = $("#world");
const topbarEl = $("#topbar");
const hudEl = $("#hud");
const layerEl = $("#layer");
const fxEl = $("#fx");
const modal = $("#modal");

let typing = null; // active typewriter

/* ---------- saving ---------- */

/** Discoveries found in the current game (ticks on the explore screen start empty in a new game). */
const foundNow = id => (app.found ?? []).includes(id);

function save() {
  try {
    if (app.screen !== "title") app.resumeScreen = app.screen;
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      language: getLanguage(), game: app.game, screen: app.resumeScreen,
      lastProfileId: app.lastProfileId, seenCards: app.seenCards, facts: app.facts,
      predict: app.predict, score: app.score, pendingFact: app.pendingFact, found: app.found ?? [],
    }));
  } catch { /* storage can be unavailable; the game still works */ }
}

function load() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY) ?? "null"); } catch { return null; }
}

const canResume = () => {
  const game = app.game;
  if (!game || !app.resumeScreen || !SCENES[game.sceneId]) return false;
  if (game.status === "playing") return game.phase !== "ended";
  return game.phase === "ended" && Boolean(ENDINGS[game.status]) && game.ending?.status === game.status
    && (!game.ending.special || (game.status === "success" && specialEndingFor(game.history)?.id === game.ending.special));
};

/** Discoveries belong to the completed run, even if its ending pages are interrupted. */
function rememberSpecialEnding() {
  const game = app.game;
  if (game?.status !== "success" || !game.ending?.special
    || specialEndingFor(game.history)?.id !== game.ending.special) return;
  const ending = game.ending;
  if (ending.newlyFound === undefined) ending.newlyFound = !profile.endings.includes(ending.special);
  if (!profile.endings.includes(ending.special)) {
    profile.endings.push(ending.special);
    saveProfile();
  }
}

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
  focusX = 800;
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
  old.forEach(node => {
    setTimeout(() => node.remove(), 900); // fallback when animations are paused
    animate(node, { opacity: [1, 0], duration: 700, ease: "linear", onComplete: () => node.remove() });
  });
}

/**
 * On tall phone screens only the middle of a location fits. Pan the "camera" so the
 * part that matters (a spotlight or the activity targets) is on screen.
 */
let focusX = 800;
function setFocus(x = 800) {
  focusX = x;
  if (app.screen === "activity" && app.activityDef) return layoutActivity();
  const box = worldEl.getBoundingClientRect();
  const visible = box.height > 0 ? Math.min(1600, (box.width / box.height) * 900) : 1600;
  const center = Math.max(visible / 2, Math.min(1600 - visible / 2, x));
  const viewBox = `${(center - 800).toFixed(0)} 0 1600 900`;
  const svgs = [worldEl.querySelector(".world-scene:last-child > svg"), ...fxEl.querySelectorAll("svg")];
  svgs.forEach(svg => svg?.setAttribute("viewBox", viewBox));
  if (app.screen === "explore" && app.game) {
    const waiting = (DISCOVERIES[app.game.sceneId] ?? []).filter(d => !d.secret && !foundNow(d.id));
    const left = waiting.some(d => d.x < center - visible / 2 + 40);
    const right = waiting.some(d => d.x > center + visible / 2 - 40);
    layerEl.querySelector(".pan--left")?.classList.toggle("has-more", left);
    layerEl.querySelector(".pan--right")?.classList.toggle("has-more", right);
  }
}
window.addEventListener("resize", () => setFocus(focusX));

const signLabels = () => ({ heater: t("sign.heater"), lab: t("sign.lab"), route: t("sign.route"), plants: t("sign.plants"), mars: t("sign.mars"), earth: t("sign.earth"), delay: t("sign.delay"), sample: t("sign.sample"), tomorrow: t("sign.tomorrow") });

/** Keep the whole job between the real HUD and instructions, including after a resize or translation. */
function layoutActivity() {
  if (app.screen !== "activity" || !app.activityDef) return;
  const banner = layerEl.querySelector(".task");
  if (!banner) return;
  const frame = document.getElementById("app");
  frame.style.setProperty("--activity-top", `${Math.ceil(hudEl.getBoundingClientRect().bottom) + 8}px`);
  const box = banner.getBoundingClientRect();
  const side = matchMedia("(max-height: 500px) and (orientation: landscape)").matches;
  frame.style.setProperty("--activity-bottom", `${side ? 8 : Math.ceil(innerHeight - box.top) + 12}px`);
  frame.style.setProperty("--activity-right", `${side ? Math.ceil(innerWidth - box.left) + 12 : 8}px`);
  const def = app.activityDef;
  let viewBox;
  if (def.custom) {
    viewBox = app.activityId === "2B" ? "450 620 700 200" : "450 280 700 520";
  } else {
    const xs = def.targets.map(p => p.x).concat(def.focusExtra ?? []);
    const ys = def.targets.map(p => p.y);
    const left = Math.max(0, Math.min(...xs) - 180);
    const right = Math.min(1600, Math.max(...xs) + 180);
    const top = Math.max(0, Math.min(...ys) - 180);
    const bottom = app.activityId === "6C" ? 900 : Math.min(900, Math.max(...ys) + 180);
    viewBox = `${left} ${top} ${right - left} ${bottom - top}`;
  }
  // Expand scenery to fill the area where possible. If that expansion would exceed the drawing,
  // keep the active bounds and contain them: covering/cropping can hide required touch targets.
  const activeViewBox = viewBox;
  const area = worldEl.getBoundingClientRect();
  let [x, y, w, h] = viewBox.split(" ").map(Number);
  const aspect = area.width > 0 && area.height > 0 ? area.width / area.height : 16 / 9;
  if (w / h < aspect) { const nw = h * aspect; x -= (nw - w) / 2; w = nw; } else { const nh = w / aspect; y -= (nh - h) / 2; h = nh; }
  if (w > 1600 || h > 900) viewBox = activeViewBox;
  else {
    x = Math.max(0, Math.min(1600 - w, x));
    y = Math.max(0, Math.min(900 - h, y));
    viewBox = `${x.toFixed(0)} ${y.toFixed(0)} ${w.toFixed(0)} ${h.toFixed(0)}`;
  }
  for (const svg of [worldEl.querySelector(".world-scene:last-child > svg"), fxEl.querySelector(".fx--activity")]) {
    svg?.setAttribute("viewBox", viewBox);
    svg?.setAttribute("preserveAspectRatio", "xMidYMid meet");
  }
  refreshActivityLanguage(fxEl, t, (n, total) => t("act.target", { n, total }));
}
const scheduleActivityLayout = () => requestAnimationFrame(layoutActivity);
document.fonts.ready.then(scheduleActivityLayout);

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

const soundIcon = on => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4Z" fill="currentColor"/>${on
  ? '<path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  : '<path d="M16 9.5l5 5M21 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>'}</svg>`;

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
      ${app.screen !== "title" || profile.discoveries.length || profile.facts.length ? `<button class="pill pill--icon pill--journal" data-action="journal" aria-label="${esc(t("journal.openFull", { n: profile.discoveries.length + profile.facts.length }))}" title="${esc(t("journal.open"))}">${icon("book")}<span class="pill-badge" aria-hidden="true">${profile.discoveries.length + profile.facts.length}</span></button>` : ""}
      <button class="pill pill--icon pill--sound ${soundEnabled() ? "" : "is-off"}" data-action="sound" aria-pressed="${soundEnabled()}" aria-label="${esc(t(soundEnabled() ? "sound.on" : "sound.off"))}" title="${esc(t(soundEnabled() ? "sound.on" : "sound.off"))}">${soundIcon(soundEnabled())}</button>
      <button class="pill pill--icon" data-action="sources" aria-label="${esc(t("nav.sources"))}" title="${esc(t("nav.sources"))}">${icon("info")}</button>
      <button class="pill pill--lang" data-action="language" aria-label="${esc(t("lang.label"))}">${icon("globe")}<span class="lang-long">${esc(t("lang.switchTo"))}</span><span class="lang-short">${getLanguage() === "en" ? "TR" : "EN"}</span></button>
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
      <span class="gauge-level">${level === "good" ? "" : icon("warning")}<span class="gl-text">${esc(t(`level.${level}`))}</span></span>
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
    syncHudHeight();
    return;
  }
  hudEl.hidden = false;
  hudEl.innerHTML = RESOURCE_KEYS.map(key => gaugeHtml(key, resources[key])).join("") + scienceHtml(science)
    + `<span class="ai-label">${icon("info")}${esc(t("art.aiLabel"))}</span>`;
  app.hudShown = { resources: { ...resources }, science };
  syncHudHeight();
}

/** Pop-ups, tasks and top dialogs sit below the HUD, whatever its real height. */
function syncHudHeight() {
  const height = hudEl.hidden ? 0 : Math.ceil(hudEl.getBoundingClientRect().height);
  document.documentElement.style.setProperty("--hud-h", `${height}px`);
}
window.addEventListener("resize", syncHudHeight);

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
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      node.remove();
      resolve();
    };
    // Fallback: animations pause in hidden tabs, so never wait on them forever.
    setTimeout(finish, 250 + index * 140 + 900 + 400);
    animate(node, {
      translateX: [0, dx], translateY: [0, dy], scale: [1.25, 0.6], opacity: [1, 1, 0],
      delay: 250 + index * 140, duration: 900, ease: "inOutCubic",
      onComplete: finish,
    });
  })));
  renderHud(after.resources, after.science);
  play(keys.some(key => effects[key] < 0) && !keys.some(key => effects[key] > 0) ? "loss" : "gain");
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
  <div class="dialog ${isDuti ? "dialog--duti" : "dialog--narrator"}" data-action="advance" role="group" aria-label="${esc(t("dialog.next"))}" tabindex="0">
    ${isDuti ? `<div class="dialog-portrait">${duti(dutiMood())}</div>` : ""}
    <div class="dialog-box">
      <div class="dialog-name">${isDuti ? esc(MISSION.robot.displayName) : esc(t("dialog.story"))}${caption}</div>
      <p class="dialog-text" data-text aria-hidden="true"></p><p class="sr-only" data-text-full aria-live="polite"></p>
      <div class="dialog-foot"><span class="dialog-counter">${counter}</span><span class="dialog-next">${esc(t("dialog.next"))}${icon("arrow")}</span></div>
    </div>
  </div>`;
}

function showLine(block, counter, translated = null) {
  layerEl.innerHTML = dialogHtml(block, counter);
  const dialog = layerEl.querySelector(".dialog");
  if (!reducedMotion()) {
    animate(dialog.querySelector(".dialog-box"), { opacity: [0, 1], translateY: [40, 0], duration: 420, ease: "outCubic" });
    const portrait = dialog.querySelector(".dialog-portrait");
    if (portrait) animate(portrait, { opacity: [0, 1], translateX: [-60, 0], rotate: [-8, 0], duration: 600, ease: "outBack(1.4)" });
  }
  const full = translated ?? ts(block.text);
  dialog.querySelector("[data-text-full]").textContent = full;
  typeInto(dialog.querySelector("[data-text]"), full);
  if (block.speakerId === "duti") play("duti");
  dialog.focus({ preventScroll: true });
}

/* ---------- screens ---------- */

function showTitle() {
  app.screen = "title";
  fxEl.innerHTML = "";
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
        <li>${icon("satellite")}${esc(t("title.badgeData"))}</li>
      </ul>
      <div class="actions">
        ${canResume()
          ? `<button class="btn btn--primary btn--big" data-action="resume">${esc(t(app.game.phase === "ended" ? "title.review" : "title.resume"))}${icon("arrow")}</button>
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
  const mission = getProfile(game); // the mission profile; `profile` is the player's saved profile
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
        <h3>${esc(ts(mission.title))}</h3>
        <p class="small">${esc(ts(mission.briefing))}</p>
      </div>
      <div class="brief-box">
        <p class="label">${esc(t("briefing.forecast"))}</p>
        <p class="forecast-note">${esc(t("briefing.forecastNote"))}</p>
        <ol class="forecast-strip">${getForecast(mission).map(day => `
          <li class="${day.dusty ? "is-dusty" : ""}">
            ${weatherIcon(day.dusty)}<b>${esc(t(day.dusty ? "weather.dusty" : "weather.clear"))}</b><span>${esc(t("briefing.afterSol", { n: day.sol }))}</span>
          </li>`).join("")}</ol>
      </div>
    </div>
    <p class="goal">${icon("science")}${esc(t("briefing.goal", { n: MISSION.scienceTarget }))}</p>
    <p class="fineprint">${esc(ts(MISSION.profileNote))}</p>
    <div class="brief-start">
      <label class="name-field"><span>${esc(t("name.label"))}</span>
        <input id="player-name" type="text" maxlength="16" autocomplete="off" spellcheck="false" value="${esc(profile.name)}" placeholder="${esc(t("name.placeholder"))}">
      </label>
      <button class="btn btn--primary btn--big" data-action="begin">${esc(t("briefing.begin"))}${icon("arrow")}</button>
    </div>
  </div>`;
  pop(".popup");
  if (!reducedMotion()) animate(layerEl.querySelectorAll(".forecast-strip li"), { opacity: [0, 1], translateY: [20, 0], delay: stagger(90, { start: 450 }), duration: 450, ease: "outBack(2)" });
  finishRender();
}

async function showIntro() {
  app.screen = "intro";
  fxEl.innerHTML = "";
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
      ${playerName() ? `<p class="intro-name">${esc(t("name.commander", { name: playerName() }))}</p>` : ""}
    </div>
    <p class="intro-tap">${esc(t("intro.tap"))}</p>
  </div>`;
  finishRender();
  if (!reducedMotion()) {
    animate(layerEl.querySelector(".intro-sol"), { opacity: [0, 1], letterSpacing: ["0.6em", "0.18em"], duration: 900, ease: "outCubic" });
    animate(layerEl.querySelector(".intro-title"), { opacity: [0, 1], translateY: [40, 0], scale: [0.9, 1], delay: 200, duration: 800, ease: "outBack(1.5)" });
    animate(layerEl.querySelector(".intro-loc"), { opacity: [0, 1], delay: 600, duration: 600 });
  }
  if (scene.id === "solar-radiation-alert") play("alarm");
  const token = `${app.game.history.length}:${scene.id}`;
  app.introToken = token;
  await wait(2600);
  if (app.screen === "intro" && app.introToken === token) startStory();
}

/** The scene's story, followed by up to two lines in which DUTİ remembers earlier choices. */
function storyLines() {
  const scene = getScene(app.game);
  const found = foundNow;
  const memories = memoriesFor(scene.id, app.game, found).map(item => ({ speakerId: "duti", memory: item.id }));
  return [...scene.story, ...storyBeats(scene.id), ...memories];
}

function startStory() {
  app.screen = "story";
  app.line = 0;
  app.storyLines = storyLines();
  renderStoryLine();
}

function renderStoryLine() {
  const scene = getScene(app.game);
  app.screen = "story";
  if (!app.storyLines?.length) app.storyLines = storyLines();
  const lines = app.storyLines;
  const block = lines[Math.min(app.line, lines.length - 1)];
  fxEl.innerHTML = "";
  worldForScene();
  renderHud(app.game.resources, app.game.science);
  const replay = hasSeen(`story:${scene.id}`);
  if (block.memory) {
    const fresh = !hasSeen(`mem:${block.memory}`);
    showLine({ speakerId: "duti", text: "" }, fresh ? t("mem.new") : t("mem.label"), t(`mem.${block.memory}`));
    layerEl.querySelector(".dialog")?.classList.add("dialog--memory");
    markSeen(`mem:${block.memory}`);
  } else if (block.beat) {
    showLine(block, `${app.line + 1} / ${lines.length}`, t(block.beat));
  } else {
    showLine(block, `${app.line + 1} / ${scene.story.length}`);
    if (replay) {
      stopTyping(true); // known lines appear at once on a replay
      const foot = layerEl.querySelector(".dialog-foot");
      foot?.insertAdjacentHTML("afterbegin", `<button class="btn btn--small btn--ghost dialog-skip" data-action="skip-story">${esc(t("dialog.skip"))}</button>`);
    }
  }
  finishRender({ focus: false });
}

function afterStory() {
  markSeen(`story:${app.game.sceneId}`);
  // Plain spotlights teach the place once. The hands-on "try the device" spotlights return in
  // every mission, so a new game on the same device still gets the heater and grow-light moments.
  const all = SPOTLIGHTS[app.game.sceneId] ?? [];
  app.spotList = hasSeen(`spot:${app.game.sceneId}`) ? all.filter(spot => spot.observe) : all;
  if (app.spotList.length) {
    app.spot = 0;
    app.observed = null;
    showSpotlight();
    return;
  }
  showExplore({ animateIn: true });
}

/** DUTİ points at the parts of the location that matter before the player decides. */
function showSpotlight() {
  app.screen = "spot";
  const spots = app.spotList?.length ? app.spotList : SPOTLIGHTS[app.game.sceneId];
  const spot = spots[Math.min(app.spot, spots.length - 1)];
  worldForScene();
  renderHud(app.game.resources, app.game.science);
  fxEl.innerHTML = spotlightSvg(spot);
  setFocus(spot.x);
  if (!reducedMotion()) {
    animate(fxEl.querySelector(".spot-dim"), { opacity: [0, 0.62], duration: 500 });
    animate(fxEl.querySelector(".spot-ring"), { scale: [1.4, 1], opacity: [0, 1], duration: 600, ease: "outBack(1.6)" });
  }
  const observe = spot.observe && app.observed !== app.spot && !app.observeRunning;
  app.observing = Boolean(observe);
  if (observe) {
    // The child tries the device first and watches the gauge; DUTİ explains afterwards.
  }
  showLine({ speakerId: "duti", text: "" }, `${app.spot + 1} / ${spots.length}`, t(observe ? spot.observe.key : spot.key, { ...app.game.resources }));
  // While the child is asked to try the device, the dialog goes to the top so it never covers the button.
  if (spot.y > 520 || observe) layerEl.querySelector(".dialog")?.classList.add("dialog--top");
  if (observe) {
    layerEl.querySelector(".dialog-next")?.classList.add("is-waiting");
    placeObserveButton(spot);
  }
  finishRender({ focus: false });
}

/**
 * A real, focusable HTML button over the device in the drawing. It lives in the top layer, so no
 * dialog or SVG transform can hide or move it, and screen readers can reach it.
 */
function placeObserveButton(spot) {
  layerEl.querySelector(".observe-btn")?.remove();
  const svg = fxEl.querySelector("svg");
  const matrix = svg?.getScreenCTM();
  if (!svg || !matrix) return;
  const point = svg.createSVGPoint();
  point.x = spot.observe.x;
  point.y = spot.observe.y;
  const at = point.matrixTransform(matrix);
  const button = document.createElement("button");
  button.className = "observe-btn";
  button.type = "button";
  button.dataset.action = "observe";
  button.innerHTML = `<span class="observe-icon" aria-hidden="true">${icon("energy")}</span><span>${esc(t(spot.observe.label))}</span>`;
  layerEl.append(button);
  const box = button.getBoundingClientRect();
  const left = Math.max(8, Math.min(innerWidth - box.width - 8, at.x - box.width / 2));
  // Never under the dialog: keep the device's position if free, otherwise go just above or below the dialog.
  // Measure the dialog's resting place (the container is not animated; the box slides in).
  const dialog = layerEl.querySelector(".dialog")?.getBoundingClientRect();
  const hudBottom = Math.ceil(hudEl.getBoundingClientRect().bottom) + 8;
  const clamp = y => Math.max(hudBottom, Math.min(innerHeight - box.height - 8, y));
  let top = clamp(at.y - box.height / 2);
  if (dialog && top < dialog.bottom + 8 && top + box.height > dialog.top - 8) {
    const above = dialog.top - box.height - 10;
    const below = dialog.bottom + 10;
    top = above >= hudBottom ? above : below + box.height <= innerHeight - 8 ? below : clamp(above);
  }
  button.style.left = `${Math.round(left)}px`;
  button.style.top = `${Math.round(top)}px`;
  button.focus({ preventScroll: true });
}

/** The device runs for a moment: the gauge visibly dips, then DUTİ explains what we saw. */
async function observeDevice(spot) {
  if (!app.observing || app.observeRunning) return;
  app.observing = false;
  app.observeRunning = true;
  layerEl.querySelector(".observe-btn")?.remove();
  const key = spot.observe.gauge;
  const gauge = hudEl.querySelector(`[data-gauge="${key}"]`);
  const num = gauge?.querySelector(".gauge-num");
  const value = app.game.resources[key];
  play("loss");
  if (gauge && num) {
    gauge.classList.add("is-observed");
    num.textContent = String(Math.max(0, value - 1));
    bumpGauge(key, -1);
  }
  await wait(1500);
  if (num) num.textContent = String(value);
  gauge?.classList.remove("is-observed");
  app.observed = app.spot;
  app.observeRunning = false;
  if (app.screen === "spot") showSpotlight();
}
window.addEventListener("resize", () => {
  const spot = (app.spotList?.length ? app.spotList : SPOTLIGHTS[app.game?.sceneId])?.[app.spot];
  if (app.screen === "spot" && app.observing && spot?.observe) placeObserveButton(spot);
});

/* ---------- free exploration ---------- */

function exploreSvg(sceneId) {
  const list = DISCOVERIES[sceneId] ?? [];
  return `
  <svg class="fx fx--explore" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="false">
    ${list.filter(d => d.secret).map(d => `<g class="secret-art ${foundNow(d.id) ? "is-found" : ""}">${secretSprite(d.id)}</g>`).join("")}
    ${list.map((d, i) => {
      const found = foundNow(d.id);
      return `
      <g class="hotspot ${found ? "is-found" : ""} ${d.secret ? "is-secret" : ""}" data-disc="${d.id}" transform="translate(${d.x} ${d.y})" tabindex="0" role="button" aria-label="${esc(t("explore.spotN", { n: i + 1, total: list.length }))}">
        <circle class="hot-hit" r="${Math.max(d.r, 60)}" fill="transparent"/>
        ${!d.secret && !found ? `<circle class="hot-ring" r="${d.r}" style="animation-delay:${(i * 0.45).toFixed(2)}s"/>
        <g class="hot-tag" transform="translate(${Math.round(d.r * 0.72)} ${-Math.round(d.r * 0.72)})"><g class="hot-spark" style="animation-delay:${(i * 0.45).toFixed(2)}s"><circle r="17" fill="#ffd65c" stroke="#0b1026" stroke-width="3"/><path d="M0-10l3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" fill="#0b1026"/></g></g>` : ""}
        ${d.secret && !found ? `<g class="hot-glint" style="animation-delay:${(3 + i).toFixed(1)}s"><path d="M0-14l3 10 10 4-10 4-3 10-3-10-10-4 10-4Z" fill="#fff6c9"/></g>` : ""}
        ${found ? `<g class="hot-badge" transform="translate(${Math.round(d.r * 0.55)} ${-Math.round(d.r * 0.55)})"><circle r="15" fill="${d.secret ? "#ffd65c" : "#7be495"}" stroke="#0b1026" stroke-width="3"/><path d="${d.secret ? "M0-8l2.5 5 5.5.8-4 3.9 1 5.5L0 4.6l-5 2.6 1-5.5-4-3.9 5.5-.8Z" : "M-6 0l4 4 8-8"}" fill="${d.secret ? "#0b1026" : "none"}" stroke="#0b1026" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>` : ""}
      </g>`;
    }).join("")}
  </svg>`;
}

function exploreBar(sceneId) {
  const list = DISCOVERIES[sceneId] ?? [];
  const normal = list.filter(d => !d.secret);
  const found = normal.filter(d => foundNow(d.id)).length;
  const secrets = list.filter(d => d.secret);
  const secretFound = secrets.filter(d => foundNow(d.id)).length;
  const name = playerName();
  const hint = found < normal.length ? t("explore.hint")
    : secretFound < secrets.length ? t("explore.hintSecret") : t("explore.hintAll");
  return `
  <div class="explore-bar" role="region" aria-label="${esc(hint)}">
    <div class="explore-avatar">${dutiAvatar("happy")}</div>
    <div class="explore-text">
      <p class="explore-title">${esc(name ? t("explore.title", { name }) : t("explore.titleNoName"))}</p>
      <p class="explore-hint">${esc(hint)}</p>
      <p class="explore-count"><span class="explore-dots">${normal.map(d => `<i class="${foundNow(d.id) ? "on" : ""}"></i>`).join("")}${secrets.map(d => `<i class="is-secret ${foundNow(d.id) ? "on" : ""}">${icon("star")}</i>`).join("")}</span>${esc(t("explore.countSplit", { n: found, total: normal.length }))}</p>
    </div>
    <button class="btn btn--primary" data-action="ready">${esc(t("explore.ready"))}${icon("arrow")}</button>
  </div>
  <button class="pan pan--left" data-action="pan-left" aria-label="${esc(t("explore.left"))}">${icon("arrow")}</button>
  <button class="pan pan--right" data-action="pan-right" aria-label="${esc(t("explore.right"))}">${icon("arrow")}</button>`;
}

function showExplore({ animateIn = false } = {}) {
  const sceneId = app.game.sceneId;
  if (!DISCOVERIES[sceneId]?.length) return openChoicesAfterStory();
  app.screen = "explore";
  stopTyping();
  worldForScene();
  renderHud(app.game.resources, app.game.science);
  const keepFocus = focusX;
  fxEl.innerHTML = exploreSvg(sceneId);
  setFocus(keepFocus);
  layerEl.innerHTML = exploreBar(sceneId);
  setFocus(keepFocus);
  fxEl.querySelectorAll(".hotspot").forEach(spot => {
    const open = event => { event.stopPropagation(); discover(spot.dataset.disc, spot); };
    spot.addEventListener("click", open);
    spot.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(event); } });
  });
  finishRender({ focus: false });
  if (animateIn && !reducedMotion()) {
    animate(layerEl.querySelector(".explore-bar"), { translateY: [-40, 0], opacity: [0, 1], duration: 600, ease: "outBack(1.6)" });
    animate(fxEl.querySelectorAll(".hot-spark"), { scale: [0, 1.4, 1], delay: stagger(140), duration: 700, ease: "outBack(2)" });
  }
}

function discover(id, element, { replay = false } = {}) {
  app.exploreLineId = id;
  const sceneId = app.game.sceneId;
  const item = DISCOVERIES[sceneId].find(d => d.id === id);
  if (!item) return;
  const isNew = replay ? Boolean(app.exploreLineNew) : !foundNow(id);
  app.exploreLineNew = isNew;
  if (isNew && !replay) {
    app.found = [...(app.found ?? []), id];
    save();
  }
  if (!profile.discoveries.includes(id)) {
    profile.discoveries.push(id);
    saveProfile();
  }
  if (!reducedMotion() && element) {
    const svg = fxEl.querySelector("svg");
    const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    ring.setAttribute("cx", item.x); ring.setAttribute("cy", item.y); ring.setAttribute("r", item.r);
    ring.setAttribute("fill", "none"); ring.setAttribute("stroke", item.secret ? "#ffd65c" : "#7ef0ff"); ring.setAttribute("stroke-width", "8");
    svg?.append(ring);
    animate(ring, { scale: [0.3, 1.5], opacity: [1, 0], duration: 700, ease: "outCubic", onComplete: () => ring.remove() });
    setTimeout(() => ring.remove(), 900);
  }
  if (item.secret && isNew && !reducedMotion()) {
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.3 }, colors: ["#ffd65c", "#fff3c4", "#c79bff"] });
  }
  const trail = item.thread ? SCENE_ORDER.flatMap(sid => (DISCOVERIES[sid] ?? []).filter(d => d.thread === item.thread)) : [];
  const seenBefore = item.thread && trail.slice(0, trail.findIndex(d => d.id === id)).some(d => foundNow(d.id));
  if (!replay) play(isNew && (item.secret || item.kind === "clue") ? "secret" : "discover");
  app.screen = "explore-line";
  const label = isNew ? (item.secret ? t("explore.secret") : item.kind === "clue" ? t("explore.clue") : t("explore.new")) : t("explore.again");
  showLine({ speakerId: "duti", text: "" }, label, `${seenBefore ? `${t("clue.seenBefore")} ` : ""}${t(`disc.${id}`)}`);
  if (item.kind === "clue") layerEl.querySelector(".dialog")?.classList.add("dialog--clue");
  const dialog = layerEl.querySelector(".dialog");
  dialog?.classList.add(item.y > 520 ? "dialog--top" : "dialog--explore");
  if (item.mood) dialog?.querySelector(".duti")?.setAttribute("class", `duti duti--${item.mood}`);
  // keep the secret sprites and found badges visible behind the dialog
  fxEl.innerHTML = exploreSvg(sceneId);
  setFocus(focusX);
  finishRender({ focus: false });
}

function openChoicesAfterStory() {
  fxEl.innerHTML = "";
  setFocus(800);
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
  if (reason.type === "requires") return ts(reason.text);
  const label = ts(reason.type === "energy" ? MISSION.messages.insufficientEnergy : MISSION.messages.insufficientOxygen);
  return `${label}. ${t("choices.needAmount", reason)}`;
}

/** A choice that would stop the mission (now, or during the coming night). */
function dangerOf(option) {
  if (!option.available) return null;
  const join = keys => keys.map(key => t(`res.${key}`)).join(", ");
  if (option.usesUpReserve.length) return { key: "choices.dangerNow", names: join(option.usesUpReserve) };
  const tonight = [option.energyRunsOut && "energy", option.oxygenRunsOut && "oxygen"].filter(Boolean);
  return tonight.length ? { key: "choices.dangerNight", names: join(tonight) } : null;
}

function cardHtml(option, scene) {
  const selected = app.selected === option.id;
  const letter = option.id.slice(-1);
  const danger = dangerOf(option);
  return `
  <article class="card-choice ${selected ? "is-selected" : ""} ${option.available ? "" : "is-locked"} ${danger ? "is-danger" : ""}">
    <button class="card-hit" data-action="select" data-choice="${option.id}" aria-pressed="${selected}" ${option.available ? "" : 'aria-disabled="true"'}>
      <span class="card-letter">${option.available ? letter : icon("lock")}</span>
      <span class="card-label">${esc(ts(option.label))}</span>
      ${chips(option.effects)}
      ${option.warning ? `<span class="alert alert--strong">${icon("warning")}${esc(ts(option.warning))}</span>` : ""}
      ${option.available ? "" : `<span class="alert">${icon("lock")}${esc(disabledText(option.disabledReason))}</span>`}
    </button>
    ${selected ? `
    <div class="card-more">
      ${danger ? `<p class="alert alert--strong danger-note">${icon("warning")}<span>${esc(t(danger.key, { name: danger.names }))}</span></p>` : ""}
      <button class="btn ${danger ? "btn--danger" : "btn--primary"}" data-action="confirm" data-choice="${option.id}">${esc(t(danger ? "choices.confirmRisk" : "choices.confirm"))}${icon("arrow")}</button>
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
    <div class="cards cards--${options.length}${app.selected ? " has-selection" : ""}">${options.map(option => cardHtml(option, scene)).join("")}</div>
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
    const flagsBefore = { ...app.game.flags };
    app.game = choose(app.game, choiceId);
    app.selected = null;
    const pending = app.game.pending;
    app.pendingFact = FACT_BY_CHOICE[pending.choiceId] ? pickFact(pending.choiceId, app.facts, profile.facts) : null;
    if (app.game.status === "failed") {
      app.screen = "result";
      play("warning");
      layerEl.innerHTML = "";
      renderHud(pending.after.resources, pending.after.science);
      RESOURCE_KEYS.filter(key => pending.effects[key] < 0).forEach(key => bumpGauge(key, -1));
      await wait(900);
      showEnding();
      return;
    }
    const run = app.run ?? 0;
    await playActivity(pending.choiceId, flagsBefore, before);
    if (run !== (app.run ?? 0)) return;
    app.screen = "result";
    if (app.game.phase === "ended") {
      await flyEffects(layerEl.querySelector(".task") ?? layerEl, pending.effects, pending.after);
      await wait(500);
      showEnding();
      return;
    }
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
    if (run !== (app.run ?? 0)) return;
    app.line = 0;
    renderFeedbackLine();
  } finally {
    app.busy = false;
  }
}

/** The player does the chosen job by tapping the scene. */
async function playActivity(choiceId, flagsBefore, before) {
  const { id, def } = activityFor(choiceId, flagsBefore);
  if (!def) return;
  app.screen = "activity";
  app.activityId = id;
  stopTyping();
  app.activityDef = def;
  app.activityWorldState = { ...app.game, flags: flagsBefore };
  app.taskLine = null;
  setWorld(`act:${id}:${app.game.history.length}:${getLanguage()}`, sceneWorld(def.backdrop, { ...app.game, flags: flagsBefore }, {
    dusty: false, photoSrc: PHOTOS.rim.src, labels: signLabels(),
    cast: def.backdrop !== "solar-radiation-alert", // Sol 5 tasks draw (and move) the crew and robot themselves
  }));
  renderHud(before.resources, before.science);
  const total = def.total ?? (def.order === "find" ? 1 : (def.targets[0].repeat ?? def.targets.length));
  app.taskProgress = { n: 0, total };
  layerEl.innerHTML = taskBanner(def, 0, total);
  finishRender({ focus: false });
  layoutActivity();
  if (!reducedMotion()) animate(layerEl.querySelector(".task"), { opacity: [0, 1], duration: 600 });
  await wait(450);
  fxEl.innerHTML = "";
  const xs = def.targets ? def.targets.map(target => target.x).concat(def.focusExtra ?? []) : [800];
  const focusOn = (Math.min(...xs) + Math.max(...xs)) / 2;
  setTimeout(() => setFocus(focusOn), 0);
  const activity = runActivity(fxEl, def, {
    t,
    onSay: (key, miss) => {
      app.taskLine = { key, miss: Boolean(miss) }; // remembered so a language switch keeps the current prompt
      const line = layerEl.querySelector(".task-text");
      if (!line) return;
      line.textContent = t(key);
      line.classList.toggle("is-miss", Boolean(miss));
      scheduleActivityLayout();
      if (miss) play("wrong");
      if (!reducedMotion()) animate(line, { opacity: [0.3, 1], duration: 300 });
    },
    ariaTarget: (n, count) => t("act.target", { n, total: count }),
    onProgress: (n, count) => {
      app.taskProgress = { n, total: count };
      play(n >= count ? (SOBER_DONE[id] ? "done" : "success") : "step");
      const banner = layerEl.querySelector(".task");
      if (!banner) return;
      app.taskLine = null; // a new step starts from the task's own text
      banner.outerHTML = taskBanner(def, n, count, n >= count);
      scheduleActivityLayout();
      if (!reducedMotion() && n >= count) animate(layerEl.querySelector(".task"), { scale: [1.15, 1], duration: 500, ease: "outBack(3)" });
    },
  });
  layoutActivity();
  await activity;
  if (!reducedMotion() && !SOBER_DONE[id]) confetti({ particleCount: 70, spread: 70, origin: { y: 0.45 }, colors: ["#ffc93c", "#7be495", "#4fd1ff"] });
  await wait(SOBER_DONE[id] ? 1100 : 600);
  fxEl.innerHTML = "";
  worldEl.querySelectorAll(".world-scene > svg").forEach(svg => svg.setAttribute("preserveAspectRatio", "xMidYMid slice"));
  setFocus(800);
  app.activityId = null;
  app.activityDef = null;
  app.taskLine = null;
}

/** Jobs that are not a reason to celebrate: no confetti, an honest closing line. */
const SOBER_DONE = { "5C": { key: "act.done.5C", mood: "worried" }, "3C": { key: "act.done.3C", mood: "thinking" } };

function taskBanner(def, done, total, finished = false) {
  const sober = SOBER_DONE[app.activityId];
  const dots = Array.from({ length: total }, (_, i) => `<i class="${i < done ? "on" : ""}"></i>`).join("");
  return `
  <div class="task ${finished ? "is-finished" : ""}" role="status" aria-live="polite">
    <div class="task-avatar">${dutiAvatar(finished ? (sober?.mood ?? "proud") : "happy")}</div>
    <div class="task-body">
      <p class="task-text">${esc(finished ? t(sober?.key ?? "act.done") : t(def.task))}</p>
      <p class="task-progress"><span class="task-dots">${dots}</span><span>${esc(t("act.progress", { n: done, total }))}</span></p>
    </div>
    ${finished ? "" : `<button class="task-hint" data-action="hint" aria-label="${esc(t("act.hint"))}" title="${esc(t("act.hint"))}">?</button>`}
  </div>`;
}

/** "Did you know?" collectible card after DUTİ's feedback. */
/** Save the pending card without a screen (used when the sol already asked a prediction). */
function saveFactQuietly() {
  const id = app.pendingFact;
  app.pendingFact = null;
  if (!id || !FACTS[id]) return;
  if (!app.facts.includes(id)) app.facts.push(id);
  if (!profile.facts.includes(id)) {
    profile.facts.push(id);
    saveProfile();
    app.quietCard = id;
  }
}

function showFact() {
  const id = app.pendingFact;
  if (!id || !FACTS[id]) return false;
  if (profile.facts.includes(id)) {
    // Already in the journal from an earlier mission: no extra screen on replays.
    if (!app.facts.includes(id)) app.facts.push(id);
    app.pendingFact = null;
    return false;
  }
  app.screen = "fact";
  stopTyping();
  const source = NASA_SOURCES[FACTS[id].sourceId];
  const isNew = !profile.facts.includes(id);
  const count = profile.facts.length + (isNew ? 1 : 0);
  layerEl.innerHTML = `
  <div class="factcard-wrap" role="dialog" aria-labelledby="fact-title">
    <article class="factcard">
      <div class="factcard-shine" aria-hidden="true"></div>
      <header class="factcard-head">
        <span class="factcard-badge">${icon("satellite")}</span>
        <h2 id="fact-title" data-focus tabindex="-1">${esc(t("fact.title"))}</h2>
        ${isNew ? `<span class="factcard-new">${esc(t("fact.new"))}</span>` : ""}
      </header>
      <p class="factcard-text">${esc(t(`fact.${id}`))}</p>
      <footer class="factcard-foot">
        <span>${esc(t("fact.source"))}: <a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(ts(source.title))}</a></span>
        <span class="factcard-count">${icon("book")}${esc(t("fact.countAll", { n: count, total: Object.keys(FACTS).length }))}</span>
      </footer>
    </article>
    <button class="btn btn--primary btn--big" data-action="collect-fact">${icon("star")}${esc(t("fact.collect"))}</button>
    <p class="factcard-where">${icon("book")}${esc(t("fact.where"))}</p>
  </div>`;
  finishRender();
  play("card");
  if (!reducedMotion()) {
    animate(layerEl.querySelector(".factcard"), { rotateY: [-100, 0], scale: [0.6, 1], opacity: [0, 1], duration: 900, ease: "outBack(1.4)" });
    animate(layerEl.querySelector(".factcard-wrap .btn"), { opacity: [0, 1], translateY: [20, 0], delay: 600, duration: 400 });
  }
  return true;
}

async function collectFact() {
  if (app.collecting || app.game?.phase !== "feedback") return; // a second tap or key press must not advance twice
  app.collecting = true;
  const id = app.pendingFact;
  if (id && !app.facts.includes(id)) app.facts.push(id);
  if (id && !profile.facts.includes(id)) {
    profile.facts.push(id);
    saveProfile();
  }
  app.pendingFact = null;
  const card = layerEl.querySelector(".factcard");
  if (card && !reducedMotion()) {
    const target = (topbarEl.querySelector(".pill--journal") ?? topbarEl.querySelector(".brand"))?.getBoundingClientRect();
    const box = card.getBoundingClientRect();
    await new Promise(resolve => {
      setTimeout(resolve, 1000);
      animate(card, {
        translateX: target ? target.left - box.left - box.width / 2 + 20 : 0,
        translateY: target ? target.top - box.top - box.height / 2 + 20 : -300,
        scale: 0.1, rotate: -20, opacity: [1, 0.2], duration: 700, ease: "inBack(1.4)", onComplete: resolve,
      });
    });
  }
  app.collecting = false;
  if (app.screen !== "fact" || app.game.phase !== "feedback") return;
  app.game = finishFeedback(app.game);
  screenForPhase();
  const journal = topbarEl.querySelector(".pill--journal");
  if (journal && !reducedMotion()) animate(journal, { scale: [1.5, 1], duration: 600, ease: "outBack(3)" });
}

/** DUTİ's feedback followed by the mystery-light beats this run has earned (presentation only). */
function feedbackLines() {
  const pending = app.game.pending;
  if (!pending) return [];
  // The Sol 10 bridge appears only when this run will really end with the visitors (peek, no state change).
  const peek = () => { try { return finishFeedback(app.game).ending?.special === VISITORS_ID; } catch { return false; } };
  return [...pending.feedback, ...feedbackBeats(pending.choiceId, app.game.history, peek)];
}

function renderFeedbackLine() {
  const pending = app.game.pending;
  app.screen = "result";
  worldForScene();
  renderHud(app.game.resources, app.game.science);
  const lines = feedbackLines();
  const block = lines[Math.min(app.line, lines.length - 1)];
  showLine(block, `${app.line + 1} / ${lines.length}`, block.beat ? t(block.beat) : null);
  // First line: say in one sentence why the numbers changed.
  const why = `why.${pending.choiceId}`;
  if (app.line === 0 && t(why) !== why) {
    layerEl.querySelector(".dialog-name")?.insertAdjacentHTML("afterend", `<p class="dialog-why">${icon("info")}<span>${esc(t(why))}</span></p>`);
  }
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
  play("night");
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
  if (app.ledgerSol !== app.game.sol) { app.ledgerSol = app.game.sol; app.quietCardShown = app.quietCard; }
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
    <div class="ledger-grid"><div class="ledger-main">
    <ul class="ledger">
      <li><span class="ledger-icon ledger-icon--energy">${icon("energy")}</span><div><b>${esc(t("transition.battery"))} ${signed(tr.effects.energy)}</b>
        <p>${esc(ts(tr.dusty ? MISSION.messages.dustyStage : MISSION.messages.clearStage))}</p>
        ${tr.panelBonus ? `<p class="note">${icon("check")}${esc(ts(MISSION.messages.panelBonus))}</p>` : ""}</div></li>
      <li><span class="ledger-icon ledger-icon--oxygen">${icon("oxygen")}</span><div><b>${esc(t("transition.crewAir"))} ${signed(tr.effects.oxygen)}</b>
        ${tr.lowPower ? `<p class="alert">${icon("warning")}${esc(ts(MISSION.messages.lowPower))}</p>` : ""}</div></li>
      ${tr.checkpoint ? `<li class="ledger-reserve"><span class="ledger-icon ledger-icon--reserve">${icon("star")}</span><div><b>${esc(t("transition.reserve", { energy: signed(tr.checkpoint.energy), oxygen: signed(tr.checkpoint.oxygen) }))}</b>
        <p>${esc(t("transition.reserveText"))}</p></div></li>` : ""}
    </ul>
    ${tr.note ? `<p class="fineprint">${icon("info")}${esc(ts(tr.note))}</p>` : ""}
    </div><div class="ledger-side">
    ${predictionResult(tr)}
    ${app.quietCard ? `<button class="note note--card" data-action="journal">${icon("book")}${esc(t("fact.saved"))}</button>` : ""}
    <div class="lesson"><p class="label">${icon("star")}${esc(t("transition.lesson"))}</p><p>${esc(ts(scene.learningGoal))}</p></div>
    </div></div>
    <div class="actions actions--end"><button class="btn btn--primary btn--big" data-action="next-sol">${esc(t("transition.toSol", { n: nextSol }))}${icon("arrow")}</button></div>
  </div>`;
  finishRender();
  pop(".popup", { duration: 450 });
  if (!reducedMotion()) animate(layerEl.querySelectorAll(".ledger li"), { opacity: [0, 1], translateX: [-30, 0], delay: stagger(160, { start: 250 }), duration: 500, ease: "outCubic" });
  const result = layerEl.querySelector(".predict-result");
  play("morning");
  if (result) setTimeout(() => play(result.classList.contains("is-right") ? "right" : "wrong"), reducedMotion() ? 0 : 900);
  if (result && !reducedMotion()) {
    animate(result, { scale: [0.7, 1], opacity: [0, 1], delay: 600, duration: 600, ease: "outBack(2)" });
    if (result.classList.contains("is-right")) setTimeout(() => confetti({ particleCount: 50, spread: 55, origin: { y: 0.4 }, colors: ["#ffd65c", "#7be495"] }), 700);
  }
  if (app.hudShown && JSON.stringify(app.hudShown.resources) !== JSON.stringify(tr.after)) {
    const total = { ...tr.effects };
    if (tr.checkpoint) for (const key of RESOURCE_KEYS) total[key] = (total[key] ?? 0) + (tr.checkpoint[key] ?? 0);
    setTimeout(() => flyEffects(layerEl.querySelector(".ledger"), total, { resources: tr.after, science: game.science }), reducedMotion() ? 0 : 500);
  } else {
    renderHud(tr.after, game.science);
  }
}

/** Pages of a special ending: the fiction note first (if fictional), then one short page at a time. */
function endingPages(special) {
  const pages = special.pages ?? special.story.map(block => ({ story: [block] }));
  return special.fiction ? [{ note: true }, ...pages] : pages;
}

function showEndingPage() {
  const game = app.game;
  const special = SPECIAL_ENDINGS.find(item => item.id === game.ending.special);
  const pages = endingPages(special);
  const index = Math.max(0, Math.min(game.ending.page ?? 0, pages.length - 1));
  const page = pages[index];
  app.screen = "endpage";
  stopTyping();
  setWorld(`endpage:${special.id}:${getLanguage()}`, sceneWorld(SCENE_ORDER[SCENE_ORDER.length - 1], game, { photoSrc: PHOTOS.rim.src, labels: signLabels() }), { zoom: false });
  renderHud(game.ending.resources, game.ending.science);
  const storyIndex = special.fiction ? index - 1 : index;
  fxEl.innerHTML = special.id === VISITORS_ID && !page.note ? visitorsArt(storyIndex) : "";
  setFocus(800);
  const isNew = Boolean(game.ending.newlyFound ?? !profile.endings.includes(special.id));
  layerEl.innerHTML = `
  <div class="popup popup--endpage ${special.fiction ? "is-fiction" : ""}" role="dialog" aria-labelledby="endpage-title">
    <p class="end-badge">${icon("star")}${esc(special.fiction ? ts(special.fictionLabel) : t(isNew ? "ending.specialNew" : "ending.specialAgain"))}</p>
    <h2 id="endpage-title" data-focus tabindex="-1">${esc(ts(index === 0 ? special.title : page.title ?? special.title))}</h2>
    ${page.note
      ? `<p class="lead fiction-note">${icon("info")}${esc(ts(special.fictionNote))}</p>`
      : page.story.map(block => `<p class="end-line end-line--${block.speakerId}">${block.speakerId === "duti" ? `<b>${esc(MISSION.robot.displayName)}:</b> ` : ""}${esc(ts(block.text))}</p>`).join("")}
    ${special.fiction && !page.note ? `<p class="fineprint">${icon("info")}${esc(ts(special.fictionNote))}</p>` : ""}
    <p class="endpage-dots" aria-label="${esc(t("ending.page", { n: index + 1, total: pages.length }))}">${pages.map((_, i) => `<i class="${i === index ? "on" : ""}"></i>`).join("")}</p>
    <div class="actions actions--split">
      ${index > 0 ? `<button class="btn btn--ghost" data-action="end-back">${esc(t("ending.back"))}</button>` : `<button class="btn btn--ghost" data-action="end-skip">${esc(t("ending.skipStory"))}</button>`}
      <button class="btn btn--primary btn--big" data-action="end-next">${esc(t(index < pages.length - 1 ? "dialog.next" : "ending.toReport"))}${icon("arrow")}</button>
    </div>
  </div>`;
  finishRender();
  pop(".popup", { duration: 450 });
  if (index === 0) play("secret");
}

function showEnding() {
  rememberSpecialEnding();
  const pendingPages = app.game?.ending?.special && (app.game.ending.page ?? 0) < endingPages(SPECIAL_ENDINGS.find(item => item.id === app.game.ending.special)).length;
  if (pendingPages) return showEndingPage();
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
  if (h.livingTray) items.push(["good", t("ending.hl.tray")]);
  if (game.history.includes("4A") && game.history.includes("7B")) items.push(["good", t("ending.hl.earthRover")]);
  if (game.history.includes("1B") && game.history.includes("8B")) items.push(["good", t("ending.hl.pictures")]);
  if (!items.length) items.push(["info", t("ending.hl.none")]);
  const failed = ending.status === "failed";
  if (failed) {
    const kept = items.filter(([kind]) => kind === "warn");
    items.length = 0;
    items.push(...kept);
    if (!items.length) items.push(["info", t("ending.hl.none")]);
  }
  const tips = failed ? [t(`ending.tip.${ending.reasonKey ?? "noChoices"}`), t("ending.tip.cards")] : [];
  const celebrate = !ending.celebrated;
  ending.celebrated = true;
  if (celebrate) play(ending.status === "success" ? "win" : failed ? "fail" : "partial");
  const reasons = [];
  if (ending.status === "failed") {
    reasons.push(ts(ENDINGS.failed.reasons[ending.reasonKey]));
    reasons.push(t("ending.stoppedOn", { n: ending.sol }));
  } else if (!ending.scienceMet) {
    reasons.push(t("ending.scienceShort", { n: ending.scienceTarget - ending.science }));
  }
  const crew = ending.nextCrew;
  const special = ending.special ? SPECIAL_ENDINGS.find(item => item.id === ending.special) : null;
  const newEnding = Boolean(special && ending.newlyFound);
  if (ending.status === "partial" && !ending.safetyMet) reasons.push(t("ending.safetyShort", { n: MISSION.successRequirements.safety }));
  if (crew && ending.highlights.livingTray && !failed) crew.tray = MISSION.nextCrewReport.livingTray.text;
  const replayHint = special?.replayHint ?? copy.replayHint;
  const sceneId = ending.status === "success" ? SCENE_ORDER[SCENE_ORDER.length - 1] : game.sceneId;
  setWorld(`end:${ending.status}:${game.history.join()}:${getLanguage()}`, sceneWorld(sceneId, game, { photoSrc: PHOTOS.rim.src, labels: signLabels() }));
  renderHud(ending.resources, ending.science);
  layerEl.innerHTML = `
  <div class="popup popup--ending is-${ending.status}" role="dialog" aria-labelledby="end-title">
    <div class="end-hero">
      <div class="end-duti">${duti(dutiMood(), { wave: ending.status === "success" })}</div>
      <div>
        <p class="eyebrow">${esc(t("briefing.profile"))}: ${esc(ts(getProfile(game).title))}</p>
        ${playerName() && ending.status === "success" ? `<p class="end-name">${esc(t("ending.byName", { name: playerName() }))}</p>` : ""}
        ${special ? `<p class="end-badge">${icon("star")}${esc(t(newEnding ? "ending.specialNew" : "ending.specialAgain"))}</p>` : ""}
        <h2 id="end-title" data-focus tabindex="-1">${esc(ts(special?.title ?? copy.title))}</h2>
        <p class="lead">${esc(failed ? t("ending.cheer") : ts(copy.text))}</p>
        ${reasons.map(text => `<p class="alert alert--strong">${icon("info")}${esc(text)}</p>`).join("")}
      </div>
    </div>
    ${special ? `<section class="end-story">
      ${special.fiction ? `<p class="fiction-note">${icon("info")}<span><b>${esc(ts(special.fictionLabel))}:</b> ${esc(ts(special.fictionNote))}</span></p>` : ""}
      <button class="btn btn--small btn--ghost" data-action="end-replay-story">${icon("book")}${esc(t("ending.readAgain"))}</button>
      <h3>${esc(t("ending.evidence"))}</h3>
      <ul class="list">${special.evidence.map(text => `<li class="is-good">${icon("check")}<span>${esc(ts(text))}</span></li>`).join("")}</ul>
      <p class="fineprint">${icon("info")}${esc(ts(special.scienceBoundary))}</p>
    </section>` : ""}
    <div class="end-grid">
      <section class="end-box">
        <h3>${esc(t(failed ? "ending.whatHappened" : "ending.why"))}</h3>
        <ul class="list">${items.map(([kind, text]) => `<li class="is-${kind}">${icon(kind === "good" ? "check" : kind === "warn" ? "warning" : "info")}<span>${esc(text)}</span></li>`).join("")}</ul>
      </section>
      ${failed ? `<section class="end-box">
        <h3>${esc(t("ending.nextTime"))}</h3>
        <ul class="list">${tips.map(text => `<li class="is-info">${icon("star")}<span>${esc(text)}</span></li>`).join("")}</ul>
      </section>` : `<section class="end-box">
        <h3>${esc(ts(MISSION.nextCrewReport.title))}</h3>
        <ul class="list">
          <li class="is-${crew.food.status === "ready" ? "good" : "warn"}">${icon(crew.food.status === "ready" ? "check" : "warning")}<span>${esc(ts(crew.food.text))}</span></li>
          <li class="is-${crew.safety.status === "ready" ? "good" : "warn"}">${icon(crew.safety.status === "ready" ? "check" : "warning")}<span>${esc(ts(crew.safety.text))}</span></li>
          ${crew.tray ? `<li class="is-good">${icon("check")}<span>${esc(ts(crew.tray))}</span></li>` : ""}
        </ul>
      </section>`}
    </div>
    <div class="actions actions--center">
      <button class="btn btn--primary btn--big" data-action="new-game">${icon("restart")}${esc(ts(MISSION.messages.tryAgain))}</button>
      <button class="btn btn--ghost" data-action="mission-log" aria-label="${esc(t("ending.log"))}" title="${esc(t("ending.log"))}">${icon("star")}${esc(t("ending.log"))}</button>
      <button class="btn btn--ghost" data-action="journal" aria-label="${esc(t("journal.open"))}" title="${esc(t("journal.open"))}">${icon("book")}${esc(t("journal.open"))}</button>
    </div>
    <p class="end-stats">${icon("star")}${esc(t("predict.score", { n: app.score.right, total: app.score.total }))} · ${esc(t("ending.facts", { n: app.facts.length }))} · ${esc(t("journal.total", { n: profile.discoveries.length, total: Object.values(DISCOVERIES).flat().length }))}</p>
    ${replayHint ? `<p class="end-replay">${icon("star")}${esc(ts(replayHint))}${ending.status === "success" ? ` ${esc(t("ending.anotherStory"))}` : ""}</p>` : ""}
    <p class="fineprint center">${esc(t("ending.newForecast"))}</p>
  </div>`;
  finishRender();
  const endPopup = layerEl.querySelector(".popup--ending");
  if (endPopup) endPopup.scrollTop = 0;
  pop(".popup", { duration: 600 });
  if (!reducedMotion()) {
    animate(layerEl.querySelector(".end-duti"), { translateY: [80, 0], rotate: [-10, 0], duration: 1000, delay: 200, ease: "outElastic(1, .6)" });
    animate(layerEl.querySelectorAll(".end-box"), { opacity: [0, 1], translateY: [30, 0], delay: stagger(140, { start: 450 }), duration: 520, ease: "outCubic" });
    if (ending.status === "success" && celebrate) {
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
  modal.setAttribute("aria-label", modal.querySelector(".modal-head .eyebrow, h2")?.textContent ?? ts(MISSION.title));
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

function journalModal() {
  const all = Object.values(DISCOVERIES).flat();
  const name = playerName();
  openModal(`
    ${modalHead(t("journal.open"))}
    <h2 data-focus tabindex="-1">${esc(name ? t("journal.title", { name }) : t("journal.titleNoName"))}</h2>
    <p>${esc(t(profile.discoveries.filter(id => all.some(d => d.id === id)).length >= all.length ? "journal.introDone" : "journal.intro"))}</p>
    <nav class="journal-jump">
      <a class="pill" href="#journal-facts">${icon("satellite")}${esc(t("journal.factsTotal", { n: profile.facts.length, total: Object.keys(FACTS).length }))}</a>
      <a class="pill" href="#journal-places">${icon("star")}${esc(t("journal.total", { n: profile.discoveries.filter(id => all.some(d => d.id === id)).length, total: all.length }))}</a>
    </nav>
    <h3 class="journal-section">${icon("search")}${esc(t("journal.notebookTitle"))}</h3>
    <p class="small">${esc(t("journal.notebookIntro"))}</p>
    <ol class="journal journal--notebook">${SCENE_ORDER.flatMap(sceneId => (DISCOVERIES[sceneId] ?? []).filter(d => d.kind === "clue").map(d => ({ d, sol: SCENES[sceneId].sol }))).map(({ d, sol }) => profile.discoveries.includes(d.id) ? `
      <li class="journal-item is-found is-clue"><span class="journal-kind">${icon("search")}${esc(t("ending.sol", { n: sol }))} · ${esc(t("journal.kind.clue"))}</span><p>${esc(t(`disc.${d.id}`))}</p></li>` : `
      <li class="journal-item is-missing is-clue"><span class="journal-q" aria-hidden="true">?</span><p>${esc(t("journal.clueUnknown", { n: sol }))}</p></li>`).join("")}</ol>
    <h3 id="journal-facts" class="journal-section">${icon("satellite")}${esc(t("journal.factsTitle"))}</h3>
    <ul class="journal journal--facts">${Object.keys(FACTS).map(id => {
      const source = NASA_SOURCES[FACTS[id].sourceId];
      return profile.facts.includes(id) ? `
      <li class="journal-item is-found is-fact">
        <span class="journal-kind kind--nasa">${icon("satellite")}${esc(t("fact.title"))}</span>
        <p>${esc(t(`fact.${id}`))}</p>
        ${source ? `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(ts(source.title))}</a>` : ""}
      </li>` : `
      <li class="journal-item is-missing is-fact"><span class="journal-q" aria-hidden="true">?</span><p>${esc(t("journal.factUnknown"))}</p></li>`;
    }).join("")}</ul>
    <h3 class="journal-section">${icon("book")}${esc(t("journal.endingsTitle"))}</h3>
    <ul class="journal journal--endings">${profile.endings.map(id => SPECIAL_ENDINGS.find(e => e.id === id)).filter(Boolean).map(e => `
      <li class="journal-item is-found is-secret"><span class="journal-kind">${icon("star")}${esc(e.fiction ? ts(e.fictionLabel) : t("journal.endingKind"))}</span><p><b>${esc(ts(e.title))}</b></p>${e.journalSummary ? `<p>${esc(ts(e.journalSummary))}</p><p class="fineprint">${esc(ts(e.fictionNote))}</p>` : ""}<p>${esc(ts(e.replayHint))}</p></li>`).join("")}
      <li class="journal-item is-missing"><span class="journal-q" aria-hidden="true">?</span><p>${esc(t(profile.endings.length ? "journal.endingMore" : "journal.endingNone"))}</p></li>
    </ul>
    <h3 id="journal-places" class="journal-section">${icon("star")}${esc(t("journal.placesTitle"))}</h3>
    ${SCENE_ORDER.map(sceneId => `
      <h3>${esc(t(`loc.place.${sceneId}`))}</h3>
      <ul class="journal">${(DISCOVERIES[sceneId] ?? []).map(d => {
        const found = profile.discoveries.includes(d.id);
        const source = d.sourceId ? (NASA_SOURCES[d.sourceId] ?? DISCOVERY_SOURCES[d.sourceId]) : null;
        return found ? `
        <li class="journal-item is-found ${d.secret ? "is-secret" : ""}">
          <span class="journal-kind kind--${d.kind}">${d.secret ? `${icon("star")}${esc(t("journal.secret"))} · ` : ""}${esc(t(`journal.kind.${d.kind}`))}</span>
          <p>${esc(t(`disc.${d.id}`))}</p>
          ${source ? `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(ts(source.title))}</a>` : ""}
        </li>` : `
        <li class="journal-item is-missing ${d.secret ? "is-secret" : ""}"><span class="journal-q" aria-hidden="true">?</span><p>${d.secret ? `${icon("star")}${esc(t("journal.secret"))}: ` : ""}${esc(t("journal.unknown"))}</p></li>`;
      }).join("")}</ul>`).join("")}
    <div class="actions actions--center"><button class="btn btn--primary" data-action="close-modal">${esc(t("modal.close"))}</button></div>`, "modal--journal");
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
  const inScene = Boolean(app.game) && !["title", "briefing", "transition", "ledger", "ending"].includes(app.screen);
  const sceneId = inScene ? app.game.sceneId : "";
  document.body.dataset.scene = sceneId;
  setAmbience(sceneId === "solar-radiation-alert" ? "storm"
    : ["welcome-to-mars", "final-mission"].includes(sceneId) || ["transition", "ledger"].includes(app.screen) ? "outside" : "inside");
  renderTopbar();
  if (focus) layerEl.querySelector("[data-focus]")?.focus({ preventScroll: true });
  save();
}

/** Re-draw the current screen in the new language without losing progress. */
function redraw() {
  if (app.screen !== "activity") app.worldKey = "";
  if (["predict", "fact", "transition"].includes(app.screen) && app.hudShown) {
    document.documentElement.lang = getLanguage();
    renderHud(app.hudShown.resources, app.hudShown.science);
  }
  switch (app.screen) {
    case "title": return showTitle();
    case "briefing": return showBriefing();
    case "intro": return showIntro();
    case "story": return renderStoryLine();
    case "spot": return showSpotlight();
    case "explore": return showExplore();
    case "explore-line": {
      const open = app.exploreLineId;
      showExplore();
      if (open) discover(open, null, { replay: true });
      return;
    }
    case "predict": return showPredict();
    case "fact": return showFact();
    case "activity": {
      const banner = layerEl.querySelector(".task-text");
      const current = app.activityId ? activityFor(app.activityId === "6C-report" ? "6C" : app.activityId, { greenhouseMode: app.activityId === "6C-report" ? "off" : "full" }).def : null;
      // Re-translate everything on screen without restarting the task: page language, HUD labels
      // (with the values currently shown), the task banner and its current question, hint or retry message.
      document.documentElement.lang = getLanguage();
      if (app.hudShown) renderHud(app.hudShown.resources, app.hudShown.science);
      if (app.activityDef && app.activityWorldState) {
        const def = app.activityDef;
        setWorld(`act:${app.activityId}:${app.game.history.length}:${getLanguage()}`, sceneWorld(def.backdrop, app.activityWorldState, {
          dusty: false, photoSrc: PHOTOS.rim.src, labels: signLabels(), cast: def.backdrop !== "solar-radiation-alert",
        }), { zoom: false });
      }
      const box = layerEl.querySelector(".task");
      if (box && current && app.taskProgress) {
        const finished = box.classList.contains("is-finished");
        box.outerHTML = taskBanner(current, app.taskProgress.n, app.taskProgress.total, finished);
        const line = layerEl.querySelector(".task-text");
        if (line && !finished && app.taskLine) {
          line.textContent = t(app.taskLine.key);
          line.classList.toggle("is-miss", Boolean(app.taskLine.miss));
        }
      } else if (banner && current) {
        banner.textContent = t(app.taskLine?.key ?? current.task);
      }
      renderTopbar();
      layoutActivity();
      return;
    }
    case "choices": return showChoices({ animateIn: false });
    case "result": return app.game.phase === "feedback" ? renderFeedbackLine() : showEnding();
    case "transition": case "ledger": app.screen = "transition"; return showLedger();
    case "ending": return showEnding();
    case "endpage": return showEndingPage();
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
  if (app.busy) return;
  if (stopTyping(true)) return; // the first tap finishes the sentence
  if (app.screen === "spot") {
    if (app.observing) {
      // Waiting for the child to try the device: point at it again instead of moving on.
      // Point at the device button again (a CSS pulse; no transform on the drawing).
      const target = layerEl.querySelector(".observe-btn");
      if (target) { target.classList.remove("is-nudged"); void target.offsetWidth; target.classList.add("is-nudged"); target.focus({ preventScroll: true }); }
      return;
    }
    const spots = app.spotList?.length ? app.spotList : SPOTLIGHTS[app.game.sceneId];
    if (app.spot < spots.length - 1) {
      app.spot += 1;
      showSpotlight();
    } else {
      markSeen(`spot:${app.game.sceneId}`);
      fxEl.innerHTML = "";
      showExplore({ animateIn: true });
    }
    return;
  }
  if (app.screen === "explore-line") {
    showExplore();
    return;
  }
  if (app.screen === "story") {
    const lines = app.storyLines ?? getScene(app.game).story;
    if (app.line < lines.length - 1) {
      app.line += 1;
      renderStoryLine();
    } else {
      afterStory();
    }
    return;
  }
  if (app.screen === "result" && app.game.phase === "feedback") {
    if (app.line < feedbackLines().length - 1) {
      app.line += 1;
      renderFeedbackLine();
      return;
    }
    if (needsPrediction()) return showPredict();
    if (showFact()) return;
    if (app.game.phase !== "feedback") return;
    app.game = finishFeedback(app.game);
    screenForPhase();
  }
}

/* ---------- predict, then observe ---------- */

function predictionFor(game) {
  const scene = getScene(game);
  if (!scene.transition) return null;
  const tr = computeTransition(game, scene, game.resources.energy, { ...game.flags, ...(game.pending?.setFlagsAfterFeedback ?? {}) });
  let resource;
  if (tr.lowPower) resource = "oxygen";
  else if (tr.dusty || tr.panelBonus) resource = "energy";
  else resource = scene.sol % 2 ? "energy" : "oxygen";
  const before = game.resources[resource];
  const after = Math.max(0, Math.min(10, before + tr.effects[resource]));
  let kind;
  if (after === before && tr.effects[resource] > 0) kind = "full";
  else if (resource === "oxygen") kind = tr.lowPower ? "oxygenLow" : "oxygen";
  else kind = tr.panelBonus ? "energyPanels" : tr.dusty ? "energyDusty" : "energyClear";
  const question = kind === "full" ? "energyClear" : kind;
  return { sol: scene.sol, resource, kind, question, change: after - before, actual: Math.sign(after - before), tr };
}

function needsPrediction() {
  const game = app.game;
  if (!game?.pending || !getScene(game).transition || getScene(game).sol === MISSION.checkpoint?.afterSol || app.predict?.sol === game.sol) return false;
  // Ask only when the night is interesting (dust, cleaned panels, low battery, a full battery), plus once on Sol 1.
  const info = predictionFor(game);
  return Boolean(info) && (game.sol === 1 || ["energyDusty", "energyPanels", "oxygenLow", "full"].includes(info.kind));
}

const arrowIcon = dir => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${dir === 0
  ? '<path d="M5 9h14M5 15h14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'
  : `<path d="${dir > 0 ? "M12 19V5M5 12l7-7 7 7" : "M12 5v14M5 12l7 7 7-7"}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`}</svg>`;

function showPredict() {
  const info = predictionFor(app.game);
  if (!info) return;
  app.screen = "predict";
  stopTyping();
  const options = [[1, "predict.up"], [0, "predict.same"], [-1, "predict.down"]];
  layerEl.innerHTML = `
  <div class="popup popup--predict" role="dialog" aria-labelledby="predict-title">
    <div class="predict-head">
      <div class="popup-avatar">${dutiAvatar("thinking")}</div>
      <div><h2 id="predict-title" data-focus tabindex="-1">${esc(t("predict.title"))}</h2>
      <p class="lead">${esc(t(`predict.q.${info.question}`))}</p></div>
    </div>
    <div class="predict-res">${icon(info.resource)}<b>${esc(t(`res.${info.resource}`))}</b><span>${app.game.resources[info.resource]}/10</span></div>
    <div class="predict-options">
      ${options.map(([dir, key]) => `<button class="predict-btn predict-btn--${dir > 0 ? "up" : dir < 0 ? "down" : "same"}" data-action="guess" data-dir="${dir}">${arrowIcon(dir)}<span>${esc(t(key))}</span></button>`).join("")}
    </div>
  </div>`;
  finishRender();
  pop(".popup", { duration: 450 });
  if (!reducedMotion()) animate(layerEl.querySelectorAll(".predict-btn"), { opacity: [0, 1], translateY: [30, 0], delay: stagger(110, { start: 200 }), duration: 500, ease: "outBack(2)" });
}

async function makeGuess(dir) {
  const info = predictionFor(app.game);
  if (!info || app.screen !== "predict" || app.guessing) return; // one guess per night, even on a double tap
  app.guessing = true;
  app.predict = { sol: info.sol, resource: info.resource, kind: info.kind, change: info.change, guess: dir, actual: info.actual };
  app.score.total += 1;
  if (dir === info.actual) app.score.right += 1;
  layerEl.querySelectorAll(".predict-btn").forEach(btn => {
    btn.disabled = true;
    btn.classList.toggle("is-picked", Number(btn.dataset.dir) === dir);
  });
  const lead = layerEl.querySelector(".popup--predict .lead");
  if (lead) lead.textContent = t("predict.wait");
  save();
  const run = app.run ?? 0;
  await wait(1100);
  app.guessing = false;
  if (run !== (app.run ?? 0) || app.screen !== "predict" || app.game.phase !== "feedback") return;
  saveFactQuietly();
  app.game = finishFeedback(app.game);
  screenForPhase();
}

function predictionResult(tr) {
  const p = app.predict;
  if (!p || p.sol !== getScene(app.game).sol) return "";
  const right = p.guess === p.actual;
  return `
  <div class="predict-result ${right ? "is-right" : "is-wrong"}">
    <p class="predict-result-head">${right ? icon("star") : icon("info")}<b>${esc(right ? t("predict.right") : t("predict.wrong"))}</b>
      <span class="predict-guess">${esc(t("predict.yours"))}: ${arrowIcon(p.guess)}${icon(p.resource)}</span></p>
    ${p.kind ? `<p class="predict-why">${esc(t(`predict.why.${p.kind}`, { n: signed(p.change ?? 0) }))}</p>` : ""}
  </div>`;
}

function startNewGame() {
  if (modal.open) modal.close();
  const profileId = pickProfileId(Math.random, app.lastProfileId);
  app.lastProfileId = profileId;
  app.game = createGame(profileId);
  app.seenCards = [];
  app.facts = [];
  app.found = [];
  app.pendingFact = null;
  app.predict = null;
  app.score = { right: 0, total: 0 };
  app.selected = null;
  Object.assign(app, { quietCard: null, ledgerSol: null, line: 0, storyLines: null, spotList: null, exploreLineId: null, guessing: false, collecting: false, observing: false, observed: null, taskLine: null, introToken: null, cinemaToken: null });
  app.run = (app.run ?? 0) + 1;
  fxEl.innerHTML = "";
  showBriefing();
}

const actions = {
  home() {
    if (app.screen === "activity") return;
    app.run = (app.run ?? 0) + 1; // pending async flows (result, guess, card) check this and stop
    app.guessing = false;
    app.collecting = false;
    showTitle();
  },
  language() {
    const nameField = document.getElementById("player-name");
    if (nameField) profile.name = nameField.value.replace(/[<>]/g, "").trim().slice(0, 16);
    setLanguage(getLanguage() === "en" ? "tr" : "en");
    if (modal.open) modal.close();
    stopTyping();
    redraw();
  },
  sources: sourcesModal,
  sound() {
    setSoundEnabled(!soundEnabled());
    play("select");
    renderTopbar();
  },
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
  begin() {
    const input = document.getElementById("player-name");
    if (input) {
      profile.name = input.value.replace(/[<>]/g, "").trim().slice(0, 16);
      saveProfile();
    }
    showIntro();
  },
  ready: () => openChoicesAfterStory(),
  "pan-left": () => setFocus(focusX - 280),
  observe() {
    const spot = (app.spotList?.length ? app.spotList : SPOTLIGHTS[app.game?.sceneId])?.[app.spot];
    if (app.screen === "spot" && spot?.observe) observeDevice(spot);
  },
  "end-next"() {
    const ending = app.game?.ending;
    if (!ending) return;
    ending.page = (ending.page ?? 0) + 1;
    fxEl.innerHTML = "";
    showEnding();
  },
  "end-back"() {
    const ending = app.game?.ending;
    if (!ending) return;
    ending.page = Math.max(0, (ending.page ?? 0) - 1);
    showEndingPage();
  },
  "end-skip"() {
    const ending = app.game?.ending;
    if (!ending) return;
    ending.page = 99;
    fxEl.innerHTML = "";
    showEnding();
  },
  "end-replay-story"() {
    const ending = app.game?.ending;
    if (!ending?.special) return;
    ending.page = 0;
    showEndingPage();
  },
  "skip-story"() {
    if (app.screen !== "story") return;
    stopTyping();
    // Jump to DUTİ's memory lines (if any), otherwise past the story.
    const firstMemory = (app.storyLines ?? []).findIndex(line => line.memory);
    if (firstMemory > app.line) { app.line = firstMemory; renderStoryLine(); } else afterStory();
  },
  hint() {
    const def = app.activityDef;
    if (!def) return;
    const line = layerEl.querySelector(".task-text");
    app.taskLine = { key: def.hint ?? "act.hint.default", miss: false };
    if (line) { line.textContent = t(app.taskLine.key); line.classList.remove("is-miss"); }
    scheduleActivityLayout();
    pulseHint(fxEl);
  },
  "pan-right": () => setFocus(focusX + 280),
  journal: journalModal,
  guess(target) { makeGuess(Number(target.dataset.dir)); },
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
    play(app.selected && dangerOf(option) ? "warning" : "select");
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
  "collect-fact"(target) {
    target.disabled = true;
    collectFact();
  },
  "next-sol"() {
    app.quietCard = null;
    app.game = finishTransition(app.game);
    screenForPhase();
  },
};

document.addEventListener("click", event => {
  unlockSound();
  const target = event.target.closest("[data-action]");
  if (!target) {
    // A click anywhere on the screen moves the story on, like the Next button.
    if (event.button === 0 && !modal.open && !event.target.closest("a, button, input, label, #topbar, #hud, .hotspot, .act-target")) nextByKeyOrClick(event);
    return;
  }
  if (target.getAttribute("aria-disabled") === "true") return;
  const name = target.dataset.action;
  if (!["select", "sound", "confirm"].includes(name)) play(["advance", "intro-done", "skip-cinema"].includes(name) ? "next" : "tap");
  actions[name]?.(target);
});

/** Next step for Space, Enter, the right arrow or a click on an empty part of the screen. Returns true if used. */
function nextByKeyOrClick(event) {
  if (app.busy) return false;
  const story = ["story", "spot", "explore-line"].includes(app.screen) || (app.screen === "result" && app.game?.phase === "feedback" && layerEl.querySelector(".dialog"));
  let run = null;
  if (story) run = advance;
  else if (app.screen === "intro") run = () => { if (app.screen === "intro") startStory(); };
  else if (app.screen === "transition") run = () => { if (app.screen === "transition") showLedger(); };
  else if (event.type === "keydown" && app.screen === "fact") run = () => layerEl.querySelector('[data-action="collect-fact"]:not(:disabled)')?.click();
  else if (event.type === "keydown" && app.screen === "ledger") run = () => layerEl.querySelector('[data-action="next-sol"]')?.click();
  else if (event.type === "keydown" && app.screen === "endpage") run = () => layerEl.querySelector('[data-action="end-next"]')?.click();
  if (!run) return false;
  event.preventDefault();
  if (event.type !== "keydown" || !["fact", "ledger"].includes(app.screen)) play("next");
  run();
  return true;
}

document.addEventListener("keydown", event => {
  if (modal.open || event.repeat || ![" ", "Enter", "ArrowRight"].includes(event.key)) return;
  const focused = document.activeElement;
  if (focused && ["INPUT", "TEXTAREA", "SELECT"].includes(focused.tagName)) return;
  // A focused button or link (top bar, Skip ahead, Back, the device button, a source link) keeps its own
  // Enter/Space. Only the big tap areas (dialog, intro card, night scene) and the page itself mean "next".
  const control = focused && focused !== document.body && !focused.matches(".dialog, .intro, .cinema")
    && (focused.tagName === "BUTTON" || focused.tagName === "A" || focused.getAttribute("role") === "button");
  if (control) return;
  // Debounce reading-area navigation only. A deliberately focused control must keep
  // its native activation even immediately after another screen has opened.
  const now = performance.now();
  const lastKey = app.lastKey;
  app.lastKey = { screen: app.screen, time: now };
  if (lastKey && lastKey.screen !== app.screen && now - lastKey.time < 450) { event.preventDefault(); return; }
  // On reading screens these keys always mean "next", even if a button still has focus.
  const reading = ["story", "spot", "explore-line", "intro", "transition", "fact", "ledger", "endpage"].includes(app.screen) || (app.screen === "result" && app.game?.phase === "feedback");
  if (!reading && focused && (focused.tagName === "BUTTON" || focused.tagName === "A" || focused.getAttribute("role") === "button")) return;
  if (!reading && event.key === "ArrowRight") return;
  nextByKeyOrClick(event);
});

modal.addEventListener("click", event => {
  if (event.target === modal) modal.close();
});

/* ---------- start ---------- */

const saved = load();
setLanguage(saved?.language ?? "en"); // English first; Turkish is opt-in
app.lastProfileId = saved?.lastProfileId ?? null;
app.seenCards = saved?.seenCards ?? [];
app.facts = saved?.facts ?? [];
app.found = saved?.found ?? [];
app.predict = saved?.predict ?? null;
app.score = saved?.score ?? { right: 0, total: 0 };
// A card that was shown but not yet collected before a reload is offered again.
app.pendingFact = saved?.game?.phase === "feedback" ? saved?.pendingFact ?? null : null;
if (saved?.game?.phase && saved.screen && SCENES[saved.game.sceneId]) {
  app.game = saved.game;
  app.resumeScreen = saved.screen;
}
showTitle();
