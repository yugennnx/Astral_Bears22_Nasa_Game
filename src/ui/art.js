/**
 * Hand-coded SVG artwork: DUTİ (a teddy-bear-shaped companion robot), the outpost scene and icons.
 * Everything here is an original illustration drawn in code. It contains no NASA branding.
 * AI-assisted generation: Anthropic Claude. See AI_USAGE.md and ai-usage.json.
 */

const ICON_PATHS = {
  energy: '<path d="M13.5 2 5 13.2h5.6L9.5 22 19 10.2h-5.9L13.5 2Z" fill="currentColor"/>',
  oxygen: '<circle cx="9" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M17 15.2c0-1.6 3.6-1.5 3.6-3.6 0-1.1-.9-1.8-2-1.8-1 0-1.7.5-2 1.3M17 15.6h3.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  safety: '<path d="M12 2.5 4.5 5.4v5.8c0 4.7 3.1 8.5 7.5 10.3 4.4-1.8 7.5-5.6 7.5-10.3V5.4L12 2.5Z" fill="currentColor"/><path d="m8.6 11.8 2.4 2.4 4.4-4.6" fill="none" stroke="var(--icon-cut, #0b1026)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  science: '<path d="M9.2 3h5.6M10 3v6.2L4.9 18a2 2 0 0 0 1.7 3h10.8a2 2 0 0 0 1.7-3L14 9.2V3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.6 15h8.8l2 3.6a.9.9 0 0 1-.8 1.4H6.4a.9.9 0 0 1-.8-1.4l2-3.6Z" fill="currentColor"/>',
  sun: '<circle cx="12" cy="12" r="4.6" fill="currentColor"/><path d="M12 2v2.6M12 19.4V22M2 12h2.6M19.4 12H22M4.9 4.9l1.9 1.9M17.2 17.2l1.9 1.9M4.9 19.1l1.9-1.9M17.2 6.8l1.9-1.9" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  dust: '<path d="M3 8.5h10.5a2.5 2.5 0 1 0-2.4-3.2M3 12.5h15.2a2.6 2.6 0 1 1-2.5 3.4M3 16.5h8.4a2.3 2.3 0 1 1-2.2 3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  satellite: '<rect x="9.2" y="9.2" width="5.6" height="5.6" rx="1" transform="rotate(45 12 12)" fill="currentColor"/><path d="m5.2 9.7 4.5-4.5M3.4 7.9 7.9 3.4M14.3 18.8l4.5-4.5M16.1 20.6l4.5-4.5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M4 16.5a3.5 3.5 0 0 0 3.5 3.5M4 13a7 7 0 0 0 7 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  warning: '<path d="M12 3 2.2 20h19.6L12 3Z" fill="currentColor"/><path d="M12 9.5v5" stroke="var(--icon-cut, #0b1026)" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="17.2" r="1.2" fill="var(--icon-cut, #0b1026)"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.4" fill="currentColor"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" stroke-width="2.2"/>',
  check: '<circle cx="12" cy="12" r="10" fill="currentColor"/><path d="m7.4 12.3 3.1 3.1 6.1-6.4" fill="none" stroke="var(--icon-cut, #0b1026)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
  arrow: '<path d="M5 12h13M12.5 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
  leaf: '<path d="M20 4c-9 0-15 4.5-15 11 0 1.2.2 2.2.5 3C7 12.500 11 9.500 15.500 8.500 11.500 10.500 8.500 14 7 20c7.500.5 13-4.500 13-16Z" fill="currentColor"/>',
  clock: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M12 7v5.2l3.4 2.1" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  star: '<path d="m12 2.6 2.800 5.900 6.400.800-4.700 4.400 1.200 6.400L12 17l-5.700 3.100 1.200-6.400L2.800 9.300l6.400-.800L12 2.600Z" fill="currentColor"/>',
  globe: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 12h18M12 3c2.800 2.600 4.200 5.600 4.200 9s-1.400 6.400-4.200 9c-2.800-2.600-4.200-5.600-4.200-9S9.200 5.600 12 3Z" fill="none" stroke="currentColor" stroke-width="2"/>',
  close: '<path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.600" stroke-linecap="round"/>',
  moon: '<path d="M19.500 14.500A8 8 0 0 1 9.500 4.500a8 8 0 1 0 10 10Z" fill="currentColor"/>',
  info: '<circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M12 11v6" stroke="var(--icon-cut, #0b1026)" stroke-width="2.400" stroke-linecap="round"/><circle cx="12" cy="7.400" r="1.300" fill="var(--icon-cut, #0b1026)"/>',
  restart: '<path d="M4.500 12a7.500 7.500 0 1 0 2.300-5.400" fill="none" stroke="currentColor" stroke-width="2.400" stroke-linecap="round"/><path d="M4 4.500v4.200h4.200" fill="none" stroke="currentColor" stroke-width="2.400" stroke-linecap="round" stroke-linejoin="round"/>',
};

