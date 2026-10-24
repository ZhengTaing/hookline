import { parseNote } from "../music";
import { rhythmBeats } from "../ui/notation";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 4, rhythm and time signatures. Rhythm is felt more than seen, so besides naming note
// values on a rhythm line, each section has a tap-along step that reads the rhythm, and the
// listening questions are about beats, not pitches.

const ACCENT = 96;
const CLICK = 89;

/** A rhythm played as clicks, the first note of each bar (every `perBar` beats) accented. */
function rhythm(tokens: string[], bpm = 90, perBar = 4, pitch?: number): Sound {
  const beats = rhythmBeats(tokens);
  const pitches: number[] = [];
  let t = 0;
  for (const b of beats) {
    if (b > 0) pitches.push(pitch ?? (Math.abs(t % perBar) < 0.01 ? ACCENT : CLICK));
    t += Math.abs(b);
  }
  return { kind: "rhythm", beats, bpm, pitches };
}

/** Steady clicks for `bars` bars of `perBar` beats, beat 1 louder. */
const pulse = (perBar: number, bars = 2, bpm = 100): Sound => ({
  kind: "rhythm",
  bpm,
  beats: Array(perBar * bars).fill(1),
  pitches: Array.from({ length: perBar * bars }, (_, i) => (i % perBar === 0 ? ACCENT : CLICK)),
});

/** Where each note of a rhythm starts, in eighth notes, for tapping along. */
function onsets(tokens: string[]): number[] {
  const out: number[] = [];
  let t = 0;
  for (const b of rhythmBeats(tokens)) {
    if (b > 0) out.push(Math.round(t * 2));
    t += Math.abs(b);
  }
  return out;
}

