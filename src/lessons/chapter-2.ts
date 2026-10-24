import { parseNote } from "../music";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 2, major scales and key signatures, in the same layout as chapter 1: story cards,
// name it on the staff, put it in order, build it on the guitar, name it by ear, and use it
// in real songs.

const notes = (...names: string[]): Sound => ({ kind: "melodic", notes: names.map((n) => parseNote(n).midi), gap: 0.45 });
const card = (text: string, staff: string[], sound: Sound = notes(...staff), keySig?: number): StoryCard => ({ text, staff, sound, keySig });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

const C_MAJOR = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
const D_MAJOR = ["D4", "E4", "F#4", "G4", "A4", "B4", "C#5", "D5"];
const G_MAJOR = ["G4", "A4", "B4", "C5", "D5", "E5", "F#5", "G5"];
const STEPS = ["", "W", "W", "H", "W", "W", "W", "H"];

/** "Half step or whole step?" for two notes on the staff. */
const halfOrWhole = (a: string, b: string, why: string): RushQuestion => ({
  kind: "choice",
  prompt: "Half step or whole step?",
  options: ["Half step", "Whole step"],
  answer: parseNote(b).midi - parseNote(a).midi === 1 ? "Half step" : "Whole step",
  visual: { type: "staff", notes: [a, b] },
  sound: notes(a, b),
  miss: why,
});

const earStep = (a: string, b: string, why: string): RushQuestion => ({
  kind: "choice",
  prompt: "Listen. Half step or whole step?",
  options: ["Half step", "Whole step"],
  answer: parseNote(b).midi - parseNote(a).midi === 1 ? "Half step" : "Whole step",
  sound: notes(a, b),
  miss: why,
});

const whichKey = (keySig: number, options: string[], answer: string, why: string): RushQuestion => ({
  kind: "choice",
  prompt: "Which major key has this key signature?",
  options,
  answer,
  visual: { type: "staff", notes: [], keySig },
  miss: why,
});

const chord = (...midi: number[]) => midi;

