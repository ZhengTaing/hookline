import { parseNote } from "../music";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 31, jazz harmony: chords stacked past the 7th, altered dominants, guide-tone voicings,
// ii–V–I and the scale that goes with each chord. Guitar is home turf here, so most sections play
// a real jazz shape (all within the first five frets) or find a color tone on the neck.

const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const chord = (...names: string[]): Sound => ({ kind: "chord", notes: midi(...names) });
const voiced = (gap: number, ...chords: string[][]): Sound => ({ kind: "progression", gap, chords: chords.map((c) => midi(...c)) });
const tune = (notes: string[], gap = 0.25): Sound => ({ kind: "melodic", notes: midi(...notes), gap });
const card = (text: string, left: string, right: string, label: string, sound: Sound): StoryCard => ({ text, left, right, label, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });
const shape = (name: string, frets: (number | null)[]) => ({
  name,
  // frets listed low E to high e, like a chord chart; null = not played
  marks: frets.flatMap((fret, i) => (fret === null ? [] : [{ string: 5 - i, fret }])),
});

const CMAJ7 = chord("C3", "E3", "G3", "B3");
const CMAJ9 = chord("C3", "E3", "B3", "D4", "E4");
const CM7B5 = chord("C3", "Eb3", "Gb3", "Bb3");
const C6 = chord("C3", "E3", "A3", "C4", "E4");
const C13 = chord("C3", "E3", "Bb3", "A4");
const CSUS = chord("C3", "F3", "G3", "C4", "F4");
const E7S9 = chord("E2", "B2", "E3", "G#3", "D4", "G4");
const II_V_I = voiced(0.9, ["D3", "A3", "C4", "F4"], ["G2", "F3", "B3", "D4"], ["C3", "E3", "G3", "B3"]);
const GUIDE = voiced(0.9, ["C4", "F4"], ["B3", "F4"], ["B3", "E4"]);
const DORIAN = tune(["D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5"]);
const MIXO = tune(["G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4"]);
const QUALITIES = ["maj7", "m7", "7", "m7♭5"];

