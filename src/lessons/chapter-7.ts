import { parseNote } from "../music";
import { chordsSound } from "./chords-sound";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 7, chords in a key. Roman numerals turn chords into numbers, so the activities number the
// chords of real songs, build each key's chords from its scale, find the chord roots on the neck,
// and hear where phrases land (cadences).

const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const together = (...names: string[]): Sound => ({ kind: "chord", notes: midi(...names) });
const prog = (...symbols: string[]): Sound => chordsSound(symbols);
const chordCard = (text: string, staff: string[], sound: Sound = together(...staff)): StoryCard => ({ text, staff, chord: true, sound });
const pairCard = (text: string, left: string, right: string, label: string, sound: Sound): StoryCard => ({ text, left, right, label, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });
const song = (name: string, artist: string, key: string, chords: string[], answer: string[], options: string[]): Step => ({
  type: "realSong",
  song: name,
  artist,
  key,
  chords,
  answer,
  options,
  sound: chordsSound(chords),
});

const MAJOR_RN = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
const MINOR_RN = ["i", "ii°", "III", "iv", "V", "VI", "VII"];
const CADENCES = ["Authentic (V–I)", "Plagal (IV–I)", "Deceptive (V–vi)", "Half (ends on V)"];

/** Which Roman numeral is this chord in the key? */
const numeral = (prompt: string, staff: string[], options: string[], answer: string, why: string): RushQuestion => ({
  kind: "choice",
  prompt,
  options,
  answer,
  visual: { type: "staff", notes: staff, chord: true },
  sound: together(...staff),
  miss: why,
});

const cadence = (chords: string[], answer: string, why: string): RushQuestion => ({
  kind: "choice",
  prompt: "Listen to how the phrase ends. Which cadence is it?",
  options: CADENCES,
  answer,
  sound: prog(...chords),
  miss: why,
});