/** Inline icon. Icons are decorative; nearby text always carries the meaning. */
export function icon(name, className = "") {
  return `<svg class="icon ${className}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICON_PATHS[name] ?? ""}</svg>`;
}

const FACES = {
  happy: {
    eyes: '<path d="M70 96q8-10 16 0M114 96q8-10 16 0" />',
    mouth: '<path d="M86 112q14 12 28 0" />',
  },
  neutral: {
    eyes: '<circle cx="78" cy="95" r="6" class="duti-fill"/><circle cx="122" cy="95" r="6" class="duti-fill"/>',
    mouth: '<path d="M90 114q10 6 20 0" />',
  },
  thinking: {
    eyes: '<circle cx="80" cy="93" r="6" class="duti-fill"/><circle cx="124" cy="93" r="6" class="duti-fill"/><path d="M112 82l20-5" />',
    mouth: '<path d="M92 115h14" />',
  },
  worried: {
    eyes: '<circle cx="78" cy="97" r="6" class="duti-fill"/><circle cx="122" cy="97" r="6" class="duti-fill"/><path d="M68 85l18 5M132 85l-18 5" />',
    mouth: '<path d="M88 118q12-9 24 0" />',
  },
  alert: {
    eyes: '<circle cx="78" cy="95" r="8" /><circle cx="122" cy="95" r="8" /><circle cx="78" cy="95" r="3" class="duti-fill"/><circle cx="122" cy="95" r="3" class="duti-fill"/>',
    mouth: '<ellipse cx="100" cy="116" rx="6" ry="5" />',
  },
  proud: {
    eyes: '<path d="M70 97q8-11 16 0M114 97q8-11 16 0" />',
    mouth: '<path d="M84 110q16 16 32 0Z" class="duti-fill" />',
  },
  sad: {
    eyes: '<path d="M71 94q7 8 14 0M115 94q7 8 14 0" />',
    mouth: '<path d="M90 119q10-7 20 0" />',
  },
};

/**
 * DUTİ: a brown, teddy-bear-shaped helper robot with a screen face.
 * `expression` is one of the FACES keys. `wave` raises one arm.
 */
