// AI-assisted generation: OpenAI Codex. See AI_USAGE.md and ai-usage.json.
// Inspect actual MP4 headers and bytes; metadata alone is not proof of duration.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const file = new URL("../docs/demo/compass-outpost-demo.mp4", import.meta.url);
const bytes = await readFile(file);
const metadata = JSON.parse(await readFile(new URL("../docs/demo/demo-metadata.json", import.meta.url), "utf8"));
function boxes(start, end) {
  const result = [];
  for (let at = start; at < end;) {
    assert(at + 8 <= end, "Truncated MP4 box header");
    const short = bytes.readUInt32BE(at), header = short === 1 ? 16 : 8;
    const size = short === 1 ? Number(bytes.readBigUInt64BE(at + 8)) : short || end - at;
    assert(size >= header && at + size <= end, "Invalid MP4 box size");
    result.push({ type: bytes.toString("ascii", at + 4, at + 8), data: at + header, end: at + size });
    at += size;
  }
  return result;
}
const children = box => boxes(box.data, box.end);
const required = (list, type) => { const box = list.find(b => b.type === type); assert(box, `Missing ${type}`); return box; };
const root = boxes(0, bytes.length), moov = required(root, "moov");
required(root, "ftyp"); required(root, "mdat");
const movie = children(moov), mvhd = required(movie, "mvhd");
const version = bytes[mvhd.data];
assert([0, 1].includes(version));
const scale = bytes.readUInt32BE(mvhd.data + (version ? 20 : 12));
const ticks = version ? Number(bytes.readBigUInt64BE(mvhd.data + 24)) : bytes.readUInt32BE(mvhd.data + 16);
const duration = ticks / scale;
assert(duration > 0 && duration <= 30, `Official video duration limit exceeded: ${duration}`);
assert.equal(duration, metadata.durationSeconds);
const tracks = movie.filter(b => b.type === "trak").map(trak => required(children(trak), "mdia"));
const handlers = tracks.map(mdia => { const h = required(children(mdia), "hdlr"); return bytes.toString("ascii", h.data + 8, h.data + 12); });
assert.deepEqual(handlers, ["vide"], "The demo must have one video track and no audio");
const minf = required(children(tracks[0]), "minf"), stbl = required(children(minf), "stbl");
const table = children(stbl), stsd = required(table, "stsd");
const codec = required(boxes(stsd.data + 8, stsd.end), "avc1");
assert.equal(bytes.readUInt16BE(codec.data + 24), metadata.width);
assert.equal(bytes.readUInt16BE(codec.data + 26), metadata.height);
assert.deepEqual([metadata.width, metadata.height], [1920, 1080]);
const stts = required(table, "stts"), entries = bytes.readUInt32BE(stts.data + 4);
let frames = 0;
for (let i = 0; i < entries; i++) frames += bytes.readUInt32BE(stts.data + 8 + i * 8);
assert.equal(frames, metadata.frameCount);
assert.equal(frames / duration, metadata.framesPerSecond);
assert.equal(metadata.language, "en");
assert.equal(metadata.audioStreams, 0);
assert.equal(metadata.byteSize, bytes.length);
assert.equal(metadata.sha256, createHash("sha256").update(bytes).digest("hex"));
assert.equal(metadata.aiAssistanceUsed, true);
assert.equal(metadata.nasaMeasurementsGeneratedByAi, false);
assert.equal(metadata.humanFootage, false);
assert.equal(metadata.humanVoice, false);
assert(metadata.visibleWatermark.includes("AI-GENERATED DEMO"));
const captions = await readFile(new URL("../docs/demo/compass-outpost-demo.vtt", import.meta.url), "utf8");
assert(captions.startsWith("WEBVTT\n"));
assert.equal([...captions.matchAll(/-->/g)].length, 6);
assert(captions.includes("00:29.000"));
console.log(`Demo verified from MP4 bytes: ${duration}s, ${metadata.width}x${metadata.height}, H.264, ${frames} frames, no audio, SHA-256 match, six caption cues.`);
console.log("Visual labeling/source claims require frame review; this check does not certify eligibility or submit the project.");
