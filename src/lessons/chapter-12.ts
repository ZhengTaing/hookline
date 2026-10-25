import { chordsSound } from "./mix-v2";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 12, song form. Form is the map of a whole song, so the activities lay song sections out
// in order, fill in the 12-bar blues bar by bar, play its three chords on the neck, and hear
// whether a section ends closed (home) or open (pulling onward).

const prog = (...symbols: string[]): Sound => chordsSound(symbols);
const card = (text: string, left: string, right: string, label: string, sound: Sound): StoryCard => ({ text, left, right, label, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

const BLUES_A = ["A7", "A7", "A7", "A7", "D7", "D7", "A7", "A7", "E7", "D7", "A7", "A7"];

export const CHAPTER_12: Record<string, Step[]> = {
  "12.1": [
    story(
      card("Form is the map of a song: which sections come in which order. Today's most common form is verse–chorus.", "verse", "chorus", "the map", prog("Am", "F", "C", "G")),
      card("Verses tell the story, with new words each time. The chorus carries the hook and comes back with the same words.", "new words", "same words", "verse vs chorus", prog("C", "G", "Am", "F")),
      card("Common extras: a pre-chorus that builds into the chorus, a post-chorus after it, and a bridge near the end for contrast.", "pre-chorus", "bridge", "extras", prog("F", "G", "Am", "G")),
      card("A typical map: intro, verse, pre-chorus, chorus, verse, pre-chorus, chorus, bridge, chorus.", "V P C", "V P C B C", "typical pop", prog("C", "G", "Am", "F")),
    ),
    practice("Put it in order", {
      kind: "order",
      layout: "list",
      prompt: "Lay out a typical verse–chorus song.",
      given: ["Intro", "Verse", null, "Chorus", "Verse", null, "Chorus", null, "Chorus"],
      answer: ["Intro", "Verse", "Pre-chorus", "Chorus", "Verse", "Pre-chorus", "Chorus", "Bridge", "Chorus"],
      tiles: ["Bridge", "Pre-chorus", "Pre-chorus", "Outro"],
      labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
      miss: "Intro, verse, pre-chorus, chorus, verse, pre-chorus, chorus, bridge, chorus",
    }),
    practice(
      "Name it",
      { kind: "choice", prompt: "Which section usually holds the hook and repeats the same words?", options: ["Verse", "Chorus", "Bridge"], answer: "Chorus", miss: "The chorus carries the hook and keeps its words" },
      { kind: "choice", prompt: "Which section appears once, near the end, for contrast?", options: ["Bridge", "Pre-chorus", "Verse"], answer: "Bridge", miss: "The bridge gives contrast before the last chorus" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "In “Let It Be”, the words “let it be, let it be” come back every time with the same chords, Am G F C. Which section is that?", options: ["Chorus", "Verse", "Bridge"], answer: "Chorus", visual: { type: "big", text: "Am G F C", caption: "let it be, let it be" }, sound: prog("Am", "G", "F", "C"), miss: "Same words and the hook every time: the chorus" },
    ),
  ],

  "12.2": [
    story(
      card("Before verse–chorus, popular songs from the 1930s to the 1950s used AABA form: 32 bars in four 8-bar sections.", "A A", "B A", "32 bars", prog("C", "Am", "Dm", "G")),
      card("The A section holds the main tune, and you hear it twice. The B section, called the bridge, brings new music for contrast. Then A returns.", "A", "B", "the bridge", prog("F", "Fm", "C", "G")),
      card("“Over the Rainbow” is a classic AABA song. The B section starts “Someday I'll wish upon a star”.", "A A", "B A", "Over the Rainbow", prog("C", "Am", "Em", "C")),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "How long is a typical AABA song form?", options: ["12 bars", "32 bars", "64 bars"], answer: "32 bars", miss: "Four sections of 8 bars: 32" },
      { kind: "choice", prompt: "In AABA, what's the B section called?", options: ["The bridge", "The chorus", "The intro"], answer: "The bridge", miss: "In AABA the B is the bridge, the contrasting middle" },
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Lay out AABA form.",
      given: ["A", null, null, null],
      answer: ["A", "A", "B", "A"],
      tiles: ["A", "A", "B", "C"],
      labels: ["bars 1–8", "9–16", "17–24", "25–32"],
      miss: "A, A, B (bridge), A",
    }),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "In “Over the Rainbow”, “Someday I'll wish upon a star” sounds totally different from the opening tune, then the opening tune comes back. Which section is “Someday”?", options: ["A", "B", "C"], answer: "B", miss: "It's the contrasting bridge: the B section of AABA" },
    ),
  ],

  "12.3": [
    story(
      card("ABAC is another 32-bar plan from the same era: four 8-bar sections where the first and third match.", "A B", "A C", "32 bars", prog("C", "G", "C", "F")),
      card("A and B make the first half. A returns to start the second half, but C takes a new path to the ending.", "A B", "A C", "new ending", prog("C", "Am", "F", "G", "C")),
      card("“White Christmas” and “Star Dust” are ABAC songs. Sometimes it's written ABAB′, when the last part is a changed B.", "A B", "A B′", "ABAB′", prog("C", "Dm", "G", "C")),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "In ABAC form, which sections are the same?", options: ["The first and third", "The first and second", "All four"], answer: "The first and third", miss: "A comes back in the third section: A B A C" },
      { kind: "choice", prompt: "How is ABAC different from AABA?", options: ["A returns halfway through, then a new C ends it", "It has no repeats", "It's 12 bars"], answer: "A returns halfway through, then a new C ends it", miss: "AABA repeats A first. ABAC alternates, then ends with new music" },
    ),
    practice("Use it in real songs", {
      kind: "order",
      prompt: "Lay out “White Christmas” (ABAC).",
      given: [null, "B", null, null],
      answer: ["A", "B", "A", "C"],
      tiles: ["A", "A", "B", "C"],
      labels: ["bars 1–8", "9–16", "17–24", "25–32"],
      miss: "A, B, A, C",
    }),
  ],

  "12.4": [
    story(
      card("The 12-bar blues is one of the most played forms ever: 12 bars, three chords, I, IV and V.", "I IV V", "12 bars", "the blues", prog("A7", "D7", "E7", "A7")),
      card("Bars 1–4 stay on I. Bars 5–6 go to IV, bars 7–8 back to I.", "I I I I", "IV IV I I", "bars 1–8", prog("A7", "A7", "A7", "A7", "D7", "D7", "A7", "A7")),
      card("Bars 9–12: V, IV, I, I. Then it starts over. It drove swing, early rock 'n' roll and countless guitar jams.", "V IV", "I I", "bars 9–12", prog("E7", "D7", "A7", "A7")),
      card("In A, that's A7, D7 and E7. On guitar, the roots are the open A string, open D string and open low E string.", "A7 D7", "E7", "in A", prog(...BLUES_A)),
    ),
    practice("Put it in order", {
      kind: "order",
      layout: "list",
      prompt: "Fill in the 12-bar blues.",
      given: ["I", "I", "I", "I", null, null, "I", "I", null, null, "I", "I"],
      answer: ["I", "I", "I", "I", "IV", "IV", "I", "I", "V", "IV", "I", "I"],
      tiles: ["IV", "IV", "IV", "V", "vi"],
      labels: ["bar 1", "bar 2", "bar 3", "bar 4", "bar 5", "bar 6", "bar 7", "bar 8", "bar 9", "bar 10", "bar 11", "bar 12"],
      sound: prog(...BLUES_A),
      miss: "I I I I, IV IV I I, V IV I I",
    }),
    practice(
      "Find it on the guitar",
      { kind: "fretInterval", string: 5, fret: 0, semitones: 5, label: "perfect 4th (the root of IV in E blues)", hint: "In an E blues, IV is A: the open A string, or low E string fret 5." },
      { kind: "fretInterval", string: 5, fret: 0, semitones: 7, label: "perfect 5th (the root of V in E blues)", hint: "V is B: A string, fret 2." },
    ),
    {
      type: "realSong",
      song: "Johnny B. Goode",
      artist: "Chuck Berry",
      key: "B♭ major (bars 1, 5, 9, 10)",
      chords: ["B♭", "E♭", "F", "E♭"],
      answer: ["I", "IV", "V", "IV"],
      options: ["I", "ii", "IV", "V", "vi"],
      sound: chordsSound(["B♭", "E♭", "F", "E♭"]),
    },
  ],

  "12.5": [
    story(
      card("A section is harmonically closed if it ends on I. It sounds finished, like a full stop.", "V", "I", "closed", prog("F", "G", "C")),
      card("It's open if it ends somewhere else, usually V. It sounds like it's leading on, like a question.", "IV", "V", "open", prog("C", "F", "G")),
      card("Verses and bridges are often open, so they pull you into the chorus. Choruses are often closed, so they feel like arriving.", "verse: open", "chorus: closed", "song design", prog("Am", "F", "G", "C", "G", "C")),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Closed or open?", options: ["Closed (ends on I)", "Open (ends elsewhere)"], answer: "Open (ends elsewhere)", sound: prog("C", "Am", "F", "G"), miss: "It stopped on G, V, and wants to keep going: open" },
      { kind: "choice", prompt: "Listen. Closed or open?", options: ["Closed (ends on I)", "Open (ends elsewhere)"], answer: "Closed (ends on I)", sound: prog("F", "G", "C"), miss: "It landed home on C: closed" },
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Which section is most often harmonically open, pulling into what comes next?", options: ["Pre-chorus or bridge", "Final chorus", "Outro"], answer: "Pre-chorus or bridge", miss: "Pre-choruses and bridges end on V or elsewhere so they lead into the chorus" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A 12-bar blues often ends its last bar on V (a “turnaround”) instead of I, so it can loop again. Does that make the end of each chorus open or closed?", options: ["Open", "Closed"], answer: "Open", visual: { type: "big", text: "… A7 | E7" }, sound: prog("D7", "A7", "E7"), miss: "Ending on V leaves it hanging so it rolls into the next round: open" },
    ),
  ],
};
