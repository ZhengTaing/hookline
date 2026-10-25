import { parseNote } from "../music";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 21, augmented sixth chords: pre-dominants whose ♭6 and ♯4 squeeze outward onto 5. The
// lessons hear that squeeze, tell the Italian, French and German types apart by their extra note,
// play the German sixth as the A♭7 shape it sounds like, and slide down the chromatic bass lines of
// Stairway to Heaven and While My Guitar Gently Weeps.

const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const voiced = (...chords: string[][]): Sound => ({ kind: "progression", gap: 0.9, chords: chords.map((c) => midi(...c)) });
const tune = (notes: string[], gap = 0.45): Sound => ({ kind: "melodic", notes: midi(...notes), gap });
const card = (text: string, left: string, right: string, label: string, sound: Sound): StoryCard => ({ text, left, right, label, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

// C minor. Each resolves to V (G).
const IT = ["Ab2", "C4", "F#4"];
const FR = ["Ab2", "C4", "D4", "F#4"];
const GER = ["Ab2", "C4", "Eb4", "F#4"];
const V = ["G2", "B3", "D4", "G4"];
const TYPES = ["Italian", "French", "German"];
const CHROMATIC = ["A2", "G#2", "G2", "F#2", "F2"];
// A♭7 barre at fret 4 (sounds like the German sixth in C). Strings count from high e (0).
const AB7 = { name: "A♭7 (barre at fret 4)", marks: [{ string: 5, fret: 4 }, { string: 4, fret: 6 }, { string: 3, fret: 4 }, { string: 2, fret: 5 }, { string: 1, fret: 4 }, { string: 0, fret: 4 }] };

/** Name the augmented sixth type from its notes. */
const whichType = (notes: string[], spelled: string, answer: string, why: string): RushQuestion => ({
  kind: "choice",
  prompt: `In C minor, this augmented sixth chord is ${spelled}. Which type is it?`,
  options: TYPES,
  answer,
  visual: { type: "staff", notes: notes.map((n) => n.replace("2", "4")), chord: true },
  sound: voiced(notes, V),
  miss: why,
});

export const CHAPTER_21: Record<string, Step[]> = {
  "21.1": [
    story(
      card("An augmented sixth chord sets up V by squeezing onto it: one note slides down a half step to 5, another slides up a half step to 5.", "A♭ ↓ G", "F♯ ↑ G", "the squeeze", voiced(IT, V)),
      card("In C minor those are ♭6 (A♭) in the bass and ♯4 (F♯) on top. The interval between them is an augmented 6th, which gives the chord its name.", "A♭", "F♯", "aug 6th", voiced(["Ab2", "F#3"], ["G2", "G3"])),
      card("Like ii or IV, it's a pre-dominant: it comes right before V.", "+6", "V", "pre-dominant", voiced(["C3", "Eb3", "G3"], IT, V, ["C3", "Eb3", "G3"])),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Do the outer notes move apart (outward) onto G?", options: ["Yes, outward to G", "No, they move together"], answer: "Yes, outward to G", sound: voiced(IT, V), miss: "A♭ fell to G and F♯ rose to G: they spread outward" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 3, fret: 4, semitones: 1, label: "G, where ♯4 (F♯) resolves", hint: "F♯ is D string, fret 4. It rises one fret to G: fret 5." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Beethoven's 5th Symphony (in C minor) uses a chord with A♭ in the bass and F♯ above, right before G. What is it?", options: ["An augmented sixth chord", "A Neapolitan", "A Picardy third"], answer: "An augmented sixth chord", sound: voiced(IT, V), miss: "♭6 and ♯4 squeezing onto 5: an augmented sixth chord" },
    ),
  ],

  "21.2": [
    story(
      card("All three types have ♭6 and ♯4 (A♭ and F♯ in C minor) plus the tonic, C. They differ by one extra note.", "A♭ C", "F♯", "the core", voiced(IT, V)),
      card("Italian (It+6): just A♭, C, F♯. The lightest one.", "A♭ C F♯", "", "Italian", voiced(IT, V)),
      card("French (Fr+6): adds 2 (D). It has a hazy, whole-tone sound.", "A♭ C D", "F♯", "French", voiced(FR, V)),
      card("German (Ger+6): adds ♭3 (E♭). It's the richest, and it sounds just like A♭7.", "A♭ C E♭", "F♯", "German", voiced(GER, V)),
    ),
    practice(
      "Name it",
      whichType(IT, "A♭ C F♯", "Italian", "Only ♭6, 1 and ♯4: Italian"),
      whichType(FR, "A♭ C D F♯", "French", "The extra D (2) makes it French"),
      whichType(GER, "A♭ C E♭ F♯", "German", "The extra E♭ (♭3) makes it German"),
    ),
    {
      type: "tapBeat",
      bpm: 72,
      beatsPerBar: 4,
      bars: 2,
      title: "Strum the German sixth (as A♭7)",
      hint: "Hold an E-shape barre at fret 4 with the 7th on the D string: 4 6 4 5 4 4. Strum on every click. Hands busy? Tap the button instead and it plays the guitar for you.",
      guitar: AB7,
    },
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Fiona Apple's “Criminal” uses a chord that sounds like a dominant 7th on ♭6. Which augmented sixth type sounds like that?", options: TYPES, answer: "German", sound: voiced(GER, V), miss: "The German sixth sounds identical to a dominant 7th on ♭6" },
    ),
  ],

  "21.3": [
    story(
      card("Stack an augmented sixth chord in thirds and you get something odd: F♯ A♭ C. F♯ up to A♭ is a diminished 3rd.", "F♯", "A♭", "dim 3rd", voiced(["F#3", "Ab3", "C4"])),
      card("No other chord we've studied has a diminished 3rd, so it's a giveaway: spot one and you've found an augmented sixth.", "dim 3rd", "= +6", "the clue", voiced(IT, V)),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Stacked in thirds, which interval tells you it's an augmented sixth chord?", options: ["A diminished 3rd", "A major 3rd", "A perfect 5th"], answer: "A diminished 3rd", miss: "Only augmented sixth chords contain a diminished 3rd (here F♯ to A♭)" },
      { kind: "choice", prompt: "F♯ A♭ C E♭ stacked in thirds has a diminished 3rd. Which type is it?", options: TYPES, answer: "German", sound: voiced(GER, V), miss: "A♭ C E♭ F♯ with ♭3 (E♭): German" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "You're analyzing a classical piece in C minor and find the notes F♯, A♭ and C right before a G chord. What's your label?", options: ["It+6", "N6", "vii°7/V"], answer: "It+6", sound: voiced(IT, V), miss: "F♯ A♭ C has a diminished 3rd and resolves to V: Italian sixth" },
    ),
  ],

  "21.4": [
    story(
      card("Lead sheets don't use “It+6”. A German sixth in C sounds exactly like A♭7, so that's how it's written.", "Ger+6", "A♭7", "same sound", voiced(GER, V)),
      card("On paper the 7th is spelled G♭ instead of F♯, but on guitar it's the same fret. Jazz players think of it as a dominant 7th on ♭6.", "F♯", "= G♭", "spelling", voiced(["Ab2", "C3", "Eb3", "Gb3"], V)),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "On a lead sheet in C, a German augmented sixth is usually written as…", options: ["A♭7", "F♯°7", "D♭"], answer: "A♭7", miss: "It sounds like a dominant 7th on ♭6: A♭7" },
      { kind: "choice", prompt: "On a lead sheet in A minor, which chord would stand for the German sixth?", options: ["F7", "E7", "B♭"], answer: "F7", sound: voiced(["F2", "A3", "C4", "D#4"], ["E2", "G#3", "B3", "E4"]), miss: "♭6 in A minor is F. A dominant 7th on it: F7" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Coltrane's minor blues “Mr. P.C.” is in C minor and uses A♭7 before G7. Classically, what is A♭7 there?", options: ["A German sixth", "A Neapolitan", "A secondary dominant"], answer: "A German sixth", sound: voiced(GER, V), miss: "A♭7 resolving to V sounds and acts like a German sixth" },
    ),
  ],

  "21.5": [
    story(
      card("Beethoven's 5th uses an Italian sixth. Rossini's William Tell Overture and Schubert's songs use them too.", "Beethoven", "Rossini", "classical", voiced(IT, V)),
      card("Jazz and pop use them, spelled as dominant 7ths: Ellington's “It Don't Mean a Thing”, Mancini's “Pink Panther Theme”, Fiona Apple's “Criminal”.", "Ellington", "Mancini", "jazz and pop", voiced(GER, V)),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Which augmented sixth sounds richest, like a full dominant 7th?", options: TYPES, answer: "German", sound: voiced(GER, V), miss: "The German has four notes and sounds like a dominant 7th" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Which of these pieces does the book cite for an Italian sixth?", options: ["Beethoven's 5th Symphony", "The Pink Panther Theme", "Criminal"], answer: "Beethoven's 5th Symphony", miss: "Beethoven's 5th, first movement, has an Italian sixth" },
    ),
  ],

  "21.6": [
    story(
      card("A favorite pattern: the bass slides down by half steps from 1 to 5. In A minor that's A, G♯, G, F♯, F, E.", "A G♯ G", "F♯ F E", "chromatic bass", tune(["A2", "G#2", "G2", "F#2", "F2", "E2"], 0.5)),
      card("Each bass note gets its own chord, often secondary, borrowed or augmented sixth chords. “Stairway to Heaven” opens this way.", "Am", "Am/G♯…", "Stairway", tune(CHROMATIC, 0.6)),
      card("“While My Guitar Gently Weeps”, “Dream On” and “Jar of Hearts” use descending bass lines too.", "Am Am/G", "D/F♯ F", "Gently Weeps", voiced(["A2", "C4", "E4"], ["G2", "C4", "E4"], ["F#2", "A3", "D4"], ["F2", "A3", "C4"])),
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Slide the “Stairway to Heaven” bass line down by half steps.",
      given: ["A", null, null, null, "F"],
      answer: ["A", "G♯", "G", "F♯", "F"],
      tiles: ["G", "F♯", "G♯", "E♭"],
      sound: tune(CHROMATIC, 0.6),
      miss: "A, G♯, G, F♯, F: one fret at a time",
    }),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 5, fret: 1, semitones: 4, label: "A, the bass line's starting note", hint: "The line ends on F (low E string, fret 1). It started four half steps higher, on A: fret 5. Play it back down one fret at a time." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "In “While My Guitar Gently Weeps”, the bass goes A, G, F♯, F under the chords. Which way is the bass moving?", options: ["Down by step", "Up by step", "Leaping"], answer: "Down by step", sound: tune(["A2", "G2", "F#2", "F2"], 0.6), miss: "A, G, F♯, F: a descending, mostly chromatic bass line" },
    ),
  ],

  "21.7": [
    story(
      card("Chromatic harmony gives many more ways to set up V. All of these are pre-dominants.", "pre-dominant", "V", "options", voiced(["D3", "F#3", "A3", "C4"], V)),
      card("V/V and vii°7/V borrow V's leading tone. iv and iiø7 borrow from minor. N6 and the augmented sixths add ♭2, ♭6 and ♯4.", "V/V vii°7/V", "iv N6 +6", "the family", voiced(["F2", "Ab3", "C4"], ["Db3", "F3", "Ab3"], GER, V)),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Which of these is NOT a chromatic pre-dominant in C?", options: ["G7", "D7 (V/V)", "Fm (iv)", "A♭7 (Ger+6)"], answer: "G7", miss: "G7 is V itself, the chord all the others lead to" },
      { kind: "choice", prompt: "Which chromatic pre-dominant uses ♭2?", options: ["N6", "V/V", "It+6"], answer: "N6", miss: "The Neapolitan is built on ♭2" },
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Build a cadence in C minor with an augmented sixth: i, a pre-dominant, V, i.",
      given: ["i", null, null, "i"],
      answer: ["i", "It+6", "V", "i"],
      tiles: ["V", "It+6", "I", "N"],
      sound: voiced(["C3", "Eb3", "G3"], IT, V, ["C3", "Eb3", "G3"]),
      miss: "i, It+6, V, i: the augmented sixth leads to V",
    }),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "You're writing a song in A minor and want a dark, dramatic chord right before E. Which one is a chromatic pre-dominant?", options: ["B♭ (Neapolitan)", "C (III)", "Am (i)"], answer: "B♭ (Neapolitan)", sound: voiced(["A2", "C3", "E3"], ["D3", "F3", "Bb3"], ["E2", "G#3", "B3", "E4"]), miss: "B♭ is ♭II, the Neapolitan, a chromatic pre-dominant. C and Am are in the key" },
    ),
  ],
};
