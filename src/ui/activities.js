/**
 * Hands-on moments around each decision.
 *  - SPOTLIGHTS: before choosing, DUTİ points at the parts of the location that matter.
 *  - ACTIVITIES: after choosing, the player does the chosen job by tapping the scene.
 * The overlay and location share 1600 x 900 artwork coordinates. During a task, app.js
 * fits the active region of both into a camera area clear of the HUD and instructions.
 * These are presentation only: game rules and resource changes stay in src/game/engine.js.
 * AI-assisted generation: Anthropic Claude. See AI_USAGE.md and ai-usage.json.
 * AI-assisted 1.11.1 revisions: OpenAI Codex (target spacing, live SVG translations, note-task feedback).
 */
import { animate } from "../../assets/vendor/animejs/anime.esm.min.js";

const NS = "http://www.w3.org/2000/svg";
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const sleep = ms => new Promise(resolve => setTimeout(resolve, reduced() ? 0 : ms));
const anim = (target, params) => (reduced() || !target ? null : animate(target, params));

/* ---------- spotlights: what DUTİ shows before the choice ---------- */

export const SPOTLIGHTS = {
  "welcome-to-mars": [
    { x: 1310, y: 670, r: 190, key: "spot.landing.panels" },
    { x: 470, y: 680, r: 120, key: "spot.landing.shelter" },
    { x: 650, y: 612, r: 100, key: "spot.landing.lantern" },
  ],
  "power-shortage": [
    { x: 500, y: 440, r: 190, key: "spot.power.battery", observe: { x: 630, y: 470, gauge: "energy", key: "spot.power.try", label: "spot.observe.heater" } },
    { x: 1115, y: 500, r: 190, key: "spot.power.oxygen" },
  ],
  "greenhouse-problem": [
    { x: 800, y: 320, r: 260, key: "spot.greenhouse.lights", observe: { x: 800, y: 380, gauge: "energy", key: "spot.greenhouse.try", label: "spot.observe.lights" } },
    { x: 800, y: 600, r: 230, key: "spot.greenhouse.plants" },
  ],
  "message-from-earth": [
    { x: 800, y: 320, r: 290, key: "spot.comms.screen" },
    { x: 1345, y: 300, r: 150, key: "spot.comms.robot" },
  ],
  "solar-radiation-alert": [
    { x: 1260, y: 190, r: 200, key: "spot.storm.sun" },
    { x: 620, y: 650, r: 170, key: "spot.storm.shelter" },
  ],
  "the-three-note-mystery": [
    { x: 800, y: 320, r: 290, key: "spot.mystery.screen" },
    { x: 1345, y: 300, r: 150, key: "spot.mystery.rover" },
  ],
  "the-drawer-marked-tomorrow": [
    { x: 990, y: 700, r: 150, key: "spot.drawer.label" },
    { x: 500, y: 440, r: 190, key: "spot.drawer.battery" },
  ],
  "two-stories-one-signal": [
    { x: 975, y: 750, r: 140, key: "spot.stories.crew" },
    { x: 560, y: 765, r: 110, key: "spot.stories.rover" },
  ],
  "a-light-for-who-comes-next": [
    { x: 540, y: 560, r: 130, key: "spot.light.send" },
    { x: 1100, y: 560, r: 130, key: "spot.light.shelf" },
  ],
  "final-mission": [
    { x: 540, y: 560, r: 130, key: "spot.final.lab" },
    { x: 810, y: 480, r: 130, key: "spot.final.route" },
    { x: 1100, y: 560, r: 130, key: "spot.final.plants" },
  ],
};

/** Dim everything except one circle, with a pulsing ring. */
export function spotlightSvg(spot) {
  return `
  <svg class="fx fx--spot" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><mask id="spotMask"><rect width="1600" height="900" fill="#fff"/><circle cx="${spot.x}" cy="${spot.y}" r="${spot.r}" fill="#000"/></mask></defs>
    <rect class="spot-dim" width="1600" height="900" fill="#050816" opacity=".62" mask="url(#spotMask)"/>
    <circle class="spot-ring" cx="${spot.x}" cy="${spot.y}" r="${spot.r}" fill="none" stroke="#ffd65c" stroke-width="7" stroke-dasharray="18 14"/>
    <circle class="spot-pulse" cx="${spot.x}" cy="${spot.y}" r="${spot.r}" fill="none" stroke="#ffd65c" stroke-width="4"/>
  </svg>`;
}

/* ---------- sprites ---------- */

const crate = (x, y, i) => `
  <g transform="translate(${x} ${y})"><g class="act-sprite" data-sprite="${i}">
    <g class="act-bob"><rect x="-38" y="-34" width="76" height="62" rx="8" fill="#c98a4a" stroke="#7a4c27" stroke-width="5"/>
    <path d="M-38-10h76M-10-34v62" stroke="#7a4c27" stroke-width="4"/>
    <rect x="-16" y="-24" width="32" height="10" rx="3" fill="${["#58d3ff", "#7be495", "#ffd65c"][i % 3]}"/></g>
  </g></g>`;

const rock = (x, y, i, scale = 1) => `
  <g transform="translate(${x} ${y}) scale(${scale})"><g class="act-sprite" data-sprite="${i}" data-x="${x}">
    <ellipse cx="0" cy="34" rx="62" ry="12" fill="#000" opacity=".25"/>
    <path class="act-rock" d="M-58 30l-6-30 22-30 36-12 34 10 26 26-4 36Z" fill="#8a4a32" stroke="#5e2416" stroke-width="5"/>
    <path d="M-30-14l22-8 18 6M10 4l20 6" stroke="#b56a48" stroke-width="5" stroke-linecap="round" fill="none"/>
    <g class="act-crystal" opacity="0"><path d="M-6 6l10-34 10 34Z" fill="#7ef0ff" stroke="#e8fdff" stroke-width="3"/><path d="M10 10l8-22 8 22Z" fill="#c79bff"/></g>
  </g></g>`;

const astronautSprite = (x, y, i) => `
  <g transform="translate(${x} ${y})"><g class="act-sprite" data-sprite="${i}">
    <g class="act-bob">
      <rect x="-18" y="-6" width="36" height="46" rx="14" fill="#f7f2e8"/>
      <rect x="-24" y="-2" width="12" height="32" rx="6" fill="#d8d1c6"/><rect x="12" y="-2" width="12" height="32" rx="6" fill="#d8d1c6"/>
      <rect x="-15" y="36" width="13" height="26" rx="6" fill="#d8d1c6"/><rect x="2" y="36" width="13" height="26" rx="6" fill="#d8d1c6"/>
      <circle cx="0" cy="-26" r="22" fill="#f7f2e8"/><rect x="-15" y="-36" width="30" height="20" rx="9" fill="#27335f"/>
      <rect x="-8" y="6" width="16" height="10" rx="3" fill="#e2703a"/>
    </g>
  </g></g>`;

const roverSprite = (x, y, i, sprite = true) => `
  <g transform="translate(${x} ${y})"><g ${sprite ? `class="act-sprite" data-sprite="${i}"` : `class="act-rover" data-rover="${i}"`}>
    <g transform="scale(0.8)">
      <rect x="-60" y="-18" width="120" height="30" rx="10" fill="#efe9dd"/>
      <rect x="-8" y="-58" width="14" height="42" fill="#b8b2a8"/><rect x="-28" y="-80" width="52" height="26" rx="8" fill="#27335f"/>
      <circle cx="-14" cy="-67" r="6" fill="#7ef0ff"/><circle cx="10" cy="-67" r="6" fill="#7ef0ff"/>
      <rect x="-56" y="-30" width="52" height="12" rx="3" fill="#3f6fd8"/>
      ${[-44, 0, 44].map(cx => `<circle cx="${cx}" cy="20" r="17" fill="#2a1d18"/>`).join("")}
    </g>
  </g></g>`;