export const CHAPTER_7: Record<string, Step[]> = {
  "7.1": [
    story(
      chordCard("Every note of a scale can be the root of a chord. Roman numerals name those chords by scale degree: I is built on note 1, IV on note 4, V on note 5.", ["C4", "E4", "G4"]),
      pairCard("In C major, I is C, IV is F and V is G. In G major, I is G, IV is C and V is D. Same numbers, new key.", "I IV V", "C F G", "in C", prog("C", "F", "G", "C")),
      chordCard("Uppercase numerals are major chords and lowercase are minor: ii, iii and vi in a major key are minor chords. A small circle means diminished: vii°.", ["D4", "F4", "A4"]),
      pairCard("Numbers let you see the same pattern in any key, so you can play a song in a key that suits your voice. That's called transposing.", "I V vi IV", "in any key", "same song", prog("G", "D", "Em", "C")),
    ),
    practice(
      "Name it",
      numeral("In C major, which numeral is this chord?", ["F4", "A4", "C5"], ["ii", "IV", "V"], "IV", "F is the 4th note of C major, and F A C is major: IV"),
      numeral("In C major, which numeral is this chord?", ["A3", "C4", "E4"], ["IV", "vi", "VI"], "vi", "A is the 6th note of C major, and A C E is minor, so lowercase: vi"),
      { kind: "choice", prompt: "In G major, what chord is V?", options: ["C", "D", "Em"], answer: "D", visual: { type: "big", text: "G major: V = ?" }, sound: prog("G", "D"), miss: "Count up G A B C D: the 5th note is D, so V is D major" },
      { kind: "choice", prompt: "In D major, what chord is IV?", options: ["G", "A", "Em"], answer: "G", visual: { type: "big", text: "D major: IV = ?" }, sound: prog("D", "G"), miss: "D E F♯ G: the 4th note is G, so IV is G major" },
    ),
    practice(
      "Find it on the guitar",
      { kind: "fretInterval", string: 5, fret: 3, semitones: 5, label: "perfect 4th (the root of IV in G)", hint: "IV's root is a 4th above G: the next string up at the same fret, A string fret 3." },
      { kind: "fretInterval", string: 5, fret: 3, semitones: 7, label: "perfect 5th (the root of V in G)", hint: "V's root is a 5th above G: one string up and two frets higher, A string fret 5." },
    ),
    song("Let It Be", "The Beatles", "C major", ["C", "G", "Am", "F"], ["I", "V", "vi", "IV"], MAJOR_RN),
  ],

  "7.2": [
    story(
      chordCard("Build a triad on each note of the major scale using only the scale's notes, and you get the key's diatonic chords.", ["C4", "E4", "G4"]),
      pairCard("The pattern is always the same: major, minor, minor, major, major, minor, diminished.", "I ii iii", "IV V vi vii°", "M m m M M m °", prog("C", "Dm", "Em", "F", "G", "Am", "B°")),
      chordCard("I, IV and V are the three major chords. They're the backbone of countless songs.", ["G3", "B3", "D4"], prog("C", "F", "G", "C")),
      chordCard("ii, iii and vi are the minor chords. vi is the relative minor: Am in C major.", ["A3", "C4", "E4"], prog("C", "Am", "Dm", "G")),
      chordCard("vii° is the diminished chord, B D F in C. It's tense and wants to move to I.", ["B3", "D4", "F4"], prog("B°", "C")),
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Fill in the chords of C major.",
      given: ["C", null, "Em", null, "G", null, "B°"],
      answer: ["C", "Dm", "Em", "F", "G", "Am", "B°"],
      tiles: ["Am", "D", "Dm", "F", "Fm", "A"],
      labels: ["I", "ii", "iii", "IV", "V", "vi", "vii°"],
      sound: prog("C", "Dm", "Em", "F", "G", "Am", "B°"),
      miss: "C Dm Em F G Am B°: major, minor, minor, major, major, minor, diminished",
    }),
    practice(
      "Name it",
      { kind: "choice", prompt: "In any major key, what quality is the ii chord?", options: ["Major", "Minor", "Diminished"], answer: "Minor", miss: "ii, iii and vi are minor in every major key" },
      { kind: "choice", prompt: "What are the diatonic chords of G major?", options: ["G Am Bm C D Em F♯°", "G A B C D E F♯", "G Am B C Dm Em F°"], answer: "G Am Bm C D Em F♯°", visual: { type: "big", text: "G major" }, sound: prog("G", "Am", "Bm", "C", "D", "Em"), miss: "Same pattern from G: G Am Bm C D Em F♯°" },
      { kind: "choice", prompt: "Which chord is NOT in the key of C major?", options: ["Dm", "E", "F"], answer: "E", miss: "E major needs G♯, which isn't in C major. The diatonic chord is Em" },
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. I, then which chord? Major or minor?", options: ["IV (major)", "vi (minor)"], answer: "vi (minor)", sound: prog("C", "Am"), miss: "The second chord darkened: the minor vi" },
      { kind: "choice", prompt: "Listen. I, then which chord?", options: ["IV (major)", "vi (minor)"], answer: "IV (major)", sound: prog("C", "F"), miss: "The second chord stayed bright: the major IV" },
    ),
    song("Hallelujah", "Leonard Cohen", "C major", ["C", "Am", "F", "G"], ["I", "vi", "IV", "V"], MAJOR_RN),
  ],

  "7.3": [
    story(
      chordCard("Minor keys get their chords the same way, from the minor scale. In A minor the tonic chord is Am, written lowercase: i.", ["A3", "C4", "E4"]),
      pairCard("From natural minor the pattern is i, ii°, III, iv, v, VI, VII. In A minor: Am, B°, C, Dm, Em, F, G.", "i ii° III", "iv v VI VII", "in A minor", prog("Am", "B°", "C", "Dm", "Em", "F", "G")),
      chordCard("But a minor v chord pulls weakly to i. So composers borrow the raised 7th from harmonic minor (G♯ in A minor), which makes V major: E, G♯, B.", ["E4", "G#4", "B4"], prog("E", "Am")),
      pairCard("So in practice minor keys use i, ii°, III, iv, V, VI and VII. In pop and rock, the plain VII (G in A minor) is just as common.", "i VI VII", "Am F G", "minor rock", prog("Am", "F", "G", "Am")),
    ),
    practice(
      "Name it",
      numeral("In A minor, which numeral is this chord?", ["F3", "A3", "C4"], ["iv", "VI", "VII"], "VI", "F is the 6th note of A minor, and F A C is major: VI"),
      numeral("In A minor, which numeral is this chord?", ["D4", "F4", "A4"], ["iv", "IV", "ii°"], "iv", "D is the 4th note of A minor, and D F A is minor: iv"),
      { kind: "choice", prompt: "Why is V usually a major chord in a minor key?", options: ["It borrows the raised 7th from harmonic minor", "Minor keys have no minor chords", "It's built on the 4th note"], answer: "It borrows the raised 7th from harmonic minor", miss: "Raising the 7th (G to G♯ in A minor) makes E minor into E major, which pulls strongly to i" },
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Does the V chord use the raised 7th (major V) or not (minor v)?", options: ["Major V", "Minor v"], answer: "Major V", sound: prog("Am", "E", "Am"), miss: "You heard G♯ in the E chord, pulling up to A: major V" },
    ),
    song("Zombie", "The Cranberries", "E minor", ["Em", "C", "G", "D"], ["i", "VI", "III", "VII"], MINOR_RN),
  ],

  "7.4": [
    story(
      pairCard("A cadence is where a phrase lands, like punctuation. The strongest is the authentic cadence, V to I: a full stop.", "V", "I", "authentic", prog("G", "C")),
      pairCard("The plagal cadence, IV to I, is softer. It's the “A-men” at the end of hymns.", "IV", "I", "plagal", prog("F", "C")),
      pairCard("The deceptive cadence sets up I with V, then lands on vi instead. It's a surprise that keeps the song going.", "V", "vi", "deceptive", prog("G", "Am")),
      pairCard("A half cadence stops on V, like a comma or a question. It sounds unfinished.", "I", "V", "half", prog("C", "G")),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Which cadence is G to C in C major?", options: CADENCES, answer: "Authentic (V–I)", visual: { type: "big", text: "G → C" }, sound: prog("G", "C"), miss: "G is V and C is I: V–I, authentic" },
      { kind: "choice", prompt: "Which cadence is G to Am in C major?", options: CADENCES, answer: "Deceptive (V–vi)", visual: { type: "big", text: "G → Am" }, sound: prog("G", "Am"), miss: "V sets up I, but it lands on vi: deceptive" },
      { kind: "choice", prompt: "A phrase ends on a D chord in G major. Which cadence is it?", options: CADENCES, answer: "Half (ends on V)", visual: { type: "big", text: "G  C  D" }, sound: prog("G", "C", "D"), miss: "D is V in G, and the phrase stops there: a half cadence" },
    ),
    practice(
      "Name it by ear",
      cadence(["C", "F", "G", "C"], "Authentic (V–I)", "It settled home from V: authentic"),
      cadence(["C", "F", "C"], "Plagal (IV–I)", "Soft “A-men” ending from IV: plagal"),
      cadence(["C", "F", "G", "Am"], "Deceptive (V–vi)", "It expected home but landed on minor vi: deceptive"),
      cadence(["C", "Am", "F", "G"], "Half (ends on V)", "It stopped on V and sounds unfinished: half cadence"),
    ),
    practice("Use it in real songs", {
      kind: "choice",
      prompt: "Each verse of “Let It Be” by the Beatles ends “let it be” on F, then C. Which cadence is that?",
      options: CADENCES,
      answer: "Plagal (IV–I)",
      visual: { type: "big", text: "C  G  F  C", caption: "whisper words of wisdom, let it be" },
      sound: prog("C", "G", "F", "C"),
      miss: "In C major, F is IV: IV–I is the plagal, “A-men” cadence",
    }),
  ],
};
