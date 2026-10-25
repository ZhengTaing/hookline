import { parseNote } from "../music";
import { chordsSound } from "./mix-v2";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 19, mode mixture: borrowing chords from the parallel minor. Rock and film music lean on
// these (iv, ♭VI, ♭VII), so the lessons hear major chords turn minor, label Creep's famous IV–iv,
// find the borrowed notes on the neck, and end on the "epic" ♭VI–♭VII–I and the Picardy third.

const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const voiced = (...chords: string[][]): Sound => ({ kind: "progression", gap: 0.9, chords: chords.map((c) => midi(...c)) });
const prog = (...symbols: string[]): Sound => chordsSound(symbols);
const card = (text: string, left: string, right: string, label: string, sound: Sound): StoryCard => ({ text, left, right, label, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

const BORROWED = ["iv", "♭VI", "♭VII", "♭III", "Not borrowed"];

/** In C major: which borrowed chord is this? */
const whichBorrowed = (chord: string, answer: string, why: string): RushQuestion => ({
  kind: "choice",
  prompt: `In C major, a song uses ${chord}. What is it?`,
  options: BORROWED,
  answer,
  visual: { type: "big", text: chord },
  sound: prog("C", chord.replace("♭", "b"), "C"),
  miss: why,
});

export const CHAPTER_19: Record<string, Step[]> = {
  "19.1": [
    story(
      card("Mode mixture means borrowing chords from the parallel minor while you're in a major key. C major borrows from C minor.", "C major", "C minor", "borrowing", prog("C", "F", "Fm", "C")),
      card("The most borrowed note is ♭6 (A♭ in C). It turns IV (F) into iv (Fm): a bittersweet sound.", "F", "Fm", "IV → iv", voiced(["F2", "A2", "C3"], ["F2", "Ab2", "C3"], ["C3", "E3", "G3"])),
      card("Next most common are ♭3 (E♭) and ♭7 (B♭). Rock, film scores and ballads borrow all the time.", "♭3", "♭7", "also", prog("C", "Bb", "F", "C")),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen: C, F, then a chord, then C. Was the third chord major F or borrowed Fm?", options: ["F (major)", "Fm (borrowed iv)"], answer: "Fm (borrowed iv)", sound: prog("C", "F", "Fm", "C"), miss: "It darkened to Fm: the borrowed iv" },
    ),
    practice(
      "Find it on the guitar",
      { kind: "findNote", pitchClass: 8, prompt: "Find A♭, the borrowed ♭6 in C major.", hint: "One fret below A: G string, fret 1 (or low E, fret 4)." },
    ),
    {
      type: "realSong",
      song: "Creep",
      artist: "Radiohead",
      key: "G major",
      chords: ["G", "B", "C", "Cm"],
      answer: ["I", "III", "IV", "iv"],
      options: ["I", "III", "IV", "iv", "V", "vi"],
      sound: prog("G", "B", "C", "Cm"),
    },
  ],

  "19.2": [
    story(
      card("A borrowed note can be any part of a chord. ♭6 (A♭ in C) is the root of ♭VI (A♭), the 3rd of iv (Fm), and the 5th of ii° (D°).", "A♭", "Fm, A♭, D°", "♭6 chords", prog("Ab", "Fm", "D°")),
      card("♭3 (E♭) gives ♭III (E♭ major). ♭7 (B♭) gives ♭VII (B♭ major).", "E♭", "B♭", "♭3 and ♭7", prog("C", "Eb", "Bb", "C")),
      card("A seventh chord can borrow too: iiø7 (D F A♭ C) is a soft, minor-sounding pre-dominant.", "Dm7", "Dø7", "iiø7", prog("Dm7", "Dø7", "G7", "C")),
    ),
    practice(
      "Name it",
      whichBorrowed("A♭", "♭VI", "A♭ is built on ♭6: ♭VI"),
      whichBorrowed("B♭", "♭VII", "B♭ is built on ♭7: ♭VII"),
      whichBorrowed("E♭", "♭III", "E♭ is built on ♭3: ♭III"),
      whichBorrowed("Fm", "iv", "F minor borrows A♭: iv"),
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Countless rock songs in D use C major. C isn't in D major. What is it?", options: ["♭VII", "♭VI", "iv"], answer: "♭VII", sound: prog("D", "C", "G", "D"), miss: "C is a whole step below D: ♭VII, borrowed from D minor" },
    ),
  ],

  "19.3": [
    story(
      card("Label a borrowed chord's root with ♭ when it's lowered: ♭III, ♭VI, ♭VII.", "♭VI", "♭VII", "flat roots", prog("Ab", "Bb", "C")),
      card("Use lowercase to show a borrowed minor or diminished quality: iv, ii°, iiø7. The root stays the same.", "IV → iv", "ii → ii°", "quality", prog("F", "Fm", "C")),
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "In C major, label each borrowed chord.",
      given: [null, null, null, null],
      answer: ["iv", "♭VI", "♭VII", "♭III"],
      tiles: ["♭VII", "♭III", "iv", "♭VI", "IV"],
      labels: ["Fm", "A♭", "B♭", "E♭"],
      miss: "Fm iv, A♭ ♭VI, B♭ ♭VII, E♭ ♭III",
    }),
    practice(
      "Name it",
      { kind: "choice", prompt: "In G major, which chord would be ♭VI?", options: ["E♭", "E", "Em"], answer: "E♭", sound: prog("G", "Eb", "G"), miss: "The 6th of G is E. Lowered, it's E♭: ♭VI" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "In “Creep” (G major), the C chord turns into Cm. How do you label Cm?", options: ["iv", "♭IV", "IV"], answer: "iv", sound: prog("C", "Cm"), miss: "Same root, minor quality: lowercase iv" },
    ),
  ],

  "19.4": [
    story(
      card("A deceptive cadence normally goes V to vi. Going V to ♭VI is even more of a surprise.", "G7", "A♭", "V → ♭VI", voiced(["G2", "B2", "D3", "F3"], ["Ab2", "C3", "Eb3"])),
      card("♭VI, ♭VII, I is the “epic” ending: big, heroic, a bit clichéd. Hear it at the end of many stadium anthem performances.", "A♭ B♭", "C", "epic ending", voiced(["Ab2", "C3", "Eb3"], ["Bb2", "D3", "F3"], ["C3", "E3", "G3"])),
      card("Video game fans know it too: it's the “level complete” sound of a lot of classic games.", "♭VI ♭VII", "I", "victory", prog("Ab", "Bb", "C")),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. After V, where does it go?", options: ["vi (Am)", "♭VI (A♭)"], answer: "♭VI (A♭)", sound: prog("C", "G7", "Ab"), miss: "It went to A♭ major, a borrowed ♭VI" },
      { kind: "choice", prompt: "Listen. Is this the “epic” ♭VI–♭VII–I ending?", options: ["Yes", "No, it's IV–V–I"], answer: "Yes", sound: prog("Ab", "Bb", "C"), miss: "A♭, B♭, C: ♭VI–♭VII–I" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 5, fret: 4, semitones: 2, label: "B♭, the root of ♭VII in C", hint: "♭VI is A♭ (low E string, fret 4). ♭VII is a whole step up: fret 6. Then I (C) is fret 8." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Big performances of “The Star-Spangled Banner” sometimes end with A♭, B♭, C (in C). What's that progression?", options: ["♭VI–♭VII–I", "IV–V–I", "ii–V–I"], answer: "♭VI–♭VII–I", sound: prog("Ab", "Bb", "C"), miss: "Two borrowed chords stepping up to I: ♭VI–♭VII–I" },
    ),
  ],

  "19.5": [
    story(
      card("Borrowing works the other way too. A Picardy third ends a minor-key piece on a major I chord.", "Cm", "C", "minor → major", voiced(["C3", "Eb3", "G3"], ["G2", "B2", "D3"], ["C3", "E3", "G3"])),
      card("It was a favorite of Baroque composers. Bach ends many minor pieces this way, like the Sarabande of his French Suite No. 1.", "i", "I", "Bach", voiced(["D3", "F3", "A3"], ["A2", "C#3", "E3"], ["D3", "F#3", "A3"])),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. This is in C minor. Is the final chord minor or a Picardy third?", options: ["Minor", "Picardy third (major)"], answer: "Picardy third (major)", sound: voiced(["C3", "Eb3", "G3"], ["F2", "Ab2", "C3"], ["G2", "B2", "D3"], ["C3", "E3", "G3"]), miss: "The last chord had E♮: major. A Picardy third" },
      { kind: "choice", prompt: "Listen. Minor ending or Picardy third?", options: ["Minor", "Picardy third (major)"], answer: "Minor", sound: voiced(["C3", "Eb3", "G3"], ["F2", "Ab2", "C3"], ["G2", "B2", "D3"], ["C3", "Eb3", "G3"]), miss: "It stayed minor, with E♭ on top of the C" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 3, fret: 1, semitones: 1, label: "E, the major 3rd that makes a Picardy ending", hint: "In C minor the 3rd is E♭ (D string, fret 1). Raise it one fret to E♮: fret 2." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A sad song in A minor ends on A major instead of Am. What's that called?", options: ["A Picardy third", "A deceptive cadence", "A Neapolitan"], answer: "A Picardy third", sound: prog("Am", "E", "A"), miss: "Minor key, major final chord: a Picardy third" },
    ),
  ],
};