export function duti(expression = "happy", { wave = false, title = "DUTİ" } = {}) {
  const face = FACES[expression] ?? FACES.happy;
  return `
<svg class="duti duti--${expression}${wave ? " duti--wave" : ""}" viewBox="0 0 200 250" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="dutiFur" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#b9824f"/><stop offset="1" stop-color="#8a5a31"/>
    </linearGradient>
    <linearGradient id="dutiDark" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#7a4c27"/><stop offset="1" stop-color="#5e3819"/>
    </linearGradient>
    <radialGradient id="dutiScreen" cx="50%" cy="35%" r="75%">
      <stop offset="0" stop-color="#27335f"/><stop offset="1" stop-color="#0d1330"/>
    </radialGradient>
  </defs>
  <ellipse cx="100" cy="240" rx="58" ry="7" fill="#000" opacity=".28"/>
  <g class="duti-body">
    <!-- wheel base -->
    <rect x="58" y="212" width="84" height="20" rx="10" fill="#3a2a22"/>
    <circle cx="74" cy="226" r="11" fill="#2a1d18"/><circle cx="74" cy="226" r="4.500" fill="#8f7a6c"/>
    <circle cx="126" cy="226" r="11" fill="#2a1d18"/><circle cx="126" cy="226" r="4.500" fill="#8f7a6c"/>
    <!-- arms -->
    <g class="duti-arm duti-arm--left"><rect x="34" y="150" width="24" height="52" rx="12" fill="url(#dutiDark)"/><circle cx="46" cy="200" r="11" fill="#f1d9b5"/></g>
    <g class="duti-arm duti-arm--right"><rect x="142" y="150" width="24" height="52" rx="12" fill="url(#dutiDark)"/><circle cx="154" cy="200" r="11" fill="#f1d9b5"/></g>
    <!-- torso -->
    <rect x="52" y="136" width="96" height="86" rx="40" fill="url(#dutiFur)"/>
    <ellipse cx="100" cy="182" rx="30" ry="28" fill="#f1d9b5"/>
    <rect x="84" y="166" width="32" height="22" rx="7" fill="#0d1330"/>
    <circle class="duti-heart" cx="100" cy="177" r="6" fill="#ffc93c"/>
    <circle cx="86" cy="198" r="3" fill="#b9824f"/><circle cx="100" cy="201" r="3" fill="#b9824f"/><circle cx="114" cy="198" r="3" fill="#b9824f"/>
    <path d="M60 150q40 14 80 0" fill="none" stroke="#6b4322" stroke-width="2" opacity=".5"/>
  </g>
  <g class="duti-head">
    <!-- antenna -->
    <path d="M100 40V20" stroke="#8f7a6c" stroke-width="4" stroke-linecap="round"/>
    <circle class="duti-antenna" cx="100" cy="16" r="7" fill="#ffc93c"/>
    <!-- ears -->
    <circle cx="48" cy="56" r="24" fill="url(#dutiDark)"/><circle cx="48" cy="56" r="13" fill="#f1d9b5"/>
    <circle cx="48" cy="56" r="4" fill="#8a5a31"/>
    <circle cx="152" cy="56" r="24" fill="url(#dutiDark)"/><circle cx="152" cy="56" r="13" fill="#f1d9b5"/>
    <circle cx="152" cy="56" r="4" fill="#8a5a31"/>
    <!-- head -->
    <rect x="32" y="40" width="136" height="112" rx="54" fill="url(#dutiFur)"/>
    <path d="M52 62q48-22 96 0" fill="none" stroke="#d7a373" stroke-width="3" stroke-linecap="round" opacity=".55"/>
    <!-- screen face -->
    <rect x="52" y="68" width="96" height="66" rx="26" fill="url(#dutiScreen)" stroke="#5e3819" stroke-width="4"/>
    <g class="duti-face" fill="none" stroke="#7ef0ff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
      <g class="duti-eyes">${face.eyes}</g>
      ${face.mouth}
    </g>
    <ellipse cx="100" cy="104" rx="5" ry="3.500" fill="#f29b7a" opacity=".9"/>
    <circle cx="62" cy="112" r="6" fill="#ff9aa2" opacity=".35"/><circle cx="138" cy="112" r="6" fill="#ff9aa2" opacity=".35"/>
    <circle cx="40" cy="98" r="3" fill="#5e3819"/><circle cx="160" cy="98" r="3" fill="#5e3819"/>
  </g>
</svg>`;
}

/** Small round avatar of DUTİ's head for speech bubbles. */
export function dutiAvatar(expression = "happy") {
  const face = FACES[expression] ?? FACES.happy;
  return `
<svg class="duti-avatar" viewBox="20 6 160 150" aria-hidden="true" focusable="false">
  <circle cx="48" cy="56" r="24" fill="#6b4322"/><circle cx="48" cy="56" r="13" fill="#f1d9b5"/>
  <circle cx="152" cy="56" r="24" fill="#6b4322"/><circle cx="152" cy="56" r="13" fill="#f1d9b5"/>
  <path d="M100 40V22" stroke="#8f7a6c" stroke-width="4" stroke-linecap="round"/><circle cx="100" cy="17" r="7" fill="#ffc93c"/>
  <rect x="32" y="40" width="136" height="112" rx="54" fill="#a66f3f"/>
  <rect x="52" y="68" width="96" height="66" rx="26" fill="#0d1330" stroke="#5e3819" stroke-width="4"/>
  <g fill="none" stroke="#7ef0ff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${face.eyes}${face.mouth}</g>
</svg>`;
}

