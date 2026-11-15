// AI-assisted generation: OpenAI Codex. See AI_USAGE.md and ai-usage.json.
// Capture selected real UI interactions; no runtime or NASA data is modified.
import { chromium } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { finishFeedback } from "../src/game/engine.js";
import { activitySeeds, beforeFinal, routes, SAVE, PROFILE } from "../tests/browser/fixtures.mjs";

const out = path.resolve(process.env.DEMO_BUILD_DIR ?? "../../demo-build");
await mkdir(out, { recursive: true });
const base = process.env.DEMO_GAME_URL ?? "http://127.0.0.1:5173";
const scenes = [
  { id: "01-title", duration: 3, label: "COMPASS OUTPOST", title: "Ten Sols of<br>Questions", body: "A Mars mission game<br>with your robot friend DUTİ.", note: "Build a Junior Astronaut Mission Trainer · 2026 Space Apps", mode: "title" },
  { id: "02-choices", duration: 5, label: "MAKE A DECISION", title: "Every choice<br>has a cost", body: "Balance oxygen, energy<br>and crew safety.", note: "Fictional resource points; not NASA consumption rates.", mode: "2A" },
  { id: "03-meda", duration: 7, label: "LEARN WITH NASA DATA", title: "Compare real<br>observations", body: "Read archival temperatures.<br>Calculate the difference.", note: "Perseverance MEDA · Sol 290 · 13 Dec 2021 · °C · NASA PDS. Not a forecast.", mode: "2C" },
  { id: "04-pattern", duration: 5, label: "TEST AN EXPLANATION", title: "Observe.<br>Compare.<br>Explain.", body: "Try a pattern task.<br>DUTİ explains the result.", note: "The outpost equipment and its mystery are fictional.", mode: "7A" },
  { id: "05-ending", duration: 4, label: "FOLLOW THE CONSEQUENCES", title: "Your choices<br>leave a trace", body: "Earlier plant care can protect<br>a living tray for the next crew.", note: "Mars background: NASA/JPL-Caltech/ASU/MSSS · PIA26373.", mode: "ending" },
  { id: "06-close", duration: 5, label: "EXPLORE THE PROJECT", title: "Which trail<br>will you take?", body: "Ten sols of decisions.<br>English and optional Turkish.", note: "Sources: NASA MEDA/PDS and DONKI · Story/code: ChatGPT/Codex + Claude.", mode: "report" },
];
const html = s => `<!doctype html><html lang="en"><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;width:1920px;height:1080px;overflow:hidden;background:#0b1026;color:#fff8ed;font-family:Arial,sans-serif}
.brand{position:absolute;left:72px;top:58px;color:#a9b9cb;font-size:25px;letter-spacing:1px}.step{position:absolute;right:72px;top:58px;color:#ffcc8b;font-size:25px}
.copy{position:absolute;left:72px;top:226px;width:532px}.label{font-size:22px;letter-spacing:2px;color:#ffcc8b;margin-bottom:30px}h1{font-size:70px;line-height:1.06;letter-spacing:-2px;margin:0 0 32px;font-weight:700}p{font-size:30px;line-height:1.45;margin:0;color:#ced7e4}
.screen{position:absolute;left:640px;top:200px;width:1229px;height:692px;overflow:hidden;border:1px solid #617389;border-radius:12px;background:#0b1026}iframe{border:0;width:1280px;height:720px;transform:scale(.96);transform-origin:0 0}
.note{position:absolute;left:72px;right:72px;top:930px;font-size:22px;line-height:1.35;color:#aebed0}.watermark{position:absolute;left:72px;top:1015px;font-size:21px;color:#ffcc8b}.edit{position:absolute;right:72px;top:1015px;font-size:21px;color:#aebed0}
.url{margin-top:30px;color:#ffcc8b;font-size:24px;line-height:1.4;overflow-wrap:anywhere}
</style><body><div class="brand">ASTRAL BEARS22 · COMPASS OUTPOST</div><div class="step">${s.id.slice(0,2)} / 06</div><div class="copy"><div class="label">${s.label}</div><h1>${s.title}</h1><p>${s.body}</p>${s.mode === "report" ? '<div class="url">github.com/yugennnx/<br>Astral_Bears22_Nasa_Game</div>' : ""}</div><div class="screen"><iframe src="${base}/"></iframe></div><div class="note">${s.note}</div><div class="watermark">AI-GENERATED DEMO · AI-generated game illustrations</div><div class="edit">Edited gameplay from selected mission states · No audio</div></body></html>`;
const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {}) });
const selected = process.env.DEMO_SCENE;
const clips = selected ? JSON.parse(await readFile(path.join(out, "clips.json"), "utf8")).clips.filter(c => c.id !== selected) : [];
for (const scene of scenes.filter(s => !selected || s.id === selected)) {
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: "reduce", recordVideo: { dir: out, size: { width: 1920, height: 1080 } } });
  const ending = finishFeedback(beforeFinal(routes.garden));
  if (scene.mode === "report") ending.ending.page = 99;
  const game = ["ending", "report"].includes(scene.mode) ? ending : activitySeeds.get(scene.mode);
  await context.addInitScript(({ origin, game, SAVE, PROFILE }) => {
    if (location.origin !== origin) return;
    localStorage.clear();
    localStorage.setItem("compass-outpost-sound", "off");
    if (game) localStorage.setItem(SAVE, JSON.stringify({ game, screen: game.phase === "ended" ? "ending" : "choices", language: "en", seenCards: [], facts: [], found: [], score: { right: 0, total: 0 } }));
    localStorage.setItem(PROFILE, JSON.stringify({ name: "", discoveries: [], facts: [], endings: [], seen: [] }));
    Math.random = () => 0.01;
  }, { origin: base, game, SAVE, PROFILE });
  const page = await context.newPage();
  const born = Date.now();
  await page.route(`${base}/demo-stage.html`, route => route.fulfill({ contentType: "text/html", body: html(scene) }));
  await page.goto(`${base}/demo-stage.html`);
  const frame = page.frames().find(f => f.url() === `${base}/`);
  if (!frame) throw new Error("Game iframe missing");
  await frame.evaluate(() => document.fonts.ready);
  const click = selector => frame.locator(selector).first().click();
  if (game) await click('[data-action="resume"]');
  if (activitySeeds.has(scene.mode)) {
    await click(`[data-action="select"][data-choice="${scene.mode}"]`);
    if (scene.mode !== "2A") {
      await click(`[data-action="confirm"][data-choice="${scene.mode}"]`);
      await frame.locator(".act-target").first().waitFor();
    }
  }
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(out, `${scene.id}.png`) });
  const start = (Date.now() - born) / 1000;
  const sceneStart = Date.now();
  if (scene.mode === "2A") {
    await page.waitForTimeout(2100);
    await click('[data-action="confirm"][data-choice="2A"]');
    await frame.locator(".act-target").first().waitFor();
    await click('[data-i18n-aria="act.share.air"]');
    await page.waitForTimeout(350);
    await click('[data-i18n-aria="act.share.air"]');
  } else if (scene.mode === "2C") {
    await page.waitForTimeout(2200);
    await click(".act-target.is-correct");
    await page.waitForTimeout(2400);
    await click(".act-target.is-correct");
  } else if (scene.mode === "7A") {
    for (let i = 0; i < 3; i++) { await page.waitForTimeout(950); await click(".act-target.is-correct"); }
  } else if (scene.mode === "ending") {
    await page.waitForTimeout(1900);
    await click('[data-action="end-next"]');
  }
  await page.waitForTimeout(Math.max(0, (scene.duration + 1.2) * 1000 - (Date.now() - sceneStart)));
  const file = await page.video().path();
  await context.close();
  clips.push({ id: scene.id, file, start, duration: scene.duration });
  console.log(`${scene.id}: ${scene.duration}s captured`);
}
await browser.close();
clips.sort((a, b) => a.id.localeCompare(b.id));
await writeFile(path.join(out, "clips.json"), JSON.stringify({ baseCommit: "e27dbd6", clips, intendedDuration: 29 }, null, 2));
console.log(`Capture manifest: ${path.join(out, "clips.json")}`);
