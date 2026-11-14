/**
 * Language helper. English is the default; Turkish is optional and falls back to English.
 * AI-assisted generation: Anthropic Claude. See AI_USAGE.md and ai-usage.json.
 */
import { UI_EN, UI_TR } from "./ui.js";
import { STORY_TR } from "./story.tr.js";

export const LANGUAGES = ["en", "tr"];
let current = "en";

export const getLanguage = () => current;
export function setLanguage(language) {
  current = LANGUAGES.includes(language) ? language : "en";
  return current;
}

const fill = (text, values = {}) => text.replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match));

/** Interface string by key. */
export function t(key, values) {
  const table = current === "tr" ? UI_TR : UI_EN;
  return fill(table[key] ?? UI_EN[key] ?? key, values);
}

/** Story string from the scene module (English text is the key). */
export function ts(text, values) {
  if (typeof text !== "string") return "";
  const translated = current === "tr" ? STORY_TR[text] ?? text : text;
  return fill(translated, values);
}

/** "+1", "−2" or "0" with a real minus sign. */
export function signed(value) {
  if (value > 0) return `+${value}`;
  if (value < 0) return `−${Math.abs(value)}`;
  return "0";
}
