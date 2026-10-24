import { chordSymbol, diatonicChord, pretty, type ChordQuality } from "../music";
import type { RushQuestion, Sound, Unit } from "./types";

// Chapters 6-9 of Hutchinson, "Music Theory for the 21st-Century Classroom":
// triads, Roman numerals and cadences, seventh chords, and harmonic progression.

const SHAPES: Record<ChordQuality, number[]> = {
  major: [0, 4, 7], minor: [0, 3, 7], dim: [0, 3, 6], aug: [0, 4, 8],
  maj7: [0, 4, 7, 11], "7": [0, 4, 7, 10], m7: [0, 3, 7, 10], "ø7": [0, 3, 6, 10], "°7": [0, 3, 6, 9],
};

const QUALITY_WORDS: Record<ChordQuality, string> = {
  major: "Major", minor: "Minor", dim: "Diminished", aug: "Augmented",
  maj7: "Major 7th", "7": "Dominant 7th", m7: "Minor 7th", "ø7": "Half-diminished 7th", "°7": "Fully diminished 7th",
};

const LETTERS = "CDEFGAB";
const LETTER_PC = [0, 2, 4, 5, 7, 9, 11];

function midiOf(name: string, octave: number): number {
  const shift = (name.match(/#/g)?.length ?? 0) - (name.slice(1).match(/b/g)?.length ?? 0);
  return 12 * (octave + 1) + LETTER_PC[LETTERS.indexOf(name[0])] + shift;
}

/** Spells a chord from a root by stacking letters a third apart, e.g. ("Bb", "minor") -> Bb Db F. */
function spellChord(root: string, quality: ChordQuality): string[] {
  const rootMidi = midiOf(root, 4);
  return SHAPES[quality].map((semis, i) => {
    const letter = LETTERS[(LETTERS.indexOf(root[0]) + i * 2) % 7];
    const natural = midiOf(letter, 4) + (LETTERS.indexOf(letter) < LETTERS.indexOf(root[0]) ? 12 : 0);
    const diff = rootMidi + semis - natural;
    return letter + (diff > 0 ? "#".repeat(diff) : "b".repeat(-diff));
  });
}

/** Note names with octaves for the staff, rising from the root in octave 4. */
function staffNames(notes: string[]): string[] {
  let prev = -1;
  return notes.map((n) => {
    let octave = 4;
    while (midiOf(n, octave) <= prev) octave++;
    prev = midiOf(n, octave);
    return n + octave;
  });
}

function chordSound(root: string, quality: ChordQuality, octave = 3): Sound {
  const r = midiOf(root, octave);
  return { kind: "chord", notes: SHAPES[quality].map((s) => r + s) };
}

function progression(tonic: string, kind: "major" | "minor", degrees: number[], gap = 0.9): Sound {
  return { kind: "progression", chords: degrees.map((d) => diatonicChord(tonic, kind, d).midi), gap };
}

function choice(prompt: string, answer: string, wrong: string[], miss: string, extra: Partial<Extract<RushQuestion, { kind: "choice" }>> = {}): RushQuestion {
  return { kind: "choice", prompt, options: [answer, ...wrong], answer, miss, ...extra };
}

function others<T>(all: T[], answer: T, n: number): T[] {
  return all.filter((x) => x !== answer).slice(0, n);
}

function qualityByEar(root: string, quality: ChordQuality, pool: ChordQuality[]): RushQuestion {
  const notes = spellChord(root, quality);
  return choice(
    "What quality is this chord?",
    QUALITY_WORDS[quality],
    others(pool, quality, 3).map((q) => QUALITY_WORDS[q]),
    `${notes.map(pretty).join("–")} is ${QUALITY_WORDS[quality].toLowerCase()} (${chordSymbol(root, quality)})`,
    { visual: { type: "staff", notes: staffNames(notes), chord: true }, sound: chordSound(root, quality) },
  );
}

function notesForSymbol(root: string, quality: ChordQuality): RushQuestion {
  const spelled = (q: ChordQuality) => spellChord(root, q).map(pretty).join(" ");
  const nearest: Partial<Record<ChordQuality, ChordQuality[]>> = { major: ["minor", "aug"], minor: ["major", "dim"], dim: ["minor", "major"], aug: ["major", "minor"] };
  return choice(`Which notes spell ${chordSymbol(root, quality)}?`, spelled(quality), nearest[quality]!.map(spelled), `${chordSymbol(root, quality)} is ${spelled(quality)}`, {
    sound: chordSound(root, quality),
  });
}

function symbolForNotes(root: string, quality: ChordQuality): RushQuestion {
  const notes = spellChord(root, quality);
  const answer = chordSymbol(root, quality);
  const pool: ChordQuality[] = ["major", "minor", "dim", "aug"];
  return choice("What's the chord symbol?", answer, others(pool, quality, 3).map((q) => chordSymbol(root, q)), `${notes.map(pretty).join("–")} is ${answer}`, {
    visual: { type: "staff", notes: staffNames(notes), chord: true },
    sound: chordSound(root, quality),
  });
}

const INVERSIONS = ["Root position", "1st inversion", "2nd inversion", "3rd inversion"];

function inversion(root: string, quality: ChordQuality, inv: number): RushQuestion {
  const notes = spellChord(root, quality);
  const voiced = [...notes.slice(inv), ...notes.slice(0, inv)];
  const symbol = chordSymbol(root, quality) + (inv ? `/${pretty(voiced[0])}` : "");
  const r = midiOf(root, 3);
  const midi = SHAPES[quality].map((s, i) => r + s + (i < inv ? 12 : 0)).sort((a, b) => a - b);
  return choice(
    `${symbol}: which position?`,
    INVERSIONS[inv],
    others(INVERSIONS.slice(0, notes.length), INVERSIONS[inv], 3),
    `${pretty(voiced[0])} in the bass is the ${["root", "3rd", "5th", "7th"][inv]}, so ${INVERSIONS[inv].toLowerCase()}`,
    { visual: { type: "staff", notes: staffNames(voiced), chord: true }, sound: { kind: "chord", notes: midi } },
  );
}

function romanOf(tonic: string, kind: "major" | "minor", degree: number, seventh = false): RushQuestion {
  const c = diatonicChord(tonic, kind, degree, seventh);
  const all = [1, 2, 3, 4, 5, 6, 7].map((d) => diatonicChord(tonic, kind, d, seventh).roman);
  const near = [all[(degree + 5) % 7], all[degree % 7], all[(degree + 2) % 7]];
  return choice(`In ${pretty(tonic)} ${kind}, ${c.symbol} is…`, c.roman, near, `${c.symbol} is built on degree ${degree} of ${pretty(tonic)} ${kind}: ${c.roman}`, {
    sound: { kind: "chord", notes: c.midi },
  });
}

function chordOf(tonic: string, kind: "major" | "minor", degree: number, seventh = false): RushQuestion {
  const c = diatonicChord(tonic, kind, degree, seventh);
  const all = [1, 2, 3, 4, 5, 6, 7].map((d) => diatonicChord(tonic, kind, d, seventh).symbol);
  const near = [all[(degree + 5) % 7], all[degree % 7], all[(degree + 2) % 7]];
  return choice(`What's ${c.roman} in ${pretty(tonic)} ${kind}?`, c.symbol, near, `${c.roman} in ${pretty(tonic)} ${kind} is ${c.symbol} (${c.notes.map(pretty).join("–")})`, {
    sound: { kind: "chord", notes: c.midi },
  });
}

const CADENCES: Record<string, { degrees: number[]; word: string }> = {
  "Authentic (V–I)": { degrees: [5, 1], word: "V to I, the full stop" },
  "Plagal (IV–I)": { degrees: [4, 1], word: "IV to I, the 'amen' ending" },
  "Deceptive (V–vi)": { degrees: [5, 6], word: "V that dodges to vi" },
  "Half (ends on V)": { degrees: [4, 5], word: "a phrase that stops on V, like a comma" },
};

function cadenceByEar(tonic: string, name: string): RushQuestion {
  const lead = name.startsWith("Half") ? [1, 2] : [1, 4, 1];
  return choice("Listen to the ending. Which cadence?", name, others(Object.keys(CADENCES), name, 3), `That was ${CADENCES[name].word}`, {
    visual: { type: "big", text: "♪ … ?", caption: `In ${pretty(tonic)} major` },
    sound: progression(tonic, "major", [...lead, ...CADENCES[name].degrees], 0.75),
  });
}

const FUNCTIONS: Record<string, string[]> = {
  Tonic: ["I"],
  "Tonic prolongation": ["iii", "vi"],
  "Pre-dominant": ["ii", "IV"],
  Dominant: ["V", "vii°"],
};

function functionOf(roman: string): RushQuestion {
  const answer = Object.keys(FUNCTIONS).find((f) => FUNCTIONS[f].includes(roman))!;
  const degree = ["I", "ii", "iii", "IV", "V", "vi", "vii°"].indexOf(roman) + 1;
  return choice(`What job does ${roman} do?`, answer, others(Object.keys(FUNCTIONS), answer, 3), `${roman} has ${answer.toLowerCase()} function`, {
    sound: { kind: "chord", notes: diatonicChord("C", "major", degree).midi },
  });
}

/** Chord symbols for Roman numerals in a key, as one string like "G – D – Em – C". */
function spell(tonic: string, kind: "major" | "minor", degrees: number[]): string {
  return degrees.map((d) => diatonicChord(tonic, kind, d).symbol).join(" – ");
}

export const CHAPTERS_6_9: Unit[] = [
  {
    id: "triads",
    title: "Triads and chord symbols",
    chapter: "Chapter 6",
    summary: "Three notes stacked in thirds, and how lead sheets name them",
    lessons: [
      {
        id: "6.1",
        section: "6.1",
        title: "Four kinds of triad",
        summary: "Major, minor, diminished, augmented",
        steps: [
          {
            type: "story",
            cards: [
              { text: "A triad is three notes stacked in thirds: root, 3rd and 5th.", left: "C", right: "E G", label: "+ 3rd + 3rd", sound: chordSound("C", "major") },
              { text: "Major: a major 3rd, then a minor 3rd on top. Bright.", left: "C", right: "E G", label: "M3 + m3", sound: chordSound("C", "major") },
              { text: "Minor: a minor 3rd, then a major 3rd. Darker.", left: "C", right: "E♭ G", label: "m3 + M3", sound: chordSound("C", "minor") },
              { text: "Diminished: two minor 3rds. Tense and unstable.", left: "C", right: "E♭ G♭", label: "m3 + m3", sound: chordSound("C", "dim") },
              { text: "Augmented: two major 3rds. Dreamy, like it's floating.", left: "C", right: "E G♯", label: "M3 + M3", sound: chordSound("C", "aug") },
            ],
          },
          {
            type: "duel",
            rounds: [
              { question: "Which one is the major chord?", target: [0, 4, 7], other: [0, 3, 7], targetLabel: "major", why: "Major has the higher, brighter 3rd.", play: "chord" },
              { question: "Which one is the minor chord?", target: [0, 3, 7], other: [0, 4, 7], targetLabel: "minor", why: "Minor's 3rd is a fret lower, so it sounds darker." },
              { question: "Which one is diminished?", target: [0, 3, 6], other: [0, 3, 7], targetLabel: "diminished", why: "Diminished lowers the 5th too, so it sounds squeezed." },
              { question: "Which one is augmented?", target: [0, 4, 8], other: [0, 4, 7], targetLabel: "augmented", why: "Augmented raises the 5th, so it sounds unresolved." },
            ],
          },
          {
            type: "rush",
            seconds: 75,
            source: "Practice 6.6",
            questions: [
              qualityByEar("C", "major", ["major", "minor", "dim", "aug"]),
              qualityByEar("D", "minor", ["major", "minor", "dim", "aug"]),
              qualityByEar("G", "major", ["major", "minor", "dim", "aug"]),
              qualityByEar("B", "dim", ["major", "minor", "dim", "aug"]),
              qualityByEar("A", "minor", ["major", "minor", "dim", "aug"]),
              qualityByEar("F", "aug", ["major", "minor", "dim", "aug"]),
              qualityByEar("E", "minor", ["major", "minor", "dim", "aug"]),
              qualityByEar("Bb", "major", ["major", "minor", "dim", "aug"]),
            ],
          },
        ],
      },
      {
        id: "6.2",
        section: "6.2",
        title: "Reading chord symbols",
        summary: "C, Cm, C°, C+ on a lead sheet",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Lead sheets and chord charts name chords with a letter and a tag.", left: "Dm", right: "D F A", label: "=", sound: chordSound("D", "minor") },
              { text: "A letter on its own means major.", left: "F", right: "F A C", label: "=", sound: chordSound("F", "major") },
              { text: "Add 'm' for minor, '°' for diminished, '+' for augmented.", left: "Gm", right: "G°", label: "·", sound: { kind: "progression", chords: [[55, 58, 62], [55, 58, 61]], gap: 0.9 } },
              { text: "The symbol says which notes, not how to play them. Any voicing of C, E and G is a C chord.", sound: { kind: "progression", chords: [[48, 52, 55], [52, 55, 60], [48, 55, 64, 72]], gap: 0.8 } },
            ],
          },
          {
            type: "rush",
            seconds: 75,
            source: "Practice 6.6",
            questions: [
              notesForSymbol("D", "minor"),
              symbolForNotes("F", "major"),
              notesForSymbol("A", "major"),
              symbolForNotes("E", "minor"),
              notesForSymbol("B", "dim"),
              symbolForNotes("G", "major"),
              notesForSymbol("Eb", "major"),
              symbolForNotes("C", "aug"),
              notesForSymbol("F#", "minor"),
            ],
          },
        ],
      },
      {
        id: "6.3",
        section: "6.3–6.4",
        title: "Inversions and slash chords",
        summary: "Which note is in the bass",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Root position: the root is the lowest note.", left: "C", right: "E G", label: "root in bass", sound: { kind: "chord", notes: [48, 52, 55] } },
              { text: "1st inversion: the 3rd is in the bass. Written C/E.", left: "E", right: "G C", label: "C/E", sound: { kind: "chord", notes: [52, 55, 60] } },
              { text: "2nd inversion: the 5th is in the bass. Written C/G.", left: "G", right: "C E", label: "C/G", sound: { kind: "chord", notes: [55, 60, 64] } },
              { text: "Slash chords walk the bass. Try C – C/B – Am: the bass slides down.", sound: { kind: "progression", chords: [[48, 52, 55], [47, 52, 55], [45, 52, 57]], gap: 0.9 } },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Practice 6.6",
            questions: [
              inversion("C", "major", 1),
              inversion("G", "major", 0),
              inversion("D", "minor", 2),
              inversion("F", "major", 1),
              inversion("A", "minor", 1),
              inversion("E", "major", 2),
              inversion("G", "major", 1),
            ],
          },
        ],
      },
      {
        id: "6.5",
        section: "6.5",
        title: "Sus chords",
        summary: "Swap the 3rd for a 2nd or a 4th",
        steps: [
          {
            type: "story",
            cards: [
              { text: "A sus chord takes out the 3rd, so it's neither major nor minor.", left: "C", right: "E", label: "3rd out", sound: chordSound("C", "major") },
              { text: "Sus4 puts the 4th where the 3rd was. It wants to fall back to the 3rd.", left: "Csus4", right: "C", label: "F → E", sound: { kind: "progression", chords: [[48, 53, 55], [48, 52, 55]], gap: 1 } },
              { text: "Sus2 uses the 2nd instead. Open and airy, very guitar.", left: "Csus2", right: "C D G", label: "=", sound: { kind: "chord", notes: [48, 50, 55] } },
              { text: "On guitar: play Dsus4, Dsus2 and D by moving one finger on the high E string.", sound: { kind: "progression", chords: [[50, 57, 62, 67], [50, 57, 62, 64], [50, 57, 62, 66]], gap: 0.9 } },
            ],
          },
          {
            type: "duel",
            rounds: [
              { question: "Which one is the sus4?", target: [0, 5, 7], other: [0, 4, 7], targetLabel: "sus4", why: "The sus4 has a 4th that leans down toward the 3rd.", play: "chord" },
              { question: "Which one is the sus2?", target: [0, 2, 7], other: [0, 3, 7], targetLabel: "sus2", why: "The sus2 sounds open, with no 3rd at all.", play: "chord" },
            ],
          },
          {
            type: "rush",
            seconds: 45,
            source: "Practice 6.6",
            questions: [
              choice("Which notes spell Gsus4?", "G C D", ["G B D", "G A D"], "Gsus4 swaps B for C: G C D"),
              choice("Which notes spell Dsus2?", "D E A", ["D F♯ A", "D G A"], "Dsus2 swaps F♯ for E: D E A"),
              choice("Which notes spell Asus4?", "A D E", ["A C♯ E", "A B E"], "Asus4 swaps C♯ for D: A D E"),
              choice("Which notes spell Csus2?", "C D G", ["C E G", "C F G"], "Csus2 swaps E for D: C D G"),
              choice("A sus chord leaves out the…", "3rd", ["Root", "5th"], "Sus chords drop the 3rd"),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "roman-numerals",
    title: "Roman numerals and cadences",
    chapter: "Chapter 7",
    summary: "Chords as numbers in a key, and how phrases end",
    lessons: [
      {
        id: "7.1",
        section: "7.1–7.2",
        title: "Chords in a major key",
        summary: "I ii iii IV V vi vii°",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Build a triad on every note of the scale and you get seven chords that fit the key.", sound: progression("C", "major", [1, 2, 3, 4, 5, 6, 7, 1], 0.55) },
              { text: "Roman numerals name them by scale degree. Uppercase is major.", left: "I IV V", right: "C F G", label: "major", sound: progression("C", "major", [1, 4, 5], 0.8) },
              { text: "Lowercase is minor.", left: "ii iii vi", right: "Dm Em Am", label: "minor", sound: progression("C", "major", [2, 3, 6], 0.8) },
              { text: "vii° is the one diminished chord.", left: "vii°", right: "B°", label: "dim", sound: progression("C", "major", [7, 1], 0.9) },
              { text: "Numbers work in every key. I–IV–V in G is G–C–D. Same song, new key.", sound: progression("G", "major", [1, 4, 5, 1], 0.8) },
            ],
          },
          {
            type: "rush",
            seconds: 75,
            source: "Practice 7.5",
            questions: [
              chordOf("C", "major", 5),
              romanOf("G", "major", 6),
              chordOf("D", "major", 4),
              romanOf("C", "major", 2),
              chordOf("G", "major", 2),
              romanOf("F", "major", 5),
              chordOf("A", "major", 6),
              romanOf("D", "major", 7),
              chordOf("E", "major", 4),
            ],
          },
        ],
      },
      {
        id: "7.3",
        section: "7.3",
        title: "Chords in a minor key",
        summary: "i ii° III iv V VI VII",
        steps: [
          {
            type: "story",
            cards: [
              { text: "In minor, the home chord is minor: i.", left: "i", right: "Am", label: "home", sound: progression("A", "minor", [1], 1) },
              { text: "III, VI and VII are major. Am – F – G – Am is all over pop and rock.", sound: progression("A", "minor", [1, 6, 7, 1], 0.8) },
              { text: "V is usually major too, borrowing the raised 7th (G♯) so it pulls home harder.", left: "v", right: "V", label: "Em → E", sound: { kind: "progression", chords: [[52, 55, 59], [45, 48, 52], [52, 56, 59], [45, 48, 52]], gap: 0.8 } },
              { text: "ii° is diminished, and vii° uses that raised 7th as well.", left: "ii°", right: "B°", label: "dim", sound: progression("A", "minor", [2, 5, 1], 0.8) },
            ],
          },
          {
            type: "rush",
            seconds: 75,
            source: "Practice 7.5",
            questions: [
              chordOf("A", "minor", 6),
              chordOf("E", "minor", 5),
              romanOf("A", "minor", 3),
              chordOf("D", "minor", 4),
              romanOf("E", "minor", 6),
              chordOf("B", "minor", 3),
              romanOf("D", "minor", 2),
              chordOf("A", "minor", 5),
            ],
          },
        ],
      },
      {
        id: "7.4",
        section: "7.4",
        title: "Cadences",
        summary: "How phrases end: full stop, comma, surprise",
        steps: [
          {
            type: "story",
            cards: [
              { text: "A cadence is where a phrase lands, like punctuation in a sentence.", sound: progression("C", "major", [1, 4, 5, 1]) },
              { text: "Authentic: V to I. The full stop.", left: "V", right: "I", label: "AC", sound: progression("C", "major", [5, 1]) },
              { text: "Plagal: IV to I. The 'amen' at the end of a hymn.", left: "IV", right: "I", label: "PC", sound: progression("C", "major", [4, 1]) },
              { text: "Half: the phrase stops on V. A comma, it wants to keep going.", left: "…", right: "V", label: "HC", sound: progression("C", "major", [1, 4, 5]) },
              { text: "Deceptive: V goes to vi instead of I. A plot twist.", left: "V", right: "vi", label: "DC", sound: progression("C", "major", [5, 6]) },
            ],
          },
          {
            type: "rush",
            seconds: 90,
            source: "Practice 7.5",
            questions: [
              cadenceByEar("C", "Authentic (V–I)"),
              cadenceByEar("G", "Half (ends on V)"),
              cadenceByEar("F", "Deceptive (V–vi)"),
              cadenceByEar("D", "Plagal (IV–I)"),
              cadenceByEar("C", "Deceptive (V–vi)"),
              cadenceByEar("A", "Authentic (V–I)"),
              cadenceByEar("E", "Half (ends on V)"),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "sevenths",
    title: "Seventh chords",
    chapter: "Chapter 8",
    summary: "Four-note chords: maj7, 7, m7, ø7, °7",
    lessons: [
      {
        id: "8.1",
        section: "8.1",
        title: "Five seventh chords",
        summary: "Add one more 3rd on top",
        steps: [
          {
            type: "story",
            cards: [
              { text: "A seventh chord stacks one more 3rd on a triad.", left: "C E G", right: "B", label: "+ 7th", sound: chordSound("C", "maj7") },
              { text: "Major 7th (Cmaj7): major triad, major 7th. Smooth and jazzy.", left: "Cmaj7", right: "C E G B", label: "=", sound: chordSound("C", "maj7") },
              { text: "Dominant 7th (C7): major triad, minor 7th. Bluesy, wants to move.", left: "C7", right: "C E G B♭", label: "=", sound: chordSound("C", "7") },
              { text: "Minor 7th (Cm7): minor triad, minor 7th. Mellow.", left: "Cm7", right: "C E♭ G B♭", label: "=", sound: chordSound("C", "m7") },
              { text: "Half-diminished (Cø7): diminished triad, minor 7th.", left: "Cø7", right: "C E♭ G♭ B♭", label: "=", sound: chordSound("C", "ø7") },
              { text: "Fully diminished (C°7): diminished triad, diminished 7th. Spooky.", left: "C°7", right: "C E♭ G♭ B𝄫", label: "=", sound: chordSound("C", "°7") },
            ],
          },
          {
            type: "duel",
            rounds: [
              { question: "Which one is the major 7th?", target: [0, 4, 7, 11], other: [0, 4, 7, 10], targetLabel: "maj7", why: "The maj7 has a 7th just a half step under the octave, so it shimmers.", play: "chord" },
              { question: "Which one is the dominant 7th?", target: [0, 4, 7, 10], other: [0, 3, 7, 10], targetLabel: "dom 7", why: "The dominant 7th has a major 3rd under the minor 7th.", play: "chord" },
              { question: "Which one is the minor 7th?", target: [0, 3, 7, 10], other: [0, 4, 7, 11], targetLabel: "m7", why: "Minor 3rd, minor 7th: soft and mellow.", play: "chord" },
            ],
          },
          {
            type: "rush",
            seconds: 75,
            source: "Practice 8.4",
            questions: [
              qualityByEar("C", "maj7", ["maj7", "7", "m7", "ø7"]),
              qualityByEar("G", "7", ["maj7", "7", "m7", "ø7"]),
              qualityByEar("D", "m7", ["maj7", "7", "m7", "ø7"]),
              qualityByEar("B", "ø7", ["maj7", "7", "m7", "ø7"]),
              qualityByEar("F", "maj7", ["maj7", "7", "m7", "ø7"]),
              qualityByEar("A", "m7", ["maj7", "7", "m7", "ø7"]),
              qualityByEar("E", "7", ["maj7", "7", "m7", "ø7"]),
            ],
          },
        ],
      },
      {
        id: "8.3",
        section: "8.2–8.3",
        title: "Seventh chords in a key",
        summary: "Imaj7 ii7 iii7 IVmaj7 V7 vi7 viiø7",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Add the 7th to every chord in a major key and you get this.", sound: { kind: "progression", chords: [1, 2, 3, 4, 5, 6, 7].map((d) => diatonicChord("C", "major", d, true).midi), gap: 0.6 } },
              { text: "I and IV become maj7. ii, iii and vi become m7.", left: "Cmaj7", right: "Dm7", label: "I · ii", sound: { kind: "progression", chords: [diatonicChord("C", "major", 1, true).midi, diatonicChord("C", "major", 2, true).midi], gap: 1 } },
              { text: "Only V gets the dominant 7th. That's why it pulls so hard to I.", left: "G7", right: "C", label: "V7 → I", sound: { kind: "progression", chords: [diatonicChord("C", "major", 5, true).midi, diatonicChord("C", "major", 1).midi], gap: 1 } },
              { text: "Pop trick: F/G (IV over 5 in the bass) stands in for G7. Softer, same pull.", left: "F/G", right: "C", label: "→", sound: { kind: "progression", chords: [[43, 53, 57, 60], [48, 52, 55, 60]], gap: 1 } },
            ],
          },
          {
            type: "rush",
            seconds: 75,
            source: "Practice 8.4",
            questions: [
              chordOf("C", "major", 5, true),
              romanOf("G", "major", 2, true),
              chordOf("F", "major", 4, true),
              romanOf("D", "major", 7, true),
              chordOf("G", "major", 6, true),
              romanOf("C", "major", 1, true),
              chordOf("D", "major", 5, true),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "progressions",
    title: "Chord progressions",
    chapter: "Chapter 9",
    summary: "Why chords go where they go, and the progressions pop is built on",
    lessons: [
      {
        id: "9.1",
        section: "9.1–9.3",
        title: "The circle of fifths progression",
        summary: "vi – ii – V – I and friends",
        steps: [
          {
            type: "story",
            cards: [
              { text: "The strongest move in harmony is a root falling a 5th, like G to C.", left: "V", right: "I", label: "down a 5th", sound: progression("C", "major", [5, 1]) },
              { text: "Chain it and you get the circle: I – IV – vii° – iii – vi – ii – V – I.", sound: progression("C", "major", [1, 4, 7, 3, 6, 2, 5, 1], 0.6) },
              { text: "Songs mostly use the tail end. ii – V – I is the backbone of jazz.", left: "Dm G", right: "C", label: "ii V I", sound: progression("C", "major", [2, 5, 1]) },
              { text: "vi – ii – V – I adds one more link.", left: "Am Dm", right: "G C", label: "vi ii V I", sound: progression("C", "major", [6, 2, 5, 1]) },
              { text: "Harmonic rhythm is how often the chord changes. Faster changes feel busier.", sound: { kind: "progression", chords: [1, 1, 4, 4, 5, 5, 1, 1].map((d) => diatonicChord("C", "major", d).midi), gap: 0.4 } },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Practice 9.9",
            questions: [
              choice("What comes next? ii – V – …", "I", ["IV", "vi"], "ii – V – I: each root falls a 5th"),
              choice("What comes next? vi – ii – …", "V", ["IV", "iii"], "vi – ii – V: A, D, G, each down a 5th"),
              choice("In C major, ii – V – I is…", spell("C", "major", [2, 5, 1]), [spell("C", "major", [4, 5, 1]), spell("C", "major", [2, 4, 1])], `ii – V – I in C is ${spell("C", "major", [2, 5, 1])}`),
              choice("In G major, vi – ii – V – I is…", spell("G", "major", [6, 2, 5, 1]), [spell("G", "major", [6, 4, 5, 1]), spell("G", "major", [3, 6, 2, 5])], `vi – ii – V – I in G is ${spell("G", "major", [6, 2, 5, 1])}`),
              choice("What comes before V in the circle?", "ii", ["IV", "vi"], "…vi – ii – V – I"),
              choice("In F major, ii – V – I is…", spell("F", "major", [2, 5, 1]), [spell("F", "major", [4, 5, 1]), spell("F", "major", [6, 5, 1])], `ii – V – I in F is ${spell("F", "major", [2, 5, 1])}`),
            ],
          },
        ],
      },
      {
        id: "9.4",
        section: "9.4–9.5",
        title: "What each chord does",
        summary: "Home, prolong, set up, pull back",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Chords have jobs. I is home (tonic): nothing needs to happen next.", left: "I", right: "home", label: "tonic", sound: progression("C", "major", [1], 1) },
              { text: "iii and vi stretch out home. They share two notes with I.", left: "vi", right: "I", label: "prolong", sound: progression("C", "major", [1, 6], 1) },
              { text: "ii and IV set up the dominant (pre-dominant).", left: "ii · IV", right: "V", label: "→", sound: progression("C", "major", [4, 5], 1) },
              { text: "V and vii° pull back to I (dominant). They hold the leading tone.", left: "V", right: "I", label: "pull", sound: progression("C", "major", [5, 1], 1) },
              { text: "So most songs go: home → set up → pull → home.", sound: progression("C", "major", [1, 6, 4, 5, 1], 0.75) },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Section 9.4",
            questions: [
              functionOf("V"),
              functionOf("IV"),
              functionOf("I"),
              functionOf("vi"),
              functionOf("ii"),
              functionOf("vii°"),
              functionOf("iii"),
              choice("After a pre-dominant chord, the usual next stop is…", "Dominant", ["Tonic prolongation", "Pre-dominant"], "Pre-dominant chords set up the dominant"),
            ],
          },
        ],
      },
      {
        id: "9.7",
        section: "9.6–9.8",
        title: "The progressions pop is built on",
        summary: "I–V–vi–IV, ♭VII, and i–VII–VI–VII",
        steps: [
          {
            type: "story",
            cards: [
              { text: "The 'best-seller': I – V – vi – IV. Thousands of hits use it.", left: "C G", right: "Am F", label: "I V vi IV", sound: progression("C", "major", [1, 5, 6, 4], 0.75) },
              { text: "Start on vi and it turns moody: vi – IV – I – V.", left: "Am F", right: "C G", label: "vi IV I V", sound: progression("C", "major", [6, 4, 1, 5], 0.75) },
              { text: "Rock borrows ♭VII from minor: D – C – G – D. The C isn't in D major.", left: "I", right: "♭VII", label: "D → C", sound: { kind: "progression", chords: [[50, 54, 57], [48, 52, 55], [43, 47, 50], [50, 54, 57]], gap: 0.75 } },
              { text: "In minor: i – VII – VI – VII. Am – G – F – G, a cousin of the flamenco descent.", sound: { kind: "progression", chords: [[45, 48, 52], [43, 47, 50], [41, 45, 48], [43, 47, 50]], gap: 0.75 } },
            ],
          },
          {
            type: "rush",
            seconds: 75,
            source: "Practice 9.9",
            questions: [
              choice("I – V – vi – IV in G major is…", spell("G", "major", [1, 5, 6, 4]), [spell("G", "major", [1, 4, 6, 5]), spell("G", "major", [1, 5, 4, 6])], `I – V – vi – IV in G is ${spell("G", "major", [1, 5, 6, 4])}`),
              choice("Listen. Which progression?", "I – V – vi – IV", ["vi – IV – I – V", "I – IV – V – I"], "That's the best-seller: I – V – vi – IV", { sound: progression("D", "major", [1, 5, 6, 4], 0.7) }),
              choice("I – V – vi – IV in D major is…", spell("D", "major", [1, 5, 6, 4]), [spell("D", "major", [1, 4, 5, 6]), spell("D", "major", [6, 4, 1, 5])], `I – V – vi – IV in D is ${spell("D", "major", [1, 5, 6, 4])}`),
              choice("Listen. Which progression?", "vi – IV – I – V", ["I – V – vi – IV", "ii – V – I – I"], "Starting on vi gives the moody version: vi – IV – I – V", { sound: progression("C", "major", [6, 4, 1, 5], 0.7) }),
              choice("The ♭VII chord in G major is…", "F", ["F♯°", "E"], "♭VII lowers the 7th: in G, F major"),
              choice("i – VII – VI – VII in E minor is…", "Em – D – C – D", ["Em – D♯° – C – D♯°", "Em – C – D – C"], "i – VII – VI – VII in E minor is Em – D – C – D"),
              choice("The ♭VII chord in A major is…", "G", ["G♯°", "F♯m"], "♭VII lowers the 7th: in A, G major"),
            ],
          },
        ],
      },
    ],
  },
];

export const CHORD_HELPERS = { spellChord, staffNames };
