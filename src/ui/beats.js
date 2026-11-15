/**
 * The mystery-light beats from the team's "Visitors Beyond the Window" design
 * (docs/design/ten-sol-story-plan.md, appendix generated with OpenAI ChatGPT/Codex).
 * They are short observations added after existing story or feedback lines. They never add
 * a decision, cost, reward or flag; conditions use only this mission's own choice history.
 * Texts live in src/i18n/ui.js ("beat.<id>").
 * AI-assisted generation: Anthropic Claude. See AI_USAGE.md and ai-usage.json.
 */

export const VISITORS_ID = "the-visitors-beyond-the-window";

const N = "narrator";
const D = "duti";
const line = (speakerId, beat) => ({ speakerId, beat });

/** Lines after a scene's story (Sol 1: the first glint, shown in every run). */
export function storyBeats(sceneId) {
  if (sceneId === "welcome-to-mars") return [line(N, "beat.sol1.a"), line(D, "beat.sol1.b")];
  return [];
}

/**
 * Lines after DUTİ's feedback for the choice just made. `history` already includes it.
 * `endsWithVisitors()` checks (without changing state) whether this run will end with the visitors.
 */
export function feedbackBeats(choiceId, history, endsWithVisitors = () => false) {
  const has = (...ids) => ids.every(id => history.includes(id));
  switch (choiceId) {
    case "2C": return [line(N, "beat.sol2.a"), line(D, "beat.sol2.b")];
    case "5B": return has("2C") ? [line(N, "beat.sol5.a"), line(D, "beat.sol5.b")] : [];
    case "7C": return has("2C", "5B") ? [line(D, "beat.sol7.a"), line(N, "beat.sol7.b")] : [];
    case "8C": return has("2C", "5B", "7C") ? [line(N, "beat.sol8.a"), line(D, "beat.sol8.b")] : [];
    case "9A": return has("2C", "5B", "7C", "8C") ? [line(N, "beat.sol9.a"), line(D, "beat.sol9.b")] : [];
    case "10A": return has("2C", "5B", "7C", "8C", "9A") && endsWithVisitors()
      ? [line(D, "beat.sol10.a"), line(N, "beat.sol10.b"), line(D, "beat.sol10.c")] : [];
    default: return [];
  }
}
