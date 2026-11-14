// AI-assisted generation: Anthropic Claude. See AI_USAGE.md and ai-usage.json.
// Checks that the optional Turkish interface covers every English string.
import assert from "node:assert/strict";
import { collectStoryStrings } from "./list_story_strings.mjs";
import { STORY_TR } from "../src/i18n/story.tr.js";
import { UI_EN, UI_TR } from "../src/i18n/ui.js";

const placeholders = text => (text.match(/\{\w+\}/g) ?? []).sort().join();

const story = collectStoryStrings();
for (const text of story) {
  const translated = STORY_TR[text];
  assert(typeof translated === "string" && translated.trim(), `Missing Turkish story text for: ${text}`);
  assert.equal(placeholders(translated), placeholders(text), `Placeholder mismatch in Turkish text for: ${text}`);
}
for (const key of Object.keys(STORY_TR)) {
  assert(story.includes(key), `Stale Turkish story entry (English text changed or removed): ${key}`);
}

assert.deepEqual(Object.keys(UI_TR).sort(), Object.keys(UI_EN).sort(), "Interface string keys differ between English and Turkish");
for (const [key, text] of Object.entries(UI_EN)) {
  assert(text.trim() && UI_TR[key].trim(), `Empty interface string: ${key}`);
  assert.equal(placeholders(UI_TR[key]), placeholders(text), `Placeholder mismatch in interface string: ${key}`);
}

// The companion's name keeps its spelling in both languages.
const dutiMentions = text => (text.match(/DUTİ/g) ?? []).length;
for (const text of story) assert.equal(dutiMentions(STORY_TR[text]), dutiMentions(text), `DUTİ spelling differs in: ${text}`);

console.log(`Translations verified: ${story.length} story strings and ${Object.keys(UI_EN).length} interface strings have Turkish text with matching placeholders.`);
