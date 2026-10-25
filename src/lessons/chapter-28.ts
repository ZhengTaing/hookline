import { parseNote } from "../music";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 28, voice leading with non-chord tones: decorating a plain four-part progression with
// passing tones, neighbors and suspensions, without creating parallels. The lessons hear plain
// against decorated, name the decoration, and play the most guitar-friendly one, the sus4 that
// resolves down to the 3rd.

const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const voiced = (gap: number, ...chords: string[][]): Sound => ({ kind: "progression", gap, chords: chords.map((c) => midi(...c)) });
const tune = (notes: string[], gap = 0.45): Sound => ({ kind: "melodic", notes: midi(...notes), gap });
const card = (text: string, left: string, right: string, label: string, sound: Sound): StoryCard => ({ text, left, right, label, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

const PLAIN = voiced(0.8, ["C3", "G3", "E4", "C5"], ["A2", "A3", "E4", "C5"], ["F2", "A3", "F4", "C5"], ["G2", "B3", "D4", "B4"]);
const KINDS = ["Passing tone", "Neighbor tone", "Suspension"];
const PASSING = tune(["E4", "F4", "G4"]);
const NEIGHBOR = tune(["C5", "D5", "C5"]);
const SUS = voiced(0.8, ["D3", "A3", "D4", "G4"], ["D3", "A3", "D4", "F#4"]);
const DSUS = { name: "Dsus4", marks: [{ string: 3, fret: 0 }, { string: 2, fret: 2 }, { string: 1, fret: 3 }, { string: 0, fret: 3 }] };

export const CHAPTER_28: Record<string, Step[]> = {
  "28.1": [
    story(
      card("Once a four-part progression works, you can decorate it with the non-chord tones from chapter 10.", "plain", "decorated", "add color", PLAIN),
      card("Bach's chorales do this all the time: passing tones fill gaps, neighbors ornament held notes, suspensions delay a resolution.", "Bach", "chorales", "the model", voiced(0.5, ["C3", "G3", "E4", "C5"], ["B2", "G3", "E4", "C5"], ["A2", "A3", "E4", "C5"], ["G2", "A3", "E4", "C5"], ["F2", "A3", "F4", "C5"])),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen to this line between two chord tones. Which decoration is it?", options: KINDS, answer: "Passing tone", sound: PASSING, miss: "It stepped through F to get from E to G: a passing tone" },
      { kind: "choice", prompt: "Listen. Which decoration is it?", options: KINDS, answer: "Neighbor tone", sound: NEIGHBOR, miss: "It stepped up to D and came back to C: a neighbor tone" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A bass player walks C, D, E between a C chord and an Em chord. What's the D?", options: KINDS, answer: "Passing tone", sound: tune(["C3", "D3", "E3"]), miss: "D fills the gap between two chord tones by step: a passing tone" },
    ),
  ],

  "28.2": [
    story(
      card("Before adding decorations, mark every 5th and octave between voices in the plain version.", "5th", "8ve", "mark them", PLAIN),
      card("Then check that a new note doesn't turn one of them into a parallel 5th or octave. A passing tone can sneak one in.", "check", "no parallels", "the trap", voiced(0.6, ["C3", "G3"], ["D3", "A3"])),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Why mark the 5ths and octaves before adding non-chord tones?", options: ["So decorations don't create parallels", "To make the chords louder", "To choose the key"], answer: "So decorations don't create parallels", miss: "A new note can turn a 5th or octave into a parallel one" },
      { kind: "choice", prompt: "Bass and soprano are a 5th apart. A passing tone moves both up a step, still a 5th apart. What's the problem?", options: ["Parallel 5ths", "Voice crossing", "Nothing"], answer: "Parallel 5ths", sound: voiced(0.6, ["C3", "G3"], ["D3", "A3"]), miss: "A 5th moving to another 5th in the same direction: parallel 5ths" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "You add a guitar fill that moves in 5ths with the bass line. In a chorale that would be a fault. In rock it's…", options: ["A normal power-chord sound", "Always wrong", "A key change"], answer: "A normal power-chord sound", miss: "Parallel 5ths are a classic rock sound, just not chorale style" },
    ),
  ],

  "28.3": [
    story(
      card("Repeated notes can get a neighbor: C, D, C instead of C, C.", "C C", "C D C", "neighbor", NEIGHBOR),
      card("A 3rd in one voice can be filled with a passing tone: E, F, G instead of E, G.", "E G", "E F G", "passing", PASSING),
      card("A voice that steps down can be held over and resolve late: a suspension. On guitar, Dsus4 to D is exactly this: G holds, then falls to F♯.", "G", "→ F♯", "suspension", SUS),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "The soprano holds G over a D chord, then steps down to F♯. Which decoration?", options: KINDS, answer: "Suspension", sound: SUS, miss: "A held note that resolves down by step: a suspension" },
      { kind: "choice", prompt: "Two chords have the same soprano note, C and C. Which decoration fits between them?", options: KINDS, answer: "Neighbor tone", miss: "A repeated note can be ornamented with a neighbor" },
    ),
    {
      type: "tapBeat",
      bpm: 72,
      beatsPerBar: 4,
      bars: 2,
      title: "Play the suspension: Dsus4",
      hint: "Hold Dsus4 (x x 0 2 3 3). The G on the high e string (fret 3) is the suspension. Lift to fret 2 and it resolves to F♯: a plain D. Hands busy? Tap the button instead and it plays the guitar for you.",
      guitar: DSUS,
    },
    practice(
      "Find it on the guitar",
      { kind: "findNote", pitchClass: 6, prompt: "Find F♯, where Dsus4's suspended G resolves.", hint: "High e string, fret 2: lift one finger off the Dsus4 shape." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Lots of acoustic songs flick between Dsus4 and D. Which non-chord tone is that?", options: KINDS, answer: "Suspension", sound: SUS, miss: "The suspended 4th (G) resolving down to the 3rd (F♯): a suspension" },
    ),
  ],
};
