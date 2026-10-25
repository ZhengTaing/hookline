import { parseNote } from "../music";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 23, enharmonic modulation: one chord sound, respelled, opens a door to a distant key. The
// guitar makes this easy to see, since the same frets carry both spellings, and a diminished 7th
// shape repeats every three frets, so the lessons play that shape, hear one sound resolve several
// ways, and name where each resolution goes.

const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const voiced = (...chords: string[][]): Sound => ({ kind: "progression", gap: 0.9, chords: chords.map((c) => midi(...c)) });
const card = (text: string, left: string, right: string, label: string, sound: Sound): StoryCard => ({ text, left, right, label, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

const G7 = ["G2", "F3", "B3", "D4"];
const TO_C = voiced(G7, ["C3", "E3", "G3", "C4"]);
// G7 respelled as a German sixth (G B D E♯) in B minor: to the cadential 6/4, V, i.
const TO_BM = voiced(G7, ["F#2", "B3", "D4", "F#4"], ["F#2", "A#3", "C#4", "E4"], ["B2", "B3", "D4", "F#4"]);
const DIM = ["B2", "D3", "F3", "Ab3"];
// B D F A♭: each note can be the leading tone.
const DIM_TO = {
  C: voiced(DIM, ["C3", "E3", "G3"]),
  Eb: voiced(DIM, ["Eb3", "G3", "Bb3"]),
  Gb: voiced(DIM, ["Gb2", "Bb2", "Db3"]),
  A: voiced(DIM, ["A2", "C#3", "E3"]),
};
// B°7 at frets 3–4 (x x 3 4 3 4: F, B, A♭, D). Strings count from high e (0).
const DIM_SHAPE = { name: "B°7 (x x 3 4 3 4)", marks: [{ string: 3, fret: 3 }, { string: 2, fret: 4 }, { string: 1, fret: 3 }, { string: 0, fret: 4 }] };

export const CHAPTER_23: Record<string, Step[]> = {
  "23.1": [
    story(
      card("An enharmonic modulation is a harmonic pun: one chord means one thing in the old key and is respelled to mean something else in the new key.", "one sound", "two meanings", "a pun", TO_BM),
      card("On guitar, F and E♯ are the same fret, so the chord doesn't change at all. Only its name and where it goes do.", "F", "= E♯", "same fret", voiced(G7)),
      card("That's how music can leap to a faraway key, like C major to B minor, in one move.", "C major", "B minor", "far away", TO_BM),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "What changes in an enharmonic modulation's pivot chord?", options: ["Its spelling and meaning", "Its sound", "Its rhythm"], answer: "Its spelling and meaning", miss: "It sounds the same. It's respelled to fit the new key" },
      { kind: "choice", prompt: "On the guitar, F and E♯ are…", options: ["The same fret", "One fret apart", "Two frets apart"], answer: "The same fret", miss: "They're enharmonic: same pitch, different names" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Listen. It starts as G7, which you'd expect to go to C. Where does it actually go?", options: ["Somewhere far away (B minor)", "To C, as expected"], answer: "Somewhere far away (B minor)", sound: TO_BM, miss: "The G7 was respelled as a German sixth and resolved into B minor" },
    ),
  ],

  "23.2": [
    story(
      card("G7 (G B D F) is V7 in C. It wants to go to C.", "G7", "C", "as V7", TO_C),
      card("Respell F as E♯ and it's G B D E♯: a German sixth in B minor. G falls to F♯ and E♯ rises to F♯.", "G B D E♯", "→ F♯", "as Ger+6", TO_BM),
      card("Tchaikovsky, Beethoven and Les Misérables use this trick to slide between distant keys.", "V7", "Ger+6", "both ways", TO_BM),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Does this G7 resolve as V7 in C or as a German sixth?", options: ["V7 in C", "German sixth"], answer: "V7 in C", sound: TO_C, miss: "It went straight home to C: V7" },
      { kind: "choice", prompt: "Listen. V7 in C or German sixth?", options: ["V7 in C", "German sixth"], answer: "German sixth", sound: TO_BM, miss: "It spread outward onto F♯ and ended in B minor: a German sixth" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 3, fret: 3, semitones: 1, label: "F♯, where E♯ (the respelled F) resolves", hint: "F is D string, fret 3. As E♯ it rises one fret to F♯: fret 4." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "In C, the chord A♭7 can be a German sixth that leads to G. In which other key is A♭7 simply V7?", options: ["D♭ major", "G major", "A major"], answer: "D♭ major", sound: voiced(["Ab2", "C3", "Eb3", "Gb3"], ["Db3", "F3", "Ab3"]), miss: "A♭ is V of D♭, so A♭7 is V7 in D♭" },
    ),
  ],

  "23.3": [
    story(
      card("A diminished 7th is four notes each a minor 3rd apart: B D F A♭. Move it up three frets and you get the same four notes.", "B D F A♭", "+3 frets = same", "symmetrical", voiced(DIM)),
      card("Any of its four notes can be the leading tone. Treat B as the leading tone and it goes to C.", "B", "C", "→ C", DIM_TO.C),
      card("Treat D as the leading tone (D F A♭ C♭) and it goes to E♭. F (as E♯) leads to F♯, and A♭ (as G♯) leads to A.", "D", "E♭", "→ E♭", DIM_TO.Eb),
      card("One sound, four doors. Beethoven's “Pathétique” Sonata and Schubert's “Der Atlas” use it to swerve into new keys.", "1 chord", "4 keys", "four doors", voiced(DIM, ["A2", "C#3", "E3"])),
    ),
    {
      type: "tapBeat",
      bpm: 72,
      beatsPerBar: 4,
      bars: 2,
      title: "Strum the diminished 7th shape",
      hint: "Hold x x 3 4 3 4: D string fret 3, G fret 4, B fret 3, high e fret 4. Slide it up three frets later and it's the same chord. Hands busy? Tap the button instead and it plays the guitar for you.",
      guitar: DIM_SHAPE,
    },
    practice("Put it in order", {
      kind: "order",
      prompt: "B D F A♭ can lead to four keys. Give each note's target (a half step up).",
      given: ["C", null, null, null],
      answer: ["C", "E♭", "F♯", "A"],
      tiles: ["A", "E♭", "F♯", "G"],
      labels: ["B →", "D →", "F (E♯) →", "A♭ (G♯) →"],
      miss: "Each note rises a half step: C, E♭, F♯, A",
    }),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Same diminished chord. Where did it go this time?", options: ["C", "E♭", "A"], answer: "A", sound: DIM_TO.A, miss: "A♭ acted as G♯ and rose to A: it went to A" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Why do composers love the diminished 7th for sudden key changes?", options: ["One chord can lead to four keys", "It's the loudest chord", "It's always in the key"], answer: "One chord can lead to four keys", miss: "It's symmetrical, so any note can be the leading tone" },
    ),
  ],
};
