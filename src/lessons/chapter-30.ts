import { parseNote } from "../music";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 30, counterpoint: two independent melodies at once. The lessons walk the five species
// one step at a time (hear each rhythm against the cantus firmus, find its consonances and
// suspensions on the neck), then follow Bach's invention motive and a fugue's subject and answer.

const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const voiced = (gap: number, ...chords: string[][]): Sound => ({ kind: "progression", gap, chords: chords.map((c) => midi(...c)) });
const tune = (notes: string[], gap = 0.3): Sound => ({ kind: "melodic", notes: midi(...notes), gap });
const card = (text: string, left: string, right: string, label: string, sound: Sound): StoryCard => ({ text, left, right, label, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

const CF = tune(["C3", "D3", "E3", "D3", "C3"], 0.7);
const FIRST = voiced(0.8, ["C3", "C4"], ["D3", "F3"], ["E3", "G3"], ["D3", "B3"], ["C3", "C4"]);
const SECOND = voiced(0.4, ["C3", "C4"], ["B3"], ["D3", "A3"], ["G3"], ["E3", "G3"], ["C4"], ["D3", "B3"], ["D4"], ["C3", "C4"]);
const THIRD = tune(["C4", "D4", "E4", "F4", "G4", "F4", "E4", "D4", "C4"], 0.18);
const FOURTH = voiced(0.6, ["D3", "C4"], ["C3", "C4"], ["C3", "B3"], ["B2", "B3"], ["B2", "A3"]);
const FLORID = tune(["C4", "E4", "D4", "C4", "B3", "C4", "D4", "E4", "F4", "E4", "D4", "C4"], 0.2);
const SUBJECT = tune(["C4", "D4", "E4", "F4", "D4", "E4", "C4", "G4"], 0.22);
const ANSWER = tune(["G4", "A4", "B4", "C5", "A4", "B4", "G4", "D5"], 0.22);
const SPECIES = ["1st species", "2nd species", "3rd species", "4th species", "5th species"];
const ASUS = { name: "Asus4", marks: [{ string: 4, fret: 0 }, { string: 3, fret: 2 }, { string: 2, fret: 2 }, { string: 1, fret: 3 }, { string: 0, fret: 0 }] };

export const CHAPTER_30: Record<string, Step[]> = {
  "30.1": [
    story(
      card("Counterpoint is two independent melodies played at once. Each one makes sense alone, and together they make harmony.", "melody", "+ melody", "two lines", FIRST),
      card("Students learn it against a fixed tune, the cantus firmus, in five stages called species. Each one adds more freedom.", "cantus", "firmus", "the fixed tune", CF),
      card("1st: one note against one. 2nd: two against one. 3rd: four against one. 4th: suspensions. 5th: all of them mixed.", "1 · 2 · 4", "sus · mix", "five species", THIRD),
    ),
    practice("Put it in order", {
      kind: "order",
      layout: "list",
      prompt: "Put the five species in order.",
      given: [null, null, null, null, null],
      answer: ["Note against note", "Two against one", "Four against one", "Suspensions", "Florid (all mixed)"],
      tiles: ["Suspensions", "Four against one", "Florid (all mixed)", "Note against note", "Two against one"],
      labels: ["1st", "2nd", "3rd", "4th", "5th"],
      miss: "1:1, 2:1, 4:1, suspensions, then everything mixed",
    }),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A bass line and a vocal melody both move, each with its own shape. What's that called?", options: ["Counterpoint", "A drone", "A riff"], answer: "Counterpoint", miss: "Two independent melodies at once is counterpoint" },
    ),
  ],

  "30.2": [
    story(
      card("1st species: one note against each note of the cantus firmus.", "1", "1", "note : note", FIRST),
      card("Only consonances: unisons, 3rds, 5ths, 6ths and octaves. Start and end on an octave or unison.", "3rds 6ths", "5ths 8ves", "consonant only", FIRST),
      card("Favor 3rds and 6ths, prefer contrary motion, and never move in parallel 5ths or octaves.", "contrary", "no parallels", "the rules", voiced(0.8, ["C3", "C4"], ["D3", "B3"], ["E3", "G3"])),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Which interval is NOT allowed in 1st species?", options: ["A 2nd", "A 3rd", "A 6th"], answer: "A 2nd", miss: "2nds are dissonant, and 1st species uses consonances only" },
      { kind: "choice", prompt: "How should a 1st species line begin and end?", options: ["On an octave or unison", "On a 3rd", "On a 2nd"], answer: "On an octave or unison", miss: "Perfect consonances frame the line" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 1, fret: 1, semitones: 4, label: "E, a 3rd up", hint: "C is the B string, fret 1. A major 3rd is 4 frets up: E, fret 5." },
      { kind: "fretInterval", string: 1, fret: 1, semitones: 9, label: "A, a 6th up", hint: "C is the B string, fret 1. A major 6th is 9 semitones: A on the high e string, fret 5." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Two singers harmonize a whole song a 3rd apart. Which 1st species rule does that follow?", options: ["Favor 3rds and 6ths", "End on a 2nd", "Use parallel 5ths"], answer: "Favor 3rds and 6ths", miss: "3rds and 6ths are the sweet consonances counterpoint prefers" },
    ),
  ],

  "30.3": [
    story(
      card("2nd species: two half notes against each whole note.", "2", "1", "two : one", SECOND),
      card("The strong beat must be consonant. The weak beat can be a dissonance, but only as a passing tone, stepping in and out.", "strong", "weak", "beat rules", SECOND),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "In 2nd species, where can a dissonance appear?", options: ["The weak beat, as a passing tone", "The strong beat", "Nowhere"], answer: "The weak beat, as a passing tone", miss: "Only the weak half note, and only stepping through" },
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Which species is this?", options: ["1st species", "2nd species", "3rd species"], answer: "2nd species", sound: SECOND, miss: "Two notes in the top line for every bass note: 2nd species" },
    ),
    {
      type: "tapBeat",
      bpm: 72,
      beatsPerBar: 2,
      bars: 2,
      title: "Tap two against one",
      hint: "Two half notes for every whole note: tap on beat 1 and beat 2 of each bar. Got your guitar? Play open A (A string) and pick two notes above it on each beat.",
    },
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A guitarist holds a bass note and picks two melody notes over it per chord. Which species is that closest to?", options: SPECIES.slice(0, 3), answer: "2nd species", miss: "Two notes against one held note: 2nd species" },
    ),
  ],

  "30.4": [
    story(
      card("3rd species: four quarter notes against each whole note.", "4", "1", "four : one", THIRD),
      card("The first quarter must be consonant. The others can be passing or neighbor dissonances, all by step.", "passing", "neighbor", "the freedom", tune(["C4", "D4", "C4", "B3", "C4"], 0.2)),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Which species is this line?", options: ["1st species", "2nd species", "3rd species"], answer: "3rd species", sound: THIRD, miss: "Four quick notes per bar: 3rd species" },
      { kind: "choice", prompt: "In 3rd species, which quarter note must be consonant?", options: ["The first", "The last", "None"], answer: "The first", miss: "The downbeat is always consonant" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 1, fret: 1, semitones: 2, label: "D, the passing tone between C and E", hint: "C is the B string, fret 1. Step up two frets to D (fret 3), then on to E (fret 5)." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A bassist walks four quarter notes per chord, stepping between chord tones. Which species is that like?", options: SPECIES.slice(0, 3), answer: "3rd species", miss: "Four notes against one chord, with passing tones: 3rd species" },
    ),
  ],

  "30.5": [
    story(
      card("4th species: the upper voice is tied over the barline, so it hangs on while the bass moves.", "tie", "→", "hold over", FOURTH),
      card("That held note becomes a dissonance (a suspension) and resolves down by step. 7–6 and 4–3 are the classic ones.", "7–6", "4–3", "resolve down", FOURTH),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Which way does a 4th species suspension resolve?", options: ["Down by step", "Up by step", "By leap"], answer: "Down by step", miss: "Suspensions resolve down by step" },
      { kind: "choice", prompt: "Listen. Which species is this?", options: SPECIES, answer: "4th species", sound: FOURTH, miss: "Held over the bar, then stepping down: 4th species" },
    ),
    {
      type: "tapBeat",
      bpm: 72,
      beatsPerBar: 4,
      bars: 2,
      title: "Play a 4–3 suspension: Asus4",
      hint: "Hold Asus4 (x 0 2 2 3 0). The D on the B string (fret 3) is the suspended 4th. Lift to fret 2 and it resolves to C♯, the 3rd of A. Hands busy? Tap the button instead and it plays the guitar for you.",
      guitar: ASUS,
    },
    practice(
      "Find it on the guitar",
      { kind: "findNote", pitchClass: 1, prompt: "Find C♯, where Asus4's suspended D resolves.", hint: "B string, fret 2: one fret below the D." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Many acoustic songs rock between Asus4 and A. Which species idea is that?", options: SPECIES, answer: "4th species", sound: voiced(0.8, ["A2", "E3", "A3", "D4"], ["A2", "E3", "A3", "C#4"]), miss: "A 4th resolving down to the 3rd is a suspension: 4th species" },
    ),
  ],

  "30.6": [
    story(
      card("5th species, florid counterpoint, mixes everything: whole notes, halves, quarters, suspensions and a few eighths.", "mix", "all", "florid", FLORID),
      card("The aim is a line that sounds like real music: varied rhythm, a clear high point, and still every rule from species 1 to 4.", "free", "but careful", "real music", FLORID),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Is this line one steady rhythm or a mix?", options: ["A mix (florid)", "One steady rhythm"], answer: "A mix (florid)", sound: FLORID, miss: "Long and short notes mixed together: florid, 5th species" },
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "What does 5th species combine?", options: ["All the earlier species", "Only suspensions", "Only whole notes"], answer: "All the earlier species", miss: "Florid counterpoint mixes species 1 to 4" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 1, fret: 1, semitones: 5, label: "F, the high point of the florid line", hint: "The line starts on C (B string, fret 1) and climbs to F, a 4th up: high e string, fret 1." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A guitar solo mixes long bends, quick runs and held notes over the chords. Which species is it most like?", options: SPECIES, answer: "5th species", miss: "Mixed rhythms over a bass: florid, 5th species" },
    ),
  ],

  "30.7": [
    story(
      card("Bach wrote his two-part Inventions as lessons in counterpoint. Invention No. 1 in C opens with a short motive in the right hand.", "C D E F", "D E C", "the motive", tune(["C4", "D4", "E4", "F4", "D4", "E4", "C4"], 0.2)),
      card("Then the left hand imitates it, while the right hand keeps going. The motive is traded back and forth.", "right hand", "left hand", "imitation", voiced(0.2, ["C4"], ["D4"], ["E4"], ["F4"], ["D4", "C3"], ["E4", "D3"], ["C4", "E3"], ["G4", "F3"])),
      card("Under it all is a simple plan: I, I, V, V, I. The motive appears again starting on G for the V.", "I I", "V V I", "the plan", voiced(0.6, ["C3", "E3", "G3"], ["C3", "E3", "G3"], ["G2", "B2", "D3"], ["G2", "B2", "D3"], ["C3", "E3", "G3"])),
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Rebuild the opening motive of Bach's Invention No. 1.",
      given: ["C", null, null, null, null, null, "C"],
      answer: ["C", "D", "E", "F", "D", "E", "C"],
      tiles: ["E", "D", "F", "D", "E", "G"],
      sound: tune(["C4", "D4", "E4", "F4", "D4", "E4", "C4"], 0.2),
      miss: "Up C D E F, then back D E and home to C",
    }),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 4, fret: 3, semitones: 7, label: "G, where the motive restarts for V", hint: "C is the A string, fret 3. Up a 5th: G on the D string, fret 5." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "In a song, the guitar plays a lick and the keyboard answers with the same lick. What's that technique?", options: ["Imitation", "A pedal tone", "A modulation"], answer: "Imitation", miss: "Repeating the idea in another voice is imitation, Bach's invention trick" },
    ),
  ],

  "30.8": [
    story(
      card("A fugue begins with one voice alone, playing the subject: the main theme.", "subject", "1 voice", "the theme", SUBJECT),
      card("The next voice enters with the answer: the subject again, usually a 5th higher. The first voice carries on with a countersubject.", "answer", "+5th", "voice 2", ANSWER),
      card("When every voice has entered, the exposition is done. Episodes between later entries develop pieces of the subject.", "entries", "episodes", "the plan", voiced(0.6, ["C3", "E3", "G3"], ["A2", "C3", "E3"], ["F2", "A2", "C3"], ["G2", "B2", "D3"], ["C3", "E3", "G3"])),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Is this the subject or the answer (a 5th up)?", options: ["Subject", "Answer"], answer: "Answer", sound: ANSWER, miss: "It starts on G, a 5th above C: the answer" },
    ),
    practice("Put it in order", {
      kind: "order",
      layout: "list",
      prompt: "Lay out a three-voice fugue exposition and what comes next.",
      given: ["Subject", null, null, null],
      answer: ["Subject", "Answer", "Subject", "Episode"],
      tiles: ["Episode", "Answer", "Subject", "Coda"],
      labels: ["voice 1", "voice 2", "voice 3", "after"],
      miss: "Subject, answer, subject in turn, then an episode",
    }),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 4, fret: 3, semitones: 7, label: "G, where the answer starts", hint: "The subject starts on C (A string, fret 3). The answer is a 5th up: G, D string fret 5." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "In a round like “Row, Row, Row Your Boat”, voices enter one by one with the same tune. How is a fugue different?", options: ["The 2nd entry is usually a 5th higher", "Nobody enters", "There's only one voice"], answer: "The 2nd entry is usually a 5th higher", miss: "A round repeats at the same pitch. A fugue's answer comes a 5th up" },
    ),
  ],
};
