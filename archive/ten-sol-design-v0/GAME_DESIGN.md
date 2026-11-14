# Archived Design: Red Base — 10 Sols

> **Retired ruleset.** The active project uses `story-plan.md` and `src/game/scenes.js` in the repository root. This document preserves the earlier ten-sol design and NASA-data research. It is historical context, not the current game specification.
>
> AI/SI provenance: Anthropic Claude assisted the original design; OpenAI ChatGPT/Codex produced this English rendering and audit notes. See `AI_USAGE.md` at the repository root. Historical toy-model claims are not newly certified here.

Format: narrative decision tree with a small background resource simulation. Setting: Mars. Audience: ages 7–12. Intended language: English, with optional Turkish localization later. Visual direction: cartoon characters plus attributed NASA Mars photographs.

**Labelling convention:** All gameplay numbers below are fictional game assumptions. NASA observations are separate references. The archived Safety model is not a radiation-dose or medical model. The three-sol crop delay and one-sol message delay were gameplay simplifications, not biological growth times or signal travel measurements.

## 1. Resources

Each resource uses a ten-part indicator. Text and icons accompany colors.

| Resource | Child-Friendly Description | Start | Connection |
| --- | --- | --- | --- |
| Energy | Batteries store energy from the panels and supply machines. | 6 | Sunlight/dust affect production; life support and greenhouse use energy. |
| Oxygen | Air to breathe; the oxygen system needs electricity. | 7 | Falls when life support lacks power. |
| Food | Stored meals and greenhouse crops. | 6 | Greenhouse production begins after a fictional three-sol delay. |
| Safety | A simplified protection/condition score. | 7 | Exposure, outside work, hunger, and faults reduce it in this retired model. |
| Science | Research progress. | 0 | Needed for mission success, not immediate survival. |

Historical colors: 7–10 green, 4–6 yellow, 1–3 red. Food was deliberately added as a fourth resource in this retired version.

## 2. Automatic Sol Sequence

The archived order is solar production, player decision, then base consumption.

| Step | Archived Rule |
| --- | --- |
| Solar production | Clear +4, dusty +2, storm +1 Energy |
| Normal life support | −2 Energy, net Oxygen 0 |
| Low-power life support | −1 Energy and −1 Oxygen |
| Insufficient power | Life support stops and Oxygen −2 |
| Working greenhouse | −1 Energy/sol; +1 Food/sol after the three-sol delay |
| Crew meals | −1 Food/sol |
| Food exhausted | The model reduces Safety when meals cannot be supplied |
| Oxygen-system fault | −2 Oxygen/sol until repaired |

Clamp resources to 0–10. Unaffordable Energy choices are unavailable. These rules differ from the active six-sol model.

## 3. Endings

| Outcome | Archived Requirement |
| --- | --- |
| Stopped mission | Oxygen or Safety reaches 0 |
| Partial success | Survive 10 sols with Science below 6 |
| Success | Survive 10 sols with Science at least 6 |
| Star Explorer | Survive 10 sols with Science at least 9 |

In this retired model, zero Energy alone does not stop the mission; its life-support consequences can deplete Oxygen.

## 4. Decision Table

E = Energy; O = Oxygen; S = Safety; Sc = Science. The lab bonus L means +1 Science for indoor research if a laboratory was built.

| Sol | Weather / Scene | A | B | C |
| --- | --- | --- | --- | --- |
| 1 | Clear; arrival | Build greenhouse: E−2; food from Sol 4 | Build lab: E−1, Sc+1; later indoor bonuses | Panel-cleaning robot: E−1; dusty recharge +2, storm +1 |
| 2 | Clear; first exploration | Walk outside: E−1, O−1, S−1, Sc+2 | Remote rover: E−2, Sc+1 (+L) | Base maintenance: S+1 |
| 3 | Dusty; approaching dust | Switch off instruments: E+1 | Continue research: E−1, Sc+1 (+L) | Ask Earth: E−1; reply Sol 4 gives +1 Energy on Sols 4–5 |
| 3 extra | If greenhouse absent | Late greenhouse: E−2; food from Sol 6 | — | — |
| 4 | Storm; weak sunlight | Normal life support | Low-power mode on Sols 4–5: save 1 Energy/sol, lose 1 Oxygen/sol | Pause greenhouse one sol, delaying harvest; if absent, reduce heaters: E+1, S−1 |
| 5 | Dusty; solar warning | Ask Earth: E−1; reply Sol 6 halves shield setup cost | Install shield: E−2 | Continue outside: E−1, O−1, Sc+2; no preparation |
| 6 | Clear; preparation | Install shield: E−2, or E−1 after Earth's advice | Analyze sample: E−1, Sc+1 (+L) | Rest: S+1 |
| 7 | Clear; solar event | Shelter: S unchanged with shield, otherwise S−2; no Science | Outdoor measurement: E−1, O−1, S−3, Sc+3 | Indoor study: E−1, Sc+1 (+L); S−1 with shield, otherwise S−3 |
| 8 | Clear; oxygen-system fault | Repair now: E−2 | Ask Earth: E−1, O−2; remote repair on Sol 9 costs E−1 | Delay and research: E−1, Sc+2; ongoing Oxygen loss |
| 9 | Clear; distant crater | Distant site: E−2, O−1, S−1, Sc+3 | Nearby sample: E−1, Sc+1 (+L) | Rest: S+1, E+1; extra repair choice E−2 if fault remains |
| 10 | Clear; transmit results | Full data: E−2, Sc+2 | Summary: E−1, Sc+1 | Safely shut down: S+1 |

