# Compass Outpost: Six Sols on Mars

**Historical Chapter One design (v1.2).** This document preserves the first prototype, including its former six-sol ending. The active game has ten sols, a Sol 6 checkpoint, Science target 10 and five special endings. Use [the current story plan](ten-sol-story-plan.md), [runtime contract](story-data-contract.md) and [project status](../project-status.md). Old pending-work statements below are historical, not the current backlog.

> AI/SI disclosure: story text, code, and documentation include OpenAI ChatGPT/Codex and Anthropic Claude contributions. See [AI_USAGE.md](../../AI_USAGE.md) and [ai-usage.json](../../ai-usage.json) for contribution scope and the team's idea-origin attestation.

Story and Decision Plan for the First Playable Prototype — v1.2 (see `docs/changelog/v1.2.md`)

**Historical continuation proposal, now implemented:** [Ten Sols of Questions](ten-sol-story-plan.md) supplies revised framing for these six scenes, Sols 7–10, and four choice-dependent special endings. Its [implementation handoff](ten-sol-implementation-handoff.md) explains the new checkpoint and target. This document still describes the active six-sol edition; the continuation is not yet loaded by the game.

**Language:** English for all story text, dialogue, interface labels, code identifiers, and code comments.

**Companion robot:** DUTİ. Preserve this spelling in the interface and dialogue. Use `duti` as its code identifier, for example `{ id: "duti", displayName: "DUTİ" }`.

## 1. Game Concept and Player Objective

The player commands **Compass Outpost**, a fictional research base on Mars in the future. With two astronauts and a small companion robot named **DUTİ**, the player completes a six-stage research mission. Each stage represents one game sol. A sol is a day on Mars. The sixth stage ends immediately after the final decision; do not apply another full day of resource use afterward.

The player must protect the crew while earning **at least 6 Science Points**. Science Points represent completed observations and experiments. Saving resources alone is not enough to complete the mission successfully.

### Opening Mission Card

> **Commander, Compass Outpost is counting on you!**
> Keep the base running through six stages and earn at least 6 Science Points. Watch your oxygen and energy, and protect your crew. You may not have enough time or supplies to do everything. You decide what comes first!

### Starting State

| Indicator | Starting Value | Meaning |
| --- | --- | --- |
| Energy | 8/10 | Available energy reserves |
| Oxygen | 8/10 | Available oxygen reserves |
| Safety | 8/10 | An abstract game indicator combining protective preparation and the crew's margin for safe operations |
| Science | 0 points; target: 6 | Progress from completed research |

Energy, Oxygen, and Safety are whole numbers between 0 and 10. Science is separate mission progress. Continue recording earned points after the target of 6 is reached. Under the current conditions and resource costs, the highest reachable Science total is 8.

**All numerical effects are educational game-design values, not NASA measurements. Safety is not a measurement of radiation dose, illness, or recovery.**

## 2. Rules Shared by All Scenes

### Decisions and Time Progression

1. The player selects one option per scene. Apply each decision only once.
2. Check the option's cost and requirements first. Disable unavailable options and explain why.
3. Apply the immediate effects and record the decision. Keep resource values within 0–10; production above 10 is not stored.
4. If any resource reaches 0, stop the mission immediately. A later recharge cannot reverse that outcome.
5. After each of the first five scenes, apply the shared transition below and check resources again.
6. Open the next scene. After the sixth decision, evaluate the ending without applying another shared transition.

| Rule | Shared Energy Change | Shared Oxygen Change |
| --- | --- | --- |
| Clear stage | +1 | −1 |
| Dusty stage | 0 (+1 if panels were serviced in 1A) | −1 |
| Low-power life support: Energy is **2 or less** after the decision | (as above) | **one extra −1** (total −2) |
| After Scene 6 | No transition | No transition |

The Energy values represent **net battery recharge after essential systems have used their share**. Shared Oxygen loss represents the crew's life-support consumption between scenes. Decision effects are additional to these shared changes.

**Low-power life support (v1.2):** Life support needs electricity. If the battery is very low after a decision, life support runs in low-power mode and the crew loses one extra Oxygen point before the next stage. DUTİ says: *“Battery very low! Life support runs in low-power mode, so we lose 1 extra Oxygen.”* This connects saving energy today with oxygen trouble later.

### Mission Profiles (v1.2)

