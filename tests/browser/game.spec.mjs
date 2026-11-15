// AI-assisted generation: OpenAI Codex. See AI_USAGE.md and ai-usage.json.
import { test, expect } from "@playwright/test";
import { SPECIAL_ENDINGS, SCENES, MISSION } from "../../src/game/scenes.js";
import { finishFeedback, createGame, choose, finishTransition } from "../../src/game/engine.js";
import { UI_EN, UI_TR } from "../../src/i18n/ui.js";
import { DISCOVERIES } from "../../src/ui/discoveries.js";
import { SAVE, PROFILE, routes, beforeFinal, activitySeeds, seed, readSave, activate, nextTarget, assertTargetsClear } from "./fixtures.mjs";

const exceptions = new WeakMap();
test.beforeEach(({ page }) => { const list = []; exceptions.set(page, list); page.on("pageerror", error => list.push(error.message)); });
test.afterEach(({ page }) => expect(exceptions.get(page)).toEqual([]));

for (const [variant, game] of activitySeeds) {
  test(`activity ${variant}: touch/pointer targets and live language`, async ({ page }) => {
    const id = variant === "6C-report" ? "6C" : variant;
    await seed(page, game, { language: "tr" });
    await activate(page, '[data-action="resume"]');
    await activate(page, `[data-action="select"][data-choice="${id}"]`);
    await activate(page, `[data-action="confirm"][data-choice="${id}"]`);
    await page.locator(".act-target").first().waitFor();
    await activate(page, '[data-action="hint"]');
    for (let steps = 0; steps < 12; steps++) {
      if (await page.locator("body").getAttribute("data-screen") !== "activity") break;
      if (await page.locator(".task.is-finished").count()) { await page.waitForFunction(() => document.body.dataset.screen !== "activity"); break; }
      await assertTargetsClear(page);
      const stable = await page.evaluate(key => ({
        game: JSON.parse(localStorage.getItem(key)).game,
        hud: [...document.querySelectorAll(".gauge-num")].map(el => el.textContent),
        progress: document.querySelectorAll(".task-dots i.on").length,
        cubes: [...document.querySelectorAll("[data-cubes]")].map(el => el.innerHTML),
        chips: [...document.querySelectorAll("[data-chip]")].map(el => el.getAttribute("transform")),
      }), SAVE);
      await activate(page, '[data-action="language"]');
      const errors = await page.evaluate(({ tables, key, stable }) => {
        const table = tables[document.documentElement.lang], errors = [];
        for (const el of document.querySelectorAll("[data-i18n], [data-i18n-aria], [data-target-index]")) {
          const name = el.dataset.i18n ?? el.dataset.i18nAria ?? "act.target";
          const values = el.dataset.targetIndex ? { n: el.dataset.targetIndex, total: el.dataset.targetCount } : JSON.parse(el.dataset.i18nValues ?? "{}");
          const expected = table[name].replace(/\{(\w+)\}/g, (_, k) => values[k]);
          const actual = el.dataset.i18n ? el.textContent : el.getAttribute("aria-label");
          if (actual.replace(/\s+/g, " ").trim() !== expected.replace(/\s+/g, " ").trim()) errors.push(name);
        }
        const now = { game: JSON.parse(localStorage.getItem(key)).game, hud: [...document.querySelectorAll(".gauge-num")].map(el => el.textContent), progress: document.querySelectorAll(".task-dots i.on").length, cubes: [...document.querySelectorAll("[data-cubes]")].map(el => el.innerHTML), chips: [...document.querySelectorAll("[data-chip]")].map(el => el.getAttribute("transform")) };
        if (JSON.stringify(now) !== JSON.stringify(stable)) errors.push("Language switch changed task/game state");
        return errors;
      }, { tables: { en: UI_EN, tr: UI_TR }, key: SAVE, stable });
      expect(errors).toEqual([]);
      await assertTargetsClear(page);
      await nextTarget(page, id);
    }
    await expect(page.locator("body")).not.toHaveAttribute("data-screen", "activity");
    expect((await readSave(page)).game.history.at(-1)).toBe(id);
  });
}

