import { parseNote } from "../music";
import { chordsSound } from "./mix-v2";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 13, phrases in combination: how phrases pair up by their cadences. Each lesson plays
// phrase endings so you can hear "question" (open) against "answer" (closed), lays phrases out in
// order with their cadences, and checks the idea against tunes you already know.

const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const tune = (notes: string[], gap = 0.32): Sound => ({ kind: "melodic", notes: midi(...notes), gap });
const voiced = (...chords: string[][]): Sound => ({ kind: "progression", gap: 0.9, chords: chords.map((c) => midi(...c)) });
const prog = (...symbols: string[]): Sound => chordsSound(symbols);
const card = (text: string, left: string, right: string, label: string, sound: Sound): StoryCard => ({ text, left, right, label, sound });
const staffCard = (text: string, staff: string[], sound: Sound, chord = false): StoryCard => ({ text, staff, sound, chord });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

const PAC = voiced(["G2", "G3", "B3", "D4", "D5"], ["C3", "E3", "G3", "C4", "C5"]);
const IAC_TOP = voiced(["G2", "G3", "B3", "D4", "B4"], ["C3", "C4", "G4", "E5"]);
const IAC_INV = voiced(["G2", "G3", "B3", "D4", "D5"], ["E3", "G3", "C4", "C5"]);

// "Ode to Joy": phrase 1 stops on D (a half cadence), phrase 2 starts the same and lands on C.
const ODE_1 = ["E4", "E4", "F4", "G4", "G4", "F4", "E4", "D4", "C4", "C4", "D4", "E4", "E4", "D4", "D4"];
const ODE_2 = ["E4", "E4", "F4", "G4", "G4", "F4", "E4", "D4", "C4", "C4", "D4", "E4", "D4", "C4", "C4"];

const PERIOD_KINDS = ["Parallel period", "Contrasting period", "Phrase group", "Phrase chain"];

