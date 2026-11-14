/**
 * Location artwork: every sol happens in a different place.
 * SVG illustrations drawn in code (viewBox 1600 x 900). Important content stays inside
 * x 440–1160 so it remains visible on narrow phone screens. No NASA branding is drawn.
 * AI-assisted generation: Anthropic Claude. See AI_USAGE.md and ai-usage.json.
 */

const W = 1600;
const H = 900;

function rng(seed) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function starField(count, seed = 3, maxY = 520) {
  const next = rng(seed);
  let out = "";
  for (let i = 0; i < count; i++) {
    const r = 0.8 + next() * 2.2;
    out += `<circle class="w-star" cx="${(next() * W).toFixed(0)}" cy="${(next() * maxY).toFixed(0)}" r="${r.toFixed(1)}" style="animation-delay:${(next() * 5).toFixed(2)}s"/>`;
  }
  return `<g fill="#fff">${out}</g>`;
}

function dustMotes(count, seed = 11, color = "#f2c38b") {
  const next = rng(seed);
  let out = "";
  for (let i = 0; i < count; i++) {
    out += `<circle class="w-mote" cx="${(next() * W).toFixed(0)}" cy="${(200 + next() * 650).toFixed(0)}" r="${(1.5 + next() * 3).toFixed(1)}"
      style="animation-delay:${(-next() * 14).toFixed(2)}s;animation-duration:${(10 + next() * 10).toFixed(1)}s"/>`;
  }
  return `<g class="w-motes" fill="${color}" opacity=".55">${out}</g>`;
}

const DEFS = `
<defs>
  <linearGradient id="wSkyDay" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#1b1f4b"/><stop offset=".42" stop-color="#5a3358"/><stop offset=".74" stop-color="#cf6a3f"/><stop offset="1" stop-color="#f3b072"/>
  </linearGradient>
  <linearGradient id="wSkyStorm" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#170f33"/><stop offset=".5" stop-color="#6b2448"/><stop offset=".85" stop-color="#e7703e"/><stop offset="1" stop-color="#ffb26b"/>
  </linearGradient>
  <linearGradient id="wGround" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#bd5530"/><stop offset="1" stop-color="#5e2416"/>
  </linearGradient>
  <linearGradient id="wHab" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#f7f2e8"/><stop offset="1" stop-color="#bdb5aa"/>
  </linearGradient>
  <linearGradient id="wGlass" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#c9f6ff" stop-opacity=".9"/><stop offset="1" stop-color="#4fa9cf" stop-opacity=".5"/>
  </linearGradient>
  <linearGradient id="wPanel" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#4677e0"/><stop offset="1" stop-color="#1b2c78"/>
  </linearGradient>
  <linearGradient id="wWall" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#1d2552"/><stop offset="1" stop-color="#121839"/>
  </linearGradient>
  <linearGradient id="wFloor" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#2b335f"/><stop offset="1" stop-color="#0d1129"/>
  </linearGradient>
  <linearGradient id="wMetal" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#d9dde8"/><stop offset="1" stop-color="#8b93a8"/>
  </linearGradient>
  <radialGradient id="wSunGlow" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#fffbe6"/><stop offset=".3" stop-color="#ffd27a" stop-opacity=".95"/><stop offset="1" stop-color="#ff9d3c" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="wLamp" cx="50%" cy="0%" r="100%">
    <stop offset="0" stop-color="#ff8ad8" stop-opacity=".55"/><stop offset="1" stop-color="#ff8ad8" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="wMars" cx="38%" cy="34%" r="70%">
    <stop offset="0" stop-color="#f49a5c"/><stop offset=".55" stop-color="#c4532c"/><stop offset="1" stop-color="#5a1d12"/>
  </radialGradient>
  <radialGradient id="wEarth" cx="38%" cy="34%" r="70%">
    <stop offset="0" stop-color="#9fe2ff"/><stop offset=".6" stop-color="#2f7fd1"/><stop offset="1" stop-color="#0d2c6b"/>
  </radialGradient>
  <radialGradient id="wVignette" cx="50%" cy="45%" r="75%">
    <stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/>
  </radialGradient>
  <filter id="wBlur"><feGaussianBlur stdDeviation="6"/></filter>
</defs>`;