Each new game randomly selects one fictional mission profile and shows its briefing before Scene 1. The profile decides which transitions are dusty and the starting supplies. All three keep every choice winnable (checked by `tools/check_story_data.mjs`).

| Profile | Dusty after Scenes | Start (E/O/S) | Briefing |
| --- | --- | --- | --- |
| `standard` | 2, 4 | 8 / 8 / 8 | Dust is expected after Sol 2 and Sol 4. Supplies are full. |
| `dusty-season` | 2, 3, 4 | 8 / 8 / 8 | Dust is expected after Sol 2, Sol 3, and Sol 4. Clean panels will matter more! |
| `small-oxygen-supply` | 2 | 8 / 7 / 8 | Clear skies are expected except after Sol 2, but the oxygen tanks are not full. |

Every profile has dust after Scene 2 because Scene 2's story is a power shortage. Do not label the forecast as measured Mars weather. Show the next transition forecast in every scene, for example: **“Before the next stage: Energy +0, Oxygen −1.”** Include any panel bonus and low-power Oxygen loss in the displayed forecast. Clearly warn the player if the next transition would reduce Oxygen to 0.

### Costs and Mission Stops

- Disable an option if its Energy or Oxygen cost exceeds the available reserve. An action costing 2 Energy cannot start with only 1 Energy.
- If a cost exactly equals the available reserve, the decision reduces that resource to 0 and stops the mission. Show **“This choice will use up your reserve”** on the card.
- A risk-related Safety decrease is a consequence, not a purchase cost. Show it before selection.
- If no option is affordable or meets its requirements, show **“Mission stopped: not enough resources to continue.”** Do not leave the player on an empty or unresponsive screen.
- Show critical warnings for reserves between 1 and 3. Use text and icons as well as color.
- Do not use a death scene for a mission stop in the first prototype. Use supportive feedback: **“We had to stop the mission. We can try a different plan next time.”**

## 3. Scene 1 — Welcome to Mars

**Scene ID:** `welcome-to-mars` · **Sol:** 1

### Player Story

> Red hills stretch beyond the window of Compass Outpost. Your companion robot, DUTİ, rolls over and offers you a mission badge.
>
> “Welcome, Commander! Before we begin our research, we have time for one preparation task. The solar panels outside are dusty. Our shelter supplies also need organizing. Which job should we do first?”

### Choices

| ID | Button Label | Energy | Oxygen | Safety | Science | Later Consequence |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Service the solar panels | −2 | −1 | 0 | 0 | Adds +1 Energy to the recharge after every dusty stage (one, two, or three, depending on the mission profile). |
| 1B | Prepare the storm shelter | −1 | 0 | +1 | 0 | Reduces the preparation cost of Choice 5A from 1 Energy to 0. |

### DUTİ's Feedback

**After 1A:**

> “The panels are ready! We used powered tools and oxygen from our suit tanks. We can recharge better later, but we did not organize the shelter today.”

**After 1B:**

> “The water packs and protective supplies are in place. If a warning arrives, we can get ready faster. The panels will have to wait.”

**State to remember:** 1A → `panelsServiced = true`; 1B → `shelterPrepared = true`.

**Learning goal:** Preparing for the future uses resources now but can reduce later costs.

**Visual preparation:** A cartoon outpost against a real Mars landscape. Choice cards show dusty panels and the shelter. Keep a small marker for the completed preparation task in later scenes.

**Transition:** Apply the shared transition, then open Scene 2.

## 4. Scene 2 — Power Shortage

**Scene ID:** `power-shortage` · **Sol:** 2

### Player Story

> A warning lights up DUTİ's screen.
>
> “Less solar energy will be left to charge our batteries today. We cannot run every device at once.”
>
> The astronauts want to study some unusual rocks nearby. We could also fill our oxygen tank. There is a smaller research task we can do inside the base, too. Where should we use our energy?

### Choices

| ID | Button Label | Energy | Oxygen | Safety | Science | Later Consequence |
| --- | --- | --- | --- | --- | --- | --- |
| 2A | Produce more oxygen | −2 | +3 | 0 | 0 | Builds the oxygen reserve, but skips this scene's research opportunity. |
| 2B | Collect a rock sample outside | −1 | −2 | 0 | +2 | Makes the laboratory task in Scene 6A worth +4 Science instead of +2. |
| 2C | Study the base's indoor measurements | −1 | 0 | 0 | +1 | Earns an early Science Point with a smaller resource cost, but provides no physical rock sample. |

