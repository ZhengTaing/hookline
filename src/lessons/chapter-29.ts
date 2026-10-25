import { parseNote } from "../music";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 29, voice leading chromatic chords: every chromatic note has somewhere to go. The lessons
// hear the temporary leading tone rise, the borrowed ♭6 fall, the Neapolitan's ♭2 drop to the
// leading tone and the augmented sixth spread out to the octave, then find each move on the neck.

const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const voiced = (gap: number, ...chords: string[][]): Sound => ({ kind: "progression", gap, chords: chords.map((c) => midi(...c)) });
const tune = (notes: string[], gap = 0.5): Sound => ({ kind: "melodic", notes: midi(...notes), gap });
const card = (text: string, left: string, right: string, label: string, sound: Sound): StoryCard => ({ text, left, right, label, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

// E7 → Am in C: V7/vi resolving, G♯ up to A, D down to C.
const E7_AM = voiced(0.9, ["E2", "D3", "G#3", "B3"], ["A2", "C3", "A3", "C4"]);
// F → Fm → C: the borrowed A♭ falls to G.
const IV_IV_I = voiced(0.9, ["F2", "C3", "A3", "F4"], ["F2", "C3", "Ab3", "F4"], ["C3", "C3", "G3", "E4"]);
const N6 = voiced(0.9, ["D3", "F3", "Bb3", "D4"], ["E2", "G#3", "B3", "E4"], ["A2", "A3", "C4", "E4"]);
const GER = voiced(0.9, ["Ab2", "C4", "Eb4", "F#4"], ["G2", "C4", "E4", "G4"], ["G2", "B3", "D4", "G4"]);
const IT = voiced(0.9, ["Ab2", "C4", "C4", "F#4"], ["G2", "B3", "D4", "G4"]);
const E7 = { name: "E7", marks: [{ string: 5, fret: 0 }, { string: 4, fret: 2 }, { string: 3, fret: 0 }, { string: 2, fret: 1 }, { string: 1, fret: 0 }, { string: 0, fret: 0 }] };
const TENDENCY = ["Rises a half step", "Falls a half step", "Stays put"];

export const CHAPTER_29: Record<string, Step[]> = {
  "29.1": [
    story(
      card("A secondary dominant is voice-led just like a real V. Its 3rd is a temporary leading tone, and it rises to the root of the chord it points to.", "V/vi", "→ vi", "treat it like V", E7_AM),
      card("In C, E7 points to Am. Its 3rd, G♯, rises to A. Its 7th, D, falls to C.", "G♯ → A", "D → C", "E7 → Am", tune(["G#4", "A4"])),
      card("Don't double that temporary leading tone, and don't let it leap away. It has a job to do.", "no doubling", "no leaping", "the rules", E7_AM),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "In E7 going to Am, where does G♯ go?", options: ["Up to A", "Down to G", "Up to B"], answer: "Up to A", sound: tune(["G#4", "A4"]), miss: "G♯ is the temporary leading tone, so it rises a half step to A" },
      { kind: "choice", prompt: "And where does D, the 7th of E7, go?", options: ["Down to C", "Up to E", "Down to B"], answer: "Down to C", sound: tune(["D4", "C4"]), miss: "A chord's 7th falls by step: D to C" },
    ),
    {
      type: "tapBeat",
      bpm: 72,
      beatsPerBar: 4,
      bars: 2,
      title: "Strum E7, then Am",
      hint: "Hold E7: 0 2 0 1 0 0. The G♯ on the G string (fret 1) is the temporary leading tone. Change to Am and it moves up to fret 2, A. Hands busy? Tap the button instead and it plays the guitar for you.",
      guitar: E7,
    },
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 2, fret: 1, semitones: 1, label: "A, where the leading tone (G♯, same fret as A♭) goes", hint: "G♯ is the G string, fret 1. Up one fret: A, fret 2." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Lots of songs in C go C, E7, Am. On the G string, the note moves from fret 1 to fret 2. Which rule is that?", options: ["The temporary leading tone rises", "The 7th falls", "Parallel 5ths"], answer: "The temporary leading tone rises", sound: E7_AM, miss: "G♯ is the leading tone of Am, so it rises to A" },
    ),
  ],

  "29.2": [
    story(
      card("Borrowed chords are voice-led just like the major-key chords they replace: Fm moves like F, A♭ major like Am.", "F", "Fm", "same moves", IV_IV_I),
      card("The one new rule: ♭6 (A♭ in C) is a tendency tone. It wants to fall a half step to 5, G.", "A♭", "→ G", "♭6 falls", tune(["Ab4", "G4"])),
      card("So don't double ♭6, and avoid moving it up. Let it sink.", "no doubling", "↓", "let it sink", IV_IV_I),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen to F, Fm, C. What does the borrowed A♭ do?", options: TENDENCY, answer: "Falls a half step", sound: IV_IV_I, miss: "A♭ is ♭6, and it sinks to G" },
      { kind: "choice", prompt: "Which note should you avoid doubling in a borrowed iv chord?", options: ["♭6 (A♭)", "The root (F)", "The 5th (C)"], answer: "♭6 (A♭)", miss: "Tendency tones aren't doubled, and ♭6 is one" },
    ),
    practice(
      "Find it on the guitar",
      { kind: "findNote", pitchClass: 8, prompt: "Find A♭, the borrowed ♭6 in C.", hint: "G string, fret 1. From there it falls one fret to open G." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Radiohead's “Creep” goes G, B, C, Cm. In Cm, the E♭ is the borrowed note. Where does it want to go when the song returns to G?", options: ["Down to D", "Up to E", "Up to F"], answer: "Down to D", sound: voiced(0.9, ["C3", "G3", "Eb4"], ["G2", "G3", "D4"]), miss: "E♭ is ♭6 of G, so it sinks a half step to D" },
    ),
  ],

  "29.3": [
    story(
      card("The Neapolitan sixth is a ♭II chord in first inversion. In A minor that's B♭ major over D.", "B♭/D", "N6", "the chord", N6),
      card("Double the bass, scale degree 4 (D). Then ♭2 (B♭) moves down to the leading tone (G♯) as the chord goes to V.", "B♭", "→ G♯", "♭2 falls", tune(["Bb4", "G#4"])),
      card("That B♭ to G♯ is a diminished 3rd, a striking sound. Some composers slip a i6/4 or vii°7/V in between to soften it.", "dim 3rd", "→ V → i", "the drop", N6),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Which note do you usually double in N6?", options: ["The bass (scale degree 4)", "♭2", "The leading tone"], answer: "The bass (scale degree 4)", miss: "N6 is a pre-dominant: double the bass, degree 4" },
      { kind: "choice", prompt: "In A minor, where does the Neapolitan's B♭ go when the chord moves to E?", options: ["Down to G♯", "Up to B", "Down to A"], answer: "Down to G♯", sound: tune(["Bb4", "G#4"]), miss: "♭2 drops to the leading tone, G♯" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 2, fret: 1, semitones: 2, label: "B♭, the Neapolitan note", hint: "G♯ is the G string, fret 1. B♭ is two frets up, fret 3. In the music it drops from fret 3 down to fret 1." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A film score in A minor goes Dm, B♭/D, E, Am. Which chord is the Neapolitan?", options: ["B♭/D", "Dm", "E"], answer: "B♭/D", sound: N6, miss: "B♭ is ♭II in A minor, here in first inversion" },
    ),
  ],

  "29.4": [
    story(
      card("Augmented sixth chords open out to an octave. ♯4 rises to 5, and ♭6 falls to 5.", "F♯ ↑", "A♭ ↓", "spread to G", IT),
      card("In C: F♯ goes up to G, A♭ goes down to G. Both notes are a half step from their goal.", "F♯ → G", "A♭ → G", "both half steps", tune(["F#4", "G4"])),
      card("The German sixth (A♭ C E♭ F♯) would make parallel 5ths going straight to V, so it often passes through I6/4 first.", "Ger+6", "I6/4 → V", "the detour", GER),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen to the top voice of this augmented sixth going to V. What does F♯ do?", options: TENDENCY, answer: "Rises a half step", sound: tune(["F#4", "G4"]), miss: "♯4 rises to 5: F♯ to G" },
      { kind: "choice", prompt: "And the bass, A♭?", options: TENDENCY, answer: "Falls a half step", sound: tune(["Ab3", "G3"]), miss: "♭6 falls to 5: A♭ to G" },
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Resolve a German sixth in C without parallel 5ths.",
      given: ["Ger+6", null, null],
      answer: ["Ger+6", "I6/4", "V"],
      tiles: ["V", "I6/4", "IV"],
      sound: GER,
      miss: "Ger+6 goes through I6/4, then to V",
    }),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 0, fret: 2, semitones: 1, label: "G, where ♯4 (F♯) goes", hint: "F♯ is the high e string, fret 2. Up one fret: G, fret 3." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Before the big final chord, a rock ballad in C plays A♭7 then G. The A♭ in the bass falls to G. Which rule does that follow?", options: ["♭6 falls to 5", "The leading tone rises", "The 7th rises"], answer: "♭6 falls to 5", sound: voiced(0.9, ["Ab2", "C4", "Eb4", "Gb4"], ["G2", "B3", "D4", "G4"]), miss: "A♭ is ♭6, and it falls to G, scale degree 5" },
    ),
  ],
};
