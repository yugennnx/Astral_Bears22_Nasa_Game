# Play-Test Suggestions: Status After v1.10.0

> AI/SI disclosure: written with Anthropic Claude for the team. See [AI_USAGE.md](../../AI_USAGE.md) and [ai-usage.json](../../ai-usage.json).

**Date:** November 15, 2026 · **For:** the teammate who wrote the twelve play-test suggestions · **Version checked:** v1.10.0 (commit `69d0d55`)

This note lists each suggestion, what is now in the game, what is still missing, and where to look in the code. Rules and numbers did not change: `npm run check:engine` still matches the independent ten-sol model exactly.

**Legend:** Done = implemented as suggested. Partly = started, with clear gaps. Team = not something code can do.

| # | Suggestion | Status |
| --- | --- | --- |
| 1 | Leave a small unanswered question in the first scene | Done |
| 2 | Fewer forced screen changes | Partly |
| 3 | Vary the thinking in activities, not only the tapping | Partly |
| 4 | Discovered objects matter again later (journal → research notebook) | Done for the lantern trail |
| 5 | DUTİ lets the child observe before explaining; hints on request | Partly |
| 6 | Make visual consequences lasting and noticeable | Done |
| 7 | Not every sol in the same rhythm | Partly |
| 8 | Tie the relationship with DUTİ to choices | Partly |
| 9 | Hint at the special endings, hide the recipes | Done |
| 10 | Show why resources change, and over which time span | Done |
| 11 | Shorten familiar explanations on replay | Done |
| 12 | Observe a few children first | Team |

## 1. Opening mystery — Done

- On Sol 1 DUTİ's third spotlight points at a tiny lantern painted on the base: "I have no idea! Can we find out together?"
- Tapping it adds the first entry to the research notebook.
- A small answer arrives a few minutes later, on Sol 2: the same lantern on an old power log, "Survey team, lantern route". The lantern is a team sign, but who were they?
- Code: `SPOTLIGHTS["welcome-to-mars"]` in `src/ui/activities.js`; clue `lantern-mark` in `src/ui/discoveries.js`; art `lanternMark()` in `src/ui/world.js`.

## 2. Fewer forced screens — Partly

Done:
- The prediction question appears only on nights worth comparing (dust, cleaned panels, very low battery, full battery), plus once on Sol 1 to teach it.
- A fact card stops the flow only when it is new. After a prediction night, the card is saved quietly and the morning summary shows a "New card saved in your Mars Journal" button.
- On replays, see item 11.

Missing:
- The chain itself is unchanged: story → spotlights → exploration → choice → task → result → (prediction or card) → night → morning summary. Explanations were not merged, and the morning summary was not moved into the journal.
- Code: `needsPrediction()`, `showFact()`, `saveFactQuietly()` in `src/ui/app.js`.

## 3. Thinking tasks — Partly

Done (three new task types, plus a Hint button on every task):
- **2A — share energy:** give three power cubes to the air machine, heater and lamp. A wrong share gets a reason ("The lamp can wait until morning") and a retry.
- **2B — deduce from clues:** find the rock with stripes AND a blue sparkle. Each wrong rock says what is missing.
- **2C — compare real data:** two real Perseverance MEDA readings (−3 °C and −77 °C). Which one is the night, and how many degrees colder (74)?

Missing:
- The other 26 tasks are still tap-the-targets tasks.
- Good next candidates:
  - 7A: put the three notes in order.
  - 9A: match clues to the relay or the rock.
  - 4B: order a checklist by priority.
  - 10B: choose what fits in the capsule.
- Code: `shareEnergy`, `deduceRock`, `compareReadings` and `pulseHint` at the end of `src/ui/activities.js`.

## 4. Clues that come back — Done for the lantern trail

- Five notebook clues: Sol 1 (base), Sol 2 (power log), Sol 4 (equipment list: "Relay test: three notes"), Sol 7 (a distant blinking lantern), Sol 8 (the TOMORROW drawer).
- When an earlier clue was found, DUTİ starts with "I've seen this before!".
- The Mars Journal opens with "Research notebook: the lantern trail". Missing clues show "?" and the sol to search.
- Missing: the other discoveries do not return later. Only this one trail exists.
- Code: `kind: "clue"` and `thread: "lantern"` in `src/ui/discoveries.js`; `discover()` and `journalModal()` in `src/ui/app.js`.

