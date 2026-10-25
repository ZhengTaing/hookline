import { parseNote } from "../music";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 27, voice leading seventh chords: the 7th falls, the leading tone rises. The lessons hear
// those two moves, find them on the fretboard inside a G7 shape, chain sevenths around the circle,
// and pick which seventh chords are worth reaching for.

const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const voiced = (gap: number, ...chords: string[][]): Sound => ({ kind: "progression", gap, chords: chords.map((c) => midi(...c)) });
const tune = (notes: string[], gap = 0.5): Sound => ({ kind: "melodic", notes: midi(...notes), gap });
const card = (text: string, left: string, right: string, label: string, sound: Sound): StoryCard => ({ text, left, right, label, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

const G7_C = voiced(0.9, ["G2", "F3", "B3", "D4"], ["C3", "E3", "C4", "C4"]);
const G7_C_FULL = voiced(0.9, ["G2", "D3", "F3", "B3"], ["C3", "C3", "E3", "C4"]);
const VII7 = voiced(0.9, ["B2", "D3", "F3", "Ab3"], ["C3", "C3", "E3", "G3"]);
// Root-position sevenths around the circle: Am7 Dm7 G7 Cmaj7.
const CHAIN = voiced(0.9, ["A2", "G3", "C4", "E4"], ["D3", "F3", "C4"], ["G2", "F3", "B3", "D4"], ["C3", "E3", "B3"]);
const G7 = { name: "G7", marks: [{ string: 5, fret: 3 }, { string: 4, fret: 2 }, { string: 3, fret: 0 }, { string: 2, fret: 0 }, { string: 1, fret: 0 }, { string: 0, fret: 1 }] };

export const CHAPTER_27: Record<string, Step[]> = {
  "27.1": [
    story(
      card("Seventh chords have one big rule: the chord's 7th resolves down by step.", "7th", "↓ step", "the rule", G7_C),
      card("In G7 (G B D F), the 7th is F. It falls to E, the 3rd of C.", "F", "E", "G7 → C", tune(["F4", "E4"])),
      card("The other voices move to the nearest note of the next chord. Beethoven's “Pathétique” slow movement is full of these smooth resolutions.", "nearest", "notes", "the rest", G7_C),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Which way does a chord's 7th resolve?", options: ["Down by step", "Up by step", "Down by leap"], answer: "Down by step", miss: "The 7th falls one step" },
      { kind: "choice", prompt: "In G7 going to C, where does F go?", options: ["E", "G", "F♯"], answer: "E", sound: tune(["F4", "E4"]), miss: "F is the 7th of G7, so it steps down to E" },
    ),
    {
      type: "tapBeat",
      bpm: 72,
      beatsPerBar: 4,
      bars: 2,
      title: "Strum G7 and find its 7th",
      hint: "Hold G7: 3 2 0 0 0 1. The F on the high e string (fret 1) is the 7th. When you change to C, it drops to open E. Hands busy? Tap the button instead and it plays the guitar for you.",
      guitar: G7,
    },
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "On guitar, going from open G7 to open C, the high e string goes from fret 1 (F) to open (E). Which rule is that?", options: ["The 7th resolves down", "The leading tone rises", "Parallel 5ths"], answer: "The 7th resolves down", sound: G7_C, miss: "F, the 7th of G7, falls to E" },
    ),
  ],

  "27.2": [
    story(
      card("Chains of seventh chords around the circle of 5ths (Am7, Dm7, G7, Cmaj7) sound lush. Jazz and Baroque music both love them.", "Am7 Dm7", "G7 Cmaj7", "the chain", CHAIN),
      card("To keep four voices smooth, alternate complete chords with incomplete ones that leave out the 5th.", "complete", "no 5th", "alternate", CHAIN),
      card("Each 7th still falls by step into the next chord, so the chain keeps sliding down.", "7th ↓", "7th ↓", "the slide", CHAIN),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "In a chain of root-position sevenths, which note do incomplete chords leave out?", options: ["The 5th", "The root", "The 7th"], answer: "The 5th", miss: "Dropping the 5th keeps every voice moving smoothly" },
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Chain seventh chords around the circle of 5ths in C.",
      given: ["Am7", null, null, "Cmaj7"],
      answer: ["Am7", "Dm7", "G7", "Cmaj7"],
      tiles: ["G7", "Dm7", "Em7", "F7"],
      sound: CHAIN,
      miss: "Each root is a 5th below the last: A, D, G, C",
    }),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Jazz standards are full of ii7–V7–Imaj7 (Dm7, G7, Cmaj7 in C). How are their roots related?", options: ["Each down a 5th", "Each up a step", "Each down a 3rd"], answer: "Each down a 5th", sound: voiced(0.9, ["D3", "F3", "C4"], ["G2", "F3", "B3", "D4"], ["C3", "E3", "B3"]), miss: "D, G, C: each a 5th below the last, around the circle" },
    ),
  ],

  "27.3": [
    story(
      card("In V7 to I, two tendency tones move: the leading tone (B) rises to C, and the 7th (F) falls to E.", "B → C", "F → E", "two moves", G7_C_FULL),
      card("If V7 is complete (all four notes), the I chord often ends up incomplete, with a tripled root and no 5th. That's normal.", "complete V7", "C C E C", "tripled root", G7_C_FULL),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen to this top line over G7 to C. Is it the leading tone rising or the 7th falling?", options: ["Leading tone rising (B → C)", "7th falling (F → E)"], answer: "Leading tone rising (B → C)", sound: tune(["B4", "C5"]), miss: "It went up a half step, B to C: the leading tone" },
      { kind: "choice", prompt: "Listen. Leading tone rising or 7th falling?", options: ["Leading tone rising (B → C)", "7th falling (F → E)"], answer: "7th falling (F → E)", sound: tune(["F4", "E4"]), miss: "It went down a half step, F to E: the 7th" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 2, fret: 4, semitones: 1, label: "C, where the leading tone B goes", hint: "B is G string, fret 4. The leading tone rises one fret to C: fret 5." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A complete G7 resolves to C with three Cs and an E, no G. Is that a mistake?", options: ["No, it's normal", "Yes, always include the 5th"], answer: "No, it's normal", miss: "After a complete V7, an incomplete I with a tripled root is standard" },
    ),
  ],

  "27.4": [
    story(
      card("vii°7 (B D F A♭ in C) resolves to I with every voice moving by step: B up to C, D to C or E, F down to E, A♭ down to G.", "B D F A♭", "→ C", "all by step", VII7),
      card("Watch out: moving D and A♭ (a tritone) can create parallel 5ths if they turn into a perfect 5th on the way. Resolve carefully.", "careful", "no 5ths", "the trap", VII7),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "In vii°7 going to I in C, where does A♭ go?", options: ["Down to G", "Up to A", "Down to F"], answer: "Down to G", sound: tune(["Ab4", "G4"]), miss: "A♭ is the chord's 7th, so it falls by step to G" },
      { kind: "choice", prompt: "How do the voices of vii°7 move into I?", options: ["All by step", "All by leap", "They stay still"], answer: "All by step", miss: "Every voice of vii°7 resolves by step" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 0, fret: 3, semitones: 1, label: "A♭, the 7th of B°7, one fret above G", hint: "G is high e, fret 3. A♭ is one fret up, fret 4. In the chord it falls back down to G." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Why does a diminished 7th resolve so smoothly into I?", options: ["Every note is a step away from a note of I", "It has no 7th", "It's the same chord as I"], answer: "Every note is a step away from a note of I", sound: VII7, miss: "Each of its four notes slides one step into the tonic chord" },
    ),
  ],

  "27.5": [
    story(
      card("When harmonizing a melody, the most useful seventh chords are V7, vii°7 and ii7.", "V7 ii7", "vii°7", "the useful three", voiced(0.9, ["D3", "F3", "A3", "C4"], ["G2", "F3", "B3", "D4"], ["C3", "E3", "G3", "C4"])),
      card("Sevenths on iii, vi, IV and I are less common in Classical style. Jazz and pop use them freely, as Cmaj7, Fmaj7, Am7.", "Classical", "jazz · pop", "it depends", voiced(0.9, ["C3", "E3", "G3", "B3"], ["F2", "A3", "C4", "E4"])),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Which seventh chord is most common when harmonizing in Classical style?", options: ["V7", "iii7", "IV7"], answer: "V7", miss: "V7 is by far the most common seventh chord" },
      { kind: "choice", prompt: "Which of these is a pre-dominant seventh chord?", options: ["ii7", "V7", "I7"], answer: "ii7", miss: "ii7 sets up V: a pre-dominant" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A pop ballad uses Cmaj7 and Fmaj7 everywhere. In Classical part writing, would those be common?", options: ["No, less common there", "Yes, the most common"], answer: "No, less common there", sound: voiced(0.9, ["C3", "E3", "G3", "B3"], ["F2", "A3", "C4", "E4"]), miss: "Major 7ths on I and IV are a jazz and pop sound. Classical style favors V7, vii°7 and ii7" },
    ),
  ],
};
