# Compass Outpost: Ten Sols of Questions

A browser-based Mars outpost game for young learners, developed for the 2026 NASA Space Apps challenge [Build a Junior Astronaut Mission Trainer](https://www.spaceappschallenge.org/2026/challenges/junior-astronaut-mission-trainer/).

Players work with companion robot **DUTİ** to manage Energy, Oxygen and Safety over ten sols. Each choice has a cost or an opportunity cost. Earlier preparations affect later options, research and the final mission report. The game has 29 choices, three mission profiles and five discoverable special endings.

**Current version: 1.12.0.** English is the primary language; Turkish is optional. NASA observations are attributed archival examples. Resource points, forecasts, equipment stories and visitor encounters are fictional; they are not mission predictions or NASA discoveries.

[Current project status](docs/project-status.md) · [NASA data and learning map](docs/nasa-data-map.md) · [Submission checklist](docs/submission-checklist.md) · [AI/SI disclosure](AI_USAGE.md) · [References and rights](docs/compliance/references.md)

## Run locally

Requires Node.js 20 or newer and npm. No Python installation or build step is needed to play.

```sh
npm ci
npm start
```

Open **http://127.0.0.1:5173**. Any static web host can serve the game. Runtime libraries, fonts and NASA photographs are stored locally; the game makes no external data/API requests during play. Clicking a source link opens its external source.

The [29-second English project demo](docs/demo.md) is available, with public video URL, caption transcript and source/SI details. A direct deployed game URL has not been supplied in this repository. The official submission guide accepts a public repository as a final-project link; GitHub Pages is an optional hosting choice, not a separate eligibility requirement.

## Play

- Start a new mission, inspect its assigned profile and forecast in the briefing, then make one decision per sol.
- Read each cost before confirming. A reserve reaching zero stops the research mission; a refill later in the story cannot undo that stop.
- Complete the selected hands-on task. Use the Hint button when needed. Pointer, touch and keyboard controls are supported.
- Open the Mars Journal to revisit discoveries, fact cards and endings. Current-mission discoveries start fresh; the Journal preserves discoveries across missions.
- On reload, continue an unfinished mission or review a completed mission and its saved ending page.

Full success after Sol 10 requires at least **1 Energy, 1 Oxygen, 4 Safety and 10 Science**. Sol 6 is a research checkpoint, not the ending. An ordinary success is as valid as a special ending; there is no required ending-collection total. The visitor ending is explicitly labelled science fiction.

The intended audience is ages 7–12. Reading level, learning gains and typical session length have not been established by a target-age child playtest. No effectiveness claim is made from automated tests alone.

## Validate

```sh
npm run check
npx playwright install chromium
npm run check:browser
```

`npm run check` covers story data, the production engine, translations, an independent design enumeration, disclosure inventory and documentation links. `check:browser` covers real browser input, responsive activity controls, language switching, save/resume and ending persistence at four viewport sizes. See [test and maintenance instructions](docs/maintenance.md).

[GitHub Actions](.github/workflows/quality.yml) runs the checks and browser suite on pushes and pull requests. Passing local tests does not certify a hosted deployment, physical devices, child engagement, rights or competition eligibility.

Optional online scientific-source verification requires Python 3 and network access:

```sh
npm run verify:sources
```

## Source of truth

| Area | Current source |
| --- | --- |
| Decision rules, profiles and source cards | [src/game/scenes.js](src/game/scenes.js) |
| Pure decision engine | [src/game/engine.js](src/game/engine.js) |
| Ten-sol independent narrative design | [data/ten-sol-story-design.json](data/ten-sol-story-design.json) and [story plan](docs/design/ten-sol-story-plan.md) |
| State, transition and save contract | [story-data-contract.md](docs/design/story-data-contract.md) |
| Runtime integration and handoff | [ten-sol-implementation-handoff.md](docs/design/ten-sol-implementation-handoff.md) |
| Interface, tasks, sound and illustrations | [src/ui/](src/ui/) |
| English UI and optional Turkish translations | [src/i18n/](src/i18n/) |
| NASA summaries and source receipts | [data/](data/) and [NASA map](docs/nasa-data-map.md) |
| Chapter One / retired design history | [Sols 1–6 plan](docs/design/story-plan.md) and [archive/](archive/) |

Historical reports record their tested commit. They are not a current task list. Current open work is consolidated in [project status](docs/project-status.md).

## Attribution, storage and licensing

OpenAI ChatGPT/Codex and Anthropic Claude assisted with substantial story, code, translations, illustrations and verification. The team attests that it selected the underlying game idea. See [AI_USAGE.md](AI_USAGE.md) and [ai-usage.json](ai-usage.json) for scope; generated details are not presented as human-only work.

The optional player name, mission save, language/sound preferences and Journal are stored in this browser's local storage. They are not sent to a project server. Clearing this site's browser data removes them. Shared devices share this local profile; use a fictional commander name for demonstrations.

Project-original code and text are available under [Apache License 2.0](LICENSE), as authorized by the user on November 15, 2026. See [licensing scope and exclusions](LICENSING.md). NASA materials, vendored libraries and fonts retain their own terms and notices; no NASA branding rights or endorsement are granted. Review [references and rights](docs/compliance/references.md) before the final submission declaration.

This is an independent participant project. NASA references do not imply NASA endorsement.
