// AI-assisted generation: OpenAI ChatGPT/Codex. See AI_USAGE.md and ai-usage.json.
// Checks disclosure records, not competition eligibility or legal rights.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { AI_DISCLOSURE, MISSION } from "../src/game/scenes.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const readJson = async path => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), "utf8"));
const manifest = await readJson("ai-usage.json");
assert.equal(manifest.aiAssistanceUsed, true);
assert.deepEqual([...manifest.tools].sort(), ["ChatGPT", "Claude", "Codex"]);
assert.equal(manifest.originalityAttestation.independentOrganizerApproval, false);
assert.equal(manifest.originalityAttestation.plannedFeaturesImplemented, false);
assert.equal(manifest.modelIdentifier, null);
assert.equal(manifest.licenseDecision.status, "deferred-by-user");
assert.equal(manifest.licenseDecision.projectLicenseAdded, false);

const inventory = new Map();
for (const artifact of manifest.artifacts) {
  assert(!inventory.has(artifact.path), `Duplicate disclosure entry: ${artifact.path}`);
  assert(!artifact.path.startsWith("/") && !artifact.path.split("/").includes(".."));
  assert(artifact.scope && artifact.status && Array.isArray(artifact.tools));
  await access(new URL(`../${artifact.path}`, import.meta.url));
  if (artifact.status === "external-unmodified") {
    const bytes = await readFile(new URL(`../${artifact.path}`, import.meta.url));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), artifact.sha256);
    assert.equal(artifact.tools.length, 0);
  }
  inventory.set(artifact.path, artifact);
}

const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { cwd: root, encoding: "utf8" })
  .trim().split(/\r?\n/).filter(Boolean);
for (const path of new Set(files)) {
  if (/\.(md|js|mjs|py|json)$/i.test(path)) {
    assert(inventory.has(path), `Missing file-level provenance: ${path}`);
  }
  assert(!/^LICENSE(?:\..+)?$/i.test(path), "User deferred project licensing; no LICENSE file should be added.");
}

assert.equal(AI_DISCLOSURE.aiAssistanceUsed, true);
assert.deepEqual(AI_DISCLOSURE.tools, manifest.tools);
assert.equal(MISSION.aiDisclosure, AI_DISCLOSURE);
assert(MISSION.creditsCard.text.includes("Claude"));
assert(MISSION.creditsCard.text.includes("ChatGPT/Codex"));
for (const path of ["src/game/scenes.js", "tools/check_story_data.mjs", "tools/check_disclosures.mjs", "tools/verify_nasa_sources.py"]) {
  const text = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
  assert(text.slice(0, 900).includes("AI-assisted"), `Missing source notice: ${path}`);
}
for (const path of ["data/nasa_events.json", "data/meda_jezero.json"]) {
  const data = await readJson(path);
  assert.equal(data._provenance.aiAssistanceUsed, true);
  assert.equal(data._provenance.originalMeasurementsGeneratedByAi, false);
  assert(data._provenance.tools.includes("Anthropic Claude"));
}

const events = await readJson("data/nasa_events.json");
const raw = await readJson("data/raw/donki-cme-2024-05-20.json");
const event = events.events[0];
const original = raw.find(item => item.activityID === event.id);
assert(original, "Curated DONKI event missing from saved source response");
assert.equal(event.startTime, original.startTime);
assert.deepEqual(event.speed_km_s_most_accurate,
  original.cmeAnalyses.filter(item => item.isMostAccurate).map(item => item.speed));
const audit = await readJson("data/source-audit.json");
assert.equal(audit.donki.marsEventMatch, "not-established");
const meda = await readJson("data/meda_jezero.json");
for (const item of meda.sols) {
  const receipt = audit.meda.find(row => row.sol === item.sol);
  assert(receipt);
  assert.deepEqual([item.airTemp_minC, item.airTemp_maxC], receipt.recomputedSummary_C);
  assert.equal(item.sourceFileSha256, receipt.sha256);
}

const disclosure = await readFile(new URL("../AI_USAGE.md", import.meta.url), "utf8");
assert(disclosure.includes("Anthropic Claude") && disclosure.includes("OpenAI ChatGPT/Codex"));
assert(!disclosure.includes("earlier tool provenance is not confirmed"));
assert(!disclosure.includes("github.com/nasa/spaceapps/discussions/"), "Use only official 2026 website pages as rule authorities.");
console.log(`Disclosure inventory verified: ${inventory.size} artifacts, ChatGPT/Codex and Claude, exported metadata, raw-source hash, and source receipts.`);
console.log("License decision remains deferred. This check does not certify rights, human originality, registration, or final submission.");
