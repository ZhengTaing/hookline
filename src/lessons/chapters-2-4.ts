import { keySignature, pretty, scaleMidi, spellScale } from "../music";
import type { RushQuestion, Unit } from "./types";

// Chapters 2-4 of Hutchinson, "Music Theory for the 21st-Century Classroom":
// major scales and key signatures, minor scales, and rhythm.

const MAJOR_KEYS_BY_SIG: Record<number, string> = { 0: "C", 1: "G", 2: "D", 3: "A", 4: "E", 5: "B", [-1]: "F", [-2]: "Bb", [-3]: "Eb", [-4]: "Ab", [-5]: "Db" };
const MINOR_KEYS_BY_SIG: Record<number, string> = { 0: "A", 1: "E", 2: "B", 3: "F#", 4: "C#", [-1]: "D", [-2]: "G", [-3]: "C", [-4]: "F", [-5]: "Bb" };

/** Picks three wrong answers near the right one, so options stay plausible. */
function optionsAround(answer: string, pool: string[]): string[] {
  const i = pool.indexOf(answer);
  const near = [pool[i - 1], pool[i + 1], pool[i + 2], pool[i - 2]].filter((x): x is string => !!x && x !== answer);
  return [answer, ...near.slice(0, 3)];
}

function halfOrWhole(lower: string, upper: string, answer: "Half step" | "Whole step"): RushQuestion {
  return {
    kind: "choice",
    prompt: "Half step or whole step?",
    options: ["Half step", "Whole step"],
    answer,
    visual: { type: "staff", notes: [lower, upper] },
    sound: { kind: "melodic", notes: [], gap: 0.45 },
    miss: `${pretty(lower)} to ${pretty(upper)} is a ${answer.toLowerCase()}`,
  };
}

function missingNote(tonic: string): RushQuestion {
  const scale = spellScale(tonic, "major");
  const hidden = 6; // the 7th note, where most mistakes happen
  const right = pretty(scale[hidden]);
  const letter = scale[hidden][0];
  const wrong = [letter, `${letter}#`, `${letter}b`].map(pretty).filter((x) => x !== right);
  const shown = scale.map((n, i) => (i === hidden ? "__" : pretty(n))).join(" ");
  return {
    kind: "choice",
    prompt: `Finish the ${pretty(tonic)} major scale`,
    options: [right, ...wrong.slice(0, 2)],
    answer: right,
    visual: { type: "big", text: shown, caption: "W W H W W W H" },
    sound: { kind: "melodic", notes: scaleMidi(scale), gap: 0.22 },
    miss: `The 7th note of ${pretty(tonic)} major is ${right}`,
  };
}

function majorKeyFromSig(sig: number): RushQuestion {
  const key = MAJOR_KEYS_BY_SIG[sig];
  const pool = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((n) => `${pretty(MAJOR_KEYS_BY_SIG[n])} major`);
  const answer = `${pretty(key)} major`;
  return {
    kind: "choice",
    prompt: "Which major key has this signature?",
    options: optionsAround(answer, pool),
    answer,
    visual: { type: "staff", notes: [], keySig: sig },
    miss: `${Math.abs(sig)} ${sig > 0 ? "sharp" : "flat"}${Math.abs(sig) === 1 ? "" : "s"} is ${answer}`,
  };
}

function minorKeyFromSig(sig: number): RushQuestion {
  const key = MINOR_KEYS_BY_SIG[sig];
  const pool = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4].map((n) => `${pretty(MINOR_KEYS_BY_SIG[n])} minor`);
  const answer = `${pretty(key)} minor`;
  return {
    kind: "choice",
    prompt: "Which minor key has this signature?",
    options: optionsAround(answer, pool),
    answer,
    visual: { type: "staff", notes: [], keySig: sig },
    miss: `${Math.abs(sig)} ${sig > 0 ? "sharp" : "flat"}${Math.abs(sig) === 1 ? "" : "s"} is ${answer}`,
  };
}