export const CHAPTER_13: Record<string, Step[]> = {
  "13.1": [
    story(
      staffCard("The strongest full stop in music is the perfect authentic cadence (PAC): V to I, both chords in root position, with the tonic on top.", ["E4", "G4", "C5"], PAC, true),
      staffCard("Change any part and it's an imperfect authentic cadence (IAC). Here the top note is E, not C, so it sounds less final.", ["C4", "G4", "E5"], IAC_TOP, true),
      staffCard("This one ends with E in the bass (an inversion), so it's also an IAC. Still V to I, just not as solid.", ["E4", "G4", "C5"], IAC_INV, true),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Does the top note land on the tonic (PAC) or not (IAC)?", options: ["PAC", "IAC"], answer: "PAC", sound: PAC, miss: "The top note went D to C, landing on the tonic: PAC" },
      { kind: "choice", prompt: "Listen. PAC or IAC?", options: ["PAC", "IAC"], answer: "IAC", sound: IAC_TOP, miss: "The top note ended on E, not the tonic C: IAC" },
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "This last chord is C major with E in the bass. Is the cadence a PAC?", options: ["Yes", "No, it's an IAC"], answer: "No, it's an IAC", visual: { type: "staff", notes: ["E4", "G4", "C5"], chord: true }, sound: IAC_INV, miss: "A PAC needs both chords in root position. With E in the bass it's an IAC" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 1, fret: 0, semitones: 1, label: "the tonic C (the top note of a PAC in C)", hint: "Many melodies end ti → do. Open B is ti in C. Go up one fret to C: B string, fret 1." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "“Twinkle Twinkle Little Star” ends “…what you are” with the melody falling D to C over G to C. PAC or IAC?", options: ["PAC", "IAC"], answer: "PAC", visual: { type: "staff", notes: ["E4", "E4", "D4", "D4", "C4"] }, sound: tune(["F4", "F4", "E4", "E4", "D4", "D4", "C4"], 0.35), miss: "V to I with the melody landing on the tonic C: a PAC" },
    ),
  ],

  "13.2": [
    story(
      staffCard("A sentence is a phrase built a certain way: state a short idea, repeat it (or move it up or down), then continue to a cadence.", ["C4", "E4", "G4"], tune(["C4", "E4", "G4"], 0.35)),
      staffCard("Idea, then the same idea a step higher. That repeat is the “basic idea, basic idea” part.", ["C4", "E4", "G4", "D4", "F4", "A4"], tune(["C4", "E4", "G4", "D4", "F4", "A4"], 0.35)),
      staffCard("Then it breaks into something new or related that runs to the cadence. Idea, idea, go.", ["C4", "E4", "G4", "D4", "F4", "A4", "G4", "F4", "E4", "D4", "C4"], tune(["C4", "E4", "G4", "D4", "F4", "A4", "G4", "F4", "E4", "D4", "C4"], 0.3)),
    ),
    practice("Put it in order", {
      kind: "order",
      layout: "list",
      prompt: "Build a sentence.",
      given: [null, null, null, null],
      answer: ["Idea", "Idea again (or moved)", "Continuation", "Cadence"],
      tiles: ["Cadence", "Continuation", "Idea", "Idea again (or moved)"],
      labels: ["bar 1", "bar 2", "bars 3–4", "end"],
      sound: tune(["C4", "E4", "G4", "D4", "F4", "A4", "G4", "F4", "E4", "D4", "C4"], 0.3),
      miss: "Idea, idea again, continuation, cadence",
    }),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 4, fret: 3, semitones: 2, label: "the start of the idea, moved up a step", hint: "The idea starts on C (A string, fret 3). Moved up a whole step, it starts on D: two frets up, fret 5." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Beethoven's Piano Sonata No. 1 opens with a two-bar idea, plays it again on a new chord, then speeds into new material to a cadence. What kind of phrase is that?", options: ["A sentence", "A period", "A phrase chain"], answer: "A sentence", miss: "Idea, idea again, then continuation: a sentence" },
    ),
  ],

  "13.3": [
    story(
      card("A period is two phrases where the second ends more strongly than the first. Like a question and an answer.", "question", "answer", "a period", prog("C", "F", "G", "C", "F", "G", "C")),
      card("The first phrase (the antecedent) often ends on a half cadence, stopping on V. It sounds open.", "IV", "V", "antecedent", prog("C", "F", "G")),
      card("The second phrase (the consequent) ends on a PAC, landing home. It answers the question.", "V", "I", "consequent", prog("F", "G", "C")),
      staffCard("If both phrases start the same way, it's a parallel period. If they start differently, it's a contrasting period. “Ode to Joy” is parallel.", ODE_1.slice(0, 8), tune(ODE_1, 0.3)),
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Give each phrase of a period its cadence.",
      given: [null, null],
      answer: ["Half cadence", "PAC"],
      tiles: ["PAC", "Half cadence", "Plagal"],
      labels: ["antecedent", "consequent"],
      sound: prog("C", "F", "G", "C", "F", "G", "C"),
      miss: "The question ends open (half cadence), the answer ends home (PAC)",
    }),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen to this phrase ending. Question (antecedent) or answer (consequent)?", options: ["Question", "Answer"], answer: "Question", sound: tune(ODE_1, 0.28), miss: "It stopped on D, not home. That's the question" },
      { kind: "choice", prompt: "Listen. Question or answer?", options: ["Question", "Answer"], answer: "Answer", sound: tune(ODE_2, 0.28), miss: "It landed on C, home. That's the answer" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 1, fret: 1, semitones: 2, label: "D, where the question stops", hint: "The answer ends on C (B string, fret 1). The question stopped a whole step higher, on D: B string, fret 3." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "“Ode to Joy”: phrase 1 ends on a half cadence, phrase 2 ends on a PAC, and both start with the same tune. What is it?", options: PERIOD_KINDS, answer: "Parallel period", visual: { type: "staff", notes: ODE_2.slice(-5) }, sound: tune([...ODE_1, ...ODE_2], 0.26), miss: "Weak cadence, then strong, with matching starts: a parallel period" },
    ),
  ],

  "13.4": [
    story(
      card("An asymmetrical period has three (or five) phrases, so questions and answers don't pair up evenly.", "3 phrases", "", "uneven", prog("C", "G", "C", "G", "F", "G", "C")),
      card("It might be one question with two answers, or two questions then one answer. Only the last phrase has the strongest cadence.", "Q Q", "A", "two questions", prog("C", "G", "F", "G", "G", "C")),
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Lay out an asymmetrical period with two questions and one answer.",
      given: [null, null, null],
      answer: ["Half cadence", "Half cadence", "PAC"],
      tiles: ["Half cadence", "Half cadence", "PAC", "PAC"],
      labels: ["phrase 1", "phrase 2", "phrase 3"],
      miss: "Two open endings, then one strong ending: HC, HC, PAC",
    }),
    practice(
      "Name it",
      { kind: "choice", prompt: "A period has three phrases. What kind is it?", options: ["Asymmetrical period", "Double period", "Parallel period"], answer: "Asymmetrical period", miss: "Three or five phrases make it asymmetrical" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "You're learning a verse with three lines. Lines 1 and 2 stop on V, and line 3 lands on I. In this chapter's terms, the verse is…", options: ["An asymmetrical period", "A double period", "A phrase chain"], answer: "An asymmetrical period", sound: prog("C", "F", "G", "C", "F", "G", "F", "G", "C"), miss: "Two questions and one answer: three phrases, an asymmetrical period" },
    ),
  ],

  "13.5": [
    story(
      card("A double period has four phrases in two groups. The first two are the antecedent group, the last two the consequent group.", "phrases 1–2", "phrases 3–4", "two groups", prog("C", "G", "C", "G", "C", "G", "G", "C")),
      card("The big question comes at the end of phrase 2. Phrase 4 answers it with the strongest cadence.", "phrase 2: open", "phrase 4: PAC", "question, answer", prog("F", "G", "F", "G", "C")),
      card("A common melody plan is a b a b′. Since both groups start with a, it's a parallel double period.", "a b", "a b′", "parallel", prog("C", "G", "C", "G")),
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Label the melody of a parallel double period.",
      given: ["a", null, null, null],
      answer: ["a", "b", "a", "b′"],
      tiles: ["a", "b", "b′", "c"],
      labels: ["phrase 1", "phrase 2", "phrase 3", "phrase 4"],
      miss: "a b a b′: the second group repeats the first, with a changed ending",
    }),
    practice(
      "Name it",
      { kind: "choice", prompt: "In a double period, where is the main “question”?", options: ["End of phrase 2", "End of phrase 1", "End of phrase 4"], answer: "End of phrase 2", miss: "The antecedent group (phrases 1–2) ends open, at the end of phrase 2" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A song section has four lines: a, b, a, b′. Line 2 ends on V and line 4 ends on I. What is it?", options: ["Parallel double period", "Asymmetrical period", "Phrase chain"], answer: "Parallel double period", miss: "Four phrases in two groups, starting alike: a parallel double period" },
    ),
  ],

  "13.6": [
    story(
      card("Not every set of phrases is a period. If the last phrase ends on a half cadence, nothing answers it.", "…", "V", "no answer", prog("C", "F", "G")),
      card("A phrase group: two or more phrases that start alike, with the last ending on a half cadence.", "a", "a′ → HC", "phrase group", prog("C", "G", "C", "F", "G")),
      card("A phrase chain: two or more phrases that start differently, also ending on a half cadence.", "a", "b → HC", "phrase chain", prog("C", "Am", "F", "G")),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Two phrases start the same way, and the second ends on V. What is it?", options: PERIOD_KINDS, answer: "Phrase group", miss: "Ending on a half cadence rules out a period. Same starts: a phrase group" },
      { kind: "choice", prompt: "Two phrases start differently, and the second ends on V. What is it?", options: PERIOD_KINDS, answer: "Phrase chain", miss: "Half cadence at the end with different starts: a phrase chain" },
      { kind: "choice", prompt: "Two phrases start the same way. The first ends on V, the second on I. What is it?", options: PERIOD_KINDS, answer: "Parallel period", miss: "A stronger cadence at the end makes it a period, and same starts make it parallel" },
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen to how this section ends. Could it be a period?", options: ["Yes, it ends home", "No, it ends on V"], answer: "No, it ends on V", sound: prog("C", "G", "C", "F", "C", "F", "G"), miss: "It stops on G (V). A section ending on a half cadence is a phrase group or chain" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A pre-chorus has two lines and ends hanging on V, right before the chorus. Is it a period?", options: ["No, it ends on a half cadence", "Yes, a parallel period"], answer: "No, it ends on a half cadence", sound: prog("F", "G", "Am", "G"), miss: "Ending on V means no answer inside the section. It's a phrase group or chain, and the chorus answers it" },
    ),
  ],

  "13.7": [
    story(
      card("An elision joins two phrases so they overlap: the last bar of one phrase is also the first bar of the next.", "phrase 1 ends", "phrase 2 starts", "same bar", prog("F", "G", "C", "G", "Am")),
      card("You never hear a gap. The cadence chord lands and the next phrase is already going.", "V", "I = start", "no breath", prog("Dm", "G", "C", "F", "G", "C")),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Phrase 1 is bars 1–4. Phrase 2 starts in bar 4. What joins them?", options: ["An elision", "A half cadence", "A fragment"], answer: "An elision", miss: "Bar 4 is the end of one phrase and the start of the next: an elision" },
      { kind: "choice", prompt: "Two four-bar phrases are joined by an elision. How many bars do they take together?", options: ["7", "8", "9"], answer: "7", miss: "They share one bar, so 4 + 4 − 1 = 7" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "In many songs, the verse's final chord is also the first chord of the chorus, with no pause between. What's that called?", options: ["An elision", "A double period", "A phrase chain"], answer: "An elision", miss: "One bar doing two jobs, ending one section and starting the next: an elision" },
    ),
  ],

  "13.8": [
    story(
      card("Sentence: one phrase built as idea, idea, continuation.", "idea idea", "go", "sentence", tune(["C4", "E4", "G4", "D4", "F4", "A4", "G4", "E4", "C4"], 0.3)),
      card("Periods pair a weaker cadence with a stronger one: parallel, contrasting, asymmetrical or double.", "weak", "strong", "periods", prog("C", "F", "G", "C", "F", "G", "C")),
      card("Phrase groups and chains end on a half cadence. An elision overlaps two phrases.", "…", "V", "not periods", prog("C", "Am", "F", "G")),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Four phrases, a b a b′, with the strongest cadence at the end. What is it?", options: ["Parallel double period", "Phrase chain", "Sentence"], answer: "Parallel double period", miss: "Two groups of two, starting alike: a parallel double period" },
      { kind: "choice", prompt: "Two phrases start differently. The first ends on V, the second on a PAC. What is it?", options: ["Contrasting period", "Parallel period", "Phrase chain"], answer: "Contrasting period", miss: "Weak then strong cadence makes a period. Different starts: contrasting" },
      { kind: "choice", prompt: "One phrase: an idea, the idea again, then new material to a cadence. What is it?", options: ["Sentence", "Period", "Elision"], answer: "Sentence", miss: "Idea, idea, continuation: a sentence" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Listen to all of “Ode to Joy”'s first two phrases. What's the form?", options: PERIOD_KINDS, answer: "Parallel period", sound: tune([...ODE_1, ...ODE_2], 0.26), miss: "Same starts, half cadence then PAC: a parallel period" },
    ),
  ],
};
