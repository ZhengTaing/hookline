import { parseNote } from "../music";
import { chordsSound } from "./chords-sound";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 25, sonata and rondo forms: the big plans of Classical music. The lessons lay out the
// sections in order, hear which job a passage is doing (stating, moving, developing, ending), follow
// the key plan on the neck, and map the four movements of a Classical piece.

const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const tune = (notes: string[], gap = 0.3): Sound => ({ kind: "melodic", notes: midi(...notes), gap });
const prog = (...symbols: string[]): Sound => chordsSound(symbols);
const card = (text: string, left: string, right: string, label: string, sound: Sound): StoryCard => ({ text, left, right, label, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

const FUNCTIONS = ["Expository (states a theme)", "Transitional (moves on)", "Developmental (breaks it up)", "Terminative (wraps up)"];

export const CHAPTER_25: Record<string, Step[]> = {
  "25.1": [
    story(
      card("Sonata form is the big plan of Classical first movements. It has three parts: exposition, development and recapitulation.", "expo", "dev · recap", "three parts", prog("C", "G", "D7", "G", "Em", "B7", "G7", "C")),
      card("The exposition states a first theme in the home key, moves through a transition, then gives a second theme in a new key (usually V, or III in minor).", "theme 1: I", "theme 2: V", "exposition", prog("C", "F", "G", "C", "D7", "G")),
      card("The development breaks the themes into pieces and wanders through keys. The recapitulation brings both themes back, now both in the home key.", "wander", "home", "dev → recap", prog("Am", "E", "Dm", "G7", "C")),
    ),
    practice("Put it in order", {
      kind: "order",
      layout: "list",
      prompt: "Lay out sonata form in a major key.",
      given: ["Theme 1 (I)", null, null, null, null, null],
      answer: ["Theme 1 (I)", "Transition", "Theme 2 (V)", "Development", "Theme 1 (I)", "Theme 2 (I)"],
      tiles: ["Development", "Theme 2 (V)", "Theme 2 (I)", "Transition", "Theme 1 (I)", "Coda"],
      labels: ["expo", "expo", "expo", "dev", "recap", "recap"],
      miss: "Theme 1, transition, Theme 2 in V; development; then both themes in the home key",
    }),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 4, fret: 3, semitones: 7, label: "G, the key of theme 2 when the piece is in C", hint: "Home is C (A string, fret 3). Theme 2 moves to V, a 5th up: G on the D string, fret 5." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Mozart's “Eine kleine Nachtmusik”, first movement, is in G. In the exposition, which key does the second theme arrive in?", options: ["D (V)", "G (I)", "E minor (vi)"], answer: "D (V)", sound: prog("G", "A7", "D"), miss: "In a major-key sonata the second theme comes in V: D" },
    ),
  ],

  "25.2": [
    story(
      card("Music does four jobs. Expository passages state a theme clearly, in one key, with clear phrases.", "theme", "stable", "expository", tune(["G4", "D4", "G4", "D4", "G4", "D4", "G4", "B4", "D5"], 0.22)),
      card("Transitional passages move between themes, often changing key and ending on a half cadence.", "→", "new key", "transitional", prog("G", "Em", "A7", "D")),
      card("Developmental passages fragment ideas and pass through many keys. Terminative passages wrap things up with repeated cadences.", "pieces", "V–I V–I", "dev · end", prog("D7", "G", "D7", "G", "D7", "G")),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Which job is this passage doing?", options: FUNCTIONS, answer: "Terminative (wraps up)", sound: prog("D7", "G", "D7", "G", "D7", "G"), miss: "V–I over and over: it's wrapping up" },
      { kind: "choice", prompt: "Listen. Which job is this passage doing?", options: FUNCTIONS, answer: "Transitional (moves on)", sound: prog("G", "Em", "A7", "D", "A7"), miss: "It left home and stopped on a new V: it's moving on" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "At the end of a song, the band repeats the last line three times and hits the final chord. Which job is that?", options: FUNCTIONS, answer: "Terminative (wraps up)", miss: "Repeating the ending to close it out is terminative" },
      { kind: "choice", prompt: "A pre-chorus changes the feel and builds toward the chorus. Which job is it closest to?", options: FUNCTIONS, answer: "Transitional (moves on)", miss: "It moves us from one section to the next: transitional" },
    ),
  ],

  "25.3": [
    story(
      card("A rondo has a refrain, A, that keeps coming back between episodes. Five-part rondo is A B A C A.", "A B A", "C A", "five-part", prog("C", "G", "C", "G", "Am", "E", "C")),
      card("Seven-part rondo is A B A C A B A. The refrain is always in the home key.", "A B A C", "A B A", "seven-part", prog("C", "G7", "C")),
      card("The first episode, B, usually goes to V (or III in minor). Beethoven's “Pathétique” Sonata ends with a famous rondo.", "B in V", "A in I", "key plan", prog("C", "D7", "G", "G7", "C")),
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Lay out a seven-part rondo.",
      given: ["A", null, "A", null, "A", null, "A"],
      answer: ["A", "B", "A", "C", "A", "B", "A"],
      tiles: ["B", "B", "C", "D"],
      miss: "A B A C A B A: the refrain between each episode",
    }),
    practice(
      "Name it",
      { kind: "choice", prompt: "In a rondo, which key is the refrain A always in?", options: ["The home key", "V", "Any key"], answer: "The home key", miss: "The refrain always returns home" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A song keeps returning to the same chorus between different verses and a bridge. Which Classical form does that resemble?", options: ["Rondo", "Sonata form", "Binary"], answer: "Rondo", miss: "A returning refrain between different sections is the rondo idea" },
    ),
  ],

  "25.4": [
    story(
      card("Rondos are usually light, quick and tuneful, with a catchy refrain you remember.", "quick", "catchy", "character", tune(["C5", "E5", "G5", "E5", "C5", "D5", "B4", "G4", "C5"], 0.16)),
      card("That's why they so often end a Classical piece: Haydn and Mozart finish symphonies and quartets with rondos.", "finale", "rondo", "Haydn, Mozart", prog("C", "F", "G7", "C")),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Which sounds more like a rondo refrain?", options: ["Quick and catchy", "Slow and solemn"], answer: "Quick and catchy", sound: tune(["C5", "E5", "G5", "E5", "C5", "D5", "B4", "G4", "C5"], 0.16), miss: "Rondo refrains tend to be light, fast and tuneful" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Where in a Classical symphony would you most expect a rondo?", options: ["The last movement", "The first movement", "The slow movement"], answer: "The last movement", miss: "Rondos' lively character suits a finale" },
    ),
  ],

  "25.5": [
    story(
      card("A Classical sonata, symphony or quartet usually has four movements, each with its own typical form.", "4", "movements", "the plan", prog("C", "G", "C")),
      card("1st: sonata form, usually fast. 2nd: slow, in ternary, sonatina or rondo form. 3rd: minuet and trio, a dance.", "fast", "slow · dance", "1–3", prog("F", "C7", "F")),
      card("4th: a fast finale, often a rondo, sonata or sonata-rondo.", "finale", "rondo", "4", prog("C", "G7", "C")),
    ),
    practice("Put it in order", {
      kind: "order",
      layout: "list",
      prompt: "Match each movement to its usual form.",
      given: [null, null, null, null],
      answer: ["Sonata form", "Ternary or rondo", "Minuet and trio", "Rondo or sonata"],
      tiles: ["Minuet and trio", "Rondo or sonata", "Sonata form", "Ternary or rondo"],
      labels: ["1st", "2nd", "3rd", "4th"],
      miss: "Sonata, slow ternary or rondo, minuet and trio, fast rondo",
    }),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "On an album, artists often put the slower, quieter song in the middle. Which Classical movement plays that role?", options: ["The 2nd movement", "The 1st movement", "The 4th movement"], answer: "The 2nd movement", miss: "The second movement is usually the slow one" },
    ),
  ],
};
