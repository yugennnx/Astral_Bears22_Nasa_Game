# Current Implementation Handoff

> AI/SI disclosure: current handoff rewritten with OpenAI Codex. The original design and Claude-assisted implementation remain credited in [AI_USAGE.md](../../AI_USAGE.md) and [ai-usage.json](../../ai-usage.json).

**Current release: 1.12.0.** The ten-sol game and all five special endings are implemented. This is a maintenance handoff, not a request to reimplement the former six-sol prototype or the visitor ending.

## Read in this order

1. [Project status](../project-status.md): what works, what was verified and what still needs team action.
2. [Runtime and save contract](story-data-contract.md): state, decision order, transitions, checkpoint, gates and persistence.
3. [Story plan](ten-sol-story-plan.md) and [independent JSON design](../../data/ten-sol-story-design.json): narrative and numerical intent.
4. [NASA data map](../nasa-data-map.md): observations versus fiction and their use in play.
5. [Maintenance](../maintenance.md): local setup, tests and change procedure.
6. [Submission checklist](../submission-checklist.md): official form requirements and human decisions, distinct from code readiness.

## Preserve

- Ten sols, 29 choices, Science target 10 and the current three resource profiles.
- Low-power life support, exact-depletion warnings, delayed Earth guidance, once-only Sol 6 reserve and Sol 8 greenhouse gate.
- Five current-history ending predicates. The visitors are fictional, offer no bonus or rescue and require the safe remote-robot action 5B.
- English completeness, Turkish parity, source/archival qualifications, visible AI illustration labels and visitor fiction notes.
- Separate current-mission discoveries and persistent Journal; register a special ending before its reading flow can be interrupted.
- Valid in-progress saves and completed ending-page/report review. Reject unknown scenes and malformed special-ending saves.

## Where changes belong

| Change | Files |
| --- | --- |
| Game rule or choice effect | `src/game/scenes.js`, independent JSON design and both numerical checkers; recalculate and review before editing values |
| Story prose | Story plan, runtime scene module, JSON design when represented there, and Turkish story translation |
| UI-only mystery lines | `src/ui/beats.js` and English/Turkish interface strings |
| Task/control rendering | `src/ui/activities.js`, `src/ui/app.js`, `src/ui/styles.css`, browser tests |
| NASA claim/source | Curated summary, source receipts, source cards, references and NASA data map; do not alter raw originals |
| New AI-assisted file | File-level notice, `AI_USAGE.md`, `ai-usage.json`; label generated media appropriately |

Run `npm run check`, `npm run check:browser` and `git diff --check` before publishing. The CI workflow repeats numerical/documentation checks and Chromium tests. Do not present a workflow as passed until its actual run is green.

The old integration history is preserved in [integration notes](ten-sol-integration-notes.md), dated reports and Git history. They describe earlier commits; they are not current feature gaps. See [project status](../project-status.md) for the active backlog.
