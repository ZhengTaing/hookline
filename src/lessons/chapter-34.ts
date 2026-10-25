import { parseNote } from "../music";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 34, twelve-tone serialism: a row of all twelve pitch classes and its four forms. The
// lessons use one short demo row (C B G A♭ E♭ C♯ D B♭ F♯ F E A), hear prime against inversion,
// build forms note by note, and count the row's steps on the neck, where one fret is one step.

const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const chord = (...names: string[]): Sound => ({ kind: "chord", notes: midi(...names) });
const tune = (notes: string[], gap = 0.3): Sound => ({ kind: "melodic", notes: midi(...notes), gap });
const card = (text: string, left: string, right: string, label: string, sound: Sound): StoryCard => ({ text, left, right, label, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

// The demo row, P0: 0 11 7 8 3 1 2 10 6 5 4 9.
const ROW = tune(["C4", "B3", "G3", "Ab3", "Eb4", "Db4", "D4", "Bb3", "F#3", "F3", "E3", "A3"], 0.22);
const P_START = tune(["C4", "B3", "G3", "Ab3"], 0.35);
// I0 flips every interval: 0 1 5 4.
const I_START = tune(["C4", "Db4", "F4", "E4"], 0.35);
// R0 is the row backwards: 9 4 5 6.
const R_START = tune(["A3", "E3", "F3", "F#3"], 0.35);
const FORMS = ["Prime (P)", "Inversion (I)", "Retrograde (R)", "Retrograde inversion (RI)"];

export const CHAPTER_34: Record<string, Step[]> = {
  "34.1": [
    story(
      card("Around 1923, Schoenberg found a way to organize music with no home key: put all twelve pitch classes in an order, called a row.", "12", "1 row", "the row", ROW),
      card("Every note of the piece comes from the row or one of its forms, so no note gets more weight than another. Berg and Webern used it too.", "no repeats", "until all 12", "equal notes", ROW),
      card("Here's our demo row: C B G A♭ E♭ C♯ D B♭ F♯ F E A. As numbers: 0 11 7 8 3 1 2 10 6 5 4 9.", "0 11 7 8", "3 1 2 …", "P0", ROW),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "How many different pitch classes are in a twelve-tone row?", options: ["12, each once", "7, like a scale", "Any number"], answer: "12, each once", miss: "All twelve pitch classes, each exactly once" },
      { kind: "choice", prompt: "Who created the twelve-tone method?", options: ["Schoenberg", "Bach", "Debussy"], answer: "Schoenberg", miss: "Arnold Schoenberg, in the early 1920s" },
    ),
    practice(
      "Find it on the guitar",
      { kind: "findNote", pitchClass: 9, prompt: "A row so far: C B G A♭ E♭ C♯ D B♭ F♯ F E. Find the missing twelfth note.", hint: "The only note not used yet is A (9): the open A string." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Horror and thriller film scores often borrow twelve-tone writing. Why does it sound unsettling?", options: ["No note feels like home", "It's always loud", "It only uses major chords"], answer: "No note feels like home", sound: ROW, miss: "With all twelve notes equal, there's no key to rest in" },
    ),
  ],

  "34.2": [
    story(
      card("A row has four forms. To tell which one you hear, compare its opening intervals with the prime row's.", "intervals", "compare", "the clue", P_START),
      card("Our prime row starts down a half step, down 4, up a half step: C B G A♭. The inversion flips each direction: up a half step, up 4, down a half step.", "P: ↓1 ↓4 ↑1", "I: ↑1 ↑4 ↓1", "flipped", I_START),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "The prime starts C B G A♭ (down, down, up). Listen. Which form is this?", options: FORMS.slice(0, 2), answer: "Inversion (I)", sound: I_START, miss: "Up, up, down: every direction flipped. That's the inversion" },
      { kind: "choice", prompt: "Listen. Which form is this?", options: FORMS.slice(0, 2), answer: "Prime (P)", sound: P_START, miss: "Down a half step, down 4, up a half step: the prime" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 1, fret: 1, semitones: 1, label: "C♯, the inversion's first step up", hint: "C is the B string, fret 1. The prime goes down a fret to B. The inversion goes up a fret instead: C♯, fret 2." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A guitarist plays a riff, then plays it again with every interval upside down. What's that called?", options: ["Inversion", "Retrograde", "Transposition"], answer: "Inversion", miss: "Flipping each interval's direction is inversion" },
    ),
  ],

  "34.3": [
    story(
      card("Prime (P) is the row as written. Retrograde (R) is the row backwards: our R0 starts A E F F♯.", "P", "R: backwards", "P and R", R_START),
      card("Inversion (I) flips every interval. Retrograde inversion (RI) is the inversion played backwards.", "I: flipped", "RI: both", "I and RI", I_START),
      card("Each form can start on any of the 12 notes. P and I are named for their first note, R and RI for their last.", "P0 I0", "R0 RI0", "the labels", ROW),
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Write the first four notes of I0. Flip each step of C B G A♭ (down 1, down 4, up 1).",
      given: ["C", null, null, null],
      answer: ["C", "C♯", "F", "E"],
      tiles: ["F", "E", "C♯", "B"],
      sound: I_START,
      miss: "C, up 1 to C♯, up 4 to F, down 1 to E",
    }),
    practice(
      "Name it",
      { kind: "choice", prompt: "Which form is the row played backwards?", options: FORMS, answer: "Retrograde (R)", miss: "Retrograde means backwards" },
      { kind: "choice", prompt: "The row ends on A. What's the first note of its retrograde?", options: ["A", "C", "E"], answer: "A", sound: R_START, miss: "Backwards, the last note comes first" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 1, fret: 2, semitones: 4, label: "F, 4 steps above C♯ in I0", hint: "C♯ is the B string, fret 2. Up 4 steps: F, on the high e string at fret 1." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Some bands hide a riff played backwards in a song. In row terms, that's…", options: ["Retrograde", "Inversion", "Prime"], answer: "Retrograde", miss: "Backwards order is retrograde" },
    ),
  ],

  "34.4": [
    story(
      card("A twelve-tone matrix is a 12 × 12 grid. P0 runs across the top row, and I0 runs down the left column.", "P →", "I ↓", "the grid", ROW),
      card("Read rows left to right for P forms, right to left for R. Read columns top to bottom for I, bottom to top for RI.", "→ P ← R", "↓ I ↑ RI", "four ways", I_START),
      card("12 transpositions of 4 forms: 48 row forms in one chart, ready to use.", "12 × 4", "= 48", "every form", ROW),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "How many row forms does a matrix show?", options: ["48", "12", "24"], answer: "48", miss: "12 transpositions of P, R, I and RI: 48" },
      { kind: "choice", prompt: "In the matrix, reading a column from top to bottom gives…", options: ["An inversion (I)", "A prime (P)", "A retrograde (R)"], answer: "An inversion (I)", miss: "Columns read downward are inversions" },
      { kind: "choice", prompt: "Reading a row from right to left gives…", options: ["A retrograde (R)", "An inversion (I)", "A prime (P)"], answer: "A retrograde (R)", miss: "Backwards along a row: retrograde" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 4, fret: 3, semitones: 2, label: "D, the start of P2", hint: "P0 starts on C (A string, fret 3). The next row down the matrix might be P2, starting 2 steps up: D, fret 5." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A guitarist makes a chart of a riff in all 12 keys, forwards and backwards. What's that like?", options: ["A twelve-tone matrix", "A chord chart", "A fake book"], answer: "A twelve-tone matrix", miss: "Every transposition of every form in one grid: a matrix" },
    ),
  ],

  "34.5": [
    story(
      card("Composers present rows in different ways. A row can overlap the next: its last note becomes the next form's first.", "…E A", "A E F…", "overlapping", tune(["F3", "E3", "A3", "E3", "F3", "F#3"], 0.3)),
      card("A row can be split between voices, a few notes each, so the twelve are shared out.", "melody", "+ bass", "layered", tune(["C4", "B3", "G3", "Ab3"], 0.3)),
      card("Or it can be stacked into chords: three or four row notes at once.", "C B G", "at once", "stacked", chord("G3", "B3", "C4")),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "The row's last note, A, is also the first note of the next form. What's that called?", options: ["Overlapping", "Stacking", "Inversion"], answer: "Overlapping", miss: "Sharing a note between forms is overlapping" },
      { kind: "choice", prompt: "C, B and G sound together as a chord. How is the row being presented?", options: ["Stacked", "Overlapping", "Retrograde"], answer: "Stacked", sound: chord("G3", "B3", "C4"), miss: "Row notes sounding together are stacked" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 2, fret: 0, semitones: 4, label: "B, stacked above G", hint: "G is the open G string. B is 4 steps up: the open B string, or G string fret 4. Add C (B string, fret 1) and you've stacked C B G." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A riff ends on A, and the next riff starts on that same A. Which row technique is that?", options: ["Overlapping", "Layering", "Stacking"], answer: "Overlapping", miss: "One note ends one and starts the next: overlapping" },
    ),
  ],

  "34.6": [
    story(
      card("Serialism doesn't need all twelve notes. Stravinsky, in his later works, used series with fewer pitch classes.", "5 notes", "in order", "shorter series", tune(["E4", "F4", "D4", "C#4", "C4"], 0.3)),
      card("Some series even imply a key: a series that leans on C, E and G can sound tonal while still following serial rules.", "C E G", "tonal hint", "a center", tune(["C4", "E4", "G4", "D4", "F4"], 0.3)),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Must a series always have 12 notes?", options: ["No, it can be shorter", "Yes, always 12"], answer: "No, it can be shorter", miss: "Non-twelve-tone serialism uses series of other sizes" },
      { kind: "choice", prompt: "Which composer used shorter series in his later music?", options: ["Stravinsky", "Mozart", "Haydn"], answer: "Stravinsky", miss: "Stravinsky turned to serialism late in his career" },
    ),
    practice(
      "Find it on the guitar",
      { kind: "findNote", pitchClass: 1, prompt: "A 5-note series: E F D C♯ C. Find C♯.", hint: "A string, fret 4, or B string, fret 2." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A metal riff loops the same 5 notes in a fixed order, moved to new starting notes. What's that closest to?", options: ["A short series", "A twelve-tone row", "A chord progression"], answer: "A short series", miss: "A fixed order of fewer than 12 notes, transposed: a short series" },
    ),
  ],
};