export const CHAPTER_31: Record<string, Step[]> = {
  "31.1": [
    story(
      card("Jazz rarely stops at the 7th. It adds a 9th on top of almost any seventh chord (all but the °7).", "Cmaj7", "Cmaj9", "+9", CMAJ9),
      card("A 9 in the symbol means the 7th is there too. Cmaj9 is C E G B D.", "C E G B", "+ D", "7th implied", CMAJ9),
      card("The half-diminished chord (ø7) gets its own jazz name: m7♭5. Cm7♭5 is C E♭ G♭ B♭.", "ø7", "m7♭5", "same chord", CM7B5),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Which seventh chord is this?", options: QUALITIES, answer: "maj7", sound: CMAJ7, miss: "Dreamy and smooth, with a major 7th on top: maj7" },
      { kind: "choice", prompt: "Listen. Which seventh chord is this?", options: QUALITIES, answer: "m7♭5", sound: CM7B5, miss: "Dark and unstable, with a flat 5: m7♭5" },
    ),
    {
      type: "tapBeat",
      bpm: 72,
      beatsPerBar: 4,
      bars: 2,
      title: "Strum Cmaj9",
      hint: "x 3 2 4 3 0: C on the A string, E on the D string, B on the G string, D on the B string and open high E. That D on top is the 9th. Hands busy? Tap the button instead and it plays the guitar for you.",
      guitar: shape("Cmaj9", [null, 3, 2, 4, 3, 0]),
    },
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A neo-soul song lives on lush maj9 and m9 chords. What does the 9 in “Cmaj9” tell you?", options: ["The 7th is there too, plus a 9th", "Only the 9th, no 7th", "Play it at fret 9"], answer: "The 7th is there too, plus a 9th", miss: "A 9 implies the 7th: C E G B plus D" },
    ),
  ],

  "31.2": [
    story(
      card("Add A (the 6th) to a C triad. If there's no 7th, call it C6. If there is a 7th, the same note is a 13th: C13.", "no 7th: 6", "7th: 13", "6 or 13", C6),
      card("Same idea with F over a C chord. No 3rd? It's sus4, the 4th replaces the 3rd. With the 3rd there too, it's an 11.", "no 3rd: sus", "3rd: 11", "sus or 11", CSUS),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "C, E, G, A, with no 7th. What's the symbol?", options: ["C6", "C13", "Csus"], answer: "C6", sound: C6, miss: "No 7th, so the A is called a 6th" },
      { kind: "choice", prompt: "C, E, B♭, A. What's the symbol?", options: ["C13", "C6", "Cadd9"], answer: "C13", sound: C13, miss: "There's a 7th (B♭), so the A counts as a 13th" },
      { kind: "choice", prompt: "C, F, G, with no E. What's the symbol?", options: ["Csus4", "C11", "Fmaj"], answer: "Csus4", sound: CSUS, miss: "No 3rd, so F is a suspended 4th" },
    ),
    {
      type: "tapBeat",
      bpm: 72,
      beatsPerBar: 4,
      bars: 2,
      title: "Strum C6",
      hint: "x 3 2 2 1 0: a C chord with the A on the G string (fret 2). No 7th, so it's a 6, not a 13. Hands busy? Tap the button instead and it plays the guitar for you.",
      guitar: shape("C6", [null, 3, 2, 2, 1, 0]),
    },
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A chord chart says Dsus4, and you play x x 0 2 3 3. Is there an F♯ (the 3rd) in it?", options: ["No, sus means no 3rd", "Yes, always"], answer: "No, sus means no 3rd", miss: "Sus replaces the 3rd with the 4th" },
    ),
  ],

  "31.3": [
    story(
      card("A dominant 7th is altered when its 5th or 9th is bent up or down: 7♭5, 7♯5, 7♭9, 7♯9.", "♭5 ♯5", "♭9 ♯9", "altered", E7S9),
      card("The root, 3rd and 7th never change. Those make it a dominant. The bent notes add tension that wants to resolve.", "1 3 ♭7", "stay put", "the core", voiced(0.9, ["E2", "B2", "E3", "G#3", "D4", "G4"], ["A2", "E3", "A3", "C#4", "E4"])),
      card("Jimi Hendrix made E7♯9 famous. It has both G♯ (the 3rd) and G (the ♯9), a major and minor sound at once.", "G♯", "G", "the Hendrix chord", E7S9),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Which notes of a dominant 7th can be altered?", options: ["The 5th and 9th", "The root and 3rd", "The 3rd and 7th"], answer: "The 5th and 9th", miss: "Only the 5th and 9th bend. Root, 3rd and 7th stay put" },
      { kind: "choice", prompt: "In E7♯9, which note is the ♯9?", options: ["G", "F♯", "G♯"], answer: "G", miss: "The 9th of E is F♯, raised a half step: G (F𝄪 spelled simply)" },
    ),
    {
      type: "tapBeat",
      bpm: 80,
      beatsPerBar: 4,
      bars: 2,
      title: "Strum E7♯9 in open position",
      hint: "0 2 0 1 3 3: an E7 with D on the B string (fret 3) and G on the high e (fret 3). That top G is the ♯9, rubbing against G♯ on the G string. Hands busy? Tap the button instead and it plays the guitar for you.",
      guitar: shape("E7♯9", [0, 2, 0, 1, 3, 3]),
    },
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Hendrix's “Purple Haze” is built on the 7♯9 chord. Which two notes clash inside it?", options: ["The 3rd and the ♯9", "The root and the 5th", "The 7th and the root"], answer: "The 3rd and the ♯9", sound: E7S9, miss: "G♯ (the 3rd) and G (the ♯9) together give its gritty sound" },
    ),
  ],

  "31.4": [
    story(
      card("Jazz musicians read from fake books: a melody plus chord symbols, and you make up the rest.", "melody", "+ symbols", "fake book", II_V_I),
      card("Symbols vary between books: Cmaj7 might be written CΔ7 or CM7, and Cm7 as C–7. The New Real Book's labels are a good, reliable standard.", "CΔ7", "Cmaj7", "same chord", CMAJ7),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "A fake book shows CΔ7. What chord is it?", options: ["Cmaj7", "C°7", "C7"], answer: "Cmaj7", sound: CMAJ7, miss: "The triangle (Δ) means major 7th" },
      { kind: "choice", prompt: "C–7 means…", options: ["Cm7", "C7♭5", "C dim"], answer: "Cm7", miss: "The minus sign means minor" },
      { kind: "choice", prompt: "Cø7 means…", options: ["Cm7♭5", "C°7", "Cmaj7"], answer: "Cm7♭5", sound: CM7B5, miss: "The circle with a slash is half-diminished: m7♭5" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "You open a fake book to “Autumn Leaves”. What's on the page?", options: ["Melody and chord symbols", "Every note for every player", "Only lyrics"], answer: "Melody and chord symbols", miss: "Fake books give the tune and the changes; you fill in the rest" },
    ),
  ],

  "31.5": [
    story(
      card("To write any jazz chord, stack from the root: 3rd, 5th, 7th, 9th, 11th, 13th. Start with the major-scale version.", "1 3 5 7", "9 11 13", "stack it", tune(["C3", "E3", "G3", "B3", "D4", "F4", "A4"], 0.2)),
      card("Then apply the symbol. C7 lowers the 7th to B♭. C7♭9 also lowers the 9th to D♭.", "B → B♭", "D → D♭", "apply it", chord("C3", "E3", "Bb3", "Db4")),
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Stack the notes of C13 from the bottom, all major-scale tones except the ♭7.",
      given: ["C", null, null, null, null, null, "A"],
      answer: ["C", "E", "G", "B♭", "D", "F", "A"],
      tiles: ["F", "B♭", "E", "D", "G", "B"],
      labels: ["1", "3", "5", "♭7", "9", "11", "13"],
      miss: "C E G B♭ D F A: root, 3rd, 5th, ♭7, 9th, 11th, 13th",
    }),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 4, fret: 3, semitones: 2, label: "D, the 9th of C", hint: "C is the A string, fret 3. The 9th is D, a step up (fret 5), or an octave higher on the B string, fret 3." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A funk chart says E9. Which note is added on top of E7?", options: ["F♯", "G", "A"], answer: "F♯", miss: "The 9th of E is F♯, a step above the root, an octave up" },
    ),
  ],

  "31.6": [
    story(
      card("To analyze a jazz chord, write every note up to the 13th, then compare it with the plain major-scale chord on that root.", "write out", "compare", "the method", chord("G2", "B2", "F3", "Ab3", "Eb4")),
      card("G B F A♭ E♭: B is the major 3rd, F the ♭7, A♭ the ♭9, E♭ the ♭13 (or ♯5). So it's G7♭9♭13.", "♭9", "♭13", "G7♭9♭13", chord("G2", "B2", "F3", "Ab3", "Eb4")),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "G, B, D, F, A♭. Compared with G's major scale, what's A♭?", options: ["♭9", "♯9", "♭5"], answer: "♭9", miss: "G's 9th is A. A♭ is a half step lower: ♭9" },
      { kind: "choice", prompt: "C, E, G, B♭, D♯. What's D♯?", options: ["♯9", "♭3", "♯11"], answer: "♯9", miss: "Above a major 3rd, a D♯ is a raised 9th, even though it sounds like E♭" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 5, fret: 3, semitones: 1, label: "A♭, the ♭9 of G", hint: "G is the low E string, fret 3. The ♭9 is A♭, one fret up (fret 4), or an octave higher on the G string, fret 1." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A jazz guitarist plays a G7 with an A♭ on top right before C. Why?", options: ["The ♭9 adds tension that resolves to C", "It's a wrong note", "To change key to A♭"], answer: "The ♭9 adds tension that resolves to C", sound: voiced(0.9, ["G2", "B2", "F3", "Ab3"], ["C3", "E3", "G3", "G3"]), miss: "Altered 9ths make V pull harder toward I" },
    ),
  ],

  "31.7": [
    story(
      card("The 3rd and 7th tell you a chord's quality. Jazz players call them guide tones and always keep them.", "3rd", "7th", "guide tones", GUIDE),
      card("The root and 5th are often dropped: the bass covers the root, and the 5th adds little. That frees fingers for color tones like 9ths and 13ths.", "drop 1, 5", "add 9, 13", "make room", chord("F3", "B3", "E4")),
      card("In ii–V–I, the guide tones barely move: C to B, F stays, then B stays and F falls to E.", "C → B", "F → E", "smooth", GUIDE),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Which two notes are the guide tones of a seventh chord?", options: ["3rd and 7th", "Root and 5th", "5th and 9th"], answer: "3rd and 7th", miss: "The 3rd and 7th define the chord's quality" },
      { kind: "choice", prompt: "Which note is most often left out of a jazz voicing?", options: ["The 5th", "The 3rd", "The 7th"], answer: "The 5th", miss: "The 5th adds the least color, so it goes first" },
    ),
    {
      type: "tapBeat",
      bpm: 72,
      beatsPerBar: 4,
      bars: 2,
      title: "Play a shell voicing: G7",
      hint: "3 x 3 4 x x: G on the low E string, F (the 7th) on the D string, B (the 3rd) on the G string. Root, 7th and 3rd, no 5th. Hands busy? Tap the button instead and it plays the guitar for you.",
      guitar: shape("G7 shell", [3, null, 3, 4, null, null]),
    },
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "In a jazz trio, the bass player plays roots. Which notes should the guitarist keep?", options: ["The 3rd and 7th", "The root and 5th", "Only the root"], answer: "The 3rd and 7th", miss: "With roots covered, the guitarist plays the guide tones and colors" },
    ),
  ],

  "31.8": [
    story(
      card("ii–V–I is the most common progression in jazz. In C: Dm7, G7, Cmaj7.", "Dm7 G7", "Cmaj7", "ii–V–I", II_V_I),
      card("“Autumn Leaves” is built from chains of ii–V–Is, in a major key and its relative minor.", "ii–V–I", "again", "Autumn Leaves", II_V_I),
      card("The classic turnaround is iii–vi–ii–V: Em7, A7, Dm7, G7, leading back to the top.", "iii vi", "ii V", "turnaround", voiced(0.7, ["E3", "B3", "D4", "G4"], ["A2", "G3", "C#4", "E4"], ["D3", "A3", "C4", "F4"], ["G2", "F3", "B3", "D4"])),
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Build a turnaround in C.",
      given: ["Em7", null, null, null],
      answer: ["Em7", "A7", "Dm7", "G7"],
      tiles: ["G7", "Dm7", "A7", "Fmaj7"],
      labels: ["iii", "vi", "ii", "V"],
      miss: "Em7, A7, Dm7, G7: each root a 5th below the last",
    }),
    {
      type: "tapBeat",
      bpm: 80,
      beatsPerBar: 4,
      bars: 2,
      title: "Strum Dm7, the ii of ii–V–I",
      hint: "x x 0 2 1 1. Then G7 (3 2 0 0 0 1) and Cmaj7 (x 3 2 0 0 0). Hands busy? Tap the button instead and it plays the guitar for you.",
      guitar: shape("Dm7", [null, null, 0, 2, 1, 1]),
    },
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Listen. Which jazz progression is this?", options: ["ii–V–I", "I–IV–V", "iii–vi–ii–V"], answer: "ii–V–I", sound: II_V_I, miss: "Minor 7th, dominant 7th, major 7th: ii–V–I" },
    ),
  ],

  "31.9": [
    story(
      card("Jazz players pick a scale for each chord. Over a m7 chord, use Dorian: a minor scale with a raised 6th.", "Dm7", "D Dorian", "minor chords", DORIAN),
      card("Over a dominant 7th, use Mixolydian: a major scale with a lowered 7th.", "G7", "G Mixolydian", "dominants", MIXO),
      card("Over maj7, use the major scale (Ionian), or Lydian with its bright raised 4th. In ii–V–I in C, all three scales are just the white notes.", "Cmaj7", "Ionian · Lydian", "major chords", tune(["C4", "D4", "E4", "F#4", "G4", "A4", "B4", "C5"])),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Which scale fits over Dm7?", options: ["Dorian", "Mixolydian", "Lydian"], answer: "Dorian", sound: DORIAN, miss: "Minor 7th chords take Dorian" },
      { kind: "choice", prompt: "Which scale fits over G7?", options: ["Mixolydian", "Dorian", "Ionian"], answer: "Mixolydian", sound: MIXO, miss: "Dominant 7ths take Mixolydian" },
    ),
    practice(
      "Find it on the guitar",
      { kind: "findNote", pitchClass: 11, prompt: "Find B, the raised 6th that makes D Dorian different from D minor.", hint: "Open B string, or the G string at fret 4." },
      { kind: "findNote", pitchClass: 5, prompt: "Find F, the lowered 7th of G Mixolydian.", hint: "Low E string fret 1, or D string fret 3." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Santana's “Oye Como Va” jams over Am7 and D7. Which scale has the F♯ that fits both?", options: ["A Dorian", "A natural minor", "A harmonic minor"], answer: "A Dorian", sound: voiced(0.9, ["A2", "G3", "C4", "E4"], ["D3", "F#3", "C4", "E4"]), miss: "A Dorian has F♯, the 3rd of D7. Natural minor has F" },
    ),
  ],
};
