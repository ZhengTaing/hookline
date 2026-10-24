import { parseNote } from "../music";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 1 in the Lesson Types layout: story cards with the book's explanation (every card
// shows its notes on the staff), then name it on the staff, build it on the guitar, name it
// by ear, and use it in a real song. Every question practises only what that section's cards
// explained, and every answer says why.

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

const card = (text: string, staff: string[], sound: Sound = notes(...staff)): StoryCard => ({ text, staff, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });

/** A "Use it in real songs" step. */
const songs = (...questions: RushQuestion[]): Step => ({ type: "practice", title: "Use it in real songs", questions });

export const CHAPTER_1: Record<string, Step[]> = {
  "1.1": [
    story(
      card("Pitch is how high or low a note sounds. A piano has 88 notes: they sound higher as you move right and lower as you move left.", ["C4", "E4", "G4", "C5"]),
      card("On the staff, higher notes are drawn higher up. These four notes climb, so they climb on the page too.", ["E4", "G4", "B4", "D5"]),
      card("On guitar, each fret toward the body raises the pitch a half step. On the A string, fret 5 (D) sounds higher than fret 2 (B).", ["B3", "D4"], notes("B2", "D3")),
      card("Listen from low to high. The further up the staff, the higher it sounds.", ["C4", "G4", "C5", "G5"]),
    ),
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
    songs({
      kind: "choice",
      prompt: "The riff from “Seven Nation Army” by The White Stripes. Which note is the highest?",
      options: ["E", "G", "B"],
      answer: "G",
      sound: notes("E3", "E3", "G3", "E3", "D3", "C3", "B2"),
      miss: "The riff jumps up from E to G, then walks down D, C, B",
    }),
  ],

  "1.2": [
    story(
      card("Music is written on a staff: five lines and the four spaces between them. A clef at the start says which note each line is.", ["G4"]),
      card("This is the treble clef, also called the G clef: its curl wraps around the G line. Guitar music is written in treble clef.", ["G4"]),
      card("The lines, bottom to top, are E G B D F. Remember them as “Every Good Boy Does Fine”.", ["E4", "G4", "B4", "D5", "F5"]),
      card("The spaces, bottom to top, spell F A C E.", ["F4", "A4", "C5", "E5"]),
      card("Music uses just seven letters, A to G, then starts again. Short ledger lines extend the staff for notes above or below it.", ["C4", "A5"]),
    ),
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
    songs(
      {
        kind: "choice",
        prompt: "The start of “Ode to Joy” by Beethoven. Which note does it start on?",
        options: ["E", "F", "G", "D"],
        answer: "E",
        visual: { type: "staff", notes: ["E4", "E4", "F4", "G4", "G4", "F4", "E4", "D4"] },
        sound: notes("E4", "E4", "F4", "G4", "G4", "F4", "E4", "D4"),
        miss: "It starts on the bottom line, E. Every Good Boy Does Fine",
      },
      {
        kind: "choice",
        prompt: "Same tune. Which note is the highest?",
        options: ["E", "F", "G", "D"],
        answer: "G",
        visual: { type: "staff", notes: ["E4", "E4", "F4", "G4", "G4", "F4", "E4", "D4"] },
        sound: notes("E4", "E4", "F4", "G4", "G4", "F4", "E4", "D4"),
        miss: "The highest notes sit on the second line, G",
      },
    ),
  ],

  "1.3": [
    story(
      card("88 piano keys but only seven letters, so the letters repeat. From one note to the next note with the same name is an octave (8ve).", ["C4", "C5"]),
      card("Each octave gets a number, counting up from C. Middle C is C4. In treble clef it sits on the ledger line just below the staff.", ["C4"]),
      card("The number changes at every C. So the B right below middle C is B3, and the D right above it is D4.", ["B3", "C4", "D4"]),
      card("C5 is in the third space, one octave above middle C. C6 sits two ledger lines above the staff.", ["C4", "C5", "C6"]),
    ),
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
    songs({
      kind: "choice",
      prompt: "The first two notes of “Somewhere Over the Rainbow” (“Some-where”) are the same letter. How far apart are they?",
      options: ["One octave", "The same note", "Two octaves"],
      answer: "One octave",
      sound: notes("C4", "C5"),
      miss: "The melody leaps up an octave, from C4 to C5",
    }),
  ],

  "1.4": [
    story(
      card("Accidentals are signs placed in front of a note to raise or lower it.", ["F4", "F#4"]),
      card("A sharp ♯ raises a note a half step. On guitar that's one fret up: F on the low E string is fret 1, F♯ is fret 2.", ["F4", "F#4"]),
      card("A flat ♭ lowers a note a half step: one fret down.", ["B4", "Bb4"]),
      card("A natural ♮ cancels a sharp or flat. A double sharp or double flat moves a note two half steps, a whole step.", ["C#5", "C5"]),
    ),
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
    songs({
      kind: "choice",
      prompt: "The riff from “Smoke on the Water” by Deep Purple. Which two notes have flats?",
      options: ["B♭ and D♭", "B and D", "G and C"],
      answer: "B♭ and D♭",
      visual: { type: "staff", notes: ["G4", "Bb4", "C5", "G4", "Bb4", "Db5", "C5"] },
      sound: notes("G3", "Bb3", "C4", "G3", "Bb3", "Db4", "C4"),
      miss: "The ♭ signs sit in front of B and D: the riff is G, B♭, C, then G, B♭, D♭, C",
    }),
  ],

  "1.5": [
    story(
      card("C♯ and D♭ are the same piano key and the same guitar fret, but they're written in different places on the staff.", ["C#4", "Db4"]),
      card("Every black key has two names: C♯/D♭, D♯/E♭, F♯/G♭, G♯/A♭ and A♯/B♭.", ["F#4", "Gb4"]),
      card("Notes that sound the same but are written differently are enharmonic. White keys can be too: E♯ sounds the same as F.", ["E#4", "F4"]),
      card("Which name to use depends on the key you're in. You'll see why in chapter 2.", ["A#4", "Bb4"]),
    ),
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
    songs({
      kind: "choice",
      prompt: "“Für Elise” by Beethoven starts E, D♯, E, D♯. On guitar, D♯ is the same fret as which note?",
      options: ["E♭", "D", "E"],
      answer: "E♭",
      visual: { type: "staff", notes: ["E5", "D#5", "E5", "D#5", "E5"] },
      sound: notes("E5", "D#5", "E5", "D#5", "E5", "B4", "D5", "C5", "A4"),
      miss: "D♯ and E♭ are enharmonic: one fret, two names",
    }),
  ],
};
