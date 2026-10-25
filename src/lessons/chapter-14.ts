import { parseNote } from "../music";
import { rhythmBeats } from "../ui/notation";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 14, accompaniment textures: ways to turn chords into a part you play. This chapter is the
// most hands-on for guitar, so most lessons have a strum or pick-along on the fretboard (chorale
// strums, fingerpicked arpeggios, the "1 (2) &" pattern, reggae offbeats, the clave), plus
// listening questions and real songs that use each texture.

const ACCENT = 96;
const CLICK = 89;
const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const tune = (notes: string[], gap = 0.25): Sound => ({ kind: "melodic", notes: midi(...notes), gap });
const voiced = (gap: number, ...chords: string[][]): Sound => ({ kind: "progression", gap, chords: chords.map((c) => midi(...c)) });

/** A rhythm played as clicks, beat 1 of each 4/4 bar accented. */
function rhythm(tokens: string[], bpm = 96): Sound {
  const beats = rhythmBeats(tokens);
  const pitches: number[] = [];
  let t = 0;
  for (const b of beats) {
    if (b > 0) pitches.push(Math.abs(t % 4) < 0.01 ? ACCENT : CLICK);
    t += Math.abs(b);
  }
  return { kind: "rhythm", beats, bpm, pitches };
}

/** Where each note of a rhythm starts, in eighth notes. */
function onsets(tokens: string[]): number[] {
  const out: number[] = [];
  let t = 0;
  for (const b of rhythmBeats(tokens)) {
    if (b > 0) out.push(Math.round(t * 2));
    t += Math.abs(b);
  }
  return out;
}

type Shape = { name: string; marks: { string: number; fret: number }[]; pick?: number[] };
// Frets listed low E to high e, null = don't play. Strings count from high e (0) to low E (5).
const shape = (name: string, frets: (number | null)[], pick?: number[]): Shape => ({
  name,
  marks: frets.flatMap((fret, i) => (fret === null ? [] : [{ string: 5 - i, fret }])),
  pick,
});
const G = shape("G major", [3, 2, 0, 0, 0, 3]);
const C = shape("C major", [null, 3, 2, 0, 1, 0]);
const E5 = shape("E5 power chord", [0, 2, 2, null, null, null]);
// Picked one string at a time: A, D, G, B, high e, B (the marks run high e to A).
const AM_PICK = shape("A minor", [null, 0, 2, 2, 1, 0], [4, 3, 2, 1, 0, 1]);
// Alberti order on C: low, high, middle, high (A string C, B string C, G string G, B string C).
const C_ALBERTI = shape("C major", [null, 3, 2, 0, 1, 0], [4, 1, 2, 1]);

/** Read a rhythm and play it on the guitar, holding a chord shape. */
const onGuitar = (title: string, notes: string[], gtr: Shape, what: string, bpm = 80): Step => {
  const length = rhythmBeats(notes).reduce((a, b) => a + Math.abs(b), 0);
  return {
    type: "tapBeat",
    bpm,
    beatsPerBar: 4,
    bars: Math.max(1, Math.round(length / 4)),
    title,
    pattern: onsets(notes),
    hint: `Hold ${gtr.name} on your guitar. ${what} Hands busy? Tap the button instead and it plays the guitar for you.`,
    rhythm: notes,
    time: "4/4",
    guitar: gtr,
  };
};