## 5. Observe first, hints on request — Partly

Done:
- On Sol 2 (heater) and Sol 3 (grow lights), DUTİ first asks the child to tap the device and watch the Energy gauge.
- The gauge visibly dips. Only then does DUTİ explain: "Did you see? The Energy bar dipped…". This is visual only and costs nothing.
- Every task has a "?" Hint button.

Missing: only two devices work this way. The oxygen machine, the radio dish and others still explain first.

Code: `observe` entries in `SPOTLIGHTS`; `observeDevice()` in `src/ui/app.js`.

## 6. Lasting traces of choices — Done

| Earlier choice | Later trace |
| --- | --- |
| Shelter prepared (1B) | Crates beside the shelter (landing site, storm) |
| Rock sample (2B) | A "SOL 2" sample jar (power room, radio room, crater rim) |
| Greenhouse choice | A plant pot that is full, small or empty |
| Earth's advice (4A) | A sticky note on the radio screen |

The greenhouse lights and leaves already showed the greenhouse choice before this version.

Code: `memoryProps()` in `src/ui/world.js`.

## 7. Different rhythm per sol — Partly

- Done: the prediction/card loop no longer repeats every sol. Sol 6 also has its own rhythm (the reserve compartment, no prediction).
- Missing: distinct day types. Examples: a sol that opens with an unexpected message, a short calm maintenance sol, a quick research sol.

## 8. DUTİ remembers — Partly

- Done: after the story, DUTİ adds up to two "DUTİ remembers" lines linked to earlier choices and clues. New lines are marked "new!". Small jokes are included ("…they would, if plants could talk.").
- Missing: optional conversations the child can start with DUTİ.
- Code: `src/ui/memories.js` (22 lines across Sols 2–10).

## 9. Hints toward special endings — Done

- Memory lines hint without naming any ending. Examples:
  - "Our striped stone and the three-note pattern… same chapter?"
  - "A relay and an old cassette… a chain of lanterns?"
  - "My pictures are back!"
- The ending screen shows which earlier choices came together ("How your choices led here").
- The replay invitation reads "Another story might be waiting…", not "Collect all endings".

## 10. Clear time span for predictions — Done

- Every question starts "From this evening to tomorrow morning…".
- Every "Why?" line names the same span, so a rising Energy after a clear night is explained, not memorised.

## 11. Faster replays — Done

- Story lines already read appear at once, with a "Skip ahead" button.
- Spotlights already seen are skipped.
- Fact cards already collected do not stop the game.
- New memory lines are marked "new!", so what changed because of a different choice stands out.

## 12. Observe children — Team

This is the most useful item, and no code can replace it. Suggested questions for a session:
- Where does the child ask for help?
- Which dialogue do they skip quickly?
- Which object do they return to by themselves?
- What are they still curious about after playing?

## How the work was checked

- `npm run check`: story data, engine against the independent ten-sol model, Turkish for every string, and disclosures. It passes, and `git diff --check` is clean.
- An automated browser run (1280 × 720, English, Sols 1–7) passed:
  - the Sol 1 lantern spotlight and clue, the "DUTİ remembers" line and the Sol 2 observe step;
  - "I've seen this before!" on the second clue;
  - the 2B clue task, its mismatch messages and the Hint button;
  - predictions only on Sols 1–2, both with the new wording;
  - shelter crates on Sol 5 and the sample jar on Sol 6;
  - the research notebook in the journal;
  - "Skip ahead" on a replay.
- Not checked in a browser yet:
  - phone size (375 × 812) for v1.10.0;
  - a full Turkish game;
  - tasks 2A and 2C played by hand.

## Suggested next steps

1. Before submission (required): publish with GitHub Pages and test the link without login; make the 30-second English demo.
2. Play with one or two children (item 12).
3. Then, in this order: more thinking tasks (item 3), distinct sol types (item 7), more observe-first devices (item 5).
