# Ten-Sol Story: Implementation Handoff

> AI/SI disclosure: generated with OpenAI ChatGPT/Codex. See [AI_USAGE.md](../../AI_USAGE.md) and [ai-usage.json](../../ai-usage.json).

**Date:** November 15, 2026. **Recipient:** Tuğra. **Status:** original implementation-ready design. **Implemented** in v1.9.0 (November 15, 2026); see [the integration notes](ten-sol-integration-notes.md) for the implementation and the intentional differences.

**Next story task (November 15):** implement [The Visitors Beyond the Window](ten-sol-story-plan.md#planned-fifth-ending-the-visitors-beyond-the-window), the proposed fifth ending. Its appendix contains the complete English story insertions, six-choice predicate, five short ending pages, visible fiction labels, all-profile numerical witnesses and acceptance checklist. It is **design-only**, not included in v1.10.3, the current JSON or the four-ending runtime. The original handoff below is historical implementation context; use the integration notes for current runtime status and the new appendix for this next change. No costs or success requirements change.

Read [the complete English story](ten-sol-story-plan.md), [the JSON design](../../data/ten-sol-story-design.json), and [the balance report with complete example playthroughs](ten-sol-balance-report.md). This continuation is based on the six-sol v1.6.0 prototype, not the archived original ten-sol simulator.

## Package and source of truth

- The story plan supplies all ten scene introductions, the existing first-six choice tables and conditional rules, twelve new choices with feedback, four complete special endings, and ordinary outcomes.
- The JSON is the machine-readable design source for the new prose, costs, flags, forecast, checkpoint, ending conditions, and outcome text. Its `status` is deliberately `design-only-not-loaded-by-runtime`.
- Existing first-six mechanical definitions still come from `src/game/scenes.js` at the JSON's `baseCommit`. `sceneOverrides` replaces prose/title and, on Sol 6, the next scene and transition. Do not treat it as a replacement for the entire existing scene or its choices.
- Apply `choiceTextOverrides` by existing choice ID after preserving those mechanical definitions. These prose-only overrides replace outdated references to the final day with the Sol 6 research review, including the full 5C risk warning. They never change costs, flags, variants, or requirements. All other first-six feedback remains as in the base scene module.
- `scenes` contains the four new scene definitions. `variants` retain the current first-matching flag override behavior; an override's `effects` replaces the whole effect object.
- `requiresAnyChoice` is a **new design field**, currently used only by 8A. It requires at least one listed ID in this mission's history. The present runtime does not implement it. Its `unavailableReason` must appear on the disabled card. This field is not an alternative way to earn Science or change greenhouse state.
- `initialFlags` adds five state fields to the existing ones; `checkpointSuppliesReleased` guards the reserve event. Current `finalTask` values stay for the Sol 6 research task; `finalAction` records the Sol 10 choice. Do not replace one with the other.
- `allChoices` and `anyChoiceGroups` are ending predicates. Every `allChoices` ID is required; each OR group needs at least one ID. `priority` selects one result deterministically if future designs introduce overlap. The current four have no overlap.
- The balance checker is a proposed-design enumerator, independent of the production engine. Passing it does not mean the new campaign has been implemented or browser-tested.

## Integration order

1. Add a distinct ten-sol campaign/edition identifier and save version. Keep existing six-sol saves readable as the old edition, or offer an explained new-game option. Never reinterpret an old completed save as a ten-sol mission or fabricate missing decisions.
2. Bring the new title, ten-sol opening, Science target **10**, final requirements, three extended forecasts, flags, scene order, and source-qualified credits into the campaign data. Preserve the original seventeen choice IDs and costs. Provide every flag-dependent label and Science reward as a resolved card.
3. Apply the revised first-six introductions and foreshadowing. Replace active references to Sol 6 as the final day with the first research review. Keep 4A's delayed Earth reply and 5C's full risk warning. Keep both existing NASA science cards and their complete qualifications.
4. Make Sol 6 a checkpoint. Keep `final-mission` as its scene ID for compatibility but display **The First Research Review**. After the immediate decision, stop if any resource is 0. Cache the post-decision Energy. Finish the actual study feedback and delayed flags. If the mission survives, release Energy +2 / Oxygen +4 exactly once and show its two feedback cards. Clamp the supplies, then apply the usual shared transition using the cached Energy for the low-power rule. Open Sol 7 only after the transition is acknowledged. Include the supply release and full overnight result in every Sol 6 forecast. Do not evaluate success at this checkpoint.
5. Add new Sols 7–10 and their activities. Resolve `earthGuide` on 7B, `shelterPrepared` on 8B, and the greenhouse/history gate on 8A before displaying options. Optional activities, prediction answers, and discovered hotspots never change the numerical effects or ending predicates. New scene `transition` objects mean the normal shared rules; Sol 10 has `transition: null`.
6. After the Sol 10 action and feedback, apply **no transition**. First honor a resource stop. If final requirements fail, show partial completion. Otherwise evaluate special predicates against this run's valid, ordered ten-choice history; show one matching ending, or ordinary success. A history must contain exactly one valid choice from each sol, in order, with no duplicates. Do not trust arbitrary restored flags as proof of an earned ending.
7. Add English UI strings and the optional Turkish translation in sync with the game's chosen language support. Update scene locations, DUTİ spotlights, prediction/morning-summary language, exploration, fact-card mappings, and responsive layouts. No new factual NASA card is supplied by this design; story-world props must remain labeled as fiction rather than NASA discoveries.
8. Extend the independent reference/engine comparison to ten sols for the new edition. Preserve the old six-sol checks while it is supported. Test the paths in the balance report, invalid saves, duplicate acknowledgements, 8A after a shut-down greenhouse, Sol 6 exact depletion, the low-power snapshot before supply release, and Sol 10 without overnight consumption. Then test complete English/Turkish games at desktop and phone sizes.

## Ending presentation

Show the special ending's ordered `story`, factual `evidence` connections, and gentle `replayHint`. The `scienceBoundary` field is an editorial guardrail: do not turn fictional hypotheses or equipment into real NASA discoveries. It may be summarized in a story-world information panel; it is not a cost or unlock condition.

Show actual resources, Science / 10, and the inherited next-crew food/safety report. Add a separate living-tray line only if 8A actually occurred. A protected tray is not a full food supply, and the existing food report does not prove that 6C was performed. A special ending is a narrative result; it grants no extra Science or supplies.

Use a separate local-storage ending journal for the new edition. It may remember discovered pages across runs, but current ending selection must use only current-run history. Before discovery, conceal titles, recipes, and total ending count. Show one “Another story?” invitation rather than a fixed grid revealing all four. Support normal replay without requiring all endings, randomized luck, timed secret clicks, or an unsafe decision.

For a partial ending, substitute the actual Science and/or Safety shortfall into supportive text. For an early stop, show the actual reason and emergency-procedure framing. Do not claim that a depleted reserve refills or that the crew has died.

## Acceptance checks already completed for the design

Run from the repository root:

```sh
npm run check:expansion
npm run check
git diff --check
```

The first command enumerates legal proposed paths for each mission profile, requires every one of the 29 choices to appear on a successful path, and requires ordinary success plus every special ending to be reachable in every profile. It also rejects special-ending overlaps, checks required-choice predicates, verifies the story/JSON prose, and checks the checkpoint and greenhouse gate boundaries. Exact counts and witnesses are in the balance report. These checks assess the numerical/story design, not its eventual interface or child engagement.

This delivery changes no live six-sol engine, scene data, translation, artwork, or saved game. Tuğra can implement the continuation without having to infer missing costs, resource timing, or ending conditions.
