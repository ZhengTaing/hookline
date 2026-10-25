import { parseNote } from "../music";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 16, figured bass: numbers that say which chord note is in the bass. On guitar that's the
// slash chord (C/E, C/G), so the lessons pair each figure with its slash-chord name, have you find
// the bass note on the neck, and play inversions so you hear how the bass changes the sound.

const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const voiced = (...chords: string[][]): Sound => ({ kind: "progression", gap: 0.9, chords: chords.map((c) => midi(...c)) });
const staffCard = (text: string, staff: string[], sound: Sound): StoryCard => ({ text, staff, chord: true, sound });
const card = (text: string, left: string, right: string, label: string, sound: Sound): StoryCard => ({ text, left, right, label, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

const ROOT = ["C3", "E3", "G3", "C4"];
const FIRST = ["E3", "G3", "C4", "E4"];
const SECOND = ["G3", "C4", "E4", "G4"];
const FIGURES = ["5/3 (no figure)", "6", "6/4"];
const CAD64 = voiced(["G2", "G3", "C4", "E4"], ["G2", "G3", "B3", "D4"], ["C3", "G3", "C4", "E4"]);

/** Which figure fits this C chord? */
const figure = (notes: string[], answer: string, why: string): RushQuestion => ({
  kind: "choice",
  prompt: "This is a C major chord. Which figure goes under its bass?",
  options: FIGURES,
  answer,
  visual: { type: "staff", notes, chord: true },
  sound: voiced(notes),
  miss: why,
});

export const CHAPTER_16: Record<string, Step[]> = {
  "16.1": [
    story(
      card("In the Baroque era (about 1600–1750), keyboard players read just a bass line with small numbers under it.", "bass", "numbers", "figured bass", voiced(["C3", "E3", "G3", "C4"], ["F2", "F3", "A3", "C4"], ["G2", "G3", "B3", "D4"], ["C3", "E3", "G3", "C4"])),
      card("The numbers show intervals above the bass, and the player improvised the chords from them. Handel wrote his recorder sonatas this way.", "6", "6/4", "improvise", voiced(["E3", "G3", "C4"], ["G3", "C4", "E4"])),
      card("Guitarists do the same thing today with chord charts: a symbol tells you the chord, and you choose how to play it.", "C/E", "chart", "same idea", voiced(["E2", "C3", "G3", "C4", "E4"])),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "What do the numbers in figured bass measure?", options: ["Intervals above the bass", "Beats per bar", "Fret numbers"], answer: "Intervals above the bass", miss: "Each number is an interval counted up from the bass note" },
      { kind: "choice", prompt: "Who filled in the chords from a figured bass?", options: ["The player, improvising", "The composer, note for note"], answer: "The player, improvising", miss: "The figures were shorthand. The keyboard player made up the actual voicing" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A modern chord chart says “C/E”. Like figured bass, what does the part after the slash tell you?", options: ["The bass note", "The top note", "The strum pattern"], answer: "The bass note", miss: "C/E means a C chord with E in the bass" },
    ),
  ],

  "16.2": [
    story(
      staffCard("Root position (root in the bass) needs no figure. Its full figure would be 5/3: a 5th and a 3rd above the bass.", ROOT, voiced(ROOT)),
      staffCard("First inversion, with the 3rd in the bass, is marked 6. C with E in the bass is I6, or C/E on a chart.", FIRST, voiced(FIRST)),
      staffCard("Second inversion, with the 5th in the bass, is 6/4. C with G in the bass is I6/4, or C/G.", SECOND, voiced(SECOND)),
      card("Seventh chords have four positions: 7 (root), 6/5 (3rd in bass), 4/3 (5th in bass) and 4/2 (7th in bass).", "7  6/5", "4/3  4/2", "sevenths", voiced(["G2", "B2", "D3", "F3"], ["B2", "D3", "F3", "G3"], ["D3", "F3", "G3", "B3"], ["F2", "G2", "B2", "D3"])),
    ),
    practice(
      "Name it",
      figure(ROOT, "5/3 (no figure)", "C is in the bass: root position, no figure needed"),
      figure(FIRST, "6", "E (the 3rd) is in the bass: first inversion, 6"),
      figure(SECOND, "6/4", "G (the 5th) is in the bass: second inversion, 6/4"),
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Match each seventh-chord figure to its bass note: root, 3rd, 5th, 7th.",
      given: ["7", null, null, null],
      answer: ["7", "6/5", "4/3", "4/2"],
      tiles: ["4/2", "6/5", "4/3", "6"],
      labels: ["root", "3rd", "5th", "7th"],
      miss: "Root 7, 3rd 6/5, 5th 4/3, 7th 4/2",
    }),
    practice(
      "Find it on the guitar",
      { kind: "findNote", pitchClass: 4, prompt: "Find E, the bass note of C/E (I6).", hint: "Open low E string works, or D string fret 2." },
      { kind: "findNote", pitchClass: 7, prompt: "Find G, the bass note of C/G (I6/4).", hint: "Low E string, fret 3: the bass of a C/G shape." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A song's chart says C/G. In figured bass, what is that?", options: ["I6/4", "I6", "I"], answer: "I6/4", sound: voiced(["G2", "C3", "E3", "G3", "C4", "E4"]), miss: "G, the 5th, in the bass: second inversion, I6/4" },
    ),
  ],

  "16.3": [
    story(
      card("The cadential 6/4 is a I6/4 that comes right before V at a cadence. The bass sits on 5 the whole time.", "I6/4", "V", "cadential", CAD64),
      card("It's really V wearing a disguise: the C and E above the G bass slide down to B and D.", "C → B", "E → D", "resolves down", CAD64),
      card("Mozart uses it at cadences constantly, and “The Star-Spangled Banner” has one near the end: “o'er the land of the free”.", "I6/4", "V → I", "the anthem", CAD64),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Does the first chord slide down into the second over the same bass note?", options: ["Yes: a cadential 6/4", "No: two root-position chords"], answer: "Yes: a cadential 6/4", sound: CAD64, miss: "The bass stayed on G while C and E moved down to B and D: cadential 6/4" },
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Lay out a cadence with a cadential 6/4.",
      given: [null, null, null],
      answer: ["I6/4", "V", "I"],
      tiles: ["I", "V", "I6/4", "IV"],
      labels: ["bass G", "bass G", "bass C"],
      sound: CAD64,
      miss: "I6/4 then V over the same G bass, then home to I",
    }),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 5, fret: 3, semitones: 5, label: "C, where the bass goes after the cadential 6/4 and V", hint: "The bass holds G (low E string, fret 3) under I6/4 and V, then moves to C: A string, fret 3 (or low E, fret 8)." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Near the end of “The Star-Spangled Banner”, a chord with the 5th in the bass comes right before V. What is it called?", options: ["Cadential 6/4", "Passing 6/4", "Root position I"], answer: "Cadential 6/4", miss: "I6/4 right before V at a cadence: the cadential 6/4" },
    ),
  ],

  "16.4": [
    story(
      card("Not every 6/4 chord is cadential. A passing 6/4 sits between two chords while the bass walks by step.", "I – V6/4", "– I6", "passing", voiced(["C3", "E3", "G3", "C4"], ["D3", "G3", "B3", "D4"], ["E3", "G3", "C4", "E4"])),
      card("A pedal 6/4 keeps the bass on one note while the chord above changes and comes back: I, IV6/4, I.", "I", "IV6/4", "pedal", voiced(["C3", "E3", "G3", "C4"], ["C3", "F3", "A3", "C4"], ["C3", "E3", "G3", "C4"])),
      card("An arpeggiated 6/4 happens when the bass itself spells out the chord, landing on the 5th along the way.", "C E", "G", "arpeggiated", { kind: "melodic", notes: midi("C3", "E3", "G3", "E3"), gap: 0.35 }),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "The bass goes C, D, E by step, and the middle chord is a 6/4. What kind?", options: ["Passing", "Pedal", "Cadential"], answer: "Passing", miss: "The bass passes through by step: a passing 6/4" },
      { kind: "choice", prompt: "The bass stays on C while the chords go I, IV6/4, I. What kind?", options: ["Passing", "Pedal", "Cadential"], answer: "Pedal", miss: "Same bass note held underneath: a pedal 6/4" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Lots of country and folk guitarists alternate the bass on a C chord: C on the A string, then G on the low E string. When G is in the bass, it's technically…", options: ["An arpeggiated 6/4", "A cadential 6/4", "A seventh chord"], answer: "An arpeggiated 6/4", sound: { kind: "melodic", notes: midi("C3", "G2", "C3", "G2"), gap: 0.4 }, miss: "The bass moves around the chord and lands on the 5th: an arpeggiated 6/4" },
    ),
  ],

  "16.5": [
    story(
      card("Our figures are shortcuts. The full figure for root position is 5/3, and first inversion is 6/3.", "5/3", "6/3", "full figures", voiced(ROOT, FIRST)),
      card("Baroque scores sometimes wrote every interval out, or added sharps and flats to show altered notes above the bass.", "♯6", "♭3", "accidentals", voiced(["E3", "G3", "C#4"], ["D3", "F3", "A3"])),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "What's the full figure that “6” is short for?", options: ["6/3", "6/4", "5/3"], answer: "6/3", miss: "First inversion has a 6th and a 3rd above the bass: 6/3, shortened to 6" },
      { kind: "choice", prompt: "Root position's full figure is…", options: ["5/3", "6/4", "7"], answer: "5/3", miss: "A 5th and a 3rd above the bass: 5/3, usually left blank" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "You see “G/B” on a chart. Which figure would a Baroque player write for that?", options: ["6", "6/4", "No figure"], answer: "6", sound: voiced(["B2", "D3", "G3", "B3"]), miss: "B is the 3rd of G, in the bass: first inversion, 6" },
    ),
  ],
};
