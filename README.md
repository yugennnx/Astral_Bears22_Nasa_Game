# Compass Outpost: Six Sols on Mars

NASA Space Apps Challenge 2026 — *Build a Junior Astronaut Mission Trainer*

7–12 yaş için hikâye ve karar tabanlı bir Mars üssü oyunu. Oyuncu robot arkadaşı DUTİ ile 6 sol boyunca enerji, oksijen ve güvenliği dengeler, en az 6 bilim puanı toplamaya çalışır; her kararın bir bedeli vardır.

- [story-plan.md](story-plan.md) — English six-scene prototype story, DUTİ dialogue, choices, costs, delayed consequences, and implementation notes
- [src/game/scenes.js](src/game/scenes.js) — English scene data ready for the prototype frontend and decision engine
- [docs/story-data-contract.md](docs/story-data-contract.md) — integration guide and shared data contract
- [data/](data/) — gerçek NASA verileri (DONKI, MEDA) ve kaynakları
- [tools/check_story_data.mjs](tools/check_story_data.mjs) — veri ve denge testi: `node tools/check_story_data.mjs`
- [docs/CHANGES-v1.2.md](docs/CHANGES-v1.2.md) — v1.2 değişiklik raporu (inceleme için)
- [archive/ten-sol-design-v0/](archive/ten-sol-design-v0/) — arşiv: eski 10 sollu taslak ve Python simülatörü (artık geçerli değil)

## English story prototype

Start with [story-plan.md](story-plan.md) to build the six-scene story prototype with DUTİ. It includes scene IDs, state flags, English interface text, ending conditions, and checked example paths.

**Active ruleset:** `story-plan.md` (v1.2) and `src/game/scenes.js`. The older ten-sol design was archived in `archive/ten-sol-design-v0/` and must not be mixed with the active rules. Real NASA data used by the game is in `data/` (DONKI 2024 CME, Perseverance MEDA temperatures).

Validate the six-sol scene data with `node tools/check_story_data.mjs`. The scene module contains story data and conditional rules; the decision engine is the next implementation step.