### DUTİ's Feedback

**After 2A:**

> “The oxygen system has filled more of our reserve. We have more breathing supplies, but our research will have to wait.”

**After 2B:**

> “The sample is here! We recorded observations outside. On the final day, we can study the rock more closely in the lab. We used some of our suit oxygen.”

**After 2C:**

> “We found a useful pattern in our indoor measurements. We collected less information than an outside trip would provide, but we saved our oxygen.”

**State to remember:** 2B → `sampleCollected = true`. Store other decisions in the decision history; they do not need additional flags unless later mechanics use them.

**Learning goal:** Research, life support, and outside work share a limited resource budget. Oxygen production needs electricity, and outside tasks use suit oxygen.

**Science card (real NASA data):** *“Mars nights are very cold.”* Perseverance's MEDA instrument measured the air in Jezero Crater on Sol 290 (December 13, 2021): warmest about −3 °C, coldest about −77 °C. A base needs batteries and heaters when the Sun goes down. Source: NASA Planetary Data System, Mars 2020 MEDA bundle; summary in `data/meda-jezero.json`.

**Visual preparation:** Choice cards show an oxygen system, a sample container, and a measurement display. If collected, show the rock container on a laboratory shelf in later scenes.

**Transition:** Apply the shared transition, then open Scene 3. This stage is dusty in every profile; if the player selected 1A, apply and explain the panel bonus here.

## 5. Scene 3 — Greenhouse Problem

**Scene ID:** `greenhouse-problem` · **Sol:** 3

### Player Story

> Green leaves fill the greenhouse shelves. These plants were started before your team arrived, and some are almost ready to harvest.
>
> DUTİ points to the lights. “Growing food uses energy. We can keep a full experiment shelf running, light a smaller group of plants, or shut the greenhouse down. Our packaged food will last through this short mission. But the greenhouse's future depends on today's choice.”

### Choices

| ID | Button Label | Energy | Oxygen | Safety | Science | Effect on Scene 6C |
| --- | --- | --- | --- | --- | --- | --- |
| 3A | Keep the full experiment shelf running | −2 | 0 | 0 | 0 | Produces a harvest and detailed growth records; 6C awards +3 Science. |
| 3B | Keep a smaller group of plants growing | −1 | 0 | 0 | 0 | Produces a smaller harvest and fewer records; 6C awards +2 Science. |
| 3C | Shut down the greenhouse and save energy | 0 | 0 | 0 | 0 | Removes the harvest study; 6C can only award +1 Science from existing records. |

### DUTİ's Feedback

**After 3A:**

> “The plants have the light and care they need. We can study the harvest on our final day. We used more energy today to prepare for that.”

**After 3B:**

> “We kept a smaller growing area working. We saved some energy, but we will have a smaller harvest and fewer measurements.”

**After 3C:**

> “We saved our energy. We will use packaged food during this mission. We cannot expect a new greenhouse harvest, and a future team will need to restart food production.”

**State to remember:** `greenhouseMode = "full"`, `"minimum"`, or `"off"`.

**Delayed consequence:** Do not award Science immediately. The plant research becomes Science Points only if the player selects 6C. Show the greenhouse outcome in the final report regardless of the final task selected. The cost of 3C is the lost food production and final research opportunity.

**Learning goal:** Growing food takes time and energy. Using stored food and producing future food are different strategies. Do not show seeds becoming a full harvest within these six stages, or describe the greenhouse as the base's main oxygen source.

**Visual preparation:** A real NASA plant-research photograph may appear in an information card labeled **“Plant research aboard the space station.”** The Mars greenhouse illustration is fictional. Prepare full, smaller, and shut-down greenhouse states.

**Transition:** Apply the shared transition, then open Scene 4.

## 6. Scene 4 — Message From Earth

**Scene ID:** `message-from-earth` · **Sol:** 4

### Player Story

> DUTİ notices two possible settings for the research robot outside. The team on Earth could help us choose the more efficient one.
>
> “During this mission, a message takes about 20 minutes to reach Earth. The reply needs time to travel back, too,” DUTİ explains. “We can wait for help, use our own checklist, or spend this time making more oxygen.”

