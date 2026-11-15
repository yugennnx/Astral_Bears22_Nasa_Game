# Changelog

> AI/SI disclosure: drafted with Anthropic Claude; ten-sol design notes added with OpenAI ChatGPT/Codex; ten-sol implementation (1.9.0) with Anthropic Claude; 1.10.0 play-test changes with Anthropic Claude. See [AI_USAGE.md](AI_USAGE.md) and [ai-usage.json](ai-usage.json).

All notable changes to this project. Gameplay numbers are fictional educational values; NASA observations are cited separately.

## 1.11.3 — Readable text, a working heater button, better Turkish (2026-11-15)

Fixes for the team's play test and an independent Antigravity review:

- Readability: the "Why?" line and DUTİ's memory counter used very light blue and lilac text on the cream dialog box. They now use dark text (dark teal on pale blue; dark purple), and the "Skip ahead" button has dark text on the cream box.
- Heater / grow-light button (Sols 2 and 3): it is now a real, focusable HTML button with a text label, placed over the device and never under the dialog (it moves above or below the dialog when needed, and always stays on screen). Pressing Next while it waits no longer moves it. The power room now shows a labelled heater.
- Turkish: removed choice codes such as "(5A)" and "1B'de"; fixed spelling and grammar ("mü", "rölenin", "maceramız"); replaced the unnatural "tın" with "zil sesi"; replaced "uydurma" with "kurgusal / oyun için seçilmiş"; rewrote all "Neden?" lines as natural sentences; consistent "N. Mars günü"; Turkish titles for NASA sources with "(İngilizce sayfa)"; several stiff sentences rewritten.
- Language switch: an open discovery line stays open and is translated; the Sol intro card is redrawn instead of skipping ahead.
- Phones: more space under the title buttons. A duplicate branch in the ending text was removed.
- Checked with `npm run check` and focused browser measurements (1280 × 650 and 375 × 812).

## 1.11.2 — Two layout fixes found in a visual audit (2026-11-15)

- Wide screens: in the slim exploration panel, the "I'm ready to decide" button covered the hint text and the discovery counter. The button now sits on its own full-width row; the panel keeps its narrow width, so the Sol 1 rover discovery stays free.
- Choice cards: a little space between the cost chips and the "Choose this" button of the selected card.
- Audit method: an automated overlap, clipping and language-mixing scan over a full English desktop game (1280 × 720) and a Turkish phone game (375 × 812, Sols 1–5). No other overlap, clipped text, English text in Turkish mode or raw text key was found. Checked with `npm run check`.

## 1.11.1 — Accessible task areas and complete live language refresh (2026-11-15)

- Give tasks a camera area clear of the actual HUD and instruction banner. Short landscape screens place instructions beside the task. Recompute the layout after a resize, Hint, feedback, progress or language change.
- Separate neighboring panel-cleaning, shelter and greenhouse targets, contain animated rings inside their hit areas, and keep Science stars/numbers inside the HUD. Preserve all game costs, rules, choices and ending predicates.
- Translate existing task art and accessible target labels in place, retaining progress, selected clues, power-cube allocation and displayed totals. Localize the sample, drawer and signal-delay labels; wrap the MEDA source note inside its panel.
- Keep the note-sequence task's wrong-answer explanation visible and its next-card Hint accurate for pointer and keyboard use. Keep the visitor fiction note visible on phone mission reports.
- OpenAI Codex implemented and browser-tested these fixes following the team's report on the Claude-assisted v1.11.0 implementation. See [the verification report](docs/design/ui-regression-1.11.1.md) and [AI_USAGE.md](AI_USAGE.md) for scope and limits.

## 1.11.0 — The Visitors Beyond the Window and clearer reasons (2026-11-15)