const card = (text: string, left: string, right: string, label: string, sound: Sound): StoryCard => ({ text, left, right, label, sound });
const beatCard = (text: string, notes: string[], sound: Sound = rhythm(notes)): StoryCard => ({ text, rhythm: notes, time: "4/4", sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

const TEXTURES = ["Chorale (block chords)", "Arpeggios", "Offbeats", "Distinctive riff"];

const CHORALE = voiced(0.7, ["C3", "G3", "E4", "C5"], ["F2", "A3", "F4", "C5"], ["G2", "B3", "D4", "B4"], ["C3", "G3", "E4", "C5"]);
const ARPEGGIO = tune(["A2", "E3", "A3", "C4", "E4", "C4", "A3", "E3"], 0.2);
const ALBERTI = tune(["C3", "G3", "E3", "G3", "C3", "G3", "E3", "G3", "C3", "A3", "F3", "A3", "B2", "G3", "D3", "G3"], 0.15);
const OFFBEATS = { kind: "progression", gap: 0.35, chords: [[36], midi("E3", "G3", "C4"), [43], midi("E3", "G3", "C4"), [36], midi("E3", "G3", "C4"), [43], midi("E3", "G3", "C4")] } as Sound;
const CLAVE = ["q.", "q.", "q", "|", "qr", "q", "q", "qr"];
const SMOKE = ["G3", "Bb3", "C4", "G3", "Bb3", "Db4", "C4", "G3", "Bb3", "C4", "Bb3", "G3"];

export const CHAPTER_14: Record<string, Step[]> = {
  "14.1": [
    story(
      card("Texture is how the sound is built. Its vertical side is how many notes or voices sound at once.", "1 note", "6 notes", "vertical", voiced(1, ["C4"], ["C3", "G3", "C4", "E4", "G4", "C5"])),
      card("Its horizontal side is how busy the rhythm is: long held chords or quick repeated notes.", "slow", "busy", "horizontal", tune(["C4", "E4", "G4", "E4", "C4", "E4", "G4", "E4"], 0.12)),
      card("A thick texture can be calm (big slow chords), and a thin one can be busy (one fast line). Listen for both sides.", "thick + slow", "thin + busy", "both sides", voiced(1.2, ["C3", "G3", "E4", "C5"], ["F2", "A3", "F4", "C5"])),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Is the vertical texture thick (many notes at once) or thin (one note at a time)?", options: ["Thick", "Thin"], answer: "Thick", sound: CHORALE, miss: "Four notes sounded together each time: thick" },
      { kind: "choice", prompt: "Listen. Is the rhythm slow or busy?", options: ["Slow", "Busy"], answer: "Busy", sound: ALBERTI, miss: "Quick notes one after another: busy" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A ballad starts with just voice and one guitar, and by the last chorus there's a full band. Which part of texture grew?", options: ["Vertical: more voices at once", "Neither"], answer: "Vertical: more voices at once", miss: "More instruments sounding together makes the texture thicker" },
    ),
  ],

  "14.2": [
    story(
      card("Chorale texture puts a chord under every (or nearly every) melody note. Hymns sound like this.", "melody", "chord each note", "chorale", CHORALE),
      card("“The Star-Spangled Banner” is often sung and played this way: every note of the tune gets its own chord.", "Oh", "say", "anthem", CHORALE),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Which texture is this?", options: TEXTURES.slice(0, 3), answer: "Chorale (block chords)", sound: CHORALE, miss: "A full chord on every melody note: chorale texture" },
    ),
    onGuitar("Strum it chorale-style", ["q", "q", "q", "q", "|", "q", "q", "h"], G, "Strum once for each melody note: four even strums, then two and let the last ring."),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "At a ball game the organist plays “The Star-Spangled Banner” with a chord on almost every note. Which texture is that?", options: TEXTURES.slice(0, 3), answer: "Chorale (block chords)", miss: "A chord for every note: chorale texture" },
    ),
  ],

  "14.3": [
    story(
      card("Arpeggiated accompaniments spell a chord one note at a time instead of all at once.", "A", "E A C E", "arpeggio", ARPEGGIO),
      card("Beethoven's “Moonlight” Sonata rolls arpeggios over a slow bass. On guitar, fingerpicking does the same job.", "bass", "rolling notes", "Moonlight", tune(["G#3", "C#4", "E4", "G#3", "C#4", "E4", "G#3", "C#4", "E4"], 0.25)),
      card("An Alberti bass picks the chord low, high, middle, high: C G E G. Classical pianists use it all the time.", "C G", "E G", "Alberti", ALBERTI),
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Spell an Alberti bass on C major (low, high, middle, high).",
      given: ["C", null, null, null],
      answer: ["C", "G", "E", "G"],
      tiles: ["E", "G", "G", "C"],
      sound: tune(["C3", "G3", "E3", "G3", "C3", "G3", "E3", "G3"], 0.18),
      miss: "Low C, high G, middle E, high G again: C G E G",
    }),
    onGuitar("Fingerpick an arpeggio", ["e", "e", "e", "e", "e", "e", "q"], AM_PICK, "Pick one string per tap: A, D, G, B, high e, back to B."),
    onGuitar("Pick an Alberti pattern", ["e", "e", "e", "e", "e", "e", "e", "e"], C_ALBERTI, "Pick low C (A string), then B string, G string, B string, and repeat."),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "“House of the Rising Sun” by The Animals opens with the guitar picking each chord one string at a time. Which texture is that?", options: TEXTURES.slice(0, 3), answer: "Arpeggios", sound: ARPEGGIO, miss: "One note of the chord at a time: an arpeggiated accompaniment" },
    ),
  ],

  "14.4": [
    story(
      beatCard("Block chord accompaniments hit whole chords in a repeating rhythm. A pop favorite is “1 (2) &”: a chord on beat 1, then on the “and” of beat 2, held over.", ["q.", "e", "~", "h"]),
      beatCard("Rock often chugs steady eighth-note chords, all downstrokes.", ["e", "e", "e", "e", "e", "e", "e", "e"]),
      beatCard("Or plain quarter-note chords, one per beat, which can sound driving or calm depending on the tempo.", ["q", "q", "q", "q"]),
    ),
    onGuitar("Strum the “1 (2) &” rhythm", ["q.", "e", "~", "h", "|", "q.", "e", "~", "h"], C, "Strum on 1, then on the “and” after 2, and let it ring to the end of the bar."),
    onGuitar("Chug rock eighths", ["e", "e", "e", "e", "e", "e", "e", "e"], E5, "Eight even downstrokes per bar.", 100),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Which block-chord rhythm is it?", options: ["1 (2) &", "Steady eighths", "Quarter notes"], answer: "1 (2) &", sound: rhythm(["q.", "e", "~", "h", "q.", "e", "~", "h"]), miss: "Hit on 1, then a push just before beat 3: “1 (2) &”" },
      { kind: "choice", prompt: "Listen. Which block-chord rhythm is it?", options: ["1 (2) &", "Steady eighths", "Quarter notes"], answer: "Steady eighths", sound: rhythm(["e", "e", "e", "e", "e", "e", "e", "e"], 110), miss: "Even, quick hits twice per beat: steady eighths" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "The Ramones' “Blitzkrieg Bop” is powered by fast power chords played with all downstrokes, two per beat. Which pattern is that?", options: ["Steady eighths", "1 (2) &", "Quarter notes"], answer: "Steady eighths", miss: "Two even strums per beat: repeated eighth-note chords" },
    ),
  ],

  "14.5": [
    story(
      card("Afterbeats are chords that come right after a bass note on the beat: bass, chord, bass, chord. Think “oom-pah”.", "oom", "pah", "afterbeats", OFFBEATS),
      card("Polka, from Bohemia, runs on that oom-pah pattern.", "bass", "chord", "polka", OFFBEATS),
      beatCard("Offbeats are chords that land on the upbeats and skip the downbeats. Reggae guitar is built on them.", ["er", "e", "er", "e", "er", "e", "er", "e"]),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Bass note then chord, over and over. Afterbeats or a chorale?", options: ["Afterbeats", "Chorale"], answer: "Afterbeats", sound: OFFBEATS, miss: "Bass, chord, bass, chord: afterbeats" },
    ),
    onGuitar("Play reggae offbeats", ["er", "e", "er", "e", "er", "e", "er", "e"], G, "Count “1 and 2 and”. Rest on the numbers and strum a short, choppy chord on every “and”."),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Bob Marley's music and “Rude” by MAGIC! have the guitar chopping chords between the beats. Which texture is that?", options: ["Offbeats", "Arpeggios", "Chorale (block chords)"], answer: "Offbeats", sound: rhythm(["er", "e", "er", "e", "er", "e", "er", "e"], 80), miss: "Chords on the upbeats, avoiding the downbeats: reggae offbeats" },
    ),
  ],

  "14.6": [
    story(
      beatCard("The 3–2 clave is a two-bar Afro-Cuban rhythm: three hits in the first bar, two in the second.", CLAVE, rhythm(CLAVE, 100)),
      beatCard("Its first bar splits eight eighth notes as 3 + 3 + 2. That pattern turns up all over pop.", ["q.", "q.", "q"], rhythm(["q.", "q.", "q", "q.", "q.", "q"], 100)),
      beatCard("The famous intro of “Eye of the Tiger” hits its chords in 3 + 3 + 2. So does a lot of reggaeton, like “Despacito”.", ["q.", "q.", "q"], rhythm(["q.", "q.", "q", "q.", "q.", "q"], 109)),
    ),
    {
      type: "tapBeat",
      bpm: 90,
      beatsPerBar: 4,
      bars: 2,
      title: "Tap the 3–2 clave",
      pattern: onsets(CLAVE),
      hint: "Three hits in bar 1 (on 1, the “and” of 2, and 4), two in bar 2 (on 2 and 3).",
      rhythm: CLAVE,
      time: "4/4",
    },
    onGuitar("Play 3 + 3 + 2 on the guitar", ["q.", "q.", "q", "|", "q.", "q.", "q"], E5, "Hit on 1, the “and” of 2, and 4: long, long, short."),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Is this the 3–2 clave or even quarter notes?", options: ["3–2 clave", "Even quarters"], answer: "3–2 clave", sound: rhythm(CLAVE, 100), miss: "Three uneven hits, then two: the 3–2 clave" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "How does the intro of “Eye of the Tiger” group its chord hits in each bar?", options: ["3 + 3 + 2", "4 + 4", "2 + 2 + 2 + 2"], answer: "3 + 3 + 2", sound: rhythm(["q.", "q.", "q", "q.", "q.", "q"], 109), miss: "Dun… dun… dun-: long, long, short is 3 + 3 + 2" },
    ),
  ],

  "14.7": [
    story(
      card("Sometimes a song's identity is its repeated bass line, a riff. You know the song from the first bar.", "bass", "riff", "the hook", tune(["E2", "E2", "E2", "E2", "G2", "E2", "A2"], 0.18)),
      card("Famous bass riffs: “Another One Bites the Dust” by Queen, “Under Pressure” by Queen and David Bowie, and “Rapper's Delight”.", "Queen", "Bowie", "bass riffs", tune(["D2", "D2", "D2", "D2", "D2", "A2", "D2"], 0.18)),
      card("Guitar riffs do it too, often doubled by the bass. “Day Tripper” by the Beatles and “Smoke on the Water” by Deep Purple are classics.", "G B♭ C", "G B♭ D♭ C", "Smoke on the Water", tune(SMOKE, 0.3)),
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Rebuild the start of the “Smoke on the Water” riff.",
      given: ["G", null, "C", "G", null, null, "C"],
      answer: ["G", "B♭", "C", "G", "B♭", "D♭", "C"],
      tiles: ["B♭", "B♭", "D♭", "E"],
      sound: tune(SMOKE.slice(0, 7), 0.3),
      miss: "G B♭ C, then G B♭ D♭ C",
    }),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 5, fret: 3, semitones: 3, label: "B♭, the riff's second note", hint: "Start on G (low E string, fret 3). B♭ is three frets up: fret 6." },
      { kind: "fretInterval", string: 5, fret: 3, semitones: 5, label: "C, the riff's third note", hint: "From G at fret 3, C is five frets up: fret 8." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "You hear just a few bass notes and instantly know it's “Another One Bites the Dust”. What texture idea makes that possible?", options: ["Distinctive riff", "Chorale (block chords)", "Arpeggios"], answer: "Distinctive riff", miss: "The repeated bass riff is the song's identity" },
    ),
  ],
};