/** The storm shelter's door (see stormWorld in world.js). */
const SHELTER = [620, 690];

/** Someone hurries into the storm shelter and disappears inside. */
async function intoShelter(svg, el, from, { duration = 1100, delay = 0 } = {}) {
  if (!el) return;
  if (reduced()) { el.setAttribute("opacity", "0"); return; }
  anim(el, {
    translateX: [0, SHELTER[0] - from[0]], translateY: [0, SHELTER[1] - from[1]],
    scale: [1, 0.55], opacity: [1, 1, 0], delay, duration, ease: "inOutQuad",
  });
  await sleep(delay + duration + 80);
  el.setAttribute("opacity", "0");
  burst(svg, SHELTER[0], SHELTER[1] - 10, "#7be495");
}

/** The shelter door closes behind the last one in. */
function closeDoor(svg) {
  const door = svg.querySelector(".act-door");
  if (!door) return;
  door.setAttribute("opacity", "1");
  anim(door, { scaleY: [0, 1], duration: 500, ease: "outBounce" });
}
const shelterDoor = () => `<rect class="act-door" x="${SHELTER[0] - 28}" y="654" width="56" height="66" rx="6" fill="#8b93a8" stroke="#5d6478" stroke-width="4" opacity="0"/>`;

const plantSprite = (x, y, i) => `
  <g transform="translate(${x} ${y})"><g class="act-sprite" data-sprite="${i}">
    <g class="act-plant"><path d="M0 0v-46" stroke="#3fae6a" stroke-width="7" stroke-linecap="round"/>
    <ellipse cx="-18" cy="-30" rx="20" ry="10" fill="#59d188" transform="rotate(-30 -18 -30)"/>
    <ellipse cx="18" cy="-40" rx="20" ry="10" fill="#7be495" transform="rotate(30 18 -40)"/>
    <circle cx="4" cy="-50" r="11" fill="#ff7b6b"/></g>
  </g></g>`;

function panelDust() {
  return [0, 1, 2, 3].map(i => `
    <g transform="translate(${1130 + i * 92} ${600 + i * 6})"><path class="act-sprite act-dust" data-sprite="${i}" d="M-8 72l84-46 26 28-84 46Z" fill="#b8673f" opacity=".92"/>
      <g class="act-dust-specks" data-sprite-extra="${i}" fill="#e2a070">${[[10, 70], [40, 52], [62, 46], [30, 78], [70, 62]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="4"/>`).join("")}</g></g>`).join("");
}

function tankFill() {
  return `
    <rect x="1062" y="390" width="106" height="170" rx="16" fill="#0d3247" opacity=".55"/>
    <rect class="act-tank" x="1062" y="560" width="106" height="0" rx="16" fill="#7ef0ff" opacity=".85"/>
    <g transform="translate(1115 612)"><g class="act-valve">
      <circle r="38" fill="#e2703a" stroke="#7c2f1a" stroke-width="6"/>
      <path d="M-30 0h60M0-30v60" stroke="#7c2f1a" stroke-width="8" stroke-linecap="round"/><circle r="9" fill="#ffd65c"/>
    </g></g>`;
}

function graphPanel() {
  return `
    <g class="act-panel" transform="translate(0 250)">
      <rect x="560" y="90" width="480" height="270" rx="34" fill="#071028" stroke="#58d3ff" stroke-width="6"/>
      <path d="M610 130v190h400" stroke="#3a4686" stroke-width="4" fill="none"/>
      <path d="M610 168h400" stroke="#3a4686" stroke-width="2" stroke-dasharray="8 10"/>
      <text x="620" y="160" font-family="Fredoka, sans-serif" font-size="22" fill="#9fe2ff">−3 °C</text>
      <text x="620" y="312" font-family="Fredoka, sans-serif" font-size="22" fill="#9fe2ff">−77 °C</text>
      <polyline class="act-line" points="" fill="none" stroke="#ffd65c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`;
}

const GRAPH_OFFSET = 250;
const GRAPH_POINTS = [[690, 175], [800, 235], [900, 300], [990, 200]];
const GRAPH_TARGETS = GRAPH_POINTS.map(([x, y]) => [x, y + GRAPH_OFFSET]);

function lightMasks(startDark) {
  return [0, 1].map(row => `<rect class="act-sprite act-mask" data-sprite="${row}" x="400" y="${300 + row * 210}" width="800" height="200" fill="#040b0b" opacity="${startDark ? 0.72 : 0}"/>`).join("")
    + [0, 1].map(row => `
    <g class="act-switch" data-switch="${row}" transform="translate(360 ${336 + row * 210})">
      <rect x="-28" y="-40" width="56" height="80" rx="14" fill="#1b2350" stroke="#8b93a8" stroke-width="5"/>
      <rect class="act-switch-knob" x="-14" y="${startDark ? 2 : -30}" width="28" height="28" rx="8" fill="${startDark ? "#ff7b7b" : "#7be495"}"/>
    </g>`).join("");
}

function checklistPanel(keys, t) {
  return `
    <g class="act-panel" transform="translate(0 170)">
      <rect x="560" y="150" width="480" height="330" rx="30" fill="#fff7ea" stroke="#e7c79b" stroke-width="8"/>
      <rect x="740" y="130" width="120" height="40" rx="12" fill="#8b93a8"/>
      ${keys.map((key, i) => `
        <g transform="translate(610 ${230 + i * 85})">
          <rect x="0" y="-26" width="52" height="52" rx="12" fill="#fff" stroke="#2a2140" stroke-width="5"/>
          <path class="act-tick" data-tick="${i}" d="M10 0l12 12 22-24" fill="none" stroke="#3fae6a" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>
          <text data-i18n="${key}" x="76" y="10" font-family="Fredoka, sans-serif" font-size="34" font-weight="600" fill="#2a2140">${escSvg(t(key))}</text>
        </g>`).join("")}
    </g>`;
}

