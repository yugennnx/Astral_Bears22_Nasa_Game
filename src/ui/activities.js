/**
 * Hands-on moments around each decision.
 *  - SPOTLIGHTS: before choosing, DUTİ points at the parts of the location that matter.
 *  - ACTIVITIES: after choosing, the player does the chosen job by tapping the scene.
 * Everything is drawn on an SVG overlay that shares the location's viewBox (1600 x 900,
 * "xMidYMid slice"), so coordinates match the artwork in world.js exactly.
 * These are presentation only: game rules and resource changes stay in src/game/engine.js.
 * AI-assisted generation: Anthropic Claude. See AI_USAGE.md and ai-usage.json.
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
  ],
  "power-shortage": [
    { x: 500, y: 440, r: 190, key: "spot.power.battery" },
    { x: 1115, y: 500, r: 190, key: "spot.power.oxygen" },
  ],
  "greenhouse-problem": [
    { x: 800, y: 320, r: 260, key: "spot.greenhouse.lights" },
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

function checklistPanel(labels) {
  return `
    <g class="act-panel" transform="translate(0 170)">
      <rect x="560" y="150" width="480" height="330" rx="30" fill="#fff7ea" stroke="#e7c79b" stroke-width="8"/>
      <rect x="740" y="130" width="120" height="40" rx="12" fill="#8b93a8"/>
      ${labels.map((label, i) => `
        <g transform="translate(610 ${230 + i * 85})">
          <rect x="0" y="-26" width="52" height="52" rx="12" fill="#fff" stroke="#2a2140" stroke-width="5"/>
          <path class="act-tick" data-tick="${i}" d="M10 0l12 12 22-24" fill="none" stroke="#3fae6a" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>
          <text x="76" y="10" font-family="Fredoka, sans-serif" font-size="34" font-weight="600" fill="#2a2140">${label}</text>
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
  sprites: (t) => checklistPanel(labelKeys.map(key => t(key))),
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
    targets: [0, 1, 2, 3].map(i => ({ x: 1177 + i * 92, y: 663 + i * 6, r: 62 })),
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
    sprites: () => crate(300, 790, 0) + crate(640, 815, 1) + crate(800, 770, 2),
    targets: [{ x: 300, y: 790, r: 60 }, { x: 640, y: 815, r: 60 }, { x: 800, y: 770, r: 60 }],
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
    sprites: () => rock(560, 770, 0, 0.95) + rock(720, 800, 1, 0.85) + rock(890, 775, 2, 1) + rock(1050, 795, 3, 0.9),
    targets: [{ x: 560, y: 770, r: 66 }, { x: 720, y: 800, r: 62 }, { x: 890, y: 775, r: 66 }, { x: 1050, y: 795, r: 62 }],
    order: "find",
    onTap(svg, i, _step, _target, ctx) {
      const rockEl = sprite(svg, i);
      if (i === ctx.special) {
        const crystal = rockEl.querySelector(".act-crystal");
        crystal.setAttribute("opacity", "1");
        anim(crystal, { scale: [0, 1], duration: 600, ease: "outBack(3)" });
        burst(svg, Number(rockEl.dataset.x), 790, "#7ef0ff");
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
  "5A": {
    backdrop: "solar-radiation-alert",
    task: "act.5A",
    sprites: () => astronautSprite(920, 770, 0) + astronautSprite(1060, 790, 1),
    targets: [{ x: 920, y: 760, r: 70 }, { x: 1060, y: 780, r: 70 }],
    focusExtra: [620],
    onTap(svg, i, _step, target) {
      const person = sprite(svg, i);
      anim(person, { translateX: [0, 620 - target.x], translateY: [0, 690 - target.y], scale: [1, 0.6], opacity: [1, 1, 0], duration: 1000, ease: "inOutQuad" });
      if (reduced()) person.setAttribute("opacity", "0");
      setTimeout(() => burst(svg, 620, 680, "#7be495"), reduced() ? 0 : 950);
    },
  },
  "5B": {
    backdrop: "solar-radiation-alert",
    task: "act.5B",
    sprites: () => [[1120, 830], [960, 850], [1360, 770]].map(([x, y], i) => `<g transform="translate(${x} ${y})"><g class="act-sprite" data-sprite="${i}"><circle class="act-scan" r="34" fill="none" stroke="#58d3ff" stroke-width="5" stroke-dasharray="10 8"/></g></g>`).join(""),
    targets: [{ x: 1120, y: 830, r: 55 }, { x: 960, y: 850, r: 55 }, { x: 1360, y: 770, r: 55 }],
    order: "sequence",
    onTap(svg, i, _step, target) {
      const ring = sprite(svg, i).querySelector(".act-scan");
      ring.setAttribute("stroke", "#7be495");
      ring.setAttribute("stroke-dasharray", "0");
      anim(ring, { scale: [0.4, 1.4, 1], duration: 600, ease: "outBack(2)" });
      burst(svg, target.x, target.y, "#58d3ff");
    },
  },
  "5C": {
    backdrop: "solar-radiation-alert",
    task: "act.5C",
    sprites: () => [[860, 800], [1050, 830], [1250, 790]].map(([x, y], i) => `<g transform="translate(${x} ${y})"><g class="act-sprite" data-sprite="${i}"><path d="M0 30v-60" stroke="#efe9dd" stroke-width="6"/><circle cy="-36" r="14" fill="#ffb55a"/></g></g>`).join("")
      + `<rect class="act-flash" width="1600" height="900" fill="#ff4d4d" opacity="0"/>`,
    targets: [{ x: 860, y: 790, r: 60 }, { x: 1050, y: 820, r: 60 }, { x: 1250, y: 780, r: 60 }],
    order: "sequence",
    onTap(svg, i, _step, target) {
      anim(svg.querySelector(".act-flash"), { opacity: [0.35, 0], duration: 600, ease: "outQuad" });
      sprite(svg, i).querySelector("circle").setAttribute("fill", "#7be495");
      burst(svg, target.x, target.y - 36, "#ffb55a");
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
    sprites: () => flagAt(806, 830, 0) + flagAt(812, 730, 1) + flagAt(810, 640, 2),
    targets: [{ x: 806, y: 810, r: 55 }, { x: 812, y: 710, r: 55 }, { x: 810, y: 620, r: 55 }],
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
    sprites: () => basket() + [630, 710, 790, 870].map((x, i) => plantSprite(x, 470, i)).join(""),
    targets: [630, 710, 790, 870].map(x => ({ x, y: 440, r: 50 })),
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
export function runActivity(host, def, { t, onProgress, ariaTarget }) {
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
  });
}