### Choices

| ID | Button Label | Energy | Oxygen | Safety | Science | Later Consequence |
| --- | --- | --- | --- | --- | --- | --- |
| 4A | Ask Earth and wait for a reply | −1 | −1 | 0 | 0 | Once the reply arrives, the robot task in 5B costs 1 Energy instead of 2. |
| 4B | Take measurements using our own checklist | −1 | 0 | 0 | +1 | Completes a local comparison study, but does not unlock the robot's energy-saving setting. |
| 4C | Refill our oxygen reserve first | −2 | +3 | 0 | 0 | Improves the oxygen reserve, but skips both Earth's guidance and this scene's research. |

### DUTİ's Feedback

**After selecting 4A, show two short cards in order:**

> “Message sent. The reply is still on its way.”

Then advance the game's time:

> “The reply is here! The signals needed about 40 minutes for the round trip, and the Earth team needed time to prepare their answer. We can run the robot with less energy now. We used some of our life-support reserves while waiting.”

**After 4B:**

> “We completed our own measurements without waiting for Earth. We still do not know the robot's more efficient setting.”

**After 4C:**

> “Our oxygen reserve is stronger. We did not investigate the robot's settings during this time slot. We have more oxygen for the next decision.”

**State to remember:** Set `earthGuide = true` only after 4A's reply card is completed. Sending the message alone does not unlock the benefit.

**Learning goal:** Support from Earth is useful but cannot arrive instantly. Spending more energy cannot make light travel faster. The 20-minute delay is a selected value for this fictional mission geometry, not a fixed delay for all Mars missions.

**Visual preparation:** Show a message icon traveling between Earth and Mars. Do not make the player wait 40 real minutes. Use short transition cards labeled **“Game time fast-forwarded.”** Complete the exchange within this scene rather than implying that the signal necessarily takes a full day.

**Transition:** Apply the shared transition, then open Scene 5. If this stage is dusty in the current profile and 1A was selected, apply the panel bonus here.

## 7. Scene 5 — Solar Radiation Alert

**Scene ID:** `solar-radiation-alert` · **Sol:** 5

### Player Story

> DUTİ's antenna flashes. “Fast particles from the Sun could make it more dangerous to work outside!”
>
> Radiation is energy or tiny particles that can harm our bodies. The crew can move into the storm shelter. We could also take measurements using the robot outside. One astronaut wants to finish the last outdoor measurement, but staying outside means taking a bigger risk.

### Choices

| ID | Button Label | Energy | Oxygen | Safety | Science | Cost and Connection |
| --- | --- | --- | --- | --- | --- | --- |
| 5A | Move the crew into the storm shelter | −1; 0 if 1B was selected | 0 | 0 | 0 | Stops the outdoor experiment and earns no Science this scene. Earlier preparation reduces the powered handling work needed. |
| 5B | Keep the crew inside and use the robot | −2; −1 if 4A was selected | 0 | 0 | +1 | Protects the crew while research continues, but uses energy to power the robot. |
| 5C | Try to finish the outdoor measurement | −1 | −1 | −4 | +2 | Adds observations but reduces the crew's safety margin below the 6 required for the final outdoor task. |

### DUTİ's Feedback

**After 5A:**

> “Our crew is in the shelter. We could not finish the outdoor experiment this time. Protecting people came first.”

**After 5B:**

> “The robot took measurements while our crew stayed inside. Research continued, but we used some of our energy reserve.”

**After 5C:**

> “We recorded extra measurements, but exposed our crew to more risk. We no longer have enough safety margin for another crewed outdoor task on the final day.”

**State to remember:** `stormResponse = "shelter"`, `"robot"`, or `"outside"`.

Show this warning on 5C before selection: **“High risk: Safety −4. The final outdoor task will become unavailable.”** Do not reward this option with a bravery badge or heroic praise. Explain the Science gain and Safety cost together.

**Delayed consequence:** Starting Safety is 8, or 9 after 1B. Choice 5C reduces it to 4 or 5 respectively, so 6B's requirement is not met. The game does not automatically refill this margin when the solar event subsides. Rest does not erase radiation exposure.

**Science note:** The shelter's passive shielding does not continuously consume electricity. The Energy cost in 5A represents powered equipment used to position supplies if the shelter was not prepared earlier. Taking shelter also means giving up research time.

