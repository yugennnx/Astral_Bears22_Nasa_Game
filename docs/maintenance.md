# Development and Maintenance

> AI/SI disclosure: prepared with OpenAI Codex. See [AI_USAGE.md](../AI_USAGE.md) and [ai-usage.json](../ai-usage.json).

## Local commands

Requires Node.js 20 or newer. Install the exact development dependency tree with `npm ci`, then run `npm start`. The local static server binds to 127.0.0.1:5173, supports GET/HEAD, disables caching and blocks paths outside the repository and dot/dependency directories. It is a development helper, not a production backend.

```sh
npm ci
npm run check
npx playwright install chromium
npm run check:browser
```

The game itself needs only static hosting and has no build step or runtime dependency installation. Python 3 is optional for `npm run verify:sources`, which re-downloads NASA/PDS records and can fail because of external network/archive changes. Do not update data hashes merely to make a changed archive response pass.

For an existing Chrome installation, browser tests can use `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` instead of the Playwright browser download. For example in PowerShell:

```powershell
$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
npm run check:browser
```

Most browser tests use reduced motion and four Chromium viewports: 1280×720, 375×812, 360×640 and 844×390; phone projects enable touch emulation. They are not physical-device, Safari/Firefox or screen-reader pronunciation tests. The suite uses real controls and isolated browser storage, including interrupted endings, invalid saves and cross-mission discovery persistence. Fixtures construct reachable pre-task engine states rather than inventing resource values. A normal-motion keyboard smoke test checks Enter/Space and live language in the MEDA task at all four viewports. Separate fresh-browser tests play all ten sols in English and Turkish at each viewport, including first-use NASA cards and the visitor pages. These focused routes do not enumerate every browser campaign or replace child studies.

Run one case with `npm run check:browser -- --project=phone --grep 'ending visitors'`. View the local HTML report with `npx playwright show-report`. Reports/traces/screenshots are ignored by Git; failure artifacts can contain fictional test names and source paths and should be reviewed before sharing.

## Checks and independence

| Command | Scope |
| --- | --- |
| `check:story` | Scene data, conditional feedback, source metadata and Chapter One paths |
| `check:engine` | Production engine paths, invariants, effects, forecasts, gates and examples |
| `check:i18n` | Current English/Turkish key, placeholder and DUTİ spelling parity |
| `check:expansion` | Independent design calculation; does not call the production engine |
| `check:disclosures` | File inventory, metadata and saved source hashes; not a rights/eligibility certificate |
| `check:docs` | Local Markdown targets/anchors and professional current-document hygiene |
| `check:demo` | Actual MP4 duration/tracks/dimensions/frame count/hash and caption record; frame review remains separate |
| `check:browser` | Actual UI controls, responsive targets, live translations and persistence |

`npm run check` runs all non-browser checks. CI also installs Chromium and runs the browser suite. Actions are pinned to official release commit SHAs; Playwright is an exact development dependency with a lockfile. No workflow publishes the game or submits anything to Space Apps.

## Change procedure

1. Inspect `git status` and upstream changes; preserve other contributors' work.
2. Read [project status](project-status.md) and [the current contract](design/story-data-contract.md).
3. Keep engine rules out of activities/UI. Keep the independent model independent; do not change expected totals to conceal a regression.
4. For a real rule/story change, update its design/runtime/translation counterparts and meaningful regression cases. Never modify raw NASA observations as AI output.
5. Update changed-file provenance, release notes and current status. Preserve original provider contributions, uncertain model IDs and honest human-review limits.
6. Run the relevant checks, the complete required commands and `git diff --check`. Review failures; do not force-click through blocked controls or erase evidence to make a test pass.
7. Publish only the reviewed change. Check the actual CI run, and verify external links separately before submission.

Current open team decisions are in [submission checklist](submission-checklist.md) and [project status](project-status.md). Historical reports are evidence of earlier commits, not blanket approval of future releases.

Demo capture/encoding instructions and build-tool scope are in [the demo handoff](demo.md). Final encoded video bytes are protected by .gitattributes; do not change the metadata hash without reviewing a replacement video.
