import { parseNote } from "../music";
import { chordsSound } from "./mix-v2";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 15, creating contrast: how a new section sounds different by changing one or more
// elements of music. The listening questions play an idea and a changed version and ask which
// element changed; the guitar steps move a part to a new register or a new strum, and the real
// songs are the book's two case studies, a Mozart rondo and "Rude" by MAGIC!.

const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const tune = (notes: string[], gap = 0.3): Sound => ({ kind: "melodic", notes: midi(...notes), gap });
const voiced = (...chords: string[][]): Sound => ({ kind: "progression", gap: 0.8, chords: chords.map((c) => midi(...c)) });
const prog = (...symbols: string[]): Sound => chordsSound(symbols);
const card = (text: string, left: string, right: string, label: string, sound: Sound): StoryCard => ({ text, left, right, label, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

const ELEMENTS = ["Harmony (major/minor)", "Register (high/low)", "Rhythm", "Texture"];
const IDEA = ["C4", "E4", "G4", "E4", "C4"];

/** Play the idea, then a changed version, and ask what changed. */
const changed = (after: Sound, answer: string, why: string): RushQuestion => ({
  kind: "choice",
  prompt: "Listen to the idea, then the new section. Which element changed?",
  options: ELEMENTS,
  answer,
  sound: after,
  miss: why,
});

export const CHAPTER_15: Record<string, Step[]> = {
  "15.1": [
    story(
      card("A new section sounds new because something changes. Composers create contrast by changing the elements of music.", "same", "changed", "contrast", tune([...IDEA, ...IDEA.map((n) => n.replace("4", "5"))])),
      card("The elements: melody, harmony (key and major/minor), rhythm, timbre (which instruments), texture, articulation, dynamics and register.", "8 elements", "", "the toolbox", prog("C", "Cm")),
      card("Harmony: the same tune moved from major to minor sounds darker.", "C E G", "C E♭ G", "major → minor", voiced(["C3", "E3", "G3"], ["C3", "Eb3", "G3"])),
      card("Register: the same notes played much higher or lower feel lighter or heavier.", "low", "high", "register", tune(["C3", "E3", "G3", "C5", "E5", "G5"])),
    ),
    practice(
      "Name it by ear",
      changed(tune([...IDEA, "C4", "Eb4", "G4", "Eb4", "C4"]), "Harmony (major/minor)", "The E became E♭: major turned minor, a change of harmony"),
      changed(tune([...IDEA, "C6", "E6", "G6", "E6", "C6"]), "Register (high/low)", "Same notes, two octaves up: register"),
      changed({ kind: "melodic", notes: [...midi(...IDEA), ...midi(...IDEA)], gap: 0.15 }, "Rhythm", "Same notes, much quicker: rhythm"),
      changed(voiced(["C4"], ["E4"], ["G4"], ["C3", "G3", "C4", "E4", "G4"], ["C3", "G3", "C4", "E4", "G4"]), "Texture", "Single notes became full chords: texture"),
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 5, fret: 0, semitones: 12, label: "the same E, one octave up (a new register)", hint: "Open low E, then the same note an octave higher: D string, fret 2." },
      { kind: "fretInterval", string: 4, fret: 3, semitones: 12, label: "C, one octave up", hint: "C on the A string, fret 3. The octave above is two strings over and two frets up: G string, fret 5." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Lots of songs drop the drums out for the bridge, then bring the whole band back for the last chorus. Which element is being changed?", options: ELEMENTS, answer: "Texture", miss: "Instruments leaving and coming back thins and thickens the texture" },
    ),
  ],

  "15.2": [
    story(
      card("Mozart's “Eine kleine Nachtmusik”, movement II, is a Romanze in five-part rondo form: A B A C A.", "A B A", "C A", "rondo", prog("C", "G7", "C")),
      card("The gentle A section keeps coming back. Each new section (B, then C) contrasts with it.", "A", "B, C", "return", prog("C", "G", "C", "G")),
      card("The contrasting sections change several elements at once: key, rhythm and texture, so the A section sounds fresh each time it returns.", "new key", "busier rhythm", "contrast", prog("Cm", "G", "Cm", "G")),
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Lay out a five-part rondo.",
      given: ["A", null, null, null, "A"],
      answer: ["A", "B", "A", "C", "A"],
      tiles: ["A", "B", "C", "D"],
      labels: ["1", "2", "3", "4", "5"],
      miss: "A B A C A: the A section returns between each new one",
    }),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. A rondo's A section, then a C section that moves to minor. Which element changed most?", options: ELEMENTS, answer: "Harmony (major/minor)", sound: prog("C", "G", "C", "Cm", "Fm", "G", "Cm"), miss: "Major chords turned minor: a change of harmony" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "In Mozart's Romanze, which section returns three times?", options: ["A", "B", "C"], answer: "A", miss: "A B A C A: A comes back three times" },
    ),
  ],

  "15.3": [
    story(
      card("“Rude” by MAGIC! shows contrast in pop. The chord progression barely changes all song, so the other elements do the work.", "same chords", "new sound", "Rude", prog("C", "F", "G", "Am")),
      card("Verse 1 has no drums or bass. They enter in verse 2, thickening the texture.", "verse 1", "verse 2", "band enters", prog("C", "F")),
      card("In the pre-chorus the snare backbeat drops out and the guitars hold long notes. The texture lightens before the chorus.", "backbeat", "held notes", "pre-chorus", prog("F", "G")),
      card("The chorus keeps roughly verse 2's band but moves the voice higher, repeating a two-bar hook. Then a post-chorus follows.", "low", "high", "chorus", tune(["G4", "A4", "C5", "D5", "E5"])),
    ),
    practice("Put it in order", {
      kind: "order",
      layout: "list",
      prompt: "Lay out the first five sections of “Rude”.",
      given: ["Verse 1", null, null, null, null],
      answer: ["Verse 1", "Verse 2", "Pre-chorus", "Chorus", "Post-chorus"],
      tiles: ["Chorus", "Post-chorus", "Pre-chorus", "Verse 2", "Bridge"],
      labels: ["1", "2", "3", "4", "5"],
      miss: "Verse 1, verse 2, pre-chorus, chorus, post-chorus",
    }),
    {
      type: "tapBeat",
      bpm: 72,
      beatsPerBar: 4,
      bars: 2,
      title: "Play the reggae offbeats from “Rude”",
      pattern: [1, 3, 5, 7, 9, 11, 13, 15],
      hint: "Hold C major on your guitar. Rest on the numbers and strum a short chop on every “and”. Hands busy? Tap the button instead and it plays the guitar for you.",
      rhythm: ["er", "e", "er", "e", "er", "e", "er", "e", "|", "er", "e", "er", "e", "er", "e", "er", "e"],
      time: "4/4",
      guitar: { name: "C major", marks: [{ string: 4, fret: 3 }, { string: 3, fret: 2 }, { string: 2, fret: 0 }, { string: 1, fret: 1 }, { string: 0, fret: 0 }] },
    },
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "In “Rude”, verse 1 has no drums or bass, and verse 2 adds them. Which element changed?", options: ELEMENTS, answer: "Texture", miss: "Adding instruments thickens the texture" },
      { kind: "choice", prompt: "In the chorus of “Rude”, the band stays about the same but the voice sings higher. Which element changed?", options: ELEMENTS, answer: "Register (high/low)", sound: tune(["G4", "A4", "C5", "D5", "E5"]), miss: "Higher notes for the same kind of backing: register" },
      { kind: "choice", prompt: "Which element changes the least in “Rude”?", options: ["The chord progression", "Texture", "Register"], answer: "The chord progression", miss: "The chords stay nearly the same all song, so contrast comes from the other elements" },
    ),
  ],
};