for (const name of ["stone", "garden", "duti", "lantern", "visitors"]) {
  test(`ending ${name}: record immediately, reload and review exact page`, async ({ page }) => {
    const game = beforeFinal(routes[name]);
    const final = finishFeedback(game);
    const special = SPECIAL_ENDINGS.find(e => e.id === final.ending.special);
    await seed(page, game, { language: "tr", screen: "result" });
    await activate(page, '[data-action="resume"]');
    for (let i = 0; i < 15 && await page.locator("body").getAttribute("data-screen") !== "endpage"; i++) await activate(page, '[data-action="advance"]');
    await expect(page.locator("body")).toHaveAttribute("data-screen", "endpage");
    expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).endings, PROFILE)).toContain(special.id);
    if (special.fiction) { await expect(page.locator(".fiction-note")).toBeVisible(); await expect(page.locator(".fx--visitors")).toHaveCount(0); }
    await activate(page, '[data-action="end-next"]');
    const before = (await readSave(page)).game;
    await page.reload();
    await expect(page.locator('[data-action="resume"]')).toHaveText(UI_TR["title.review"]);
    await activate(page, '[data-action="resume"]');
    await expect(page.locator("body")).toHaveAttribute("data-screen", "endpage");
    expect((await readSave(page)).game.ending.page).toBe(before.ending.page);
    for (let i = 0; i < 2; i++) {
      await activate(page, '[data-action="language"]');
      expect((await readSave(page)).game.ending.page).toBe(before.ending.page);
      expect((await readSave(page)).game.resources).toEqual(before.resources);
    }
    await activate(page, '[data-action="end-back"]');
    await activate(page, '[data-action="end-skip"]');
    await expect(page.locator("body")).toHaveAttribute("data-screen", "ending");
    await page.reload();
    await activate(page, '[data-action="resume"]');
    await expect(page.locator("body")).toHaveAttribute("data-screen", "ending");
    await activate(page, '.popup--ending [data-action="journal"]');
    expect(await page.evaluate(({ key, id }) => JSON.parse(localStorage.getItem(key)).endings.filter(found => found === id).length, { key: PROFILE, id: special.id })).toBe(1);
  });
}

test("partial and stopped mission reports remain reviewable", async ({ page }) => {
  const game = beforeFinal(routes.compare);
  const ended = finishFeedback(game);
  expect(ended.status).toBe("partial");
  await seed(page, ended, { screen: "ending" });
  await activate(page, '[data-action="resume"]');
  await expect(page.locator("body")).toHaveAttribute("data-screen", "ending");
  let stopped = createGame("standard");
  for (const id of "1A 2B 3A 4B 5A".split(" ")) { stopped = choose(stopped, id); if (stopped.phase === "feedback") stopped = finishFeedback(stopped); if (stopped.phase === "transition") stopped = finishTransition(stopped); }
  expect(stopped.status).toBe("failed");
  await page.evaluate(({ key, game }) => { const saved = JSON.parse(localStorage.getItem(key)); saved.game = game; saved.screen = "ending"; localStorage.setItem(key, JSON.stringify(saved)); }, { key: SAVE, game: stopped });
  await page.reload();
  await activate(page, '[data-action="resume"]');
  await expect(page.locator("body")).toHaveAttribute("data-screen", "ending");
});

test("an invalid saved ending cannot unlock a Journal entry", async ({ page }) => {
  const game = finishFeedback(beforeFinal(routes.visitors));
  game.ending.special = "not-a-real-ending";
  await seed(page, game, { screen: "endpage" });
  await expect(page.locator('[data-action="resume"]')).toHaveCount(0);
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key) ?? "{}").endings ?? [], PROFILE)).toEqual([]);
  // A real ending ID with the wrong history must also be rejected.
  await page.evaluate(key => {
    const saved = JSON.parse(localStorage.getItem(key));
    saved.game.ending.special = "the-smallest-garden";
    localStorage.setItem(key, JSON.stringify(saved));
  }, SAVE);
  await page.reload();
  await expect(page.locator('[data-action="resume"]')).toHaveCount(0);
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key) ?? "{}").endings ?? [], PROFILE)).toEqual([]);
});

test("fresh-mission discoveries and in-progress resume stay separate from the Journal", async ({ page }) => {
  const all = Object.values(DISCOVERIES).flat().map(d => d.id);
  await seed(page, createGame("standard"), { screen: "choices", profile: { name: "Commander", discoveries: all, endings: [], facts: [], seen: [] } });
  await activate(page, '[data-action="new-game"]');
  await activate(page, '[data-action="begin"]');
  expect((await readSave(page)).found).toEqual([]);
  const before = (await readSave(page)).game;
  await page.reload();
  await activate(page, '[data-action="resume"]');
  expect((await readSave(page)).game.resources).toEqual(before.resources);
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).discoveries.length, PROFILE)).toBe(all.length);
});

test.describe("normal-motion keyboard smoke", () => {
  test.use({ reducedMotion: "no-preference" });
  test("MEDA task accepts Enter/Space and preserves progress on language change", async ({ page }) => {
    await seed(page, activitySeeds.get("2C"));
    const enter = async selector => { const target = page.locator(selector).first(); await target.focus(); await target.press("Enter"); };
    await enter('[data-action="resume"]');
    await enter('[data-action="select"][data-choice="2C"]');
    await enter('[data-action="confirm"][data-choice="2C"]');
    await page.locator(".act-target.is-correct").first().waitFor();
    await assertTargetsClear(page);
    await enter(".act-target.is-correct");
    await expect(page.locator(".task-dots i.on")).toHaveCount(1);
    await enter('[data-action="language"]');
    await expect(page.locator(".task-dots i.on")).toHaveCount(1);
    await assertTargetsClear(page);
    const answer = page.locator(".act-target.is-correct").first();
    await answer.focus();
    await answer.press("Space");
    await expect(page.locator("body")).not.toHaveAttribute("data-screen", "activity");
    expect((await readSave(page)).game.history.at(-1)).toBe("2C");
  });
});
