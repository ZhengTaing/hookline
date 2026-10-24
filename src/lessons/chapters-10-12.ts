import { parseNote, pretty } from "../music";
import type { RushQuestion, Unit } from "./types";

// Chapters 10-12 of Hutchinson, "Music Theory for the 21st-Century Classroom":
// non-chord tones, melodic analysis, and form in popular music.

const C_CHORD = [48, 52, 55];
const G_CHORD = [43, 47, 50];
const F_CHORD = [41, 45, 48];
const A_CHORD = [45, 49, 52];
const D_CHORD = [50, 54, 57];
const E_CHORD = [40, 44, 47];

const midi = (names: string[]) => names.map((n) => parseNote(n).midi);

function choice(prompt: string, answer: string, wrong: string[], miss: string, extra: Partial<Extract<RushQuestion, { kind: "choice" }>> = {}): RushQuestion {
  return { kind: "choice", prompt, options: [answer, ...wrong], answer, miss, ...extra };
}

const NCT_KINDS = ["Passing tone", "Neighbor tone", "Appoggiatura", "Escape tone"];
const NCT_RULES: Record<string, string> = {
  "Passing tone": "steps through, same direction",
  "Neighbor tone": "steps away and back",
  Appoggiatura: "leaps in, steps out",
  "Escape tone": "steps in, leaps out the other way",
};

/** Three melody notes over one chord. The middle one is the non-chord tone. */
function nct(chord: number[], notes: string[], answer: string): RushQuestion {
  return choice(
    "The middle note is a…",
    answer,
    NCT_KINDS.filter((k) => k !== answer),
    `${pretty(notes[1])} ${NCT_RULES[answer]}: ${answer.toLowerCase()}`,
    {
      visual: { type: "staff", notes },
      sound: { kind: "withChord", chord, notes: midi(notes), gap: 0.5 },
    } as Partial<Extract<RushQuestion, { kind: "choice" }>>,
  );
}

const MOTIVE = ["C4", "D4", "E4", "G4"];
const CHANGES: Record<string, { notes: string[]; gap: number; why: string }> = {
  Inversion: { notes: ["C4", "B3", "A3", "F3"], gap: 0.28, why: "Upside down: every step up becomes a step down" },
  Retrograde: { notes: ["G4", "E4", "D4", "C4"], gap: 0.28, why: "Backwards: the same notes, last to first" },
  Augmentation: { notes: MOTIVE, gap: 0.56, why: "Same notes, every note twice as long" },
  "Interval change": { notes: ["C4", "D4", "E4", "A4"], gap: 0.28, why: "Same shape, but the last jump got wider" },
  Extension: { notes: ["C4", "D4", "E4", "G4", "A4", "G4", "E4"], gap: 0.28, why: "The motive plus some extra notes on the end" },
};

function motiveChange(answer: string): RushQuestion {
  const c = CHANGES[answer];
  const wrong = Object.keys(CHANGES).filter((k) => k !== answer).slice(0, 3);
  // Single-note "chords" on a 0.28s grid; empty slots are rests, so augmentation can play at half speed.
  const slow = c.gap > 0.28;
  const changed = midi(c.notes).flatMap((n) => (slow ? [[n], []] : [[n]]));
  return choice("How did the motive change?", answer, wrong, c.why, {
    visual: { type: "big", text: `C D E G → ${c.notes.map((n) => pretty(n)).join(" ")}`, caption: "Hear the motive, then the change" },
    sound: { kind: "progression", chords: [...midi(MOTIVE).map((n) => [n]), [], [], ...changed], gap: 0.28 },
  });
}

/** Chords for the 12 bars of a basic blues in a key, as I/IV/V. */
const BLUES = ["I", "I", "I", "I", "IV", "IV", "I", "I", "V", "IV", "I", "I"];

function bluesBar(key: string, chords: Record<string, string>, bar: number): RushQuestion {
  const answer = chords[BLUES[bar - 1]];
  return choice(`12-bar blues in ${key}: bar ${bar} is…`, answer, Object.values(chords).filter((c) => c !== answer), `Bar ${bar} of the blues is ${BLUES[bar - 1]}: ${answer}`);
}

