export const NOTE_NAMES = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];
const LETTERS = "CDEFGAB";
const LETTER_PC = [0, 2, 4, 5, 7, 9, 11];

/** Standard tuning, high E first, as MIDI numbers. */
export const OPEN_STRINGS = [64, 59, 55, 50, 45, 40];

export interface SpelledNote {
  letter: string;
  accidental: "" | "#" | "b";
  octave: number;
  /** Diatonic position: octave * 7 + letter index. Used for staff placement and interval size. */
  step: number;
  midi: number;
}

/** Parses scientific pitch like "C4", "Eb4" or "F#3". */
export function parseNote(name: string): SpelledNote {
  const m = /^([A-G])([#b]?)(-?\d)$/.exec(name);
  if (!m) throw new Error(`Bad note name: ${name}`);
  const letter = m[1];
  const accidental = m[2] as SpelledNote["accidental"];
  const octave = Number(m[3]);
  const li = LETTERS.indexOf(letter);
  const shift = accidental === "#" ? 1 : accidental === "b" ? -1 : 0;
  return { letter, accidental, octave, step: octave * 7 + li, midi: 12 * (octave + 1) + LETTER_PC[li] + shift };
}

export function displayName(name: string): string {
  return name.replace(/-?\d$/, "").replace("#", "♯").replace("b", "♭");
}

const PERFECT_SIZES = new Set([1, 4, 5, 8]);
const BASE_SEMITONES: Record<number, number> = { 1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11, 8: 12 };

/** Names the interval between two spelled notes, e.g. "m3", "P5", "+4". Lower note first. */
export function intervalName(lower: string, upper: string): string {
  const lo = parseNote(lower);
  const hi = parseNote(upper);
  const size = hi.step - lo.step + 1;
  if (size < 1 || size > 8) throw new Error(`Interval out of range: ${lower}-${upper}`);
  const diff = hi.midi - lo.midi - BASE_SEMITONES[size];
  const quality = PERFECT_SIZES.has(size)
    ? { [-1]: "°", 0: "P", 1: "+" }[diff]
    : { [-2]: "°", [-1]: "m", 0: "M", 1: "+" }[diff];
  if (!quality) throw new Error(`Unusual interval: ${lower}-${upper}`);
  return `${quality}${size}`;
}

export const INTERVAL_WORDS: Record<number, string> = {
  1: "minor 2nd", 2: "major 2nd", 3: "minor 3rd", 4: "major 3rd", 5: "perfect 4th", 6: "tritone",
  7: "perfect 5th", 8: "minor 6th", 9: "major 6th", 10: "minor 7th", 11: "major 7th", 12: "octave",
};

export function fretMidi(string: number, fret: number): number {
  return OPEN_STRINGS[string] + fret;
}
