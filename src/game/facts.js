/**
 * "Did you know?" fact cards shown after each decision. Each card is tied to one NASA source
 * in NASA_SOURCES (src/game/scenes.js). Card text lives in src/i18n/ui.js ("fact.<id>.*").
 * Facts were checked against the linked NASA pages on November 14, 2026. They are short
 * paraphrases for children; numbers in the game itself remain fictional game values.
 * AI-assisted generation: Anthropic Claude. See AI_USAGE.md and ai-usage.json.
 */

export const FACTS = {
  "dusty-world": { sourceId: "mars-facts" },
  "terrain-shield": { sourceId: "mars-solar-storm-2024" },
  "moxie": { sourceId: "moxie-2023" },
  "moxie-rate": { sourceId: "moxie-2023" },
  "sample-tubes": { sourceId: "perseverance-samples" },
  "sample-return": { sourceId: "perseverance-samples" },
  "cold-nights": { sourceId: "meda-pds-bundle" },
  "veggie-garden": { sourceId: "space-plants" },
  "veggie-meals": { sourceId: "space-plants" },
  "thin-air": { sourceId: "mars-facts" },
  "signal-delay": { sourceId: "mars-communication" },
  "daily-plan": { sourceId: "mars-communication" },
  "rad-detector": { sourceId: "mars-solar-storm-2024" },
  "storm-surge": { sourceId: "mars-solar-storm-2024" },
  "space-dose": { sourceId: "mars-solar-storm-2024" },
  "sol-length": { sourceId: "mars-facts" },
};

/** Which fact card each choice unlocks. */
export const FACT_BY_CHOICE = {
  "1A": "dusty-world",
  "1B": "terrain-shield",
  "2A": "moxie",
  "2B": "sample-tubes",
  "2C": "cold-nights",
  "3A": "veggie-garden",
  "3B": "veggie-meals",
  "3C": "thin-air",
  "4A": "signal-delay",
  "4B": "daily-plan",
  "4C": "moxie-rate",
  "5A": "storm-surge",
  "5B": "rad-detector",
  "5C": "space-dose",
  "6A": "sample-return",
  "6B": "sol-length",
  "6C": "veggie-meals",
};
