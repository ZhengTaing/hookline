/** What a story card plays when it appears. */
export type Sound =
  | { kind: "melodic"; notes: number[]; gap?: number }
  | { kind: "chord"; notes: number[] }
  | { kind: "none" };

export interface StoryCard {
  text: string;
  /** Up to two note bubbles drawn above the line, joined by an optional label. */
  left?: string;
  right?: string;
  label?: string;
  sound: Sound;
}

export interface DuelRound {
  question: string;
  /** Semitone offsets from a random root. The answer is `target`. */
  target: number[];
  other: number[];
  targetLabel: string;
  why: string;
  /** How each side plays. Defaults to a chord for 3+ notes, otherwise one note after the other. */
  play?: "melodic" | "chord";
}

/** A picture shown above a multiple-choice question. */
export type Visual =
  | { type: "staff"; notes: string[]; keySig?: number; chord?: boolean }
  | { type: "big"; text: string; caption?: string }
  | { type: "fretboard"; marks: { string: number; fret: number }[] };

export type RushQuestion =
  | { kind: "staff"; lower: string; upper: string; options: string[] }
  | { kind: "choice"; prompt: string; options: string[]; answer: string; visual?: Visual; sound?: Sound; miss: string }
  | { kind: "fretInterval"; string: number; fret: number; semitones: number; label: string }
  | { kind: "findNote"; pitchClass: number };

export interface SongRound {
  notes: [number, number];
  interval: string;
  song: string;
  choices: string[];
}

export type Step =
  | { type: "story"; cards: StoryCard[] }
  | { type: "duel"; rounds: DuelRound[] }
  | { type: "rush"; seconds: number; source: string; questions: RushQuestion[] }
  | { type: "songMatch"; rounds: SongRound[] }
  | { type: "tapBeat"; bpm: number; beatsPerBar: number; bars: number; title: string };

export interface Lesson {
  id: string;
  /** Book section, e.g. "5.2". */
  section: string;
  title: string;
  summary: string;
  steps: Step[];
}

export interface Unit {
  id: string;
  title: string;
  chapter: string;
  summary: string;
  lessons: Lesson[];
}
