import { parseNote } from "../music";
import type { RushQuestion, Sound, Unit } from "./types";

// Chapters 23-35 of Hutchinson, "Music Theory for the 21st-Century Classroom":
// enharmonic modulation, classical forms, voice leading, counterpoint, jazz,
// and 20th-century techniques.

/** MIDI numbers for space-separated note names, e.g. "C3 E3 G3 C4". */
const m = (names: string) => names.split(" ").map((n) => parseNote(n).midi);

const prog = (chords: string[], gap = 0.85): Sound => ({ kind: "progression", chords: chords.map(m), gap });
const tune = (names: string, gap = 0.3): Sound => ({ kind: "melodic", notes: m(names), gap });

function choice(prompt: string, answer: string, wrong: string[], miss: string, extra: Partial<Extract<RushQuestion, { kind: "choice" }>> = {}): RushQuestion {
  return { kind: "choice", prompt, options: [answer, ...wrong], answer, miss, ...extra };
}

const C = "C3 E3 G3 C4";
const F = "F2 F3 A3 C4";
const G7 = "G2 F3 B3 D4";

const PC = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];

/** "What number is this pitch class?" with neighbors as wrong answers. */
function pitchClass(pc: number): RushQuestion {
  const near = [(pc + 1) % 12, (pc + 11) % 12, (pc + 2) % 12].map(String);
  return choice(`${PC[pc]} as a pitch-class number is…`, String(pc), near, `C = 0, so ${PC[pc]} = ${pc}`, {
    sound: { kind: "melodic", notes: [60 + pc], gap: 0.5 },
  });
}

function transpose(set: number[], n: number): RushQuestion {
  const fmt = (s: number[]) => `{${s.join(",")}}`;
  const answer = fmt(set.map((x) => (x + n) % 12));
  const off = fmt(set.map((x) => (x + n + 1) % 12));
  const raw = fmt(set.map((x) => x + n));
  const wrong = [off, raw === answer ? fmt(set.map((x) => (x + n + 11) % 12)) : raw];
  return choice(`T${n} of ${fmt(set)} is…`, answer, wrong, `Add ${n} to each and wrap past 11: ${answer}`);
}

