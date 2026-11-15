/**
 * DUTİ remembers: short, optional lines that connect today's sol to earlier choices and to
 * the lantern clue trail. Presentation only — they never change resources, Science or endings.
 * Some lines hint that earlier choices could belong together (special endings) without
 * naming any ending or recipe. Texts live in src/i18n/ui.js ("mem.<id>").
 * AI-assisted generation: Anthropic Claude. See AI_USAGE.md and ai-usage.json.
 */

const has = (game, id) => game.history.includes(id);

/** Lines per scene, in priority order. At most two are shown. */
export const MEMORIES = {
  "power-shortage": [
    { id: "panels-help", when: g => g.flags.panelsServiced },
    { id: "shelter-ready", when: g => g.flags.shelterPrepared },
  ],
  "greenhouse-problem": [
    { id: "rock-saved", when: g => g.flags.sampleCollected },
    { id: "oxygen-made", when: g => has(g, "2A") },
  ],
  "message-from-earth": [
    { id: "lantern-twice", when: (g, found) => found("lantern-mark") && found("lantern-log") },
    { id: "plants-growing", when: g => g.flags.greenhouseMode === "full" || g.flags.greenhouseMode === "minimum" },
  ],
  "solar-radiation-alert": [
    { id: "shelter-packed", when: g => g.flags.shelterPrepared },
    { id: "earth-tip", when: g => g.flags.earthGuide },
  ],
  "final-mission": [
    { id: "rock-waiting", when: g => g.flags.sampleCollected },
    { id: "greenhouse-quiet", when: g => g.flags.greenhouseMode === "off" },
    { id: "risk-remembered", when: g => g.flags.stormResponse === "outside" },
  ],
  "the-three-note-mystery": [
    { id: "lantern-chime", when: (g, found) => found("lantern-list") || found("lantern-log") },
    { id: "earth-tip-rover", when: g => g.flags.earthGuide },
  ],
  "the-drawer-marked-tomorrow": [
    { id: "pictures-taken", when: g => g.flags.shelterPrepared },
    { id: "tray-alive", when: g => has(g, "3A") || has(g, "3B") },
    { id: "relay-found", when: g => g.flags.signalMethod === "relay" },
  ],
  "two-stories-one-signal": [
    { id: "stone-and-pattern", when: g => g.flags.sampleCollected && g.flags.signalMethod === "pattern" },
    { id: "relay-and-tape", when: g => g.flags.signalMethod === "relay" && g.flags.capsuleMode === "archive" },
    { id: "pictures-back", when: g => g.flags.capsuleMode === "memory" },
  ],
  "a-light-for-who-comes-next": [
    { id: "notebook-full", when: (g, found) => found("lantern-cassette") || found("lantern-far") },
    { id: "garden-hope", when: g => g.flags.capsuleMode === "garden" },
    { id: "voices-saved", when: g => has(g, "9B") },
  ],
};

/** The memory lines that apply now (up to two). `found(id)` tells whether a discovery was made. */
export function memoriesFor(sceneId, game, found) {
  return (MEMORIES[sceneId] ?? []).filter(item => {
    try { return Boolean(item.when(game, found)); } catch { return false; }
  }).slice(0, 2);
}
