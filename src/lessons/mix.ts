import { intervalName, parseNote } from "../music";
import type { Lesson, RushQuestion, Sound, Step } from "./types";

// Turns a book lesson's exercises into the mockup's steps: name it, build it on the guitar,
// name it by ear, and, where there's a good fit, labeling the chords of a real song.

const ROOTS: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

/** Parses a chord symbol like "C♯m", "Bb", "Am7", "Cmaj7" or "Bø7". */
function chordParts(symbol: string): { pc: number; root: string; shape: number[] } | null {
  const mm = /^([A-G])([♯#♭b]?)(maj7|m7|ø7|°7|m|°|\+|7)?$/.exec(symbol);
  if (!mm) return null;
  const pc = (ROOTS[mm[1]] + (mm[2] === "♯" || mm[2] === "#" ? 1 : mm[2] ? 11 : 0)) % 12;
  const shapes: Record<string, number[]> = {
    "": [0, 4, 7], m: [0, 3, 7], "°": [0, 3, 6], "+": [0, 4, 8],
    maj7: [0, 4, 7, 11], "7": [0, 4, 7, 10], m7: [0, 3, 7, 10], "ø7": [0, 3, 6, 10], "°7": [0, 3, 6, 9],
  };
  return { pc, root: mm[1] + (mm[2] ?? ""), shape: shapes[mm[3] ?? ""] };
}

function chordsSound(symbols: string[]): Sound {
  return {
    kind: "progression",
    gap: 0.9,
    chords: symbols.map((s) => {
      const c = chordParts(s)!;
      const root = 48 + c.pc - (c.pc > 6 ? 12 : 0);
      return [root - 12, ...c.shape.map((x) => root + x)];
    }),
  };
}

const MAJOR_RN = ["I", "ii", "iii", "IV", "V", "vi"];
const MINOR_RN = ["i", "ii°", "III", "iv", "V", "VI", "VII"];

interface Song {
  song: string;
  artist: string;
  key: string;
  chords: string[];
  answer: string[];
  options: string[];
}

/** Real songs to analyze. Chord progressions are well known; check them against the recordings. */
const SONGS: Record<string, Song> = {
  "6.1": { song: "Zombie", artist: "The Cranberries", key: "E minor", chords: ["Em", "C", "G", "D"], answer: ["Minor", "Major", "Major", "Major"], options: ["Major", "Minor", "Diminished", "Augmented"] },
  "7.1": { song: "Let It Be", artist: "The Beatles", key: "C major", chords: ["C", "G", "Am", "F"], answer: ["I", "V", "vi", "IV"], options: MAJOR_RN },
  "7.3": { song: "Zombie", artist: "The Cranberries", key: "E minor", chords: ["Em", "C", "G", "D"], answer: ["i", "VI", "III", "VII"], options: MINOR_RN },
  "7.4": { song: "Hallelujah", artist: "Leonard Cohen", key: "C major", chords: ["F", "G", "Am", "F"], answer: ["IV", "V", "vi", "IV"], options: MAJOR_RN },
  "8.3": { song: "Fly Me to the Moon", artist: "Frank Sinatra", key: "C major", chords: ["Am7", "Dm7", "G7", "Cmaj7"], answer: ["vi7", "ii7", "V7", "Imaj7"], options: ["Imaj7", "ii7", "iii7", "IVmaj7", "V7", "vi7"] },
  "9.1": { song: "I Will Survive", artist: "Gloria Gaynor", key: "A minor", chords: ["Am", "Dm", "G", "C"], answer: ["i", "iv", "VII", "III"], options: MINOR_RN },
  "9.7": { song: "Don't Stop Believin'", artist: "Journey", key: "E major", chords: ["E", "B", "C♯m", "A"], answer: ["I", "V", "vi", "IV"], options: MAJOR_RN },
  "12.4": { song: "Johnny B. Goode", artist: "Chuck Berry", key: "B♭ major (bars 1, 5, 9, 10)", chords: ["B♭", "E♭", "F", "E♭"], answer: ["I", "IV", "V", "IV"], options: ["I", "ii", "IV", "V", "vi"] },
  "17.1": { song: "Creep", artist: "Radiohead", key: "G major", chords: ["G", "B", "C"], answer: ["I", "V/vi", "IV"], options: ["I", "V/V", "V/vi", "IV", "V", "vi"] },
  "19.1": { song: "Creep", artist: "Radiohead", key: "G major", chords: ["G", "B", "C", "Cm"], answer: ["I", "V/vi", "IV", "iv"], options: ["I", "V/vi", "IV", "iv", "♭VI", "♭VII"] },
  "31.8": { song: "Autumn Leaves", artist: "jazz standard", key: "G major", chords: ["Am7", "D7", "Gmaj7", "Cmaj7"], answer: ["ii7", "V7", "Imaj7", "IVmaj7"], options: ["Imaj7", "ii7", "iii7", "IVmaj7", "V7", "vi7"] },
};

const SIZE_WORDS: Record<number, string> = { 1: "unison", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th", 6: "6th", 7: "7th", 8: "8ve" };

/** A staff interval question turned into a listening one. */
function staffToEar(q: Extract<RushQuestion, { kind: "staff" }>): RushQuestion {
  const named = q.options.some((o) => /^[PMm+°]/.test(o));
  const answer = named ? intervalName(q.lower, q.upper) : SIZE_WORDS[parseNote(q.upper).step - parseNote(q.lower).step + 1];
  return {
    kind: "choice",
    prompt: "Listen. Which interval is it?",
    options: q.options,
    answer,
    sound: { kind: "melodic", notes: [parseNote(q.lower).midi, parseNote(q.upper).midi], gap: 0.5 },
    miss: `By ear: that was a ${answer}`,
  };
}

const isFret = (q: RushQuestion) => q.kind === "findNote" || q.kind === "fretInterval";

/** A question answered by listening rather than looking. */
function isEar(q: RushQuestion): boolean {
  return q.kind === "choice" && !!q.sound && q.sound.kind !== "none" && (!q.visual || /^Listen/.test(q.prompt));
}

/**
 * Rebuilds a lesson as the Lesson Types mockup lays it out: name it (staff and picture
 * questions), build it on the fretboard, name it by ear, then a real song. Every question
 * comes from the lesson's own book exercises. Story cards, duels and timed rounds are dropped;
 * tap-the-rhythm steps stay, since rhythm can only be practised by feel.
 */
export function mixLesson(lesson: Lesson): Lesson {
  const questions = lesson.steps.flatMap((s) => (s.type === "rush" ? s.questions : []));
  const steps: Step[] = [];

  const name = questions.filter((q) => !isFret(q) && !isEar(q)).slice(0, 5);
  if (name.length) steps.push({ type: "practice", title: name.some((q) => q.kind === "staff") ? "Name it on the staff" : "Name it", questions: name });

  const build = questions.filter(isFret).slice(0, 3);
  if (build.length) steps.push({ type: "practice", title: "Build it on the guitar", questions: build });

  const ear = [
    ...questions.filter(isEar).map((q): RushQuestion => {
      if (q.kind !== "choice") return q;
      const { visual: _visual, ...rest } = q;
      return { ...rest, prompt: q.prompt.startsWith("Listen") ? q.prompt : `Listen. ${q.prompt}` };
    }),
    ...questions.flatMap((q) => (q.kind === "staff" ? [staffToEar(q)] : [])),
  ].slice(0, 3);
  if (ear.length) steps.push({ type: "practice", title: "Name it by ear", questions: ear });

  steps.push(...lesson.steps.filter((s) => s.type === "tapBeat"));

  const song = SONGS[lesson.id];
  if (song) steps.push({ type: "realSong", ...song, sound: chordsSound(song.chords) });

  return { ...lesson, steps };
}

export const MIX_DATA = { SONGS, chordParts };
