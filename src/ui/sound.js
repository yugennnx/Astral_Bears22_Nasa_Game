/**
 * Sound for Compass Outpost. Every sound is synthesised in the browser with the Web Audio
 * API (oscillators and filtered noise). There are no audio files, samples or recordings.
 * Sound starts only after the player's first tap and can be switched off in the top bar;
 * the choice is remembered on this device.
 * AI-assisted generation: Anthropic Claude. See AI_USAGE.md and ai-usage.json.
 */

const KEY = "compass-outpost-sound-v1";
let enabled = true;
try { enabled = localStorage.getItem(KEY) !== "off"; } catch { /* storage is optional */ }

let ctx = null;
let master = null;
let wind = null;

function ensure() {
  if (ctx) return ctx;
  const Ctor = window.AudioContext ?? window.webkitAudioContext;
  if (!Ctor) return null;
  try {
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = enabled ? 0.5 : 0;
    master.connect(ctx.destination);
  } catch {
    ctx = null;
  }
  return ctx;
}

/** Browsers only allow sound after a user gesture. */
export function unlockSound() {
  const audio = ensure();
  if (audio?.state === "suspended") audio.resume().catch(() => {});
}

export const soundEnabled = () => enabled;

export function setSoundEnabled(value) {
  enabled = Boolean(value);
  try { localStorage.setItem(KEY, enabled ? "on" : "off"); } catch { /* optional */ }
  if (enabled) unlockSound();
  if (master && ctx) master.gain.setTargetAtTime(enabled ? 0.5 : 0, ctx.currentTime, 0.05);
  return enabled;
}

/** One note: freq (Hz), start offset (s), length (s), wave type, volume, optional end frequency. */
function tone(freq, at = 0, length = 0.15, type = "sine", volume = 0.2, slideTo = null) {
  if (!enabled || !ensure() || ctx.state !== "running") return;
  const start = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, start + length);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  osc.connect(gain).connect(master);
  osc.start(start);
  osc.stop(start + length + 0.03);
}

const notes = (list, type = "sine", volume = 0.18, step = 0.09, length = 0.16) =>
  list.forEach((freq, i) => tone(freq, i * step, length, type, volume));

const SOUNDS = {
  tap: () => tone(520, 0, 0.06, "triangle", 0.12, 700),
  next: () => tone(660, 0, 0.07, "sine", 0.1, 880),
  duti: () => { tone(880, 0, 0.07, "square", 0.05, 1320); tone(1320, 0.08, 0.06, "square", 0.05, 990); tone(1100, 0.16, 0.08, "square", 0.05, 1480); },
  select: () => notes([440, 587], "triangle", 0.14, 0.07, 0.1),
  step: () => notes([660, 990], "triangle", 0.16, 0.06, 0.12),
  miss: () => tone(220, 0, 0.16, "sawtooth", 0.07, 160),
  success: () => notes([523, 659, 784, 1047], "triangle", 0.18, 0.09, 0.2),
  done: () => notes([440, 392], "sine", 0.14, 0.14, 0.22),
  discover: () => notes([784, 1175, 1568], "sine", 0.14, 0.06, 0.18),
  secret: () => notes([659, 784, 988, 1319, 1568], "sine", 0.16, 0.08, 0.24),
  gain: () => notes([587, 880], "sine", 0.14, 0.07, 0.14),
  loss: () => notes([392, 294], "sine", 0.13, 0.09, 0.16),
  card: () => notes([988, 1319, 1976], "sine", 0.1, 0.07, 0.3),
  night: () => notes([392, 330, 262, 196], "sine", 0.12, 0.28, 0.6),
  morning: () => notes([262, 330, 392, 523], "sine", 0.12, 0.16, 0.4),
  right: () => notes([659, 880, 1319], "triangle", 0.16, 0.08, 0.2),
  wrong: () => notes([330, 277], "triangle", 0.12, 0.12, 0.2),
  warning: () => { tone(740, 0, 0.16, "square", 0.08); tone(740, 0.24, 0.16, "square", 0.08); },
  alarm: () => { for (let i = 0; i < 3; i += 1) tone(520, i * 0.42, 0.34, "sawtooth", 0.07, 860); },
  win: () => { notes([523, 659, 784, 1047, 784, 1047, 1319], "triangle", 0.2, 0.13, 0.3); notes([262, 330, 392], "sine", 0.12, 0.39, 0.6); },
  partial: () => notes([392, 494, 587], "triangle", 0.15, 0.16, 0.36),
  fail: () => notes([392, 330, 262, 196], "triangle", 0.14, 0.22, 0.5),
};

export function play(name) {
  try { SOUNDS[name]?.(); } catch { /* sound must never break the game */ }
}

/**
 * Soft Mars wind: looped noise through a slowly moving low-pass filter.
 * level 0 stops it; "storm" makes it a little louder and rougher.
 */
export function setAmbience(mode) {
  if (!ensure() || ctx.state !== "running") return;
  const target = !enabled || mode === "off" ? 0 : mode === "storm" ? 0.09 : mode === "inside" ? 0.018 : 0.045;
  if (!wind) {
    if (!target) return;
    const length = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i += 1) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; // brown-ish noise
      data[i] = last * 3.5;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 420;
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.09;
    lfoGain.gain.value = 180;
    lfo.connect(lfoGain).connect(filter.frequency);
    const gain = ctx.createGain();
    gain.gain.value = 0;
    source.connect(filter).connect(gain).connect(master);
    source.start();
    lfo.start();
    wind = { gain, filter };
  }
  wind.gain.gain.setTargetAtTime(target, ctx.currentTime, 0.8);
  wind.filter.frequency.setTargetAtTime(mode === "storm" ? 700 : 420, ctx.currentTime, 0.8);
}
