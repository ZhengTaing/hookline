/** What a story card plays when it appears. */
export type Sound =
  | { kind: "melodic"; notes: number[]; gap?: number }
  | { kind: "chord"; notes: number[] }
  | { kind: "progression"; chords: number[][]; gap?: number }
  /** A melody over one held chord. */
  | { kind: "withChord"; chord: number[]; notes: number[]; gap?: number }
  /** Clicks in rhythm: durations in beats (negative = rest), with an optional pitch for each note. */
  | { kind: "rhythm"; beats: number[]; bpm: number; pitches?: number[] }
  | { kind: "none" };

export interface StoryCard {
  text: string;
  /** Up to two note bubbles drawn above the line, joined by an optional label. */
  left?: string;
  right?: string;
  label?: string;
  /** Notes drawn on the treble staff instead of the bubbles, e.g. ["C4", "C5"]. */
  staff?: string[];
  /** Sharps (positive) or flats (negative) in the staff's key signature. */
  keySig?: number;
  /** Note values drawn on a rhythm line instead of a staff, with an optional time signature. */
  rhythm?: string[];
  time?: string;
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
  | { type: "fretboard"; marks: { string: number; fret: number }[] }
  /** Note values on one line (see rhythmSvg), with an optional time signature. */
  | { type: "rhythm"; notes: string[]; time?: string };

export type RushQuestion =
  | { kind: "staff"; lower: string; upper: string; options: string[] }
  | { kind: "choice"; prompt: string; options: string[]; answer: string; visual?: Visual; sound?: Sound; miss: string }
  /** `hint` shows under the fretboard before answering, saying how to find it. */
  | { kind: "fretInterval"; string: number; fret: number; semitones: number; label: string; hint?: string }
  | { kind: "findNote"; pitchClass: number; prompt?: string; hint?: string }
  /**
   * Tap tiles into the empty slots, in order. `given` holds the filled slots (null = empty),
   * `answer` the whole row, `tiles` the choices (decoys allowed), `labels` small text under each slot.
   */
  | { kind: "order"; prompt: string; given: (string | null)[]; answer: string[]; tiles: string[]; labels?: string[]; visual?: Visual; sound?: Sound; miss: string; /** "list": one row per slot with its label beside it, for long names. */ layout?: "row" | "list" };

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
  /** A book section's summary, with its examples as sound chips to tap. */
  | { type: "read"; section: string; title: string; headline: string; text: string; chips: { label: string; sound: Sound }[] }
  /** An untimed question set: identify, build on the fretboard, or name it by ear. */
  | { type: "practice"; title: string; questions: RushQuestion[] }
  /** Label each chord of a real song with a Roman numeral (or other label). */
  | { type: "realSong"; song: string; artist: string; key: string; chords: string[]; answer: string[]; options: string[]; sound: Sound }
  | {
      type: "tapBeat";
      bpm: number;
      beatsPerBar: number;
      bars: number;
      title: string;
      /** Tap a rhythm instead of every beat: positions in eighth notes from the downbeat. It plays along as a woodblock. */
      pattern?: number[];
      hint?: string;
      /** The rhythm to read, drawn above the tap button. */
      rhythm?: string[];
      time?: string;
    };

export interface Lesson {
  id: string;
  /** Book section, e.g. "5.2". */
  section: string;
  title: string;
  summary: string;
  steps: Step[];
  /** A review card added when the lesson is finished. */
  fact?: { front: string; back: string };
}

export interface Unit {
  id: string;
  title: string;
  chapter: string;
  summary: string;
  lessons: Lesson[];
}