### Connection to Real NASA Information

Add an information card labeled **“Real NASA event: the May 2024 solar storm (archival data, not live).”**

- **DONKI record:** `2024-05-20T05:36:00-CME-001`, a fast CME that started on May 20, 2024 at 05:36 UTC (speed estimates 1,927–2,678 km/s). Downloaded from NASA's DONKI service and stored in `data/nasa-events.json`.
- **What happened at Mars:** NASA reported that a huge solar storm on May 20, 2024 reached Mars. Curiosity's RAD instrument showed that an astronaut standing next to the rover would have received 8,100 micrograys, about the same as 30 chest X-rays, the biggest jump since the rover landed.
- **Source boundary (show in the details card):** DONKI describes a near-Sun CME; the record's listed impact forecasts do not identify Mars. An event-level match to the separately reported Mars observation has not been established. Present the records as independent archival examples. DONKI is not a measured surface radiation dose on Mars.

**Safety −4 and Science +2 are game-design effects, not NASA-measured doses or predicted human health outcomes.** The timing and characters' decisions are educational fiction, not an exact reconstruction of the 2024 event. The September 2017 event is no longer used.

**Visual preparation:** Show the shelter, remote robot, and warning symbols. Do not depict radiation as a visible fireball. If particles are illustrated, treat them as a conceptual illustration. If NASA's purple aurora imagery is used, explain that it represents ultraviolet observations rather than the same colors seen with the naked eye.

**Transition:** Apply the shared transition. In the next scene, local sensors confirm that the fictional event has subsided. Do not present this as the actual historical event duration or a live risk forecast.

## 8. Scene 6 — Final Mission

**Scene ID:** `final-mission` · **Sol:** 6

### Player Story

> DUTİ opens the final mission card. “Local measurements show that the solar event has subsided. We can choose our last research task.”
>
> The laboratory, exploration route, and greenhouse are waiting. But there is not enough time for all three. The samples you collected and the plants you cared for have changed what we can do today. How will we finish our mission?

Below the story, show current Energy, Oxygen, and Safety, plus **“Science: [current points] / Target: 6.”**

### Choices

| ID | Button Label | Energy | Oxygen | Safety | Science | Requirement / Earlier Decision |
| --- | --- | --- | --- | --- | --- | --- |
| 6A | Complete the laboratory study | −2 | 0 | 0 | +4 if 2B was selected; otherwise +2 | With a rock sample, perform a new detailed analysis. Without one, study recorded images and instrument data. |
| 6B | Take measurements along a new exploration route | −2 | −2 | 0 | +5 | Requires Safety of at least 6. The broader field study uses more oxygen. |
| 6C | Complete the greenhouse study | −1 | 0 | 0 | +3 after 3A; +2 after 3B | Examine the plants maintained earlier and record the harvest. |
| 6C alternative | Prepare a report from existing records | −1 | 0 | 0 | +1 after 3C | Replaces 6C if the greenhouse was shut down. Do not show a harvest. |

Choice 6C and its alternative occupy **one choice slot**. Show no more than three choices at once. Resolve conditional values before displaying the cards so children do not have to calculate them.

### DUTİ's Feedback

**After 6A, with a rock sample:**

> “The rock we saved earlier helped us discover something new today. We completed the next part of our outdoor research!”

**After 6A, without a rock sample:**

> “We combined our images and measurements. We could not learn as much as we could from a physical sample, but we still completed a useful study.”

**After 6B:**

> “The new route's measurements are complete! We compared a wider area. This task used more energy and suit oxygen.”

**After 6C, with a full greenhouse:**

> “We harvested the plants we kept growing. Our detailed records helped us learn more about producing food in space.”

**After 6C, with a smaller greenhouse:**

> “We harvested our smaller growing area. We used less energy, but had fewer plants and measurements to study.”

**After the 6C alternative:**

> “We have no new harvest. We used our existing records to prepare a short report. The next team will need to restart the greenhouse.”

**Learning goal:** Earlier choices change the final mission's options, resource costs, and research value.

**Visual preparation:** Update the three task cards based on earlier decisions. Explain unavailable options, for example: **“Requires Safety 6. Current Safety: 4.”** Each card shows the expected resources and Science total after selection.

