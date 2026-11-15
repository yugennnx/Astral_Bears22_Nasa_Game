// AI-assisted generation: OpenAI Codex. See AI_USAGE.md and ai-usage.json.
import { test, expect } from "@playwright/test";
import { finishFeedback } from "../../src/game/engine.js";
import { routes, beforeFinal, readSave, activate, nextTarget, assertTargetsClear } from "./fixtures.mjs";

for (const language of ["en", "tr"]) {
  test(`complete ten-sol visitor campaign from a fresh browser (${language})`, async ({ page }) => {
    test.setTimeout(120_000);
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.addInitScript(() => { Math.random = () => 0.01; });
    await page.goto("/");
    if (language === "tr") await activate(page, '[data-action="language"]');
    await activate(page, '[data-action="new-game"]');
    expect((await readSave(page)).game.profileId).toBe("standard");
    await page.locator("#player-name").fill("Commander");
    await activate(page, '[data-action="begin"]');
    const choices = routes.visitors.split(" ");
    for (let steps = 0; steps < 500; steps++) {
      if (await page.locator("#modal[open]").count()) {
        await activate(page, '#modal [data-action="close-modal"]');
        continue;
      }
      const screen = await page.locator("body").getAttribute("data-screen");
      if (screen === "ending") break;
      if (screen === "intro") await activate(page, '[data-action="intro-done"]');
      else if (screen === "story" || screen === "result") await activate(page, '[data-action="advance"]');
      else if (screen === "spot") {
        if (await page.locator(".observe-btn").count()) {
          await activate(page, ".observe-btn");
          await page.waitForFunction(() => !document.querySelector(".dialog-next.is-waiting"));
        } else await activate(page, '[data-action="advance"]');
      } else if (screen === "explore") await activate(page, '[data-action="ready"]');
      else if (screen === "choices") {
        const game = (await readSave(page)).game;
        const id = choices[game.history.length];
        await activate(page, `[data-action="select"][data-choice="${id}"]`);
        await activate(page, `[data-action="confirm"][data-choice="${id}"]`);
      } else if (screen === "activity") {
        if (await page.locator(".task.is-finished").count()) await page.waitForFunction(() => document.body.dataset.screen !== "activity");
        else {
          await assertTargetsClear(page);
          const history = (await readSave(page)).game.history;
          await nextTarget(page, history.at(-1));
        }
      } else if (screen === "predict") {
        await activate(page, '[data-action="guess"]:not(:disabled)');
        await page.waitForFunction(() => document.body.dataset.screen !== "predict");
      } else if (screen === "fact") {
        await activate(page, '[data-action="collect-fact"]:not(:disabled)');
        await page.waitForFunction(() => document.body.dataset.screen !== "fact");
      } else if (screen === "transition") await activate(page, '[data-action="skip-cinema"]');
      else if (screen === "ledger") await activate(page, '[data-action="next-sol"]');
      else if (screen === "endpage") await activate(page, '[data-action="end-next"]');
      else throw new Error(`Unexpected campaign screen: ${screen}`);
    }
    await expect(page.locator("body")).toHaveAttribute("data-screen", "ending");
    const actual = (await readSave(page)).game;
    const expected = finishFeedback(beforeFinal(routes.visitors));
    expect(actual.history).toEqual(choices);
    expect(actual.status).toBe("success");
    expect(actual.ending.special).toBe("the-visitors-beyond-the-window");
    expect(actual.resources).toEqual(expected.resources);
    expect(actual.science).toBe(expected.science);
    expect(errors).toEqual([]);
  });
}