function microscope() {
  return `
    <rect width="1600" height="900" fill="#050816" opacity=".7"/>
    <g class="act-panel">
      <circle cx="800" cy="450" r="285" fill="#1b2350"/>
      <circle cx="800" cy="450" r="260" fill="#6b3a26"/>
      <path d="M560 420q120-90 240-30t240-40v210q-120 60-240 20t-240 40Z" fill="#8a4a32" opacity=".8"/>
      ${[[680, 380], [890, 520], [960, 360], [720, 560]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="#5e2416" opacity=".6"/>`).join("")}
      <circle cx="800" cy="450" r="260" fill="none" stroke="#c9d1ff" stroke-width="18" opacity=".7"/>
    </g>`;
}

const crystalAt = (x, y, i) => `
  <g transform="translate(${x} ${y})"><g class="act-sprite act-hidden" data-sprite="${i}" opacity="0">
    <path d="M-14 16l14-48 14 48Z" fill="#7ef0ff" stroke="#e8fdff" stroke-width="3"/><path d="M10 18l10-30 10 30Z" fill="#c79bff"/>
  </g></g>`;

const flagAt = (x, y, i) => `
  <g transform="translate(${x} ${y})"><g class="act-sprite act-hidden" data-sprite="${i}" opacity="0">
    <path d="M0 0v-70" stroke="#efe9dd" stroke-width="6"/><path d="M0-70l46 14-46 14Z" fill="#ffd65c"/>
  </g></g>`;

const basket = () => `
  <g transform="translate(1240 770)"><path d="M-70-20h140l-20 70h-100Z" fill="#c98a4a" stroke="#7a4c27" stroke-width="6"/>
    <path d="M-60 0h120M-50 22h100" stroke="#7a4c27" stroke-width="4"/></g>`;

/* ---------- small effects ---------- */

function burst(layer, x, y, color = "#ffd65c") {
  const g = document.createElementNS(NS, "g");
  g.setAttribute("transform", `translate(${x} ${y})`);
  g.innerHTML = Array.from({ length: 10 }, (_, i) => {
    const angle = (i / 10) * Math.PI * 2;
    return `<path d="M0-9l3 6 6 3-6 3-3 6-3-6-6-3 6-3Z" fill="${color}" data-dx="${Math.cos(angle) * 90}" data-dy="${Math.sin(angle) * 90}"/>`;
  }).join("");
  layer.append(g);
  if (reduced()) { g.remove(); return; }
  g.querySelectorAll("path").forEach(star => {
    anim(star, { translateX: [0, Number(star.dataset.dx)], translateY: [0, Number(star.dataset.dy)], scale: [1.4, 0.2], opacity: [1, 0], duration: 750, ease: "outCubic" });
  });
  setTimeout(() => g.remove(), 800);
}

function travel(layer, from, to, { color = "#ffd65c", duration = 1500 } = {}) {
  const dot = document.createElementNS(NS, "g");
  dot.innerHTML = `<circle r="20" fill="${color}"/><path d="M-10-5h20v12h-20Z M-10-5l10 7 10-7" fill="none" stroke="#2a1c00" stroke-width="3"/>`;
  dot.setAttribute("transform", `translate(${from[0]} ${from[1]})`);
  layer.append(dot);
  return new Promise(resolve => {
    if (reduced()) { dot.remove(); resolve(); return; }
    const state = { t: 0 };
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      dot.remove();
      resolve();
    };
    setTimeout(finish, duration + 400); // animations pause in hidden tabs
    animate(state, {
      t: [0, 1], duration, ease: "inOutSine",
      onUpdate: () => dot.setAttribute("transform", `translate(${from[0] + (to[0] - from[0]) * state.t} ${from[1] + (to[1] - from[1]) * state.t - Math.sin(state.t * Math.PI) * 60})`),
      onComplete: finish,
    });
  });
}

const sprite = (svg, i) => svg.querySelector(`[data-sprite="${i}"]`);

/* ---------- activities, one per choice ---------- */

const valveActivity = {
  backdrop: "power-shortage",
  task: "act.valve",
  sprites: tankFill,
  targets: [{ x: 1115, y: 612, r: 70, repeat: 3 }],
  onTap(svg, _i, step) {
    anim(svg.querySelector(".act-valve"), { rotate: `+=${120}`, duration: 500, ease: "outBack(2)" });
    const tank = svg.querySelector(".act-tank");
    const h = Math.round((170 * (step + 1)) / 3);
    tank.setAttribute("y", String(560 - h));
    tank.setAttribute("height", String(h));
    burst(svg, 1115, 560 - h, "#7ef0ff");
  },
};

const checklist = (task, labelKeys) => ({
  backdrop: "message-from-earth",
  task,
  sprites: (t) => checklistPanel(labelKeys, t),
  targets: labelKeys.map((_, i) => ({ x: 636, y: 400 + i * 85, r: 48 })),
  order: "sequence",
  onTap(svg, i) {
    const tick = svg.querySelector(`[data-tick="${i}"]`);
    tick.setAttribute("opacity", "1");
    anim(tick, { scale: [0.2, 1], duration: 400, ease: "outBack(3)" });
    burst(svg, 636, 400 + i * 85, "#7be495");
  },
});

export const ACTIVITIES = {
  "1A": {
    backdrop: "welcome-to-mars",
    task: "act.1A",
    sprites: panelDust,
    targets: [0, 1, 2, 3].map(i => ({ x: 1177 + i * 92, y: 663 + i * 6, r: 44 })),
    onTap(svg, i) {
      const dust = sprite(svg, i);
      anim(dust, { opacity: [0.92, 0], duration: 600, ease: "outQuad" });
      anim(svg.querySelector(`[data-sprite-extra="${i}"]`), { opacity: [1, 0], translateY: [0, 40], duration: 600 });
      if (reduced()) { dust.setAttribute("opacity", "0"); svg.querySelector(`[data-sprite-extra="${i}"]`)?.setAttribute("opacity", "0"); }
      burst(svg, 1177 + i * 92, 663 + i * 6);
    },
  },
  "1B": {
    backdrop: "welcome-to-mars",
    task: "act.1B",
    sprites: () => crate(300, 730, 0) + crate(640, 745, 1) + crate(800, 715, 2),
    targets: [{ x: 300, y: 730, r: 62 }, { x: 640, y: 745, r: 62 }, { x: 800, y: 715, r: 62 }],
    focusExtra: [470],
    onTap(svg, i, _step, target) {
      const box = sprite(svg, i);
      anim(box, { translateX: [0, 470 - target.x], translateY: [0, 690 - target.y], scale: [1, 0.3], opacity: [1, 0], duration: 800, ease: "inOutQuad" });
      if (reduced()) box.setAttribute("opacity", "0");
      setTimeout(() => burst(svg, 470, 690, "#7be495"), reduced() ? 0 : 780);
    },
  },
  "2A": valveActivity,
  "2B": {
    backdrop: "welcome-to-mars",
    task: "act.2B",
    sprites: () => rock(560, 715, 0, 0.95) + rock(720, 740, 1, 0.85) + rock(890, 718, 2, 1) + rock(1050, 738, 3, 0.9),
    targets: [{ x: 560, y: 715, r: 66 }, { x: 720, y: 740, r: 62 }, { x: 890, y: 718, r: 66 }, { x: 1050, y: 738, r: 62 }],
    order: "find",
    onTap(svg, i, _step, _target, ctx) {
      const rockEl = sprite(svg, i);
      if (i === ctx.special) {
        const crystal = rockEl.querySelector(".act-crystal");
        crystal.setAttribute("opacity", "1");
        anim(crystal, { scale: [0, 1], duration: 600, ease: "outBack(3)" });
        burst(svg, Number(rockEl.dataset.x), 725, "#7ef0ff");
        return "found";
      }
      anim(rockEl.querySelector(".act-rock"), { translateX: [0, -8, 8, -4, 0], duration: 450 });
      rockEl.querySelector(".act-rock").setAttribute("fill", "#5a3a30");
      return "miss";
    },
  },
  "2C": {
    backdrop: "power-shortage",
    task: "act.2C",
    sprites: graphPanel,
    targets: GRAPH_TARGETS.map(([x, y]) => ({ x, y, r: 40 })),
    order: "sequence",
    onTap(svg, i) {
      const line = svg.querySelector(".act-line");
      line.setAttribute("points", GRAPH_POINTS.slice(0, i + 1).map(p => p.join(",")).join(" "));
      const dot = document.createElementNS(NS, "circle");
      dot.setAttribute("cx", GRAPH_POINTS[i][0]); dot.setAttribute("cy", GRAPH_POINTS[i][1]); dot.setAttribute("r", "12"); dot.setAttribute("fill", "#ffd65c");
      svg.querySelector(".act-panel").append(dot);
      anim(dot, { scale: [0, 1], duration: 400, ease: "outBack(3)" });
      burst(svg, GRAPH_TARGETS[i][0], GRAPH_TARGETS[i][1]);
    },
  },
  "3A": {
    backdrop: "greenhouse-problem",
    task: "act.3A",
    sprites: () => lightMasks(true),
    targets: [{ x: 360, y: 336, r: 58 }, { x: 360, y: 546, r: 58 }],
    onTap(svg, i) { switchRow(svg, i, true); },
  },
  "3B": {
    backdrop: "greenhouse-problem",
    task: "act.3B",
    sprites: () => lightMasks(true) + [0, 1, 2].map(i => `<g transform="translate(${710 + i * 80} 560)"><g class="act-hidden act-drop" data-drop="${i}" opacity="0"><path d="M0-30q-16 22 0 30q16-8 0-30Z" fill="#7ef0ff"/></g></g>`).join(""),
    targets: [{ x: 360, y: 546, r: 58 }, { x: 710, y: 640, r: 48 }, { x: 790, y: 640, r: 48 }, { x: 870, y: 640, r: 48 }],
    order: "sequence",
    onTap(svg, i) {
      if (i === 0) { switchRow(svg, 1, true); return; }
      const drop = svg.querySelector(`[data-drop="${i - 1}"]`);
      drop.setAttribute("opacity", "1");
      anim(drop, { translateY: [-40, 60], opacity: [1, 0], duration: 700, ease: "inQuad" });
      burst(svg, 630 + i * 80, 640, "#7be495");
    },
  },
  "3C": {
    backdrop: "greenhouse-problem",
    task: "act.3C",
    sprites: () => lightMasks(false),
    targets: [{ x: 360, y: 336, r: 58 }, { x: 360, y: 546, r: 58 }],
    onTap(svg, i) { switchRow(svg, i, false); },
  },
  "4A": {
    backdrop: "message-from-earth",
    task: "act.4A",
    sprites: (t) => `
      <g transform="translate(800 680)"><rect x="-110" y="-44" width="220" height="88" rx="44" fill="#e2703a" stroke="#ffd65c" stroke-width="6"/>
      <text y="13" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="38" font-weight="700" fill="#fff">${t("act.send")}</text></g>
      <g class="act-clock act-hidden" opacity="0" transform="translate(800 450)"><circle r="60" fill="#1b2350" stroke="#ffd65c" stroke-width="6"/>
        <path class="act-hand" d="M0 0v-42" stroke="#ffd65c" stroke-width="7" stroke-linecap="round"/><path d="M0 0h28" stroke="#fff" stroke-width="6" stroke-linecap="round"/></g>`,
    targets: [{ x: 800, y: 680, r: 95 }],
    async onTap(svg) {
      await travel(svg, [550, 320], [1050, 320], { duration: 1600 });
      const clock = svg.querySelector(".act-clock");
      clock.setAttribute("opacity", "1");
      anim(svg.querySelector(".act-hand"), { rotate: [0, 720], duration: 1400, ease: "inOutSine" });
      await sleep(1400);
      clock.setAttribute("opacity", "0");
      await travel(svg, [1050, 320], [550, 320], { color: "#7be495", duration: 1600 });
      burst(svg, 550, 320, "#7be495");
    },
  },
  "4B": checklist("act.4B", ["act.check.wheels", "act.check.camera", "act.check.dust"]),
  "4C": valveActivity,
  // Sol 5: who runs into the storm shelter depends on the choice.
  // 5A: everyone (both astronauts and the robot) goes in; the player sends each one.
  "5A": {
    backdrop: "solar-radiation-alert",
    task: "act.5A",
    sprites: () => shelterDoor() + astronautSprite(900, 730, 0) + astronautSprite(1030, 745, 1) + roverSprite(1220, 750, 2),
    targets: [{ x: 900, y: 720, r: 62 }, { x: 1030, y: 735, r: 62 }, { x: 1220, y: 725, r: 75 }],
    focusExtra: [620],
    async onTap(svg, i, step, target) {
      await intoShelter(svg, sprite(svg, i), [target.x, target.y], { duration: i === 2 ? 1300 : 1000 });
      if (step === 2) closeDoor(svg);
    },
  },
  // 5B: the crew runs inside by itself; the robot stays out and the player guides its scans.
  "5B": {
    backdrop: "solar-radiation-alert",
    task: "act.5B",
    sprites: () => shelterDoor() + astronautSprite(900, 730, 10) + astronautSprite(1000, 745, 11) + roverSprite(1250, 750, 0, false)
      + [[1120, 745], [960, 755], [1180, 640]].map(([x, y], i) => `<g transform="translate(${x} ${y})"><g class="act-sprite" data-sprite="${i}"><circle class="act-scan" r="34" fill="none" stroke="#58d3ff" stroke-width="5" stroke-dasharray="10 8"/></g></g>`).join(""),
    targets: [{ x: 1120, y: 745, r: 58 }, { x: 960, y: 755, r: 58 }, { x: 1180, y: 640, r: 58 }],
    order: "sequence",
    focusExtra: [620],
    async prelude(svg) {
      await Promise.all([
        intoShelter(svg, sprite(svg, 10), [900, 730], { duration: 1100 }),
        intoShelter(svg, sprite(svg, 11), [1000, 745], { duration: 1100, delay: 250 }),
      ]);
      closeDoor(svg);
    },
    async onTap(svg, i, _step, target) {
      const robot = svg.querySelector(".act-rover");
      if (robot && !reduced()) {
        anim(robot, { translateX: target.x - 1250, translateY: target.y - 760, duration: 700, ease: "inOutQuad" });
        await sleep(720);
      }
      const ring = sprite(svg, i).querySelector(".act-scan");
      ring.setAttribute("stroke", "#7be495");
      ring.setAttribute("stroke-dasharray", "0");
      anim(ring, { scale: [0.4, 1.4, 1], duration: 600, ease: "outBack(2)" });
      burst(svg, target.x, target.y, "#58d3ff");
    },
  },
  // 5C: the robot and one astronaut take cover; the other astronaut stays out in the storm,
  // and only runs inside once the measurements are finished.
  "5C": {
    backdrop: "solar-radiation-alert",
    task: "act.5C",
    sprites: () => shelterDoor() + roverSprite(1250, 750, 10) + astronautSprite(780, 735, 11) + astronautSprite(1150, 725, 12)
      + [[860, 750], [1030, 765], [1250, 690]].map(([x, y], i) => `<g transform="translate(${x} ${y})"><g class="act-sprite" data-sprite="${i}"><path d="M0 30v-60" stroke="#efe9dd" stroke-width="6"/><circle cy="-36" r="14" fill="#ffb55a"/></g></g>`).join("")
      + `<rect class="act-flash" width="1600" height="900" fill="#ff4d4d" opacity="0"/>`,
    targets: [{ x: 860, y: 740, r: 60 }, { x: 1030, y: 755, r: 60 }, { x: 1250, y: 680, r: 60 }],
    order: "sequence",
    focusExtra: [620],
    async prelude(svg) {
      await Promise.all([
        intoShelter(svg, sprite(svg, 10), [1250, 750], { duration: 1300 }),
        intoShelter(svg, sprite(svg, 11), [780, 735], { duration: 900, delay: 200 }),
      ]);
    },
    onTap(svg, i, _step, target) {
      const worker = sprite(svg, 12);
      if (worker && !reduced()) anim(worker, { translateX: target.x - 1150 - 50, translateY: target.y - 725, duration: 500, ease: "inOutQuad" });
      anim(svg.querySelector(".act-flash"), { opacity: [0.35, 0], duration: 600, ease: "outQuad" });
      sprite(svg, i).querySelector("circle").setAttribute("fill", "#7be495");
      burst(svg, target.x, target.y - 36, "#ffb55a");
    },
    async outro(svg) {
      const worker = sprite(svg, 12);
      if (!worker) return;
      if (!reduced()) {
        anim(worker, { opacity: [1, 0], scale: [1, 0.55], duration: 900, ease: "inQuad" });
        await sleep(950);
      }
      worker.setAttribute("opacity", "0");
      closeDoor(svg);
      burst(svg, SHELTER[0], SHELTER[1] - 10, "#ffb55a");
    },
  },
  "6A": {
    backdrop: "power-shortage",
    task: "act.6A",
    sprites: () => microscope() + crystalAt(690, 400, 0) + crystalAt(900, 360, 1) + crystalAt(840, 560, 2),
    targets: [{ x: 690, y: 400, r: 60 }, { x: 900, y: 360, r: 60 }, { x: 840, y: 560, r: 60 }],
    onTap(svg, i, _step, target) {
      const crystal = sprite(svg, i);
      crystal.setAttribute("opacity", "1");
      anim(crystal, { scale: [0, 1.2, 1], duration: 600, ease: "outBack(3)" });
      burst(svg, target.x, target.y, "#7ef0ff");
    },
  },
  "6B": {
    backdrop: "final-mission",
    task: "act.6B",
    sprites: () => flagAt(806, 770, 0) + flagAt(812, 690, 1) + flagAt(810, 610, 2),
    targets: [{ x: 806, y: 750, r: 58 }, { x: 812, y: 670, r: 58 }, { x: 810, y: 590, r: 58 }],
    order: "sequence",
    onTap(svg, i, _step, target) {
      const flag = sprite(svg, i);
      flag.setAttribute("opacity", "1");
      anim(flag, { translateY: [-40, 0], duration: 500, ease: "outBounce" });
      burst(svg, target.x, target.y, "#ffd65c");
    },
  },
  "6C": {
    backdrop: "greenhouse-problem",
    task: "act.6C",
    sprites: () => basket() + [600, 740, 880, 1020].map((x, i) => plantSprite(x, 470, i)).join(""),
    targets: [600, 740, 880, 1020].map(x => ({ x, y: 440, r: 65 })),
    focusExtra: [1240],
    onTap(svg, i, _step, target) {
      const plant = sprite(svg, i);
      anim(plant, { translateX: [0, 1240 - target.x], translateY: [0, 300], scale: [1, 0.5], opacity: [1, 1, 0], duration: 900, ease: "inOutQuad" });
      if (reduced()) plant.setAttribute("opacity", "0");
      setTimeout(() => burst(svg, 1240, 760, "#7be495"), reduced() ? 0 : 880);
    },
  },
  "6C-report": checklist("act.6Creport", ["act.check.photos", "act.check.notes", "act.check.water"]),
};

// Sols 7–10 reuse the hands-on mechanics with new jobs.
Object.assign(ACTIVITIES, {
  "7A": checklist("act.7A", ["act.note.one", "act.note.two", "act.note.three"]),
  "7B": { ...ACTIVITIES["6B"], task: "act.7B" },
  "7C": { ...valveActivity, task: "act.7C" },
  "8A": { ...ACTIVITIES["3A"], task: "act.8A" },
  "8B": checklist("act.8B", ["act.pic.panels", "act.pic.shelter", "act.pic.plants"]),
  "8C": checklist("act.8C", ["act.tape.insert", "act.tape.play", "act.tape.save"]),
  "9A": checklist("act.9A", ["act.ev.pattern", "act.ev.relay", "act.ev.questions"]),
  "9B": checklist("act.9B", ["act.rec.one", "act.rec.two", "act.rec.duti"]),
  "9C": { ...valveActivity, task: "act.9C" },
  "10A": { ...ACTIVITIES["4A"], task: "act.10A" },
  "10B": { ...ACTIVITIES["1B"], task: "act.10B" },
  "10C": checklist("act.10C", ["act.msg.hello", "act.msg.tip", "act.msg.luck"]),
});

function switchRow(svg, row, turnOn) {
  const mask = sprite(svg, row);
  anim(mask, { opacity: turnOn ? [0.72, 0] : [0, 0.72], duration: 700, ease: "outQuad" });
  if (reduced()) mask.setAttribute("opacity", turnOn ? "0" : "0.72");
  const knob = svg.querySelector(`[data-switch="${row}"] .act-switch-knob`);
  knob.setAttribute("y", turnOn ? "-30" : "2");
  knob.setAttribute("fill", turnOn ? "#7be495" : "#ff7b7b");
  burst(svg, 360, 336 + row * 210, turnOn ? "#ff8ad8" : "#8b93a8");
}

/** Pick the activity for a resolved choice (6C changes when the greenhouse was shut down). */
export function activityFor(choiceId, flags) {
  if (choiceId === "6C" && flags.greenhouseMode === "off") return { id: "6C-report", def: ACTIVITIES["6C-report"] };
  return { id: choiceId, def: ACTIVITIES[choiceId] };
}

/**
 * Run an activity on top of the current location.
 * host: element that receives the overlay; t: interface translator; onProgress(done, total).
 * Resolves when the player has finished the task.
 */
export function runActivity(host, def, { t, onProgress, ariaTarget, onSay }) {
  if (def.custom) {
    // Thinking tasks build their own targets and decide when they are solved.
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "fx fx--activity");
    svg.setAttribute("viewBox", "0 0 1600 900");
    svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
    svg.innerHTML = `<g class="act-sprites"></g><g class="act-targets"></g>`;
    host.append(svg);
    const api = {
      t,
      progress: (n, total) => onProgress?.(n, total),
      say: key => onSay?.(key, false),
      miss: key => onSay?.(key, true),
    };
    return Promise.resolve(def.custom(svg, api)).then(() => sleep(800));
  }
  const ctx = { special: Math.floor(Math.random() * def.targets.length) };
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("class", "fx fx--activity");
  svg.setAttribute("viewBox", "0 0 1600 900");
  svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
  svg.innerHTML = `<g class="act-sprites">${def.sprites(t)}</g><g class="act-targets"></g>`;
  host.append(svg);
  const targetsLayer = svg.querySelector(".act-targets");
  const order = def.order ?? "any";
  const repeatTotal = def.targets[0].repeat ?? 1;
  const total = order === "find" ? 1 : repeatTotal > 1 ? repeatTotal : def.targets.length;
  let done = 0;
  let busy = false;

  return new Promise(resolve => {
    const makeTarget = (target, index) => {
      const g = document.createElementNS(NS, "g");
      g.setAttribute("class", "act-target");
      g.setAttribute("transform", `translate(${target.x} ${target.y})`);
      g.setAttribute("tabindex", "0");
      g.setAttribute("role", "button");
      g.setAttribute("aria-label", ariaTarget(index + 1, def.targets.length));
      g.dataset.targetIndex = index + 1;
      g.dataset.targetCount = def.targets.length;
      g.innerHTML = `<circle class="act-hit" r="${target.r}" fill="transparent"/>
        <circle class="act-ring" r="${target.r * 0.72}" fill="none" stroke="#ffd65c" stroke-width="6"/>
        <circle class="act-ring act-ring--2" r="${target.r * 0.72}" fill="none" stroke="#fff3c4" stroke-width="3"/>`;
      const fire = async () => {
        if (busy || g.classList.contains("is-done")) return;
        busy = true;
        svg.querySelector(".act-hand-hint")?.remove();
        const result = await def.onTap(svg, index, done, target, ctx);
        if (order === "find" && result === "miss") {
          g.classList.add("is-done");
          g.remove();
          busy = false;
          return;
        }
        done += 1;
        onProgress?.(done, total);
        const finished = done >= total;
        if (repeatTotal > 1 && !finished) {
          busy = false;
          return;
        }
        g.classList.add("is-done");
        g.remove();
        if (order === "sequence" && !finished) showTarget(index + 1);
        busy = false;
        if (finished) {
          if (def.outro) await def.outro(svg);
          await sleep(900);
          resolve();
        }
      };
      g.addEventListener("click", event => { event.stopPropagation(); fire(); });
      g.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.stopPropagation(); fire(); }
      });
      targetsLayer.append(g);
      if (!reduced()) animate(g.querySelectorAll(".act-ring"), { scale: [0, 1], duration: 450, ease: "outBack(2)" });
      return g;
    };
    const showTarget = index => {
      if (index < def.targets.length) makeTarget(def.targets[index], index);
    };
    const start = () => {
    if (order === "sequence") showTarget(0);
    else def.targets.forEach(makeTarget);

    // A pointing hand on the first target shows young players what to do.
    const first = def.targets[0];
    const hand = document.createElementNS(NS, "g");
    hand.setAttribute("class", "act-hand-hint");
    hand.setAttribute("transform", `translate(${first.x + 30} ${first.y + 30})`);
    hand.innerHTML = `<g class="act-hand-bob"><path d="M0 0l-6-48a10 10 0 0 1 20-2l4 30 6-2a10 10 0 0 1 12 6l2 6a10 10 0 0 1 12 6l2 8c8 0 14 6 14 14l-4 34H14Z" fill="#fff7ea" stroke="#2a2140" stroke-width="5" stroke-linejoin="round"/></g>`;
    svg.append(hand);
    svg.querySelector(".act-target")?.focus({ preventScroll: true });
    };
    // Some jobs open with a short scene (for example the crew running into the shelter).
    if (def.prelude) Promise.resolve(def.prelude(svg)).catch(() => {}).then(start);
    else start();
  });
}

/* ---------- thinking tasks: share, compare, deduce (1.10.0) ---------- */

const svgEl = (tag, attrs = {}, html = "") => {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  if (html) el.innerHTML = html;
  return el;
};

/** A tappable spot used by the thinking tasks. `correct` lets the Hint button point at it. */
function tapSpot(layer, { x, y, r, label: name, labelKey, labelValues = {}, correct = false }, onTap) {
  const g = svgEl("g", { class: `act-target ${correct ? "is-correct" : ""}`, transform: `translate(${x} ${y})`, tabindex: 0, role: "button", "aria-label": name },
    `<circle class="act-hit" r="${r}" fill="transparent"/><circle class="act-ring" r="${r * 0.82}" fill="none" stroke="#ffd65c" stroke-width="5" stroke-dasharray="14 10"/>`);
  const fire = event => { event.stopPropagation(); onTap(g); };
  if (labelKey) {
    g.dataset.i18nAria = labelKey;
    g.dataset.i18nValues = JSON.stringify(labelValues);
  }
  g.addEventListener("click", fire);
  g.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); fire(event); } });
  layer.append(g);
  return g;
}

const panelBox = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="30" fill="#071028" opacity=".93" stroke="#58d3ff" stroke-width="6"/>`;
const escSvg = text => String(text).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
const label = (x, y, text, size = 30, fill = "#fff7ea") => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="${size}" font-weight="700" fill="${fill}">${escSvg(text)}</text>`;
const translatedLabel = (x, y, api, key, size = 30, fill = "#fff7ea", wrapWidth = 0) =>
  label(x, y, api.t(key), size, fill).replace("<text ", `<text data-i18n="${key}"${wrapWidth ? ` data-wrap-width="${wrapWidth}"` : ""} `);

/** Translate existing SVG nodes without rebuilding targets or resetting a task's local state. */
export function refreshActivityLanguage(host, t, ariaTarget) {
  for (const node of host.querySelectorAll("[data-i18n], [data-i18n-aria], [data-target-index]")) {
    const values = JSON.parse(node.dataset.i18nValues ?? "{}");
    if (node.dataset.i18n) node.textContent = t(node.dataset.i18n, values);
    if (node.dataset.i18nAria) node.setAttribute("aria-label", t(node.dataset.i18nAria, values));
    if (node.dataset.targetIndex) node.setAttribute("aria-label", ariaTarget(Number(node.dataset.targetIndex), Number(node.dataset.targetCount)));
  }
  // The source/date/unit note is readable inside its panel in both languages.
  for (const node of host.querySelectorAll("text[data-wrap-width]")) {
    const words = node.textContent.split(/\s+/);
    const lines = [];
    let line = "";
    for (const word of words) {
      node.textContent = line ? `${line} ${word}` : word;
      if (line && node.getComputedTextLength() > Number(node.dataset.wrapWidth)) {
        lines.push(line);
        line = word;
      } else line = node.textContent;
    }
    lines.push(line);
    node.replaceChildren(...lines.map((text, index) => {
      const span = svgEl("tspan", { x: node.getAttribute("x"), dy: index ? "1.2em" : 0 });
      span.textContent = index ? ` ${text}` : text;
      return span;
    }));
  }
}

/** 2A: share three power cubes between the air machine, the heater and the lamp. */
async function shareEnergy(svg, api) {
  const devices = [
    { id: "air", x: 620, icon: `<rect x="-40" y="-60" width="80" height="110" rx="18" fill="#dfe7f2"/><rect x="-26" y="-44" width="52" height="56" rx="10" fill="#7ef0ff"/><text y="38" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="26" font-weight="700" fill="#27335f">O2</text>` },
    { id: "heat", x: 800, icon: `<rect x="-48" y="-50" width="96" height="96" rx="16" fill="#ffb55a"/><path d="M-30-24h60M-30 0h60M-30 24h60" stroke="#c9693f" stroke-width="8" stroke-linecap="round"/>` },
    { id: "lamp", x: 980, icon: `<path d="M-30 30h60l-12-60h-36Z" fill="#ffd65c"/><rect x="-6" y="30" width="12" height="24" fill="#8b93a8"/><circle cy="-40" r="14" fill="#fff6c9"/>` },
  ];
  const counts = { air: 0, heat: 0, lamp: 0 };
  let left = 3;
  const art = svgEl("g", { class: "act-panel" }, panelBox(480, 330, 640, 420)
    + devices.map(d => `<g transform="translate(${d.x} 520)">${d.icon}</g>${translatedLabel(d.x, 640, api, `act.share.${d.id}`, 26)}<g class="act-cubes" data-cubes="${d.id}"></g>`).join("")
    + `<text class="act-left" data-i18n="act.share.left" x="800" y="384" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="28" font-weight="700" fill="#ffd65c"></text>`);
  svg.querySelector(".act-sprites").append(art);
  const drawCubes = () => {
    for (const d of devices) {
      art.querySelector(`[data-cubes="${d.id}"]`).innerHTML = Array.from({ length: counts[d.id] }, (_, i) => `<rect x="${d.x - 50 + i * 36}" y="662" width="28" height="28" rx="6" fill="#ffd65c" stroke="#6b4300" stroke-width="3"/>`).join("");
    }
    art.querySelector(".act-left").textContent = api.t("act.share.left", { n: left });
    art.querySelector(".act-left").dataset.i18nValues = JSON.stringify({ n: left });
  };
  drawCubes();
  const layer = svg.querySelector(".act-targets");
  await new Promise(resolve => {
    let checking = false;
    for (const d of devices) {
      tapSpot(layer, { x: d.x, y: 540, r: 85, label: api.t(`act.share.${d.id}`), labelKey: `act.share.${d.id}`, correct: d.id === "air" }, async () => {
        if (left <= 0 || checking) return;
        counts[d.id] += 1;
        left -= 1;
        burst(svg, d.x, 520, "#ffd65c");
        drawCubes();
        // Progress counts placed cubes, but "finished" is reported only after a correct share.
        if (left > 0) { api.progress(3 - left, 3); return; }
        const wrong = counts.lamp > 0 ? "lamp" : counts.air < 2 ? "air" : counts.heat < 1 ? "heat" : null;
        if (!wrong) { api.progress(3, 3); resolve(); return; }
        checking = true;
        api.miss(`act.share.wrong.${wrong}`);
        await sleep(1600);
        counts.air = 0; counts.heat = 0; counts.lamp = 0; left = 3;
        drawCubes();
        api.progress(0, 3);
        checking = false;
      });
    }
  });
}

/** 2C: compare two real MEDA readings, then work out the difference. */
async function compareReadings(svg, api) {
  const art = svgEl("g", { class: "act-panel" }, panelBox(470, 300, 660, 470)
    + [{ x: 680, t: -3, name: "A" }, { x: 920, t: -77, name: "B" }].map(r => {
      const h = Math.round(((r.t + 80) / 80) * 250);
      const color = r.t > -40 ? "#ffb55a" : "#58d3ff";
      return `<rect x="${r.x - 26}" y="360" width="52" height="270" rx="26" fill="#1b2350" stroke="#9fe2ff" stroke-width="4"/>
        <rect x="${r.x - 16}" y="${620 - h}" width="32" height="${h}" rx="16" fill="${color}"/>
        <circle cx="${r.x}" cy="640" r="34" fill="${color}" stroke="#9fe2ff" stroke-width="4"/>
        ${label(r.x, 716, `${r.name}: ${r.t === -3 ? "−3" : "−77"} °C`, 32)}`;
    }).join(""));
  art.insertAdjacentHTML("beforeend", translatedLabel(800, 733, api, "act.cmp.source", 21, "#9fe2ff", 600));
  svg.querySelector(".act-sprites").append(art);
  const layer = svg.querySelector(".act-targets");
  api.say("act.cmp.q1");
  await new Promise(resolve => {
    tapSpot(layer, { x: 680, y: 520, r: 110, label: "A" }, () => api.miss("act.cmp.wrong1"));
    tapSpot(layer, { x: 920, y: 520, r: 110, label: "B", correct: true }, () => { burst(svg, 920, 500, "#58d3ff"); resolve(); });
  });
  layer.innerHTML = "";
  api.progress(1, 2);
  api.say("act.cmp.q2");
  // Second step: keep both readings as a small reminder and show the answers inside the panel,
  // well below the task banner, so every label stays visible on desktop and phones.
  art.innerHTML = panelBox(470, 300, 660, 470)
    + label(800, 380, "A: −3 °C", 34, "#ffb55a") + label(800, 430, "B: −77 °C", 34, "#58d3ff")
    + label(800, 488, "?", 40, "#ffd65c")
    + translatedLabel(800, 733, api, "act.cmp.source", 21, "#9fe2ff", 600);
  const options = [7, 74, 30];
  art.append(svgEl("g", {}, options.map((n, i) => `<g transform="translate(${640 + i * 160} 620)"><circle r="62" fill="#ffd65c" stroke="#6b4300" stroke-width="5"/>${label(0, 13, `${n}°`, 40, "#2a1c00")}</g>`).join("")));
  await new Promise(resolve => {
    options.forEach((n, i) => tapSpot(layer, { x: 640 + i * 160, y: 620, r: 68, label: `${n}°`, correct: n === 74 }, () => {
      if (n === 74) { burst(svg, 640 + i * 160, 620, "#ffd65c"); resolve(); } else api.miss("act.cmp.wrong2");
    }));
  });
  api.progress(2, 2);
}

/** 2B: use the scanner's two clues to find the right rock. */
async function deduceRock(svg, api) {
  const looks = ["stripes", "sparkle", "both", "spots"].sort(() => Math.random() - 0.5);
  const spots = [[560, 715, 0.95], [720, 740, 0.85], [890, 718, 1], [1050, 738, 0.9]];
  const rockArt = look => `
    <path d="M-58 30l-6-30 22-30 36-12 34 10 26 26-4 36Z" fill="${look === "spots" ? "#7a4a3a" : "#8a4a32"}" stroke="#5e2416" stroke-width="5"/>
    ${look === "stripes" || look === "both" ? `<path d="M-50 4h96M-46 18h90M-30-10h66" stroke="#d9a07a" stroke-width="6" stroke-linecap="round"/>` : ""}
    ${look === "spots" ? [[-30, 4], [0, 14], [22, -6], [-10, -12]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#d9a07a"/>`).join("") : ""}
    ${look === "sparkle" || look === "both" ? `<path d="M24-30l5 12 12 5-12 5-5 12-5-12-12-5 12-5Z" fill="#7ef0ff" stroke="#e8fdff" stroke-width="2"/>` : ""}`;
  const art = svgEl("g", {}, spots.map(([x, y, s], i) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="act-rockbox" data-rock="${i}"><ellipse cx="0" cy="34" rx="62" ry="12" fill="#000" opacity=".25"/>${rockArt(looks[i])}</g></g>`).join(""));
  svg.querySelector(".act-sprites").append(art);
  const layer = svg.querySelector(".act-targets");
  await new Promise(resolve => {
    spots.forEach(([x, y], i) => tapSpot(layer, { x, y: y - 6, r: 64, label: api.t("act.rock", { n: i + 1 }), labelKey: "act.rock", labelValues: { n: i + 1 }, correct: looks[i] === "both" }, () => {
      const box = art.querySelector(`[data-rock="${i}"]`);
      if (looks[i] === "both") { anim(box, { scale: [1, 1.2, 1], duration: 600, ease: "outBack(3)" }); burst(svg, x, y - 20, "#7ef0ff"); resolve(); return; }
      anim(box, { translateX: [0, -8, 8, -4, 0], duration: 450 });
      api.miss(`act.rock.${looks[i]}`);
    }));
  });
  api.progress(1, 1);
}

