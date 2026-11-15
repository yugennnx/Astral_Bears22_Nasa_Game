# Compass Outpost: Ten Sols of Questions

> AI/SI disclosure: this proposed expansion was generated with OpenAI ChatGPT/Codex at the team's request. The existing six-sol scenes have separate OpenAI/Anthropic attribution. See [AI_USAGE.md](../../AI_USAGE.md) and [ai-usage.json](../../ai-usage.json).

**Date:** November 15, 2026 · **Status:** original design and narrative handoff. **Implemented** in the playable game in v1.9.0 (November 15, 2026); see [the integration notes](ten-sol-integration-notes.md) for what is implemented, what intentionally differs (for example, no forecast or "Later" text on choice cards) and what remains open. Statements below that the game still ends after six sols describe the situation when this plan was written.

**New story handoff, November 15:** [The Visitors Beyond the Window](#planned-fifth-ending-the-visitors-beyond-the-window) adds a fifth, explicitly fictional ending and conditional clues. That appendix is **not implemented** in v1.10.3. The original four endings, JSON design, runtime, translations and balance values remain unchanged in this publication. The original grounded equipment explanation below still applies; the appendix adds a separate science-fiction epilogue on one qualifying trail.

**For Tuğra:** [machine-readable design](../../data/ten-sol-story-design.json) · [integration checklist](ten-sol-implementation-handoff.md). The current six-sol game remains playable. This is a new continuation of that story, not the retired ten-sol model in the archive. The design was prepared against commit `e815009a9d16cfcf32f17bc1274bcf07b99983fd`.

## The ten-sol arc

The Commander, two astronauts, and **DUTİ** spend ten game sols at the fictional Compass Outpost. Sols 1–6 establish the costs of preparation and the first research review. Sols 7–10 turn a three-note equipment signal into an invitation to investigate, preserve, and share. The mystery has a grounded explanation; earlier choices determine which deeper story the child can complete.

All story, dialogue, identifiers, and handoff materials here are English. The companion is always displayed as **DUTİ**, with code ID `duti`. Each scene is one game sol; activities and signal waits are compressed game time. These are not ten Earth days or a simulation of exact mission scheduling.

| Sol | Scene | Central question |
| --- | --- | --- |
| 1 | Welcome to Mars | Prepare energy collection or the shelter? |
| 2 | Power Shortage | Make oxygen, collect a rock, or study indoor measurements? |
| 3 | Greenhouse Problem | Care for all plants, a smaller group, or save energy? |
| 4 | Message From Earth | Wait for advice, work locally, or refill oxygen? |
| 5 | Solar Radiation Alert | Shelter, use the robot, or accept a clearly warned outdoor risk? |
| 6 | The First Research Review | Which prepared research task can we complete? |
| 7 | The Three-Note Mystery | Compare a pattern, follow a signal, or check old logs? |
| 8 | The Drawer Marked Tomorrow | Preserve plants, DUTİ's pictures, or an old survey record? |
| 9 | Two Stories, One Signal | Compare evidence, record the crew, or strengthen life support? |
| 10 | A Light for Who Comes Next | Send evidence, prepare a handover, or leave a welcome? |

## Numerical rules for this proposed edition

- Keep the first six scenes' existing choice IDs, effects, requirements, conditional variants, and immediate/delayed flags. Only their narrative framing and Sol 6's terminal behavior change. The tables below show base values; the conditional notes are mandatory replacements, not extra rewards.
- Start with the current mission profiles and their existing supplies. Energy, Oxygen, and Safety remain whole numbers from 0 to 10; clamp each resource after every effect group. Science is cumulative and is not capped.
- The new final Science target is **10**. Full success after Sol 10 requires Energy ≥1, Oxygen ≥1, Safety ≥4, and Science ≥10. There is no pass/fail evaluation at the Sol 6 checkpoint; fewer than 6 Science there does not stop the continuation.
- Upfront Energy/Oxygen costs greater than reserves disable an option. Exact depletion is warned about and stops the mission immediately. A later refill cannot revive it. Preserve the existing Safety requirement on 6B and the 5C risk warning.
- Apply the existing shared transition after Sols **1–9**, never after Sol 10: clear recharge +1 Energy; dusty recharge 0, or +1 with serviced panels; Oxygen −1, with one extra −1 when Energy immediately after the decision is at most 2. Sol 6's scheduled supply release does not change that low-power snapshot.
- Dusty transitions: standard **2, 4, 8**; dusty-season **2, 3, 4, 7, 8**; small-oxygen-supply **2, 8**. These are fictional forecasts. Display the whole ten-sol forecast at the start and the resolved next-transition forecast before every choice.
- After a surviving Sol 6 decision and its feedback, release the scheduled stored reserve **once: Energy +2, Oxygen +4, Safety 0, Science 0**. Clamp, then apply the shared transition using the saved post-decision Energy to determine low-power Oxygen loss. Show both the reserve release and transition in the forecast. The supplies were already in the base; nothing arrives instantly from Earth.
- No special ending grants resources, alters Science, or overrides a stop/partial outcome. All four require completing Sol 10 successfully, plus their specific history conditions. History is an ordered array of selected IDs, exactly as in the existing engine; it is not a cross-run journal.

**All numerical values are fictional balancing coefficients, not NASA measurements.** Safety is an abstract operational margin, not radiation dose or health recovery. The new mysteries, equipment, older crew, and notebook are story-world inventions. Existing NASA source cards keep their source labels and qualifications; this expansion adds no new NASA scientific claim or competition rule.

## Sols 1–6: continuity and foreshadowing

Use the replacement story blocks below in the future ten-sol edition. They introduce the full planned duration from the opening, so the child is not surprised by an unannounced extension. Preserve the current decision feedback, replacing references to Sol 6 as the final day with first research review. The active six-sol text and feedback remain in [the original plan](story-plan.md).

### Sol 1 — Welcome to Mars

**Scene ID:** `welcome-to-mars`

> **Narrator:** Red hills fill the window of Compass Outpost. Two astronauts wave from the airlock. Beside them, a small robot holds a badge almost as wide as its face.
>
> **DUTİ:** Welcome, Commander! I am DUTİ. Ten sols, one outpost, and a whole notebook of questions. Our first research review is on Sol 6. After that, we prepare our discoveries for the next crew.
>
> **Narrator:** DUTİ draws an empty dot in its notebook. Outside, dusty panels need attention. Inside, the storm shelter still needs supplies.
>
> **DUTİ:** What should we prepare first? Small choices can leave very long trails.

| ID | Choice | Energy | Oxygen | Safety | Science | Later consequence |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Service the solar panels | -2 | -1 | 0 | 0 | Gain 1 extra Energy after every dusty stage. The shelter remains unprepared. |
| 1B | Prepare the storm shelter | -1 | 0 | +1 | 0 | Moving into the shelter in Scene 5A will cost 0 Energy instead of 1. The panels remain unserviced. |

**Mandatory conditional rules:** 1A sets panelsServiced. 1B sets shelterPrepared and adds +1 Safety. Their preparation returns during dust, the alert, and later stories.

### Sol 2 — Power Shortage

**Scene ID:** `power-shortage`

> **Narrator:** A battery light blinks. Beyond the window, a striped rock catches the morning light. DUTİ turns off one screen to keep the important systems running.
>
> **DUTİ:** We cannot power every job at once. We can make oxygen, collect that rock, or study the measurements we already have indoors.
>
> **Narrator:** The rock is interesting, but the oxygen tank matters too. DUTİ leaves a blank space in the notebook: What could we learn if we saved something for later?

| ID | Choice | Energy | Oxygen | Safety | Science | Later consequence |
| --- | --- | --- | --- | --- | --- | --- |
| 2A | Produce more oxygen | -2 | +3 | 0 | 0 | Build the oxygen reserve, but skip this scene's research opportunity. |
| 2B | Collect a rock sample outside | -1 | -2 | 0 | +2 | The Sol 6 laboratory study will award 4 Science instead of 2. |
| 2C | Study the base's indoor measurements | -1 | 0 | 0 | +1 | Complete a smaller study without using extra oxygen, but collect no physical sample. |

**Mandatory conditional rules:** 2B saves a physical sample. On Sol 6, 6A awards +4 Science with it, otherwise +2. The special stone ending requires that actual sample and study; indoor measurements alone do not substitute.

**Replacement feedback after 2B:**

> **DUTİ:** The sample is here! We recorded observations outside. At the Sol 6 research review, we can study the rock more closely in the lab. We used some of our suit oxygen.

### Sol 3 — Greenhouse Problem

**Scene ID:** `greenhouse-problem`

> **Narrator:** A leaf taps the greenhouse window. These plants were growing before your team arrived. One tray is almost ready to harvest; another still has much to do.
>
> **DUTİ:** The lights use energy. We can care for all the experiment plants, keep a smaller group, or switch the greenhouse off and use our packaged food.
>
> **Narrator:** On a shelf sits an empty seed box labeled NEXT CREW. Nothing goes inside it yet.
>
> **DUTİ:** A future is a little like a garden. Somebody has to begin looking after it before it arrives.

| ID | Choice | Energy | Oxygen | Safety | Science | Later consequence |
| --- | --- | --- | --- | --- | --- | --- |
| 3A | Keep the full experiment shelf running | -2 | 0 | 0 | 0 | Prepare a harvest and detailed growth records. The Sol 6 greenhouse study will award 3 Science. |
| 3B | Keep a smaller group of plants growing | -1 | 0 | 0 | 0 | Prepare a smaller harvest and fewer records. The Sol 6 greenhouse study will award 2 Science. |
| 3C | Shut down the greenhouse and save energy | 0 | 0 | 0 | 0 | Lose the harvest study. The Sol 6 report from existing records will award only 1 Science. |

**Mandatory conditional rules:** 3A/3B/3C set greenhouseMode to full/minimum/off. Resolve 6C to +3/+2/+1 Science respectively, replacing its title, effects, feedback, and finalTask together. Only full/minimum supports 8A. No greenhouse choice adds oxygen.

**Replacement feedback after 3A:**

> **DUTİ:** The plants have the light and care they need. We can study the harvest at the Sol 6 research review. We used more energy today to prepare for that.

### Sol 4 — Message From Earth

**Scene ID:** `message-from-earth`

> **Narrator:** An Earth message window opens beside the rover controls. DUTİ has found two possible settings, but does not know which uses less energy.
>
> **DUTİ:** For our fictional mission today, a signal takes about twenty minutes each way. We can ask Earth and wait, use our checklist, or refill oxygen while we have the chance.
>
> **Narrator:** Beside the message window, an old equipment list shows a tiny lantern symbol. DUTİ saves the page without knowing why it feels familiar.
>
> **DUTİ:** A reply can help us think. It cannot skip the journey between the planets.

| ID | Choice | Energy | Oxygen | Safety | Science | Later consequence |
| --- | --- | --- | --- | --- | --- | --- |
| 4A | Ask Earth and wait for a reply | -1 | -1 | 0 | 0 | Once the reply arrives, the robot task in Scene 5B will cost 1 Energy instead of 2. |
| 4B | Take measurements using our own checklist | -1 | 0 | 0 | +1 | Complete a local study without unlocking the robot's energy-saving setting. |
| 4C | Refill our oxygen reserve first | -2 | +3 | 0 | 0 | Improve the oxygen reserve, but skip Earth's guidance and this scene's research. |

**Mandatory conditional rules:** Set earthGuide only after 4A's reply feedback is completed. It reduces 5B and 7B to −1 Energy. Retain the two-card wait/reply time skip and its selected, fictional signal delay.

### Sol 5 — Solar Radiation Alert

**Scene ID:** `solar-radiation-alert`

> **Narrator:** The outdoor-work light changes to a warning symbol. DUTİ opens the shelter map. The crew can stay inside while the robot takes measurements, or pause research and move into the shelter.
>
> **DUTİ:** Our sensors warn of increased solar-particle risk. Protecting people comes first. An astronaut could try to finish outside, but that would use oxygen and greatly reduce our safety margin.
>
> **Narrator:** A faint three-note chime appears in a saved equipment log. There is no urgent message attached. DUTİ marks it: investigate later, when the crew is safe.

| ID | Choice | Energy | Oxygen | Safety | Science | Later consequence |
| --- | --- | --- | --- | --- | --- | --- |
| 5A | Move the crew into the storm shelter | -1 | 0 | 0 | 0 | Protect the crew, but stop the outdoor experiment and earn no Science this scene. |
| 5B | Keep the crew inside and use the robot | -2 | 0 | 0 | +1 | Continue research while the crew stays sheltered, using the robot's energy supply. |
| 5C | Try to finish the outdoor measurement | -1 | -1 | -4 | +2 | Gain extra observations, but lose enough safety margin to close the Sol 6 crewed outdoor task. |

**Mandatory conditional rules:** 5A costs 0 Energy with shelterPrepared. 5B costs −1 Energy with earthGuide. 5C retains Safety −4 and the advance warning that 6B becomes unavailable. No special ending requires taking this risk, and no risk choice earns bravery praise.

**Replacement feedback after 5C:**

> **DUTİ:** We recorded extra measurements, but exposed our crew to more risk. We no longer have enough safety margin for another crewed outdoor task on Sol 6.

**Warning on 5C:** High risk: Safety −4. The Sol 6 outdoor task will become unavailable.

### Sol 6 — The First Research Review

**Scene ID:** `final-mission`

> **Narrator:** Local sensors show that the fictional solar event has subsided. DUTİ places three research cards on the desk: laboratory, exploration route, and greenhouse.
>
> **DUTİ:** First research review! The rock you saved, the plants you cared for, and the supplies you kept have changed what we can do. We have time for one study today.
>
> **Narrator:** A sealed reserve compartment is scheduled to open after the review. Its oxygen supplies and charged battery pack were stored here before your arrival.
>
> **DUTİ:** Which study shall we complete? Then we can prepare our discoveries for the next crew. There are still four sols of questions ahead.

| ID | Choice | Energy | Oxygen | Safety | Science | Later consequence |
| --- | --- | --- | --- | --- | --- | --- |
| 6A | Complete the laboratory study | -2 | 0 | 0 | +2 | Study recorded images and instrument data to finish a smaller laboratory study. |
| 6B | Take measurements along a new exploration route | -2 | -2 | 0 | +5 | Complete a broader field study using more energy and suit oxygen. |
| 6C | Prepare a report from existing records | -1 | 0 | 0 | +1 | Finish a short report without a new harvest. Food production needs restarting. |

**Mandatory conditional rules:** 6A: +4 Science with sampleCollected, otherwise +2. 6B: requires Safety ≥6. 6C: full/minimum/off greenhouse means +3/+2/+1 Science and the correct greenhouse/report title. Retain legacy finalTask values for compatibility; in this edition they describe the checkpoint study. Do not show an ending here. After feedback, show the stored reserve release, then transition to Sol 7. The received chime is locally logged equipment data, not an instant reply from Earth.

**After the selected study's feedback, show the checkpoint cards:**

> **Narrator:** The scheduled compartment opens. The crew connects the stored oxygen supply and charged battery pack. DUTİ checks each new reserve reading.
>
> **DUTİ:** That completes our first chapter. And that little chime? It has returned. Three notes, a pause, then three notes again. Tomorrow, let us find out what is making it.

## Sols 7–10: new scenes

### Sol 7 — The Three-Note Mystery

**Scene ID:** `the-three-note-mystery` · **Visual key:** `signal-desk`

> **Narrator:** Beep. Beep-beep. The desk speaker goes quiet. Then the same three notes return. DUTİ rolls closer, holding a spoon as if it were a listening horn.
>
> **DUTİ:** I tried asking it a question. It kept beeping. That is not a very useful answer.
>
> **Narrator:** On the screen, the pattern sits beside your old notes. It might come from nearby equipment. It might become clearer if you compare it with your measurements. A rover could look for its source without sending anyone outside.
>
> **DUTİ:** We have a question, not an answer. Shall we study the pattern, follow the signal, or check the old equipment logs while we refill oxygen?

| ID | Choice | Energy | Oxygen | Safety | Science | Later consequence |
| --- | --- | --- | --- | --- | --- | --- |
| 7A | Compare the three-note pattern | -1 | 0 | 0 | +1 | Keep a careful pattern record for the evidence comparison on Sol 9; an earlier rock study may make that comparison special. |
| 7B | Follow the signal with the rover | -2 | 0 | 0 | +2 | Locate an old survey relay without sending an astronaut outside. Earlier Earth guidance reduces this task to 1 Energy. |
| 7C | Read the equipment logs and refill oxygen | -1 | +2 | 0 | 0 | Build the oxygen reserve and find the relay inventory entry, but miss today's new signal measurements. |

**After 7A:**

> **DUTİ:** I saved the pattern beside our measurements. Matching shapes can be a clue, but they do not explain themselves.

**Remember:** `signalMethod = "pattern"`.

**After 7B:**

> **DUTİ:** The rover found an old survey relay behind a ridge. A lantern symbol is painted on its case. This is equipment, not a visitor!

**Remember:** `signalMethod = "relay"`.

**Conditional cost:** if `earthGuide === true`, replace the entire effect set with Energy -1, Oxygen 0, Safety 0, Science +2.

**After 7C:**

> **DUTİ:** The logs list a survey relay with a three-note test signal. We have a possible explanation and more oxygen. We have not measured where it is.

**Remember:** `signalMethod = "logs"`.

**Learning goal:** Compare possible explanations before calling a repeating pattern a discovery.

**Optional exploration:** Let the child inspect a waveform, the rover camera, and a relay inventory page in any order. Finding a hotspot is optional and never an ending requirement.

**Gentle clue:** DUTİ places the new pattern beside the notebook from Sol 2. Some questions need more than one kind of record.

**Next:** Shared transition, then `the-drawer-marked-tomorrow`.

### Sol 8 — The Drawer Marked Tomorrow

**Scene ID:** `the-drawer-marked-tomorrow` · **Visual key:** `tomorrow-drawer`

> **Narrator:** A routine store-room check reveals a drawer labeled TOMORROW. DUTİ cannot resist reading the smaller print: For whoever asks the next good question.
>
> **DUTİ:** Inside: an insulated plant tray, a spare recorder part, and a survey cassette. We can finish one careful job with our work time today.
>
> **Narrator:** If you kept plants growing, a living tray can be protected for the next crew. The recorder part could restore DUTİ's missing notebook pictures. The cassette could explain who left the relay outside.
>
> **DUTİ:** Three ways to save something. Which kind of tomorrow should we prepare?

| ID | Choice | Energy | Oxygen | Safety | Science | Later consequence |
| --- | --- | --- | --- | --- | --- | --- |
| 8A | Protect a living plant tray | -2 | 0 | 0 | +1 | Preserve plants already growing before arrival and their care notes. This can support a living-garden ending after the Sol 6 greenhouse study. |
| 8B | Restore DUTİ's notebook pictures | -1 | 0 | 0 | +1 | Recover DUTİ's saved pictures of earlier preparations. Spare supplies organized in 1B reduce this cost to 0 Energy. |
| 8C | Open the survey cassette | -1 | 0 | 0 | +2 | Recover a fictional older crew's relay-test log. Combine it with a located relay to investigate a network of instruments. |

**After 8A:**

> **DUTİ:** The living tray is protected, and its care instructions are ready. These are plants we kept growing, not seeds that grew overnight.

**Remember:** `capsuleMode = "garden"`.

**Availability:** requires one of 3A, 3B. Otherwise disable with: “The greenhouse was shut down on Sol 3. No living experiment tray remains to protect.”

**After 8B:**

> **DUTİ:** My pictures are back! A packed shelter. A crew working together. I had saved the ordinary moments, too.

**Remember:** `capsuleMode = "memory"`.

**Conditional cost:** if `shelterPrepared === true`, replace the entire effect set with Energy 0, Oxygen 0, Safety 0, Science +1.

**After 8C:**

> **DUTİ:** The cassette says the three notes are a test call from an old survey network. There may be more stations than the one in our equipment list.

**Remember:** `capsuleMode = "archive"`.

**Learning goal:** Stored materials and records can carry earlier work forward, but preparation has opportunity costs.

**Optional exploration:** Inspect the care label, recorder socket, and cassette diagram. If the greenhouse is off, show an empty, unlit tray instead of living plants.

**Gentle clue:** A tiny drawing on the cassette matches the lantern symbol in the equipment list.

**Next:** Shared transition, then `two-stories-one-signal`.

### Sol 9 — Two Stories, One Signal

**Scene ID:** `two-stories-one-signal` · **Visual key:** `evidence-table`

> **Narrator:** A routine receiver check identifies the three-note call as an equipment test, even if you did not locate its source. Your notes cover the table. DUTİ lays two cards beside them: WHAT WE OBSERVED and WHAT WE STILL WONDER.
>
> **DUTİ:** The three notes are from survey equipment. That part is no longer a mystery. But what should our next message help somebody discover?
>
> **Narrator:** You could compare the records to build an evidence report. You could record the crew's story alongside your measurements. Or you could use the work slot to maintain life support while a simple computer check finishes.
>
> **DUTİ:** A good ending does not need every answer. It needs us to be honest about the answers we have.

| ID | Choice | Energy | Oxygen | Safety | Science | Later consequence |
| --- | --- | --- | --- | --- | --- | --- |
| 9A | Compare the evidence and mark open questions | -1 | 0 | 0 | +2 | Connect the rock/pattern investigation or the relay/cassette investigation. Do not add a discovery that the actual history does not support. |
| 9B | Record the crew's story | -1 | 0 | 0 | +1 | Save voices and captions about the choices actually made. Restored DUTİ pictures can turn this into a special farewell. |
| 9C | Maintain life support during the record check | -2 | +3 | 0 | 0 | Build oxygen reserves before the last sol. Keep existing records, but skip today's detailed comparison and crew recording. |

**After 9A:**

> **DUTİ:** Our report separates measurements from guesses. If two things look alike, we say they look alike; we do not claim that proves what caused them.

**Remember:** `broadcastMode = "evidence"`.

**After 9B:**

> **DUTİ:** We recorded what happened here, including the jobs that earned no Science Points. I put my smallest beep at the end.

**Remember:** `broadcastMode = "crew"`.

**After 9C:**

> **DUTİ:** Our oxygen reserve is stronger. The computer checked the files for readable data, but it did not do the deeper comparison or record our crew story.

**Remember:** `broadcastMode = "systems"`.

**Learning goal:** Separate observations from explanations, and label what remains uncertain.

**Optional exploration:** Let the child move note cards into Observed and Still Wonder. The activity supports the chosen report and never changes costs or invents a missing record.

**Gentle clue:** DUTİ asks: Which two pages would somebody need to understand this clue?

**Next:** Shared transition, then `a-light-for-who-comes-next`.

### Sol 10 — A Light for Who Comes Next

**Scene ID:** `a-light-for-who-comes-next` · **Visual key:** `outpost-last-evening`

> **Narrator:** The last planned sol arrives. Compass Outpost is quiet, but not empty: your notes are on the table, your work is in the rooms, and DUTİ has saved a place for the mission's final page.
>
> **DUTİ:** Ten sols ago, we had a blank notebook. Look at it now.
>
> **Narrator:** One work slot remains. You can send a focused evidence packet to Earth, prepare a handover capsule for the next crew, or leave a welcome message in the outpost. What appears on the final page will depend on the trail you followed.
>
> **DUTİ:** We do not have to leave every kind of treasure. We can leave the one we took the time to make.

| ID | Choice | Energy | Oxygen | Safety | Science | Later consequence |
| --- | --- | --- | --- | --- | --- | --- |
| 10A | Send our evidence packet to Earth | -1 | 0 | 0 | +1 | Can reveal the rock-pattern or relay-network ending when the matching earlier investigation is complete. Acknowledge transmission locally; no instant Earth reply. |
| 10B | Prepare the next crew's handover capsule | -1 | 0 | 0 | +1 | With the greenhouse study and a protected living tray, leave a garden handover. Otherwise leave only the actual records and materials collected. |
| 10C | Leave a welcome message in the outpost | 0 | 0 | 0 | 0 | A no-extra-cost final action. Restored pictures and a crew recording can reveal DUTİ's special memory-map farewell. |

**After 10A:**

> **DUTİ:** Packet sent. Earth will receive it after the signal travel time. Let us look at the story our choices made.

**Remember:** `finalAction = "transmit"`.

**After 10B:**

> **DUTİ:** The handover capsule is labeled with exactly what we saved. No imaginary harvests. No missing instructions. A real beginning for the next crew.

**Remember:** `finalAction = "capsule"`.

**After 10C:**

> **DUTİ:** Welcome, next Commander. We left our questions where you can find them. DUTİ adds one final dot to the notebook.

**Remember:** `finalAction = "welcome"`.

**Learning goal:** Communicate discoveries and uncertainty, and recognize that a mission can leave different kinds of useful legacy.

**Optional exploration:** Before the decision, show only items this mission actually created. After the decision, present one ending, its evidence, and one gentle replay invitation.

**Gentle clue:** The screen shows the notebook, transmission desk, and handover shelf. No ending names or combination checklist appears before the decision.

**Next:** Finish feedback, then resolve the final outcome. No overnight consumption or recharge.

## Developer spoilers: four discoverable endings

The children should discover these in play. Do not show their names, recipes, or a fixed total before discovery. Each special ending is an alternate last page of a successful ten-sol mission, not an extra point prize. The same total Science can produce different last pages.

First check stop/success requirements, then history conditions below. Evaluate only after the Sol 10 decision and its feedback. Never inspect discoveries from another run. Every required ID must be in this run's history; within a bracketed OR group, at least one must appear. Sol order is guaranteed by the scene sequence; a malformed or duplicate history must be rejected. Priorities are a deterministic fallback if future edits create overlap. Show exactly one main ending.

| Priority | Ending ID | Required choice chain |
| --- | --- | --- |
| 1 | `the-stone-that-kept-time` | 2B → 6A → 7A → 9A → 10A |
| 2 | `the-smallest-garden` | (3A OR 3B) → 6C → 8A → 10B |
| 3 | `dutis-secret-constellation` | 1B → 5A → 8B → 9B → 10C |
| 4 | `the-lantern-network` | 1A → 4A → 5B → 7B → 8C → 9A → 10A |

The arrows describe required decisions in their numbered sols, not consecutive clicks. Other sols may contain any legal choices that let the mission succeed. The current four conditions are mutually exclusive; the checker verifies that as well as reachability.

### The Stone That Kept Time

**Ending ID:** `the-stone-that-kept-time`

> **Narrator:** Your close-up rock images fill the screen. Beside them sit the measurements you carefully compared. The repeating signal did not come from the stone: it came from equipment. But following the pattern made you look at the stone in a new way.
>
> **DUTİ:** These stripes may record different chapters in how the rock formed. We have a question worth testing, and a sample ready for another scientist to study.
>
> **Narrator:** You label the packet: A question kept safe inside a stone. DUTİ adds a little clock beside the sample box. The screen shows SENT, not ANSWER RECEIVED.

**Show these earned connections after discovery:**

- You saved a physical sample on Sol 2.
- You studied it in the laboratory on Sol 6.
- You compared patterns and evidence before sending your report.

**Replay invitation:** “A small thing saved early can become a much bigger question later.”

**Boundary:** Fictional research lead only. No confirmed rock age, water history, living organism, or NASA discovery is asserted.

### The Smallest Garden on Mars

**Ending ID:** `the-smallest-garden`

> **Narrator:** Inside the handover case, a protected tray holds plants your team kept alive. Beside it are the greenhouse measurements, care instructions, and a blank page labeled NEXT OBSERVATION.
>
> **DUTİ:** We did not grow a whole farm. We kept one careful experiment going. Somebody else can ask the next question.
>
> **Narrator:** DUTİ slips the once-empty seed box onto the shelf beside the tray. Its label now reads: A garden is also a promise to look after something. The next page belongs to another crew.

**Show these earned connections after discovery:**

- You kept a full or smaller greenhouse operating.
- You completed its study on Sol 6.
- You protected a living tray and prepared its handover.

**Replay invitation:** “Some discoveries need care long before the final day.”

**Boundary:** The tray was already growing before arrival. It is not a new ten-sol seed-to-harvest claim, a food-independent colony, or an oxygen supply.

### DUTİ's Secret Constellation

**Ending ID:** `dutis-secret-constellation`

> **Narrator:** DUTİ dims its screen. Small dots appear: the shelter you prepared, the room where the crew waited safely, and the desk where you restored its pictures. Thin lines join them into the outline of a little bear.
>
> **DUTİ:** It is not a real constellation. It is my map of when we looked after one another. I was saving it for the last page.
>
> **Narrator:** Your crew recording begins. Behind the voices is DUTİ's smallest beep. You leave the map beside the welcome message, where the next Commander will find it.
>
> **DUTİ:** We measured a lot of things. Thank you for remembering the people doing the measuring.

**Show these earned connections after discovery:**

- You prepared the shelter and used it during the alert.
- You restored DUTİ's pictures.
- You recorded the crew and left a welcome message.

**Replay invitation:** “Not every important moment earns a Science Point.”

**Boundary:** A fictional memory-map image, not a real astronomical constellation or a claim that DUTİ is a living being.

### The Lantern Network

**Ending ID:** `the-lantern-network`

> **Narrator:** The rover location and survey cassette finally fit together. One lantern symbol becomes several on the old map. Your careful comparison identifies the three-note call as a test message used by a fictional survey network.
>
> **DUTİ:** Our panel work helped the power budget. Earth helped us use the robot efficiently. Then we kept the crew inside and let our machines investigate. Those choices brought these pieces together.
>
> **Narrator:** Your packet contains the relay location, the cassette log, and the questions still untested. Farther along the old map are other marked stations. No one claims they are working yet.
>
> **DUTİ:** One signal answered. A whole map of questions left to ask.

**Show these earned connections after discovery:**

- You serviced the panels and received Earth's guidance.
- You used the robot during the alert and later located the relay.
- You opened the cassette, compared the evidence, and sent the packet.

**Replay invitation:** “A useful reply, a careful preparation, and a machine doing the risky work can belong to the same story.”

**Boundary:** The older crew, survey network, cassette, and relay are fictional story props, not real NASA assets or an operational Mars network.

## Ordinary outcomes and replay presentation

### success: A Notebook Full of Questions

Ten sols complete. You protected the crew and reached the research target. Your notebook holds the discoveries you actually made, and open questions for the next crew. DUTİ closes the cover, then leaves a pencil tucked inside.

**Replay invitation:** “Would a different trail of choices leave a different last page?”

### partial: One More Question

You reached the last page, but part of the research or safety goal remains unfinished. Your completed work still matters. DUTİ marks one place to prepare differently next time. Show the actual Science and Safety shortfall.

**Replay invitation:** “Which earlier preparation might give your next mission more room to explore?”

### stopped: A Safe Pause

DUTİ helps the team stop work and begin the base's emergency procedures. Our research mission is paused. Show the resource or unavailable-choice reason, without a death scene or a claim that the depleted resource has refilled.

**Replay invitation:** “We can try another plan. Which reserve needed help earlier?”

On every final screen, display actual resources, Science / 10, the correct next-crew food/safety report, and a short explanation grounded in this run. A partial result explains Science and Safety shortfalls separately. On early stops, say which reserve reached 0 or why no option remained. No deaths, false harvests, health-recovery claims, or instant Earth replies.

Save discovered ending IDs separately from the current mission, using a new ten-sol edition key. An Ending Journal may show discovered pages and one “Another story?” tab, without revealing the total or locked recipes. Do not require every ending for success. Use text and icons, not color alone; every optional exploration and activity must be skippable and keyboard/touch accessible. Do not announce that a child “missed the real ending.” All completed investigations count.

The narrative and predicates are ready for implementation. Runtime integration, English/Turkish text integration, new activities/art, save-version handling, and child playtesting remain future work listed in [the handoff](ten-sol-implementation-handoff.md). The accompanying checker establishes design reachability; it does not make the browser game ten sols long.

## Planned fifth ending: The Visitors Beyond the Window

> AI/SI disclosure: this appendix was generated with OpenAI ChatGPT/Codex on November 15, 2026. The user selected the previously AI-proposed visitor-ending direction and requested an engaging English story and an implementation handoff. The detailed clues, prose and predicate below are AI-generated. No human review or NASA approval is claimed.

**Status:** story design ready for Tuğra to implement; not present in the playable v1.10.3 game. **Baseline:** `648bf30` (runtime `6bd524b`). This appendix supplements the original ten-sol plan; it does not silently change the four implemented endings or their machine-readable design.

### Story promise and boundaries

A tiny light appears where DUTİ expects only a dark ridge. The player can build a trail of observations, checks and comparisons. On one successful trail, the final window reveals friendly visitors in an explicitly science-fiction epilogue. The payoff is wonder, not a claim that NASA has discovered life.

- Keep the three-note sound's existing explanation: it comes from survey equipment. The new visual mystery is separate. A pattern is not evidence of intelligence by itself.
- Preserve every choice, resource effect, conditional cost, gate, checkpoint, transition and success requirement. This addition has **Energy 0, Oxygen 0, Safety 0, Science 0** beyond existing actions. Existing actions retain their costs; the observations reuse the instruments, camera recordings and work time already in those actions.
- Never reward the player for going outside during the radiation alert. The required Sol 5 action is the remote robot task, **5B**. The crew stays inside; the visitors arrive only after the completed mission, not during the alert.
- Visitors do not provide supplies, rescue a failed run, increase Science or become the source of any real NASA data. An ordinary success and each other special ending remain equally valid mission completions.
- Display **“Fictional science-fiction ending”** before the first encounter page and retain it on each encounter page. Show this plain-language note before the reveal: **“This encounter is fictional. No extraterrestrial life has been confirmed.”** Repeat it on the discovered Journal entry. These labels are team design safeguards, not a quotation of a competition requirement.
- All new lights, pictures, visitors and equipment-history details here are invented story elements. Existing NASA cards and their archival/scientific qualifications stay separate. For the factual distinction, see [NASA: Do Aliens Exist?](https://www.nasa.gov/solar-system/planets/mars/do-aliens-exist-we-asked-a-nasa-scientist-episode-5/). This scientific reference is not a competition-rule source.

### Conditional story insertions

Insert these beats inside the corresponding existing story or feedback flow, after the original text and before its normal Continue/transition. They are observations and dialogue, not new decisions or additional resource-effect groups. Prefer replacing a closing dialogue beat with the new lines rather than adding another forced screen. Keep the original numerical feedback visible.

The conditions below use choices actually committed **in this mission**, including the current choice. Never use the cross-run Journal, a hidden click, elapsed real time, audio settings or a random number as a condition. In feedback, use committed `state.history`; do not depend on after-feedback flags having been applied yet.

#### Sol 1: the window, for every run

**Placement:** after the welcome introduction, before choosing 1A or 1B. A brief optional-looking detail in the same illustration/dialogue flow; not an ending requirement.

> **Narrator:** Something tiny glints beyond the far ridge. When you look again, there is only red dust.
>
> **DUTİ:** A reflection? Maybe. I will leave a little space in our notebook. We can wonder without knowing yet.

Do not show a visitor silhouette, ending title or a collectible the player must find. One glint alone establishes nothing.

#### Sol 2: the blank part of the picture

**Condition:** selected **2C**. Append to its existing indoor-measurements feedback; other choices keep their existing feedback.

> **Narrator:** Beside the indoor readings, a routine window-camera picture shows three pale dots above the ridge. They are so small you almost scroll past them.
>
> **DUTİ:** I saved the time and the picture. Three dots, unknown cause. A good notebook leaves room for “I do not know.”

**What the action earns:** a time-stamped fictional image kept with the existing indoor records. It does not establish an object, a visitor or an extra Science reward. No new outdoor exposure or active scan is added.

#### Sol 5: let the robot look

**Condition:** selected **5B**, and **2C** is already in history. Append after the original remote-robot result.

> **Narrator:** In the robot's camera recording, the little lights appear again. DUTİ checks the camera, then checks the picture twice.
>
> **DUTİ:** The camera check passed. That makes this picture worth keeping, not worth guessing about. Everyone stays inside. The mystery can wait until it is safe.

**What the action earns:** a second saved view from the existing robot task. The camera check does not prove an extraterrestrial origin. Keep the original radiation warning and shielding explanation intact; lights are not a radiation measurement.

#### Sol 7: a name for what we do not know

**Condition:** selected **7C**, and both **2C** and **5B** are in history. Append after the existing relay-log explanation and oxygen-refill feedback.

> **DUTİ:** The three-note sound belongs to the survey relay. That question has an answer. These little lights are a different question.
>
> **Narrator:** The equipment list does not explain the pictures. DUTİ labels their page UNKNOWN LIGHTS, then draws a very small question mark wearing a very large hat.

**What the action earns:** a comparison with known equipment records during the existing log-reading task. Missing an explanation in the list does not prove there are no other ordinary explanations. Do not rename the relay as an alien transmitter.

#### Sol 8: someone else noticed

**Condition:** selected **8C**, and **2C**, **5B**, **7C** are in history. Append after the cassette's existing survey-network explanation.

> **Narrator:** At the end of the cassette is one more picture. Three faint dots. The older crew wrote beneath it: “Not enough information. Save this for the next observer.”
>
> **DUTİ:** Somebody wondered before us. They did not turn a question into an answer. They left us a place to begin.

**What the action earns:** an additional fictional archive image inside the cassette already being opened. It is not a NASA photograph or proof of life. The cassette still explains the human-made survey network as before.

#### Sol 9: the space between the answers

**Condition:** selected **9A**, and **2C**, **5B**, **7C**, **8C** are in history. Append after the existing evidence-comparison feedback.

> **Narrator:** You place the pictures beside their times. The lights change position between observations. The relay record explains the beeps, but not these pictures.
>
> **DUTİ:** Observed: lights in several pictures. Still unknown: what made them. Let us send both parts. Honest questions belong in a science report, too.

**What the action earns:** a comparison saved with the existing evidence report. No claim about speed, distance, flight path, living beings or intent follows from these images. Do not invent a record from an unselected choice.

#### Sol 10: one last look

**Condition:** selected **10A**, the full six-choice predicate below is met, and the resolved final outcome is **success**. Show this bridge after the existing transmission feedback, before the new ending. On partial/failed outcomes, retain the usual supportive outcome without the bridge or visitors.

> **DUTİ:** Our packet includes the pictures and what we could not explain. Earth will receive it after the signal travel time.
>
> **Narrator:** DUTİ closes the notebook. A soft light slides across its cover. This time, it comes from the window.
>
> **DUTİ:** Commander... one last look?

The encounter is not an instant answer from Earth and is not said to have been summoned by the transmission. This mission's observation trail makes the crew notice it; sending a packet does not prove it caused a visit.

### Developer-only unlock contract

**Ending ID:** `the-visitors-beyond-the-window` · **Title:** `The Visitors Beyond the Window` · **Proposed priority:** `5`.

Resolve normal mission status first. Require a valid complete history with one legal choice per sol and all of:

**2C → 5B → 7C → 8C → 9A → 10A**

Choices on Sols 1, 3, 4 and 6 are free within the existing rules, provided the mission succeeds. Do not turn the example full route below into extra requirements.

```json
{
  "id": "the-visitors-beyond-the-window",
  "title": "The Visitors Beyond the Window",
  "priority": 5,
  "allChoices": ["2C", "5B", "7C", "8C", "9A", "10A"],
  "anyChoiceGroups": []
}
```

This is a predicate excerpt for implementation, not a complete runtime ending object. Tuğra must add the story, earned connections and replay hint in the runtime's existing format, plus the visible fiction label and note. Keep the normal success gate: Energy ≥1, Oxygen ≥1, Safety ≥4, Science ≥10. No extra bonuses or ending-specific resource thresholds apply.

The proposed predicate cannot overlap the four existing ones: Stone requires 7A instead of 7C; Garden requires 10B instead of 10A; Constellation requires 9B/10C instead of 9A/10A; Lantern requires 7B instead of 7C. Priority is a fallback for future edits, not a means of hiding an overlap today.

### Ending text: five short pages

Show exactly one page at a time, with normal untimed Next/Back controls. Keep the fiction label visible. Present the explanatory note before page 1. No loud surprise, compulsory animation, flashing light, timed input or required audio. Reduced-motion presentation uses static images and the same words. Keep crew members inside the closed outpost and the airlock sealed throughout.

#### Page 1 — The light returns

> **Narrator:** Beyond the glass, something silver unfolds like a tiny flower. Two small figures stand beside it on the ridge.
>
> **DUTİ:** Those are not our survey robots.

#### Page 2 — A very small hello

> **Narrator:** One visitor raises a hand with four long fingers. DUTİ raises its little metal paw. For a moment, nobody moves.
>
> **DUTİ:** I have practised many greetings. Somehow, I forgot all of them.

#### Page 3 — The page we left open

> **Narrator:** DUTİ holds the notebook to the window, open at UNKNOWN LIGHTS. The visitor points toward the sky, then gently toward the notebook.
>
> **DUTİ:** I do not know what that means. But I think we have another question.

#### Page 4 — Beyond the ridge

> **Narrator:** The figures return to their silver craft. It lifts beyond the ridge, quiet behind the thick window. One pale light remains, then fades.
>
> **DUTİ:** We kept looking carefully. And this story became bigger than our notebook.

#### Page 5 — A new beginning

> **Narrator:** Beneath the final entry, DUTİ draws a small waving paw. Then it turns to a fresh page.
>
> **DUTİ:** If someone out there keeps a notebook too... what do you think they wrote about us?

**Discovered Journal summary:** “You kept the pictures, checked the equipment, compared the records and shared what remained unknown. In this fictional ending, the last look through the window revealed friendly visitors.” Retain the fiction label and explanatory note here, including when viewed outside the completed mission.

**Earned connections, shown after discovery:**

- You saved the indoor camera record on Sol 2 and the robot view on Sol 5.
- You checked equipment logs on Sol 7 and preserved the cassette picture on Sol 8.
- You compared observations without claiming proof, then shared the report on Sol 10.

**Replay invitation:** “What other questions might a different trail leave in DUTİ's notebook?” Do not reveal a total ending count or advertise a more valuable “true” ending. A return to the Journal/new mission must remain possible without replaying all five pages.

### Reachability checked against the unchanged engine

On November 15, a temporary probe evaluated the candidate predicate using the existing production engine at `6bd524b` (the runtime in baseline `648bf30`). It enumerated legal branches constrained to the six required choices, completed normal feedback/transitions, and counted successful candidates. It also checked for conflicts with every current ending and rejected six single-required-choice substitutions per profile. This is numerical design verification, not a browser implementation or child playtest. The probe was not installed as a permanent repository test.

| Mission profile | Successful candidate histories | One complete witness | Final Energy / Oxygen / Safety | Science |
| --- | ---: | --- | --- | ---: |
| standard | 23 | 1A 2C 3A 4C 5B 6C 7C 8C 9A 10A | 5 / 7 / 8 | 10 |
| dusty-season | 21 | 1A 2C 3A 4C 5B 6C 7C 8C 9A 10A | 5 / 7 / 8 | 10 |
| small-oxygen-supply | 19 | 1A 2C 3A 4C 5B 6C 7C 8C 9A 10A | 5 / 6 / 8 | 10 |

All candidates currently finish with ordinary success and no existing special ending. Activating the proposed predicate would reclassify these successes, not add successful missions or change their final values. The original four endings keep their histories. Other legally completed six-choice candidate trails may still be partial because Science/Safety requirements continue to apply.

### Implementation and acceptance handoff

1. Implement the conditional insertions in scene/feedback presentation, preserving original mechanical feedback and the separate grounded relay explanation. If the UI replaces scene prose with spotlights or memories, add the same beat to the actually visible flow rather than leaving it only in scene data. Reuse existing screens where possible.
2. Add the ending to both `data/ten-sol-story-design.json` and `src/game/scenes.js` when implementing. Add a real source of English/Turkish fiction-label strings and render the label/note before the reveal, on each ending page and in the Journal. This publication deliberately does not activate the predicate in either data file.
3. Extend `src/game/engine.js` only if its generic history resolver needs it; never put success or unlock rules solely in the UI. Use the existing complete-history validation and success gate. No extra persistent clue flags are needed; derive progress from current-run history.
4. Keep `tools/check_ten_sol_design.mjs` independent from the engine. Update the four-ending cardinality assertions to five, add the proposed design, and regenerate the balance report with `node tools/check_ten_sol_design.mjs --write-report`. Add the three witness assertions and negative cases to the appropriate checks. Overall success/partial/stop totals must remain unchanged; ending distributions change.
5. Translate all new visible prose and labels into the optional Turkish interface while keeping English primary. Handle language changes on the current ending page without resetting progress or changing resources. Keep the new Journal ID derived from a completed qualifying mission; saved discoveries cannot unlock a different current run.
6. Preserve old saves and old Journal discoveries. A completed v1.10.3 save must not be silently relabeled with a new ending. If edition/save semantics change, explain compatibility and offer a fresh mission rather than inventing missing clue presentation.
7. Verify missing/replaced required choices, a matching but partial run, a stopped run, malformed histories and cross-run Journal contamination never reveal visitors. Verify all four original special-ending witnesses still select their original ending.
8. Run `npm run check` and `git diff --check`, then browser-check the witness in English desktop and Turkish touch-phone layouts. Check keyboard use, static/reduced-motion presentation, fiction-note visibility, no required scrolling within a short page, back/next, resume/reload and language changes. Recheck all profiles numerically; do not describe an ending as playable until its presentation has actually been tested.

No artwork, audio, translation, live engine change, NASA discovery claim, competition-rule change or project license is included in this story-only handoff. If new media is later made, attribute its actual tool/source and preserve the project's visible AI-art labeling. The latest existing runtime verification remains [the v1.10.3 report](regression-review-6bd524b.md); it does not certify this unimplemented addition.
