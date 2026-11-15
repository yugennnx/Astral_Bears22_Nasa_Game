# Compass Outpost: Repository Review

**Reviewed:** November 15, 2026. **Target:** `761bb66edc05ce182875ad63fc7325153628cf2a`, version 1.10.0, verified as GitHub `main` at the end of the review.

**AI disclosure:** This independent review and its temporary test harnesses were generated with OpenAI Codex. During the review, no project file, commit, branch on GitHub, or deployment was changed. The review used a separate local checkout. This later publication adds only this report and its required AI artifact-inventory entry; it applies no fixes. This is an automated/code review, not a playtest with children or an eligibility decision.

The ten-sol integration is working. The engine reproduces the proposed resource balance, checkpoint, greenhouse gate, and four special endings. The main weaknesses found are in the interface and its educational feedback. Automated checks pass despite those weaknesses because the existing checks primarily cover data, rules, translation coverage, and attribution.

## Commits examined

| Commit | Change | Assessment |
| --- | --- | --- |
| `a01613d` | Ten-sol edition, Sol 6 checkpoint, Sols 7–10, new flags, Science target 10, special endings, translations and checks | Core integration verified against the design and through browser playthroughs. |
| `69d0d55` | Clue trail, memories, observe-first interactions, three thinking tasks, fewer prediction/card interruptions and faster replays | Features are present. The new tasks and help controls contain the interface defects below. |
| `761bb66` | Status report and its provenance entry | Documentation-only change; no runtime changes. Its “partly” assessments generally match the implementation. The prediction wording marked done is not scientifically clear yet. |

The earlier `5991e2b` commit is now present in the fetched history. Its sound and interface changes were therefore included in the current-runtime review.

## Verified checks

| Check | Result and evidence |
| --- | --- |
| `npm run check` | PASS: story structure, engine, translations, independent expansion model and disclosures. |
| Production engine, all profiles | Standard: **8064 success / 14580 partial / 192 stopped**. Dusty season: **6598 / 13289 / 640**. Small oxygen supply: **6395 / 13309 / 97**. Counts match the independent design model. |
| Final Science | Maximum reachable total remains **15**; success target is **10**. |
| Translation coverage | **269 story strings and 415 interface strings** have Turkish entries and matching placeholders. This establishes coverage, not a human assessment of reading level. |
| Disclosures | **50 artifacts** verified; saved raw-source hash and source receipts pass. |
| Relative Markdown links | **72 checked; 0 broken** across tracked Markdown files. |
| Whitespace | `git diff --check c3e626f 761bb66` passed. |
| Design/runtime consistency | Sols 7–10 choice values and text, success requirements and all special-ending records agree with the JSON design. A property-order-only JSON difference was inspected and is not a content mismatch. |
| Scientific snapshots | The original cached MEDA CSVs reproduce Sol 290 **−76.8 / −3.1 °C**, Sol 313 **−78.5 / −1.5 °C**, Sol 330 **−79.3 / −9.6 °C**, and their stored hashes/sample counts. The cached DONKI snapshot reproduces the recorded start time and separate shock/bulk analyses. These were cache-based checks, not a fresh download of every NASA source. |
| Repository state | Review checkout remained clean; no GitHub write operation was performed. |

The tracked repository contains 59 files. Review covered the three requested diffs, active engine/data, UI and activity flows, localization, disclosure/documentation status and local source verification. Vendored libraries and the historical archive were not rewritten or claimed to have received a new line-by-line audit.

## Browser testing

Chrome was run in an isolated local profile against a temporary localhost server. Full cases used reduced motion for deterministic traversal. A separate focused case used normal animations to verify incorrect-answer feedback. Screenshots were visually inspected; automatic completion alone was not treated as proof that a child could see the controls.

Fifteen distinct playthrough scenarios covered all **29 choice IDs** collectively. Four special endings were tested both at **1280×720 in English** and **375×812 in Turkish**. Additional cases covered ordinary success, partial completion, a resource stop, 8A locked after 3C, risky 5C, resume, replay, and reload during a fact card. No uncaught page exceptions were recorded in those runs.

| Special ending | Complete history | Final Energy / Oxygen / Safety | Science | Browser result |
| --- | --- | --- | --- | --- |
| The Stone That Kept Time | 1A 2B 3A 4C 5A 6A 7A 8A 9A 10A | 4 / 3 / 8 | 11 | PASS in desktop English and phone Turkish |
| The Smallest Garden on Mars | 1A 2A 3A 4A 5B 6C 7B 8A 9A 10B | 5 / 4 / 8 | 10 | PASS in desktop English and phone Turkish |
| DUTİ's Secret Constellation | 1B 2A 3A 4B 5A 6B 7B 8B 9B 10C | 5 / 4 / 9 | 10 | PASS in desktop English and phone Turkish |
| The Lantern Network | 1A 2A 3A 4A 5B 6A 7B 8C 9A 10A | 5 / 4 / 8 | 10 | PASS in desktop English and phone Turkish |

