import { parseNote } from "../music";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 5, intervals. Everything here measures a distance: count the letters on the staff, name
// the quality from the lower note's major scale, play it as a fret shape, flip it, and remember it
// by the song it starts.

const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const notes = (...names: string[]): Sound => ({ kind: "melodic", notes: midi(...names), gap: 0.6 });
const both = (...names: string[]): Sound => ({ kind: "chord", notes: midi(...names) });
const card = (text: string, staff: string[], sound: Sound = notes(...staff)): StoryCard => ({ text, staff, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

/** Name the interval drawn on the staff (two notes, one after the other). */
const name = (lower: string, upper: string, prompt: string, options: string[], answer: string, why: string): RushQuestion => ({
  kind: "choice",
  prompt,
  options,
  answer,
  visual: { type: "staff", notes: [lower, upper] },
  sound: notes(lower, upper),
  miss: why,
});

/** Hear two notes and name the interval. */
const ear = (lower: string, upper: string, options: string[], answer: string, why: string): RushQuestion => ({
  kind: "choice",
  prompt: "Listen. Which interval is this?",
  options,
  answer,
  sound: notes(lower, upper),
  miss: why,
});

/** Count the letters from the bottom note to the top one, then name the number. */
const count = (letters: string[], hidden: number[], decoys: string[], sound: Sound): RushQuestion => ({
  kind: "order",
  prompt: `Count up from ${letters[0]} to ${letters[letters.length - 1]}. Tap each letter in between.`,
  given: letters.map((l, i) => (hidden.includes(i) ? null : l)),
  answer: letters,
  tiles: [...hidden.map((i) => letters[i]), ...decoys].sort(),
  labels: letters.map((_, i) => String(i + 1)),
  sound,
  miss: `${letters.join(" ")} is ${letters.length} letters, counting both ends`,
});

export const CHAPTER_5: Record<string, Step[]> = {
  "5.1": [
    story(
      card("An interval is the distance between two notes. Played together, it's a harmonic interval. One after the other, it's melodic.", ["C4", "E4"]),
      card("To get an interval's number, count the letter names from the bottom note to the top one, including both. C, D, E is three letters, so C up to E is a 3rd.", ["C4", "D4", "E4"]),
      card("C up to G: C D E F G is five letters, so it's a 5th. The two notes of a guitar power chord are a 5th apart.", ["C4", "G4"], both("C4", "G4")),
      card("Two notes on the same letter are a unison, and eight letters apart (C to the next C) is an octave, written 8ve.", ["C4", "C5"]),
      card("Only the letters count, not the sharps or flats. C to E♭ and C to E♯ are both still 3rds. Their size changes, and that's the next section.", ["C4", "Eb4", "C4", "E4"]),
    ),
    practice(
      "Count the letters",
      count(["C", "D", "E", "F", "G", "A"], [1, 2, 3, 4], ["B"], notes("C4", "A4")),
      { kind: "choice", prompt: "So C up to A is a…", options: ["5th", "6th", "7th"], answer: "6th", visual: { type: "staff", notes: ["C4", "A4"] }, sound: notes("C4", "A4"), miss: "Six letters, C D E F G A: a 6th" },
      count(["E", "F", "G", "A"], [1, 2], ["B"], notes("E4", "A4")),
    ),
    practice(
      "Name it",
      name("D4", "A4", "What number is this interval?", ["4th", "5th", "6th"], "5th", "D E F G A is five letters: a 5th"),
      name("E4", "F4", "What number is this interval?", ["Unison", "2nd", "3rd"], "2nd", "E and F are next-door letters: a 2nd"),
      name("G4", "C5", "What number is this interval?", ["3rd", "4th", "5th"], "4th", "G A B C is four letters: a 4th"),
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "“Twinkle Twinkle Little Star” jumps on the second “twinkle”, from C up to G. What number is that leap?", options: ["3rd", "5th", "8ve"], answer: "5th", visual: { type: "staff", notes: ["C4", "C4", "G4", "G4"] }, sound: notes("C4", "C4", "G4", "G4"), miss: "C D E F G is five letters: a 5th" },
    ),
  ],

  "5.2": [
    story(
      card("Intervals with the same number can be different sizes. C to E is a major 3rd (M3). C to E♭, a half step smaller, is a minor 3rd (m3).", ["C4", "E4", "C4", "Eb4"]),
      card("Here's the trick: pretend the bottom note is the tonic of a major scale. Every note of that scale is a major or perfect interval above it.", ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"]),
      card("Unisons, 4ths, 5ths and octaves are called perfect (P). 2nds, 3rds, 6ths and 7ths are major (M) when they're in the major scale.", ["C4", "F4", "C4", "G4"]),
      card("If the top note is a half step lower than the major interval, it's minor (m). C to A is a major 6th, and C to A♭ is a minor 6th.", ["C4", "A4", "C4", "Ab4"]),
      card("Major 3rds sound bright and minor 3rds sound dark. That one half step is the difference between a major and a minor chord.", ["C4", "E4", "C4", "Eb4"], { kind: "progression", gap: 1, chords: [midi("C4", "E4", "G4"), midi("C4", "Eb4", "G4")] }),
    ),
    practice(
      "Name it on the staff",
      name("C4", "Eb4", "Major, minor or perfect?", ["M3", "m3", "P4"], "m3", "C major's 3rd is E. E♭ is a half step lower, so it's a minor 3rd"),
      name("D4", "F#4", "Major or minor?", ["M3", "m3"], "M3", "D major has F♯, so D to F♯ is a major 3rd"),
      name("C4", "G4", "Name this interval.", ["M5", "P5", "m5"], "P5", "5ths are perfect, and G is in C major: a perfect 5th"),
      name("E4", "C5", "Name this interval.", ["M6", "m6", "P6"], "m6", "E major's 6th is C♯. Plain C is a half step lower: a minor 6th"),
    ),
    practice(
      "Name it by ear",
      ear("C4", "E4", ["Major 3rd", "Minor 3rd"], "Major 3rd", "Bright and happy: a major 3rd"),
      ear("A3", "C4", ["Major 3rd", "Minor 3rd"], "Minor 3rd", "Darker and sadder: a minor 3rd"),
      ear("C4", "G4", ["Perfect 4th", "Perfect 5th"], "Perfect 5th", "Open and strong, like a power chord: a perfect 5th"),
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "“Here Comes the Bride” opens with a leap from G up to C. What interval is it?", options: ["Perfect 4th", "Perfect 5th", "Major 3rd"], answer: "Perfect 4th", visual: { type: "staff", notes: ["G4", "C5"] }, sound: notes("G4", "C5", "C5", "C5"), miss: "G A B C is a 4th, and C is in G major: a perfect 4th" },
      { kind: "choice", prompt: "The “Star Wars” theme leaps from C up to G. What interval is it?", options: ["Perfect 4th", "Perfect 5th", "Octave"], answer: "Perfect 5th", visual: { type: "staff", notes: ["C4", "G4"] }, sound: notes("C4", "G4"), miss: "C D E F G is a 5th, and G is in C major: a perfect 5th" },
    ),
  ],

  "5.3": [
    story(
      card("To write an interval above a note, use the bottom note's major scale. A major 6th above F: F major's 6th note is D.", ["F4", "D5"]),
      card("For a minor interval, lower that top note a half step. A minor 6th above F is D♭.", ["F4", "Db5"]),
      card("On guitar, each interval is a shape you can move anywhere. A perfect 5th is one string up and two frets higher.", ["C4", "G4"], both("C4", "G4")),
      card("A perfect 4th is the next string up at the same fret (except onto the B string, where you move up one fret).", ["A3", "D4"], both("A3", "D4")),
      card("A major 3rd is one string up and one fret lower. A minor 3rd is one string up and two frets lower.", ["C4", "E4"], both("C4", "E4")),
    ),
    practice(
      "Write it",
      name("F4", "D5", "What is a major 6th above F?", ["C", "D", "D♭"], "D", "F major is F G A B♭ C D. Its 6th note is D"),
      name("A4", "C5", "What is a minor 3rd above A?", ["C♯", "C", "B"], "C", "A major's 3rd is C♯. Lower it a half step for minor: C"),
    ),
    practice(
      "Build it on the guitar",
      { kind: "fretInterval", string: 4, fret: 3, semitones: 7, label: "perfect 5th", hint: "One string up (the D string) and two frets higher. Together they're a power chord." },
      { kind: "fretInterval", string: 5, fret: 3, semitones: 5, label: "perfect 4th", hint: "Go to the next string up (the A string) at the same fret." },
      { kind: "fretInterval", string: 4, fret: 3, semitones: 4, label: "major 3rd", hint: "One string up and one fret lower: D string, fret 2." },
      { kind: "fretInterval", string: 4, fret: 3, semitones: 3, label: "minor 3rd", hint: "One string up and two frets lower: D string, fret 1." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "The riff of “Smoke on the Water” by Deep Purple is played as pairs of notes, a 4th apart, on two strings at the same fret. What are those shapes called?", options: ["Power chords", "Major chords", "Octaves"], answer: "Power chords", visual: { type: "fretboard", marks: [{ string: 3, fret: 0 }, { string: 2, fret: 0 }] }, sound: { kind: "progression", gap: 0.5, chords: [midi("D3", "G3"), midi("F3", "Bb3"), midi("G3", "C4")] }, miss: "Two notes a 4th or 5th apart on neighboring strings make a power chord" },
    ),
  ],

  "5.4": [
    story(
      card("Inverting an interval means flipping it: the bottom note moves up an octave and becomes the top note.", ["C4", "E4", "E4", "C5"]),
      card("The numbers always add up to 9. A 3rd flips into a 6th, a 4th into a 5th, a 2nd into a 7th.", ["C4", "F4", "F4", "C5"]),
      card("The quality flips too: major becomes minor and minor becomes major. Perfect stays perfect.", ["C4", "E4", "E4", "C5"]),
      card("So C up to E is a major 3rd, and E up to C is a minor 6th. Same two notes, opposite way round.", ["E4", "C5"]),
    ),
    practice("Flip it", {
      kind: "order",
      layout: "list",
      prompt: "Turn each interval upside down. The numbers add up to 9.",
      given: [null, "P5", null, null],
      answer: ["m6", "P5", "M7", "m3"],
      labels: ["M3 flips to", "P4 flips to", "m2 flips to", "M6 flips to"],
      tiles: ["M3", "M6", "M7", "m3", "m6", "m7"],
      miss: "M3→m6, P4→P5, m2→M7, M6→m3: the numbers add to 9 and major and minor swap",
    }),
    practice(
      "Name it",
      { kind: "choice", prompt: "C up to E is a major 3rd. What is E up to C?", options: ["Minor 6th", "Major 6th", "Minor 3rd"], answer: "Minor 6th", visual: { type: "staff", notes: ["E4", "C5"] }, sound: notes("E4", "C5"), miss: "3 + 6 = 9, and major flips to minor: a minor 6th" },
      { kind: "choice", prompt: "Which interval stays perfect when you flip it?", options: ["Perfect 4th", "Major 2nd", "Minor 7th"], answer: "Perfect 4th", miss: "Perfect intervals stay perfect: a perfect 4th flips into a perfect 5th" },
    ),
    practice(
      "Name it by ear",
      ear("G3", "C4", ["Perfect 4th", "Perfect 5th"], "Perfect 4th", "Shorter jump, like “Here Comes the Bride”: a perfect 4th"),
      ear("C4", "G4", ["Perfect 4th", "Perfect 5th"], "Perfect 5th", "Wider jump, like “Star Wars”: a perfect 5th. It's the 4th flipped"),
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "On guitar, C on the A string to G on the D string is a 5th. If you play G below C instead (low E string, fret 3), what interval is that?", options: ["Perfect 4th", "Perfect 5th", "Octave"], answer: "Perfect 4th", visual: { type: "fretboard", marks: [{ string: 5, fret: 3 }, { string: 4, fret: 3 }] }, sound: both("G2", "C3"), miss: "Flip a 5th and you get a 4th: 5 + 4 = 9" },
    ),
  ],

  "5.5": [
    story(
      card("An augmented interval (+) is a half step bigger than a perfect or major one. C to G♯ is an augmented 5th.", ["C4", "G4", "C4", "G#4"]),
      card("A diminished interval (°) is a half step smaller than a perfect or minor one. C to G♭ is a diminished 5th.", ["C4", "G4", "C4", "Gb4"]),
      card("The interval of three whole steps has a name of its own: the tritone. C to F♯ (+4) and C to G♭ (°5) are both tritones.", ["C4", "F#4", "C4", "Gb4"]),
      card("The tritone splits the octave exactly in half and sounds tense and unresolved. It's the clash inside every dominant 7th chord.", ["B3", "F4"], both("B3", "F4")),
    ),
    practice(
      "Name it on the staff",
      name("C4", "G#4", "Name this interval.", ["P5", "+5", "m6"], "+5", "C to G is a perfect 5th. G♯ is a half step bigger: augmented 5th"),
      name("C4", "Gb4", "Name this interval.", ["°5", "P4", "+4"], "°5", "C to G is a perfect 5th. G♭ is a half step smaller: diminished 5th"),
      name("F4", "B4", "Name this interval.", ["P4", "+4", "°5"], "+4", "F to B♭ would be a perfect 4th. B is a half step bigger: augmented 4th, a tritone"),
    ),
    practice(
      "Build it on the guitar",
      { kind: "fretInterval", string: 4, fret: 3, semitones: 6, label: "tritone", hint: "One string up and one fret higher than a perfect 4th: D string, fret 4." },
    ),
    practice(
      "Name it by ear",
      ear("C4", "F#4", ["Perfect 4th", "Tritone", "Perfect 5th"], "Tritone", "Tense and unsettled, right between a 4th and a 5th: a tritone"),
      ear("C4", "G4", ["Perfect 4th", "Tritone", "Perfect 5th"], "Perfect 5th", "Stable and open: a perfect 5th"),
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "The intro of “Purple Haze” by Jimi Hendrix starts with B♭ and E. Which interval is it?", options: ["Perfect 4th", "Tritone", "Perfect 5th"], answer: "Tritone", visual: { type: "staff", notes: ["Bb3", "E4"] }, sound: both("Bb3", "E4"), miss: "B♭ up to E is three whole steps, an augmented 4th: the tritone" },
      { kind: "choice", prompt: "“The Simpsons” theme sings “The Simp-sons” on C, F♯, G. Which interval is C up to F♯?", options: ["Perfect 4th", "Tritone", "Minor 6th"], answer: "Tritone", visual: { type: "staff", notes: ["C4", "F#4", "G4"] }, sound: notes("C4", "F#4", "G4"), miss: "C to F♯ is three whole steps: a tritone, which resolves up to G" },
    ),
  ],
};
