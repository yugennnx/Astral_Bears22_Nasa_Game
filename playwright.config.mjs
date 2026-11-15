// AI-assisted generation: OpenAI Codex. See AI_USAGE.md and ai-usage.json.
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  timeout: 60_000,
  expect: { timeout: 8_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:5173",
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {},
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1280, height: 720 } } },
    { name: "phone", use: { viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true } },
    { name: "small-phone", use: { viewport: { width: 360, height: 640 }, hasTouch: true, isMobile: true } },
    { name: "landscape", use: { viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true } },
  ],
  webServer: {
    command: "node tools/serve.mjs",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 20_000,
  },
});
