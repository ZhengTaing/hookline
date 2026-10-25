import { chordsSound } from "./mix-v2";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 18, secondary diminished chords: vii° (or ø7, °7) of a chord other than I. Their root is
// always a half step below the target, which is easy to see and play on the neck, so the guitar
// steps find that half step and strum the movable diminished 7th shape into its target.

const prog = (...symbols: string[]): Sound => chordsSound(symbols);
const card = (text: string, left: string, right: string, label: string, sound: Sound): StoryCard => ({ text, left, right, label, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

const TARGETS = ["vii°7/ii", "vii°7/iii", "vii°7/IV", "vii°7/V", "vii°7/vi"];
// F♯°7, frets low E to high e: x x 4 5 4 5 (strings count from high e = 0).
const FS_DIM7 = { name: "F♯°7", marks: [{ string: 3, fret: 4 }, { string: 2, fret: 5 }, { string: 1, fret: 4 }, { string: 0, fret: 5 }] };

/** In C major: which secondary diminished chord is this? */
const whichDim = (chord: string, target: string, answer: string, why: string): RushQuestion => ({
  kind: "choice",
  prompt: `In C major, ${chord} resolves to ${target}. Which chord is it?`,
  options: TARGETS,
  answer,
  visual: { type: "big", text: `${chord} → ${target}` },
  sound: prog(chord.replace("♯", "#"), target),
  miss: why,
});

export const CHAPTER_18: Record<string, Step[]> = {
  "18.1": [
    story(
      card("In C, B°7 is the leading-tone chord (vii°7) that pulls to C. Any other chord can get its own leading-tone chord too.", "B°7", "C", "vii°7", prog("B°7", "C")),
      card("F♯°7 (F♯ A C E♭) pulls to G, so it's vii°7 of V, written vii°7/V. These are secondary diminished chords.", "F♯°7", "G", "vii°7/V", prog("C", "F#°7", "G")),
      card("Composers love them for tension: Bach's “Jesu, Joy of Man's Desiring”, Tchaikovsky's “Trepak”, Billy Joel's “Just the Way You Are” and Garth Brooks' “Friends in Low Places”.", "Bach", "Billy Joel", "everywhere", prog("C", "C#°7", "Dm", "G", "C")),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Which version slips a diminished chord in before G?", options: ["First", "Second"], answer: "Second", sound: prog("C", "Am", "G", "C", "F#°7", "G"), miss: "The second time, a tense diminished chord led into G" },
    ),
    {
      type: "tapBeat",
      bpm: 72,
      beatsPerBar: 4,
      bars: 2,
      title: "Strum F♯°7, the vii°7/V shape",
      hint: "Hold x x 4 5 4 5: D string fret 4, G fret 5, B fret 4, high e fret 5. Strum on every click. Hands busy? Tap the button instead and it plays the guitar for you.",
      guitar: FS_DIM7,
    },
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Bach's “Jesu, Joy of Man's Desiring” uses secondary diminished chords in a sequence. What does each one do?", options: ["Leads to the chord a half step above its root", "Ends the piece", "Replaces the tonic"], answer: "Leads to the chord a half step above its root", miss: "Each one is a leading-tone chord pulling up a half step to its target" },
    ),
  ],

  "18.2": [
    story(
      card("In major, every chord except I and vii° can get a secondary leading-tone chord. In C: C♯°7 → Dm, D♯°7 → Em, E°7 → F, F♯°7 → G, G♯°7 → Am.", "C♯ D♯ E", "F♯ G♯", "in C", prog("G#°7", "Am")),
      card("Targets that are major chords (IV, V) often use the half-diminished ø7 instead of °7. Both work.", "F♯ø7", "F♯°7", "ø7 or °7", prog("F#ø7", "G", "F#°7", "G")),
      card("In minor, vii°/III isn't listed because it's the same chord as ii°.", "vii°/III", "= ii°", "minor", prog("Am", "Bø7", "C")),
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "In C major, give each target its secondary diminished 7th.",
      given: [null, null, null, "F♯°7", null],
      answer: ["C♯°7", "D♯°7", "E°7", "F♯°7", "G♯°7"],
      tiles: ["G♯°7", "E°7", "C♯°7", "D♯°7", "B°7"],
      labels: ["→ Dm", "→ Em", "→ F", "→ G", "→ Am"],
      miss: "Each root is a half step below the target: C♯, D♯, E, F♯, G♯",
    }),
    practice(
      "Name it",
      { kind: "choice", prompt: "Why isn't vii°/III listed in minor keys?", options: ["It's the same chord as ii°", "It's too dissonant", "III has no root"], answer: "It's the same chord as ii°", miss: "In A minor, vii° of C is B°, which is already ii°" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A song in C goes C, then G♯°7, then Am. What is G♯°7 doing?", options: ["Leading into Am (vii°7/vi)", "Leading into G (vii°7/V)", "Acting as I"], answer: "Leading into Am (vii°7/vi)", sound: prog("C", "G#°7", "Am"), miss: "G♯ is a half step below A: vii°7/vi" },
    ),
  ],

  "18.3": [
    story(
      card("To analyze one: stack the chord in thirds. If it's diminished or half-diminished, find its root.", "stack", "°7 or ø7", "step 1", prog("D#°7")),
      card("The chord it tonicizes is a half step above that root. D♯°7 → E: Em is iii in C, so it's vii°7/iii.", "D♯", "E", "step 2", prog("D#°7", "Em")),
    ),
    practice(
      "Name it",
      whichDim("D♯°7", "Em", "vii°7/iii", "D♯ is a half step below E, and Em is iii: vii°7/iii"),
      whichDim("C♯°7", "Dm", "vii°7/ii", "C♯ is a half step below D, and Dm is ii: vii°7/ii"),
      whichDim("E°7", "F", "vii°7/IV", "E is a half step below F, and F is IV: vii°7/IV"),
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 4, fret: 4, semitones: 1, label: "D, the target of C♯°7", hint: "C♯ is A string, fret 4. The chord it leads to is a half step up: D, fret 5." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Billy Joel's “Just the Way You Are” slips in a diminished chord with its root a half step below the next chord. How do you name it?", options: ["vii° of the next chord", "V of the next chord", "IV of the key"], answer: "vii° of the next chord", miss: "A diminished chord a half step below its target is that chord's leading-tone chord" },
    ),
  ],

  "18.4": [
    story(
      card("To write vii°7 of a chord: find the target's root, go down a half step, and build a diminished 7th there (stacked minor 3rds).", "target", "down ½ step", "the recipe", prog("F#°7", "G")),
      card("vii°7/V in G major: V is D. A half step below D is C♯, so it's C♯°7 (C♯ E G B♭).", "C♯°7", "D", "in G", prog("G", "C#°7", "D")),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Write vii°7/V in D major. (V is A.)", options: ["G♯°7", "C♯°7", "A♯°7"], answer: "G♯°7", sound: prog("D", "G#°7", "A"), miss: "A half step below A is G♯: G♯°7" },
      { kind: "choice", prompt: "Write vii°7/vi in G major. (vi is Em.)", options: ["D♯°7", "F♯°7", "E°7"], answer: "D♯°7", sound: prog("G", "D#°7", "Em"), miss: "A half step below E is D♯: D♯°7" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 5, fret: 1, semitones: 1, label: "F♯, the chord F°7 leads to", hint: "The diminished root sits one fret below its target. From F (low E, fret 1), the target F♯ is fret 2." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "You're playing a song in G and want a tense lead-in to C (IV). Which diminished chord do you add?", options: ["B°7", "C♯°7", "F♯°7"], answer: "B°7", sound: prog("G", "B°7", "C"), miss: "A half step below C is B: B°7 is vii°7/IV in G" },
    ),
  ],
};
