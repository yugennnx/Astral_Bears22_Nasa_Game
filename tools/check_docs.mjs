// AI-assisted generation: OpenAI Codex. See AI_USAGE.md and ai-usage.json.
import assert from "node:assert/strict";
import path from "node:path";
import { readFile, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { SCENE_ORDER, SCENES, SPECIAL_ENDINGS } from "../src/game/scenes.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const files = [...new Set(execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { cwd: root, encoding: "utf8" }).trim().split(/\r?\n/))].filter(Boolean);
const markdown = new Map(await Promise.all(files.filter(f => f.endsWith(".md")).map(async f => [path.resolve(root, f), await readFile(path.resolve(root, f), "utf8")])));
const anchors = new Map();
for (const [file, text] of markdown) {
  const set = new Set([...text.matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1]));
  const occurrences = new Map();
  for (const match of text.matchAll(/^#{1,6}\s+(.+)$/gm)) {
    const slug = match[1].trim().toLowerCase().replace(/<[^>]*>/g, "").replace(/[^\p{L}\p{N}\s_-]/gu, "").replace(/\s/g, "-");
    const number = occurrences.get(slug) ?? 0;
    set.add(number ? `${slug}-${number}` : slug);
    occurrences.set(slug, number + 1);
  }
  anchors.set(file, set);
}
let count = 0;
for (const [file, text] of markdown) {
  for (const match of text.matchAll(/!?\[[^\]]*\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+["'][^)]*)?\s*\)/g)) {
    const href = match[1] ?? match[2];
    if (/^[a-z][a-z\d+.-]*:/i.test(href)) continue;
    const [target, fragment] = href.split("#");
    const resolved = target ? path.resolve(path.dirname(file), decodeURIComponent(target)) : file;
    assert(resolved.startsWith(root), `Link escapes repository: ${href}`);
    await stat(resolved).catch(() => assert.fail(`Broken link in ${path.relative(root, file)}: ${href}`));
    if (fragment && anchors.has(resolved)) assert(anchors.get(resolved).has(decodeURIComponent(fragment)), `Broken anchor in ${path.relative(root, file)}: ${href}`);
    count++;
  }
}
const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const readme = markdown.get(path.resolve(root, "README.md"));
assert(readme.includes(`Current version: ${pkg.version}`), "README current version differs from package.json");
assert(readme.includes(`${SCENE_ORDER.flatMap(id => SCENES[id].choices).length} choices`), "README choice count is stale");
assert(readme.includes(`${["zero", "one", "two", "three", "four", "five"][SPECIAL_ENDINGS.length] ?? SPECIAL_ENDINGS.length} discoverable special endings`), "README ending count is stale");
for (const file of ["README.md", "AGENTS.md", "docs/project-status.md", "docs/submission-checklist.md", "docs/nasa-data-map.md", "docs/maintenance.md"]) {
  const text = markdown.get(path.resolve(root, file));
  assert(text, `Missing current document: ${file}`);
  assert(!/[\u{1F300}-\u{1FAFF}]/u.test(text), `Emoji in professional current document: ${file}`);
}
console.log(`Documentation verified: ${markdown.size} Markdown files, ${count} local links/anchors, current version and runtime counts.`);