export const CHAPTERS_10_12: Unit[] = [
  {
    id: "non-chord-tones",
    title: "Non-chord tones",
    chapter: "Chapter 10",
    summary: "Melody notes that aren't in the chord, and why they sound good",
    lessons: [
      {
        id: "10.1",
        section: "10.1–10.6",
        title: "Passing, neighbor and leaping tones",
        summary: "Notes outside the chord, sorted by how they move",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Melodies use notes that aren't in the chord. They add motion and spice.", sound: { kind: "withChord", chord: C_CHORD, notes: midi(["E4", "F4", "G4", "A4", "G4"]), gap: 0.4 } },
              { text: "Passing tone: steps between two chord tones, same direction.", left: "E F G", right: "C chord", label: "F passes", sound: { kind: "withChord", chord: C_CHORD, notes: midi(["E4", "F4", "G4"]) } },
              { text: "Neighbor tone: steps away from a chord tone and right back.", left: "E F E", right: "C chord", label: "F neighbors", sound: { kind: "withChord", chord: C_CHORD, notes: midi(["E4", "F4", "E4"]) } },
              { text: "Appoggiatura: leaps onto the outside note, then steps to a chord tone. Big emotion.", left: "C A G", right: "C chord", label: "A leans", sound: { kind: "withChord", chord: C_CHORD, notes: midi(["C4", "A4", "G4"]) } },
              { text: "Escape tone: steps out, then leaps away the other direction.", left: "E F C", right: "C chord", label: "F escapes", sound: { kind: "withChord", chord: C_CHORD, notes: midi(["E4", "F4", "C4"]) } },
            ],
          },
          {
            type: "rush",
            seconds: 75,
            source: "Practice 10.13",
            questions: [
              nct(C_CHORD, ["E4", "F4", "G4"], "Passing tone"),
              nct(C_CHORD, ["G4", "A4", "G4"], "Neighbor tone"),
              nct(G_CHORD, ["D4", "C5", "B4"], "Appoggiatura"),
              nct(C_CHORD, ["E4", "F4", "C4"], "Escape tone"),
              nct(G_CHORD, ["B4", "C5", "D5"], "Passing tone"),
              nct(F_CHORD, ["A4", "Bb4", "A4"], "Neighbor tone"),
              nct(F_CHORD, ["F4", "D5", "C5"], "Appoggiatura"),
              nct(G_CHORD, ["G4", "A4", "D4"], "Escape tone"),
              nct(A_CHORD, ["C#5", "D5", "E5"], "Passing tone"),
            ],
          },
        ],
      },
      {
        id: "10.7",
        section: "10.7–10.11",
        title: "Suspensions, anticipations and pedals",
        summary: "Notes that arrive early, leave late, or stay put",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Anticipation: a melody note shows up early, before its chord does.", left: "D", right: "→ G chord", label: "early", sound: { kind: "progression", chords: [[...C_CHORD, 64], [...C_CHORD, 62], [...G_CHORD, 62]], gap: 0.6 } },
              { text: "Suspension: a note hangs over from the last chord, clashes, then steps down.", left: "4", right: "3", label: "F → E", sound: { kind: "progression", chords: [[...F_CHORD, 65], [...C_CHORD, 65], [...C_CHORD, 64]], gap: 0.9 } },
              { text: "Retardation: the same idea, but the held note steps up instead.", left: "B", right: "C", label: "↑", sound: { kind: "progression", chords: [[...G_CHORD, 59], [...C_CHORD, 59], [...C_CHORD, 60]], gap: 0.9 } },
              { text: "Pedal point: one note (usually the bass) holds while the chords change above it.", left: "G", right: "C F C", label: "held", sound: { kind: "progression", chords: [[43, 52, 55, 60], [43, 53, 57, 60], [43, 50, 53, 59], [43, 52, 55, 60]], gap: 0.8 } },
            ],
          },
          {
            type: "rush",
            seconds: 45,
            source: "Section 10.7–10.11",
            questions: [
              choice("A note held over from the last chord that steps down is a…", "Suspension", ["Anticipation", "Pedal point"], "Held over, then down by step: a suspension"),
              choice("A note that arrives before its chord is an…", "Anticipation", ["Appoggiatura", "Suspension"], "Early arrival: anticipation"),
              choice("A bass note held under changing chords is a…", "Pedal point", ["Suspension", "Retardation"], "Held under changing chords: pedal point"),
              choice("A held-over note that resolves up is a…", "Retardation", ["Suspension", "Passing tone"], "Resolving up instead of down: retardation"),
              choice("Suspensions land on the…", "Strong beat", ["Weak beat", "Offbeat"], "Suspensions are accented, on the downbeat"),
              choice("Listen. What's happening in the bass?", "Pedal point", ["Passing tones", "Suspension"], "The bass held G while the chords moved: pedal point", {
                sound: { kind: "progression", chords: [[43, 52, 55, 60], [43, 53, 57, 60], [43, 50, 53, 59], [43, 52, 55, 60]], gap: 0.7 },
              }),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "melody",
    title: "Melody",
    chapter: "Chapter 11",
    summary: "Motives, how they change, and how they grow into phrases",
    lessons: [
      {
        id: "11.1",
        section: "11.1–11.2",
        title: "Motives and how they change",
        summary: "One small idea, bent five ways",
        steps: [
          {
            type: "story",
            cards: [
              { text: "A motive is the smallest idea you'd recognize. Think the four notes that open Beethoven's 5th.", sound: { kind: "melodic", notes: [67, 67, 67, 63], gap: 0.25 } },
              { text: "Writers reuse a motive and change it. Here's ours: C D E G.", left: "C D E", right: "G", label: "motive", sound: { kind: "melodic", notes: midi(MOTIVE), gap: 0.28 } },
              { text: "Inversion flips it upside down.", left: "C D E G", right: "C B A F", label: "flip", sound: { kind: "melodic", notes: midi(CHANGES.Inversion.notes), gap: 0.28 } },
              { text: "Retrograde plays it backwards.", left: "C D E G", right: "G E D C", label: "reverse", sound: { kind: "melodic", notes: midi(CHANGES.Retrograde.notes), gap: 0.28 } },
              { text: "Augmentation makes every note longer. Diminution makes them shorter.", left: "fast", right: "slow", label: "×2", sound: { kind: "melodic", notes: midi(MOTIVE), gap: 0.56 } },
              { text: "Extension tacks new notes onto the end.", left: "C D E G", right: "+ A G E", label: "more", sound: { kind: "melodic", notes: midi(CHANGES.Extension.notes), gap: 0.28 } },
            ],
          },
          {
            type: "rush",
            seconds: 75,
            source: "Practice 11.6",
            questions: [motiveChange("Inversion"), motiveChange("Retrograde"), motiveChange("Interval change"), motiveChange("Extension"), motiveChange("Augmentation"), motiveChange("Retrograde")],
          },
        ],
      },
      {
        id: "11.4",
        section: "11.3–11.5",
        title: "Phrases and subphrases",
        summary: "Motive → subphrase → phrase",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Melodies are built in sizes. Smallest: the motive.", left: "motive", right: "1 bar", label: "≈", sound: { kind: "melodic", notes: midi(MOTIVE), gap: 0.28 } },
              { text: "A subphrase is usually 2 bars. Label them a, b, or a′ when one repeats with a change.", left: "a", right: "a′", label: "2 + 2", sound: { kind: "melodic", notes: midi(["C4", "D4", "E4", "G4", "E4", "C4", "C4", "D4", "E4", "G4", "A4", "G4"]), gap: 0.25 } },
              { text: "A phrase is usually 4 bars and feels finished. In classical music it ends with a cadence.", left: "phrase", right: "4 bars", label: "≈", sound: { kind: "withChord", chord: C_CHORD, notes: midi(["E4", "D4", "C4", "D4", "E4", "E4", "E4", "D4", "D4", "D4", "E4", "G4", "G4"]), gap: 0.3 } },
              { text: "Writing tip: sing one motive, repeat it with a twist (a′), then answer it (b).", sound: { kind: "melodic", notes: midi(["C4", "E4", "G4", "C4", "E4", "A4", "G4", "F4", "E4", "D4", "C4"]), gap: 0.3 } },
            ],
          },
          {
            type: "rush",
            seconds: 45,
            source: "Practice 11.6",
            questions: [
              choice("The smallest recognizable melodic idea is a…", "Motive", ["Phrase", "Subphrase"], "Smallest unit: the motive"),
              choice("Most subphrases are how long?", "2 bars", ["1 beat", "8 bars"], "Subphrases are usually 2 bars"),
              choice("Most phrases are how long?", "4 bars", ["2 bars", "12 bars"], "Phrases are usually 4 bars, sometimes 8"),
              choice("In classical music, a phrase ends with a…", "Cadence", ["Key change", "Pedal point"], "Phrases end with cadences"),
              choice("A subphrase that repeats with a small change is labeled…", "a′", ["b", "A"], "a′ means 'a, but altered'"),
              choice("Order these from small to big", "Motive, subphrase, phrase", ["Phrase, motive, subphrase", "Subphrase, motive, phrase"], "Motive < subphrase < phrase"),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "song-form",
    title: "Song form",
    chapter: "Chapter 12",
    summary: "Verse, chorus, bridge, AABA and the 12-bar blues",
    lessons: [
      {
        id: "12.1",
        section: "12.1–12.3",
        title: "Verse, chorus and AABA",
        summary: "How songs are laid out",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Verse–chorus is today's default. The chorus holds the hook, the part everyone sings.", left: "Verse", right: "Chorus", label: "→", sound: { kind: "progression", chords: [[45, 48, 52], [41, 45, 48], [48, 52, 55], [43, 47, 50]], gap: 0.6 } },
              { text: "Add-ons: a pre-chorus builds into the chorus, a bridge gives contrast near the end.", left: "Pre", right: "Bridge", label: "+", sound: { kind: "progression", chords: [[41, 45, 48], [43, 47, 50], [41, 45, 48], [43, 47, 50]], gap: 0.6 } },
              { text: "AABA: the classic 32-bar song. Three A sections with the melody, one B (the bridge) for contrast.", left: "A A", right: "B A", label: "8 bars each", sound: { kind: "melodic", notes: midi(["C4", "C5", "B4", "G4", "A4", "B4", "C5"]), gap: 0.35 } },
              { text: "ABAC: also 32 bars, from the 1930s–50s. 'White Christmas' is one.", left: "A B", right: "A C", label: "8 bars each" , sound: { kind: "none" } },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Practice 12.6",
            questions: [
              choice("The hook usually lives in the…", "Chorus", ["Verse", "Bridge"], "The chorus carries the hook"),
              choice("In AABA, the B section is also called the…", "Bridge", ["Chorus", "Outro"], "The B in AABA is the bridge"),
              choice("Each section of a 32-bar AABA song is…", "8 bars", ["4 bars", "12 bars"], "4 sections × 8 bars = 32"),
              choice("What builds tension right before the chorus?", "Pre-chorus", ["Bridge", "Outro"], "The pre-chorus leads into the chorus"),
              choice("Verse–chorus form took over from AABA with…", "Rock 'n' roll", ["Baroque music", "Jazz in the 1930s"], "AABA ruled until rock 'n' roll in the 1950s"),
              choice("Your verses change words, your chorus…", "Repeats its words", ["Changes key every time", "Has no melody"], "The chorus usually repeats its lyrics"),
            ],
          },
        ],
      },
      {
        id: "12.4",
        section: "12.4–12.5",
        title: "The 12-bar blues, open and closed",
        summary: "I-IV-V in 12 bars, and where sections land",
        steps: [
          {
            type: "story",
            cards: [
              { text: "The 12-bar blues: 'Johnny B. Goode', 'Hound Dog', 'Rock Around the Clock'.", sound: { kind: "progression", chords: BLUES.map((r) => ({ I: A_CHORD, IV: D_CHORD, V: E_CHORD })[r]!), gap: 0.4 } },
              { text: "Bars 1–4 stay on I.", left: "I I", right: "I I", label: "1–4", sound: { kind: "progression", chords: [A_CHORD, A_CHORD, A_CHORD, A_CHORD], gap: 0.4 } },
              { text: "Bars 5–8: IV, IV, then back to I, I.", left: "IV IV", right: "I I", label: "5–8", sound: { kind: "progression", chords: [D_CHORD, D_CHORD, A_CHORD, A_CHORD], gap: 0.4 } },
              { text: "Bars 9–12: V, IV, I, I. That's the turnaround.", left: "V IV", right: "I I", label: "9–12", sound: { kind: "progression", chords: [E_CHORD, D_CHORD, A_CHORD, A_CHORD], gap: 0.4 } },
              { text: "A section that ends on I is closed: finished. One that ends on V is open: it pulls you into the next part.", left: "closed", right: "open", label: "I · V", sound: { kind: "progression", chords: [C_CHORD, F_CHORD, G_CHORD], gap: 0.8 } },
            ],
          },
          {
            type: "rush",
            seconds: 75,
            source: "Practice 12.6",
            questions: [
              bluesBar("A", { I: "A", IV: "D", V: "E" }, 5),
              bluesBar("E", { I: "E", IV: "A", V: "B" }, 9),
              bluesBar("G", { I: "G", IV: "C", V: "D" }, 10),
              bluesBar("A", { I: "A", IV: "D", V: "E" }, 2),
              bluesBar("C", { I: "C", IV: "F", V: "G" }, 6),
              choice("Listen to this section's ending. Open or closed?", "Open", ["Closed"], "It stopped on V, so it's open: it wants to keep going", {
                sound: { kind: "progression", chords: [C_CHORD, [45, 48, 52], F_CHORD, G_CHORD], gap: 0.7 },
              }),
              choice("Listen to this section's ending. Open or closed?", "Closed", ["Open"], "It landed on I, so it's closed", {
                sound: { kind: "progression", chords: [C_CHORD, F_CHORD, G_CHORD, C_CHORD], gap: 0.7 },
              }),
              choice("In pop songs, the verse usually ends…", "Open, on V", ["Closed, on I"], "Verses usually end open so they pull into the chorus"),
            ],
          },
        ],
      },
    ],
  },
];