**Transition:** Open the ending screen without applying another shared consumption or recharge step.

## 9. Endings and Player Feedback

### Full Mission Success

All of the following must be true:

- Energy is at least 1.
- Oxygen is at least 1.
- Safety is at least 4.
- Science is at least 6.

> **Mission complete, Commander!**
> You kept the base running and reached our research goal. Your earlier choices helped make today's success possible!

Use specific history in the report, for example: **“Your panel maintenance provided [actual bonus count] extra recharge points,” “Your rock sample strengthened the final analysis,”** or **“The energy you invested in the greenhouse made the harvest study possible.”** Count only transitions the player actually reached; profiles have different numbers of dusty stages. Only report outcomes that actually occurred.

### Partial Success

The final scene ends without a resource reaching 0, but Science is below 6 or Safety is below 4.

> **We kept the base running, but part of our research goal is unfinished.**
> Science target: 6. You collected: [points]. Which research task could you prepare for earlier next time?

If the Safety requirement is not met, explain that separately. Under the current starting conditions, Safety can only fall from 8/9 to 4/5, so a Safety-related partial ending is not yet reachable in v1. Keep the threshold explicit in the design contract. Safety's practical effect in this version is whether Choice 6B is available.

### Mission Stopped

Stop the mission if Energy, Oxygen, or Safety reaches 0 at any application step, or if no option in the current scene can be used.

> **We had to stop the mission.**
> [Clear reason.] Review your choices and try a new plan.

Example explanation: **“Our oxygen reserve ran out between stages. Producing oxygen in Scene 4 could have helped us reach the final day.”** Check that any suggested alternative was actually available in that player's earlier state before displaying it.

**Next-crew readiness report (v1.2):** Every ending shows *“Is the base ready for the next crew?”* with a fresh-food line (full → ready, minimum → limited, off → at risk). A separate current-crew safety line reports Safety 6+ as good, otherwise low. This is an abstract operational margin, not a medical assessment or an inherited health condition of the next crew. Food production has a long-term consequence without being a victory condition.

**Report the greenhouse outcome separately:** Full production, smaller production, or a greenhouse that needs restarting. Packaged food lasts through this short mission; shutting down the greenhouse does not cause immediate starvation. Its cost is the loss of fresh food production and the related research opportunity. Greenhouse success is not an additional mandatory victory condition.

## 10. Decision Connections and Implementation Contract

Main sequence: `welcome-to-mars` → `power-shortage` → `greenhouse-problem` → `message-from-earth` → `solar-radiation-alert` → `final-mission` → ending.

This story branches and rejoins using game state. It does not require a separate page for every choice. Branching appears through changed text, available options, costs, and endings.

| Earlier Decision | Stored State | Affected Content |
| --- | --- | --- |
| 1A | `panelsServiced: true` | Recharge after every dusty stage of the mission profile |
| 1B | `shelterPrepared: true` | Preparation cost of 5A |
| 2B | `sampleCollected: true` | Text and Science reward of 6A |
| 3A / 3B / 3C | `greenhouseMode: "full" / "minimum" / "off"` | 6C's title, visual, Science reward, and greenhouse report |
| 4A, after the reply arrives | `earthGuide: true` | Energy cost of 5B |
| 5A / 5B / 5C | `stormResponse: "shelter" / "robot" / "outside"` | Feedback and final report; 5C also lowers Safety and closes 6B |
| Final decision | `finalTask: "lab" / "field" / "greenhouse" / "report"` | Final research report |

Boolean flags default to `false`; `greenhouseMode` is `null` until Scene 3. Store selected choice IDs in `history`. Use that history instead of unnecessary extra flags.

For each scene, the interface should receive the title, short story, current resources, two or three resolved options, reasons for unavailable options, and the transition forecast. The engine calculates conditional costs and Science rewards. Do not duplicate those calculations in the interface.

### English Code and Content Conventions

- Use English file names, scene IDs, variable names, function names, comments, and interface text.
- Use `energy`, `oxygen`, `safety`, and `science` consistently in game state.
- Preserve the robot's proper name exactly as **DUTİ** in displayed content. Its ASCII code identifier is `duti`.
- Save story files and source files as UTF-8 so the name displays correctly.
- Do not give DUTİ an invented acronym expansion unless the team later chooses one.

### First Prototype Screens