Shield construction is a one-time setup cost. Passive shielding does not continuously consume electricity. Taking shelter forgoes research time. Rest-related Safety gains in this archived toy model must not be described as erasing radiation exposure.

## 5. Delayed Connections

| Early Decision | Later Effect |
| --- | --- |
| Greenhouse on Sol 1 | Food production from Sol 4; ongoing energy demand makes storms harder |
| No greenhouse | Stored food depletes near Sols 6–7; subsequent food shortage affects Safety |
| Lab on Sol 1 | Indoor research bonus on later listed sols |
| Cleaning robot | Greater benefit during dusty weather |
| Ask Earth on Sol 3 | Panel setting helps Sols 4–5; costs the current research opportunity |
| Low-power mode | Saves Energy but reduces Oxygen before the later fault |
| No shield preparation | Higher Safety loss during Sol 7 |
| Ask Earth on Sol 5 | Lower setup cost on Sol 6 |
| Delay fault repair | Repeated Oxygen loss on Sols 8–10 |

The one-sol reply delay was a compressed decision structure. Actual signal travel is measured in minutes and varies with planetary geometry; it is not intrinsically one sol.

## 6. NASA Sources Retained for Research History

- DONKI CME `2024-05-20T05:36:00-CME-001`: [record](https://ccmc.gsfc.nasa.gov/DONKI/view/CME/31034/-1) and [alert](https://ccmc.gsfc.nasa.gov/DONKI/view/Alert/31039/1). Near-Sun speed estimates describe different shock/bulk analyses. This is not a Mars surface-dose measurement.
- [NASA's June 10, 2024 Mars solar-storm article](https://www.nasa.gov/missions/mars-science-laboratory/curiosity-rover/nasa-watches-mars-light-up-during-epic-solar-storm/): an independently cited report, not an established event-level match to that DONKI record.
- [MEDA Atmospheres Node archive](https://pds-atmospheres.nmsu.edu/data_and_services/atmospheres_data/PERSEVERANCE/meda.html): the current summaries and corrected values are in `data/meda_jezero.json` at the repository root.
- [Mars Trek](https://trek.nasa.gov/mars/): considered for imagery; no selected image asset is claimed in this archive.

Other considered resources included NASA Open APIs, OSDR, RadLab, and the Canadian Space Agency's food-production toolkit. Considered resources are not claimed as implemented. Absence of a flare catalogue entry is not used as evidence in the active game.

## 7. Historical Balance Report

The earlier draft reported these strategy outcomes:

| Strategy | Reported Outcome |
| --- | --- |
| Always safe | Partial success, Science 1 |
| Greedy science | Oxygen exhausted on Sol 9 |
| Always ask Earth | Partial success, Science 4 |
| Balanced lab | Success, Science 8 |
| Balanced robot | Success, Science 8 |

| First Investment | Reported Win | Reported Star | Reported Loss |
| --- | --- | --- | --- |
| Greenhouse | 41% | 10% | 31% |
| Lab | 43% | 21% | 49% |
| Robot | 24% | 3% | 48% |

These are preserved historical figures, not verified player probabilities or claims about the active six-sol game. The archived simulator enumerates index combinations; terminal-path counts and unavailable combinations require careful interpretation. The original draft identified the robot as weaker under fixed weather.

## 8. Historical Extension Ideas

The retired plan considered starting supplies varied by ±1, randomized clear/dusty weather on Sols 2–9, a fault on Sol 6 or 8, and Explorer/Commander difficulty. These are historical proposals. The active game instead defines its three explicit mission profiles in `src/game/scenes.js`.