export const CHAPTERS_23_35: Unit[] = [
  {
    id: "enharmonic",
    title: "Enharmonic modulation",
    chapter: "Chapter 23",
    summary: "Chords that are puns",
    lessons: [
      {
        id: "23.1",
        section: "23.1–23.3",
        title: "Harmonic puns",
        summary: "One sound, two spellings, two keys",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Some chords sound the same but mean different things. Like 'sun' and 'son'.", sound: prog([G7], 1.2) },
              { text: "G7 is V7 in C. Spell its F as E♯ and it's a German sixth in B minor.", left: "G7", right: "Ger+6", label: "=", sound: prog([C, F, G7, C], 0.8) },
              { text: "So: C, F, G7… and instead of C, it slides down to F♯ in B minor. Surprise key change.", sound: prog([C, F, G7, "F#2 B3 D4 F#4", "F#2 A#3 C#4 E4", "B2 B3 D4 F#4"], 0.8) },
              { text: "A fully diminished 7th is even sneakier: every note can be its root, so it leads to four different keys.", left: "°7", right: "× 4", label: "keys", sound: prog(["B2 D3 F3 Ab3", "C3 E3 G3 C4", "D3 F3 Ab3 B3", "Eb3 G3 Bb3 Eb4"], 0.8) },
            ],
          },
          {
            type: "rush",
            seconds: 45,
            source: "Practice 23.4",
            questions: [
              choice("In an enharmonic modulation, the pivot chord is…", "Respelled in the new key", ["Left out", "Always a minor chord"], "Same sound, new spelling"),
              choice("A V7 chord can be respelled as a…", "German sixth", ["Neapolitan", "Sus chord"], "V7 and Ger+6 sound identical"),
              choice("A fully diminished 7th can lead to how many keys by respelling?", "4", ["1", "2"], "Any of its four notes can be the leading tone"),
              choice("Why do enharmonic pivots work?", "Equal temperament makes F and E♯ the same pitch", ["The tempo changes", "They're always in the bass"], "Same key on the piano, different name"),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "classical-form",
    title: "Classical forms",
    chapter: "Chapters 24–25",
    summary: "Binary, ternary, sonata and rondo",
    lessons: [
      {
        id: "24.1",
        section: "24.1–24.8",
        title: "Binary and ternary form",
        summary: "AB, rounded binary, and ABA",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Binary form has two sections: A and B, each usually repeated.", left: "A", right: "B", label: "‖: :‖", sound: tune("C4 E4 G4 E4 D4 F4 A4 G4") },
              { text: "Sectional: A ends on the tonic. Continuous: A ends somewhere else, so it has to keep going.", left: "A → I", right: "A → V", label: "vs", sound: prog([C, G7, C, "D3 F#3 A3 D4", "G2 G3 B3 D4"], 0.7) },
              { text: "Rounded binary: B ends by bringing back part of A. Balanced binary: both sections end with the same cadence.", left: "A", right: "B + a", label: "rounded", sound: tune("C4 E4 G4 E4 A4 G4 F4 D4 C4 E4 G4 C5") },
              { text: "Ternary: A B A. The middle contrasts, and A comes back complete.", left: "A B", right: "A", label: "ternary", sound: tune("C4 E4 G4 C5 A4 F4 D4 B3 C4 E4 G4 C5") },
            ],
          },
          {
            type: "rush",
            seconds: 45,
            source: "Practice 24.9",
            questions: [
              choice("A form with two sections, A and B, is…", "Binary", ["Ternary", "Rondo"], "Two parts: binary"),
              choice("A B A with a complete return of A is…", "Ternary", ["Rounded binary", "Sonata"], "Full return of A: ternary"),
              choice("B ends by bringing back part of A. That's…", "Rounded binary", ["Simple binary", "Rondo"], "Partial return of A: rounded binary"),
              choice("If the A section ends on the tonic, the form is…", "Sectional", ["Continuous", "Developmental"], "Ends on I: sectional"),
              choice("If the A section ends in a new key, the form is…", "Continuous", ["Sectional", "Through-composed"], "Doesn't end on I: continuous"),
            ],
          },
        ],
      },
      {
        id: "25.1",
        section: "25.1–25.5",
        title: "Sonata and rondo",
        summary: "The big classical shapes",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Sonata form has three parts: exposition, development, recapitulation.", left: "Exp", right: "Dev Recap", label: "→", sound: prog([C, G7, C], 0.7) },
              { text: "Exposition: first theme in the home key, a transition, then a second theme in a new key (often V).", left: "Theme 1", right: "Theme 2", label: "I → V", sound: prog([C, "D3 F#3 A3 D4", "G2 G3 B3 D4"], 0.8) },
              { text: "Development: themes get chopped up and pushed through keys. Recapitulation: it all returns, now in the home key.", sound: prog(["A2 A3 C4 E4", "D3 F3 A3 D4", "E2 G#3 B3 E4", G7, C], 0.6) },
              { text: "Rondo: a refrain that keeps coming back. A B A C A B A.", left: "A B A", right: "C A B A", label: "rondo", sound: tune("C5 G4 E4 G4 A4 F4 C5 G4 E4 G4") },
              { text: "Music does four jobs: state ideas (expository), move between them (transitional), develop them, and wrap up (terminative).", sound: { kind: "none" } },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Practice 25.6",
            questions: [
              choice("The three parts of sonata form are…", "Exposition, development, recapitulation", ["Verse, chorus, bridge", "Intro, refrain, coda"], "Exposition, development, recapitulation"),
              choice("In a major-key exposition, the second theme is usually in…", "The dominant (V)", ["The tonic", "The parallel minor"], "Usually V"),
              choice("In the recapitulation, the second theme comes back in…", "The tonic", ["The dominant", "A new key"], "Everything returns home"),
              choice("A typical seven-part rondo is…", "ABACABA", ["AABA", "ABAB"], "The refrain A keeps returning"),
              choice("The rondo's refrain is always in…", "The tonic", ["The dominant", "A minor key"], "A is always home"),
              choice("The section where themes are broken up and travel through keys is the…", "Development", ["Exposition", "Coda"], "Development"),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "voice-leading",
    title: "Voice leading",
    chapter: "Chapters 26–29",
    summary: "How each note of a chord moves to the next",
    lessons: [
      {
        id: "26.2",
        section: "26.1–26.2",
        title: "Four kinds of motion",
        summary: "Contrary, oblique, similar, parallel",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Voice leading is how each part moves from chord to chord. Think of four singers: soprano, alto, tenor, bass.", sound: prog(["C3 G3 E4 C5", "F2 A3 F4 C5", "G2 B3 D4 B4", "C3 G3 E4 C5"], 0.8) },
              { text: "Contrary motion: the voices go opposite ways. The strongest, most independent sound.", left: "↑", right: "↓", label: "contrary", sound: prog(["C3 E4", "B2 F4", "A2 G4"], 0.7) },
              { text: "Oblique: one voice holds, the other moves.", left: "—", right: "↑", label: "oblique", sound: prog(["C3 E4", "C3 F4", "C3 G4"], 0.7) },
              { text: "Similar: both move the same way by different amounts. Parallel: same way, same interval.", left: "↑↑", right: "=", label: "parallel", sound: prog(["C3 E4", "D3 F4", "E3 G4"], 0.7) },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Section 26.2",
            questions: [
              choice("Top goes up, bottom goes down. That's…", "Contrary", ["Parallel", "Oblique"], "Opposite directions: contrary"),
              choice("Bottom holds, top moves. That's…", "Oblique", ["Similar", "Contrary"], "One holds: oblique"),
              choice("Both go up by the same interval. That's…", "Parallel", ["Similar", "Oblique"], "Same direction, same interval: parallel"),
              choice("Both go up, by different amounts. That's…", "Similar", ["Parallel", "Contrary"], "Same direction, different interval: similar"),
              choice("Listen to the two voices. What motion?", "Contrary", ["Parallel", "Oblique"], "They spread apart: contrary", { sound: prog(["E3 C4", "D3 D4", "C3 E4"], 0.7) }),
              choice("Listen to the two voices. What motion?", "Parallel", ["Contrary", "Oblique"], "They moved together a 3rd apart", { sound: prog(["C4 E4", "D4 F4", "E4 G4"], 0.7) }),
            ],
          },
        ],
      },
      {
        id: "26.3",
        section: "26.3–26.9",
        title: "The voice-leading rules",
        summary: "No parallel 5ths, keep it close",
        steps: [
          {
            type: "story",
            cards: [
              { text: "The big rule: no parallel 5ths or octaves between two voices. They make the parts melt into one.", left: "P5", right: "P5", label: "✗", sound: prog(["C3 G3", "D3 A3", "E3 B3"], 0.7) },
              { text: "Keep soprano–alto and alto–tenor within an octave. The bass can be farther away.", left: "S A T", right: "B", label: "spacing", sound: prog(["C3 G3 E4 C5"], 1.2) },
              { text: "Move each voice as little as possible. Keep common tones, step to the rest.", left: "C chord", right: "F chord", label: "C stays", sound: prog(["C3 G3 E4 C5", "F2 A3 F4 C5"], 1) },
              { text: "In root-position triads, double the root. Don't double the leading tone, it wants to go up.", left: "C E G", right: "+ C", label: "double", sound: prog(["C3 C4 E4 G4"], 1.2) },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Section 26.3–26.9",
            questions: [
              choice("Which parallel interval is a voice-leading error?", "Perfect 5th", ["Major 3rd", "Minor 6th"], "Parallel 5ths and octaves are out"),
              choice("Parallel octaves are…", "Avoided", ["Encouraged", "Required at cadences"], "Avoid parallel octaves"),
              choice("The widest allowed gap is between…", "Tenor and bass", ["Soprano and alto", "Alto and tenor"], "Bass–tenor can exceed an octave"),
              choice("In a root-position triad, double the…", "Root", ["3rd", "Leading tone"], "Double the root"),
              choice("Never double the…", "Leading tone", ["Root", "5th"], "It has to resolve up, so doubling it causes parallels"),
              choice("A note shared by two chords should usually…", "Stay in the same voice", ["Jump an octave", "Move to the bass"], "Keep common tones"),
            ],
          },
        ],
      },
      {
        id: "27.1",
        section: "27.1–29.4",
        title: "Where tendency tones go",
        summary: "7ths fall, leading tones rise",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Some notes want to go somewhere. The leading tone (B in C) rises to C.", left: "B", right: "C", label: "↑", sound: prog(["G2 B3 D4", "C3 C4 E4"], 0.9) },
              { text: "A chord 7th falls by step. In G7 → C, the F drops to E.", left: "F", right: "E", label: "↓", sound: prog(["G2 F3 B3 D4", "C3 E3 C4 C4"], 0.9) },
              { text: "Secondary chords: their leading tone rises to the root of the chord they target. F♯ → G in D7 → G.", left: "F♯", right: "G", label: "↑", sound: prog(["D3 F#3 A3 C4", "G2 G3 B3 D4"], 0.9) },
              { text: "The Neapolitan's ♭2 falls to the leading tone. Augmented sixths spread out to the octave on 5.", left: "A♭ F♯", right: "G G", label: "↔", sound: prog(["Ab2 C4 Eb4 F#4", "G2 B3 D4 G4"], 1) },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Practice 27.6, 29.5",
            questions: [
              choice("In V7 → I, the chord 7th…", "Falls by step", ["Rises by step", "Leaps up"], "7ths resolve down"),
              choice("In V7 → I, the leading tone…", "Rises to tonic", ["Falls to the 5th", "Stays put"], "Leading tone goes up"),
              choice("In C major, G7's F resolves to…", "E", ["G", "F♯"], "F falls a step to E"),
              choice("In vii°7 → I, all the tendency tones…", "Resolve by step", ["Leap", "Hold"], "Each note moves by step"),
              choice("In an augmented sixth chord, ♭6 and ♯4…", "Move outward to 5", ["Move inward to 1", "Stay put"], "They spread to an octave on 5"),
              choice("The Neapolitan's ♭2 usually goes to…", "The leading tone", ["Tonic", "The 4th"], "♭2 drops to 7"),
              choice("Adding passing tones can accidentally create…", "Parallel 5ths", ["Key changes", "Cadences"], "Watch for hidden parallels"),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "counterpoint",
    title: "Counterpoint",
    chapter: "Chapter 30",
    summary: "Two melodies at once, and the fugue",
    lessons: [
      {
        id: "30.1",
        section: "30.1–30.6",
        title: "Species counterpoint",
        summary: "Five ways to write against a melody",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Counterpoint is two independent melodies at once. Students practice it against a fixed tune, the cantus firmus.", sound: prog(["C3 C4", "D3 B3", "E3 C4", "F3 A3", "E3 G3", "D3 B3", "C3 C4"], 0.6) },
              { text: "1st species: one note against one. Consonances only, start and end on an octave or unison.", left: "1", right: "1", label: "note : note", sound: prog(["C3 C4", "D3 F3", "E3 G3", "D3 B3", "C3 C4"], 0.7) },
              { text: "2nd species: two notes against one. The 2nd can be a passing dissonance.", left: "2", right: "1", label: "half notes", sound: prog(["C3 C4", "B3", "D3 A3", "G3", "E3 G3", "C4", "D3 B3", "D4", "C3 C4"], 0.35) },
              { text: "3rd species: four against one. 4th: suspensions, tied over the bar. 5th: mix all of them (florid).", left: "4", right: "1", label: "quarters", sound: tune("C4 D4 E4 F4 G4 F4 E4 D4 C4", 0.18) },
            ],
          },
          {
            type: "rush",
            seconds: 45,
            source: "Practice 30.9",
            questions: [
              choice("The given melody in species counterpoint is the…", "Cantus firmus", ["Subject", "Riff"], "The fixed tune is the cantus firmus"),
              choice("Note against note is…", "1st species", ["2nd species", "4th species"], "1:1 is first species"),
              choice("Two notes against one is…", "2nd species", ["3rd species", "5th species"], "2:1 is second species"),
              choice("Suspensions are the focus of…", "4th species", ["1st species", "3rd species"], "4th species: ties and suspensions"),
              choice("Mixing all the species is called…", "Florid (5th species)", ["Fugue", "Canon"], "5th species is florid"),
              choice("1st species allows…", "Consonances only", ["Any interval", "Only dissonances"], "No dissonance in first species"),
            ],
          },
        ],
      },
      {
        id: "30.7",
        section: "30.7–30.8",
        title: "Inventions and fugues",
        summary: "Subject, answer, countersubject",
        steps: [
          {
            type: "story",
            cards: [
              { text: "A fugue starts with one voice playing the subject: the main theme.", left: "subject", right: "1 voice", label: "=", sound: tune("C4 D4 E4 F4 D4 E4 C4 G4", 0.22) },
              { text: "The next voice enters with the answer: the subject again, usually a 5th higher.", left: "answer", right: "on G", label: "+5th", sound: tune("G4 A4 B4 C5 A4 B4 G4 D5", 0.22) },
              { text: "Meanwhile the first voice keeps going with a countersubject.", sound: prog(["G3 G4", "A3 A4", "B3 B4", "C4 C5", "A3 A4", "B3 B4", "G3 G4", "D4 D5"], 0.22) },
              { text: "Once every voice has entered, the exposition is over. Episodes in between develop bits of the subject.", sound: { kind: "none" } },
            ],
          },
          {
            type: "rush",
            seconds: 45,
            source: "Practice 30.9",
            questions: [
              choice("A fugue's main theme is the…", "Subject", ["Answer", "Episode"], "Subject"),
              choice("The second entry, usually a 5th higher, is the…", "Answer", ["Countersubject", "Coda"], "Answer"),
              choice("The line that plays against the answer is the…", "Countersubject", ["Cantus firmus", "Refrain"], "Countersubject"),
              choice("The fugue's opening, until every voice enters, is the…", "Exposition", ["Development", "Episode"], "Exposition"),
              choice("Passages between subject entries are…", "Episodes", ["Refrains", "Codas"], "Episodes"),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "jazz",
    title: "Jazz theory",
    chapter: "Chapter 31",
    summary: "Jazz chord symbols, altered dominants, ii–V–I and scales",
    lessons: [
      {
        id: "31.1",
        section: "31.1–31.7",
        title: "Jazz chords",
        summary: "6, 9, 13, alt",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Jazz adds color notes on top of seventh chords: 9ths, 11ths, 13ths.", left: "C", right: "C maj9", label: "+ 7 + 9", sound: prog(["C3 E3 G3 B3 D4"], 1.2) },
              { text: "C6 adds the 6th instead of a 7th. Cm7♭5 is the half-diminished chord.", left: "C6", right: "Cm7♭5", label: "·", sound: prog(["C3 E3 G3 A3", "C3 Eb3 Gb3 Bb3"], 1) },
              { text: "Altered dominants bend the 5th or 9th: G7♭9, G7♯9, G7♯5. Extra tension before resolving.", left: "G7♯9", right: "C", label: "→", sound: prog(["G2 B3 F4 A#4", "C3 E3 B3 D4"], 1) },
              { text: "Pianists and guitarists often drop the root and 5th, keeping the 3rd and 7th: the 'guide tones'.", left: "3", right: "7", label: "guide tones", sound: prog(["F3 B3", "E3 Bb3", "Eb3 A3"], 0.8) },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Section 31.2–31.6",
            questions: [
              choice("Cm7♭5 is the same as…", "Cø7", ["C°7", "Cm7"], "m7♭5 = half-diminished"),
              choice("C6 adds which note to C?", "A", ["B♭", "D"], "The 6th of C is A"),
              choice("Which notes can be 'altered' in a dominant 7th?", "5th and 9th", ["Root and 3rd", "3rd and 7th"], "Root, 3rd and 7th stay; 5th and 9th bend"),
              choice("The 9th of C is…", "D", ["A", "F"], "An octave above the 2nd"),
              choice("The 'guide tones' of a chord are its…", "3rd and 7th", ["Root and 5th", "9th and 13th"], "3rd and 7th define the quality"),
              choice("Listen. Plain C7 or altered?", "Altered", ["Plain"], "That had a ♯9 on top", { sound: prog(["C3 E3 Bb3 D#4"], 1.2) }),
            ],
          },
        ],
      },
      {
        id: "31.8",
        section: "31.8–31.9",
        title: "ii–V–I and jazz scales",
        summary: "The standard moves, and the modes",
        steps: [
          {
            type: "story",
            cards: [
              { text: "ii7 – V7 – Imaj7 is the jazz progression. Dm7 – G7 – Cmaj7.", left: "Dm7 G7", right: "Cmaj7", label: "ii V I", sound: prog(["D3 F3 A3 C4", "G2 F3 B3 D4", "C3 E3 G3 B3"], 1) },
              { text: "Rhythm changes and the blues are the other standards most jazz players know.", sound: prog(["C3 E3 G3 A3", "A2 C#3 G3", "D3 F3 A3 C4", "G2 F3 B3 D4"], 0.6) },
              { text: "Each chord has a matching scale. Dorian (D to D in C) over m7…", left: "Dm7", right: "Dorian", label: "↔", sound: tune("D4 E4 F4 G4 A4 B4 C5 D5", 0.18) },
              { text: "…Mixolydian (G to G) over dominant 7, and Ionian or Lydian over maj7.", left: "G7", right: "Mixolydian", label: "↔", sound: tune("G3 A3 B3 C4 D4 E4 F4 G4", 0.18) },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Section 31.8–31.9",
            questions: [
              choice("In C, ii–V–I is…", "Dm7 – G7 – Cmaj7", ["Em7 – A7 – Dmaj7", "F – G – C"], "ii–V–I in C"),
              choice("In F, ii–V–I is…", "Gm7 – C7 – Fmaj7", ["Dm7 – G7 – Cmaj7", "Am7 – D7 – Gmaj7"], "ii–V–I in F"),
              choice("Which mode fits a m7 chord (in jazz)?", "Dorian", ["Lydian", "Locrian"], "Dorian over minor 7"),
              choice("Which mode fits a dominant 7 chord?", "Mixolydian", ["Ionian", "Aeolian"], "Mixolydian has the ♭7"),
              choice("Listen. Which progression?", "ii – V – I", ["I – IV – V", "I – vi – IV"], "Dm7 – G7 – Cmaj7", { sound: prog(["D3 F3 A3 C4", "G2 F3 B3 D4", "C3 E3 G3 B3"], 0.9) }),
              choice("Dorian starting on D uses…", "Only white keys", ["Two flats", "One sharp"], "D to D in C major: all naturals"),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "twentieth-century",
    title: "Beyond tonality",
    chapter: "Chapters 32–35",
    summary: "Impressionism, set theory, twelve-tone and minimalism",
    lessons: [
      {
        id: "32.1",
        section: "32.1–32.4",
        title: "Impressionism and new chords",
        summary: "Whole-tone, quartal chords, polychords",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Debussy and Ravel cared about color over function. The whole-tone scale has no half steps, so no home.", left: "C D E", right: "F♯ G♯ A♯", label: "whole steps", sound: tune("C4 D4 E4 F#4 G#4 A#4 C5", 0.22) },
              { text: "Planing: one chord shape slides around in parallel. The 'forbidden' parallels, on purpose.", sound: prog(["C3 E3 G3", "D3 F#3 A3", "E3 G#3 B3", "D3 F#3 A3"], 0.6) },
              { text: "Quartal harmony stacks 4ths instead of 3rds. Open and modern.", left: "D G", right: "C F", label: "4ths", sound: prog(["D3 G3 C4 F4"], 1.2) },
              { text: "Pandiatonicism uses only white notes, freely, without functional chords. Polychords put two chords on top of each other.", left: "C", right: "F♯", label: "polychord", sound: prog(["C3 E3 G3 F#4 A#4 C#5"], 1.2) },
            ],
          },
          {
            type: "rush",
            seconds: 45,
            source: "Practice 32.5",
            questions: [
              choice("The whole-tone scale has how many notes?", "6", ["7", "5"], "Six whole steps fill the octave"),
              choice("Chords stacked in 4ths are…", "Quartal", ["Tertian", "Secundal"], "4ths = quartal"),
              choice("Sliding one chord shape in parallel is…", "Planing", ["Phasing", "Pivoting"], "Planing"),
              choice("Two different chords played at once is a…", "Polychord", ["Sus chord", "Cluster"], "Polychord"),
              choice("Listen. What scale?", "Whole-tone", ["Major", "Minor"], "No half steps at all", { sound: tune("C4 D4 E4 F#4 G#4 A#4 C5", 0.2) }),
            ],
          },
        ],
      },
      {
        id: "33.1",
        section: "33.1–33.8",
        title: "Set theory basics",
        summary: "Notes as numbers 0–11",
        steps: [
          {
            type: "story",
            cards: [
              { text: "For music without a key, theorists number the 12 notes: C = 0, C♯ = 1 … B = 11.", left: "C", right: "0", label: "=", sound: tune("C4 C#4 D4 Eb4 E4 F4 F#4 G4 Ab4 A4 Bb4 B4", 0.12) },
              { text: "A C major triad is the set {0,4,7}.", left: "C E G", right: "0 4 7", label: "=", sound: prog(["C4 E4 G4"], 1) },
              { text: "Transposing (Tn) adds n to every number, wrapping past 11. T2 of {0,4,7} is {2,6,9}: D major.", left: "T2", right: "2 6 9", label: "+2", sound: prog(["C4 E4 G4", "D4 F#4 A4"], 1) },
              { text: "Normal form is the most compact order. Prime form shifts it to start at 0. Every major and minor triad is prime form (037), Forte number 3-11.", sound: prog(["C4 Eb4 G4", "C4 E4 G4"], 1) },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Practice 33.9",
            questions: [pitchClass(4), pitchClass(7), pitchClass(10), transpose([0, 4, 7], 2), pitchClass(3), transpose([0, 3, 7], 5), transpose([2, 5, 9], 4), choice("Major and minor triads share the prime form…", "(037)", ["(047)", "(012)"], "Both reduce to (037)")],
          },
        ],
      },
      {
        id: "34.1",
        section: "34.1–34.6",
        title: "Twelve-tone rows",
        summary: "Prime, retrograde, inversion",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Schoenberg's twelve-tone method: put all 12 notes in an order (a row), and build the piece from it.", sound: tune("E4 F4 G4 Db4 Gb4 Eb4 Ab4 D4 B3 C4 A4 Bb4", 0.2) },
              { text: "Prime (P): the row as written.", left: "P", right: "→", label: "as is", sound: tune("E4 F4 G4 Db4", 0.25) },
              { text: "Retrograde (R): backwards. Inversion (I): every interval flipped up/down.", left: "R", right: "I", label: "·", sound: tune("Bb4 A4 C4 B3", 0.25) },
              { text: "Retrograde inversion (RI): flipped and backwards. A 12×12 matrix shows all 48 versions.", sound: tune("E4 Eb4 Db4 G4", 0.25) },
            ],
          },
          {
            type: "rush",
            seconds: 45,
            source: "Practice 34.7",
            questions: [
              choice("A twelve-tone row uses each of the 12 notes…", "Once", ["Twice", "As often as you like"], "Each note once before repeating"),
              choice("The row played backwards is the…", "Retrograde", ["Inversion", "Prime"], "Backwards = retrograde"),
              choice("The row with every interval flipped is the…", "Inversion", ["Retrograde", "Prime"], "Upside down = inversion"),
              choice("Flipped and backwards is the…", "Retrograde inversion", ["Prime", "Transposition"], "RI"),
              choice("How many row forms does a twelve-tone matrix show?", "48", ["12", "4"], "4 forms × 12 transpositions"),
              choice("The twelve-tone method is most linked with…", "Schoenberg", ["Mozart", "Debussy"], "Arnold Schoenberg"),
            ],
          },
        ],
      },
      {
        id: "35.1",
        section: "35.1–35.2",
        title: "Minimalism",
        summary: "Additive process and phasing",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Minimalism builds whole pieces from tiny repeating patterns that change slowly.", sound: tune("E4 G4 C5 G4 E4 G4 C5 G4", 0.15) },
              { text: "Additive process (Philip Glass): add one note each time the pattern repeats.", left: "1 2", right: "1 2 3", label: "+1", sound: tune("C4 D4 C4 D4 E4 C4 D4 E4 F4 C4 D4 E4 F4 G4", 0.15) },
              { text: "Phase shifting (Steve Reich): two players repeat the same pattern, one slowly pulls ahead.", sound: { kind: "progression", chords: [[64, 64], [67, 67], [72, 72], [67], [64, 67], [67, 72], [72, 67], [67, 64]], gap: 0.18 } },
            ],
          },
          {
            type: "tapBeat",
            bpm: 100,
            beatsPerBar: 4,
            bars: 2,
            title: "Lock into a pattern",
            pattern: [0, 2, 3, 5, 6, 8, 10, 11, 13, 14],
            hint: "After 4 clicks, tap with the woodblock. The same short pattern repeats, so lock in and stay steady.",
          },
          {
            type: "rush",
            seconds: 30,
            source: "Section 35.1–35.2",
            questions: [
              choice("Adding one note each time a pattern repeats is…", "Additive process", ["Phase shifting", "Retrograde"], "Additive"),
              choice("Two copies of a pattern slowly drifting apart is…", "Phase shifting", ["Planing", "Additive process"], "Phasing"),
              choice("Phase shifting is most linked with…", "Steve Reich", ["J.S. Bach", "Schoenberg"], "Steve Reich"),
              choice("Additive process is most linked with…", "Philip Glass", ["Debussy", "Mozart"], "Philip Glass"),
            ],
          },
        ],
      },
    ],
  },
];
