# Red Base: 10 Sols

NASA Space Apps Challenge 2026 — *Build a Junior Astronaut Mission Trainer*

7–12 yaş için hikâye ve karar tabanlı bir Mars üssü oyunu. Oyuncu 10 sol boyunca enerji, oksijen, yiyecek ve güvenliği dengeler; her kararın bir bedeli vardır.

- [GAME_DESIGN.md](GAME_DESIGN.md) — kurallar, karar tablosu, kazanma/kaybetme
- [story-plan.md](story-plan.md) — English six-scene prototype story, DUTİ dialogue, choices, costs, delayed consequences, and implementation notes
- [src/game/scenes.js](src/game/scenes.js) — English scene data ready for the prototype frontend and decision engine
- [docs/story-data-contract.md](docs/story-data-contract.md) — integration guide and shared data contract
- [data/](data/) — gerçek NASA verileri (DONKI, MEDA) ve kaynakları
- [tools/balance_sim.py](tools/balance_sim.py) — denge testi: `python tools/balance_sim.py`

## English story prototype

Start with [story-plan.md](story-plan.md) to build the six-scene story prototype with DUTİ. It includes scene IDs, state flags, English interface text, ending conditions, and checked example paths.

The story plan defines a six-scene prototype with Energy, Oxygen, and Safety starting at 8/10. `GAME_DESIGN.md` describes a ten-sol version with a separate Food resource and different starting values. These documents represent separate design versions; select a ruleset before combining their mechanics.

Validate the six-sol scene data with `node tools/check_story_data.mjs`. The scene module contains story data and conditional rules; the decision engine is the next implementation step.