function stars(count, width, height, seed = 7) {
  let value = seed;
  const next = () => { value = (value * 9301 + 49297) % 233280; return value / 233280; };
  let out = "";
  for (let i = 0; i < count; i++) {
    const r = 0.600 + next() * 1.500;
    out += `<circle class="star" cx="${(next() * width).toFixed(1)}" cy="${(next() * height).toFixed(1)}" r="${r.toFixed(2)}" style="animation-delay:${(next() * 4).toFixed(2)}s"/>`;
  }
  return out;
}

/**
 * The outpost illustration. One scene is reused for every sol; its parts react to the game state.
 * options: { sceneId, flags, dusty, phase } where phase is "day" | "alert" | "night".
 */
export function outpostArt({ sceneId = "welcome-to-mars", flags = {}, dusty = false, phase = "day", label = "" } = {}) {
  const panelsClean = Boolean(flags.panelsServiced);
  const shelterReady = Boolean(flags.shelterPrepared);
  const greenhouse = flags.greenhouseMode ?? "full";
  const sample = Boolean(flags.sampleCollected);
  const focus = {
    "welcome-to-mars": "arrival",
    "power-shortage": "power",
    "greenhouse-problem": "greenhouse",
    "message-from-earth": "message",
    "solar-radiation-alert": "solar",
    "final-mission": "final",
  }[sceneId] ?? "arrival";
  const crewOutside = phase !== "night" && (focus === "arrival" || focus === "final" || (focus === "solar" && flags.stormResponse === "outside"));
  const plants = greenhouse === "off" ? 0 : greenhouse === "minimum" ? 2 : 5;
  const plantSvg = Array.from({ length: plants }, (_, i) => {
    const x = 548 + i * 17;
    return `<g class="plant" style="animation-delay:${i * 0.200}s"><path d="M${x} 318v-16" stroke="#3fae6a" stroke-width="3" stroke-linecap="round"/><ellipse cx="${x - 5}" cy="${304}" rx="6" ry="3.500" fill="#59d188" transform="rotate(-28 ${x - 5} 304)"/><ellipse cx="${x + 5}" cy="${300}" rx="6" ry="3.500" fill="#7be495" transform="rotate(28 ${x + 5} 300)"/></g>`;
  }).join("");

  return `
<svg class="outpost outpost--${focus} outpost--${phase}${dusty ? " outpost--dusty" : ""}" viewBox="-140 -40 940 529" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#141a3f"/><stop offset=".45" stop-color="#4a2f55"/><stop offset=".78" stop-color="#c8643c"/><stop offset="1" stop-color="#f0a765"/>
    </linearGradient>
    <linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#070b20"/><stop offset=".7" stop-color="#1b1f48"/><stop offset="1" stop-color="#3a2a4f"/>
    </linearGradient>
    <linearGradient id="skyAlert" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1b1338"/><stop offset=".5" stop-color="#6a2c4c"/><stop offset="1" stop-color="#f08a4b"/>
    </linearGradient>
    <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#b9532c"/><stop offset="1" stop-color="#6e2c1a"/>
    </linearGradient>
    <linearGradient id="hab" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f6f1e7"/><stop offset="1" stop-color="#c9c2b8"/>
    </linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#bff3ff" stop-opacity=".85"/><stop offset="1" stop-color="#5fb6d8" stop-opacity=".55"/>
    </linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3f6fd8"/><stop offset="1" stop-color="#1c2f7a"/>
    </linearGradient>
    <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#fff6d6"/><stop offset=".35" stop-color="#ffd27a" stop-opacity=".9"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect class="sky" x="-140" y="-40" width="940" height="529" fill="url(#${phase === "night" ? "skyNight" : phase === "alert" ? "skyAlert" : "skyDay"})"/>
  <g class="stars" fill="#fff" transform="translate(-140 -40)">${stars(56, 940, 240)}</g>

  <!-- small, distant Sun (the Sun looks smaller from Mars than from Earth) -->
  <g class="sun">
    <circle cx="640" cy="${phase === "night" ? 420 : 150}" r="70" fill="url(#sunGlow)"/>
    <circle cx="640" cy="${phase === "night" ? 420 : 150}" r="15" fill="#fff3cf"/>
  </g>
  <g class="particles" stroke="#ffe08a" stroke-width="2.500" stroke-linecap="round" opacity="0">
    <path d="M600 170l-60 46M580 140l-74 30M622 190l-44 62M560 196l-70 58M612 214l-36 70M540 160l-80 26"/>
  </g>

  <!-- hills -->
  <path d="M0 300q90-70 190-40t170-30q90-34 180 10t260-20v230H0Z" fill="#7a3324" opacity=".85"/>
  <path d="M0 330q120-46 240-18t230-22q120-18 330 26v134H0Z" fill="#934029"/>
  <rect x="-140" y="300" width="142" height="60" fill="#7a3324" opacity=".85"/>
  <rect x="-140" y="330" width="142" height="30" fill="#934029"/>
  <rect x="-140" y="356" width="940" height="134" fill="url(#ground)"/>
  <g fill="#5d2415" opacity=".55">
    <ellipse cx="120" cy="410" rx="46" ry="8"/><ellipse cx="700" cy="424" rx="60" ry="9"/><ellipse cx="420" cy="436" rx="38" ry="6"/>
  </g>
  <g fill="#7d3420"><path d="M40 392l14-12 16 4 6 12-22 6Z"/><path d="M742 380l10-9 13 3 4 9-16 5Z"/><path d="M318 428l9-7 11 2 3 8-14 4Z"/></g>

  <!-- antenna -->
  <g class="antenna">
    <path d="M212 356V282" stroke="#b8b2a8" stroke-width="6" stroke-linecap="round"/>
    <path d="M186 276q26-34 58-6Z" fill="#e9e3d8" stroke="#8f8a82" stroke-width="2"/>
    <circle cx="214" cy="262" r="5" fill="#ff6b6b"/>
    <g class="signal" fill="none" stroke="#7ef0ff" stroke-width="3" stroke-linecap="round" opacity="0">
      <path d="M226 250q14-4 18-18"/><path d="M232 262q26-8 34-36"/><path d="M238 274q38-12 50-54"/>
    </g>
  </g>

  <!-- storm shelter: a low, soil-covered module -->
  <g class="shelter">
    <path d="M56 356q8-52 70-52t70 52Z" fill="#8a3a22"/>
    <path d="M76 356q6-36 50-36t50 36Z" fill="#6e2c1a"/>
    <rect x="108" y="326" width="36" height="30" rx="6" fill="#d9d3c8"/>
    <rect x="116" y="334" width="20" height="22" rx="3" fill="#3b4270"/>
    <g class="shelter-ready" opacity="${shelterReady ? 1 : 0}">
      <rect x="150" y="338" width="14" height="18" rx="2" fill="#4fd1ff"/><rect x="88" y="340" width="14" height="16" rx="2" fill="#7be495"/>
      <circle cx="126" cy="312" r="11" fill="#7be495"/><path d="m120.500 312 4 4 7-8" fill="none" stroke="#0b1026" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </g>

  <!-- main habitat -->
  <g class="habitat">
    <rect x="262" y="286" width="210" height="72" rx="30" fill="url(#hab)"/>
    <path d="M298 288q0-62 70-62t70 62Z" fill="url(#hab)"/>
    <path d="M312 288q0-48 56-48t56 48Z" fill="url(#glass)"/>
    <rect x="262" y="330" width="210" height="10" fill="#e2703a"/>
    <g class="windows" fill="#ffd27a">
      <rect x="284" y="300" width="26" height="20" rx="7"/><rect x="424" y="300" width="26" height="20" rx="7"/>
    </g>
    <rect x="352" y="312" width="32" height="46" rx="8" fill="#3b4270"/><rect x="359" y="320" width="18" height="16" rx="4" fill="#7ef0ff" opacity=".7"/>
    <g class="crew-inside" opacity="${crewOutside ? 0 : 1}">
      <circle cx="352" cy="266" r="9" fill="#f6f1e7"/><rect x="345" y="262" width="14" height="7" rx="3" fill="#27335f"/>
      <circle cx="386" cy="270" r="9" fill="#f6f1e7"/><rect x="379" y="266" width="14" height="7" rx="3" fill="#27335f"/>
    </g>
    <g class="lab-shelf" opacity="${sample ? 1 : 0}">
      <rect x="430" y="344" width="22" height="12" rx="3" fill="#27335f"/><path d="M434 350l5-5 6 2 3 5-9 3Z" fill="#c98a5a"/>
    </g>
  </g>

  <!-- greenhouse -->
  <g class="greenhouse greenhouse--${greenhouse}">
    <rect x="486" y="352" width="34" height="8" fill="#c9c2b8"/>
    <path d="M520 358v-34q0-34 56-34t56 34v34Z" fill="url(#glass)" stroke="#e9e3d8" stroke-width="4"/>
    <path d="M576 290v68M548 296v62M604 296v62" stroke="#e9e3d8" stroke-width="2" opacity=".7"/>
    <rect class="grow-light" x="536" y="296" width="80" height="5" rx="2.500" fill="#ff8ad8"/>
    <rect x="534" y="318" width="84" height="6" rx="3" fill="#8f8a82"/>
    ${plantSvg}
  </g>

  <!-- solar panels -->
  <g class="panels panels--${panelsClean ? "clean" : "dusty"}">
    ${[0, 1, 2].map(i => `
    <g transform="translate(${640 + i * 50} 0)">
      <path d="M20 400v-34" stroke="#8f8a82" stroke-width="5" stroke-linecap="round"/>
      <path d="M-4 372l40-22 12 14-40 22Z" fill="url(#panel)" stroke="#dfe6ff" stroke-width="2"/>
      <path d="M8 365l12 14M20 358.500l12 14M2 380l40-22" stroke="#9fb6ff" stroke-width="1.200" opacity=".8"/>
      <path class="panel-dust" d="M-4 372l40-22 12 14-40 22Z" fill="#c9734a" opacity="${panelsClean ? 0 : 0.620}"/>
      <path class="panel-shine" d="M6 368l8-4.500" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="${panelsClean ? 0.900 : 0}"/>
    </g>`).join("")}
  </g>

  <!-- research robot (a small rover) -->
  <g class="rover">
    <rect x="96" y="404" width="52" height="16" rx="6" fill="#e9e3d8"/>
    <rect x="114" y="388" width="8" height="18" fill="#b8b2a8"/><rect x="106" y="380" width="24" height="12" rx="4" fill="#27335f"/>
    <circle cx="112" cy="386" r="2.500" fill="#7ef0ff"/><circle cx="124" cy="386" r="2.500" fill="#7ef0ff"/>
    <circle cx="104" cy="424" r="8" fill="#2a1d18"/><circle cx="122" cy="424" r="8" fill="#2a1d18"/><circle cx="140" cy="424" r="8" fill="#2a1d18"/>
  </g>

  <!-- astronauts outside -->
  <g class="crew-outside" opacity="${crewOutside ? 1 : 0}">
    ${[[236, 0], [268, 6]].map(([x, dy]) => `
    <g transform="translate(${x} ${dy})">
      <rect x="-9" y="388" width="18" height="24" rx="7" fill="#f6f1e7"/>
      <rect x="-12" y="390" width="6" height="16" rx="3" fill="#d9d3c8"/><rect x="6" y="390" width="6" height="16" rx="3" fill="#d9d3c8"/>
      <rect x="-8" y="410" width="7" height="14" rx="3" fill="#d9d3c8"/><rect x="1" y="410" width="7" height="14" rx="3" fill="#d9d3c8"/>
      <circle cx="0" cy="378" r="11" fill="#f6f1e7"/><rect x="-7" y="373" width="14" height="9" rx="4" fill="#27335f"/>
      <rect x="-4" y="394" width="8" height="6" rx="2" fill="#e2703a"/>
    </g>`).join("")}
  </g>

  <!-- airborne dust -->
  <g class="dust-haze">
    <rect x="-140" y="-40" width="940" height="529" fill="#c9734a" opacity="${dusty ? 0.300 : 0}"/>
    <g fill="#e0935f" opacity="${dusty ? 0.550 : 0}">
      <ellipse class="dust-cloud" cx="180" cy="250" rx="150" ry="20"/><ellipse class="dust-cloud" cx="560" cy="220" rx="190" ry="24"/><ellipse class="dust-cloud" cx="380" cy="300" rx="220" ry="18"/>
    </g>
  </g>
</svg>`;
}

/** Tiny weather glyph used by forecasts. */
export function weatherIcon(dusty) {
  return icon(dusty ? "dust" : "sun", dusty ? "icon--dust" : "icon--sun");
}
