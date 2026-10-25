import { parseNote } from "../music";
import { chordsSound } from "./chords-sound";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 10, non-chord tones: melody notes that aren't in the chord. Each kind is defined by how
// the melody gets to the note and leaves it (step, leap, or the same note), so every lesson shows a
// short melody over a held chord, asks which note is the outsider and how it moves, and plays it.

const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const C_CHORD = midi("C3", "E3", "G3");
/** A melody played over one held chord (C major unless given). */
const over = (melody: string[], chord: number[] = C_CHORD): Sound => ({ kind: "withChord", chord, notes: midi(...melody), gap: 0.55 });
const card = (text: string, staff: string[], sound: Sound = over(staff)): StoryCard => ({ text, staff, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

const KINDS = ["Passing tone", "Neighbor tone", "Appoggiatura", "Escape tone", "Anticipation", "Suspension"];

/** Name the non-chord tone in a melody over C major. */
const nct = (melody: string[], answer: string, why: string, options = KINDS.slice(0, 4), chord?: number[]): RushQuestion => ({
  kind: "choice",
  prompt: "The chord is C major (C E G). What kind of non-chord tone is in this melody?",
  options,
  answer,
  visual: { type: "staff", notes: melody },
  sound: over(melody, chord),
  miss: why,
});

/** Which note of the melody is outside the chord? */
const outsider = (melody: string[], answer: string, options: string[], why: string): RushQuestion => ({
  kind: "choice",
  prompt: "The chord is C major (C E G). Which note doesn't belong to it?",
  options,
  answer,
  visual: { type: "staff", notes: melody },
  sound: over(melody),
  miss: why,
});

const realSong = (...questions: RushQuestion[]): Step => practice("Use it in real songs", ...questions);

export const CHAPTER_10: Record<string, Step[]> = {
  "10.1": [
    story(
      card("Melodies don't only use the notes of the chord underneath. Notes that aren't in the chord are called non-chord tones.", ["E4", "F4", "G4"]),
      card("Over a C chord (C E G), the melody E, F, G has one outsider: F. It's a non-chord tone.", ["E4", "F4", "G4"]),
      card("Each kind of non-chord tone is named by how you get to it and how you leave it: by step (next note), by leap (a jump), or by staying on the same note.", ["E4", "F4", "E4"]),
    ),
    practice(
      "Spot the outsider",
      outsider(["E4", "F4", "G4"], "F", ["E", "F", "G"], "C major is C E G, so F is the non-chord tone"),
      outsider(["G4", "A4", "G4"], "A", ["G", "A"], "A isn't in C E G: it's the non-chord tone"),
      outsider(["C5", "B4", "C5"], "B", ["C", "B"], "B isn't in C E G"),
    ),
    realSong({ kind: "choice", prompt: "“Mary Had a Little Lamb” starts E, D, C, D, E over a C chord. Which note isn't in the chord?", options: ["E", "D", "C"], answer: "D", visual: { type: "staff", notes: ["E4", "D4", "C4", "D4", "E4"] }, sound: over(["E4", "D4", "C4", "D4", "E4"]), miss: "D is the only note not in C E G" }),
  ],

  "10.2": [
    story(
      card("A passing tone fills the gap between two chord tones by step, moving in one direction. E, F, G over C: F passes from E to G.", ["E4", "F4", "G4"]),
      card("It can go down too: G, F, E. And from C up to E, the D in between is a passing tone as well.", ["C5", "D5", "E5"]),
      card("Passing tones usually fall on weak beats, so they sound like smooth connections, not clashes.", ["G4", "F4", "E4"]),
    ),
    practice(
      "Name it",
      nct(["E4", "F4", "G4"], "Passing tone", "F steps from E up to G, moving one way: a passing tone"),
      nct(["G4", "F4", "E4"], "Passing tone", "F steps from G down to E: a passing tone"),
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 3, fret: 2, semitones: 1, label: "half step (the passing tone F above E)", hint: "From E on the D string, fret 2, the passing tone F is one fret up: fret 3. Then G is fret 5." },
    ),
    realSong({ kind: "choice", prompt: "“Joy to the World” walks straight down the scale: C B A G F E D C. Over a C chord, what are B, A, F and D doing?", options: ["Passing between chord tones", "Repeating the root", "Leaping"], answer: "Passing between chord tones", visual: { type: "staff", notes: ["C5", "B4", "A4", "G4", "F4", "E4", "D4", "C4"] }, sound: over(["C5", "B4", "A4", "G4", "F4", "E4", "D4", "C4"]), miss: "Each one steps between chord tones in one direction: passing tones" }),
  ],

  "10.3": [
    story(
      card("A neighbor tone steps away from a chord tone and comes straight back. E, F, E over C: F is an upper neighbor.", ["E4", "F4", "E4"]),
      card("A lower neighbor steps down and back: E, D, E.", ["E4", "D4", "E4"]),
      card("Neighbor tones decorate a note without going anywhere, like a little wiggle.", ["G4", "A4", "G4"]),
    ),
    practice(
      "Name it",
      nct(["E4", "F4", "E4"], "Neighbor tone", "F steps up from E and back to E: a neighbor tone"),
      nct(["G4", "F4", "G4"], "Neighbor tone", "F steps down from G and back: a lower neighbor"),
      nct(["E4", "F4", "G4"], "Passing tone", "F keeps going, from E to G: a passing tone, not a neighbor"),
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 2, fret: 0, semitones: 2, label: "whole step (the upper neighbor A above G)", hint: "From the open G string, the neighbor A is two frets up. Play G, A, G: that's a hammer-on and pull-off." },
    ),
    realSong({ kind: "choice", prompt: "Guitar riffs often wiggle with a hammer-on and pull-off, like G, A, G. What's the A?", options: ["Neighbor tone", "Passing tone", "Chord tone"], answer: "Neighbor tone", visual: { type: "staff", notes: ["G4", "A4", "G4"] }, sound: over(["G4", "A4", "G4", "G4", "A4", "G4"]), miss: "It steps up and comes straight back: a neighbor tone" }),
  ],

  "10.4": [
    story(
      card("An appoggiatura is approached by a leap and left by a step, usually in the opposite direction. C, A, G over C: leap up to A, step down to G.", ["C4", "A4", "G4"]),
      card("It usually lands on a strong beat, so the clash is felt. That makes it expressive, like a sigh.", ["E4", "D5", "C5"]),
      card("Leap in, step out. The name comes from the Italian for “to lean”.", ["C4", "A4", "G4"]),
    ),
    practice(
      "Name it",
      nct(["C4", "A4", "G4"], "Appoggiatura", "Leap up to A, then step down to G: an appoggiatura"),
      nct(["G4", "D5", "C5"], "Appoggiatura", "Leap up to D, then step down to C: an appoggiatura"),
      nct(["E4", "F4", "E4"], "Neighbor tone", "That one arrived by step, not leap: a neighbor tone"),
    ),
    realSong({ kind: "choice", prompt: "Big ballad choruses often leap up to a note that isn't in the chord, then sigh down a step onto one that is. What's that called?", options: ["Appoggiatura", "Escape tone", "Pedal point"], answer: "Appoggiatura", visual: { type: "staff", notes: ["G4", "D5", "C5"] }, sound: over(["G4", "D5", "C5"]), miss: "Leap in, step out: an appoggiatura. It's one reason those moments feel emotional" }),
  ],

  "10.5": [
    story(
      card("An escape tone is the opposite of an appoggiatura: approached by step, left by leap in the other direction. E, F, C over C.", ["E4", "F4", "C4"]),
      card("It sounds like the melody starts to move, then escapes somewhere else.", ["G4", "A4", "E4"]),
      card("Step in, leap out.", ["E4", "F4", "C4"]),
    ),
    practice(
      "Name it",
      nct(["E4", "F4", "C4"], "Escape tone", "Step up to F, then leap down to C: an escape tone"),
      nct(["G4", "A4", "E4"], "Escape tone", "Step up to A, then leap down to E: an escape tone"),
      nct(["C4", "A4", "G4"], "Appoggiatura", "Leap in, step out is the appoggiatura. The escape tone is step in, leap out"),
    ),
    realSong({ kind: "choice", prompt: "A melody steps up from E to F, then jumps down to C. Which is it?", options: ["Escape tone", "Appoggiatura", "Passing tone"], answer: "Escape tone", visual: { type: "staff", notes: ["E4", "F4", "C4"] }, sound: over(["E4", "F4", "C4"]), miss: "Step in, leap out: escape tone" }),
  ],

  "10.6": [
    story(
      card("A double neighbor visits both neighbors before coming back: E, F, D, E over C.", ["E4", "F4", "D4", "E4"]),
      card("It can go below first, too: E, D, F, E. Either way, it circles the chord tone.", ["E4", "D4", "F4", "E4"]),
      card("Guitarists play this all the time as a quick turn around a note.", ["G4", "A4", "F4", "G4"]),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "E, F, D, E over C. What are F and D?", options: ["A double neighbor", "Two passing tones", "An escape tone"], answer: "A double neighbor", visual: { type: "staff", notes: ["E4", "F4", "D4", "E4"] }, sound: over(["E4", "F4", "D4", "E4"]), miss: "They visit the notes above and below E, then return: double neighbor" },
      { kind: "choice", prompt: "G, A, F, G over C. Which note does it circle?", options: ["G", "A", "F"], answer: "G", visual: { type: "staff", notes: ["G4", "A4", "F4", "G4"] }, sound: over(["G4", "A4", "F4", "G4"]), miss: "It starts and ends on G, visiting A and F on the way" },
    ),
    realSong({ kind: "choice", prompt: "The famous turn in classical melodies, like in Bach's Minuet in G, circles a note from above and below. What's that pattern?", options: ["Double neighbor", "Suspension", "Anticipation"], answer: "Double neighbor", visual: { type: "staff", notes: ["D5", "E5", "C5", "D5"] }, sound: over(["D5", "E5", "C5", "D5"], midi("G3", "B3", "D4")), miss: "Above, below and back: a double neighbor" }),
  ],

  "10.7": [
    story(
      card("An anticipation plays a note of the next chord early, before the chord arrives. Over G going to C, the melody hits C early.", ["D4", "C4", "C4"], { kind: "progression", gap: 0.6, chords: [midi("G3", "B3", "D4"), midi("G3", "B3", "C4"), midi("C3", "E3", "C4")] }),
      card("It's usually short and right before the beat, and it's very common at cadences.", ["D4", "C4", "C4"]),
      card("In pop, singers anticipate all the time by jumping in a little before the beat. It makes a line feel eager.", ["E4", "D4", "D4"]),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "The chords go G to C. The melody plays C just before the C chord arrives. What's that early C?", options: ["Anticipation", "Suspension", "Neighbor tone"], answer: "Anticipation", visual: { type: "staff", notes: ["D4", "C4", "C4"] }, sound: { kind: "progression", gap: 0.6, chords: [midi("G3", "B3", "D4"), midi("G3", "B3", "C4"), midi("C3", "E3", "C4")] }, miss: "It's a note of the next chord, arriving early: an anticipation" },
      { kind: "choice", prompt: "What's the difference between an anticipation and a suspension?", options: ["Anticipation arrives early, suspension hangs on late", "They're the same", "Anticipation leaps, suspension steps up"], answer: "Anticipation arrives early, suspension hangs on late", miss: "An anticipation jumps ahead to the next chord. A suspension holds a note over from the last one" },
    ),
    realSong({ kind: "choice", prompt: "In the last line of a song, the singer hits the final note just before the band lands on the final chord. What is that?", options: ["Anticipation", "Pedal point", "Escape tone"], answer: "Anticipation", sound: { kind: "progression", gap: 0.6, chords: [midi("G3", "B3", "D4"), midi("G3", "B3", "C4"), midi("C3", "E3", "C4")] }, miss: "The melody gets there first: anticipation" }),
  ],

  "10.8": [
    story(
      card("A pedal point is one note held (or repeated) while the chords change over it. It starts as a chord tone and becomes an outsider as the chords move.", ["G3", "C4", "E4"], chordsSound(["C", "F", "G", "C"])),
      card("Most pedals are in the bass. Here G is held under C, F, G and C. Over F, the G clashes, then fits again.", ["G3", "C4", "F4"], { kind: "progression", gap: 1, chords: [midi("G2", "C4", "E4"), midi("G2", "C4", "F4"), midi("G2", "B3", "D4"), midi("G2", "C4", "E4")] }),
      card("On guitar, open strings make great pedals: let the open low E or high e ring while you move shapes above it.", ["E4", "B4", "E5"], { kind: "progression", gap: 1, chords: [midi("E2", "B3", "E4"), midi("E2", "A3", "C#4"), midi("E2", "B3", "D#4"), midi("E2", "B3", "E4")] }),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Listen. One bass note stays the same while the chords change above it. What's that called?", options: ["Pedal point", "Passing tone", "Anticipation"], answer: "Pedal point", sound: { kind: "progression", gap: 1, chords: [midi("G2", "C4", "E4"), midi("G2", "C4", "F4"), midi("G2", "B3", "D4"), midi("G2", "C4", "E4")] }, miss: "A held note under moving chords is a pedal point" },
      { kind: "choice", prompt: "Where is a pedal point usually found?", options: ["In the bass", "In the melody only", "In the drums"], answer: "In the bass", miss: "Most pedals are bass notes, though they can appear in any voice" },
    ),
    realSong({ kind: "choice", prompt: "Many rock riffs keep hitting the open low E string between moving chords, like in AC/DC songs. What is that open E?", options: ["A pedal point", "A neighbor tone", "A suspension"], answer: "A pedal point", visual: { type: "fretboard", marks: [{ string: 5, fret: 0 }] }, sound: { kind: "progression", gap: 0.5, chords: [midi("E2", "B2"), midi("E2", "D3"), midi("E2", "B2"), midi("E2", "A2", "D3")] }, miss: "One note returns over and over under the changes: a pedal point" }),
  ],

  "10.9": [
    story(
      card("A suspension holds a note over from one chord into the next, where it clashes, then resolves down by step.", ["F4", "F4", "E4"], { kind: "progression", gap: 0.9, chords: [midi("F3", "A3", "C4", "F4"), midi("C3", "G3", "C4", "F4"), midi("C3", "G3", "C4", "E4")] }),
      card("It has three parts: the preparation (the note in the first chord), the suspension (held into the new chord) and the resolution (down a step).", ["F4", "F4", "E4"]),
      card("Suspensions are named by the intervals above the bass: 4–3 (F to E over C), 7–6, 9–8. That 4–3 is the same sound as a sus4 chord resolving.", ["F4", "E4"], { kind: "progression", gap: 0.9, chords: [midi("C3", "G3", "C4", "F4"), midi("C3", "G3", "C4", "E4")] }),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "F is held from an F chord into a C chord, then falls to E. What is it?", options: ["Suspension", "Anticipation", "Passing tone"], answer: "Suspension", visual: { type: "staff", notes: ["F4", "F4", "E4"] }, sound: { kind: "progression", gap: 0.9, chords: [midi("F3", "A3", "C4", "F4"), midi("C3", "G3", "C4", "F4"), midi("C3", "G3", "C4", "E4")] }, miss: "Held over, clashing, then falling a step: a suspension" },
      { kind: "choice", prompt: "Over C in the bass, F resolves to E. Which suspension is that?", options: ["4–3", "7–6", "9–8"], answer: "4–3", visual: { type: "staff", notes: ["F4", "E4"] }, sound: { kind: "progression", gap: 0.9, chords: [midi("C3", "G3", "C4", "F4"), midi("C3", "G3", "C4", "E4")] }, miss: "F is a 4th above C and E is a 3rd: 4–3" },
    ),
    realSong({ kind: "choice", prompt: "Remember Dsus4 to D in “Free Fallin'”? G falls to F♯ over D. In this chapter's terms, what is that?", options: ["A 4–3 suspension", "A passing tone", "A pedal point"], answer: "A 4–3 suspension", visual: { type: "fretboard", marks: [{ string: 0, fret: 3 }, { string: 0, fret: 2 }] }, sound: { kind: "progression", gap: 0.9, chords: [midi("D3", "A3", "D4", "G4"), midi("D3", "A3", "D4", "F#4")] }, miss: "G is a 4th above D and F♯ a 3rd: a 4–3 suspension, like a sus4 chord resolving" }),
  ],
};
