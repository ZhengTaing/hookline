import { parseNote } from "../music";
import { chordsSound } from "./mix-v2";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 8, seventh chords. One more 3rd on top of a triad, so the activities stack the 7th,
// tell the five kinds apart by their two halves (the triad and the 7th), find the 7th on the neck,
// and hear the smooth F/G "sus" sound pop songs use in place of V7.

const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const together = (...names: string[]): Sound => ({ kind: "chord", notes: midi(...names) });
const prog = (...symbols: string[]): Sound => chordsSound(symbols);
const voiced = (...chords: string[][]): Sound => ({ kind: "progression", gap: 1.1, chords: chords.map((c) => midi(...c)) });
const chordCard = (text: string, staff: string[], sound: Sound = together(...staff)): StoryCard => ({ text, staff, chord: true, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

const SEVENTHS = ["Major 7", "Dominant 7", "Minor 7", "Half-diminished 7", "Diminished 7"];

const nameSeventh = (notes: string[], answer: string, why: string, options = SEVENTHS): RushQuestion => ({
  kind: "choice",
  prompt: "What kind of seventh chord is this?",
  options,
  answer,
  visual: { type: "staff", notes, chord: true },
  sound: together(...notes),
  miss: why,
});

export const CHAPTER_8: Record<string, Step[]> = {
  "8.1": [
    story(
      chordCard("A seventh chord stacks one more 3rd on top of a triad. The new note is a 7th above the root: C E G plus B makes Cmaj7.", ["C4", "E4", "G4", "B4"]),
      chordCard("Major 7 (Cmaj7): a major triad with a major 7th. It sounds soft and dreamy.", ["C4", "E4", "G4", "B4"]),
      chordCard("Dominant 7 (C7): a major triad with a minor 7th. It's bluesy and restless, and it wants to resolve.", ["C4", "E4", "G4", "Bb4"]),
      chordCard("Minor 7 (Cm7): a minor triad with a minor 7th. Smooth and mellow.", ["C4", "Eb4", "G4", "Bb4"]),
      chordCard("Half-diminished 7 (Cø7): a diminished triad with a minor 7th. Diminished 7 (C°7): a diminished triad with a diminished 7th, all minor 3rds.", ["C4", "Eb4", "Gb4", "Bb4"], voiced(["C4", "Eb4", "Gb4", "Bb4"], ["C4", "Eb4", "Gb4", "A4"])),
    ),
    practice(
      "Stack it",
      {
        kind: "order",
        prompt: "Build G7 (dominant 7). Fill in the 3rd, 5th and 7th.",
        given: ["G", null, null, null],
        answer: ["G", "B", "D", "F"],
        tiles: ["B", "B♭", "D", "F", "F♯"],
        labels: ["root", "3rd", "5th", "7th"],
        sound: together("G3", "B3", "D4", "F4"),
        miss: "G7 is a G major triad (G B D) plus a minor 7th (F)",
      },
      {
        kind: "order",
        prompt: "Build Am7 (minor 7). Fill in the 3rd, 5th and 7th.",
        given: ["A", null, null, null],
        answer: ["A", "C", "E", "G"],
        tiles: ["C", "C♯", "E", "G", "G♯"],
        labels: ["root", "3rd", "5th", "7th"],
        sound: together("A3", "C4", "E4", "G4"),
        miss: "Am7 is an A minor triad (A C E) plus a minor 7th (G)",
      },
    ),
    practice(
      "Name it on the staff",
      nameSeventh(["F4", "A4", "C5", "E5"], "Major 7", "Major triad (F A C) and a major 7th (E): Fmaj7"),
      nameSeventh(["G4", "B4", "D5", "F5"], "Dominant 7", "Major triad (G B D) and a minor 7th (F): G7"),
      nameSeventh(["D4", "F4", "A4", "C5"], "Minor 7", "Minor triad (D F A) and a minor 7th (C): Dm7"),
      nameSeventh(["B3", "D4", "F4", "A4"], "Half-diminished 7", "Diminished triad (B D F) and a minor 7th (A): Bø7"),
    ),
    practice(
      "Find the 7th on the guitar",
      { kind: "fretInterval", string: 5, fret: 3, semitones: 10, label: "minor 7th (the 7th of G7)", hint: "The 7th of G7 is F: two strings up from the root at the same fret: D string, fret 3." },
      { kind: "fretInterval", string: 4, fret: 3, semitones: 11, label: "major 7th (the 7th of Cmaj7)", hint: "The major 7th is a half step below the octave: one fret below C. Try the G string, fret 4." },
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Dreamy major 7, or bluesy dominant 7?", options: ["Major 7", "Dominant 7"], answer: "Major 7", sound: together("C4", "E4", "G4", "B4"), miss: "Soft and dreamy, with the 7th a half step under the octave: major 7" },
      { kind: "choice", prompt: "Listen. Dreamy major 7, or bluesy dominant 7?", options: ["Major 7", "Dominant 7"], answer: "Dominant 7", sound: together("C4", "E4", "G4", "Bb4"), miss: "Restless and bluesy: dominant 7" },
    ),
    practice("Use it in real songs", {
      kind: "choice",
      prompt: "Blues songs like “Sweet Home Chicago” play every chord as a dominant 7: A7, D7, E7. Which note turns A into A7?",
      options: ["G", "G♯", "F♯"],
      answer: "G",
      visual: { type: "big", text: "A7  D7  E7" },
      sound: prog("A7", "D7", "A7", "E7"),
      miss: "A7 adds a minor 7th above A: G. G♯ would make Amaj7",
    }),
  ],

  "8.2": [
    story(
      chordCard("Pop songs often swap V7 for a softer chord: IV with scale degree 5 in the bass. In C major that's F/G, an F chord over a G bass.", ["G3", "F4", "A4", "C5"]),
      chordCard("F/G keeps G7's G and F but leaves out B, the leading tone, so it sounds smooth and open instead of tense.", ["G3", "F4", "B4", "D5"], voiced(["G2", "F3", "B3", "D4"], ["C3", "E3", "G3", "C4"])),
      chordCard("It works like a dominant: it still leads home to I. Players often call it G11 or Gsus.", ["G3", "F4", "A4", "C5"], voiced(["G2", "F3", "A3", "C4"], ["C3", "E3", "G3", "C4"])),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "In C major, what's the IV/5 chord?", options: ["F/G", "G/F", "C/G"], answer: "F/G", visual: { type: "big", text: "IV/5 in C" }, sound: voiced(["G2", "F3", "A3", "C4"], ["C3", "E3", "G3", "C4"]), miss: "IV is F, and scale degree 5 is G: F over G, written F/G" },
      { kind: "choice", prompt: "In G major, what's the IV/5 chord?", options: ["C/D", "D/C", "G/D"], answer: "C/D", visual: { type: "big", text: "IV/5 in G" }, sound: voiced(["D3", "C4", "E4", "G4"], ["G2", "B3", "D4", "G4"]), miss: "IV in G is C and degree 5 is D: C/D" },
      { kind: "choice", prompt: "Which chord does IV/5 replace?", options: ["V7", "vi", "ii"], answer: "V7", miss: "IV/5 leads home to I just like V7, with a softer sound" },
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen to two endings. Which one uses the softer F/G?", options: ["First", "Second"], answer: "Second", sound: voiced(["G2", "F3", "B3", "D4"], ["C3", "E3", "G3", "C4"], ["G2", "F3", "A3", "C4"], ["C3", "E3", "G3", "C4"]), miss: "The first had G7's tense B. The second floated in on F/G" },
    ),
    practice(
      "On the guitar",
      { kind: "choice", prompt: "To play F/G, you hold an F chord shape and play which bass note?", options: ["G on the low E string, fret 3", "F on the low E string, fret 1", "C on the A string, fret 3"], answer: "G on the low E string, fret 3", visual: { type: "fretboard", marks: [{ string: 5, fret: 3 }, { string: 3, fret: 3 }, { string: 2, fret: 2 }, { string: 1, fret: 1 }, { string: 0, fret: 1 }] }, sound: voiced(["G2", "F3", "A3", "C4", "F4"]), miss: "The note after the slash is the bass: G, low E string fret 3" },
    ),
    practice("Use it in real songs", {
      kind: "choice",
      prompt: "Slash chords like F/G are all over the Doobie Brothers' “What a Fool Believes”, so many players call them “the Michael McDonald chord”. In F/G, which note is in the bass?",
      options: ["F", "G", "A"],
      answer: "G",
      visual: { type: "big", text: "F/G → C" },
      sound: voiced(["G2", "F3", "A3", "C4"], ["C3", "E3", "G3", "C4"]),
      miss: "The note after the slash is the bass: G, under an F chord",
    }),
  ],

  "8.3": [
    story(
      chordCard("Stack 7ths on every note of the major scale and you get the key's diatonic seventh chords.", ["C4", "E4", "G4", "B4"]),
      chordCard("In major: Imaj7, ii7, iii7, IVmaj7, V7, vi7, viiø7. In C: Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, Bø7.", ["G4", "B4", "D5", "F5"], prog("Cmaj7", "Dm7", "Em7", "Fmaj7", "G7", "Am7", "Bø7")),
      chordCard("Uppercase with maj7 is a major 7. Uppercase with just 7 is a dominant 7. Lowercase with 7 is a minor 7. ø7 is half-diminished.", ["D4", "F4", "A4", "C5"]),
      chordCard("Only one chord in a major key is a dominant 7: V7. That's why it's the strongest pull home.", ["G3", "B3", "D4", "F4"], prog("G7", "Cmaj7")),
    ),
    practice("Put it in order", {
      kind: "order",
      layout: "list",
      prompt: "Name the seventh chord on each degree of C major.",
      given: ["Cmaj7", null, "Em7", null, null, "Am7", "Bø7"],
      answer: ["Cmaj7", "Dm7", "Em7", "Fmaj7", "G7", "Am7", "Bø7"],
      tiles: ["D7", "Dm7", "F7", "Fmaj7", "G7", "Gmaj7"],
      labels: ["Imaj7", "ii7", "iii7", "IVmaj7", "V7", "vi7", "viiø7"],
      sound: prog("Cmaj7", "Dm7", "Em7", "Fmaj7", "G7", "Am7", "Bø7"),
      miss: "Cmaj7 Dm7 Em7 Fmaj7 G7 Am7 Bø7",
    }),
    practice(
      "Name it",
      { kind: "choice", prompt: "In G major, which numeral is D7?", options: ["V7", "Vmaj7", "IV7"], answer: "V7", visual: { type: "big", text: "D7 in G" }, sound: prog("D7", "Gmaj7"), miss: "D is the 5th note of G major, and the V chord is the dominant 7: V7" },
      { kind: "choice", prompt: "In C major, which numeral is Dm7?", options: ["ii7", "IImaj7", "iiø7"], answer: "ii7", visual: { type: "big", text: "Dm7 in C" }, sound: prog("Dm7", "G7", "Cmaj7"), miss: "D is degree 2, and it's a minor 7: lowercase ii7" },
    ),
    {
      type: "realSong",
      song: "Fly Me to the Moon",
      artist: "Frank Sinatra",
      key: "C major",
      chords: ["Am7", "Dm7", "G7", "Cmaj7"],
      answer: ["vi7", "ii7", "V7", "Imaj7"],
      options: ["Imaj7", "ii7", "iii7", "IVmaj7", "V7", "vi7"],
      sound: chordsSound(["Am7", "Dm7", "G7", "Cmaj7"]),
    },
  ],
};
