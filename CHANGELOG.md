# Changelog

> AI/SI disclosure: drafted with Anthropic Claude. See [AI_USAGE.md](AI_USAGE.md) and [ai-usage.json](ai-usage.json).

All notable changes to this project. Gameplay numbers are fictional educational values; NASA observations are cited separately.

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