export const CHAPTER_2: Record<string, Step[]> = {
  "2.1": [
    story(
      card("A half step is the distance from one note to the very next one, with nothing in between. On guitar, that's one fret.", ["C4", "Db4"]),
      card("A whole step is two half steps: two frets on guitar. C to D is a whole step, because C♯ sits between them.", ["C4", "D4"]),
      card("E to F and B to C are half steps. There's no black key between them, so there's no sharp between them either.", ["E4", "F4", "B4", "C5"]),
      card("Every other pair of neighbouring letters is a whole step: C–D, D–E, F–G, G–A and A–B.", ["C4", "D4", "F4", "G4"]),
      card("With sharps and flats, count the frets. E to F♯ is two frets, so it's a whole step even though E to F is only a half.", ["E4", "F#4"]),
    ),
    practice(
      "Name it on the staff",
      halfOrWhole("E4", "F4", "E to F is a half step: there's no note between them"),
      halfOrWhole("G4", "A4", "G to A is a whole step: G♯ sits between them"),
      halfOrWhole("B4", "C5", "B to C is a half step, like E to F"),
      halfOrWhole("E4", "F#4", "E to F is a half step, and F to F♯ is another: two halves make a whole step"),
    ),
    practice(
      "Build it on the guitar",
      { kind: "fretInterval", string: 4, fret: 0, semitones: 2, label: "whole step", hint: "A whole step is two frets. Move two frets up from the circled A." },
      { kind: "fretInterval", string: 3, fret: 2, semitones: 1, label: "half step", hint: "A half step is one fret. One fret up from E is F." },
    ),
    practice(
      "Name it by ear",
      earStep("C4", "Db4", "That was a half step: the two notes are right next to each other"),
      earStep("G4", "A4", "That was a whole step: there's a note you could squeeze in between"),
      earStep("B3", "C4", "That was a half step: B to C has nothing between"),
    ),
    practice(
      "Use it in real songs",
      {
        kind: "choice",
        prompt: "The shark theme from Jaws rocks back and forth between two notes. Half step or whole step?",
        options: ["Half step", "Whole step"],
        answer: "Half step",
        sound: notes("E2", "F2", "E2", "F2", "E2", "F2", "E2", "F2"),
        miss: "It's E and F, a half step. That tiny gap is what makes it so tense",
      },
      {
        kind: "choice",
        prompt: "“Happy Birthday” starts “Hap-py Birth-”: G, G, then A. From G up to A is a…",
        options: ["Half step", "Whole step"],
        answer: "Whole step",
        visual: { type: "staff", notes: ["G4", "G4", "A4"] },
        sound: notes("G4", "G4", "A4", "G4", "C5", "B4"),
        miss: "G to A is a whole step: G♯ sits between them",
      },
    ),
  ],

  "2.2": [
    story(
      card("A scale is a set of notes in order, from one note up to the same note an octave higher. The major scale is the one that sounds like do re mi.", C_MAJOR),
      card("C major uses only the white keys: C D E F G A B C. Every letter, once each, in order.", C_MAJOR),
      card("Look at the steps: whole, whole, half, then whole, then whole, whole, half. The half steps are E–F and B–C.", ["C4", "D4", "E4", "F4"]),
      card("Think of it as two matching halves called tetrachords: C D E F and G A B C. Both go W W H, and a whole step joins them.", ["G4", "A4", "B4", "C5"]),
      card("Start on any note and keep the same pattern. D major needs F♯ and C♯ so the half steps land in the right places.", D_MAJOR),
      card("Use every letter once. D E F♯ G is right. D E G♭ G is wrong, because G appears twice and F is skipped.", ["D4", "E4", "F#4", "G4"]),
    ),
    practice(
      "Put it in order",
      {
        kind: "order",
        prompt: "Build the D major scale. Tap the notes in order.",
        given: ["D", "E", "F♯", "G", null, null, null, "D"],
        answer: ["D", "E", "F♯", "G", "A", "B", "C♯", "D"],
        tiles: ["C♯", "A", "C", "B"],
        labels: STEPS,
        sound: notes(...D_MAJOR),
        miss: "D major is D E F♯ G A B C♯ D. B to C♯ is a whole step and C♯ to D is the last half step",
      },
      {
        kind: "order",
        prompt: "Build the G major scale.",
        given: ["G", "A", "B", null, null, null, null, "G"],
        answer: ["G", "A", "B", "C", "D", "E", "F♯", "G"],
        tiles: ["F♯", "D", "C", "F", "E"],
        labels: STEPS,
        sound: notes(...G_MAJOR),
        miss: "G major is G A B C D E F♯ G. It needs F♯ so the last step, F♯ to G, is a half step",
      },
    ),
    practice(
      "Name it on the staff",
      {
        kind: "choice",
        prompt: "One note is missing from this C major scale. Which one?",
        options: ["F", "F♯", "G♭"],
        answer: "F",
        visual: { type: "staff", notes: ["C4", "D4", "E4", "G4", "A4", "B4", "C5"] },
        sound: notes("C4", "D4", "E4", "G4", "A4", "B4", "C5"),
        miss: "E jumps straight to G, so F is missing. C major has no sharps or flats",
      },
      {
        kind: "choice",
        prompt: "Is this a D major scale?",
        options: ["Yes", "No, it needs F♯ and C♯"],
        answer: "No, it needs F♯ and C♯",
        visual: { type: "staff", notes: ["D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5"] },
        sound: notes("D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5"),
        miss: "With plain F and C the steps go W H W W W H W, not W W H W W W H",
      },
    ),
    practice(
      "Build it on the guitar",
      { kind: "findNote", pitchClass: 6, prompt: "G major has one sharp. Find it.", hint: "G major is G A B C D E F♯ G. F♯ is one fret above any F, like the low E string, fret 2." },
      { kind: "findNote", pitchClass: 1, prompt: "D major's last sharp is C♯. Find it.", hint: "C♯ is one fret above any C. Try the B string, fret 2." },
    ),
    practice(
      "Name it by ear",
      {
        kind: "choice",
        prompt: "Listen. Is this a major scale?",
        options: ["Yes, it's major", "No, a note is off"],
        answer: "Yes, it's major",
        sound: notes(...D_MAJOR),
        miss: "That was D major: it has the do re mi sound all the way up",
      },
      {
        kind: "choice",
        prompt: "Listen. Is this a major scale?",
        options: ["Yes, it's major", "No, a note is off"],
        answer: "No, a note is off",
        sound: notes("C4", "D4", "E4", "F#4", "G4", "A4", "B4", "C5"),
        miss: "The fourth note was F♯ instead of F, so the half step between E and F went missing",
      },
    ),
    practice("Use it in real songs", {
      kind: "choice",
      prompt: "“Joy to the World” opens by walking down a major scale. Which one?",
      options: ["C major", "G major", "D major"],
      answer: "C major",
      visual: { type: "staff", notes: ["C5", "B4", "A4", "G4", "F4", "E4", "D4", "C4"] },
      sound: notes("C5", "B4", "A4", "G4", "F4", "E4", "D4", "C4"),
      miss: "It starts on C and uses no sharps or flats, so it's C major going down",
    }, {
      kind: "choice",
      prompt: "In “Joy to the World”, where is the first half step?",
      options: ["C down to B", "B down to A", "A down to G"],
      answer: "C down to B",
      visual: { type: "staff", notes: ["C5", "B4", "A4", "G4"] },
      sound: notes("C5", "B4", "A4", "G4"),
      miss: "B to C is one of the scale's two half steps, so the very first step down is a half step",
    }),
  ],

  "2.3": [
    story(
      card("A key signature sits right after the clef. It lists the key's sharps or flats once, so they don't have to be written on every note.", ["G4", "A4", "B4"], notes(...G_MAJOR), 1),
      card("Sharps always come in the same order: F C G D A E B. Remember it as “Father Charles Goes Down And Ends Battle”.", [], notes("F#5", "C#5", "G#5", "D#5", "A#4", "E#5", "B#4"), 7),
      card("Flats come in the reverse order: B E A D G C F. The first four spell BEAD.", [], notes("Bb4", "Eb5", "Ab4", "Db5", "Gb4", "Cb5", "Fb4"), -7),
      card("To name a sharp key, go up a half step from the last sharp. Two sharps, F♯ and C♯: a half step above C♯ is D, so it's D major.", [], notes(...D_MAJOR), 2),
      card("To name a flat key, read the second-to-last flat. Three flats, B♭ E♭ A♭: the key is E♭ major. One flat is the exception to learn by heart: F major.", [], notes("Eb4", "F4", "G4", "Ab4", "Bb4", "C5", "D5", "Eb5"), -3),
      card("C major has no sharps or flats. Each step up by a fifth (C, G, D, A…) adds one sharp. Going round like this is the circle of fifths. There are 15 major key signatures in all.", ["C4", "G4", "D5"]),
    ),
    practice(
      "Name it on the staff",
      whichKey(2, ["D major", "A major", "G major", "B♭ major"], "D major", "Two sharps, F♯ and C♯. A half step above the last sharp, C♯, is D"),
      whichKey(1, ["F major", "G major", "C major", "D major"], "G major", "One sharp, F♯. A half step above F♯ is G"),
      whichKey(-1, ["F major", "B♭ major", "C major", "G major"], "F major", "One flat is the exception: it's F major"),
      whichKey(-3, ["A♭ major", "E♭ major", "B♭ major", "C major"], "E♭ major", "Three flats, B♭ E♭ A♭. The second-to-last flat is E♭"),
    ),
    practice(
      "Put it in order",
      {
        kind: "order",
        prompt: "Fill in the order of sharps.",
        given: ["F", "C", null, null, null, "E", "B"],
        answer: ["F", "C", "G", "D", "A", "E", "B"],
        tiles: ["D", "G", "A"],
        miss: "Father Charles Goes Down And Ends Battle: F C G D A E B",
      },
      {
        kind: "order",
        prompt: "Now the order of flats.",
        given: ["B", "E", null, null, "G", "C", "F"],
        answer: ["B", "E", "A", "D", "G", "C", "F"],
        tiles: ["D", "A"],
        miss: "Flats are the sharps backwards: B E A D G C F. The first four spell BEAD",
      },
    ),
    practice(
      "Build it on the guitar",
      { kind: "findNote", pitchClass: 10, prompt: "F major has one flat. Find it.", hint: "The first flat is always B♭, one fret below B. Try the A string, fret 1." },
      { kind: "findNote", pitchClass: 3, prompt: "E♭ major is named after its second-to-last flat. Find E♭.", hint: "E♭ is one fret below E. Try the D string, fret 1." },
    ),
    practice("Name it by ear", {
      kind: "choice",
      prompt: "Listen. This major scale has one sharp in its key signature. Which key is it?",
      options: ["G major", "F major", "C major"],
      answer: "G major",
      sound: notes(...G_MAJOR),
      miss: "One sharp, F♯, means G major. The scale ran from G to G",
    }),
    practice(
      "Use it in real songs",
      {
        kind: "choice",
        prompt: "“Twinkle, Twinkle, Little Star” in D major, from the book’s figure 2.3.1. Which notes does the key signature make sharp?",
        options: ["F and C", "B and E", "G and D"],
        answer: "F and C",
        visual: { type: "staff", notes: ["D4", "D4", "A4", "A4", "B4", "B4", "A4"], keySig: 2 },
        sound: notes("D4", "D4", "A4", "A4", "B4", "B4", "A4"),
        miss: "Sharps always come in the order F C G D A E B, so a key with two sharps has F♯ and C♯",
      },
      {
        kind: "choice",
        prompt: "“Knockin’ on Heaven’s Door” by Bob Dylan is in G major (G, D, Am, then G, D, C). How many sharps are in its key signature?",
        options: ["None", "One", "Two"],
        answer: "One",
        sound: { kind: "progression", gap: 0.9, chords: [chord(43, 47, 50, 55), chord(50, 54, 57, 62), chord(45, 52, 57, 60), chord(43, 47, 50, 55), chord(50, 54, 57, 62), chord(48, 52, 55, 60)] },
        miss: "G major has one sharp, F♯. You can hear it inside the D chord: D F♯ A",
      },
    ),
  ],
};