const frame = (name, inner, extraClass = "") =>
  `<svg class="w w--${name} ${extraClass}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${DEFS}${inner}<rect width="${W}" height="${H}" fill="url(#wVignette)" pointer-events="none"/></svg>`;

function astronaut(x, y, scale = 1, cls = "") {
  return `<g class="w-astro ${cls}" transform="translate(${x} ${y}) scale(${scale})">
    <ellipse cx="0" cy="62" rx="26" ry="6" fill="#000" opacity=".25"/>
    <rect x="-18" y="-6" width="36" height="46" rx="14" fill="#f7f2e8"/>
    <rect x="-24" y="-2" width="12" height="32" rx="6" fill="#d8d1c6"/><rect x="12" y="-2" width="12" height="32" rx="6" fill="#d8d1c6"/>
    <rect x="-15" y="36" width="13" height="26" rx="6" fill="#d8d1c6"/><rect x="2" y="36" width="13" height="26" rx="6" fill="#d8d1c6"/>
    <rect x="-22" y="-2" width="10" height="26" rx="4" fill="#bdb5aa" opacity=".6"/>
    <circle cx="0" cy="-26" r="22" fill="#f7f2e8"/>
    <rect x="-15" y="-36" width="30" height="20" rx="9" fill="#27335f"/>
    <path d="M-10-31q6-4 12-1" stroke="#7ef0ff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
    <rect x="-8" y="6" width="16" height="10" rx="3" fill="#e2703a"/>
  </g>`;
}

function rover(x, y, scale = 1, cls = "") {
  return `<g class="w-rover ${cls}" transform="translate(${x} ${y}) scale(${scale})">
    <rect x="-60" y="-18" width="120" height="30" rx="10" fill="#efe9dd"/>
    <rect x="-8" y="-58" width="14" height="42" fill="#b8b2a8"/><rect x="-28" y="-80" width="52" height="26" rx="8" fill="#27335f"/>
    <circle cx="-14" cy="-67" r="6" fill="#7ef0ff"/><circle cx="10" cy="-67" r="6" fill="#7ef0ff"/>
    <rect x="-56" y="-30" width="52" height="12" rx="3" fill="#3f6fd8"/>
    ${[-44, 0, 44].map(cx => `<g transform="translate(${cx} 20)"><g class="w-wheel"><circle r="17" fill="#2a1d18"/><path d="M-11 0h22M0-11v22" stroke="#8f7a6c" stroke-width="4"/></g></g>`).join("")}
  </g>`;
}

function habitat(x, y, scale = 1, lit = true) {
  return `<g class="w-hab" transform="translate(${x} ${y}) scale(${scale})">
    <ellipse cx="0" cy="96" rx="250" ry="22" fill="#000" opacity=".22"/>
    <rect x="-230" y="-20" width="460" height="116" rx="56" fill="url(#wHab)"/>
    <path d="M-150-16q0-120 150-120t150 120Z" fill="url(#wHab)"/>
    <path d="M-120-16q0-92 120-92t120 92Z" fill="url(#wGlass)"/>
    <rect x="-230" y="44" width="460" height="16" fill="#e2703a"/>
    <g class="w-windows" fill="${lit ? "#ffd27a" : "#3b4270"}">
      <rect x="-196" y="0" width="54" height="34" rx="14"/><rect x="142" y="0" width="54" height="34" rx="14"/>
    </g>
    <rect x="-34" y="14" width="68" height="82" rx="16" fill="#3b4270"/><rect x="-20" y="28" width="40" height="28" rx="8" fill="#7ef0ff" opacity=".7"/>
  </g>`;
}

function panels(x, y, clean, count = 4) {
  return `<g class="w-panels ${clean ? "is-clean" : "is-dusty"}" transform="translate(${x} ${y})">
    ${Array.from({ length: count }, (_, i) => `
    <g transform="translate(${i * 92} ${i * 6})">
      <path d="M40 120V64" stroke="#8f8a82" stroke-width="8" stroke-linecap="round"/>
      <path d="M-8 72l84-46 26 28-84 46Z" fill="url(#wPanel)" stroke="#dfe6ff" stroke-width="3"/>
      <path d="M17 58l26 28M42 44l26 28M4 86l84-46" stroke="#9fb6ff" stroke-width="2" opacity=".8"/>
      <path class="w-panel-dust" d="M-8 72l84-46 26 28-84 46Z" fill="#c9734a"/>
      <path class="w-panel-shine" d="M14 66l18-10" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
    </g>`).join("")}
  </g>`;
}