1. Opening and mission objective.
2. Shared story screen: visual, short story, resources, and choices.
3. Decision result card: before/after values and reasons for changes.
4. Transition card: shared consumption, recharge, and any panel contribution.
5. Ending and **“Try Again”** screen.
6. Expandable NASA information and source card.

Required visual states: serviced/unserviced panels; prepared/unprepared shelter; rock sample present/absent; full/smaller/shut-down greenhouse; message traveling/reply received; crew sheltered/robot working/crew outside.

## 11. Numerically Checked Example Paths

Starting state: `standard` profile, 8 Energy, 8 Oxygen, 8 Safety, 0 Science. All transitions (including low-power life support) and requirements above are applied.

| Strategy | Choices | Final Energy | Final Oxygen | Final Safety | Science | Outcome |
| --- | --- | --- | --- | --- | --- | --- |
| Energy preparation and final exploration | 1A → 2A → 3A → 4B → 5B → 6B | 2 | 3 | 8 | 7 | Full success |
| Indoor research and greenhouse study | 1B → 2C → 3A → 4B → 5B → 6C | 3 | 3 | 9 | 6 | Full success |
| Early rock collection and laboratory study | 1B → 2B → 3B → 4C → 5B → 6A | 2 | 4 | 9 | 7 | Full success |
| Conserving resources but doing too little research | 1B → 2A → 3B → 4A → 5A → 6C | 5 | 5 | 9 | 2 | Partial success |
| Neglecting oxygen replenishment | 1A → 2B → 3A → 4B → 5A | 6 | 0 | 8 | 3 | Mission stops at the fifth transition |

All reachable paths in the decision model were explored. `standard`: 103 full-success endings, 219 partial-success endings, and 41 early mission stops. `dusty-season`: 95 / 214 / 51. `small-oxygen-supply`: 77 / 199 / 45. In every profile the maximum Science is 8. These are counts of terminal paths, not equally likely player behaviors or a success probability. Options whose requirements were not met were blocked separately. In every profile, each of the 17 choices appears on at least one full-success path with suitable earlier and later decisions.

This check covers numerical consistency and completion through different strategies. Playtesting with children has not yet been conducted. Values may change after playtesting; recalculate the example paths whenever they change.

## 12. Scientific Basis and NASA Sources

1. **Mars communication delay:** NASA explains that commands can take approximately 3–22 minutes to reach Perseverance one way, depending on Earth–Mars geometry. The story's 20 minutes is a selected scenario value. Source: [Speaking Percy's Language](https://science.nasa.gov/blog/speaking-percys-language-how-to-talk-so-perseverance-will-listen/).
2. **Real radiation event (DONKI):** CME `2024-05-20T05:36:00-CME-001`, NASA DONKI. Source: [DONKI record](https://ccmc.gsfc.nasa.gov/DONKI/view/CME/31034/-1), local copy `data/nasa-events.json`.
3. **Radiation at Mars (May 2024):** Curiosity/RAD and MAVEN observations of the May 2024 storm. No numerical conversion into the game's Safety scale has been made. Source: [NASA Watches Mars Light Up During Epic Solar Storm](https://www.nasa.gov/missions/mars-science-laboratory/curiosity-rover/nasa-watches-mars-light-up-during-epic-solar-storm/).
4. **Plant-growing research:** NASA projects such as Veggie investigate fresh food production in space. Do not present those studies as an existing Mars greenhouse or a system that produces all crew food in six days. Source: [Growing Plants in Space](https://www.nasa.gov/exploration-research-and-technology/growing-plants-in-space/).
5. **Mars temperatures (MEDA):** Perseverance MEDA air temperature, Jezero Crater, Sols 290, 313 and 330. Source: [NASA PDS — Mars 2020 MEDA bundle](https://pds.nasa.gov/ds-view/pds/viewBundle.jsp?identifier=urn:nasa:pds:mars2020_meda), local summary `data/meda-jezero.json`.

Sources were checked on November 14, 2026 during the original plan's research. The 2017 references were replaced in v1.2 by the downloaded 2024 DONKI record and MEDA data. This file is a story design, not a working API integration, a downloaded raw dataset, or a finished interface. Include the source name, observation date, archival-data label, and link in the science card. Select individual photographs and record their credits before use; image assets have not been selected or downloaded as part of this document.
