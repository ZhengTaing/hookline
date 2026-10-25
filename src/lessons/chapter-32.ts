import { parseNote } from "../music";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 32, 20th-century harmony: Debussy's whole-tone scales and sliding chords, free use of
// the white notes, chords built from 4ths, 5ths and 2nds, and two chords stacked at once. Each
// section plays one of these sounds on the guitar, where several of them fall under the fingers.

const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const chord = (...names: string[]): Sound => ({ kind: "chord", notes: midi(...names) });
const voiced = (gap: number, ...chords: string[][]): Sound => ({ kind: "progression", gap, chords: chords.map((c) => midi(...c)) });
const tune = (notes: string[], gap = 0.25): Sound => ({ kind: "melodic", notes: midi(...notes), gap });
const card = (text: string, left: string, right: string, label: string, sound: Sound): StoryCard => ({ text, left, right, label, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });
const shape = (name: string, frets: (number | null)[]) => ({
  name,
  // frets listed low E to high e, like a chord chart; null = not played
  marks: frets.flatMap((fret, i) => (fret === null ? [] : [{ string: 5 - i, fret }])),
});

const WHOLE = tune(["C4", "D4", "E4", "F#4", "G#4", "A#4", "C5"]);
const MAJOR = tune(["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"]);
const PLANING = voiced(0.6, ["C3", "E3", "G3"], ["D3", "F#3", "A3"], ["E3", "G#3", "B3"], ["D3", "F#3", "A3"], ["C3", "E3", "G3"]);
const WASH = chord("C3", "G3", "D4", "E4", "A4");
const QUARTAL = chord("D3", "G3", "C4", "F4");
const QUINTAL = chord("C3", "G3", "D4", "A4");
const SECUNDAL = chord("C4", "D4", "E4");
const TERTIAN = chord("C3", "E3", "G3", "B3");
const POLY = chord("C3", "E3", "G3", "F#4", "A#4", "C#5");
const STACKS = ["Quartal (4ths)", "Quintal (5ths)", "Secundal (2nds)", "Tertian (3rds)"];

