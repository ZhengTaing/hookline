import { parseNote } from "../music";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 33, set theory: numbering pitch classes and naming the sets atonal music is made from.
// The fretboard is a natural number line (one fret = one step), so the lessons count pitch
// classes on the neck, put sets in normal form, and move them with Tn and TnI.

const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const chord = (...names: string[]): Sound => ({ kind: "chord", notes: midi(...names) });
const tune = (notes: string[], gap = 0.3): Sound => ({ kind: "melodic", notes: midi(...notes), gap });
const card = (text: string, left: string, right: string, label: string, sound: Sound): StoryCard => ({ text, left, right, label, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

const CHROMATIC = tune(["C4", "C#4", "D4", "Eb4", "E4", "F4", "F#4", "G4", "Ab4", "A4", "Bb4", "B4"], 0.18);
const C_MAJOR = chord("C4", "E4", "G4");
const C_MINOR = chord("C4", "Eb4", "G4");
const F_MINOR = chord("F3", "Ab3", "C4");

export const CHAPTER_33: Record<string, Step[]> = {
  "33.1": [
    story(
      card("Atonal music, by Schoenberg, Webern and Berg, has no home key. To study it, theorists turn notes into numbers.", "notes", "numbers", "set theory", CHROMATIC),
      card("C is 0, C♯ is 1, D is 2… up to B, which is 11. Octave doesn't matter, so every C is 0. These are pitch classes.", "C = 0", "B = 11", "pitch classes", CHROMATIC),
      card("On guitar it's easy: each fret is one step, so the numbers just count frets up from C.", "1 fret", "= 1", "count frets", tune(["C4", "D4", "E4"])),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "What number is G?", options: ["7", "5", "8"], answer: "7", miss: "C 0, C♯ 1, D 2, E♭ 3, E 4, F 5, F♯ 6, G 7" },
      { kind: "choice", prompt: "Which note is pitch class 10?", options: ["B♭", "A", "B"], answer: "B♭", miss: "A is 9, B♭ is 10, B is 11" },
    ),
    practice(
      "Find it on the guitar",
      { kind: "findNote", pitchClass: 4, prompt: "Find pitch class 4.", hint: "4 steps above C: E, like the open low or high E string." },
      { kind: "findNote", pitchClass: 9, prompt: "Find pitch class 9.", hint: "9 steps above C: A, the open A string." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Your guitar's open strings are E A D G B E. As pitch classes, the low E string is…", options: ["4", "0", "5"], answer: "4", miss: "E is 4 steps above C: pitch class 4" },
    ),
  ],

  "33.2": [
    story(
      card("A set is a group of pitch classes, like {7, 0, 4}. Normal form writes them in the most compact order.", "{7 0 4}", "→ [0 4 7]", "normal form", C_MAJOR),
      card("Try each note as the start, going up around the clock. Pick the order that spans the smallest distance from first to last.", "[0 4 7]: 7", "[4 7 0]: 8", "smallest span", C_MAJOR),
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Write {G, C, E} in normal form (smallest span).",
      given: [null, null, null],
      answer: ["0", "4", "7"],
      tiles: ["7", "0", "4", "11"],
      labels: ["C", "E", "G"],
      sound: C_MAJOR,
      miss: "[0, 4, 7] spans 7 steps, the smallest: C, E, G",
    }),
    practice(
      "Name it",
      { kind: "choice", prompt: "[0, 4, 7] spans 7. [4, 7, 0] spans 8 (4 up to 12). Which is normal form?", options: ["[0, 4, 7]", "[4, 7, 0]"], answer: "[0, 4, 7]", miss: "Normal form has the smallest span" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 4, fret: 3, semitones: 7, label: "G, the last note of [0, 4, 7]", hint: "C is the A string, fret 3. The set spans 7 steps: G on the D string, fret 5." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "You play a C chord as G, C, E (G on the bottom). Does that change its normal form?", options: ["No, it's still [0, 4, 7]", "Yes, it becomes [7, 0, 4]"], answer: "No, it's still [0, 4, 7]", miss: "Normal form ignores order and octave: still [0, 4, 7]" },
    ),
  ],

  "33.3": [
    story(
      card("Prime form is a set's family name. Transpose its normal form to start on 0, and also try it flipped. Take whichever is packed tighter to the left.", "start on 0", "or flip", "prime form", C_MAJOR),
      card("C major is [0, 4, 7]. C minor is [0, 3, 7]. Flip either one and you get the other, so both are the same family: (037).", "major", "minor", "(037)", C_MINOR),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "What's the prime form of every major and minor triad?", options: ["(037)", "(047)", "(036)"], answer: "(037)", miss: "Major and minor are inversions of each other: (037)" },
      { kind: "choice", prompt: "D major is [2, 6, 9]. Transpose it to start on 0.", options: ["[0, 4, 7]", "[0, 3, 7]", "[0, 2, 9]"], answer: "[0, 4, 7]", miss: "Subtract 2 from each: 0, 4, 7" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 4, fret: 3, semitones: 3, label: "E♭, the 3 in (037)", hint: "C is the A string, fret 3. Three steps up is E♭: the D string, fret 1." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Am and E major are both in a song. Are they the same set class?", options: ["Yes, both are (037)", "No, different classes"], answer: "Yes, both are (037)", miss: "Every major and minor triad is (037)" },
    ),
  ],

  "33.4": [
    story(
      card("An interval vector counts every interval in a set, sorted into six interval classes: 1 (half step) up to 6 (tritone).", "ic 1", "… ic 6", "six slots", C_MAJOR),
      card("C E G has a 3 (E–G), a 4 (C–E) and a 5 (C–G as 7 inverts to 5). So its vector is <001110>.", "3 4 5", "<001110>", "major triad", C_MAJOR),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "What's the interval vector of a major triad?", options: ["<001110>", "<100110>", "<000300>"], answer: "<001110>", miss: "One each of interval classes 3, 4 and 5" },
      { kind: "choice", prompt: "A perfect 5th (7 steps) counts as which interval class?", options: ["5", "7", "1"], answer: "5", miss: "Interval classes only go to 6, so 7 counts as 12 − 7 = 5" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 4, fret: 3, semitones: 6, label: "F♯, interval class 6 (a tritone)", hint: "C is the A string, fret 3. Six frets up is F♯: the D string, fret 4." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A dominant 7th chord has a tritone in it, the most tense interval. Which slot of the vector counts it?", options: ["The 6th slot", "The 1st slot", "The 3rd slot"], answer: "The 6th slot", miss: "The tritone is interval class 6, the last slot" },
    ),
  ],

  "33.5": [
    story(
      card("Allen Forte gave every set class a number. The first part is how many notes the set has.", "3-11", "3 notes", "Forte numbers", C_MAJOR),
      card("3-11 is (037), every major and minor triad. 3-12 is the augmented triad. 4-28 is the diminished 7th.", "3-11", "4-28", "famous ones", chord("C4", "Eb4", "Gb4", "A4")),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "What does the 3 in Forte number 3-11 mean?", options: ["The set has 3 notes", "It's in 3/4 time", "It starts on pitch class 3"], answer: "The set has 3 notes", miss: "The first number is the cardinality: how many notes" },
      { kind: "choice", prompt: "Which Forte number is the major or minor triad?", options: ["3-11", "3-12", "4-28"], answer: "3-11", sound: C_MAJOR, miss: "3-11 is (037), the triad" },
    ),
    practice(
      "Find it on the guitar",
      { kind: "findNote", pitchClass: 8, prompt: "The augmented triad on C is 3-12: C, E, G♯. Find G♯.", hint: "Low E string fret 4, or G string fret 1." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A rock song's spooky diminished 7th chord would have which Forte number?", options: ["4-28", "3-11", "3-12"], answer: "4-28", sound: chord("C4", "Eb4", "Gb4", "A4"), miss: "The diminished 7th is 4-28" },
    ),
  ],

  "33.6": [
    story(
      card("Set-class lists are lookup tables: each prime form with its Forte number and interval vector, side by side.", "prime", "Forte · vector", "the table", C_MAJOR),
      card("Analysts find a set in the music, work out its prime form, then look it up to compare it with other sets in the piece.", "find", "look up", "the method", tune(["B3", "C4", "E4"])),
    ),
    practice("Put it in order", {
      kind: "order",
      layout: "list",
      prompt: "Put the analysis steps in order.",
      given: [null, null, null, null],
      answer: ["Pick out a set of notes", "Write its normal form", "Find its prime form", "Look up its Forte number"],
      tiles: ["Find its prime form", "Look up its Forte number", "Pick out a set of notes", "Write its normal form"],
      labels: ["1", "2", "3", "4"],
      miss: "Set, normal form, prime form, then look it up",
    }),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 1, fret: 0, semitones: 1, label: "C, one step above B", hint: "B is the open B string. One fret up is C: fret 1. B and C form the half step in the set (015)." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Two different riffs both turn out to be (037) in the table. What do they share?", options: ["The same set class", "The same key", "The same rhythm"], answer: "The same set class", miss: "Same prime form, same set class, same interval vector" },
    ),
  ],

  "33.7": [
    story(
      card("Tn transposes a set: add n to every pitch class. If a number passes 11, subtract 12.", "+ n", "wrap at 12", "Tn", tune(["C#4", "D4", "E4", "F#4", "F4", "F#4", "G#4", "A#4"], 0.22)),
      card("T4 of [1, 2, 4, 6] is [5, 6, 8, 10]. Every note moved up 4 steps, so the shape stays the same.", "[1 2 4 6]", "[5 6 8 10]", "T4", tune(["C#4", "D4", "E4", "F#4", "F4", "F#4", "G#4", "A#4"], 0.22)),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "What's T4 of [1, 2, 4, 6]?", options: ["[5, 6, 8, 10]", "[4, 5, 7, 9]", "[3, 2, 0, 10]"], answer: "[5, 6, 8, 10]", miss: "Add 4 to each: 5, 6, 8, 10" },
      { kind: "choice", prompt: "What's T3 of [8, 10, 11]?", options: ["[11, 1, 2]", "[11, 13, 14]", "[5, 7, 8]"], answer: "[11, 1, 2]", miss: "11, 13, 14 wrap past 11: 13 − 12 = 1 and 14 − 12 = 2" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 4, fret: 1, semitones: 4, label: "D, 4 steps up (T4)", hint: "B♭ (10) is the A string, fret 1. T4 adds 4: 14 − 12 = 2, which is D, at fret 5." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "You put a capo on fret 2 and play the same shapes. In set-theory terms, what did you do?", options: ["T2", "T0I", "Nothing"], answer: "T2", miss: "Every note moves up 2 steps: T2" },
    ),
  ],

  "33.8": [
    story(
      card("TnI inverts a set, then transposes it. First flip each note around C: subtract it from 12. E (4) becomes A♭ (8).", "E = 4", "A♭ = 8", "flip around C", tune(["E4", "C4", "Ab4"], 0.4)),
      card("Then add n. Inverting C major [0, 4, 7] gives [0, 8, 5]: F, A♭, C. A major chord flips into a minor one.", "C E G", "F A♭ C", "T0I", { kind: "progression", gap: 1, chords: [midi("C4", "E4", "G4"), midi("F3", "Ab3", "C4")] }),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Inverting around C, what does D (2) become?", options: ["B♭ (10)", "E (4)", "D (2)"], answer: "B♭ (10)", miss: "12 − 2 = 10: B♭" },
      { kind: "choice", prompt: "Inverting C major (0, 4, 7) around C gives which chord?", options: ["F minor", "C minor", "A minor"], answer: "F minor", sound: F_MINOR, miss: "0, 8, 5: C, A♭, F, an F minor triad" },
    ),
    practice(
      "Find it on the guitar",
      { kind: "findNote", pitchClass: 8, prompt: "Find A♭, what E (4) becomes when inverted around C.", hint: "12 − 4 = 8: A♭, on the G string fret 1 or low E string fret 4." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A riff goes up C, E, G. Its inversion goes down the same distances from C. What notes does it play?", options: ["C, A♭, F", "C, E, G", "G, E, C"], answer: "C, A♭, F", sound: tune(["C5", "Ab4", "F4"], 0.4), miss: "Down 4 steps to A♭, down 7 to F: the mirror image" },
    ),
  ],
};
