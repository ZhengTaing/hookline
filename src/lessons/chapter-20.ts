import { parseNote } from "../music";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 20, the Neapolitan: a major chord on ♭2, usually in first inversion, used before V for a
// dark, dramatic pull. The lessons hear it against the plain ii°, find ♭2 and the N6 bass note on
// the neck, follow ♭2 down to the leading tone, and meet it in Beethoven and film scores.

const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const voiced = (...chords: string[][]): Sound => ({ kind: "progression", gap: 0.9, chords: chords.map((c) => midi(...c)) });
const tune = (notes: string[], gap = 0.45): Sound => ({ kind: "melodic", notes: midi(...notes), gap });
const card = (text: string, left: string, right: string, label: string, sound: Sound): StoryCard => ({ text, left, right, label, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

// A minor: i, N6 (B♭/D), V, i.
const I = ["A2", "C3", "E3", "A3"];
const N6 = ["D3", "F3", "Bb3", "D4"];
const V = ["E2", "G#3", "B3", "E4"];
const IIDIM = ["D3", "F3", "B3", "D4"];
const NEAP = voiced(I, N6, V, I);

export const CHAPTER_20: Record<string, Step[]> = {
  "20.1": [
    story(
      card("The Neapolitan is a major chord built on ♭2, the lowered 2nd note of the key. In A minor that's B♭ major (B♭ D F).", "A minor", "B♭", "♭II", voiced(I, ["Bb2", "D3", "F3"], V, I)),
      card("It's labeled N and is usually in first inversion (N6), with the 3rd in the bass. In A minor: B♭/D.", "N6", "B♭/D", "first inversion", NEAP),
      card("It's a pre-dominant: it comes before V, mostly in minor keys. It sounds darker and more dramatic than ii°.", "N6", "V", "before V", NEAP),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen to two versions of i, pre-dominant, V, i. Which one uses the Neapolitan?", options: ["First", "Second"], answer: "Second", sound: voiced(I, IIDIM, V, I, I, N6, V, I), miss: "The second used B♭ instead of B: the Neapolitan's dark ♭2" },
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Lay out a cadence with a Neapolitan in A minor.",
      given: ["i", null, null, "i"],
      answer: ["i", "N6", "V", "i"],
      tiles: ["V", "N6", "IV", "vi"],
      sound: NEAP,
      miss: "i, N6, V, i: the Neapolitan comes before V",
    }),
    practice(
      "Find it on the guitar",
      { kind: "findNote", pitchClass: 10, prompt: "Find B♭, the root of the Neapolitan in A minor.", hint: "One fret above A: A string, fret 1 (or low E, fret 6)." },
      { kind: "findNote", pitchClass: 2, prompt: "Find D, the bass note of N6 (B♭/D) in A minor.", hint: "Open D string, or A string, fret 5." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Beethoven's 7th Symphony and his “Moonlight” Sonata both use a major chord on ♭2 before V. What is it called?", options: ["Neapolitan", "Picardy third", "Secondary dominant"], answer: "Neapolitan", miss: "A major chord on ♭2 before V: the Neapolitan" },
    ),
  ],

  "20.2": [
    story(
      card("Composers save the Neapolitan for intense moments. Beethoven's “Moonlight” Sonata uses one early on, in C♯ minor (the chord is D major).", "C♯ minor", "D", "Moonlight", voiced(["C#3", "E3", "G#3"], ["F#2", "A3", "D4"], ["G#2", "C4", "D#4"], ["C#3", "E3", "G#3"])),
      card("Its ♭2 usually falls down to the leading tone, then up to the tonic: B♭, G♯, A in A minor.", "♭2", "7 → 1", "the melody", tune(["Bb4", "G#4", "A4"])),
      card("Film composers love it for heroic or ominous moments: “Raiders March”, Star Trek's end credits and Batman v Superman all use it.", "N", "V", "film scores", NEAP),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen to this melody in A minor: B♭, G♯, A. Where does ♭2 go first?", options: ["Down to the leading tone G♯", "Up to B"], answer: "Down to the leading tone G♯", sound: tune(["Bb4", "G#4", "A4"]), miss: "B♭ dropped to G♯, then resolved up to A" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 2, fret: 1, semitones: 1, label: "A, after ♭2 (B♭) falls to G♯", hint: "G♯ is G string, fret 1. The tonic A is one fret up: fret 2." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A film scene turns dark: the chords go Am, B♭, E, Am. What's the B♭?", options: ["Neapolitan", "♭VII", "V/V"], answer: "Neapolitan", sound: voiced(I, ["D3", "F3", "Bb3"], V, I), miss: "B♭ is ♭2 in A minor, before V: the Neapolitan" },
    ),
  ],
};
