# Release Review: 1.12.0

> AI/SI disclosure: source review, fixes, tests and this report prepared with OpenAI Codex. See [AI_USAGE.md](../../AI_USAGE.md) and [ai-usage.json](../../ai-usage.json). This is not NASA approval or a child playtest.

Date: November 15, 2026. Baseline: `d5776a7` (1.11.9). The isolated maintenance branch preserves the team's current runtime and historical commits.

## Findings and fixes

| Priority | Finding | Resolution |
| --- | --- | --- |
| High | Narrow activity cameras could crop required targets after aspect-ratio adjustment | Keep the active viewBox when expansion exceeds the artwork and use contain/meet; check actual visible targets and real touch/click completion |
| High | A special ending was added to the persistent Journal only after reaching its report; reload offered no completed-mission review | Register the validated ending immediately, allow completed page/report review and preserve the exact saved page |
| Medium | Reading-key debounce swallowed the first Enter on a newly focused control after a screen change | Apply cross-screen debounce only to reading areas; preserve native control activation; normal-motion Enter/Space regressions added |
| Medium | README, six-sol contract and future-ten-sol handoff no longer matched the implemented game | Current overview, ten-sol runtime contract and maintenance handoff replace stale active claims; old evidence is marked historical |
| Medium | No permanent browser regression suite or CI protected responsive controls, language state and ending persistence | Locked Playwright suite, four viewports, local Node server and pinned CI workflow added |
| Medium | MEDA extrema were described as day/night readings without a timestamp association in the curated data | Both languages now compare the recorded cold/warm extrema; original numbers and difference are unchanged |
| Medium | AI metadata still marked choice-sequence features unimplemented and omitted some artifact types | Per-feature statuses, broader HTML/SVG/YAML inventory coverage and current contribution scopes; no invented human certification |
| Medium | Submission work and optional product/deployment work were mixed | Official-2026-only checklist, current status and NASA resource map distinguish required team actions from recommendations |

No engine balance, mission profile, choice effect, ending predicate or original NASA source bytes were changed. The existing title-screen simplification and per-mission discoveries remain intact. No project license was added; the team's explicit deferral is preserved.

## Verification

Local environment: Windows, Node.js 26.8.1, npm 11.19.0, installed Chrome 157.0.8103.51. Playwright 1.65.1 is locked as a development dependency.

| Check | Observed result |
| --- | --- |
| `npm ci --ignore-scripts --no-fund` | PASS: reproducible installation, four packages audited, zero reported vulnerabilities at the time of the check |
| `npm run check` | PASS: story, engine, translation, independent expansion, disclosure and documentation checks |
| `npm run check:browser` with installed Chrome | PASS: 164 tests; four viewports; all 29 choices plus the greenhouse-off 6C variant; eight fresh full campaigns; all five endings; save/reload; normal-motion keyboard smoke |
| Translation parity | PASS: 293 story strings and 488 interface strings with matching placeholders |
| Disclosure inventory | PASS: 71 artifacts; raw-source hash and source receipt checks |
| Documentation links | PASS: 26 Markdown files, 145 local links/anchors, current version and runtime counts |
| `git diff --check` | PASS: no whitespace errors |
| Engine/design/NASA-file diff against baseline | PASS: no change to `src/game/`, `data/` or NASA photographs |
| Raw DONKI bytes and attributes | PASS: SHA-256 `469a405b51f04890be0b41a3ff2b9130d0d6e1ab18e9e5042a889ab468557072`; manifest match; `text` unset and binary diff behavior retained |
| Live NASA/PDS re-download | NOT RUN for this maintenance release: saved bytes/receipts were checked; no new network-source verification is claimed |
| Hosted game, actual NASA form and final demo | NOT VERIFIED: deployment/submission links and account access were not supplied |

The production-engine comparison and independent ten-sol design model agree: standard 8,064 success / 14,580 partial / 192 stopped; dusty-season 6,598 / 13,289 / 640; small-oxygen-supply 6,395 / 13,309 / 97. Maximum Science remains 15. Five special endings are mutually exclusive and ordinary success remains reachable in all profiles. Chapter One counts printed by `check:story` describe Sols 1–6, not a second ten-sol total.

During development, the new campaign harness was corrected to use the already-committed task choice and dismiss first-use NASA source cards. Its earlier timeouts were harness issues. A separate normal-motion keyboard case reproduced a runtime issue and passed after the reading-only debounce fix. The final complete local suite passed without retries.

CI configuration is included in this release; its live result is independently available in [GitHub Actions](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/actions/workflows/quality.yml). A local pass or the presence of this workflow does not itself assert that a remote run succeeded.

The browser suite uses actual Chromium pointer/touch actions with no forced clicks. Fixtures are generated from reachable production-engine states; they are focused regression scenarios, not proof that every possible full campaign was played in a browser. Separate fresh-browser cases play the complete ten-sol visitor route in both languages at all four viewport sizes. A separate MEDA keyboard smoke case uses normal motion; broader animation coverage remains future work. Layout checks include bounds, hit testing, target-to-target overlap and HUD/instruction overlap at each task step. Language switches must preserve game resources, progress and cube/chip state.

## Remaining team work

- Follow [the submission checklist](../submission-checklist.md): registrations, public demo within limits, eight English form sections, rights/license attestation, explicit Submit for Judging and confirmation before the reported Universal deadline.
- A public repository is accepted as a final-project link. A direct playable URL is recommended, not a mandatory GitHub Pages requirement.
- Measure pacing and educational outcomes with children; broaden physical-device, full normal-motion campaign, other-browser and assistive-technology checks. Automated reduced-motion Chromium tests do not certify those areas.
- Review all generated material and third-party rights. AI disclosure records assistance; it does not certify originality, rights or eligibility.

Source refresh used the central official 2026 resources, project-submission, judging, participant FAQ and legal pages linked in [the compliance audit](../compliance/compliance-audit.md). No third-party competition-rule authority was substituted.
