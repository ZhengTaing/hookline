import { CHAPTERS_2_4 } from "./chapters-2-4";
import { CHAPTERS_10_12 } from "./chapters-10-12";
import { CHAPTERS_13_22 } from "./chapters-13-22";
import { CHAPTERS_23_35 } from "./chapters-23-35";
import { CHAPTERS_6_9 } from "./chapters-6-9";
import type { Unit } from "./types";

// Lessons adapted from Robert Hutchinson, "Music Theory for the 21st-Century Classroom"
// (GNU Free Documentation License 1.2). Section numbers refer to that book.

const C4 = 60;

export const COURSE: Unit[] = [
  {
    id: "notes",
    title: "Notes and the fretboard",
    chapter: "Chapter 1",
    summary: "12 notes, half steps, sharps and flats",
    lessons: [
      {
        id: "1.1",
        section: "1.1–1.2",
        title: "The musical alphabet",
        summary: "Seven letters, then they repeat",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Music uses seven letters: A to G.", left: "A", right: "G", label: "7 letters", sound: { kind: "melodic", notes: [57, 59, 60, 62, 64, 65, 67], gap: 0.22 } },
              { text: "After G, it starts again at A.", left: "G", right: "A", label: "repeat", sound: { kind: "melodic", notes: [67, 69] } },
              { text: "Each fret on your guitar is one step up.", left: "E", right: "F", label: "1 fret", sound: { kind: "melodic", notes: [64, 65] } },
              { text: "The open strings spell E A D G B E.", sound: { kind: "melodic", notes: [40, 45, 50, 55, 59, 64], gap: 0.3 } },
            ],
          },
          {
            type: "rush",
            seconds: 45,
            source: "Practice 1.6",
            questions: [
              { kind: "findNote", pitchClass: 0 },
              { kind: "findNote", pitchClass: 7 },
              { kind: "findNote", pitchClass: 2 },
              { kind: "findNote", pitchClass: 9 },
              { kind: "findNote", pitchClass: 5 },
              { kind: "findNote", pitchClass: 11 },
              { kind: "findNote", pitchClass: 4 },
            ],
          },
        ],
      },
      {
        id: "1.4",
        section: "1.4–1.5",
        title: "Sharps, flats and half steps",
        summary: "One fret up is a sharp, one fret down is a flat",
        steps: [
          {
            type: "story",
            cards: [
              { text: "One fret is a half step.", left: "C", right: "C♯", label: "½ step", sound: { kind: "melodic", notes: [60, 61] } },
              { text: "A sharp raises a note one fret.", left: "F", right: "F♯", label: "♯", sound: { kind: "melodic", notes: [65, 66] } },
              { text: "A flat lowers a note one fret.", left: "B", right: "B♭", label: "♭", sound: { kind: "melodic", notes: [71, 70] } },
              { text: "Same fret, two names. C♯ and D♭ are one note.", left: "C♯", right: "D♭", label: "same", sound: { kind: "melodic", notes: [61, 61] } },
              { text: "E–F and B–C have no fret between them.", left: "B", right: "C", label: "½ step", sound: { kind: "melodic", notes: [59, 60] } },
            ],
          },
          {
            type: "duel",
            rounds: [
              { question: "Which pair is a half step apart?", target: [0, 1], other: [0, 2], targetLabel: "half step", why: "A half step is one fret, the smallest step on the guitar." },
              { question: "Which pair is a whole step apart?", target: [0, 2], other: [0, 1], targetLabel: "whole step", why: "A whole step is two frets." },
            ],
          },
          {
            type: "rush",
            seconds: 45,
            source: "Practice 1.6",
            questions: [
              { kind: "findNote", pitchClass: 6 },
              { kind: "findNote", pitchClass: 10 },
              { kind: "findNote", pitchClass: 1 },
              { kind: "findNote", pitchClass: 8 },
              { kind: "findNote", pitchClass: 3 },
              { kind: "findNote", pitchClass: 5 },
            ],
          },
        ],
      },
    ],
  },
  ...CHAPTERS_2_4,
  {
    id: "intervals",
    title: "Intervals",
    chapter: "Chapter 5",
    summary: "3rds, 5ths, and why they sound like that",
    lessons: [
      {
        id: "5.1",
        section: "5.1",
        title: "What an interval is",
        summary: "Count the letters to get the size",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Two notes. One distance.", left: "C", right: "G", sound: { kind: "melodic", notes: [C4, 67] } },
              { text: "That distance is an interval.", left: "C", right: "E", label: "interval", sound: { kind: "melodic", notes: [C4, 64] } },
              { text: "Count the letters to get its size.", left: "C", right: "E", label: "C D E = 3rd", sound: { kind: "melodic", notes: [C4, 62, 64], gap: 0.3 } },
              { text: "C up to G is C D E F G. That's a 5th.", left: "C", right: "G", label: "5th", sound: { kind: "chord", notes: [48, 55, 60] } },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Practice 5.6 · exercise 1",
            questions: [
              { kind: "staff", lower: "C4", upper: "E4", options: ["2nd", "3rd", "4th", "5th"] },
              { kind: "staff", lower: "D4", upper: "A4", options: ["3rd", "4th", "5th", "6th"] },
              { kind: "staff", lower: "E4", upper: "F4", options: ["2nd", "3rd", "4th", "unison"] },
              { kind: "staff", lower: "G4", upper: "C5", options: ["3rd", "4th", "5th", "6th"] },
              { kind: "staff", lower: "F4", upper: "D5", options: ["5th", "6th", "7th", "8ve"] },
              { kind: "staff", lower: "C4", upper: "C5", options: ["6th", "7th", "8ve", "5th"] },
            ],
          },
        ],
      },
      {
        id: "5.2",
        section: "5.2",
        title: "Major vs minor",
        summary: "Same size, different mood",
        steps: [
          {
            type: "story",
            cards: [
              { text: "This 3rd sounds bright. It's major.", left: "C", right: "E", label: "M3 · 4 frets", sound: { kind: "chord", notes: [C4, 64, 67] } },
              { text: "Pull the top note down one fret.", left: "C", right: "E♭", label: "m3 · 3 frets", sound: { kind: "melodic", notes: [C4, 63] } },
              { text: "Same size, darker sound. It's minor.", left: "C", right: "E♭", label: "m3", sound: { kind: "chord", notes: [C4, 63, 67] } },
              { text: "The trick: is the top note in the bottom note's major scale?", left: "C", right: "?", sound: { kind: "melodic", notes: [60, 62, 64, 65, 67, 69, 71, 72], gap: 0.2 } },
              { text: "If yes, it's major or perfect. One fret lower, it's minor.", left: "C", right: "A♭", label: "m6", sound: { kind: "melodic", notes: [C4, 68] } },
            ],
          },
          {
            type: "duel",
            rounds: [
              { question: "Which chord is minor?", target: [0, 3, 7], other: [0, 4, 7], targetLabel: "minor", why: "Minor has the darker middle note, one fret lower." },
              { question: "Just two notes now. Which is the minor 3rd?", target: [0, 3], other: [0, 4], targetLabel: "minor 3rd", why: "3 frets apart is a minor 3rd. 4 frets is major." },
              { question: "Which one is the minor 6th?", target: [0, 8], other: [0, 9], targetLabel: "minor 6th", why: "Same rule for 6ths. The minor one is a fret smaller and darker." },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Practice 5.6 · exercises 2–3",
            questions: [
              { kind: "staff", lower: "C4", upper: "E4", options: ["M3", "m3", "P4", "M2"] },
              { kind: "fretInterval", string: 4, fret: 3, semitones: 3, label: "minor 3rd" },
              { kind: "staff", lower: "D4", upper: "F4", options: ["M3", "m3", "M2", "P4"] },
              { kind: "staff", lower: "E4", upper: "C5", options: ["M6", "m6", "P5", "m7"] },
              { kind: "fretInterval", string: 3, fret: 0, semitones: 4, label: "major 3rd" },
              { kind: "staff", lower: "G4", upper: "E5", options: ["m6", "M6", "P5", "M7"] },
              { kind: "staff", lower: "A4", upper: "C5", options: ["m3", "M3", "M2", "P4"] },
            ],
          },
          {
            type: "songMatch",
            rounds: [
              { notes: [60, 67], interval: "P5", song: "Twinkle Twinkle Little Star", choices: ["Twinkle Twinkle Little Star", "Greensleeves", "My Bonnie Lies Over the Ocean"] },
              { notes: [57, 60], interval: "m3", song: "Greensleeves", choices: ["Twinkle Twinkle Little Star", "Greensleeves", "My Bonnie Lies Over the Ocean"] },
              { notes: [62, 71], interval: "M6", song: "My Bonnie Lies Over the Ocean", choices: ["Twinkle Twinkle Little Star", "Greensleeves", "My Bonnie Lies Over the Ocean"] },
            ],
          },
        ],
      },
    ],
  },
  ...CHAPTERS_6_9,
  ...CHAPTERS_10_12,
  ...CHAPTERS_13_22,
  ...CHAPTERS_23_35,
];

/** Units after these arrive with later lessons. Shown locked on the course path. */
export const UPCOMING: { title: string; chapter: string }[] = [
];

export function allLessons() {
  return COURSE.flatMap((u) => u.lessons);
}

export function findLesson(id: string) {
  return allLessons().find((l) => l.id === id);
}
