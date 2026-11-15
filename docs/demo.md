# Project Demo

> AI/SI disclosure: this demo was planned, captured and edited with OpenAI Codex from the actual game. Its watermark is visible throughout. Existing game illustration, story and implementation contributions by OpenAI ChatGPT/Codex and Anthropic Claude remain separately attributed. No NASA measurements were generated or modified.

## Watch

[Download or play the 29-second English MP4](demo/compass-outpost-demo.mp4)

Public video URL for **Link to Project Demo**:

https://raw.githubusercontent.com/yugennnx/Astral_Bears22_Nasa_Game/main/docs/demo/compass-outpost-demo.mp4

The video has English on-screen explanations and no audio, human likeness, human voice or personal participant name. "Commander" is a fictional player name. [Optional caption transcript](demo/compass-outpost-demo.vtt) reproduces the editorial explanations; there is no spoken narration. The [metadata record](demo/demo-metadata.json) identifies format, sources and provenance.

## What it demonstrates

| Time | Actual interface feature |
| --- | --- |
| 00:00–00:03 | Compass Outpost and companion DUTİ |
| 00:03–00:08 | Choice costs and oxygen-machine allocation task |
| 00:08–00:15 | MEDA archival temperature comparison and difference task |
| 00:15–00:20 | Sol 7 three-note pattern task |
| 00:20–00:24 | A choice-dependent garden ending |
| 00:24–00:29 | Completed mission report, replay invitation and project link |

These are edited excerpts from different reachable mission states in build `e27dbd6`, not a claim to play all ten sols continuously in 29 seconds. The production engine supplies the states and outcomes; actual controls perform the shown interactions. No game rules, values or NASA observations were changed to make the recording. Game resources, equipment and endings are fictional. The optional visitor ending is not shown. No measured educational outcome or NASA endorsement is claimed.

## Sources and rights

- **NASA data:** [Perseverance MEDA / NASA PDS](https://pds.nasa.gov/ds-view/pds/viewBundle.jsp?identifier=urn:nasa:pds:mars2020_meda), selected Sol 290 readings, December 13, 2021, degrees Celsius; rounded for the displayed arithmetic. Past observations, not a forecast. The game also uses [NASA DONKI](https://ccmc.gsfc.nasa.gov/tools/DONKI/), credited in the end card; the DONKI source card is not shown in this short video.
- **Mars background in the ending/report:** [PIA26373](https://images.nasa.gov/details/PIA26373), NASA/JPL-Caltech/ASU/MSSS. This is an existing NASA photograph, not an AI-generated Mars image. The frame/caption and existing interface preserve credits.
- **Game material:** existing generated SVG artwork and attributed story/code from OpenAI ChatGPT/Codex and Anthropic Claude. Demo layout, captions, capture and edit were produced with OpenAI Codex. No generated NASA logo, flag or mission insignia was added.
- **Tools:** Playwright 1.65.1, installed Chrome, Node.js, Python, FFmpeg 7.1 via the temporary imageio-ffmpeg 0.6.0 build helper. FFmpeg and temporary raw recordings are not shipped with the game. Typography uses the existing Fredoka font in gameplay and the installed Arial font for video text.
- **Licensing:** [project scope](../LICENSING.md), [references](compliance/references.md) and [AI usage](../AI_USAGE.md). NASA and third-party terms remain separate from the contributor license.

## Verification

The encoded MP4 was fully decoded without error, opened in Chrome and successfully sought to its final frame. MP4 headers independently show 29 seconds, 1920×1080, H.264, 870 frames and no audio track. Sampled frames at 0.1, 3.1, 8.1, 12, 15.1, 20.1, 24.1 and 28.9 seconds were visually reviewed for scene framing, English text, sources and the generation label. The binary hash and six caption cues are checked by `npm run check:demo`; visual review is not replaced by that script.

## Official 2026 demo requirements

The [official Project Submission Guide](https://www.spaceappschallenge.org/resources/project-submission-guide/) permits a video of **30 seconds or less** or a deck of at most seven slides including title/intro. It requires publicly accessible hosting and English linked material; a non-English spoken video needs English subtitles. Its SI section requires visible generation watermarks. The [official Terms](https://www.spaceappschallenge.org/legal/) address participant rights and under-18 media restrictions. These central official pages were reread on November 15, 2026. No third-party competition guide was used.

The MP4 is a hosted demo artifact, not an official submission. Put its public URL in the actual Project form, review all fields and rights declarations, then use Submit for Judging before the applicable deadline. Confirm public access without login before submitting. See [the submission checklist](submission-checklist.md).

## Reproduce

Start the local game with `npm start`. Install the existing development dependencies and Playwright's recording helper (`npx playwright install ffmpeg`). Set `DEMO_BUILD_DIR` to an external build directory and optionally set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to installed Chrome. Run `node tools/create_demo.mjs`, then `python tools/encode_demo.py --ffmpeg <local-ffmpeg> --capture-dir <build-directory> --output docs/demo/compass-outpost-demo.mp4`.

The default capture directory is outside the repository. Only the final MP4, optional caption transcript and metadata are published; raw recordings and verification images are private build artifacts. Reread source, rights and SI-label requirements before changing the demo.