- The fifth special ending, [The Visitors Beyond the Window](docs/design/ten-sol-story-plan.md#planned-fifth-ending-the-visitors-beyond-the-window), is playable. It is an explicitly fictional science-fiction ending, labelled "Fictional science-fiction ending" with the note "This encounter is fictional. No extraterrestrial life has been confirmed." before page 1, on each page, in the report and in the Journal. It uses the predicate 2C 5B 7C 8C 9A 10A plus a normal success, has priority 5, and gives no resources, Science or rescue. Totals are unchanged; visitor histories are 23 (standard), 21 (dusty season) and 19 (small oxygen supply).
- Special endings now open as short pages (one idea per page, Back and Next, "Skip to the report", "Read the ending again"), then the mission report with its evidence. The visitor art is simple and drawn in code.
- New `src/ui/beats.js`: presentation-only mystery-light beats derived from the run's history. Sol 1 always shows the glint; Sols 2, 5, 7, 8 and 9 add lines only on the qualifying trail; the Sol 10 bridge appears only when the run will end with the visitors.
- Clearer reasons: each of the 29 choices has a one-sentence "Why:" line about its resource change; 2C shows the data source, date and unit (Perseverance MEDA, Sol 290, December 13, 2021, °C; past data, not a forecast). Two more thinking tasks: 7A puts the notes in the pattern's order, and 9A sorts clues into "Old relay" and "Our rock". The ending report explains more decision chains.
- Not added: a pre-choice "which resource will decrease" question (the choice cards already show costs) and a side-by-side "try the other choice" replay.
- Checked with `npm run check`; browser checking is left to the team reviewer.

## Unreleased — Visitor-ending story handoff (2026-11-15)

- OpenAI ChatGPT/Codex drafted [The Visitors Beyond the Window](docs/design/ten-sol-story-plan.md#planned-fifth-ending-the-visitors-beyond-the-window) at the team's request: conditional visual clues, a six-choice unlock, five short explicitly fictional encounter pages, scientific-uncertainty wording and an implementation checklist.
- The proposed predicate has successful witnesses in all three existing profiles and no overlap with the four current endings. The story plan records the numerical checks and their limits.
- Documentation and AI contribution records only. No runtime, JSON design, translation, resource value, save format, media or license changed. Version 1.10.3 remains the playable version; the fifth ending awaits Tuğra's implementation and browser verification.

## 1.10.3 — Full language refresh during tasks (2026-11-15)

Fix for the P3 observation in [docs/design/regression-review-326f941.md](docs/design/regression-review-326f941.md):

- Switching language during a task now also updates the page language (`<html lang>`, used by screen readers), the HUD resource labels (keeping the values on screen) and the whole task banner (progress text and Hint label), while keeping the current question, hint or retry message.
- Still open: the long special-ending screen, overall pacing and permanent automated browser tests. No rule or number changed. Checked with `npm run check`; browser checking is left to the team reviewer.

## 1.10.2 — Language switch keeps the current task prompt (2026-11-15)

Fix for the remaining finding in [docs/design/regression-review-5834e11.md](docs/design/regression-review-5834e11.md):

- P2: switching language during a thinking task (for example the second 2C question) now translates the prompt that is on screen (the current question, hint or retry message) instead of returning to the task introduction. Tasks now pass message keys, so the interface can re-translate them.
- Still open, as recorded in the review: the long special-ending screen, overall pacing, and permanent automated browser tests. No rule or number changed. Checked with `npm run check`; browser checking is left to the team reviewer.

## 1.10.1 — Fixes from the independent review (2026-11-15)

Fixes for the findings in [docs/design/repository-review-761bb66.md](docs/design/repository-review-761bb66.md):

- P1: the 2C difference question now shows its three answers (7°, 74°, 30°) inside the panel, below the task banner, with both readings as a reminder.
- P2: the Hint button receives clicks and taps (it inherited `pointer-events: none` from the banner) and is now a high-contrast yellow button.
- P2: the prediction questions and "Why?" lines no longer suggest that solar panels work at night. They describe one stage: the rest of today charges the battery in sunlight, then the battery runs the base through the night. The numbers are unchanged (English and Turkish).
- P2: in 2A, a wrong share of power cubes no longer shows the green "finished" banner or the success sound; only a correct share completes the task. The error text is dark red and readable on the light banner.
- P2: a fact card that was on screen but not yet collected is offered again after a reload.
- P2: the AI/SI account now states that the twelve 1.10.0 suggestions came from an OpenAI Codex-assisted review requested by the team; the team chose what to implement; Claude generated the implementation.
- P3: the saved player name is prefilled again on a new mission (a mission-profile variable no longer hides the player profile).
- P3: the ten-sol story plan and handoff are marked as the original design, implemented in v1.9.0, with a link to the integration notes.
- Layout: the third Sol 5 robot scan spot moved into view on phones.
- Not changed: the long special-ending screen, pacing, and automated browser checks for these cases (see the review). No rule or number changed. Checked with `npm run check`; browser checking is left to the team reviewer.

## 1.10.0 — Questions worth following (2026-11-15)

- The twelve suggestions behind this version came from an OpenAI Codex-assisted review requested by the team; the team chose what to implement, and Anthropic Claude helped implement it. No rule or number was changed.
- The game opens with a mystery: a tiny lantern shows up on Sol 1, and the spotlight invites the child to look closer before anything is explained.
- Fewer forced screens: story lines already seen are shown at once on replays, with a "Skip ahead" button, and spotlights that were already seen are skipped.
- Prediction questions appear only on interesting nights (dust, cleaned solar panels, low or full battery), plus once on Sol 1. The questions now say "from this evening to tomorrow morning".
- Varied thinking tasks: sharing three power cubes between the air machine, heater and lamp (wrong shares get a reason and a retry); finding a rock from two scanner clues; comparing two real Perseverance MEDA temperature readings (−3 °C and −77 °C) and working out the difference (74 degrees). Every task has a Hint button.
- Observe first: on Sols 2 and 3 the child taps the heater or the grow lights and watches the Energy gauge dip before DUTİ explains why.
- A notebook clue trail (the lantern trail) with five clues on Sols 1, 2, 4, 7 and 8. A clue says "I've seen this before!" when an earlier clue was already found, and the Mars Journal lists the trail.
- DUTİ remembers: up to two short lines per sol connect today with earlier choices and clues. They hint that earlier choices belong together, without naming any ending.
- Lasting traces of choices appear in the scenes: shelter crates, a rock sample jar, a plant pot for the greenhouse choice, a sticky note for Earth's advice, the lantern sign on the base, an old power log, an equipment list, a distant blinking lantern and a TOMORROW drawer.
- Fact cards appear only when they are new. After a prediction, the card is saved quietly and the morning summary shows a "New card saved in your Mars Journal" button.
- Clearer, faster replays and English and Turkish interface updated (61 new strings, 14 revised).
- Checked with `npm run check`; browser checks are recorded in the team's test notes.

## 1.9.0 — Ten sols of questions (2026-11-15)

- The game now plays ten sols. Sols 1–6 use the team's ten-sol framing and prose; Sols 7–10 are new, and a successful Sol 10 ends the mission.
- Sol 6 research review checkpoint: a one-time reserve (+2 Energy, +4 Oxygen) is released after the study and shown in the morning summary.
- Sols 7–10 add DUTİ spotlights, 12 discoveries and 12 hands-on tasks, reusing four existing locations.
- Sol 8 living-tray option is locked with a reason if the greenhouse was shut down.
- Science target is 10, and the dust forecasts are longer.
- Four hidden special endings are chosen from the run's own history. Each is shown with the story, "How your choices led here" and a replay hint.
- Endings are remembered in the Mars Journal without revealing undiscovered ones.
- The next-crew report shows the living tray when it was protected.
- New save version (`compass-outpost-save-v3`), so old six-sol saves are not reused.
- Checks: the engine now plays every ten-sol path and matches the team's independent model exactly. Profile totals (success / partial / stopped): standard 8064 / 14580 / 192; dusty-season 6598 / 13289 / 640; small-oxygen-supply 6395 / 13309 / 97.
- Turkish story and interface updated.
- Phones: with ten sols, the top bar shows small dots instead of numbered circles, and its buttons are a little smaller, so everything fits at 375 px.
- The "New ending discovered!" badge stays when the language is switched on the ending screen.
- Checked with `npm run check`; browser checks are recorded in the team's test notes.

## Ten-sol story design by the team (2026-11-15)

- Completed an English ten-sol narrative handoff: continuity/foreshadowing for Sols 1–6, four new scenes with twelve choices and feedback, and four specific-history special endings.
- Added a machine-readable design, explicit Sol 6 checkpoint supplies, a proposed Science target of 10, extended mission forecasts, ending precedence, and a save/UI integration checklist for Tuğra. The playable six-sol campaign is unchanged.
- Added exhaustive design enumeration, reachable ending witnesses for all three profiles, and file-level AI/SI disclosure. `npm run check` now also checks the proposed expansion.

## 1.8.0 — Easier to explore, more to wonder about (2026-11-15)

- Next by keyboard or click: Space, Enter, the right arrow or a click anywhere on the screen moves the story on (story lines, DUTİ's tips, discoveries, DUTİ's feedback, sol intro, night scene). Space and Enter also collect a fact card and start the next sol.
- Clear discoveries: every normal discovery has a pulsing dashed ring around the object and a bobbing star badge next to it. Secrets have no ring, only a rare tiny sparkle. Five discoveries were moved onto their drawings (spacesuit, rover, alarm light (the power-room warning lamp was moved lower so it is not hidden behind the gauges), light-speed signal, radiation rover). Tap areas are larger.
- Explore panel: shows one dot per discovery plus a secret slot. When every normal discovery is found, DUTİ says a secret is still hiding. On wide screens the panel is a slim corner panel, so the bottom of the scene is free. On phones the look-left and look-right buttons glow when something undiscovered is on that side.
- More curiosity: choice cards no longer show "Later" consequences or the overnight forecast. They show only the cost now and a red warning when a choice would stop the mission.
- Fact cards: kept in the Mars Journal across missions. The journal button shows a counter badge, and the journal opens with a Fact cards section of 16 cards; unknown cards show "?". Each choice now has a small pool of cards, so the same card never appears twice in one mission, and replays prefer new cards.
- Fewer repeats: six discovery texts that repeated a fact card were rewritten as outpost or general-science notes (spacesuit, Earth seen from Mars, robot driving, shelter soil, rover radiation sensor, lab glove box) and relabelled accordingly.
- Easier to reach: activity targets near the bottom edge (shelter boxes, rocks, Sol 5 crew and robot, scan spots, measuring poles, route flags) were moved up.
- Checked with `npm run check`; browser checks are recorded in the team's test notes.

## 1.7.0 — Sound and kinder endings (2026-11-15)

- Sound: soft game sounds and a gentle wind in the background. The game makes every sound itself while it runs, so there are no recordings or music files. Sound starts after the first tap. A sound on/off switch is in the top bar, and the choice is remembered on the device.
- Careful warnings: a choice that could stop the mission shows a red "Careful, Commander!" warning and a "Choose anyway" button. That choice no longer plays the task or confetti.
- Kinder endings: a failed mission shows "What happened" (only the problems) and "Ideas for next time" tips, with an encouraging line. No confetti after the risky outdoor task or after shutting down the greenhouse, and the closing lines say so honestly.
- Predictions fit the situation: clear sky, dust, cleaned panels, normal breathing and low battery each get their own question, and the morning summary explains why the guess was right or wrong.
- Exploration: each hotspot has its own numbered accessible label.
- Storm: on Sol 5 a red pulsing vignette shows the solar storm.
- Take cover: on Sol 5 who runs into the storm shelter depends on the choice. Shelter (5A): the player sends both astronauts and the robot inside, then the door closes. Robot (5B): the crew hurries inside by itself and the player drives the robot to each scan spot. Outdoor measurement (5C): the robot and one astronaut take cover, the other astronaut stays out until the measurements are done and then runs in.
- Interface: 27 new strings in English and Turkish. The signal-delay fact card now says the game uses 20 minutes.
- Story text: "Scene 5A/5B/6" references now say "Sol 5", "Sol 6" or "today". No rule or number changed.
- Checked with `npm run check`; browser checks are recorded in the team's test notes.

## 1.6.0 — Explore freely (2026-11-14)

- Free exploration: after DUTİ's spotlights, the child can tap anything in the location before deciding. Each location has five discoveries and one hidden secret (36 in total), with a short DUTİ line for each. Real facts are checked against NASA pages (Mars facts, MOXIE, Veggie, Perseverance samples, the May 2024 storm, the Curiosity sunset); story-world items are labelled as part of our outpost.
- Mars Journal: every discovery is saved on the device across missions; undiscovered items show as "?" so children want to look again.
- The child types their name in the briefing; DUTİ and the screens address them as Commander.
- Predict, then observe: after each decision DUTİ asks whether Energy or Oxygen will go up, stay the same or go down tonight; the morning summary shows whether the guess was right. The ending shows the number of correct guesses.
- Phones: look-left and look-right buttons to explore wide locations; morning summary in two columns on wide screens.
- Checked with the automated overlap test (now including hotspots) on full games at 1280 x 720 and 375 x 812, English and Turkish.

## 1.5.1 — Clean layout (2026-11-14)

- The "AI-assisted illustration" label moved from a fixed corner (where it covered dialogs and pop-ups) to a small line under the HUD.
- Pop-ups, task banners and top dialogs are placed below the HUD's real height.
- Phones: one compact HUD row (icon, number, bar; warning icon when low), short language button, unselected choice cards collapse to one line, compact briefing and ending.
- Short desktop screens (720 px high): briefing, choices and morning summary fit without scrolling.
- Activity targets that sat under the task banner or off-screen were moved (night-temperature graph, checklist, rocks).
- Checked with an automated overlap test on every screen of several full games, at 1280 x 720 and 375 x 812, in English and Turkish: no overlaps, no off-screen targets, no scrolling pop-ups.

## 1.5.0 — A scene for every choice (2026-11-14)

- Before each decision, DUTİ points at the parts of the location that matter (spotlight with a short explanation, e.g. how many battery bars are left).
- After each decision, the player does the chosen job by tapping the scene: 17 hands-on activities (clean the panels, carry boxes to the shelter, turn the oxygen valve, find the rock with crystals, draw the night-temperature graph, switch grow lights, send a message and wait for the reply, lead the crew into the shelter, plant flags on the new route, harvest plants, and more).
- After DUTİ's feedback, a collectible "Did you know?" fact card appears. Each card cites a NASA page that was checked on November 14, 2026 (MOXIE, Veggie, Mars facts, Perseverance samples, signal delay, the May 2024 solar storm, MEDA temperatures). The ending shows how many cards were collected.
- New NASA sources in the scene module: MOXIE (2023), Mars facts, Perseverance rock samples.
- Game rules and resource values are unchanged; activities are presentation only.

## 1.4.0 — Immersive redesign (2026-11-14)

- Full-screen game with no page scrolling: story, choices, results and transitions open as pop-ups; tap anywhere (or press Space) to continue.
- Every sol now happens in its own location: Mars seen from space (title), landing site, power room, greenhouse, radio room, solar storm outside, and the crater rim over a real NASA panorama (PIA26373).
- New animations: scene title cards, typewriter dialog with DUTİ, cards dealt in, numbers that fly into the gauges, a sunset–night–sunrise time-lapse between sols, and location details that react to choices and resources (battery cells, oxygen tank, grow lights, cleaned panels, travelling message).
- Turkish rewritten in simple, natural language for children; "sol" is shown as "Mars günü" because "sol" also means "left" in Turkish.
- A visible "AI-assisted illustration" label stays on screen during play.

## 1.3.0 — Playable prototype (2026-11-14)

- Added the decision engine (`src/game/engine.js`), verified path-by-path against the reference model (`npm run check:engine`).
- Added the browser game (`index.html`, `src/ui/`): title, briefing, six scenes, feedback, transitions, NASA science cards, ending report, save/resume, phone and desktop layouts.
- English is the primary language; Turkish is an optional interface language (`src/i18n/`).
- DUTİ and the outpost are original SVG drawings made in code. Three NASA photographs (PIA19400, PIA26373, PIA24765) are credited in the game.
- Vendored open-source libraries: Anime.js 4.5.0 (MIT), canvas-confetti 1.9.4 (ISC), Fredoka typeface (OFL-1.1).
- Run locally with `npm start`, then open http://localhost:5173.

## 1.2.1 — Repository structure (2026-11-14)

- Grouped documentation: `docs/design/` (story plan, data contract), `docs/compliance/` (rules audit, references), `docs/changelog/` (detailed release notes).
- Renamed curated data files to kebab-case: `data/nasa-events.json`, `data/meda-jezero.json`.
- Added `package.json` (`npm run check`), `.gitattributes` (LF; `data/raw/**` kept byte-exact) and `.editorconfig`.
- Updated every path reference, the provenance inventory and README. No gameplay values, story text or data values changed.
- Follow-up from the Codex review of `e0e4e60`: fixed the remaining `story-plan.md` path in the `src/game/scenes.js` header, added `.gitignore`, `.gitattributes` and `.editorconfig` to `ai-usage.json`, and extended `tools/check_disclosures.mjs` so repository dotfiles also require file-level provenance.

## 1.2 — Compliance and AI/SI audit (`ad37f8c`)

- Added AI/SI disclosure (`AI_USAGE.md`, `ai-usage.json`, `AGENTS.md`), official 2026 rules audit and references inventory.
- Saved the unmodified DONKI API response with SHA-256; recomputed MEDA summaries with source-file hashes.
- More conservative science wording: the DONKI record and the Mars article are presented as independent examples.

## 1.2 — Real NASA data and mission profiles (`ca5b5ec`)

- Replaced the 2017 solar event with the May 2024 DONKI CME record and the Curiosity RAD finding; added a MEDA temperature card.
- Added low-power life support, three mission profiles and the next-crew readiness report. Details: [docs/changelog/v1.2.md](docs/changelog/v1.2.md).

## 1.1 — Six-scene story and scene data (`fe4703d`, `51431a5`)

- Six-scene story plan with DUTİ, JavaScript scene data, integration guide and reference checker.

## 0.1 — Initial ten-sol design (`d304c77`) — archived

- Retired design and Python simulator, kept in [archive/ten-sol-design-v0/](archive/ten-sol-design-v0/).