function relativeMinor(major: string): RushQuestion {
  const minor = spellScale(major, "major")[5];
  const answer = `${pretty(minor)} minor`;
  const pool = ["C", "D", "E", "F", "G", "A", "B"].map((l) => `${l} minor`);
  const letterAnswer = `${minor[0]} minor`;
  const options = [answer, ...optionsAround(letterAnswer, pool).filter((o) => o !== letterAnswer && o !== answer).slice(0, 3)];
  return {
    kind: "choice",
    prompt: `What's the relative minor of ${pretty(major)} major?`,
    options,
    answer,
    sound: { kind: "chord", notes: [] },
    miss: `${pretty(major)} major and ${answer} share a key signature`,
  };
}

const DEGREE_NAMES = ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading tone"];

function degreeName(tonic: string, degree: number): RushQuestion {
  const note = pretty(spellScale(tonic, "major")[degree - 1]);
  const answer = DEGREE_NAMES[degree - 1];
  return {
    kind: "choice",
    prompt: `In ${pretty(tonic)} major, ${note} is the…`,
    options: optionsAround(answer, DEGREE_NAMES),
    answer,
    miss: `In ${pretty(tonic)} major, ${note} is the ${answer.toLowerCase()} (degree ${degree})`,
  };
}

function choice(prompt: string, answer: string, wrong: string[], miss: string, extra: Partial<RushQuestion> = {}): RushQuestion {
  return { kind: "choice", prompt, options: [answer, ...wrong], answer, miss, ...extra } as RushQuestion;
}

