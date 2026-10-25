import { parseNote } from "../music";
import { chordsSound } from "./mix-v2";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 24, binary and ternary forms: two-part and three-part plans. Form is about sections and
// where they cadence, so the lessons lay out sections in order, hear whether a section ends home or
// away, tell the binary types apart by their endings and returns, and map tunes you know.

const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const tune = (notes: string[], gap = 0.32): Sound => ({ kind: "melodic", notes: midi(...notes), gap });
const prog = (...symbols: string[]): Sound => chordsSound(symbols);
const card = (text: string, left: string, right: string, label: string, sound: Sound): StoryCard => ({ text, left, right, label, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

const BINARY = ["Balanced binary", "Rounded binary", "Simple binary", "Ternary"];
const TWINKLE_A = ["C4", "C4", "G4", "G4", "A4", "A4", "G4", "F4", "F4", "E4", "E4", "D4", "D4", "C4"];
const TWINKLE_B = ["G4", "G4", "F4", "F4", "E4", "E4", "D4", "G4", "G4", "F4", "F4", "E4", "E4", "D4"];

export const CHAPTER_24: Record<string, Step[]> = {
  "24.1": [
    story(
      card("Binary form has two parts, A and B, and each is usually repeated: ||: A :||: B :||.", "A", "B", "binary", prog("C", "G", "D7", "G", "G", "D7", "G7", "C")),
      card("Ternary form has three parts: A, a contrasting B, then A again.", "A B", "A", "ternary", prog("C", "G", "C", "Am", "E", "Am", "C", "G", "C")),
      card("This chapter shows the kinds of binary form and how to tell a rounded binary from a ternary.", "AB", "ABA", "two plans", prog("C", "G", "C")),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "How many main parts does binary form have?", options: ["2", "3", "4"], answer: "2", miss: "Binary: two parts, A and B" },
      { kind: "choice", prompt: "Which form is A, B, A?", options: ["Ternary", "Binary"], answer: "Ternary", miss: "Three parts with A returning: ternary" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "“Twinkle Twinkle Little Star” goes: opening tune, a new middle (“Up above the world so high…”), then the opening tune again. Which plan is that?", options: ["A B A", "A B", "A A B B"], answer: "A B A", sound: tune([...TWINKLE_A, ...TWINKLE_B, ...TWINKLE_A], 0.24), miss: "Tune, new middle, tune again: A B A" },
    ),
  ],

  "24.2": [
    story(
      card("Look at where the A section ends. If it ends on the tonic (home), the form is sectional: A could stand on its own.", "A ends", "on I", "sectional", prog("C", "F", "G", "C")),
      card("If A ends somewhere else, like V or a new key, the form is continuous: A needs B to finish the thought.", "A ends", "on V", "continuous", prog("C", "F", "D7", "G")),
      card("Haydn's “Surprise” Symphony, movement II, is a famous example with clear, short sections.", "A", "B", "Haydn", tune(["C4", "C4", "E4", "E4", "G4", "G4", "E4"], 0.4)),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen to the end of this A section. Sectional (ends home) or continuous (ends away)?", options: ["Sectional", "Continuous"], answer: "Continuous", sound: prog("C", "Am", "D7", "G"), miss: "It ended on G, away from home: continuous" },
      { kind: "choice", prompt: "Listen. Sectional or continuous?", options: ["Sectional", "Continuous"], answer: "Sectional", sound: prog("C", "F", "G7", "C"), miss: "It closed on C, home: sectional" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "In “Twinkle Twinkle”, the first section ends “…what you are” on C, the tonic. Is the form sectional or continuous?", options: ["Sectional", "Continuous"], answer: "Sectional", sound: tune(TWINKLE_A, 0.26), miss: "The A section closes on the tonic: sectional" },
    ),
  ],

  "24.3": [
    story(
      card("In balanced binary, A ends in a new key (often V), and B ends with essentially the same cadence, moved back home.", "A ends in G", "B ends in C", "matching endings", prog("C", "D7", "G", "G", "G7", "C")),
      card("The endings “rhyme”: the last bars of A and B match, just in different keys.", "end of A", "end of B", "a rhyme", tune(["A4", "B4", "C5", "B4", "A4", "G4", "D4", "E4", "F4", "E4", "D4", "C4"], 0.28)),
      card("Bach's dance movements, like the French Suite No. 6 Courante, often work this way.", "Bach", "dance", "Baroque", prog("E", "B7", "E", "B", "F#7", "B")),
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Fill in the keys of a balanced binary in C.",
      given: ["C", null, null, "C"],
      answer: ["C", "G", "G", "C"],
      tiles: ["G", "G", "F", "Am"],
      labels: ["A starts", "A ends", "B starts", "B ends"],
      miss: "A goes from C to G. B goes from G back to C, with the same ending",
    }),
    practice(
      "Name it",
      { kind: "choice", prompt: "What makes binary form “balanced”?", options: ["A and B end with the same cadence material", "B brings back A's opening", "It has three parts"], answer: "A and B end with the same cadence material", miss: "Matching endings, A in the new key and B at home: balanced" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A Bach dance in E has A ending in B major with a certain flourish, and B ends in E with the same flourish. Which binary type?", options: BINARY.slice(0, 3), answer: "Balanced binary", miss: "Same ending material in both halves: balanced binary" },
    ),
  ],

  "24.4": [
    story(
      card("In rounded binary, the B section brings back A's opening before the end. It's “rounded off” by the return.", "B …", "A's opening", "the return", prog("C", "G", "D7", "G", "G7", "C", "F", "G", "C")),
      card("When both halves repeat (||: A :||: B + A′ :||), it's called a two-reprise form. Mozart and Schubert minuets love it.", "||: A :||", "||: B A′ :||", "two reprises", prog("F", "C7", "F", "C", "C7", "F")),
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Lay out a rounded binary (each half repeated).",
      given: ["A", "A", null, null, null, null],
      answer: ["A", "A", "B", "A′", "B", "A′"],
      tiles: ["A′", "A′", "B", "B", "C"],
      labels: ["A", "repeat", "B", "return", "B", "return"],
      miss: "||: A :||: B A′ :|| written out: A A B A′ B A′",
    }),
    practice(
      "Name it",
      { kind: "choice", prompt: "What makes a binary form “rounded”?", options: ["A's opening returns in B", "The endings match", "It ends in a new key"], answer: "A's opening returns in B", miss: "The return of A's opening rounds it off" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 4, fret: 3, semitones: 7, label: "G, the key A section usually travels to", hint: "From C (A string, fret 3), up a perfect 5th to G: D string, fret 5. Then B brings it home to C." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A Mozart minuet: ||: A :||: new material, then A's opening again :||. Which form?", options: BINARY.slice(0, 3), answer: "Rounded binary", miss: "A's opening comes back inside the second half: rounded binary" },
    ),
  ],

  "24.5": [
    story(
      card("Simple binary has two parts but no special features: the endings don't match and A doesn't come back.", "A", "B", "simple", prog("D", "A", "D", "A", "E7", "A", "D", "A7", "D")),
      card("It's common in Baroque music: short dance pieces in two repeated halves.", "||: A :||", "||: B :||", "Baroque", prog("G", "D", "G")),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Two halves, different endings, and no return of A. Which type?", options: BINARY.slice(0, 3), answer: "Simple binary", miss: "No rhyme and no return: simple binary" },
      { kind: "choice", prompt: "Two halves, and A's opening returns near the end. Which type?", options: BINARY.slice(0, 3), answer: "Rounded binary", miss: "A's return makes it rounded" },
      { kind: "choice", prompt: "Two halves that end with the same cadence, A in V and B at home. Which type?", options: BINARY.slice(0, 3), answer: "Balanced binary", miss: "Matching endings make it balanced" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A Baroque minuet has two repeated halves with no return of the opening and different endings. Which type?", options: BINARY.slice(0, 3), answer: "Simple binary", miss: "Neither balanced nor rounded: simple binary" },
    ),
  ],

  "24.6": [
    story(
      card("The binary principle: the first section moves away from the tonic, and the second section comes back to it.", "away", "home", "the principle", prog("C", "D7", "G", "G7", "C")),
      card("That journey, out and back, is what holds a binary piece together, whatever the melodies do.", "C → G", "G → C", "out and back", prog("C", "Am", "D7", "G", "D7", "G", "G7", "C")),
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Map the binary principle in C.",
      given: [null, null, null],
      answer: ["Start home (C)", "Move away (G)", "Return home (C)"],
      tiles: ["Return home (C)", "Start home (C)", "Move away (G)"],
      labels: ["A begins", "A ends", "B ends"],
      layout: "list",
      miss: "Start home, move away by the end of A, return home by the end of B",
    }),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen to this first section. Does it move away from home?", options: ["Yes, it ends on G", "No, it ends on C"], answer: "Yes, it ends on G", sound: prog("C", "Am", "D7", "G"), miss: "It traveled to G: away from home, ready for the second half" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A song's verse moves to V and its chorus brings it back to I. That's the same idea as…", options: ["The binary principle", "A Picardy third", "An elision"], answer: "The binary principle", miss: "Away, then home: the binary principle" },
    ),
  ],

  "24.7": [
    story(
      card("Ternary form is A B A: a statement, a contrasting digression, then a full restatement of A.", "A", "B", "statement", prog("C", "G", "C")),
      card("A is usually complete and closed on its own. B contrasts in key, mood or texture.", "closed A", "new B", "contrast", prog("Am", "E", "Am")),
      card("Rachmaninov's famous Prelude in C♯ minor is ternary: a heavy, slow A, a stormy fast B, and a huge return of A.", "slow", "stormy", "Rachmaninov", prog("C#m", "G#", "C#m")),
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Lay out ternary form.",
      given: [null, null, null],
      answer: ["A", "B", "A"],
      tiles: ["A", "A", "B", "C"],
      labels: ["statement", "digression", "restatement"],
      miss: "A, B, A",
    }),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen: a tune, something new, then the tune again. Which form?", options: ["Ternary (A B A)", "Binary (A B)"], answer: "Ternary (A B A)", sound: tune([...TWINKLE_A, ...TWINKLE_B, ...TWINKLE_A], 0.22), miss: "The full tune came back after the middle: A B A" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Rachmaninov's Prelude in C♯ minor: slow and heavy, then fast and stormy, then the slow music returns, louder. Which form?", options: ["Ternary", "Simple binary", "Balanced binary"], answer: "Ternary", miss: "Statement, contrasting digression, restatement: ternary" },
    ),
  ],

  "24.8": [
    story(
      card("Rounded binary and ternary both bring A back. To tell them apart, look at proportion and closure.", "rounded binary", "ternary", "close cousins", prog("C", "G", "C")),
      card("Ternary: A is complete and closed on its own, and B is a big, independent middle.", "closed A", "big B", "ternary", prog("C", "G", "C", "Am", "E", "Am", "C", "G", "C")),
      card("Rounded binary: A often ends away from home, and B is short, leading quickly back to A's opening.", "open A", "short B", "rounded binary", prog("C", "G", "D7", "G", "C")),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "A ends on V, the middle is just four bars, then A returns. Rounded binary or ternary?", options: ["Rounded binary", "Ternary"], answer: "Rounded binary", miss: "Open A and a short middle point to rounded binary" },
      { kind: "choice", prompt: "A ends on I, the middle is long and in a new key, then A returns complete. Rounded binary or ternary?", options: ["Rounded binary", "Ternary"], answer: "Ternary", miss: "A closed A and a big, independent middle point to ternary" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A pop song has a closed verse–chorus section, a long bridge in a new key, then the whole verse–chorus again. Closer to rounded binary or ternary?", options: ["Ternary", "Rounded binary"], answer: "Ternary", miss: "Closed A, big contrasting middle, complete return: ternary" },
    ),
  ],
};