export const CHAPTER_32: Record<string, Step[]> = {
  "32.1": [
    story(
      card("Around 1900, Debussy and Ravel stepped away from strong chord progressions. Their music floats.", "Debussy", "Ravel", "Impressionism", PLANING),
      card("One trick is the whole-tone scale: six notes, every one a whole step apart. With no half steps, there's no pull to a home note.", "C D E", "F♯ G♯ A♯", "whole-tone", WHOLE),
      card("Another is planing: one chord shape sliding up and down in parallel, so every voice moves the same way. Chorale rules are out.", "C D E", "same shape", "planing", PLANING),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Major scale or whole-tone scale?", options: ["Whole-tone", "Major"], answer: "Whole-tone", sound: WHOLE, miss: "Every step the same size, no half steps: whole-tone" },
      { kind: "choice", prompt: "Listen. Major scale or whole-tone scale?", options: ["Whole-tone", "Major"], answer: "Major", sound: MAJOR, miss: "Two half steps (E–F and B–C) give it a home: major" },
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Build the whole-tone scale on C.",
      given: ["C", null, null, null, null, null, "C"],
      answer: ["C", "D", "E", "F♯", "G♯", "A♯", "C"],
      tiles: ["G♯", "E", "A♯", "D", "F♯", "F"],
      sound: WHOLE,
      miss: "C D E F♯ G♯ A♯ C: always two frets apart",
    }),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 1, fret: 1, semitones: 2, label: "D, a whole step up", hint: "C is the B string, fret 1. A whole step is two frets: D at fret 3. Keep going two frets at a time and you're playing the whole-tone scale." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Films use a shimmering whole-tone run on harp to start a dream sequence. Why does it sound dreamy?", options: ["No half steps, so no home note", "It's very loud", "It's in a minor key"], answer: "No half steps, so no home note", sound: WHOLE, miss: "Without half steps, nothing pulls toward a tonic, so it floats" },
      { kind: "choice", prompt: "A guitarist slides one power-chord shape up and down the neck. What's that called in Debussy's music?", options: ["Planing", "Modulation", "Counterpoint"], answer: "Planing", sound: PLANING, miss: "The same shape moving in parallel is planing" },
    ),
  ],

  "32.2": [
    story(
      card("Pandiatonicism uses the notes of one major scale freely. Any white notes can sound together, with no chord progression to follow.", "C D E G A", "any order", "all white notes", WASH),
      card("Nothing has to resolve: 2nds, 4ths and 7ths just ring. Copland's “Appalachian Spring” is full of this open, wide sound.", "no rules", "just color", "Copland", voiced(0.8, ["C3", "G3", "D4", "E4"], ["F3", "C4", "G4", "A4"], ["C3", "G3", "D4", "E4"])),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "In pandiatonic music, does a dissonant note have to resolve?", options: ["No, it can just ring", "Yes, by step down", "Yes, by leap"], answer: "No, it can just ring", miss: "The scale's notes are used freely, without tendency tones" },
      { kind: "choice", prompt: "Which notes does pandiatonic music in C draw from?", options: ["Only the C major scale", "All twelve notes", "Only C, E, G"], answer: "Only the C major scale", sound: WASH, miss: "Pan-diatonic: all the notes of one diatonic scale" },
    ),
    {
      type: "tapBeat",
      bpm: 72,
      beatsPerBar: 4,
      bars: 2,
      title: "Let Cadd9 ring",
      hint: "x 3 2 0 3 3: C, E, open G, D and G. The D clashes gently with the C and E, and it doesn't need to go anywhere. Hands busy? Tap the button instead and it plays the guitar for you.",
      guitar: shape("Cadd9", [null, 3, 2, 0, 3, 3]),
    },
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Lots of acoustic songs strum Cadd9 and G with open strings ringing, never resolving the D. Which idea is that closest to?", options: ["Pandiatonicism", "Twelve-tone music", "Counterpoint"], answer: "Pandiatonicism", miss: "Diatonic notes ringing freely, no resolution: pandiatonic" },
    ),
  ],

  "32.3": [
    story(
      card("Chords don't have to be built in 3rds. Stack 4ths and you get quartal harmony: open and modern.", "D G", "C F", "quartal", QUARTAL),
      card("Stack 5ths and you get quintal harmony, wide and hollow. Stack 2nds and you get a secundal cluster, crunchy and dense.", "C G D A", "C D E", "quintal · secundal", voiced(1, ["C3", "G3", "D4", "A4"], ["C4", "D4", "E4"])),
      card("Miles Davis's “So What” is famous for quartal chords: three 4ths with a 3rd on top, sliding in parallel.", "4ths", "+ 3rd", "So What", chord("E3", "A3", "D4", "G4", "B4")),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. How is this chord stacked?", options: STACKS, answer: "Quartal (4ths)", sound: QUARTAL, miss: "Open, airy and without a clear major or minor: 4ths" },
      { kind: "choice", prompt: "Listen. How is this chord stacked?", options: STACKS, answer: "Quintal (5ths)", sound: QUINTAL, miss: "Wide and hollow, like stacked power chords: 5ths" },
      { kind: "choice", prompt: "Listen. How is this chord stacked?", options: STACKS, answer: "Secundal (2nds)", sound: SECUNDAL, miss: "Notes packed a step apart: a cluster of 2nds" },
      { kind: "choice", prompt: "Listen. How is this chord stacked?", options: STACKS, answer: "Tertian (3rds)", sound: TERTIAN, miss: "That's a normal Cmaj7, stacked in 3rds" },
    ),
    {
      type: "tapBeat",
      bpm: 72,
      beatsPerBar: 4,
      bars: 2,
      title: "Play a quartal chord",
      hint: "x x 0 0 1 1: open D, open G, C (B string, fret 1), F (high e, fret 1). D, G, C, F: each a 4th above the last. Hands busy? Tap the button instead and it plays the guitar for you.",
      guitar: shape("D G C F", [null, null, 0, 0, 1, 1]),
    },
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 4, fret: 3, semitones: 7, label: "G, a 5th up for a quintal stack", hint: "C is the A string, fret 3. A 5th up is G: D string, fret 5. That's a power chord, the simplest quintal sound." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Guitar tuning is mostly 4ths (E A D G). Strum the open low four strings. What kind of chord is that?", options: ["Quartal", "Tertian", "Secundal"], answer: "Quartal", sound: chord("E2", "A2", "D3", "G3"), miss: "E, A, D, G are each a 4th apart: a quartal stack" },
    ),
  ],

  "32.4": [
    story(
      card("A polychord is two chords sounding at once, usually one low and one high.", "chord", "+ chord", "polychord", POLY),
      card("Stravinsky's “Petrushka” stacks C major and F♯ major, a tritone apart. That clash became known as the Petrushka chord.", "C", "F♯", "Petrushka", POLY),
      card("His “Rite of Spring” pounds out an E♭7 over an F♭ major triad, a half step apart, in its famous stamping rhythm.", "E♭7", "F♭", "Rite of Spring", chord("Fb2", "Ab2", "Cb3", "Eb4", "G4", "Bb4", "Db5")),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "What makes a polychord?", options: ["Two chords sounding at once", "One chord played twice", "A chord with a 9th"], answer: "Two chords sounding at once", miss: "Two whole chords stacked together" },
      { kind: "choice", prompt: "The Petrushka chord stacks C major with which chord?", options: ["F♯ major", "G major", "C minor"], answer: "F♯ major", sound: POLY, miss: "C and F♯ major, a tritone apart" },
    ),
    practice(
      "Find it on the guitar",
      { kind: "findNote", pitchClass: 6, prompt: "Find F♯, the root of the upper chord in the Petrushka chord.", hint: "Low E string fret 2, or high e string fret 2." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A chart says D/C. Is that a polychord?", options: ["No, it's one chord over a bass note", "Yes, two full chords"], answer: "No, it's one chord over a bass note", miss: "A slash chord is a chord over a bass note. A polychord stacks two full chords" },
    ),
  ],
};
