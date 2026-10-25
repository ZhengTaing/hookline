// The earlier lesson layout (intro cards, learn-it steps, timed round), kept for chapters that
// haven't moved to the new layout yet. Delete once every chapter has.
import { intervalName, parseNote } from "../music";
import type { Lesson, RushQuestion, Sound, Step } from "./types";

// Adds the "learn it" steps to every lesson, between the intro cards and the timed round:
// an untimed identify set, a fretboard step, an ear check,
// and, where there's a good fit, labeling the chords of a real song.

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

export function chordsSound(symbols: string[]): Sound {
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

/** Builds "find the root on the fretboard" questions from chord or note answers. */
function fretQuestions(questions: RushQuestion[]): RushQuestion[] {
  const found = questions.filter((q) => q.kind === "findNote" || q.kind === "fretInterval");
  if (found.length) return found.slice(0, 2);
  const out: RushQuestion[] = [];
  const seen = new Set<number>();
  for (const q of questions) {
    if (q.kind !== "choice") continue;
    const c = chordParts(q.answer);
    if (!c || seen.has(c.pc)) continue;
    seen.add(c.pc);
    const isNote = q.answer === c.root;
    out.push({
      kind: "findNote",
      pitchClass: c.pc,
      prompt: isNote ? `Find ${q.answer} on the neck` : `Find the root of ${q.answer} on the neck`,
    });
    if (out.length === 2) break;
  }
  return out;
}

/** Inserts the learn-it steps after the intro cards and duels, before the timed round. */
export function mixLesson(lesson: Lesson): Lesson {
  const rush = lesson.steps.find((s): s is Extract<Step, { type: "rush" }> => s.type === "rush");
  const questions = rush?.questions ?? [];
  const extra: Step[] = [];

  const visual = questions.filter((q) => q.kind === "staff" || (q.kind === "choice" && q.visual));
  const identify = (visual.length ? visual : questions.filter((q) => q.kind === "choice")).slice(0, 3);
  if (identify.length) extra.push({ type: "practice", title: visual.length ? "Identify" : "Check", questions: identify });

  const build = fretQuestions(questions);
  if (build.length) extra.push({ type: "practice", title: "On the guitar", questions: build });

  const ear = questions
    .filter((q) => !identify.includes(q))
    .flatMap((q): RushQuestion[] => {
      if (q.kind === "staff") return [staffToEar(q)];
      const listenable = q.kind === "choice" && q.sound && q.sound.kind !== "none" && (q.visual || /^Listen|quality/.test(q.prompt));
      if (q.kind === "choice" && listenable) {
        const { visual: _visual, ...rest } = q;
        return [{ ...rest, prompt: q.prompt.startsWith("Listen") ? q.prompt : `Listen. ${q.prompt}` }];
      }
      return [];
    })
    .slice(0, 2);
  if (ear.length) extra.push({ type: "practice", title: "Ear check", questions: ear });

  const song = SONGS[lesson.id];
  if (song) extra.push({ type: "realSong", ...song, sound: chordsSound(song.chords) });

  const introEnd = lesson.steps.findIndex((s) => s.type !== "story" && s.type !== "duel");
  const at = introEnd < 0 ? lesson.steps.length : introEnd;
  return { ...lesson, steps: [...lesson.steps.slice(0, at), ...extra, ...lesson.steps.slice(at)] };
}


