import { parseNote } from "../music";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 26, voice leading triads: moving four parts smoothly from chord to chord. Guitarists do this
// every time they pick a voicing, so the lessons hear the types of motion, connect parallel 5ths to
// sliding power chords, keep common tones between open shapes, and move one voice to the nearest
// chord tone on the neck.

const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const voiced = (gap: number, ...chords: string[][]): Sound => ({ kind: "progression", gap, chords: chords.map((c) => midi(...c)) });
const card = (text: string, left: string, right: string, label: string, sound: Sound): StoryCard => ({ text, left, right, label, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

const MOTIONS = ["Contrary", "Oblique", "Similar", "Parallel"];
const SATB = voiced(0.9, ["C3", "G3", "E4", "C5"], ["F2", "A3", "F4", "C5"], ["G2", "B3", "D4", "B4"], ["C3", "G3", "E4", "C5"]);
const CONTRARY = voiced(0.6, ["E3", "C4"], ["D3", "D4"], ["C3", "E4"]);
const OBLIQUE = voiced(0.6, ["C3", "G4"], ["C3", "A4"], ["C3", "B4"]);
const SIMILAR = voiced(0.6, ["C3", "E4"], ["D3", "G4"], ["E3", "C5"]);
const PARALLEL = voiced(0.6, ["C4", "E4"], ["D4", "F4"], ["E4", "G4"]);
const FIFTHS = voiced(0.6, ["C3", "G3"], ["D3", "A3"], ["E3", "B3"]);

const motion = (sound: Sound, answer: string, why: string): RushQuestion => ({
  kind: "choice",
  prompt: "Listen to the two voices. What type of motion is this?",
  options: MOTIONS,
  answer,
  sound,
  miss: why,
});

export const CHAPTER_26: Record<string, Step[]> = {
  "26.1": [
    story(
      card("Voice leading (part writing) is moving four parts, soprano, alto, tenor and bass, smoothly from chord to chord.", "S A", "T B", "four parts", SATB),
      card("Each part should sound like its own singable line, not just notes stacked up. Bach's chorales are the classic model.", "lines", "not blocks", "independence", SATB),
      card("On guitar, you're doing voice leading whenever you pick a voicing that moves smoothly from the last chord.", "C → F", "nearest notes", "on guitar", voiced(0.9, ["C3", "E3", "G3", "C4"], ["C3", "F3", "A3", "C4"])),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Which four voices does part writing use, top to bottom?", options: ["Soprano, alto, tenor, bass", "Bass, tenor, alto, soprano", "Lead, rhythm, bass, drums"], answer: "Soprano, alto, tenor, bass", miss: "SATB: soprano on top, bass at the bottom" },
      { kind: "choice", prompt: "What's the goal of good voice leading?", options: ["Smooth, independent, singable parts", "As many leaps as possible", "All voices moving the same way"], answer: "Smooth, independent, singable parts", miss: "Each part should be a smooth line of its own" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A choir sings a hymn. Each singer holds one line through all the chords. Which voice usually has the tune?", options: ["Soprano", "Bass", "Tenor"], answer: "Soprano", sound: SATB, miss: "The tune is usually on top, in the soprano" },
    ),
  ],

  "26.2": [
    story(
      card("Contrary motion: two voices move in opposite directions. The most independent kind.", "↑", "↓", "contrary", CONTRARY),
      card("Oblique motion: one voice holds while the other moves.", "—", "↑", "oblique", OBLIQUE),
      card("Similar motion: same direction, different intervals. Parallel motion: same direction, same interval.", "↑ ↑", "same gap", "similar · parallel", PARALLEL),
    ),
    practice(
      "Name it by ear",
      motion(CONTRARY, "Contrary", "The low voice went down while the high voice went up"),
      motion(OBLIQUE, "Oblique", "The bass held C while the top moved"),
      motion(PARALLEL, "Parallel", "Both moved up together, always a 3rd apart"),
      motion(SIMILAR, "Similar", "Both went up, but the gap between them changed"),
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Two singers harmonize a whole chorus a 3rd apart, moving together. What type of motion is that?", options: MOTIONS, answer: "Parallel", sound: PARALLEL, miss: "Same direction, same interval: parallel 3rds, a pop harmony staple" },
    ),
  ],

  "26.3": [
    story(
      card("In part writing, parallel perfect 5ths, octaves and unisons between two voices are avoided. They make the voices blend into one.", "5th → 5th", "8ve → 8ve", "avoid", FIFTHS),
      card("Guitarists know this sound well: sliding a power chord up the neck is all parallel 5ths. Great for rock, wrong for a Bach chorale.", "C5 D5", "E5", "power chords", FIFTHS),
      card("Parallel 3rds and 6ths are fine. They keep the voices distinct while moving together.", "3rds", "6ths", "these are OK", PARALLEL),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Parallel 5ths or parallel 3rds?", options: ["Parallel 5ths", "Parallel 3rds"], answer: "Parallel 5ths", sound: FIFTHS, miss: "Hollow and bare, like power chords: parallel 5ths" },
      { kind: "choice", prompt: "Listen. Parallel 5ths or parallel 3rds?", options: ["Parallel 5ths", "Parallel 3rds"], answer: "Parallel 3rds", sound: PARALLEL, miss: "Sweet and full: parallel 3rds" },
    ),
    {
      type: "tapBeat",
      bpm: 90,
      beatsPerBar: 4,
      bars: 2,
      title: "Hear parallel 5ths: chug an E5 power chord",
      hint: "Hold E5 (low E open, A string fret 2). Every power chord is a root and 5th, so sliding it up the neck makes parallel 5ths. Hands busy? Tap the button instead and it plays the guitar for you.",
      guitar: { name: "E5 power chord", marks: [{ string: 5, fret: 0 }, { string: 4, fret: 2 }, { string: 3, fret: 2 }] },
    },
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A rock riff slides a power chord from G5 to A5 to C5. In a classical chorale, why would that be a problem?", options: ["Parallel 5ths", "Too many 3rds", "It's in a minor key"], answer: "Parallel 5ths", miss: "Power chords moving together make parallel 5ths, fine in rock, avoided in part writing" },
    ),
  ],

  "26.4": [
    story(
      card("Each voice has a comfortable range. Soprano is highest, roughly C4 to G5.", "C4", "G5", "soprano", voiced(0.6, ["C4"], ["G5"])),
      card("Alto sits lower, about G3 to C5. Tenor is about C3 to G4. Bass is about E2 to C4.", "alto · tenor", "bass", "the rest", voiced(0.6, ["G3"], ["C3"], ["E2"])),
      card("Keep each part in its range, and keep the voices in order: soprano above alto, alto above tenor, tenor above bass.", "S > A", "T > B", "no crossing", voiced(0.9, ["C3", "G3", "E4", "C5"])),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Which voice usually sings the lowest notes?", options: ["Bass", "Tenor", "Alto"], answer: "Bass", miss: "Bass is the lowest, about E2 to C4" },
      { kind: "choice", prompt: "An alto note goes above the soprano. What's that called?", options: ["Voice crossing", "Parallel 5ths", "A cadence"], answer: "Voice crossing", miss: "Voices should stay in order. Going past another voice is crossing" },
    ),
    practice(
      "Find it on the guitar",
      { kind: "findNote", pitchClass: 4, prompt: "Find E, the bottom of the bass range (E2).", hint: "It's your open low E string: the guitar's lowest note is right at the bass voice's floor." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "The guitar's open low E is E2. Which choir voice can sing that low?", options: ["Bass", "Soprano", "Alto"], answer: "Bass", miss: "E2 is the bottom of the bass range" },
    ),
  ],

  "26.5": [
    story(
      card("Good lines move mostly by step. Leaps are fine, but follow a leap with a step back the other way.", "leap ↑", "step ↓", "recover", voiced(0.4, ["C4"], ["A4"], ["G4"])),
      card("Resolve tendency tones: the leading tone (B in C) usually goes up to C, and the 7th of a chord goes down.", "B", "C", "tendencies", voiced(0.6, ["B3"], ["C4"])),
      card("Avoid awkward intervals like the augmented 2nd (F to G♯) in a melody. They're hard to sing.", "F", "G♯", "awkward", voiced(0.6, ["F4"], ["G#4"])),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "A soprano leaps up a 6th. What should usually come next?", options: ["A step down", "Another leap up", "The same note"], answer: "A step down", miss: "After a leap, step back the other way" },
      { kind: "choice", prompt: "In C major, where does the leading tone B usually go?", options: ["Up to C", "Down to A", "Up to D"], answer: "Up to C", miss: "The leading tone pulls up to the tonic" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 1, fret: 0, semitones: 1, label: "C, where the leading tone resolves", hint: "B is the open B string. It resolves up one fret to C: fret 1." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Why do singers find melodies that move by step easier than ones full of leaps?", options: ["Steps are easier to pitch", "Leaps are always wrong", "Steps are louder"], answer: "Steps are easier to pitch", miss: "Stepwise lines are easy to sing in tune" },
    ),
  ],

  "26.6": [
    story(
      card("Spacing: keep soprano and alto within an octave of each other, and alto and tenor within an octave too.", "S–A ≤ 8ve", "A–T ≤ 8ve", "upper voices", voiced(0.9, ["C3", "G3", "E4", "C5"])),
      card("The bass can be farther from the tenor. A big gap at the bottom sounds natural.", "T", "B", "bass is free", voiced(0.9, ["C2", "G3", "E4", "C5"])),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Soprano is C5, alto is A3. Is the spacing OK?", options: ["No, more than an octave", "Yes"], answer: "No, more than an octave", miss: "A3 to C5 is more than an octave: too wide for soprano and alto" },
      { kind: "choice", prompt: "Tenor is G3, bass is C2. Is the spacing OK?", options: ["Yes, the bass can be far", "No, too wide"], answer: "Yes, the bass can be far", miss: "Only the upper voices need to stay within an octave" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Open guitar chords put the low notes far apart and the high notes close together. Which spacing rule does that match?", options: ["Bass far, upper voices close", "All voices an octave apart", "Upper voices far apart"], answer: "Bass far, upper voices close", miss: "Wide at the bottom, close at the top: the same as good four-part spacing" },
    ),
  ],

  "26.7": [
    story(
      card("In a root-position triad with four voices, double the root. C major: C, E, G and another C.", "C E G", "+ C", "double the root", voiced(0.9, ["C3", "G3", "E4", "C5"])),
      card("When two chords share a note, keep it in the same voice. C and Am share C and E.", "C E", "held", "common tones", voiced(0.9, ["C3", "G3", "E4", "C5"], ["A2", "A3", "E4", "C5"])),
      card("Move the other voices to the nearest note of the new chord.", "G", "→ A", "nearest", voiced(0.9, ["C3", "G3", "E4", "C5"], ["F2", "A3", "F4", "C5"])),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Which note do you usually double in a root-position triad?", options: ["The root", "The 3rd", "The 5th"], answer: "The root", miss: "Root position: double the root" },
      { kind: "choice", prompt: "C to Am. Which notes can stay in the same voices?", options: ["C and E", "G and B", "D and F"], answer: "C and E", miss: "C major (C E G) and A minor (A C E) share C and E" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 3, fret: 2, semitones: 1, label: "F, the nearest F-chord note from E", hint: "E is D string, fret 2 (in your C chord). The nearest note of F major is F, one fret up: fret 3." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Going from open C to open Am on guitar, two fingers stay put. Which voice-leading idea is that?", options: ["Keeping common tones", "Parallel 5ths", "Voice crossing"], answer: "Keeping common tones", sound: voiced(0.9, ["C3", "E3", "G3", "C4", "E4"], ["A2", "E3", "A3", "C4", "E4"]), miss: "The shared notes C and E stay, just like in part writing" },
    ),
  ],

  "26.8": [
    story(
      card("First-inversion triads have the 3rd in the bass. Doubling is more flexible: choose whatever moves most smoothly.", "3rd", "in bass", "inversion", voiced(0.9, ["E3", "G3", "C4", "C5"])),
      card("Never double the leading tone (B in C). It has to resolve up, and two of them would make parallel octaves.", "B", "not twice", "careful", voiced(0.9, ["G2", "B3", "D4", "G4"], ["C3", "C4", "E4", "G4"])),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Which note should you never double?", options: ["The leading tone", "The root of I", "The 5th"], answer: "The leading tone", miss: "Doubling the leading tone leads to parallel octaves when both resolve" },
      { kind: "choice", prompt: "In a first-inversion triad, which note is in the bass?", options: ["The 3rd", "The root", "The 5th"], answer: "The 3rd", miss: "First inversion puts the 3rd in the bass" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Bach's chorales use first-inversion chords to make the bass line move by step. Why does that help?", options: ["A smoother bass line", "More parallel 5ths", "A louder sound"], answer: "A smoother bass line", miss: "Inversions let the bass walk by step instead of leaping" },
    ),
  ],

  "26.9": [
    story(
      card("Second-inversion triads have the 5th in the bass. Double that bass note.", "5th", "doubled", "6/4", voiced(0.9, ["G2", "G3", "C4", "E4"])),
      card("They appear in the patterns from chapter 16: cadential, passing, pedal and arpeggiated 6/4s.", "cadential", "passing", "where", voiced(0.9, ["G2", "G3", "C4", "E4"], ["G2", "G3", "B3", "D4"], ["C3", "G3", "C4", "E4"])),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "In a 6/4 chord, which note do you double?", options: ["The bass (the 5th)", "The root", "The 3rd"], answer: "The bass (the 5th)", miss: "Second inversion: double the 5th, which is the bass" },
    ),
    practice(
      "Find it on the guitar",
      { kind: "findNote", pitchClass: 7, prompt: "Find G, the doubled bass note of C/G.", hint: "Low E string, fret 3, and the open G string doubles it." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A C/G chord on guitar often has G on the low E string and the open G string. Which rule does that match?", options: ["Double the bass in a 6/4", "Double the leading tone", "Avoid the 5th"], answer: "Double the bass in a 6/4", miss: "C/G is a 6/4 chord, and its bass G is doubled" },
    ),
  ],
};
