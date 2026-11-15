# Ten-Sol Design Balance Report

> AI/SI disclosure: generated with OpenAI ChatGPT/Codex by the design checker. See [AI_USAGE.md](../../AI_USAGE.md) and [ai-usage.json](../../ai-usage.json).

**Date:** November 15, 2026. These are exhaustive results for the proposed design, not the playable runtime or a child playtest. All scores are fictional. Reproduce with `npm run check:expansion`; regenerate with `node tools/check_ten_sol_design.mjs --write-report`.

A stopped branch is counted when it stops; its unplayed future choices are not expanded. Success/partial counts are full ten-decision histories.

## standard

Success: 8064; partial: 14580; stopped branches: 192. Maximum reachable final Science: 15.

| Ending | Successful histories | One complete witness | Final E / O / S | Science |
| --- | --- | --- | --- | --- |
| the-stone-that-kept-time | 60 | 1A → 2B → 3A → 4C → 5A → 6A → 7A → 8A → 9A → 10A | 4 / 3 / 8 | 11 |
| the-smallest-garden | 220 | 1A → 2A → 3A → 4A → 5B → 6C → 7B → 8A → 9A → 10B | 5 / 4 / 8 | 10 |
| dutis-secret-constellation | 28 | 1B → 2A → 3A → 4B → 5A → 6B → 7B → 8B → 9B → 10C | 5 / 4 / 9 | 10 |
| the-lantern-network | 14 | 1A → 2A → 3A → 4A → 5B → 6A → 7B → 8C → 9A → 10A | 5 / 4 / 8 | 10 |
| the-visitors-beyond-the-window | 23 | 1A → 2C → 3A → 4A → 5B → 6C → 7C → 8C → 9A → 10A | 7 / 3 / 8 | 10 |
| ordinary-success | 7719 | 1A → 2A → 3A → 4A → 5A → 6B → 7A → 8A → 9A → 10A | 4 / 2 / 8 | 10 |

## dusty-season

Success: 6598; partial: 13289; stopped branches: 640. Maximum reachable final Science: 15.

| Ending | Successful histories | One complete witness | Final E / O / S | Science |
| --- | --- | --- | --- | --- |
| the-stone-that-kept-time | 48 | 1A → 2B → 3A → 4C → 5A → 6A → 7A → 8A → 9A → 10A | 4 / 3 / 8 | 11 |
| the-smallest-garden | 161 | 1A → 2A → 3A → 4A → 5B → 6C → 7B → 8A → 9A → 10B | 5 / 4 / 8 | 10 |
| dutis-secret-constellation | 27 | 1B → 2A → 3A → 4B → 5A → 6B → 7B → 8B → 9B → 10C | 3 / 2 / 9 | 10 |
| the-lantern-network | 14 | 1A → 2A → 3A → 4A → 5B → 6A → 7B → 8C → 9A → 10A | 5 / 4 / 8 | 10 |
| the-visitors-beyond-the-window | 21 | 1A → 2C → 3A → 4A → 5B → 6C → 7C → 8C → 9A → 10A | 7 / 3 / 8 | 10 |
| ordinary-success | 6327 | 1A → 2A → 3A → 4A → 5A → 6B → 7A → 8A → 9A → 10A | 4 / 2 / 8 | 10 |

## small-oxygen-supply

Success: 6395; partial: 13309; stopped branches: 97. Maximum reachable final Science: 15.

| Ending | Successful histories | One complete witness | Final E / O / S | Science |
| --- | --- | --- | --- | --- |
| the-stone-that-kept-time | 48 | 1A → 2B → 3A → 4C → 5A → 6A → 7A → 8A → 9A → 10A | 4 / 2 / 8 | 11 |
| the-smallest-garden | 175 | 1A → 2A → 3A → 4A → 5B → 6C → 7B → 8A → 9A → 10B | 5 / 3 / 8 | 10 |
| dutis-secret-constellation | 15 | 1B → 2A → 3A → 4B → 5A → 6B → 7B → 8B → 9B → 10C | 6 / 3 / 9 | 10 |
| the-lantern-network | 8 | 1A → 2A → 3A → 4A → 5B → 6A → 7B → 8C → 9A → 10A | 5 / 3 / 8 | 10 |
| the-visitors-beyond-the-window | 19 | 1A → 2C → 3A → 4B → 5B → 6A → 7C → 8C → 9A → 10A | 5 / 3 / 8 | 10 |
| ordinary-success | 6130 | 1A → 2A → 3A → 4A → 5A → 6B → 7A → 8A → 9A → 10A | 4 / 1 / 8 | 10 |

All 29 choices appear on at least one successful history in each profile. Each special ending's required decisions are necessary for its predicate. There is no overlap among the five special predicates. Checkpoint depletion, pre-release low-power calculation, and the unavailable greenhouse-tray option were checked explicitly. The reference checker also verifies that the story and JSON prose agree.
