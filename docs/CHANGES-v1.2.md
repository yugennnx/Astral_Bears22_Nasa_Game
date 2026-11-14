# Change Report — v1.2

**Original update:** November 14, 2026, commit `ca5b5ec`.
**Previous version:** `51431a5` (story plan v1.1 and initial JavaScript scene data).

> AI/SI provenance: the user confirmed Anthropic Claude assistance for v1.2. This English translation and audit annotations were produced with OpenAI ChatGPT/Codex. See [AI_USAGE.md](../AI_USAGE.md). Historical claims below describe that update; later source corrections are recorded in the compliance audit.

## Summary

| Change | Files | Balance Effect |
| --- | --- | --- |
| Replaced 2017 references with the curated May 2024 DONKI record and MEDA temperatures | Scene data, story plan | Science-card content only |
| Archived the ten-sol draft | Archive, README | None |
| Added low-power life support | Mission data, plan, checker | Standard-profile ending counts unchanged |
| Added mission profiles | Mission data, plan, checker | Each profile remains completable |
| Added a next-crew food/readiness report | Scene data, plan, contract | Does not change the ending classification |
| Updated reference checks for all three profiles | Checker | Verifies the new rule/data contract |

The earlier contributor also reported installing Node.js 26.13.1 on a teammate's computer. This audit does not independently verify that machine or the reported installation. The local audit environment runs Node.js 26.8.1.

## 1. NASA Data Cards

- Scene 5 gained DONKI record `2024-05-20T05:36:00-CME-001` and a separate NASA report of the May 2024 Mars radiation event.
- Scene 2 gained a MEDA temperature card to explain why batteries and heaters matter.
- `NASA_SOURCES` gained local summary-file references. The central PDS catalogue link is distinct from the source CSVs hosted by the PDS Atmospheres Node at New Mexico State University.
- The original update labeled the DONKI/Mars matching as an interpretation. The current audit tightens this: an event-level match has not been established; present the records independently.
- The current audit recalculates the MEDA summaries and records file hashes. Those corrections do not change gameplay scores.

The earlier numbered “rules” mentioned in the original report referred to prior chat design recommendations. They were not official numbered NASA regulations. The official requirements are linked in the current compliance audit.

## 2. Archived Design

The ten-sol `GAME_DESIGN.md` and Python simulator moved to `archive/ten-sol-design-v0/`. They remain historical material. The six-sol story plan and JavaScript scene module are the active design. NASA source summaries remain in `data/`.

## 3. Low-Power Life Support

If Energy after a decision is **2 or less**, the shared transition consumes **2 Oxygen instead of 1**. The interface must forecast this additional loss before selection and show DUTİ's low-power message.

The threshold and penalties are game assumptions, not measured engineering rates. In the standard profile the ending counts stay unchanged, although some final reserve values change.

## 4. Mission Profiles

| Profile | Dusty After Scenes | Starting E/O/S | Full / Partial / Stopped Paths |
| --- | --- | --- | --- |
| `standard` | 2, 4 | 8/8/8 | 103 / 219 / 41 |
| `dusty-season` | 2, 3, 4 | 8/8/8 | 95 / 214 / 51 |
| `small-oxygen-supply` | 2 | 8/7/8 | 77 / 199 / 45 |

Pick a profile at the start and show its briefing so players can plan. Every profile has dust after Scene 2 to support the power-shortage story. Panel maintenance adds one recharge point after every dusty stage: one, two, or three opportunities depending on the profile.

The checker finds a successful path containing each of the 17 choices in every profile, and maximum Science remains 8. These are counts of terminal decision paths, not success probabilities or proof of playtested difficulty.

Shared transitions now derive from `MISSION.recharge`, `MISSION.lifeSupport`, and the profile. Scene transitions retain only optional notes. The integration contract describes this ordering.

## 5. Longer-Term Report

The ending report shows full, limited, or interrupted fresh-food production for a future crew. The current crew's Safety indicator is separately described as an abstract operational margin. It is not a medical diagnosis and does not transfer one crew's health to another.

The greenhouse remains outside the mandatory victory conditions. Its long-term food outcome and final research reward make the earlier investment visible.

## 6. Validation and Remaining Work

Run `node tools/check_story_data.mjs` to check all profiles and the five documented standard-profile examples. The original contributor reported a separate numerical cross-check; this audit reruns the repository checker and does not claim human-authored independent testing.

The production engine, frontend, deployed playable prototype, final demo, and child usability tests remain future work. Images must be selected and attributed individually. Translation/localization infrastructure may be added later; English remains the submission language.