function hills(color1 = "#7a3324", color2 = "#934029") {
  return `
  <path d="M0 560q170-120 360-70t320-60q170-60 340 20t580-40v450H0Z" fill="${color1}"/>
  <path d="M0 620q240-80 470-30t430-40q240-30 700 40v310H0Z" fill="${color2}"/>
  <rect y="660" width="${W}" height="240" fill="url(#wGround)"/>
  <g fill="#5d2415" opacity=".5"><ellipse cx="300" cy="790" rx="90" ry="14"/><ellipse cx="1300" cy="820" rx="120" ry="16"/><ellipse cx="820" cy="860" rx="80" ry="10"/></g>
  <g fill="#7d3420"><path d="M180 760l26-22 30 7 12 22-42 12Z"/><path d="M1380 730l20-16 24 5 8 17-30 9Z"/><path d="M640 840l18-13 21 4 6 15-27 8Z"/></g>`;
}

/* ---------- Title: Mars seen from space ---------- */
export function titleWorld() {
  const craters = [[-80, -40, 26], [60, 70, 34], [110, -90, 18], [-130, 90, 22], [10, -150, 14], [-40, 160, 18]]
    .map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#8f3a20" opacity=".45"/><circle cx="${cx - 3}" cy="${cy - 3}" r="${r * 0.7}" fill="#b2502c" opacity=".35"/>`).join("");
  return frame("title", `
    <rect width="${W}" height="${H}" fill="#060918"/>
    ${starField(140, 5, H)}
    <circle cx="1240" cy="140" r="5" fill="#cfe9ff" class="w-earth-dot"/>
    <g class="w-planet" transform="translate(1060 520)">
      <circle r="330" fill="#ff8a4c" opacity=".14" filter="url(#wBlur)"/>
      <g class="w-planet-spin">
        <circle r="300" fill="url(#wMars)"/>
        <g clip-path="circle(300px)">
          <path d="M-300-60q150-40 300 10t300-20v40q-150 30-300 0t-300 20Z" fill="#9c3d22" opacity=".45"/>
          <path d="M-300 80q160 30 320-10t280 10v30q-140-10-290 20t-310-20Z" fill="#7e2f1a" opacity=".4"/>
          ${craters}
          <ellipse cx="0" cy="-286" rx="90" ry="22" fill="#fff4ea" opacity=".85"/>
        </g>
      </g>
      <circle r="300" fill="none" stroke="#ffc49a" stroke-width="4" opacity=".35"/>
      <g class="w-base-ping" transform="translate(-60 30)"><circle r="10" fill="#ffd65c"/><circle class="w-ping" r="10" fill="none" stroke="#ffd65c" stroke-width="3"/></g>
    </g>
    <g class="w-moon-orbit"><circle class="w-phobos" cx="640" cy="260" r="16" fill="#8d7b6d"/></g>
    <path class="w-comet" d="M200 140l-120 40" stroke="#bfe6ff" stroke-width="3" stroke-linecap="round" opacity=".7"/>
  `);
}