Object.assign(ACTIVITIES, {
  "2A": { backdrop: "power-shortage", task: "act.2A", hint: "act.2A.hint", total: 3, custom: shareEnergy },
  "2B": { backdrop: "welcome-to-mars", task: "act.2B", hint: "act.2B.hint", total: 1, custom: deduceRock },
  "2C": { backdrop: "power-shortage", task: "act.2C", hint: "act.2C.hint", total: 2, custom: compareReadings },
});

/* ---------- more thinking tasks (1.11.0): order a pattern, sort the clues ---------- */

/** 7A: the saved pattern is shown as dots; tap the note cards in the same order. */
async function orderNotes(svg, api) {
  const notes = [
    { key: "act.note.one", dots: 1 },
    { key: "act.note.two", dots: 2 },
    { key: "act.note.three", dots: 0 },
  ];
  const cards = [...notes].sort(() => Math.random() - 0.5);
  const art = svgEl("g", { class: "act-panel" }, panelBox(470, 300, 660, 470)
    + notes.map((n, i) => `<g transform="translate(${660 + i * 140} 380)"><rect x="-52" y="-34" width="104" height="68" rx="16" fill="#1b2350" stroke="#9fe2ff" stroke-width="4"/>
      ${n.dots ? Array.from({ length: n.dots }, (_, k) => `<circle cx="${(k - (n.dots - 1) / 2) * 30}" cy="0" r="11" fill="#ffd65c"/>`).join("") : `<path d="M-22 0h44" stroke="#9fe2ff" stroke-width="6" stroke-linecap="round" stroke-dasharray="6 8"/>`}
      ${label(-38, -40, String(i + 1), 22, "#9fe2ff")}</g>`).join("")
    + cards.map((n, i) => `<g transform="translate(${640 + i * 160} 610)"><rect x="-70" y="-46" width="140" height="92" rx="18" fill="#fff7ea" stroke="#e7c79b" stroke-width="5"/>${translatedLabel(0, 10, api, n.key, 26, "#2a2140")}</g>`).join(""));
  svg.querySelector(".act-sprites").append(art);
  const layer = svg.querySelector(".act-targets");
  let next = 0;
  await new Promise(resolve => {
    cards.forEach((n, i) => tapSpot(layer, { x: 640 + i * 160, y: 610, r: 72, label: api.t(n.key), labelKey: n.key, correct: false }, target => {
      if (target.classList.contains("is-done")) return;
      if (n === notes[next]) {
        target.classList.add("is-done");
        target.querySelector(".act-ring")?.setAttribute("stroke", "#7be495");
        burst(svg, 640 + i * 160, 610, "#7be495");
        next += 1;
        if (next < notes.length) { api.progress(next, notes.length); return; }
        api.progress(notes.length, notes.length);
        resolve();
        return;
      }
      next = 0;
      layer.querySelectorAll(".act-target").forEach(g => { g.classList.remove("is-done"); g.querySelector(".act-ring")?.setAttribute("stroke", "#ffd65c"); });
      api.progress(0, notes.length);
      api.miss("act.order.wrong");
      mark();
    }));
    // The Hint button points at the card that comes next.
    const mark = () => layer.querySelectorAll(".act-target").forEach((g, i) => g.classList.toggle("is-correct", cards[i] === notes[next]));
    mark();
    layer.addEventListener("click", () => setTimeout(mark, 0), { capture: true });
    layer.addEventListener("keydown", () => setTimeout(mark, 0), { capture: true });
  });
}

