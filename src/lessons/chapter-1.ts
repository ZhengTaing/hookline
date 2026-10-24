import { parseNote } from "../music";
import type { RushQuestion, Sound, Step } from "./types";

// Chapter 1 in the Lesson Types layout: after each section's card, name it on the staff,
// build it on the guitar, and name it by ear. Every question practises only what that
// section's card just explained, and every answer says why.

const notes = (...names: string[]): Sound => ({ kind: "melodic", notes: names.map((n) => parseNote(n).midi), gap: 0.6 });

/** "Which note is this?" with one note on the staff. */
const onStaff = (note: string, options: string[], answer: string, why: string): RushQuestion => ({
  kind: "choice",
  prompt: "Which note is this?",
  options,
  answer,
  visual: { type: "staff", notes: [note] },
  sound: notes(note),
  miss: why,
});

const firstOrSecond = (a: string, b: string, why: string): RushQuestion => ({
  kind: "choice",
  prompt: "Listen. Which note is higher?",
  options: ["The first", "The second"],
  answer: parseNote(a).midi > parseNote(b).midi ? "The first" : "The second",
  sound: notes(a, b),
  miss: why,
});

export const CHAPTER_1: Record<string, Step[]> = {
  "1.1": [
    {
      type: "practice",
      title: "Name it on the guitar",
      questions: [
        {
          kind: "choice",
          prompt: "Two notes on the A string. Which one sounds higher?",
          options: ["B (fret 2)", "D (fret 5)"],
          answer: "D (fret 5)",
          visual: { type: "fretboard", marks: [{ string: 4, fret: 2 }, { string: 4, fret: 5 }] },
          sound: notes("B2", "D3"),
          miss: "On one string, each fret up raises the pitch, so fret 5 is higher than fret 2",
        },
        {
          kind: "choice",
          prompt: "Two notes on the G string. Which one sounds higher?",
          options: ["G (open)", "A (fret 2)"],
          answer: "A (fret 2)",
          visual: { type: "fretboard", marks: [{ string: 2, fret: 0 }, { string: 2, fret: 2 }] },
          sound: notes("G3", "A3"),
          miss: "Pressing a fret makes the string shorter, and a shorter string sounds higher",
        },
      ],
    },
    {
      type: "practice",
      title: "Build it on the guitar",
      questions: [
        { kind: "fretInterval", string: 4, fret: 0, semitones: 2, label: "note two frets", hint: "Stay on the A string and move two frets toward the body: that's higher." },
        { kind: "fretInterval", string: 3, fret: 2, semitones: 3, label: "note three frets", hint: "Stay on the D string and count three frets up from the circled one." },
      ],
    },
    {
      type: "practice",
      title: "Name it by ear",
      questions: [
        firstOrSecond("C4", "G4", "The second note was higher: C then the G above it"),
        firstOrSecond("A4", "E4", "The first note was higher: A then the E below it"),
        firstOrSecond("D4", "D5", "The second note was higher: the same letter, one octave up"),
      ],
    },
  ],

  "1.2": [
    {
      type: "practice",
      title: "Name it on the staff",
      questions: [
        onStaff("E4", ["E", "F", "G", "D"], "E", "The bottom line is E. The lines spell E G B D F from the bottom up"),
        onStaff("A4", ["F", "A", "C", "B"], "A", "This is the second space. The spaces spell F A C E, so the second one is A"),
        onStaff("D5", ["B", "C", "D", "F"], "D", "This is the fourth line: E G B D F, so the fourth is D"),
        onStaff("C5", ["A", "C", "E", "D"], "C", "This is the third space: F A C E, so the third is C"),
      ],
    },
    {
      type: "practice",
      title: "Name it by ear",
      questions: [
        {
          kind: "choice",
          prompt: "Listen. Which pattern from the card is this?",
          options: ["lines E G B D F", "spaces F A C E"],
          answer: "spaces F A C E",
          sound: notes("F4", "A4", "C5", "E5"),
          miss: "Four notes means the spaces: F A C E. The lines have five notes",
        },
      ],
    },
  ],

  "1.3": [
    {
      type: "practice",
      title: "Name it on the staff",
      questions: [
        onStaff("C4", ["C3", "C4", "C5"], "C4", "The C on one ledger line below the staff is middle C, C4"),
        onStaff("C5", ["C4", "C5", "C6"], "C5", "The C in the third space is one octave above middle C, so it's C5"),
        onStaff("G4", ["G3", "G4", "G5"], "G4", "This G is above middle C (C4) but below the next C (C5), so it's in octave 4"),
      ],
    },
    {
      type: "practice",
      title: "Name it by ear",
      questions: [
        {
          kind: "choice",
          prompt: "Listen. Middle C plays first, then another C. Which one is the second?",
          options: ["C3", "C5"],
          answer: "C5",
          sound: notes("C4", "C5"),
          miss: "The second C was higher, so it's the next octave up: C5",
        },
        {
          kind: "choice",
          prompt: "Listen. Middle C plays first, then another C. Which one is the second?",
          options: ["C3", "C5"],
          answer: "C3",
          sound: notes("C4", "C3"),
          miss: "The second C was lower, so it's the octave below: C3",
        },
      ],
    },
  ],

  "1.4": [
    {
      type: "practice",
      title: "Name it on the staff",
      questions: [
        onStaff("F#4", ["F", "F♯", "F♭", "G"], "F♯", "The ♯ in front of the note makes it F sharp, a half step above F"),
        onStaff("Bb4", ["B", "B♯", "B♭", "A"], "B♭", "The ♭ in front of the note makes it B flat, a half step below B"),
        onStaff("C#5", ["C", "C♯", "C♭", "D"], "C♯", "The note sits in the C space and has a ♯, so it's C sharp"),
      ],
    },
    {
      type: "practice",
      title: "Build it on the guitar",
      questions: [
        { kind: "fretInterval", string: 5, fret: 1, semitones: 1, label: "half step", hint: "A sharp is a half step up, and a half step is one fret. Move one fret up from the circled F." },
        { kind: "fretInterval", string: 4, fret: 0, semitones: 1, label: "half step", hint: "One fret up from the open A string is A♯." },
      ],
    },
    {
      type: "practice",
      title: "Name it by ear",
      questions: [
        {
          kind: "choice",
          prompt: "Listen. Did the second note go up (sharp) or down (flat)?",
          options: ["Up: sharp", "Down: flat"],
          answer: "Up: sharp",
          sound: notes("F4", "F#4"),
          miss: "It went up a half step: F to F♯",
        },
        {
          kind: "choice",
          prompt: "Listen. Did the second note go up (sharp) or down (flat)?",
          options: ["Up: sharp", "Down: flat"],
          answer: "Down: flat",
          sound: notes("B4", "Bb4"),
          miss: "It went down a half step: B to B♭",
        },
      ],
    },
  ],

  "1.5": [
    {
      type: "practice",
      title: "Name it",
      questions: [
        { kind: "choice", prompt: "Which note sounds the same as C♯?", options: ["D♭", "D", "C"], answer: "D♭", visual: { type: "big", text: "C♯" }, miss: "C♯ is a half step above C, and D♭ is a half step below D. That's the same key and the same fret" },
        { kind: "choice", prompt: "Which note sounds the same as F♯?", options: ["F", "G♭", "G"], answer: "G♭", visual: { type: "big", text: "F♯" }, miss: "F♯ and G♭ are both one half step between F and G" },
        { kind: "choice", prompt: "Which note sounds the same as B♭?", options: ["A♯", "A", "B"], answer: "A♯", visual: { type: "big", text: "B♭" }, miss: "B♭ and A♯ both sit between A and B" },
      ],
    },
    {
      type: "practice",
      title: "Build it on the guitar",
      questions: [
        { kind: "findNote", pitchClass: 1, prompt: "Find D♭", hint: "D♭ is the same fret as C♯: one fret above any C. Try the B string, fret 2." },
        { kind: "findNote", pitchClass: 6, prompt: "Find G♭", hint: "G♭ is the same fret as F♯: one fret below any G. Try the low E string, fret 2." },
      ],
    },
    {
      type: "practice",
      title: "Name it by ear",
      questions: [
        {
          kind: "choice",
          prompt: "Listen. C♯ plays, then D♭. Do they sound the same or different?",
          options: ["The same", "Different"],
          answer: "The same",
          sound: notes("C#4", "Db4"),
          miss: "They're the same sound with two names. That's what enharmonic means",
        },
      ],
    },
  ],
};