Browser routes used the standard profile; the engine enumeration covers all three profiles. This is not exhaustive device coverage, a full normal-animation regression, or a child engagement study. A clipped mobile target was separately retested with actual pointer input before classifying it as a layout issue rather than a hard progression block.

## Findings, in priority order

### 1. P1 — The desktop 2C answer labels are covered by the task banner

**Location:** [activities.js, lines 763 onward](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/761bb66/src/ui/activities.js#L763).

**Reproduction:** At 1280×720, choose 2C. Select the colder B reading. The next question asks for the temperature difference, but the **7°, 74°, 30° labels are drawn behind the task banner**. Only the upper edges of their circles are visible. The scripted test can activate a target by its selector; a child cannot see which numerical answer to select.

**Cause:** The second-stage artwork and targets are fixed at SVG `y = 236`, which falls under the desktop task banner.

**Recommendation:** Place both the answer labels and targets in a clear area below the banner, or use a responsive answer panel. Add a browser assertion that all three labels are visible and unobscured. Moving only the hit regions would leave the visual problem unresolved.

**Visual verification:** The three answer labels were covered by the task banner at 1280×720. Screenshots were captured locally; they are not included in this report-only publication. Use the reproduction steps above to inspect the issue.

### 2. P2 — The Hint button cannot be clicked or tapped

**Location:** [styles.css:544](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/761bb66/src/ui/styles.css#L544), [styles.css:876](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/761bb66/src/ui/styles.css#L876).

The task banner sets `pointer-events: none`. The nested `.task-hint` button inherits that value and never restores pointer events. On both tested screen sizes, hit testing returned the scene or app beneath the button. A real Playwright click timed out. The question mark also has very low contrast against the pale banner.

**Recommendation:** Restore pointer input specifically on the help button and give its text/background sufficient visual separation. Verify a real mouse click and touch tap, not only direct event invocation or keyboard activation.

### 3. P2 — The updated prediction explanation implies solar generation overnight

**Location:** [ui.js:390](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/761bb66/src/i18n/ui.js#L390), Turkish equivalents starting at [ui.js:817](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/761bb66/src/i18n/ui.js#L817).

The English explanation states: “Between this evening and this morning, the panels made a little more power…” Dusty/clean-panel variants make the same nighttime sunlight implication. The Turkish version preserves it. The base model's +1 is a fictional **net recharge across the shared stage**, not evidence that solar panels generate at night.

NASA describes daytime solar operations and battery charging to support nighttime operation: [Mars Surface Power Technology Decision, page 2](https://www.nasa.gov/wp-content/uploads/2024/12/acr24-mars-surface-power-decision.pdf).

**Recommendation:** Keep the tested balance values, but describe a full stage/sol that includes daylight, and explain that batteries supply the night. Align the question, animation and morning explanation to that same interval. Merely renaming the question to evening-to-morning does not solve the scientific issue.

### 4. P2 — An incorrect 2A allocation is temporarily marked complete and celebrated

**Location:** [activities.js:726](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/761bb66/src/ui/activities.js#L726), [app.js:867](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/761bb66/src/ui/app.js#L867).

**Reproduction:** Give all three power cubes to the lamp. Before validating the distribution, `api.progress(3, 3)` marks the task finished. The normal-animation test captured a green completion banner, **3 of 3**, no Hint button, and “Let's try again!” at the same time. The completion callback also selects the success sound. The task resets after its delay; it does not incorrectly award an extra engine reward.

The error text is pale orange on the light green completion background, making the contradictory feedback harder to read.

**Recommendation:** Distinguish allocation progress from successful completion. Only apply the finished styling, success audio and removal of help after validating the allocation. Retain a readable error state during retries.

**Captured state:** `finished: true`, `3 of 3`, `hintPresent: false`, and the retry message were present together after three lamp selections.

### 5. P2 — Reloading an uncollected fact card skips its collection opportunity

**Location:** [app.js:98](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/761bb66/src/ui/app.js#L98), [app.js:914](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/761bb66/src/ui/app.js#L914).

**Reproduction:** Reach the new Veggie card after Sol 3, reload before pressing Add to my collection, then Resume. The game returns to feedback and advances without showing that pending card again. The journal still contains only the two earlier cards (`dusty-world`, `moxie`).

`pendingFact` is transient and is neither serialized nor reconstructed on load. Previously collected cards, choices and resources remain intact; this is specifically the uncollected pending-card opportunity.

**Recommendation:** Persist the pending card ID or reconstruct it from the saved pending decision without duplicating rewards. Add a reload test at the fact-card screen.

### 6. P2 — The v1.10 AI contribution account should identify the source of the twelve suggestions

**Location:** [AI_USAGE.md:57](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/761bb66/AI_USAGE.md#L57).

The paragraph says the suggestions and goals came from the team and were posted by a teammate. In this project's conversation, the twelve specific review suggestions were produced by Codex, then passed to Tuğra/Claude. The team requested the review and chose what to implement; Claude generated the implementation. Those are distinct contributions.

**Recommendation:** Explicitly credit the twelve recommendations as OpenAI Codex-assisted review input, the selection/direction as the team's contribution, and the implementation as Claude-assisted. Preserve the existing, separate attestation that the underlying game idea came from the team. This finding concerns accurate provenance; it is not an organizer ruling.

### 7. P3 — The saved player name is blank on replay

**Location:** [app.js:432](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/761bb66/src/ui/app.js#L432), [app.js:460](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/761bb66/src/ui/app.js#L460).

After completing a mission as Arda, New Mission opens an empty name input even though the player profile stores Arda. `showBriefing()` shadows the persistent player `profile` with a mission profile, then reads its nonexistent `name`. Beginning without retyping the name can replace the stored name with an empty string.

**Recommendation:** Use distinct names for the mission profile and player profile, and prefill from the latter. The replay Skip ahead button itself was verified to appear.

### 8. P3 — Active design documentation still says the extension is unimplemented

**Location:** [ten-sol-story-plan.md:5](https://github.com/yugennnx/Astral_Bears22_Nasa_Game/blob/761bb66/docs/design/ten-sol-story-plan.md#L5), plus the old future-work framing in the handoff.

The story plan says the game still ends after six sols and the new edition is not implemented, while AGENTS, README, integration notes and the actual runtime now describe ten sols. The original specification can remain historical, but its status needs a clear dated implementation note and link.

**Recommendation:** Label original requirements as the original design, and prominently state what is now implemented, what intentionally differs, and what remains open.

## Additional design and layout observations

- **5B on a 375-pixel phone:** One target is mostly outside the right edge. Its measured box starts at about x=362 and is about 65 pixels wide. A pointer click can reach the remaining sliver, so this was not classified as an impossible task. Moving it fully into view would make touch interaction much easier. This was verified with a pointer click on the visible portion.
- **Special-ending presentation:** All four story texts and evidence lists display, but the end popup scrolls substantially: the Stone ending measured 998/527 pixels on desktop and 1247/683 on the phone (content/visible height). Distinct visual payoff and a few short story pages would suit these discoveries better than a long report-like screen.
- **Pacing:** Full ten-sol routes still took roughly 163–169 scripted interactions in these cases, including a clue and test-specific interactions. This is not a measurement of children's play time. The status report correctly marks the reduction in forced screens as partial; memory lines also add reading steps.
- **Thinking tasks:** Exactly three choices have the new reasoning tasks. Most other activities still use the existing tapping mechanics. The status report already acknowledges this accurately.
- **Rarity of special endings:** In the unweighted standard-profile enumeration, 322 of 8064 successful histories match a special ending; 7742 use ordinary success. These are path counts, not probabilities for real children. Child observation is needed to determine whether the clues make the endings discoverable without exposing their recipes.
- **No new source-data or vendor replacement** was introduced by the three requested commits. Archived design remains historical. The deferred project license remains deferred; this review made no licensing decision.

## Suggested repair and verification order

1. Make 2C's three answer labels fully visible on desktop and phone sizes.
2. Restore Hint pointer input and readable hint/error colors.
3. Correct the solar timing explanation in both languages while keeping the agreed numerical model.
4. Validate 2A before completion feedback and preserve a pending card across reload.
5. Repair name prefill and update contribution/status documentation.
6. Add browser checks for these exact cases, including actual pointer hit tests and visual occlusion. A passing engine enumeration cannot detect them.
7. Then observe children before choosing the next content/pacing expansion.

The local ten-sol game and all four endings were exercised. A public deployment was not verified: the GitHub Pages API returned 404 under the current credentials, which alone does not distinguish an absent site from access restrictions. This review makes no claim about a deployed production link, final submission, or event eligibility.