/* ---------- Sol 1: landing site ---------- */
function landingWorld(state) {
  const f = state.flags;
  return frame("landing", `
    <rect width="${W}" height="${H}" fill="url(#wSkyDay)"/>
    ${starField(60, 7, 300)}
    <g class="w-sun"><circle cx="1180" cy="220" r="120" fill="url(#wSunGlow)"/><circle cx="1180" cy="220" r="26" fill="#fff3cf"/></g>
    ${hills()}
    <g class="w-lander" transform="translate(300 560)">
      <path d="M-50 100l20-70h60l20 70" stroke="#b8b2a8" stroke-width="8" fill="none"/>
      <path d="M-40 30q40-90 80 0Z" fill="url(#wMetal)"/><rect x="-46" y="26" width="92" height="20" rx="6" fill="#e2703a"/>
      <circle cx="0" cy="0" r="12" fill="#27335f"/>
    </g>
    <g class="w-shelter ${f.shelterPrepared ? "is-ready" : ""}" transform="translate(470 610)">
      <path d="M-110 90q12-110 110-110t110 110Z" fill="#8a3a22"/><path d="M-80 90q10-76 80-76t80 76Z" fill="#6e2c1a"/>
      <rect x="-28" y="34" width="56" height="56" rx="10" fill="#d9d3c8"/><rect x="-16" y="46" width="32" height="44" rx="5" fill="#3b4270"/>
      <g class="w-ready-badge"><circle cx="0" cy="-40" r="22" fill="#7be495"/><path d="m-10-40 7 7 13-14" fill="none" stroke="#0b1026" stroke-width="5" stroke-linecap="round"/></g>
    </g>
    ${habitat(800, 590)}
    <g transform="translate(1040 590)"><path d="M0 100v-80q0-70 110-70t110 70v80Z" fill="url(#wGlass)" stroke="#e9e3d8" stroke-width="6"/>
      <rect x="20" y="40" width="180" height="10" rx="5" fill="#ff8ad8" class="w-growlight"/>
      ${[40, 80, 120, 160].map(x => `<path d="M${x} 90v-26" stroke="#3fae6a" stroke-width="6"/><circle cx="${x}" cy="60" r="12" fill="#59d188"/>`).join("")}</g>
    ${panels(1130, 600, f.panelsServiced)}
    <g class="w-antenna" transform="translate(640 500)"><path d="M0 160V20" stroke="#b8b2a8" stroke-width="10"/><path d="M-50 20q50-70 110-10Z" fill="#e9e3d8"/><circle cx="6" cy="-6" r="9" fill="#ff6b6b" class="w-blink"/></g>
    ${rover(560, 790, 0.9, "w-drive")}
    ${astronaut(940, 760, 1.1, "w-walk")}${astronaut(1010, 770, 1.05, "w-walk w-walk--2")}
    ${dustMotes(30, 4)}
  `);
}

