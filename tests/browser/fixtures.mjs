// AI-assisted generation: OpenAI Codex. See AI_USAGE.md and ai-usage.json.
import { expect } from "@playwright/test";
import { createGame, choose, finishFeedback, finishTransition } from "../../src/game/engine.js";

export const SAVE = "compass-outpost-save-v3";
export const PROFILE = "compass-outpost-profile-v1";
export const routes = {
  stone: "1A 2B 3A 4C 5A 6A 7A 8A 9A 10A",
  garden: "1A 2A 3A 4A 5B 6C 7B 8A 9A 10B",
  duti: "1B 2A 3A 4B 5A 6B 7B 8B 9B 10C",
  lantern: "1A 2A 3A 4A 5B 6A 7B 8C 9A 10A",
  visitors: "1A 2C 3A 4C 5B 6C 7C 8C 9A 10A",
  ordinary: "1A 2A 3A 4A 5A 6B 7A 8A 9A 10A",
  compare: "1B 2C 3B 4C 5A 6A 7C 8B 9C 10C",
  gate: "1A 2A 3C 4C 5B 6A 7A 8B 9A 10A",
  risk: "1B 2A 3C 4C 5C 6A 7B 8C 9A 10A",
};
export function beforeFinal(route) {
  let game = createGame("standard");
  const ids = route.split(" ");
  for (const id of ids.slice(0, -1)) game = finishTransition(finishFeedback(choose(game, id)));
  return choose(game, ids.at(-1));
}
export const activitySeeds = new Map();
for (const route of Object.values(routes)) {
  let game = createGame("standard");
  for (const id of route.split(" ")) {
    if (game.phase !== "scene") break;
    const variant = id === "6C" && game.flags.greenhouseMode === "off" ? "6C-report" : id;
    const previous = activitySeeds.get(variant);
    if (!previous || game.resources.energy + game.resources.oxygen > previous.resources.energy + previous.resources.oxygen) activitySeeds.set(variant, game);
    game = choose(game, id);
    if (game.phase === "feedback") game = finishFeedback(game);
    if (game.phase === "transition") game = finishTransition(game);
  }
}
let report = createGame("standard");
for (const id of "1A 2A 3C 4C 5B".split(" ")) report = finishTransition(finishFeedback(choose(report, id)));
activitySeeds.set("6C-report", report);

export async function seed(page, game, { language = "en", screen = "choices", profile } = {}) {
  await page.addInitScript(({ saved, profile, SAVE, PROFILE }) => {
    // Reload must preserve the application's updated save, not reinstall the fixture.
    if (!localStorage.getItem(SAVE)) {
      localStorage.setItem(SAVE, JSON.stringify(saved));
      if (profile) localStorage.setItem(PROFILE, JSON.stringify(profile));
    }
    Math.random = () => 0.01;
  }, { saved: { game, screen, language, facts: [], seenCards: [], found: [], score: { right: 0, total: 0 } }, profile, SAVE, PROFILE });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
}

export const readSave = page => page.evaluate(key => JSON.parse(localStorage.getItem(key)), SAVE);
export async function activate(page, selector) {
  const locator = page.locator(selector).first();
  await locator.scrollIntoViewIfNeeded();
  if (await page.evaluate(() => navigator.maxTouchPoints > 0)) await locator.tap();
  else await locator.click();
}
export async function nextTarget(page, choice) {
  let selector = ".act-target";
  if (choice === "2A") {
    const count = await page.locator('[data-cubes="air"] rect').count();
    selector = `[data-i18n-aria="act.share.${count < 2 ? "air" : "heat"}"]`;
  } else if (["2B", "2C", "7A"].includes(choice)) selector = ".act-target.is-correct";
  else if (choice === "9A") {
    const chip = page.locator('.act-target[data-i18n-aria^="act.clue."]').first();
    const key = await chip.getAttribute("data-i18n-aria");
    await activate(page, `[data-i18n-aria="${key}"]`);
    selector = `[data-i18n-aria="act.bin.${key.endsWith("stripes") ? "rock" : "relay"}"]`;
  }
  const before = await page.locator(".task-progress").innerText();
  await activate(page, selector);
  await page.waitForFunction(before => document.body.dataset.screen !== "activity"
    || document.querySelector(".task-progress")?.innerText !== before
    || document.querySelector(".task.is-finished"), before);
  // Reduced-motion completion can replace the banner between DOM reads. Wait for the
  // final render rather than trying to click a target in an already-completed task.
  if (await page.locator(".task.is-finished").count() || !await page.locator(".act-target").count()) {
    await page.waitForFunction(() => document.body.dataset.screen !== "activity");
  }
}
export async function assertTargetsClear(page) {
  const issues = await page.evaluate(() => {
    const rect = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; };
    const intersects = (a, b) => Math.min(a.x + a.w, b.x + b.w) > Math.max(a.x, b.x) + 1
      && Math.min(a.y + a.h, b.y + b.h) > Math.max(a.y, b.y) + 1;
    const targets = [...document.querySelectorAll(".act-target")];
    const blockers = [document.querySelector("#hud"), document.querySelector(".task")].filter(Boolean).map(rect);
    const failures = [];
    for (const [i, el] of targets.entries()) {
      const r = rect(el), top = document.elementFromPoint(r.x + r.w / 2, r.y + r.h / 2);
      if (!top || !el.contains(top)) failures.push(`Target ${i} is blocked`);
      if (r.x < -1 || r.y < -1 || r.x + r.w > innerWidth + 1 || r.y + r.h > innerHeight + 1) failures.push(`Target ${i} is off screen`);
      if (blockers.some(b => intersects(r, b))) failures.push(`Target ${i} overlaps instructions/HUD`);
      if (targets.slice(i + 1).some(other => intersects(r, rect(other)))) failures.push(`Target ${i} overlaps another target`);
    }
    return failures;
  });
  expect(issues).toEqual([]);
}
