"""AI-assisted generation: OpenAI Codex. See AI_USAGE.md and ai-usage.json.

Encode captured WebM clips as a silent, 29-second H.264 demo.
Requires a local ffmpeg executable; it is a build tool, not shipped with the game.
"""
import argparse
import json
import pathlib
import subprocess

parser = argparse.ArgumentParser()
parser.add_argument("--ffmpeg", required=True)
parser.add_argument("--capture-dir", required=True, type=pathlib.Path)
parser.add_argument("--output", required=True, type=pathlib.Path)
args = parser.parse_args()
manifest = json.loads((args.capture_dir / "clips.json").read_text(encoding="utf-8"))
assert sum(clip["duration"] for clip in manifest["clips"]) == 29
args.output.parent.mkdir(parents=True, exist_ok=True)
command = [args.ffmpeg, "-hide_banner", "-y"]
for clip in manifest["clips"]:
    command += ["-threads", "2", "-i", clip["file"]]
filters = []
for i, clip in enumerate(manifest["clips"]):
    filters.append(f"[{i}:v]trim=start={clip['start']:.3f}:duration={clip['duration']},setpts=PTS-STARTPTS,fps=30,scale=1920:1080,setsar=1[v{i}]")
filters.append("".join(f"[v{i}]" for i in range(len(manifest["clips"]))) + "concat=n=6:v=1:a=0[out]")
command += ["-filter_complex", ";".join(filters), "-map", "[out]", "-an", "-c:v", "libx264", "-threads", "4", "-preset", "fast", "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-t", "29", "-metadata", "title=Compass Outpost: Ten Sols of Questions - Project Demo", "-metadata", "artist=Astral Bears22", "-metadata", "language=eng", "-metadata:s:v:0", "language=eng", "-metadata", "comment=AI-generated demo: OpenAI Codex. Game art/story/code: ChatGPT/Codex and Claude. NASA observations are archival, not AI-generated. Edited excerpts; no audio. Sources: docs/demo.md.", str(args.output)]
subprocess.run(command, check=True)
subprocess.run([args.ffmpeg, "-hide_banner", "-i", str(args.output), "-f", "null", "-"], check=True)
print(f"Demo encoded and fully decoded: {args.output}")