/* ---------- Sol 2: power control room ---------- */
function powerWorld(state, dusty) {
  const energy = state.resources.energy;
  const oxygen = state.resources.oxygen;
  const cells = Array.from({ length: 10 }, (_, i) => {
    const on = i < energy;
    const tone = energy <= 3 ? "#ff7b7b" : energy <= 5 ? "#ffb55a" : "#ffd65c";
    return `<rect class="w-cell ${on ? "is-on" : ""}" x="0" y="${270 - i * 30}" width="120" height="22" rx="6" fill="${on ? tone : "#2b335f"}"/>`;
  }).join("");
  return frame("power", `
    <rect width="${W}" height="${H}" fill="url(#wWall)"/>
    <g opacity=".35" stroke="#3a4686" stroke-width="3">${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 200} 0v640"/>`).join("")}</g>
    <!-- window to the outside -->
    <g transform="translate(560 90)">
      <rect width="480" height="270" rx="40" fill="#0d1129"/>
      <clipPath id="wWin"><rect x="14" y="14" width="452" height="242" rx="30"/></clipPath>
      <g clip-path="url(#wWin)">
        <rect x="0" y="0" width="480" height="270" fill="url(#wSkyDay)"/>
        <path d="M0 190q120-50 240-20t240-10v110H0Z" fill="#934029"/>
        <g transform="translate(250 170)">${panels(0, 0, state.flags.panelsServiced, 3).replace('class="w-panels', 'class="w-panels w-panels--small')}</g>
        <rect class="w-window-dust" width="480" height="270" fill="#d07a4c" opacity="${dusty ? 0.55 : 0.15}"/>
        ${dustMotes(18, 9, "#ffd2a8").replace('class="w-motes"', 'class="w-motes w-motes--fast" transform="scale(.3)"')}
      </g>
      <rect x="6" y="6" width="468" height="258" rx="36" fill="none" stroke="url(#wMetal)" stroke-width="12"/>
      <path d="M240 6v258" stroke="url(#wMetal)" stroke-width="8"/>
    </g>
    <!-- battery rack -->
    <g transform="translate(440 300)">
      <rect x="-20" y="-40" width="160" height="350" rx="20" fill="#0d1129" stroke="#3a4686" stroke-width="4"/>
      <g transform="translate(0 0)">${cells}</g>
      <rect x="10" y="-80" width="100" height="34" rx="10" fill="#27335f"/>
      <path d="M50-75l-10 14h12l-8 14 20-20H52l8-8Z" fill="#ffd65c"/>
    </g>
    <!-- oxygen generator -->
    <g transform="translate(1040 360)">
      <rect x="0" y="0" width="150" height="290" rx="28" fill="url(#wMetal)"/>
      <rect x="22" y="30" width="106" height="170" rx="20" fill="#0d3247"/>
      <rect x="22" y="${30 + 170 - oxygen * 17}" width="106" height="${oxygen * 17}" rx="16" fill="#58d3ff" opacity=".85"/>
      ${[0, 1, 2, 3, 4].map(i => `<circle class="w-bubble" cx="${45 + i * 16}" cy="190" r="${5 + (i % 3) * 2}" fill="#d9f6ff" style="animation-delay:${i * 0.5}s"/>`).join("")}
      <text x="75" y="248" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="34" font-weight="700" fill="#0d3247">O₂</text>
    </g>
    <!-- console -->
    <rect y="640" width="${W}" height="260" fill="url(#wFloor)"/>
    <g transform="translate(560 600)">
      <path d="M-40 80l40-90h480l40 90Z" fill="#27335f"/>
      <rect x="20" y="-4" width="440" height="58" rx="12" fill="#121839"/>
      ${Array.from({ length: 12 }, (_, i) => `<circle class="w-led" cx="${50 + i * 34}" cy="26" r="8" fill="${["#ffd65c", "#7be495", "#58d3ff", "#ff7b7b"][i % 4]}" style="animation-delay:${(i * 0.17).toFixed(2)}s"/>`).join("")}
    </g>
    <!-- warning beacon -->
    <g class="w-beacon" transform="translate(800 40)">
      <rect x="-30" y="0" width="60" height="22" rx="6" fill="#8b93a8"/>
      <path d="M-26 22h52l-8 40h-36Z" fill="#ffb55a"/>
      <path class="w-beam" d="M0 50L-260 340h520Z" fill="#ffb55a" opacity=".12"/>
    </g>
  `, energy <= 3 ? "is-low-power" : "");
}

/* ---------- Sol 3: greenhouse interior ---------- */
function greenhouseWorld(state) {
  const mode = state.flags.greenhouseMode ?? "undecided";
  const next = rng(21);
  const shelf = (y, rowIndex) => Array.from({ length: 9 }, (_, i) => {
    const x = 470 + i * 80;
    const lit = mode === "undecided" || mode === "full" || (mode === "minimum" && i >= 3 && i <= 5 && rowIndex === 1);
    const h = 30 + next() * 26;
    return `<g transform="translate(${x} ${y})"><g class="w-plant ${lit ? "is-lit" : "is-dim"}" style="animation-delay:${(next() * 2).toFixed(2)}s">
      <rect x="-22" y="-6" width="44" height="22" rx="6" fill="#6b4322"/>
      <path d="M0-4v-${h.toFixed(0)}" stroke="#3fae6a" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="-14" cy="-${(h * 0.6).toFixed(0)}" rx="16" ry="8" fill="#59d188" transform="rotate(-30 -14 -${(h * 0.6).toFixed(0)})"/>
      <ellipse cx="14" cy="-${(h * 0.8).toFixed(0)}" rx="16" ry="8" fill="#7be495" transform="rotate(30 14 -${(h * 0.8).toFixed(0)})"/>
      ${next() > 0.55 ? `<circle cx="6" cy="-${(h - 2).toFixed(0)}" r="7" fill="#ff7b6b"/>` : ""}
    </g></g>`;
  }).join("");
  return frame("greenhouse", `
    <rect width="${W}" height="${H}" fill="#0f2a2a"/>
    <g opacity=".9">
      <path d="M200 900V340Q800-120 1400 340V900Z" fill="#163c3d"/>
      <path d="M200 900V340Q800-120 1400 340V900" fill="none" stroke="url(#wMetal)" stroke-width="14"/>
      ${[400, 600, 800, 1000, 1200].map(x => `<path d="M${x} 900V${x === 800 ? 110 : 220}" stroke="#9fb3b8" stroke-width="5" opacity=".5"/>`).join("")}
      <path d="M260 300Q800 40 1340 300" fill="none" stroke="#9fb3b8" stroke-width="5" opacity=".5"/>
    </g>
    <g class="w-gh-sky" opacity=".5">
      <circle cx="1120" cy="200" r="60" fill="url(#wSunGlow)"/>
    </g>
    <g class="w-growlights mode-${mode}">
      ${[0, 1].map(row => `
        <rect x="420" y="${300 + row * 210}" width="760" height="16" rx="8" fill="#ff8ad8" class="w-growlight"/>
        <path d="M420 ${316 + row * 210}h760l60 150H360Z" fill="url(#wLamp)" class="w-lamp-cone"/>`).join("")}
    </g>
    <g>
      <rect x="400" y="470" width="800" height="18" rx="6" fill="#8f8a82"/>
      <rect x="400" y="680" width="800" height="18" rx="6" fill="#8f8a82"/>
      ${shelf(462, 0)}${shelf(672, 1)}
    </g>
    <g class="w-drips">${[520, 760, 1000].map((x, i) => `<path class="w-drip" d="M${x} 330q-6 10 0 14q6-4 0-14Z" fill="#7ef0ff" style="animation-delay:${i * 0.7}s"/>`).join("")}</g>
    <rect y="760" width="${W}" height="140" fill="#0c1f20"/>
    ${astronaut(1240, 720, 1.2, "w-tend")}
    ${dustMotes(24, 31, "#d4ffe1")}
  `, `mode-${mode}`);
}

/* ---------- Sol 4: communications room ---------- */
function commsWorld(state, labels = {}) {
  return frame("comms", `
    <rect width="${W}" height="${H}" fill="url(#wWall)"/>
    <g opacity=".3" stroke="#3a4686" stroke-width="2">${Array.from({ length: 16 }, (_, i) => `<path d="M0 ${i * 60}h${W}"/>`).join("")}</g>
    <!-- big screen -->
    <g transform="translate(420 110)">
      <rect width="760" height="420" rx="34" fill="#070b20" stroke="url(#wMetal)" stroke-width="12"/>
      <g clip-path="inset(10px round 26px)">
        ${starField(60, 41, 420).replace('<g fill="#fff">', '<g fill="#fff" opacity=".7">')}
      </g>
      <g transform="translate(130 210)"><circle r="62" fill="url(#wMars)"/><text y="104" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="28" fill="#f2c38b" font-weight="600">${labels.mars ?? "MARS"}</text></g>
      <g transform="translate(630 210)"><circle r="58" fill="url(#wEarth)"/><path d="M-30-20q20-10 30 6t-6 30q-24 6-24-36Z" fill="#59d188" opacity=".85"/>
        <text y="100" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="28" fill="#9fe2ff" font-weight="600">${labels.earth ?? "EARTH"}</text></g>
      <path d="M200 210H560" stroke="#7ef0ff" stroke-width="4" stroke-dasharray="10 14" opacity=".55"/>
      <g class="w-message"><circle r="16" fill="#ffd65c"/><path d="M-8-4h16v10h-16Z M-8-4l8 6 8-6" fill="none" stroke="#2a1c00" stroke-width="2.5"/></g>
      <g transform="translate(380 76)"><rect x="-120" y="-34" width="240" height="56" rx="28" fill="#1b2350"/>
        <circle cx="-86" cy="-6" r="16" fill="none" stroke="#ffd65c" stroke-width="4"/><path d="M-86-16v10l7 5" stroke="#ffd65c" stroke-width="4" fill="none" stroke-linecap="round"/>
        <text x="10" y="4" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="30" font-weight="700" fill="#fff">~20 min</text></g>
    </g>
    <!-- antenna dish through a side window -->
    <g transform="translate(1220 140)">
      <rect width="250" height="300" rx="30" fill="url(#wSkyDay)" stroke="url(#wMetal)" stroke-width="10"/>
      <g class="w-dish" transform="translate(130 200)"><path d="M-70-20q70-110 140 0Z" fill="#e9e3d8"/><path d="M0-30v90" stroke="#b8b2a8" stroke-width="10"/><circle cx="0" cy="-38" r="8" fill="#ff6b6b" class="w-blink"/>
        <g class="w-waves" fill="none" stroke="#7ef0ff" stroke-width="4" stroke-linecap="round"><path d="M20-80q20-10 26-34"/><path d="M28-60q36-14 44-60"/></g></g>
    </g>
    <rect y="620" width="${W}" height="280" fill="url(#wFloor)"/>
    <g transform="translate(520 600)">
      <path d="M-40 90l40-100h560l40 100Z" fill="#27335f"/>
      <rect x="60" y="-10" width="160" height="70" rx="10" fill="#0d1129"/><path d="M80 30l20-16 22 10 24-20 22 8 20-6" fill="none" stroke="#7be495" stroke-width="4" class="w-signal-line"/>
      <rect x="340" y="-10" width="160" height="70" rx="10" fill="#0d1129"/>${[0, 1, 2, 3].map(i => `<rect x="${360 + i * 34}" y="${40 - i * 10}" width="22" height="${10 + i * 10}" rx="4" fill="#58d3ff"/>`).join("")}
    </g>
    ${astronaut(330, 700, 1.15)}
  `, state.flags.earthGuide ? "has-reply" : "");
}

/* ---------- Sol 5: solar storm outside ---------- */
function stormWorld(state) {
  const next = rng(55);
  const streaks = Array.from({ length: 26 }, () => {
    const x = 700 + next() * 900;
    const y = -40 + next() * 400;
    return `<path class="w-streak" d="M${x.toFixed(0)} ${y.toFixed(0)}l-${(120 + next() * 120).toFixed(0)} ${(90 + next() * 90).toFixed(0)}" style="animation-delay:${(-next() * 2).toFixed(2)}s"/>`;
  }).join("");
  const outside = state.flags.stormResponse === "outside";
  return frame("storm", `
    <rect width="${W}" height="${H}" fill="url(#wSkyStorm)"/>
    ${starField(70, 9, 360)}
    <g class="w-sun w-sun--flare"><circle cx="1260" cy="190" r="200" fill="url(#wSunGlow)"/><circle cx="1260" cy="190" r="34" fill="#fff6d6"/>
      <circle class="w-flare" cx="1260" cy="190" r="70" fill="none" stroke="#ffe7a8" stroke-width="10" opacity=".7"/></g>
    <g class="w-streaks" stroke="#ffe08a" stroke-width="4" stroke-linecap="round">${streaks}</g>
    ${hills("#5d2232", "#6e2a2a")}
    <g class="w-shelter is-open" transform="translate(620 600)">
      <path d="M-160 120q16-170 160-170t160 170Z" fill="#7a3324"/><path d="M-120 120q14-120 120-120t120 120Z" fill="#5e2416"/>
      <rect x="-44" y="40" width="88" height="80" rx="12" fill="#d9d3c8"/><rect class="w-door-light" x="-28" y="54" width="56" height="66" rx="6" fill="#ffd27a"/>
      <g class="w-beacon w-beacon--alarm" transform="translate(0 -70)"><rect x="-22" y="0" width="44" height="18" rx="5" fill="#8b93a8"/><path d="M-18 18h36l-6 28h-24Z" fill="#ff6b6b"/></g>
    </g>
    ${habitat(1020, 620, 0.85)}
    ${rover(1260, 800, 0.95, "w-drive")}
    ${outside ? astronaut(860, 770, 1.1, "w-walk") : astronaut(700, 760, 1, "w-hurry") + astronaut(760, 770, 1, "w-hurry w-walk--2")}
    ${dustMotes(26, 61, "#ffd2a8")}
  `);
}

/* ---------- Sol 6: crater rim with three routes (real NASA photo behind) ---------- */
function finalWorld(state, photoSrc, labels = {}) {
  const f = state.flags;
  const sign = (x, y, label, color, glyph, active) => `
    <g class="w-sign ${active ? "is-active" : ""}" transform="translate(${x} ${y})">
      <path d="M0 120V0" stroke="#8f7a6c" stroke-width="10"/>
      <rect x="-90" y="-70" width="180" height="70" rx="20" fill="#0d1129" stroke="${color}" stroke-width="5"/>
      <g transform="translate(-58 -35)" fill="${color}">${glyph}</g>
      <text x="16" y="-24" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="30" font-weight="700" fill="#fff">${label}</text>
    </g>`;
  return frame("final", `
    <rect width="${W}" height="${H}" fill="#2a1a2e"/>
    <image class="w-photo" href="${photoSrc}" x="-420" y="-150" width="2600" height="720" preserveAspectRatio="xMidYMid slice" opacity=".95"/>
    <rect width="${W}" height="560" fill="url(#wSkyDay)" opacity=".28"/>
    <path d="M0 520q300-40 600 0t600-10 400 0v390H0Z" fill="#8d3b24"/>
    <rect y="600" width="${W}" height="300" fill="url(#wGround)"/>
    <path class="w-trail" d="M800 900C780 780 700 720 560 660M800 900c10-120 20-200 10-280M800 900c40-120 160-190 320-230" fill="none" stroke="#f2c38b" stroke-width="10" stroke-dasharray="4 26" stroke-linecap="round" opacity=".75"/>
    ${sign(540, 600, labels.lab ?? "LAB", "#cfa6ff", '<path d="M-6-14h12M-4-14v10l-12 20h32L4-4v-10" fill="none" stroke="currentColor" stroke-width="5"/>', f.sampleCollected)}
    ${sign(810, 520, labels.route ?? "ROUTE", "#ffd65c", '<path d="M-14 16l10-30 10 18 10-14" fill="none" stroke="currentColor" stroke-width="5"/>', state.resources.safety >= 6)}
    ${sign(1100, 600, labels.plants ?? "PLANTS", "#7be495", '<path d="M0 16V-4M0-4q-14-4-16-18 14 0 16 18Zm0 4q14-4 16-18-14 0-16 18Z" fill="currentColor"/>', f.greenhouseMode && f.greenhouseMode !== "off")}
    ${rover(780, 820, 1, "w-drive")}
    ${astronaut(640, 790, 1.05, "w-walk")}
    ${dustMotes(22, 71)}
  `);
}

/* ---------- Between sols: time-lapse sky ---------- */
export function nightWorld(dusty) {
  return frame("night", `
    <rect class="w-night-sky" width="${W}" height="${H}" fill="#070b20"/>
    <rect class="w-dusk" width="${W}" height="${H}" fill="url(#wSkyDay)"/>
    <g class="w-night-stars">${starField(160, 99, 640)}</g>
    <g class="w-moons"><circle class="w-phobos" cx="0" cy="0" r="14" fill="#a99282"/><circle class="w-deimos" cx="0" cy="0" r="8" fill="#c3b2a4"/></g>
    <g class="w-sun w-sun--arc"><circle cx="0" cy="0" r="110" fill="url(#wSunGlow)"/><circle cx="0" cy="0" r="24" fill="#fff3cf"/></g>
    <path d="M0 640q260-90 520-40t520-50q260-40 560 40v350H0Z" fill="#160d1f"/>
    <g transform="translate(800 700)" fill="#0b0712">
      <rect x="-230" y="-20" width="460" height="116" rx="56"/><path d="M-150-16q0-120 150-120t150 120Z"/>
      <rect x="250" y="-10" width="200" height="100" rx="40"/><path d="M-420 90q12-110 110-110t110 110Z"/>
    </g>
    <g class="w-hab-lights" fill="#ffd27a"><rect x="604" y="700" width="54" height="34" rx="14"/><rect x="942" y="700" width="54" height="34" rx="14"/><circle cx="800" cy="610" r="6"/></g>
    <rect class="w-dust-veil" width="${W}" height="${H}" fill="#c9734a" opacity="${dusty ? 0.32 : 0}"/>
  `);
}

export const LOCATIONS = {
  "welcome-to-mars": "landing",
  "power-shortage": "power",
  "greenhouse-problem": "greenhouse",
  "message-from-earth": "comms",
  "solar-radiation-alert": "storm",
  "final-mission": "final",
};

/** Artwork for the scene being played. */
export function sceneWorld(sceneId, state, { dusty = false, photoSrc = "", labels = {} } = {}) {
  switch (LOCATIONS[sceneId]) {
    case "power": return powerWorld(state, dusty);
    case "greenhouse": return greenhouseWorld(state);
    case "comms": return commsWorld(state, labels);
    case "storm": return stormWorld(state);
    case "final": return finalWorld(state, photoSrc, labels);
    default: return landingWorld(state);
  }
}
