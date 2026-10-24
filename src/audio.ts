// A small triangle-wave synth. Sound needs a tap first on iPhone, which every
// lesson button provides, and the silent switch can mute it.

let ctx: AudioContext | null = null;

function context(): AudioContext | null {
  if (!ctx) {
    try {
      ctx = new AudioContext();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function tone(midi: number, at = 0, duration = 1.2, volume = 0.17): void {
  const c = context();
  if (!c) return;
  const t = c.currentTime + at;
  const osc = c.createOscillator();
  const gain = c.createGain();
  const filter = c.createBiquadFilter();
  osc.type = "triangle";
  osc.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(3000, t);
  filter.frequency.exponentialRampToValueAtTime(700, t + duration);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(filter).connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

/** Plays the notes one after the other. */
export function melodic(notes: number[], gap = 0.5): void {
  notes.forEach((n, i) => tone(n, i * gap, 1.1));
}

/** Plays the notes together, lightly strummed. */
export function chord(notes: number[], at = 0): void {
  notes.forEach((n, i) => tone(n, at + i * 0.03, 1.4, 0.13));
}

export function feedback(correct: boolean): void {
  tone(correct ? 84 : 47, 0, 0.12, 0.07);
}
