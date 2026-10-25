import { chordsSound } from "./chords-sound";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 17, secondary dominants: major or 7th chords that act as V of a chord other than I. Pop
// is full of them, so the lessons lean on songs (Yesterday, Dock of the Bay, Imagine, Forget You),
// find the borrowed leading tone on the neck, build "V of" chords by counting up a fifth, and hear
// when one resolves somewhere unexpected.

const prog = (...symbols: string[]): Sound => chordsSound(symbols);
const card = (text: string, left: string, right: string, label: string, sound: Sound): StoryCard => ({ text, left, right, label, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

const SECONDARY = ["V/ii", "V/iii", "V/IV", "V/V", "V/vi"];

/** In C major: which secondary dominant is this chord? */
const whichV = (chord: string, target: string, answer: string, why: string): RushQuestion => ({
  kind: "choice",
  prompt: `In C major, ${chord} resolves to ${target}. Which secondary dominant is it?`,
  options: SECONDARY,
  answer,
  visual: { type: "big", text: `${chord} → ${target}` },
  sound: prog(chord, target),
  miss: why,
});

export const CHAPTER_17: Record<string, Step[]> = {
  "17.1": [
    story(
      card("In C major, D is normally minor (Dm). Make it D major or D7 and it pulls hard toward G, like G's own V chord.", "Dm", "D7 → G", "a new pull", prog("C", "D7", "G", "C")),
      card("That's a secondary dominant: a dominant chord aimed at a chord other than I. You've heard it in hundreds of songs.", "V of", "another chord", "secondary", prog("C", "E7", "Am", "F", "G", "C")),
      card("“Yesterday” by the Beatles, “Don't Know Why” by Norah Jones, “Saturday in the Park” by Chicago and “Forget You” by CeeLo Green all use them.", "Yesterday", "Forget You", "everywhere", prog("F", "A7", "Dm")),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen to two versions. Which one uses a secondary dominant (D major instead of D minor)?", options: ["First", "Second"], answer: "Second", sound: prog("C", "Dm", "G", "C", "D", "G"), miss: "The second time, D was major. That brighter D pulls to G like a V chord" },
    ),
    {
      type: "realSong",
      song: "Yesterday",
      artist: "The Beatles",
      key: "F major (“…troubles seemed so far away”)",
      chords: ["F", "A7", "Dm"],
      answer: ["I", "V/vi", "vi"],
      options: ["I", "IV", "V", "vi", "V/vi", "V/V"],
      sound: prog("F", "A7", "Dm"),
    },
  ],

  "17.2": [
    story(
      card("Tonicization means treating a chord that isn't I like a temporary home, by putting its own V in front of it.", "V/V", "V", "tonicize", prog("C", "D7", "G")),
      card("In C, the V of G is D. So D (or D7) is V of V, written V/V. It borrows F♯, which leads up to G.", "F♯", "G", "leading tone", prog("D7", "G")),
      card("A secondary dominant is always major or a dominant 7th, built a perfect 5th above the chord it targets.", "5th above", "major or 7", "the rule", prog("A7", "Dm")),
    ),
    practice(
      "Name it",
      whichV("D7", "G", "V/V", "D is a 5th above G, and G is V: V/V"),
      { kind: "choice", prompt: "What kind of chord is a secondary dominant?", options: ["Major or dominant 7th", "Minor", "Diminished"], answer: "Major or dominant 7th", miss: "Like any V, it's major or a dominant 7th" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 0, fret: 2, semitones: 1, label: "G, where D7's F♯ wants to go", hint: "F♯ is high e, fret 2 (part of a D7 shape). It leads up one fret to G: fret 3." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "“Forget You” by CeeLo Green, in C, goes C, D, F, C. D major isn't diatonic in C. What is it?", options: ["V/V", "V/vi", "ii"], answer: "V/V", sound: prog("C", "D", "F", "C"), miss: "D major is a 5th above G (V): V/V" },
    ),
  ],

  "17.3": [
    story(
      card("Any major or minor chord in the key can have its own V. In C: V/ii is A7, V/iii is B7, V/IV is C7, V/V is D7, V/vi is E7.", "A7 B7 C7", "D7 E7", "the five", prog("A7", "Dm", "E7", "Am")),
      card("Each adds a note outside the key that acts as the target's leading tone: C♯ for Dm, G♯ for Am.", "G♯", "A", "new notes", prog("E7", "Am")),
      card("I and vii° don't get one: V of I is just V, and a diminished chord can't feel like home.", "V/I = V", "no V/vii°", "skipped", prog("G7", "C")),
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "In C major, write the secondary dominant 7th for each target.",
      given: [null, null, null, "D7", null],
      answer: ["A7", "B7", "C7", "D7", "E7"],
      tiles: ["E7", "C7", "A7", "B7", "G7"],
      labels: ["V/ii", "V/iii", "V/IV", "V/V", "V/vi"],
      miss: "A7, B7, C7, D7, E7: each a 5th above its target",
    }),
    practice(
      "Name it",
      whichV("E7", "Am", "V/vi", "E is a 5th above A, and Am is vi: V/vi"),
      whichV("A7", "Dm", "V/ii", "A is a 5th above D, and Dm is ii: V/ii"),
      whichV("C7", "F", "V/IV", "C7 adds B♭ and pulls to F (IV): V/IV"),
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Lots of songs in C go C, E7, Am. What is the E7?", options: SECONDARY, answer: "V/vi", sound: prog("C", "E7", "Am"), miss: "E7 pulls to Am, the vi chord: V/vi" },
    ),
  ],

  "17.4": [
    story(
      card("Spot a chord that doesn't belong to the key. If it's major or a dominant 7th, it's probably a secondary dominant.", "outsider", "major or 7", "step 1", prog("C", "B7", "Em")),
      card("Count down a perfect 5th from its root. If that lands on a chord in the key, it's V of that chord. B7 → E, and Em is iii: V/iii.", "B", "E", "step 2", prog("B7", "Em")),
    ),
    practice(
      "Name it",
      whichV("B7", "Em", "V/iii", "B is a 5th above E, and Em is iii: V/iii"),
      { kind: "choice", prompt: "In G major, you see A7. What is it?", options: ["V/V", "V/ii", "V/vi"], answer: "V/V", sound: prog("G", "A7", "D", "G"), miss: "A is a 5th above D, which is V in G: V/V" },
      { kind: "choice", prompt: "In G major, you see B7. What is it?", options: ["V/vi", "V/iii", "V/IV"], answer: "V/vi", sound: prog("G", "B7", "Em"), miss: "B is a 5th above E, and Em is vi in G: V/vi" },
    ),
    {
      type: "realSong",
      song: "(Sittin' On) The Dock of the Bay",
      artist: "Otis Redding",
      key: "G major (verse)",
      chords: ["G", "B", "C", "A"],
      answer: ["I", "V/vi", "IV", "V/V"],
      options: ["I", "IV", "V", "V/V", "V/vi", "V/ii"],
      sound: prog("G", "B", "C", "A"),
    },
  ],

  "17.5": [
    story(
      card("To write V of a chord: find the target's root, go up a perfect 5th, and build a major triad or dominant 7th there.", "target", "up a 5th", "the recipe", prog("Em", "B7", "Em")),
      card("V/IV in G: IV is C. A 5th above C is G, so V7/IV is G7, which adds F♮ (outside G major).", "C", "G7", "V/IV in G", prog("G", "G7", "C")),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Write V7/V in D major. (V is A.)", options: ["E7", "A7", "B7"], answer: "E7", sound: prog("D", "E7", "A"), miss: "A 5th above A is E: E7" },
      { kind: "choice", prompt: "Write V7/ii in F major. (ii is Gm.)", options: ["D7", "C7", "A7"], answer: "D7", sound: prog("F", "D7", "Gm"), miss: "A 5th above G is D: D7" },
      { kind: "choice", prompt: "Write V7/vi in A major. (vi is F♯m.)", options: ["C♯7", "E7", "B7"], answer: "C♯7", sound: prog("A", "C#7", "F#m"), miss: "A 5th above F♯ is C♯: C♯7" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 5, fret: 0, semitones: 7, label: "B, the root of V/vi in G (vi is Em)", hint: "Start on E (open low E). A perfect 5th up is B: A string, fret 2 (or low E, fret 7)." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "You're playing a song in G and want a stronger pull into Em. Which chord do you add before it?", options: ["B7", "D7", "A7"], answer: "B7", sound: prog("G", "B7", "Em"), miss: "B7 is V of E: V7/vi" },
    ),
  ],

  "17.6": [
    story(
      card("Secondary dominants don't always go where they point. In “Yesterday”, V/V goes to IV instead of V.", "G7", "B♭", "a twist", prog("Dm", "G7", "Bb", "F")),
      card("“Imagine” does it too: E7 (V/vi in C) moves to F (IV) instead of Am.", "E7", "F", "Imagine", prog("G", "C", "E7", "F")),
      card("The surprise is the point: the ear expects one chord and gets another.", "expect Am", "get F", "surprise", prog("C", "E7", "F")),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. E7 sets up Am. Does it resolve as expected?", options: ["Yes, to Am", "No, somewhere else"], answer: "No, somewhere else", sound: prog("C", "E7", "F"), miss: "It went to F (IV), not Am: an irregular resolution" },
      { kind: "choice", prompt: "Listen. Does D7 resolve as expected?", options: ["Yes, to G", "No, somewhere else"], answer: "Yes, to G", sound: prog("C", "D7", "G"), miss: "D7 went to G, its target: a regular resolution" },
    ),
    {
      type: "realSong",
      song: "Yesterday",
      artist: "The Beatles",
      key: "F major (“…I believe in yesterday”)",
      chords: ["Dm", "G7", "B♭", "F"],
      answer: ["vi", "V/V", "IV", "I"],
      options: ["I", "ii", "IV", "V", "vi", "V/V"],
      sound: prog("Dm", "G7", "Bb", "F"),
    },
  ],
};