// Fill in sounds that need the spelled notes.
function withIntervalSound(q: RushQuestion): RushQuestion {
  if (q.kind !== "choice" || q.visual?.type !== "staff" || q.sound?.kind !== "melodic" || q.sound.notes.length) return q;
  const midi = q.visual.notes.map((n) => {
    const m = /^([A-G])([#b]?)(\d)$/.exec(n)!;
    return 12 * (Number(m[3]) + 1) + [0, 2, 4, 5, 7, 9, 11]["CDEFGAB".indexOf(m[1])] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0);
  });
  return { ...q, sound: { ...q.sound, notes: midi } };
}

function withMinorChord(q: RushQuestion, minor: string): RushQuestion {
  if (q.kind !== "choice") return q;
  const root = scaleMidi(spellScale(minor, "minor"))[0] - 12;
  return { ...q, sound: { kind: "chord", notes: [root, root + 3, root + 7] } };
}

const A_MINOR = scaleMidi(spellScale("A", "minor")).map((n) => n - 12);
const A_HARMONIC = scaleMidi(spellScale("A", "minor", [7])).map((n) => n - 12);
const A_MELODIC = scaleMidi(spellScale("A", "minor", [6, 7])).map((n) => n - 12);

export const CHAPTERS_2_4: Unit[] = [
  {
    id: "major-scales",
    title: "Major scales and key signatures",
    chapter: "Chapter 2",
    summary: "W W H W W W H, and the keys built from it",
    lessons: [
      {
        id: "2.1",
        section: "2.1",
        title: "Half steps and whole steps",
        summary: "One fret, or two",
        steps: [
          {
            type: "story",
            cards: [
              { text: "A half step is the nearest note. One fret.", left: "C", right: "C♯", label: "H", sound: { kind: "melodic", notes: [60, 61] } },
              { text: "A whole step is two half steps. Two frets.", left: "C", right: "D", label: "W", sound: { kind: "melodic", notes: [60, 62] } },
              { text: "E to F and B to C are half steps, with no sharp between.", left: "E", right: "F", label: "H", sound: { kind: "melodic", notes: [64, 65, 71, 72] } },
            ],
          },
          {
            type: "duel",
            rounds: [
              { question: "Which pair is a whole step?", target: [0, 2], other: [0, 1], targetLabel: "whole step", why: "Two frets apart. The half step sounds tighter." },
              { question: "Which pair is a half step?", target: [0, 1], other: [0, 2], targetLabel: "half step", why: "One fret apart, the smallest step." },
            ],
          },
          {
            type: "rush",
            seconds: 45,
            source: "Section 2.1",
            questions: [
              halfOrWhole("E4", "F4", "Half step"),
              halfOrWhole("C4", "D4", "Whole step"),
              halfOrWhole("B4", "C5", "Half step"),
              halfOrWhole("F4", "G4", "Whole step"),
              halfOrWhole("A4", "Bb4", "Half step"),
              halfOrWhole("D4", "E4", "Whole step"),
              halfOrWhole("G4", "Ab4", "Half step"),
            ].map(withIntervalSound),
          },
        ],
      },
      {
        id: "2.2",
        section: "2.2",
        title: "The major scale",
        summary: "W W H W W W H, every letter once",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Every major scale follows one pattern.", left: "C", right: "C", label: "8 notes", sound: { kind: "melodic", notes: [60, 62, 64, 65, 67, 69, 71, 72], gap: 0.22 } },
              { text: "Whole, whole, half.", left: "C", right: "F", label: "W W H", sound: { kind: "melodic", notes: [60, 62, 64, 65], gap: 0.3 } },
              { text: "A whole step to connect…", left: "F", right: "G", label: "W", sound: { kind: "melodic", notes: [65, 67] } },
              { text: "…then whole, whole, half again.", left: "G", right: "C", label: "W W H", sound: { kind: "melodic", notes: [67, 69, 71, 72], gap: 0.3 } },
              { text: "Use every letter once. D major has F♯, not G♭.", left: "D", right: "D", label: "D E F♯ G A B C♯", sound: { kind: "melodic", notes: scaleMidi(spellScale("D", "major")), gap: 0.22 } },
            ],
          },
          {
            type: "duel",
            rounds: [
              { question: "Which one is a major scale?", target: [0, 2, 4, 5, 7, 9, 11, 12], other: [0, 2, 3, 5, 7, 9, 11, 12], targetLabel: "major scale", why: "The other one has a lowered 3rd, so it sounds off and darker.", play: "melodic" },
              { question: "Which one ends like a major scale?", target: [5, 7, 9, 11, 12], other: [5, 7, 9, 10, 12], targetLabel: "major scale ending", why: "A major scale climbs to the top with a half step: the leading tone pulls into the tonic.", play: "melodic" },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Practice 2.4 · exercise 1",
            questions: ["G", "D", "A", "E", "F", "Bb", "Eb"].map(missingNote),
          },
        ],
      },
      {
        id: "2.3",
        section: "2.3",
        title: "Major key signatures",
        summary: "Read the key from the sharps and flats",
        steps: [
          {
            type: "story",
            cards: [
              { text: "A key signature lists the sharps or flats once, at the start.", left: "G", right: "F♯", label: "1 sharp", sound: { kind: "melodic", notes: scaleMidi(spellScale("G", "major")), gap: 0.2 } },
              { text: "Sharps always come in order: F C G D A E B.", left: "F♯", right: "B♯", label: "Fast Cars Go Dangerously…", sound: { kind: "melodic", notes: [66, 61, 68, 63, 70, 65, 72], gap: 0.25 } },
              { text: "Flats are the reverse: B E A D G C F.", left: "B♭", right: "F♭", label: "BEAD + GCF", sound: { kind: "melodic", notes: [70, 63, 68, 61, 66, 59, 64], gap: 0.25 } },
              { text: "Sharps: go up a half step from the last sharp. That's the key.", left: "F♯", right: "G", label: "+½", sound: { kind: "chord", notes: [55, 59, 62] } },
              { text: "Flats: the second-to-last flat is the key.", left: "B♭", right: "E♭", label: "E♭ major", sound: { kind: "chord", notes: [51, 55, 58] } },
            ],
          },
          {
            type: "rush",
            seconds: 75,
            source: "Practice 2.4",
            questions: [1, 2, 3, 4, -1, -2, -3, -4, 5].map(majorKeyFromSig),
          },
        ],
      },
    ],
  },
  {
    id: "minor-scales",
    title: "Minor scales and keys",
    chapter: "Chapter 3",
    summary: "Three minor scales, relative keys, degree names",
    lessons: [
      {
        id: "3.1",
        section: "3.1",
        title: "Three minor scales",
        summary: "Natural, harmonic, melodic",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Natural minor: a major scale with the 3rd, 6th and 7th lowered.", left: "A", right: "A", label: "natural", sound: { kind: "melodic", notes: A_MINOR, gap: 0.22 } },
              { text: "Harmonic minor raises the 7th. Hear the exotic jump at the top.", left: "G", right: "G♯", label: "raised 7th", sound: { kind: "melodic", notes: A_HARMONIC, gap: 0.22 } },
              { text: "Melodic minor raises the 6th and 7th going up…", left: "F♯", right: "G♯", label: "raised 6, 7", sound: { kind: "melodic", notes: A_MELODIC, gap: 0.22 } },
              { text: "…and comes back down as natural minor.", left: "A", right: "A", label: "down", sound: { kind: "melodic", notes: [...A_MINOR].reverse(), gap: 0.22 } },
            ],
          },
          {
            type: "duel",
            rounds: [
              { question: "Which one is harmonic minor?", target: [0, 2, 3, 5, 7, 8, 11, 12], other: [0, 2, 3, 5, 7, 8, 10, 12], targetLabel: "harmonic minor", why: "Harmonic minor has the raised 7th: the wide jump right before the top note.", play: "melodic" },
              { question: "Which one is natural minor?", target: [0, 2, 3, 5, 7, 8, 10, 12], other: [0, 2, 4, 5, 7, 9, 11, 12], targetLabel: "natural minor", why: "The other one is major. Natural minor has the lowered 3rd, 6th and 7th.", play: "melodic" },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Practice 3.4",
            questions: [
              choice("Which minor scale is this?", "Harmonic", ["Natural", "Melodic"], "Harmonic minor raises only the 7th", { sound: { kind: "melodic", notes: A_HARMONIC, gap: 0.2 } }),
              choice("Which minor scale is this?", "Natural", ["Harmonic", "Melodic"], "Natural minor has no raised notes", { sound: { kind: "melodic", notes: A_MINOR, gap: 0.2 } }),
              choice("Which minor scale is this?", "Melodic", ["Natural", "Harmonic"], "Melodic minor raises the 6th and 7th going up", { sound: { kind: "melodic", notes: A_MELODIC, gap: 0.2 } }),
              choice("What's the 7th note of A harmonic minor?", "G♯", ["G", "A♭", "F♯"], "A harmonic minor raises G to G♯"),
              choice("What's the 3rd note of C natural minor?", "E♭", ["E", "D♯", "F"], "C minor has E♭ as its 3rd"),
              choice("What's the 7th note of E harmonic minor?", "D♯", ["D", "E♭", "C♯"], "E harmonic minor raises D to D♯"),
              choice("Melodic minor, coming down, is the same as…", "Natural minor", ["Harmonic minor", "Major"], "Melodic minor descends as natural minor"),
            ],
          },
        ],
      },
      {
        id: "3.2",
        section: "3.2",
        title: "Minor keys and relative minors",
        summary: "Every major key has a minor twin",
        steps: [
          {
            type: "story",
            cards: [
              { text: "C major and A minor use the same notes.", left: "C", right: "A", label: "same notes", sound: { kind: "chord", notes: [48, 52, 55, 57, 60, 64] } },
              { text: "So they share a key signature. A minor is C's relative minor.", left: "C", right: "Am", label: "relatives", sound: { kind: "chord", notes: [57, 60, 64] } },
              { text: "To find it, go down three half steps from the major key.", left: "C", right: "A", label: "−3 frets", sound: { kind: "melodic", notes: [60, 59, 58, 57], gap: 0.3 } },
              { text: "E♭ major, down three half steps: C minor. Both have three flats.", left: "E♭", right: "Cm", label: "3 flats", sound: { kind: "chord", notes: [48, 51, 55] } },
            ],
          },
          {
            type: "rush",
            seconds: 75,
            source: "Practice 3.4",
            questions: [
              ...["C", "G", "F", "D", "Bb"].map((k) => withMinorChord(relativeMinor(k), spellScale(k, "major")[5])),
              minorKeyFromSig(1),
              minorKeyFromSig(-3),
              minorKeyFromSig(-1),
              minorKeyFromSig(2),
            ],
          },
        ],
      },
      {
        id: "3.3",
        section: "3.3",
        title: "Scale degree names",
        summary: "Tonic, dominant and the rest",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Degree 1 is the tonic: home.", left: "1", right: "C", label: "tonic", sound: { kind: "melodic", notes: [60] } },
              { text: "Degree 5 is the dominant, the strongest pull home.", left: "5", right: "G", label: "dominant", sound: { kind: "melodic", notes: [67, 60] } },
              { text: "Degree 4 is the subdominant: the dominant below the tonic.", left: "4", right: "F", label: "subdominant", sound: { kind: "melodic", notes: [65, 60] } },
              { text: "3 is the mediant, 6 the submediant, halfway to each dominant.", left: "3", right: "6", label: "mediants", sound: { kind: "melodic", notes: [64, 69] } },
              { text: "2 is the supertonic. 7 is the leading tone, a half step below home.", left: "7", right: "1", label: "leading tone", sound: { kind: "melodic", notes: [71, 72] } },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Practice 3.4",
            questions: [degreeName("C", 5), degreeName("G", 4), degreeName("D", 7), degreeName("F", 6), degreeName("A", 2), degreeName("E", 3), degreeName("Bb", 1)],
          },
        ],
      },
    ],
  },
  {
    id: "rhythm",
    title: "Rhythm and meter",
    chapter: "Chapter 4",
    summary: "Beats, note values, time signatures",
    lessons: [
      {
        id: "4.1",
        section: "4.1–4.2",
        title: "Time signatures and note values",
        summary: "How many beats, and of what",
        steps: [
          {
            type: "story",
            cards: [
              { text: "4/4: the top number says how many beats in a bar.", left: "4", right: "♩", label: "beats", sound: { kind: "melodic", notes: [84, 79, 79, 79], gap: 0.5 } },
              { text: "The bottom number says which note gets the beat. 4 means a quarter note.", left: "4", right: "♩", label: "of what", sound: { kind: "melodic", notes: [72] } },
              { text: "In 4/4 a whole note lasts the whole bar: 4 beats.", left: "𝅝", right: "4", label: "beats", sound: { kind: "melodic", notes: [67] } },
              { text: "Halve it: half note, 2 beats. Quarter, 1. Eighth, ½.", left: "♩", right: "♪", label: "halves", sound: { kind: "melodic", notes: [67, 67, 67, 67, 67, 67], gap: 0.25 } },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Practice 4.7",
            questions: [
              choice("In 4/4, how many beats does a half note last?", "2", ["1", "3", "4"], "A half note is 2 beats in 4/4"),
              choice("In 4/4, how many beats does a whole note last?", "4", ["2", "3", "8"], "A whole note fills a bar of 4/4"),
              choice("How many eighth notes make one quarter note?", "2", ["1", "3", "4"], "Two eighths fit in one quarter"),
              choice("In 3/4, how many quarter notes fill a bar?", "3", ["2", "4", "6"], "3/4 has three quarter-note beats"),
              choice("In 4/4, what does the bottom 4 mean?", "The quarter note gets the beat", ["There are 4 bars", "Play 4 notes", "The tempo is 4"], "The bottom number names the beat note"),
              choice("How many sixteenth notes fit in a quarter note?", "4", ["2", "3", "8"], "Four sixteenths make a quarter"),
            ],
          },
          { type: "tapBeat", bpm: 84, beatsPerBar: 4, bars: 2, title: "Tap along in 4/4" },
        ],
      },
      {
        id: "4.3",
        section: "4.3",
        title: "Dots and ties",
        summary: "Making 3 beats, and holding notes over",
        steps: [
          {
            type: "story",
            cards: [
              { text: "There's no 3-beat note. A dot fixes that.", left: "𝅗𝅥.", right: "3", label: "beats", sound: { kind: "melodic", notes: [67] } },
              { text: "A dot adds half the note's value. Half note (2) + dot (1) = 3.", left: "2", right: "3", label: "+½", sound: { kind: "melodic", notes: [67, 67], gap: 0.9 } },
              { text: "Dotted quarter: 1 + ½ = 1½ beats.", left: "♩.", right: "1½", label: "beats", sound: { kind: "melodic", notes: [67, 69], gap: 0.6 } },
              { text: "A tie joins two notes of the same pitch into one long note.", left: "♩", right: "♩", label: "tie = 2 beats", sound: { kind: "melodic", notes: [67] } },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Practice 4.7",
            questions: [
              choice("A dotted half note lasts…", "3 beats", ["2 beats", "2½ beats", "4 beats"], "A dotted half is 2 + 1 = 3 beats"),
              choice("A dotted quarter note lasts…", "1½ beats", ["1 beat", "2 beats", "¾ beat"], "A dotted quarter is 1 + ½ = 1½ beats"),
              choice("A half note tied to a quarter note lasts…", "3 beats", ["2 beats", "4 beats", "1½ beats"], "Tied values add up: 2 + 1 = 3"),
              choice("A dot adds…", "Half the note's value", ["One beat", "Double the value", "A rest"], "A dot adds half the note's value"),
              choice("A tie connects notes of…", "The same pitch", ["Different pitches", "Any two bars", "Rests"], "Ties join the same pitch; slurs join different ones"),
              choice("A quarter tied to an eighth lasts…", "1½ beats", ["1 beat", "2 beats", "¾ beat"], "1 + ½ = 1½ beats"),
            ],
          },
        ],
      },
      {
        id: "4.4",
        section: "4.4–4.5",
        title: "Simple and compound meter",
        summary: "Beats that split in two, or in three",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Two beats a bar is duple. Three is triple. Four is quadruple.", left: "1", right: "3", label: "waltz", sound: { kind: "melodic", notes: [84, 79, 79, 84, 79, 79], gap: 0.4 } },
              { text: "Simple meter: each beat splits into two.", left: "♩", right: "♫", label: "÷2", sound: { kind: "melodic", notes: [79, 79, 79, 79], gap: 0.3 } },
              { text: "Compound meter: each beat splits into three.", left: "♩.", right: "♪♪♪", label: "÷3", sound: { kind: "melodic", notes: [79, 76, 76, 79, 76, 76], gap: 0.22 } },
              { text: "6/8 feels like two big beats, each split in three. Compound duple.", left: "6", right: "8", label: "1-la-li 2-la-li", sound: { kind: "melodic", notes: [84, 76, 76, 79, 76, 76], gap: 0.22 } },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Section 4.4",
            questions: [
              choice("3/4 is…", "Simple triple", ["Simple duple", "Compound triple", "Compound duple"], "3/4 is simple triple: 3 beats, each split in two"),
              choice("6/8 is…", "Compound duple", ["Simple triple", "Compound triple", "Simple duple"], "6/8 is compound duple: 2 beats, each split in three"),
              choice("4/4 is…", "Simple quadruple", ["Compound quadruple", "Simple duple", "Simple triple"], "4/4 is simple quadruple"),
              choice("9/8 is…", "Compound triple", ["Simple triple", "Compound duple", "Simple quadruple"], "9/8 is compound triple: 3 beats split in three"),
              choice("In compound meter, each beat divides into…", "Three", ["Two", "Four", "Six"], "Compound beats divide in three"),
              choice("2/4 is…", "Simple duple", ["Compound duple", "Simple triple", "Simple quadruple"], "2/4 is simple duple"),
            ],
          },
          { type: "tapBeat", bpm: 96, beatsPerBar: 3, bars: 2, title: "Tap along in 3/4" },
        ],
      },
    ],
  },
];

/** Exposed for tests. */
export const KEY_TABLES = { MAJOR_KEYS_BY_SIG, MINOR_KEYS_BY_SIG, keySignature };
