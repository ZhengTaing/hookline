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
}

export type RushQuestion =
  | { kind: "staff"; lower: string; upper: string; options: string[] }
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
  | { type: "songMatch"; rounds: SongRound[] };

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
