import { parseNote } from "../music";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 6, triads. Intervals become chords: stack 3rds to build each quality, read the chord
// symbols on a song sheet, find inversions in guitar shapes you already play, and hear sus chords
// resolve.

const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const together = (...names: string[]): Sound => ({ kind: "chord", notes: midi(...names) });
const chords = (...list: string[][]): Sound => ({ kind: "progression", gap: 1, chords: list.map((c) => midi(...c)) });
/** A story card showing one chord stacked on the staff. */
const card = (text: string, staff: string[], sound: Sound = together(...staff)): StoryCard => ({ text, staff, chord: true, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

/** Fill in the 3rd and 5th above a root. */
const stack = (name: string, answer: [string, string, string], tiles: string[], gaps: string, sound: string[]): RushQuestion => ({
  kind: "order",
  prompt: `Build ${name}. Fill in the 3rd and the 5th.`,
  given: [answer[0], null, null],
  answer,
  tiles,
  labels: ["root", "3rd", "5th"],
  sound: together(...sound),
  miss: `${name} is ${answer.join(" ")}: ${gaps}`,
});

/** Name the chord drawn on the staff. */
const nameChord = (notes: string[], prompt: string, options: string[], answer: string, why: string): RushQuestion => ({
  kind: "choice",
  prompt,
  options,
  answer,
  visual: { type: "staff", notes, chord: true },
  sound: together(...notes),
  miss: why,
});

const QUALITIES = ["Major", "Minor", "Diminished", "Augmented"];
const hear = (notes: string[], answer: string, why: string, options = QUALITIES): RushQuestion => ({
  kind: "choice",
  prompt: "Listen. What kind of chord is this?",
  options,
  answer,
  sound: together(...notes),
  miss: why,
});

export const CHAPTER_6: Record<string, Step[]> = {
  "6.1": [
    story(
      card("A chord is three or more notes sounding together. The most common chord is the triad: three notes stacked in 3rds.", ["C4", "E4", "G4"]),
      card("The bottom note is the root, the one the chord is named after. Above it are the 3rd and the 5th. In C major that's C, E and G.", ["C4", "E4", "G4"]),
      card("A major triad is a major 3rd with a minor 3rd on top. It sounds bright.", ["C4", "E4", "G4"]),
      card("A minor triad flips them: a minor 3rd on the bottom, a major 3rd on top. C minor is C, E♭, G, and it sounds darker.", ["C4", "Eb4", "G4"]),
      card("Two minor 3rds make a diminished triad (C, E♭, G♭), tense and unstable. Two major 3rds make an augmented triad (C, E, G♯), which sounds unsettled and dreamy.", ["C4", "Eb4", "Gb4"], chords(["C4", "Eb4", "Gb4"], ["C4", "E4", "G#4"])),
    ),
    practice(
      "Stack it",
      stack("C major", ["C", "E", "G"], ["E", "E♭", "G", "G♯"], "a major 3rd, then a minor 3rd", ["C4", "E4", "G4"]),
      stack("C minor", ["C", "E♭", "G"], ["E", "E♭", "G", "G♭"], "a minor 3rd, then a major 3rd", ["C4", "Eb4", "G4"]),
      stack("A minor", ["A", "C", "E"], ["C", "C♯", "E", "E♭"], "a minor 3rd, then a major 3rd", ["A3", "C4", "E4"]),
      stack("C diminished", ["C", "E♭", "G♭"], ["E", "E♭", "G", "G♭"], "two minor 3rds", ["C4", "Eb4", "Gb4"]),
    ),
    practice(
      "Name it on the staff",
      nameChord(["G4", "B4", "D5"], "What kind of triad is this?", QUALITIES, "Major", "G to B is a major 3rd and B to D a minor 3rd: major"),
      nameChord(["D4", "F4", "A4"], "What kind of triad is this?", QUALITIES, "Minor", "D to F is a minor 3rd and F to A a major 3rd: minor"),
      nameChord(["B3", "D4", "F4"], "What kind of triad is this?", QUALITIES, "Diminished", "B to D and D to F are both minor 3rds: diminished"),
    ),
    practice(
      "Name it by ear",
      hear(["C4", "E4", "G4"], "Major", "Bright and settled: major", ["Major", "Minor"]),
      hear(["A3", "C4", "E4"], "Minor", "Darker and sadder: minor", ["Major", "Minor"]),
      hear(["C4", "E4", "G#4"], "Augmented", "Floaty and unresolved, with a raised 5th: augmented", ["Major", "Augmented", "Diminished"]),
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "“Stand By Me” by Ben E. King moves from A to F♯m. The F♯m chord is F♯, A, C♯. What kind of triad is it?", options: ["Major", "Minor", "Diminished"], answer: "Minor", visual: { type: "staff", notes: ["F#4", "A4", "C#5"], chord: true }, sound: chords(["A3", "C#4", "E4"], ["F#3", "A3", "C#4"]), miss: "F♯ to A is a minor 3rd, A to C♯ a major 3rd: minor" },
    ),
  ],

  "6.2": [
    story(
      card("Song sheets name chords with lead-sheet symbols. The letter is the root. A letter on its own means a major triad: C means C, E, G.", ["C4", "E4", "G4"]),
      card("A small m means minor: Cm is C, E♭, G. Am is A, C, E.", ["A3", "C4", "E4"]),
      card("A small circle means diminished: C° (also written Cdim) is C, E♭, G♭.", ["C4", "Eb4", "Gb4"]),
      card("A plus sign means augmented: C+ (also written Caug) is C, E, G♯.", ["C4", "E4", "G#4"]),
      card("The symbol only tells you which notes. You choose how to play them, like the open chord shapes on guitar.", ["E3", "G3", "C4", "E4"]),
    ),
    practice(
      "Read the chart",
      { kind: "choice", prompt: "“Let It Be” goes C, G, ?, F under “When I find myself in times of trouble”. The missing chord is A, C, E. Which symbol is it?", options: ["A", "Am", "A°"], answer: "Am", visual: { type: "big", text: "C  G  ?  F", caption: "When I find myself in times of trouble" }, sound: chords(["C4", "E4", "G4"], ["B3", "D4", "G4"], ["A3", "C4", "E4"], ["A3", "C4", "F4"]), miss: "A to C is a minor 3rd, so it's A minor: Am" },
      { kind: "choice", prompt: "Which notes does the symbol Dm mean?", options: ["D F♯ A", "D F A", "D F A♭"], answer: "D F A", visual: { type: "big", text: "Dm" }, sound: together("D4", "F4", "A4"), miss: "m means minor: a minor 3rd (D–F) then a major 3rd (F–A)" },
      { kind: "choice", prompt: "Which symbol means B, D, F?", options: ["B", "Bm", "B°"], answer: "B°", visual: { type: "staff", notes: ["B3", "D4", "F4"], chord: true }, sound: together("B3", "D4", "F4"), miss: "Two minor 3rds is diminished, written with a small circle: B°" },
      { kind: "choice", prompt: "What does E+ mean?", options: ["E G♯ B", "E G♯ B♯", "E G B"], answer: "E G♯ B♯", visual: { type: "big", text: "E+" }, sound: together("E4", "G#4", "C5"), miss: "+ is augmented: two major 3rds, E–G♯–B♯" },
    ),
    practice(
      "Build it on the guitar",
      { kind: "fretInterval", string: 4, fret: 3, semitones: 4, label: "major 3rd (the 3rd of C)", hint: "The 3rd of a C chord is E: one string up and one fret lower." },
      { kind: "fretInterval", string: 4, fret: 0, semitones: 3, label: "minor 3rd (the 3rd of Am)", hint: "The 3rd of A minor is C, three frets above A. Try the A string, fret 3." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Most pop songs, like “Let It Be”, use four chords: C, G, Am and F. How many of them are minor?", options: ["None", "One", "Two"], answer: "One", visual: { type: "big", text: "C  G  Am  F" }, sound: chords(["C4", "E4", "G4"], ["B3", "D4", "G4"], ["A3", "C4", "E4"], ["A3", "C4", "F4"]), miss: "Only Am has the m. C, G and F are major" },
    ),
  ],

  "6.3": [
    story(
      card("When the root is the lowest note, the chord is in root position.", ["C4", "E4", "G4"]),
      card("When the 3rd is the lowest note, it's in first inversion. Same notes, C E G, but E is in the bass.", ["E4", "G4", "C5"]),
      card("When the 5th is the lowest note, it's in second inversion: G in the bass.", ["G4", "C5", "E5"]),
      card("Chord symbols show the bass with a slash: C/E means a C chord with E in the bass. C/G has G in the bass.", ["E3", "G3", "C4", "E4"]),
      card("On guitar, the lowest string you play decides the bass. Strum the open C shape from the low E string and you get C/E.", ["E2", "C3", "E3", "G3", "C4", "E4"]),
    ),
    practice(
      "Name it on the staff",
      nameChord(["E4", "G4", "C5"], "Which inversion is this C chord in?", ["Root position", "First inversion", "Second inversion"], "First inversion", "E, the 3rd, is in the bass: first inversion"),
      nameChord(["G4", "C5", "E5"], "Which inversion is this C chord in?", ["Root position", "First inversion", "Second inversion"], "Second inversion", "G, the 5th, is in the bass: second inversion"),
    ),
    practice(
      "On the guitar",
      { kind: "choice", prompt: "You play a C chord and let the low E string ring too. What's the chord now?", options: ["C", "C/E", "Em"], answer: "C/E", visual: { type: "fretboard", marks: [{ string: 5, fret: 0 }, { string: 4, fret: 3 }, { string: 3, fret: 2 }, { string: 2, fret: 0 }, { string: 1, fret: 1 }, { string: 0, fret: 0 }] }, sound: together("E2", "C3", "E3", "G3", "C4", "E4"), miss: "E is now the lowest note, the 3rd of C: first inversion, C/E" },
      { kind: "choice", prompt: "A D chord played from the open A string has A in the bass. How is it written?", options: ["D", "D/A", "A/D"], answer: "D/A", visual: { type: "fretboard", marks: [{ string: 4, fret: 0 }, { string: 3, fret: 0 }, { string: 2, fret: 2 }, { string: 1, fret: 3 }, { string: 0, fret: 2 }] }, sound: together("A2", "D3", "A3", "D4", "F#4"), miss: "The chord comes first and the bass after the slash: D/A" },
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen to the bass. Root position, or first inversion?", options: ["Root position", "First inversion"], answer: "First inversion", sound: chords(["C3", "E3", "G3", "C4"], ["E2", "G3", "C4", "E4"]), miss: "The second chord's bass dropped to E, the 3rd: first inversion" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Bass lines walk down using inversions, like C, then C/B, then Am. Which note is in the bass of C/B?", options: ["C", "B", "A"], answer: "B", visual: { type: "big", text: "C  C/B  Am" }, sound: chords(["C3", "E3", "G3", "C4"], ["B2", "E3", "G3", "C4"], ["A2", "E3", "A3", "C4"]), miss: "The note after the slash is the bass: B. It steps down C, B, A" },
    ),
  ],

  "6.4": [
    story(
      card("To name a spread-out chord, first find its root: rearrange the notes until they stack in 3rds.", ["G3", "E4", "C5"]),
      card("Here, E, G, C stacks as C, E, G. So the root is C.", ["C4", "E4", "G4"]),
      card("Next, name the quality from the two 3rds: C to E is major and E to G is minor, so it's a major triad.", ["C4", "E4", "G4"]),
      card("Last, check the bass. The lowest note was G, the 5th, so the full name is C/G, in second inversion.", ["G3", "C4", "E4"]),
    ),
    practice(
      "Find the root",
      {
        kind: "order",
        prompt: "Stack these notes in 3rds: E, C, A.",
        given: [null, null, null],
        answer: ["A", "C", "E"],
        tiles: ["C", "E", "A"],
        labels: ["root", "3rd", "5th"],
        sound: together("E3", "C4", "A4"),
        miss: "A C E stacks in 3rds, so A is the root: A minor",
      },
      nameChord(["E4", "G4", "C5"], "Name this chord.", ["Em", "C/E", "G"], "C/E", "Stacked in 3rds it's C E G, so the root is C, and E is in the bass: C/E"),
      nameChord(["F#4", "A4", "D5"], "Name this chord.", ["D/F♯", "F♯m", "A"], "D/F♯", "Stacked in 3rds it's D F♯ A: a D chord with F♯ in the bass"),
      nameChord(["A3", "D4", "F4"], "Name this chord.", ["Dm/A", "F/A", "Am"], "Dm/A", "Stacked it's D F A, D minor, with A in the bass: Dm/A"),
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Guitarists love the D/F♯ chord, with the thumb or low string on F♯. Which note of the D chord is in the bass?", options: ["Root", "3rd", "5th"], answer: "3rd", visual: { type: "staff", notes: ["F#3", "A3", "D4"], chord: true }, sound: chords(["G2", "B2", "D3", "G3"], ["F#2", "A2", "D3", "F#3"], ["E2", "G2", "B2", "E3"]), miss: "D F♯ A: F♯ is the 3rd, so D/F♯ is first inversion. It links G down to Em" },
    ),
  ],

  "6.5": [
    story(
      card("A sus chord swaps the 3rd for a neighbor. Without a 3rd, it's neither major nor minor.", ["D4", "G4", "A4"]),
      card("Sus4 replaces the 3rd with the 4th: Dsus4 is D, G, A.", ["D4", "G4", "A4"], chords(["D4", "G4", "A4"], ["D4", "F#4", "A4"])),
      card("Sus2 replaces it with the 2nd: Dsus2 is D, E, A.", ["D4", "E4", "A4"], chords(["D4", "E4", "A4"], ["D4", "F#4", "A4"])),
      card("A sus chord wants to settle back onto the 3rd. That pull is why guitarists flick between D, Dsus4 and Dsus2.", ["D4", "F#4", "A4"], chords(["D4", "F#4", "A4"], ["D4", "G4", "A4"], ["D4", "F#4", "A4"], ["D4", "E4", "A4"], ["D4", "F#4", "A4"])),
    ),
    practice(
      "Name it on the staff",
      nameChord(["C4", "F4", "G4"], "Name this chord.", ["C", "Csus4", "Csus2"], "Csus4", "F replaces E, the 3rd: Csus4"),
      nameChord(["A3", "B3", "E4"], "Name this chord.", ["Am", "Asus2", "Asus4"], "Asus2", "B replaces C♯, the 3rd: Asus2"),
    ),
    practice(
      "Build it on the guitar",
      { kind: "choice", prompt: "To turn an open D chord into Dsus4, where does the extra finger go?", options: ["High e string, fret 3", "B string, fret 1", "G string, fret 4"], answer: "High e string, fret 3", visual: { type: "fretboard", marks: [{ string: 3, fret: 0 }, { string: 2, fret: 2 }, { string: 1, fret: 3 }, { string: 0, fret: 2 }] }, sound: chords(["D3", "A3", "D4", "F#4"], ["D3", "A3", "D4", "G4"]), miss: "The high e string's F♯ (fret 2) is the 3rd. Move it to G (fret 3) for sus4" },
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Which chord is the sus chord, the first or the second?", options: ["First", "Second"], answer: "First", sound: chords(["D4", "G4", "A4"], ["D4", "F#4", "A4"]), miss: "The first one hangs in the air, then the second settles onto F♯: Dsus4 to D" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "“Free Fallin'” by Tom Petty keeps moving between D and Dsus4. Which note does the sus4 add?", options: ["E", "G", "A"], answer: "G", visual: { type: "big", text: "D  Dsus4  D" }, sound: chords(["D3", "A3", "D4", "F#4"], ["D3", "A3", "D4", "G4"], ["D3", "A3", "D4", "F#4"]), miss: "Dsus4 swaps the 3rd (F♯) for the 4th (G)" },
    ),
  ],
};
