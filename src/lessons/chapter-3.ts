import { parseNote } from "../music";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 3, minor scales and key signatures, in the same layout as chapters 1 and 2: story
// cards, then practice on the staff, in order, on the guitar and by ear, then real songs.

const notes = (...names: string[]): Sound => ({ kind: "melodic", notes: names.map((n) => parseNote(n).midi), gap: 0.45 });
const card = (text: string, staff: string[], sound: Sound = notes(...staff), keySig?: number): StoryCard => ({ text, staff, sound, keySig });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });
const chords = (...list: number[][]): Sound => ({ kind: "progression", gap: 0.9, chords: list });

const NATURAL = ["A4", "B4", "C5", "D5", "E5", "F5", "G5", "A5"];
const HARMONIC = ["A4", "B4", "C5", "D5", "E5", "F5", "G#5", "A5"];
const MELODIC = ["A4", "B4", "C5", "D5", "E5", "F#5", "G#5", "A5"];
const C_MAJOR = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
const MINOR_OPTIONS = ["Natural minor", "Harmonic minor", "Melodic minor"];

const Am = [45, 52, 57, 60, 64];
const Em = [40, 47, 52, 55, 59];
const C = [48, 52, 55, 60, 64];
const G = [43, 47, 50, 55, 59];
const D = [50, 54, 57, 62];
const F = [41, 48, 53, 57, 60];

const whichMinor = (keySig: number, prompt: string, options: string[], answer: string, why: string): RushQuestion => ({
  kind: "choice",
  prompt,
  options,
  answer,
  visual: { type: "staff", notes: [], keySig },
  miss: why,
});

