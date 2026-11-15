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

/**
 * Fact cards each choice can unlock, best match first. pickFact() never repeats a card
 * within one mission and prefers cards the player has never collected before.
 */
export const FACT_BY_CHOICE = {
  "1A": ["dusty-world", "sol-length"],
  "1B": ["terrain-shield", "space-dose"],
  "2A": ["moxie", "moxie-rate"],
  "2B": ["sample-tubes", "sample-return"],
  "2C": ["cold-nights", "thin-air"],
  "3A": ["veggie-garden", "veggie-meals"],
  "3B": ["veggie-meals", "veggie-garden"],
  "3C": ["thin-air", "cold-nights"],
  "4A": ["signal-delay", "daily-plan"],
  "4B": ["daily-plan", "signal-delay"],
  "4C": ["moxie-rate", "moxie"],
  "5A": ["storm-surge", "terrain-shield", "space-dose"],
  "5B": ["rad-detector", "storm-surge"],
  "5C": ["space-dose", "storm-surge"],
  "6A": ["sample-return", "sample-tubes"],
  "6B": ["sol-length", "dusty-world"],
  "6C": ["veggie-meals", "veggie-garden", "thin-air"],
  "7A": ["signal-delay", "daily-plan"],
  "7B": ["rad-detector", "daily-plan"],
  "7C": ["moxie-rate", "moxie"],
  "8A": ["veggie-garden", "veggie-meals"],
  "8B": ["sol-length", "dusty-world"],
  "8C": ["sample-return", "sample-tubes"],
  "9A": ["sample-return", "cold-nights"],
  "9B": ["sol-length", "thin-air"],
  "9C": ["moxie", "moxie-rate"],
  "10A": ["signal-delay", "daily-plan"],
  "10B": ["veggie-meals", "sample-tubes"],
  "10C": ["dusty-world", "sol-length"],
};

/** The card for a choice: not yet shown in this mission, never collected if possible. */
export function pickFact(choiceId, missionFacts = [], collected = []) {
  const pool = FACT_BY_CHOICE[choiceId] ?? [];
  return pool.find(id => !missionFacts.includes(id) && !collected.includes(id))
    ?? pool.find(id => !missionFacts.includes(id))
    ?? null;
}
