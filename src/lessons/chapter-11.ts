import { parseNote } from "../music";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 11, melody: motives, how they get changed, fragments, phrases and subphrases. Melodies
// are heard more than read, so the activities play short tunes, ask what changed, rebuild motives
// in order, and count bars and phrases in famous songs and riffs.

const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const tune = (notes: string[], gap = 0.4): Sound => ({ kind: "melodic", notes: midi(...notes), gap });
const card = (text: string, staff: string[], sound: Sound = tune(staff)): StoryCard => ({ text, staff, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

const ALTERATIONS = ["Inversion (flipped)", "Retrograde (backwards)", "Transposed (moved)", "Augmentation (slower)"];

const MOTIVE = ["C4", "D4", "E4", "G4"];
const altered = (notes: string[], answer: string, why: string, gap = 0.4): RushQuestion => ({
  kind: "choice",
  prompt: "Here's the motive C D E G, then a changed version. How was it changed?",
  options: ALTERATIONS,
  answer,
  visual: { type: "staff", notes },
  sound: { kind: "melodic", notes: [...midi(...MOTIVE), ...midi(...notes)], gap },
  miss: why,
});

export const CHAPTER_11: Record<string, Step[]> = {
  "11.1": [
    story(
      card("A motive is the smallest musical idea you'd recognize: a few notes with a distinct rhythm and shape.", ["G4", "G4", "G4", "Eb4"], tune(["G4", "G4", "G4", "Eb4"], 0.22)),
      card("The most famous one opens Beethoven's 5th Symphony: three short notes and a long one. Beethoven builds the whole movement from it.", ["G4", "G4", "G4", "Eb4", "F4", "F4", "F4", "D4"], tune(["G4", "G4", "G4", "Eb4", "F4", "F4", "F4", "D4"], 0.22)),
      card("Rock riffs are motives too. “Seven Nation Army” by the White Stripes repeats one seven-note idea through the whole song.", ["E4", "E4", "G4", "E4", "D4", "C4", "B3"], tune(["E4", "E4", "G4", "E4", "D4", "C4", "B3"], 0.32)),
    ),
    practice(
      "Rebuild it",
      { kind: "order", prompt: "Rebuild the “Seven Nation Army” riff in order.", given: ["E", "E", null, "E", null, null, "B"], answer: ["E", "E", "G", "E", "D", "C", "B"], tiles: ["C", "D", "G", "A"], sound: tune(["E4", "E4", "G4", "E4", "D4", "C4", "B3"], 0.32), miss: "E E G E D C B: up to G, then down step by step" },
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Is the second idea the same motive, moved down?", options: ["Yes, same motive moved down", "No, a new idea"], answer: "Yes, same motive moved down", sound: tune(["G4", "G4", "G4", "Eb4", "F4", "F4", "F4", "D4"], 0.22), miss: "Short-short-short-long both times, a step lower: the same motive" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "On guitar, the “Seven Nation Army” riff starts on the A string, fret 7. If you move the whole riff to start on the low E string, fret 7, is it still the same motive?", options: ["Yes, just transposed", "No, it's a new riff"], answer: "Yes, just transposed", visual: { type: "big", text: "E E G E D C B" }, sound: tune(["E4", "E4", "G4", "E4", "D4", "C4", "B3", "B3", "B3", "D4", "B3", "A3", "G3", "F#3"], 0.3), miss: "Same rhythm and shape on new notes: the motive, transposed" },
    ),
  ],

  "11.2": [
    story(
      card("Composers reuse a motive by changing it. Start with C, D, E, G.", MOTIVE),
      card("Inversion flips every move upside down: up a step becomes down a step. C D E G becomes C B A F.", ["C4", "B3", "A3", "F3"]),
      card("Retrograde plays it backwards: G E D C.", ["G4", "E4", "D4", "C4"]),
      card("Augmentation makes the notes longer (slower) and diminution makes them shorter (faster). The notes stay the same.", MOTIVE, tune(MOTIVE, 0.8)),
      card("It can also be transposed (moved up or down), ornamented with extra notes, or extended at the end.", ["F4", "G4", "A4", "C5"]),
    ),
    practice(
      "Name it",
      altered(["G4", "E4", "D4", "C4"], "Retrograde (backwards)", "Same notes, last to first: retrograde"),
      altered(["C4", "B3", "A3", "F3"], "Inversion (flipped)", "Every step up became a step down: inversion"),
      altered(["F4", "G4", "A4", "C5"], "Transposed (moved)", "Same shape, starting on F: transposed"),
    ),
    practice("Flip it", {
      kind: "order",
      prompt: "Play the motive C D E G backwards (retrograde).",
      given: [null, null, null, null],
      answer: ["G", "E", "D", "C"],
      tiles: ["C", "D", "E", "G"],
      sound: tune(["G4", "E4", "D4", "C4"]),
      miss: "Backwards is last note first: G E D C",
    }),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Jazz and rock players repeat a riff, then answer it with the same notes played slower. Which alteration is that?", options: ALTERATIONS, answer: "Augmentation (slower)", sound: { kind: "melodic", notes: [...midi("C4", "D4", "E4", "G4")], gap: 0.25 }, miss: "Same notes, longer values: augmentation" },
    ),
  ],

  "11.3": [
    story(
      card("A fragment is a small piece broken off a motive or phrase and used on its own.", ["G4", "G4", "G4", "Eb4"], tune(["G4", "G4", "G4", "Eb4"], 0.22)),
      card("Beethoven takes just the first three short notes of his motive and passes them around the orchestra. That's fragmentation.", ["G4", "G4", "G4"], tune(["G4", "G4", "G4", "Ab4", "Ab4", "Ab4", "Bb4", "Bb4", "Bb4"], 0.18)),
      card("Fragments build energy: the idea gets shorter and comes faster, pushing toward a climax.", ["E4", "E4", "G4"], tune(["E4", "E4", "G4", "E4", "E4", "G4", "E4", "E4", "G4"], 0.25)),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "The full motive is G G G E♭. A later passage repeats just G G G over and over. What's that piece called?", options: ["A fragment", "A phrase", "A retrograde"], answer: "A fragment", visual: { type: "staff", notes: ["G4", "G4", "G4"] }, sound: tune(["G4", "G4", "G4", "G4", "G4", "G4"], 0.18), miss: "A small piece split off the motive: a fragment" },
      { kind: "choice", prompt: "Why do composers fragment a motive near the end of a section?", options: ["To build energy toward a climax", "To change the key", "To slow down"], answer: "To build energy toward a climax", miss: "Shorter, faster repeats push the music forward" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Songs often end a chorus by repeating just the last few words of the hook (“...hey, hey, hey!”). In this chapter's terms, that's…", options: ["Fragmenting the hook", "A new motive", "Inversion"], answer: "Fragmenting the hook", miss: "A small piece of the hook, repeated on its own: a fragment" },
    ),
  ],

  "11.4": [
    story(
      card("A phrase is a complete musical thought, like a sentence. It feels finished when it ends.", ["C4", "C4", "G4", "G4", "A4", "A4", "G4"]),
      card("Most phrases are four bars long. In classical music, a phrase ends with a cadence.", ["F4", "F4", "E4", "E4", "D4", "D4", "C4"]),
      card("“Twinkle Twinkle Little Star” has phrases you can sing in one breath: “Twinkle twinkle little star, how I wonder what you are.”", ["C4", "C4", "G4", "G4", "A4", "A4", "G4", "F4", "F4", "E4", "E4", "D4", "D4", "C4"], tune(["C4", "C4", "G4", "G4", "A4", "A4", "G4", "F4", "F4", "E4", "E4", "D4", "D4", "C4"], 0.35)),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "How long is a typical phrase?", options: ["1 bar", "4 bars", "16 bars"], answer: "4 bars", miss: "Most phrases are four bars, though five to seven also happen" },
      { kind: "choice", prompt: "Listen. Does this sound like a complete phrase, or does it stop mid-thought?", options: ["Complete", "Stops mid-thought"], answer: "Complete", sound: tune(["C4", "C4", "G4", "G4", "A4", "A4", "G4", "F4", "F4", "E4", "E4", "D4", "D4", "C4"], 0.3), miss: "It landed back home on C: a complete phrase" },
      { kind: "choice", prompt: "Listen. Does this sound like a complete phrase, or does it stop mid-thought?", options: ["Complete", "Stops mid-thought"], answer: "Stops mid-thought", sound: tune(["C4", "C4", "G4", "G4", "A4", "A4", "G4"], 0.3), miss: "It stopped on G, away from home: it needs the next part" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "“Happy Birthday” has four lines. If each line is one phrase, how many phrases does the song have?", options: ["2", "4", "8"], answer: "4", sound: tune(["G4", "G4", "A4", "G4", "C5", "B4"], 0.35), miss: "Four lines, each one complete: four phrases" },
    ),
  ],

  "11.5": [
    story(
      card("A subphrase is between a motive and a phrase in size, usually two bars. Two subphrases often make one phrase.", ["C4", "C4", "G4", "G4", "A4", "A4", "G4"]),
      card("We label subphrases with letters. A new idea gets a new letter: a, then b.", ["F4", "F4", "E4", "E4", "D4", "D4", "C4"]),
      card("When an idea comes back changed, it gets a prime mark: a′ (“a prime”).", ["G4", "G4", "F4", "F4", "E4", "E4", "D4"]),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "A subphrase comes back with a slightly different ending. How is it labeled?", options: ["a′", "b", "c"], answer: "a′", miss: "Same idea, changed: a′" },
      { kind: "choice", prompt: "How long is a subphrase usually?", options: ["Half a bar", "2 bars", "8 bars"], answer: "2 bars", miss: "Usually two bars, half of a four-bar phrase" },
    ),
    practice("Use it in real songs", {
      kind: "order",
      prompt: "“Happy Birthday”: lines 1, 2 and 4 start the same way, and line 3 starts high. Label each line.",
      given: ["a", null, null, null],
      answer: ["a", "a′", "b", "a″"],
      tiles: ["a′", "a″", "b", "c"],
      labels: ["line 1", "line 2", "line 3", "line 4"],
      sound: tune(["G4", "G4", "A4", "G4", "C5", "B4", "G4", "G4", "A4", "G4", "D5", "C5"], 0.32),
      miss: "Lines 2 and 4 are changed versions of line 1 (a′, a″), and line 3 is new (b)",
    }),
  ],
};