const card = (text: string, notes: string[], time?: string, sound: Sound = rhythm(notes)): StoryCard => ({ text, rhythm: notes, time, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

/** "How many beats?" for a rhythm on the line. */
const howLong = (notes: string[], answer: string, options: string[], why: string): RushQuestion => ({
  kind: "choice",
  prompt: notes.length === 1 ? "In 4/4, how many beats does this last?" : "In 4/4, how many beats do these last together?",
  options,
  answer,
  visual: { type: "rhythm", notes },
  sound: rhythm(notes),
  miss: why,
});

/** Read a rhythm and tap it. In x/8 time the clicks are eighth notes, so `bpm` counts eighths. */
const tapIt = (title: string, notes: string[], hint: string, bpm = 80, time = "4/4"): Step => {
  const [top, bottom] = time.split("/").map(Number);
  const perEighth = bottom === 8 ? 2 : 1;
  const length = rhythmBeats(notes).reduce((a, b) => a + Math.abs(b), 0);
  return {
    type: "tapBeat",
    bpm,
    beatsPerBar: top,
    bars: Math.max(1, Math.round(length / ((top * 4) / bottom))),
    title,
    pattern: onsets(notes).map((p) => p * perEighth),
    hint,
    rhythm: notes,
    time,
  };
};

const melody = (...names: string[]) => names.map((n) => parseNote(n).midi);

export const CHAPTER_4: Record<string, Step[]> = {
  "4.1": [
    story(
      card("Music has a steady pulse called the beat. Beats are grouped into bars (measures), and a time signature at the start says how they're grouped.", ["q", "q", "q", "q"], "4/4", pulse(4, 2)),
      card("The top number is how many beats are in each bar. In 4/4 you count 1 2 3 4, 1 2 3 4, and beat 1 is the strongest.", ["q", "q", "q", "q"], "4/4", pulse(4, 2)),
      card("The bottom number says which note gets one beat: 4 means a quarter note, 8 an eighth note, 2 a half note.", ["q", "q", "q"], "3/4", pulse(3, 2)),
      card("3/4 has three quarter-note beats per bar: 1 2 3, 1 2 3. That's the waltz feel.", ["h", "q"], "3/4", pulse(3, 2)),
      card("4/4 is so common it's called common time, and it's sometimes written as a C. Most pop and rock songs are in 4/4.", ["q", "q", "h"], "4/4", pulse(4, 2)),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "How many beats are in each bar?", options: ["2", "3", "4"], answer: "3", visual: { type: "rhythm", notes: ["q", "q", "q"], time: "3/4" }, miss: "The top number is the number of beats: 3" },
      { kind: "choice", prompt: "Which note gets one beat in this time signature?", options: ["Quarter note", "Eighth note", "Half note"], answer: "Eighth note", visual: { type: "rhythm", notes: ["e", "e", "e", "e", "e", "e"], time: "6/8" }, miss: "The bottom number 8 means the eighth note gets the beat" },
      { kind: "choice", prompt: "How many beats are in each bar?", options: ["2", "3", "4"], answer: "2", visual: { type: "rhythm", notes: ["q", "q"], time: "2/4" }, miss: "2/4 has two quarter-note beats per bar, like a march: 1 2, 1 2" },
    ),
    { type: "tapBeat", bpm: 84, beatsPerBar: 4, bars: 2, title: "Tap the beat in 4/4", hint: "After four count-in clicks, tap on every beat. Beat 1 of each bar clicks louder." },
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. How many beats in each bar? Count from each loud click.", options: ["3", "4"], answer: "3", sound: pulse(3, 3), miss: "Loud, soft, soft: 1 2 3. That's three beats per bar" },
      { kind: "choice", prompt: "Listen. How many beats in each bar?", options: ["3", "4"], answer: "4", sound: pulse(4, 3), miss: "Loud, soft, soft, soft: 1 2 3 4" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "“Happy Birthday” sways like a waltz: HAP-py birth-DAY to YOU. Which time signature fits?", options: ["3/4", "4/4", "2/4"], answer: "3/4", sound: { kind: "melodic", notes: melody("G4", "G4", "A4", "G4", "C5", "B4"), gap: 0.4 }, miss: "Happy Birthday counts in three: 1 2 3, 1 2 3. It's in 3/4" },
      { kind: "choice", prompt: "“We Will Rock You” by Queen goes stomp-stomp-clap, stomp-stomp-clap. Each stomp-stomp-clap takes two beats, and two of them fill a bar. Which time signature fits?", options: ["3/4", "4/4"], answer: "4/4", sound: rhythm(["e", "e", "q", "e", "e", "q", "e", "e", "q", "e", "e", "q"], 81), miss: "Two beats plus two beats is four beats per bar: 4/4" },
    ),
  ],

  "4.2": [
    story(
      card("Notes show how long to hold a sound. A whole note fills a whole bar of 4/4: four beats.", ["w"], "4/4"),
      card("A half note has a stem and lasts two beats. Two of them fill a bar.", ["h", "h"], "4/4"),
      card("A quarter note is filled in and lasts one beat: count 1 2 3 4.", ["q", "q", "q", "q"], "4/4"),
      card("An eighth note has a flag and lasts half a beat. Count “1 and 2 and”. A sixteenth has two flags: a quarter of a beat.", ["e", "e", "e", "e", "s", "s", "s", "s", "q"], "4/4"),
      card("Every note has a rest of the same length, for silence: here a quarter rest, an eighth rest and a half rest.", ["q", "qr", "e", "er", "hr"], "4/4"),
    ),
    practice(
      "Name it",
      howLong(["h"], "2", ["1", "2", "4"], "A half note, open with a stem, lasts two beats"),
      howLong(["w"], "4", ["2", "3", "4"], "A whole note has no stem and lasts four beats, a whole bar of 4/4"),
      howLong(["e", "e"], "1", ["½", "1", "2"], "Each eighth is half a beat, so two make one beat"),
      { kind: "choice", prompt: "This bar of 4/4 needs one more beat. What fills it?", options: ["A quarter note", "A half note", "An eighth note"], answer: "A quarter note", visual: { type: "rhythm", notes: ["h", "q"], time: "4/4" }, miss: "Half (2) plus quarter (1) is 3 beats, so one quarter note makes 4" },
    ),
    practice("Put it in order", {
      kind: "order",
      layout: "list",
      prompt: "Order the notes from longest to shortest.",
      given: ["Whole", null, null, null, "Sixteenth"],
      answer: ["Whole", "Half", "Quarter", "Eighth", "Sixteenth"],
      tiles: ["Eighth", "Quarter", "Half"],
      labels: ["4 beats", "2 beats", "1 beat", "½ beat", "¼ beat"],
      miss: "Each one is half the one before: whole, half, quarter, eighth, sixteenth",
    }),
    tapIt("Read it and tap it", ["q", "q", "h"], "Tap once for each note: quarter, quarter, then a half note held for two beats."),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Which rhythm is this?", options: ["Four quarters", "Two halves", "Eight eighths"], answer: "Eight eighths", sound: rhythm(Array(8).fill("e")), miss: "Two clicks per beat: eighth notes" },
      { kind: "choice", prompt: "Listen. Which rhythm is this?", options: ["Four quarters", "Two halves", "Eight eighths"], answer: "Two halves", sound: rhythm(["h", "h"]), miss: "Only two notes in the bar, each held for two beats: half notes" },
    ),
    practice("Use it in real songs", {
      kind: "choice",
      prompt: "In “We Will Rock You”, the two stomps fit into one beat. What kind of notes are they?",
      options: ["Eighth notes", "Quarter notes", "Half notes"],
      answer: "Eighth notes",
      visual: { type: "rhythm", notes: ["e", "e", "q", "e", "e", "q"], time: "4/4" },
      sound: rhythm(["e", "e", "q", "e", "e", "q", "e", "e", "q", "e", "e", "q"], 81),
      miss: "Two stomps in one beat are two eighth notes. The clap that follows is a quarter note, one beat",
    }),
    tapIt("Tap “We Will Rock You”", ["e", "e", "q", "e", "e", "q"], "Stomp-stomp (two quick eighths), then clap (a quarter). Tap all three, twice.", 81),
  ],

  "4.3": [
    story(
      card("A dot after a note adds half its value. A half note is 2 beats, so a dotted half is 2 + 1 = 3 beats.", ["h.", "q"], "4/4"),
      card("A dotted quarter is 1 + ½ = 1½ beats. It's usually followed by an eighth note to finish the beat: long, short.", ["q.", "e", "q.", "e"], "4/4"),
      card("A tie is a curve joining two notes of the same pitch. Play it as one sound that lasts as long as both together.", ["h", "~", "q", "q"], "4/4"),
      card("Ties can cross a bar line, which dots can't. That's how a note can ring from the end of one bar into the next.", ["h", "h", "~", "|", "q", "q", "h"], "4/4"),
      card("A slur looks like a tie but joins different pitches. It doesn't change the rhythm. It just means play the notes smoothly.", ["q", "q", "q", "q"], "4/4", { kind: "melodic", notes: melody("C5", "D5", "E5", "F5"), gap: 0.6 }),
    ),
    practice(
      "Name it",
      howLong(["h."], "3", ["2", "2½", "3"], "A dotted half is 2 plus half of 2: 3 beats"),
      howLong(["q."], "1½", ["1", "1½", "2"], "A dotted quarter is 1 plus half of 1: 1½ beats"),
      howLong(["h", "~", "q"], "3", ["2", "3", "4"], "Tied notes add up: a half (2) plus a quarter (1) is 3 beats"),
    ),
    tapIt("Read it and tap it", ["q.", "e", "q", "q"], "Long, short, then two quarters. Hold the dotted quarter a little past beat 2 before the quick eighth."),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Even or long-short?", options: ["Even: two quarters", "Long-short: dotted quarter and eighth"], answer: "Long-short: dotted quarter and eighth", sound: rhythm(["q.", "e", "q.", "e", "q.", "e", "h"]), miss: "The first note of each pair was longer: dotted quarter, then eighth" },
      { kind: "choice", prompt: "Listen. Even or long-short?", options: ["Even: two quarters", "Long-short: dotted quarter and eighth"], answer: "Even: two quarters", sound: rhythm(["q", "q", "q", "q", "q", "q", "h"]), miss: "Every note was the same length: quarter notes" },
    ),
    practice("Use it in real songs", {
      kind: "choice",
      prompt: "In “Jingle Bells”, “jin-gle all the way” has a dotted quarter on “all” and an eighth on “the”. How many beats do “all the” take together?",
      options: ["1", "2", "3"],
      answer: "2",
      visual: { type: "rhythm", notes: ["q", "q", "q.", "e", "w"], time: "4/4" },
      sound: rhythm(["q", "q", "q.", "e", "w"], 110, 4, 76),
      miss: "1½ for the dotted quarter plus ½ for the eighth is 2 beats",
    }),
  ],

  "4.4": [
    story(
      card("Meters come in two kinds. In simple meters (2/4, 3/4, 4/4) each beat splits into two: “1 and 2 and”.", ["e", "e", "e", "e", "e", "e", "e", "e"], "4/4"),
      card("In compound meters (6/8, 9/8, 12/8) each beat splits into three: “1 la li 2 la li”.", ["e", "e", "e", "e", "e", "e"], "6/8", rhythm(["e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e"], 160, 3)),
      card("So 6/8 is felt as two big beats, not six. Each big beat is a dotted quarter.", ["q.", "q."], "6/8", rhythm(["q.", "q.", "q.", "q."], 160, 3)),
      card("Count beats by the top number: 2, 3 or 4 means simple. 6, 9 or 12 means compound, with 2, 3 or 4 big beats.", ["q.", "q.", "q.", "q."], "12/8", rhythm(["q.", "q.", "q.", "q."], 160, 6)),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Simple or compound?", options: ["Simple", "Compound"], answer: "Compound", visual: { type: "rhythm", notes: ["e", "e", "e", "e", "e", "e"], time: "6/8" }, miss: "6 on top means compound: two beats, each split in three" },
      { kind: "choice", prompt: "Simple or compound?", options: ["Simple", "Compound"], answer: "Simple", visual: { type: "rhythm", notes: ["q", "q", "q"], time: "3/4" }, miss: "3/4 is simple: three beats, each split in two" },
      { kind: "choice", prompt: "How many big beats are in a bar of 12/8?", options: ["4", "6", "12"], answer: "4", visual: { type: "rhythm", notes: ["q.", "q.", "q.", "q."], time: "12/8" }, miss: "Divide 12 by 3: four dotted-quarter beats" },
    ),
    tapIt("Tap the big beats in 6/8", ["q.", "q.", "|", "q.", "q."], "The clicks are eighth notes, in two groups of three. Tap only on the first of each group: two taps per bar.", 150, "6/8"),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Is each beat split into two or three?", options: ["Two: simple", "Three: compound"], answer: "Three: compound", sound: rhythm(Array(12).fill("e"), 180, 3), miss: "The clicks came in threes: 1 la li 2 la li. That's compound" },
      { kind: "choice", prompt: "Listen. Is each beat split into two or three?", options: ["Two: simple", "Three: compound"], answer: "Two: simple", sound: rhythm(Array(8).fill("e"), 90, 2), miss: "The clicks came in twos: 1 and 2 and. That's simple" },
    ),
    practice("Use it in real songs", {
      kind: "choice",
      prompt: "In “The House of the Rising Sun” by The Animals, the guitar picks six notes per bar in two groups of three. Simple or compound?",
      options: ["Simple", "Compound"],
      answer: "Compound",
      sound: { kind: "melodic", notes: melody("A2", "A3", "C4", "E4", "A3", "C4", "C3", "G3", "C4", "E4", "G3", "C4"), gap: 0.22 },
      miss: "Two groups of three per bar is 6/8: compound",
    }),
  ],

  "4.5": [
    story(
      card("A tuplet squeezes an unusual number of notes into a beat. The most common is the triplet: three notes in the time of two.", ["t", "t", "t", "t", "t", "t", "h"], "4/4"),
      card("Triplets are marked with a small 3. Three triplet eighths fill one quarter-note beat.", ["t", "t", "t", "q", "h"], "4/4"),
      card("Compare: two straight eighths, then three triplets, in the same beat. The triplets sound rounder, rolling forward.", ["e", "e", "t", "t", "t", "e", "e", "t", "t", "t"], "4/4"),
      card("Many blues and rock songs feel like triplets all the way through. That's the shuffle or swing feel.", ["t", "t", "t", "t", "t", "t", "t", "t", "t"], "4/4"),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "How many triplet eighths fit in one beat?", options: ["2", "3", "4"], answer: "3", visual: { type: "rhythm", notes: ["t", "t", "t", "q", "h"], time: "4/4" }, miss: "A triplet puts three notes in the space of two eighths: one beat" },
      { kind: "choice", prompt: "Which beat has the triplet?", options: ["Beat 1", "Beat 2", "Beat 3"], answer: "Beat 2", visual: { type: "rhythm", notes: ["q", "t", "t", "t", "h"], time: "4/4" }, miss: "Beat 1 is a quarter, beat 2 has the three notes marked 3, and beats 3–4 are a half note" },
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Straight or triplets?", options: ["Straight eighths", "Triplets"], answer: "Triplets", sound: rhythm(Array(12).fill("t")), miss: "Three even clicks per beat: triplets" },
      { kind: "choice", prompt: "Listen. Straight or triplets?", options: ["Straight eighths", "Triplets"], answer: "Straight eighths", sound: rhythm(Array(8).fill("e")), miss: "Two clicks per beat: straight eighths" },
    ),
    practice("Use it in real songs", {
      kind: "choice",
      prompt: "“Everybody Wants to Rule the World” by Tears for Fears has a rolling shuffle: every beat splits into three. That's like playing…",
      options: ["Triplets", "Straight eighths", "Whole notes"],
      answer: "Triplets",
      sound: rhythm(Array(12).fill("t"), 85),
      miss: "Three notes per beat is a triplet feel. Written in 12/8, it's the same thing",
    }),
  ],

  "4.6": [
    story(
      card("Good rhythm notation shows where each beat starts. Eighths are grouped in beats, so you can see “1 and 2 and” at a glance.", ["e", "e", "e", "e", "q", "q"], "4/4"),
      card("A note that crosses the middle of a 4/4 bar is usually written as two tied notes, so beat 3 stays visible.", ["q", "h", "q"], "4/4"),
      card("Written clearly, it becomes a quarter tied to a quarter: same sound, easier to read.", ["q", "q", "~", "q", "q"], "4/4"),
      card("The exception is syncopation: putting accents between the beats on purpose. It's what makes a groove feel funky.", ["e", "q", "e", "q", "q"], "4/4"),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "What do you call accents placed between the beats on purpose?", options: ["Syncopation", "A tie", "A triplet"], answer: "Syncopation", visual: { type: "rhythm", notes: ["e", "q", "e", "q", "q"], time: "4/4" }, miss: "Notes that start on the “and” and hold across the beat are syncopated" },
      { kind: "choice", prompt: "Which is easier to read in 4/4?", options: ["Quarter, half, quarter", "Quarter, quarter tied to quarter, quarter"], answer: "Quarter, quarter tied to quarter, quarter", visual: { type: "rhythm", notes: ["q", "q", "~", "q", "q"], time: "4/4" }, miss: "Splitting the half note with a tie shows where beat 3 starts" },
    ),
    tapIt("Tap a syncopated rhythm", ["e", "q", "e", "q", "q"], "Count “1 and 2 and 3 4”. Tap on 1, the “and” after 1, the “and” after 2, then on 3 and 4: short, long, short, long, long.", 72),
    practice("Name it by ear", {
      kind: "choice",
      prompt: "Listen. On the beat, or syncopated?",
      options: ["On the beat", "Syncopated"],
      answer: "Syncopated",
      sound: rhythm(["e", "q", "e", "q", "q", "e", "q", "e", "q", "q"], 90),
      miss: "Some notes started on the “and” and held over the beat: syncopated",
    }),
    practice("Use it in real songs", {
      kind: "choice",
      prompt: "The clavinet riff in “Superstition” by Stevie Wonder keeps landing between the beats. That's called…",
      options: ["Syncopation", "Compound meter", "A slur"],
      answer: "Syncopation",
      sound: rhythm(["s", "s", "er", "s", "s", "s", "er", "s", "e", "s", "s", "er", "e"], 100, 4, 64),
      miss: "Accents off the beat are syncopation. It's what makes the riff funky",
    }),
  ],
};
