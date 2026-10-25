import { parseNote } from "../music";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 35, minimalism: music that grows by repeating. The lessons build Glass-style additive
// patterns, then hear Reich's phase shifting, tapping each pattern against the beat and playing a
// loop on the guitar.

const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const voiced = (gap: number, ...chords: string[][]): Sound => ({ kind: "progression", gap, chords: chords.map((c) => midi(...c)) });
const tune = (notes: string[], gap = 0.18): Sound => ({ kind: "melodic", notes: midi(...notes), gap });
const card = (text: string, left: string, right: string, label: string, sound: Sound): StoryCard => ({ text, left, right, label, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

const ADDITIVE = tune(["C4", "D4", "C4", "D4", "E4", "C4", "D4", "E4", "F4"]);
const SUBTRACT = tune(["C4", "D4", "E4", "F4", "C4", "D4", "E4", "C4", "D4"]);
const LOOP = tune(["E4", "G4", "C5", "G4", "E4", "G4", "C5", "G4"]);
// Two copies of the loop, the second one note ahead.
const PHASED = voiced(0.18, ["E4", "G4"], ["G4", "C5"], ["C5", "G4"], ["G4", "E4"], ["E4", "G4"], ["G4", "C5"], ["C5", "G4"], ["G4", "E4"]);
const IN_SYNC = voiced(0.18, ["E4", "E5"], ["G4", "G5"], ["C5", "C6"], ["G4", "G5"], ["E4", "E5"], ["G4", "G5"], ["C5", "C6"], ["G4", "G5"]);
const C_SHAPE = { name: "C (loop notes)", marks: [{ string: 3, fret: 2 }, { string: 2, fret: 0 }, { string: 1, fret: 1 }, { string: 0, fret: 0 }] };

export const CHAPTER_35: Record<string, Step[]> = {
  "35.1": [
    story(
      card("Minimalism, from the 1960s on, builds whole pieces from tiny patterns repeated many times.", "small idea", "× many", "minimalism", ADDITIVE),
      card("Philip Glass's “Two Pages” is additive: a short figure repeats, then a note is added, and the longer figure repeats.", "C D", "C D E", "add a note", ADDITIVE),
      card("Notes can be taken away again too. The music changes shape slowly, so you notice every small change.", "C D E F", "C D E", "take away", SUBTRACT),
    ),
    practice("Put it in order", {
      kind: "order",
      layout: "list",
      prompt: "Grow the pattern the additive way.",
      given: ["C D", null, null],
      answer: ["C D", "C D E", "C D E F"],
      tiles: ["C D E F", "C D E", "C E"],
      labels: ["first", "then", "then"],
      sound: ADDITIVE,
      miss: "Add one note each time: C D, C D E, C D E F",
    }),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Is the pattern growing or shrinking?", options: ["Growing (notes added)", "Shrinking (notes taken away)"], answer: "Growing (notes added)", sound: ADDITIVE, miss: "C D, then C D E, then C D E F: growing" },
      { kind: "choice", prompt: "Listen. Is the pattern growing or shrinking?", options: ["Growing (notes added)", "Shrinking (notes taken away)"], answer: "Shrinking (notes taken away)", sound: SUBTRACT, miss: "C D E F, then C D E, then C D: shrinking" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 1, fret: 1, semitones: 2, label: "D, the note added to C", hint: "C is the B string, fret 1. D is two frets up, fret 3. Then add E (fret 5), then F (high e, fret 1)." },
    ),
    {
      type: "tapBeat",
      bpm: 100,
      beatsPerBar: 4,
      bars: 2,
      title: "Tap a steady minimalist pulse",
      hint: "Minimalist pieces ride on an even, unchanging pulse. Tap every beat and keep it steady. Got your guitar? Pick C D E F on the B and high e strings, one note per tap.",
    },
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A dance track loops one bar, then adds a hi-hat, then a bass note, a bit at a time. Which minimalist idea is that?", options: ["Additive building", "Phase shifting", "Twelve-tone"], answer: "Additive building", miss: "Adding a little to a repeating loop is additive" },
    ),
  ],

  "35.2": [
    story(
      card("Steve Reich noticed two tape loops of the same recording slowly drifting out of sync, then lining up again.", "loop 1", "loop 2", "drift", LOOP),
      card("He wrote it for live players in “Piano Phase”: two pianists play the same loop, and one gradually speeds up until it's a note ahead.", "in sync", "one note ahead", "phase shift", PHASED),
      card("As the loops slide past each other, new patterns pop out of the mix that neither player is actually playing.", "hidden", "patterns", "the magic", PHASED),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Are the two loops in sync or shifted?", options: ["In sync", "Shifted"], answer: "In sync", sound: IN_SYNC, miss: "Both play the same note at the same time: in sync" },
      { kind: "choice", prompt: "Listen. Are the two loops in sync or shifted?", options: ["In sync", "Shifted"], answer: "Shifted", sound: PHASED, miss: "One loop is a note ahead, so the notes clash and combine: shifted" },
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "In phase shifting, what changes between the two parts?", options: ["How far apart in time they are", "The notes they play", "The key"], answer: "How far apart in time they are", miss: "Same loop, same notes; only the timing gap changes" },
    ),
    {
      type: "tapBeat",
      bpm: 90,
      beatsPerBar: 4,
      bars: 2,
      title: "Loop E G C G on the guitar",
      hint: "Hold this C shape and pick E (D string, fret 2), G (open G), C (B string, fret 1), G, over and over. That's the loop the two players shift against each other. Hands busy? Tap the button instead and it plays the guitar for you.",
      guitar: C_SHAPE,
    },
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Steve Reich wrote “Electric Counterpoint” for a guitarist, who plays against loops of their own recorded parts. Which guitarist premiered it?", options: ["Pat Metheny", "Jimi Hendrix", "Eric Clapton"], answer: "Pat Metheny", miss: "Pat Metheny recorded it in 1987" },
    ),
  ],
};
