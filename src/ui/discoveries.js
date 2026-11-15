/**
 * Free exploration: things a child can tap in each location to discover on their own.
 * Every location has five discoveries and one secret. Texts live in src/i18n/ui.js ("disc.<id>").
 *  - kind "nasa": a real fact, checked on November 14, 2026 against the NASA source in sourceId.
 *  - kind "science": general science that every school book agrees on (no source shown).
 *  - kind "base": part of our fictional outpost story (labelled as such in the journal).
 * Coordinates use the location artwork's viewBox (1600 x 900).
 * AI-assisted generation: Anthropic Claude. See AI_USAGE.md and ai-usage.json.
 */

export const DISCOVERIES = {
  "welcome-to-mars": [
    { id: "lander", x: 300, y: 600, r: 80, kind: "base", mood: "happy" },
    { id: "red-planet", x: 760, y: 720, r: 85, kind: "nasa", sourceId: "mars-facts", mood: "proud" },
    { id: "far-sun", x: 1180, y: 255, r: 90, kind: "nasa", sourceId: "mars-facts", mood: "thinking" },
    { id: "spacesuit", x: 975, y: 755, r: 75, kind: "science", mood: "happy" },
    { id: "rover-buddy", x: 560, y: 765, r: 70, kind: "base", mood: "happy" },
    { id: "phobos", x: 990, y: 300, r: 55, kind: "nasa", sourceId: "mars-facts", secret: true, mood: "proud" },
  ],
  "power-shortage": [
    { id: "battery", x: 500, y: 440, r: 120, kind: "science", mood: "thinking" },
    { id: "moxie-like", x: 1115, y: 470, r: 110, kind: "nasa", sourceId: "moxie-2023", mood: "proud" },
    { id: "dust-storms", x: 800, y: 260, r: 100, kind: "nasa", sourceId: "mars-facts", mood: "worried" },
    { id: "status-lights", x: 800, y: 625, r: 90, kind: "base", mood: "happy" },
    { id: "alarm-light", x: 1090, y: 200, r: 60, kind: "base", mood: "alert" },
    { id: "home-photo", x: 300, y: 330, r: 55, kind: "base", secret: true, mood: "happy" },
  ],
  "greenhouse-problem": [
    { id: "pink-light", x: 800, y: 308, r: 90, kind: "nasa", sourceId: "space-plants", mood: "happy" },
    { id: "photosynthesis", x: 630, y: 440, r: 80, kind: "science", mood: "proud" },
    { id: "water-drop", x: 760, y: 345, r: 50, kind: "base", mood: "thinking" },
    { id: "botanist", x: 1240, y: 700, r: 80, kind: "base", mood: "happy" },
    { id: "dome-sun", x: 1120, y: 260, r: 70, kind: "science", mood: "thinking" },
    { id: "first-tomato", x: 870, y: 640, r: 45, kind: "base", secret: true, mood: "proud" },
  ],
  "message-from-earth": [
    { id: "olympus", x: 550, y: 320, r: 80, kind: "nasa", sourceId: "mars-facts", mood: "proud" },
    { id: "signal-time", x: 1050, y: 320, r: 80, kind: "science", mood: "thinking" },
    { id: "light-speed", x: 800, y: 320, r: 60, kind: "science", mood: "thinking" },
    { id: "daily-listen", x: 1345, y: 300, r: 100, kind: "base", mood: "happy" },
    { id: "radio-graph", x: 660, y: 630, r: 70, kind: "base", mood: "happy" },
    { id: "earths-moon", x: 1112, y: 268, r: 32, kind: "science", secret: true, mood: "proud" },
  ],
  "solar-radiation-alert": [
    { id: "sun-record", x: 1260, y: 260, r: 100, kind: "nasa", sourceId: "donki-cme-2024-05-20", mood: "alert" },
    { id: "cave-shield", x: 620, y: 660, r: 110, kind: "science", mood: "thinking" },
    { id: "no-magnet", x: 1020, y: 600, r: 100, kind: "nasa", sourceId: "mars-facts", mood: "worried" },
    { id: "rad-rover", x: 1260, y: 760, r: 75, kind: "base", mood: "happy" },
    { id: "storm-sky", x: 560, y: 330, r: 100, kind: "nasa", sourceId: "mars-facts", mood: "thinking" },
    { id: "aurora", x: 380, y: 300, r: 70, kind: "nasa", sourceId: "mars-solar-storm-2024", secret: true, mood: "proud" },
  ],
  "final-mission": [
    { id: "real-photo", x: 800, y: 300, r: 110, kind: "nasa", sourceId: "photo-jezero-rim", mood: "proud" },
    { id: "sample-tubes", x: 540, y: 560, r: 80, kind: "base", mood: "thinking" },
    { id: "hazy-sky", x: 1300, y: 290, r: 90, kind: "nasa", sourceId: "mars-facts", mood: "thinking" },
    { id: "blue-sunset", x: 300, y: 300, r: 90, kind: "nasa", sourceId: "mars-sunset", mood: "happy" },
    { id: "future-farms", x: 1100, y: 560, r: 80, kind: "science", mood: "happy" },
    { id: "deimos", x: 1440, y: 250, r: 45, kind: "nasa", sourceId: "mars-facts", secret: true, mood: "proud" },
  ],
};

/** Extra sources used only by discoveries (photographs). */
export const DISCOVERY_SOURCES = {
  "photo-jezero-rim": {
    title: "Perseverance Rover's View Up Crater (PIA26373)",
    url: "https://images.nasa.gov/details/PIA26373",
    kind: "reference",
  },
};

/** Small drawings that only appear once a secret is found (or as a faint hint). */
export function secretSprite(id) {
  switch (id) {
    case "phobos":
      return `<g transform="translate(990 300)"><path d="M-20-6q4-14 22-12t20 10q2 14-14 18t-26-4q-6-6-2-12Z" fill="#a8927f"/><circle cx="-4" cy="-4" r="4" fill="#857161"/><circle cx="8" cy="4" r="3" fill="#857161"/></g>`;
    case "home-photo":
      return `<g transform="translate(300 330)"><rect x="-42" y="-34" width="84" height="66" rx="6" fill="#efe9dd" stroke="#8b93a8" stroke-width="4"/><rect x="-34" y="-26" width="68" height="44" fill="#58a7e0"/><path d="M-34 18l20-20 14 12 12-8 22 16Z" fill="#59d188"/><circle cx="18" cy="-14" r="6" fill="#ffd65c"/></g>`;
    case "first-tomato":
      return `<g transform="translate(870 640)"><circle r="14" fill="#ff5a4a"/><path d="M-8-12l8 5 8-5-4 8h-8Z" fill="#3fae6a"/><circle cx="-4" cy="-4" r="3" fill="#fff" opacity=".6"/></g>`;
    case "earths-moon":
      return `<circle cx="1112" cy="268" r="9" fill="#d9d6cf"/>`;
    case "aurora":
      return `<g opacity=".55" transform="translate(0 160)"><path d="M200 170q90-60 180-10t180-20" fill="none" stroke="#7be495" stroke-width="16" stroke-linecap="round" opacity=".5"/><path d="M220 140q80-50 170-10t160-10" fill="none" stroke="#c79bff" stroke-width="10" stroke-linecap="round" opacity=".6"/></g>`;
    case "deimos":
      return `<g transform="translate(1440 250)"><path d="M-12-4q2-9 13-8t13 7q1 9-9 11t-16-3q-4-4-1-7Z" fill="#c3b2a4"/></g>`;
    default:
      return "";
  }
}
