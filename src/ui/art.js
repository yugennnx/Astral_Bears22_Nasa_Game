/**
 * Hand-coded SVG artwork: DUTİ (a teddy-bear-shaped companion robot) and icons. Locations are in world.js.
 * Everything here is an original illustration drawn in code. It contains no NASA branding.
 * AI-assisted generation: Anthropic Claude. See AI_USAGE.md and ai-usage.json.
 */

const ICON_PATHS = {
  book: '<path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v15H5.5c-.8 0-1.5.7-1.5 1.5V5.5Z" fill="currentColor"/><path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v15h5.5c.8 0 1.5.7 1.5 1.5V5.5Z" fill="currentColor" opacity=".7"/>',
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

/** Tiny weather glyph used by forecasts. */
export function weatherIcon(dusty) {
  return icon(dusty ? "dust" : "sun", dusty ? "icon--dust" : "icon--sun");
}