export const CHAPTER_3: Record<string, Step[]> = {
  "3.1": [
    story(
      card("Minor scales sound darker than major. Natural minor is a major scale with its 3rd, 6th and 7th notes each lowered a half step.", ["C4", "D4", "Eb4", "F4", "G4", "Ab4", "Bb4", "C5"]),
      card("A natural minor uses the same white keys as C major, but starts on A. The half steps move to between notes 2–3 and 5–6, and that's what makes it sound sad.", NATURAL),
      card("So the natural minor pattern is W H W W H W W, instead of major's W W H W W W H.", ["A4", "B4", "C5", "D5"]),
      card("Harmonic minor raises the 7th back up: G becomes G♯. That leaves a big gap of three half steps between F and G♯, which gives it an exotic sound.", HARMONIC),
      card("Melodic minor raises both the 6th and the 7th on the way up (F♯ and G♯) to smooth that gap. Coming down, it goes back to natural minor.", MELODIC, notes(...MELODIC, "G5", "F5", "E5", "D5", "C5", "B4", "A4")),
      card("All three share the lowered 3rd: C in A minor. That one note is what makes a scale minor.", ["A4", "C5", "E5"]),
    ),
    practice(
      "Put it in order",
      {
        kind: "order",
        prompt: "Build A natural minor. Tap the notes in order.",
        given: ["A", "B", "C", null, null, null, null, "A"],
        answer: ["A", "B", "C", "D", "E", "F", "G", "A"],
        tiles: ["E", "G", "F♯", "D", "F"],
        labels: ["", "W", "H", "W", "W", "H", "W", "W"],
        sound: notes(...NATURAL),
        miss: "A natural minor is all white keys: A B C D E F G A, in the pattern W H W W H W W",
      },
      {
        kind: "order",
        prompt: "Now make it A harmonic minor. Which 7th?",
        given: ["A", "B", "C", "D", "E", "F", null, "A"],
        answer: ["A", "B", "C", "D", "E", "F", "G♯", "A"],
        tiles: ["G", "G♯", "F♯"],
        sound: notes(...HARMONIC),
        miss: "Harmonic minor raises only the 7th, so G becomes G♯",
      },
    ),
    practice(
      "Name it on the staff",
      {
        kind: "choice",
        prompt: "Which minor scale is this?",
        options: MINOR_OPTIONS,
        answer: "Harmonic minor",
        visual: { type: "staff", notes: HARMONIC },
        sound: notes(...HARMONIC),
        miss: "Only the 7th is raised (G♯), so it's harmonic minor",
      },
      {
        kind: "choice",
        prompt: "Which minor scale is this?",
        options: MINOR_OPTIONS,
        answer: "Melodic minor",
        visual: { type: "staff", notes: MELODIC },
        sound: notes(...MELODIC),
        miss: "Both the 6th and 7th are raised (F♯ and G♯), so it's melodic minor going up",
      },
    ),
    practice(
      "Build it on the guitar",
      { kind: "fretInterval", string: 4, fret: 0, semitones: 3, label: "minor 3rd (three frets)", hint: "In A minor the 3rd is C: three frets above A on the same string." },
      { kind: "findNote", pitchClass: 8, prompt: "A harmonic minor raises G to G♯. Find G♯.", hint: "G♯ is one fret above any G. Try the low E string, fret 4." },
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Which minor scale was that?", options: MINOR_OPTIONS, answer: "Harmonic minor", sound: notes(...HARMONIC), miss: "Listen for the big jump near the top, F to G♯: that's harmonic minor" },
      { kind: "choice", prompt: "Listen. Which minor scale was that?", options: MINOR_OPTIONS, answer: "Natural minor", sound: notes(...NATURAL), miss: "No raised notes and no big jump: natural minor" },
      { kind: "choice", prompt: "Listen. Which minor scale was that?", options: MINOR_OPTIONS, answer: "Melodic minor", sound: notes(...MELODIC), miss: "The top sounds like major (F♯, G♯, A) while the bottom is minor: melodic minor" },
    ),
    practice("Use it in real songs", {
      kind: "choice",
      prompt: "“Greensleeves” is in A minor, but its tune climbs through F♯ and G♯. Which minor scale is that?",
      options: MINOR_OPTIONS,
      answer: "Melodic minor",
      visual: { type: "staff", notes: ["A4", "C5", "D5", "E5", "F#5", "E5", "D5", "B4"] },
      sound: notes("A4", "C5", "D5", "E5", "F#5", "E5", "D5", "B4", "G4", "A4", "B4", "C5", "A4", "A4", "G#4", "A4", "B4", "G#4", "E4"),
      miss: "Raising both 6 and 7 on the way up (F♯ and G♯ in A minor) is melodic minor",
    }),
  ],

  "3.2": [
    story(
      card("A minor key uses the key signature of its natural minor scale. A minor has no sharps or flats, just like C major.", ["A4", "C5", "E5"], notes(...NATURAL), 0),
      card("Keys that share a key signature are relative keys. Every major key has a relative minor that starts on its 6th note: in C major, that's A.", ["C4", "D4", "E4", "F4", "G4", "A4"]),
      card("Shortcut: the relative minor is three half steps (three frets) below the major tonic. G, F♯, F, E: so G major's relative is E minor, and both have one sharp.", ["E4", "G4", "B4"], notes("G4", "F#4", "F4", "E4"), 1),
      card("Keys that share a tonic are parallel keys. C major and C minor start on the same note, but C minor's signature has three flats.", ["C4", "Eb4", "G4"], notes("C4", "D4", "Eb4", "F4", "G4", "Ab4", "Bb4", "C5"), -3),
      card("The raised 7th of harmonic minor isn't in the key signature. It's written as an accidental each time, like G♯ in A minor.", ["G#4", "A4"]),
    ),
    practice(
      "Name it on the staff",
      whichMinor(1, "This is G major’s key signature. Which minor key shares it?", ["E minor", "G minor", "D minor", "B minor"], "E minor", "Three half steps below G is E. G minor is G major's parallel key: same tonic, different signature"),
      whichMinor(0, "No sharps or flats. Which minor key is it?", ["A minor", "C minor", "E minor", "D minor"], "A minor", "No sharps or flats means C major or its relative, A minor"),
      whichMinor(-1, "This is F major’s key signature. Which minor key shares it?", ["D minor", "F minor", "A minor", "G minor"], "D minor", "Three half steps below F is D, so D minor has one flat too"),
      whichMinor(2, "This is D major’s key signature. Which minor key shares it?", ["B minor", "D minor", "F♯ minor", "E minor"], "B minor", "Three half steps below D is B: D, C♯, C, B"),
    ),
    practice("Build it on the guitar", {
      kind: "findNote",
      pitchClass: 4,
      prompt: "G major’s relative minor starts three frets below G. Find that note.",
      hint: "G is the low E string, fret 3. Three frets down is the open string: E.",
    }),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Major or minor?", options: ["Major", "Minor"], answer: "Minor", sound: notes(...NATURAL), miss: "That was A minor: the 3rd, C, is low, which gives it the darker sound" },
      { kind: "choice", prompt: "Listen. Major or minor?", options: ["Major", "Minor"], answer: "Major", sound: notes(...C_MAJOR), miss: "That was C major, the relative major of A minor: same notes, but it starts and ends on C" },
    ),
    practice(
      "Use it in real songs",
      {
        kind: "choice",
        prompt: "“Zombie” by The Cranberries uses Em, C, G and D, and its key signature has one sharp. Which minor key is it in?",
        options: ["E minor", "G minor", "D minor"],
        answer: "E minor",
        sound: chords(Em, C, G, D),
        miss: "One sharp is G major or its relative, E minor. The song keeps landing on Em, so it's E minor",
      },
      {
        kind: "choice",
        prompt: "This progression keeps returning to Am and has no sharps or flats. Which key is it in?",
        options: ["A minor", "C minor", "E minor"],
        answer: "A minor",
        sound: chords(Am, F, C, G, Am),
        miss: "No sharps or flats is C major or A minor, and Am is home here, so it's A minor",
      },
    ),
  ],

  "3.3": [
    story(
      card("Each note of a scale has a number from 1 to 7, called a scale degree. In C major, C is 1, D is 2, and so on up to B, which is 7.", C_MAJOR),
      card("They have names too. 1 is the tonic: home. 5 is the dominant: the note with the strongest pull back home.", ["C4", "G4"]),
      card("4 is the subdominant, a 5th below the tonic, mirroring the dominant. 3 is the mediant, halfway from tonic to dominant.", ["F4", "E4"]),
      card("2 is the supertonic, just above the tonic. 6 is the submediant, halfway between the tonic and the subdominant below it.", ["D4", "A4"]),
      card("7 is the leading tone. It's a half step below the tonic and leads right back home. In natural minor, 7 is a whole step below, so it's called the subtonic.", ["B4", "C5", "G4", "A4"]),
    ),
    practice("Put it in order", {
      kind: "order",
      layout: "list",
      prompt: "Name each note of C major by its scale degree.",
      given: ["Tonic", "Supertonic", "Mediant", null, "Dominant", null, null],
      answer: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading tone"],
      tiles: ["Leading tone", "Submediant", "Subtonic", "Subdominant"],
      labels: ["1 · C", "2 · D", "3 · E", "4 · F", "5 · G", "6 · A", "7 · B"],
      sound: notes(...C_MAJOR),
      miss: "4 is the subdominant, 6 the submediant, and 7 in major is the leading tone. Subtonic is for natural minor",
    }),
    practice(
      "Name it",
      { kind: "choice", prompt: "In G major, which note is the dominant?", options: ["D", "C", "E"], answer: "D", visual: { type: "big", text: "G major" }, miss: "Count up G A B C D: the 5th note, the dominant, is D" },
      { kind: "choice", prompt: "In D major, which note is the leading tone?", options: ["C♯", "C", "E"], answer: "C♯", visual: { type: "big", text: "D major" }, miss: "The leading tone is a half step below the tonic: C♯ leads to D" },
      { kind: "choice", prompt: "In A natural minor, G is the…", options: ["Subtonic", "Leading tone", "Dominant"], answer: "Subtonic", visual: { type: "big", text: "A minor" }, miss: "G is a whole step below A, so in natural minor it's the subtonic, not a leading tone" },
    ),
    practice("Build it on the guitar", {
      kind: "findNote",
      pitchClass: 4,
      prompt: "Find the dominant of A.",
      hint: "Count A B C♯ D E: the 5th note is E. Try the open low E string.",
    }),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Does the tune end at home, on the tonic?", options: ["Yes, on the tonic", "No, on the leading tone"], answer: "Yes, on the tonic", sound: notes("E4", "D4", "G4", "B3", "C4"), miss: "It ended on C, the tonic, so it sounds finished" },
      { kind: "choice", prompt: "Listen. Does the tune end at home, on the tonic?", options: ["Yes, on the tonic", "No, on the leading tone"], answer: "No, on the leading tone", sound: notes("E4", "D4", "C4", "D4", "B3"), miss: "It stopped on B, the leading tone, so it sounds like it still wants to go up to C" },
    ),
    practice(
      "Use it in real songs",
      {
        kind: "choice",
        prompt: "“Twinkle, Twinkle, Little Star” leaps from C up to G. In C major, G is the…",
        options: ["Dominant", "Subdominant", "Mediant"],
        answer: "Dominant",
        visual: { type: "staff", notes: ["C4", "C4", "G4", "G4", "A4", "A4", "G4"] },
        sound: notes("C4", "C4", "G4", "G4", "A4", "A4", "G4"),
        miss: "G is the 5th note of C major: the dominant",
      },
      {
        kind: "choice",
        prompt: "“Let It Be” by The Beatles goes C, G, Am, F in C major. The G chord is built on which degree?",
        options: ["Dominant", "Subdominant", "Submediant"],
        answer: "Dominant",
        sound: chords(C, G, [45, 52, 57, 60, 64], F),
        miss: "G is degree 5, the dominant. F is the subdominant (4) and Am the submediant (6)",
      },
    ),
  ],
};