/** 9A: sort each clue: is it explained by the old relay, or is it about the striped rock? */
async function sortClues(svg, api) {
  const clues = [
    { key: "act.clue.notes", bin: "relay" },
    { key: "act.clue.lantern", bin: "relay" },
    { key: "act.clue.stripes", bin: "rock" },
  ].sort(() => Math.random() - 0.5);
  const bins = [{ id: "relay", x: 650 }, { id: "rock", x: 950 }];
  const art = svgEl("g", { class: "act-panel" }, panelBox(470, 300, 660, 470)
    + bins.map(b => `<g transform="translate(${b.x} 640)"><rect x="-120" y="-70" width="240" height="140" rx="20" fill="#1b2350" stroke="#9fe2ff" stroke-width="5" stroke-dasharray="14 10"/>${translatedLabel(0, -32, api, `act.bin.${b.id}`, 26, "#9fe2ff")}<g class="act-bin" data-bin="${b.id}"></g></g>`).join("")
    + clues.map((c, i) => `<g class="act-chip" data-chip="${i}" transform="translate(${600 + i * 200} 400)"><rect x="-90" y="-36" width="180" height="72" rx="16" fill="#fff7ea" stroke="#e7c79b" stroke-width="5"/>${translatedLabel(0, 9, api, c.key, 21, "#2a2140")}</g>`).join(""));
  svg.querySelector(".act-sprites").append(art);
  const layer = svg.querySelector(".act-targets");
  let picked = null;
  let placed = 0;
  const inBin = { relay: 0, rock: 0 };
  await new Promise(resolve => {
    const chipTargets = clues.map((c, i) => tapSpot(layer, { x: 600 + i * 200, y: 400, r: 80, label: api.t(c.key), labelKey: c.key, correct: i === 0 }, target => {
      if (target.classList.contains("is-done")) return;
      picked = i;
      chipTargets.forEach(g => g.querySelector(".act-ring")?.setAttribute("stroke", "#ffd65c"));
      target.querySelector(".act-ring")?.setAttribute("stroke", "#7be495");
      api.say("act.sort.where");
    }));
    bins.forEach(b => tapSpot(layer, { x: b.x, y: 640, r: 110, label: api.t(`act.bin.${b.id}`), labelKey: `act.bin.${b.id}` }, () => {
      if (picked === null) { api.say("act.sort.pick"); return; }
      const clue = clues[picked];
      if (clue.bin !== b.id) { api.miss(`act.sort.wrong.${clue.bin}`); return; }
      const chip = art.querySelector(`[data-chip="${picked}"]`);
      chip?.setAttribute("transform", `translate(${b.x - 55 + inBin[b.id] * 110} 668) scale(0.55)`);
      inBin[b.id] += 1;
      chip?.setAttribute("opacity", "0.9");
      chipTargets[picked].classList.add("is-done");
      chipTargets[picked].remove();
      burst(svg, b.x, 640, "#7be495");
      placed += 1;
      picked = null;
      // Point the Hint button at the next unsorted clue.
      chipTargets.forEach(g => g.classList.remove("is-correct"));
      chipTargets.find(g => g.isConnected)?.classList.add("is-correct");
      if (placed < clues.length) { api.progress(placed, clues.length); api.say("act.sort.next"); return; }
      api.progress(clues.length, clues.length);
      resolve();
    }));
  });
}

Object.assign(ACTIVITIES, {
  "7A": { backdrop: "message-from-earth", task: "act.7A", hint: "act.7A.hint", total: 3, custom: orderNotes },
  "9A": { backdrop: "message-from-earth", task: "act.9A", hint: "act.9A.hint", total: 3, custom: sortClues },
});

/** Hint button: point at the right target (or the next one) for a moment. */
export function pulseHint(host) {
  const target = host.querySelector(".act-target.is-correct") ?? host.querySelector(".act-target");
  if (!target) return;
  target.classList.add("is-hinted");
  setTimeout(() => target.classList.remove("is-hinted"), 2400);
}
