import { chordsSound } from "./mix-v2";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 9, chord progressions. This chapter is about how chords move, so the activities put
// progressions in order, sort chords by job (home, set-up, pull), hear how fast chords change, and
// number the chords of hit songs that use each progression.

const prog = (...symbols: string[]): Sound => chordsSound(symbols);
/** The same chords, with `gap` seconds between changes. */
const paced = (gap: number, ...symbols: string[]): Sound => ({ ...(chordsSound(symbols) as Extract<Sound, { kind: "progression" }>), gap });
const card = (text: string, left: string, right: string, label: string, sound: Sound): StoryCard => ({ text, left, right, label, sound });
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

const MAJOR_RN = ["I", "ii", "iii", "IV", "V", "vi"];
const MINOR_RN = ["i", "ii°", "III", "iv", "V", "VI", "VII"];
const FUNCTIONS = ["Tonic (home)", "Pre-dominant (set-up)", "Dominant (pull home)"];

const which = (prompt: string, text: string, options: string[], answer: string, sound: Sound, why: string): RushQuestion => ({
  kind: "choice",
  prompt,
  options,
  answer,
  visual: { type: "big", text },
  sound,
  miss: why,
});

export const CHAPTER_9: Record<string, Step[]> = {
  "9.1": [
    story(
      card("The strongest move between chords is a root falling by a 5th, like V to I (G to C). Chain those moves together and you get the circle of fifths progression.", "G", "C", "down a 5th", prog("G", "C")),
      card("In C major it runs I, IV, vii°, iii, vi, ii, V, I: C, F, B°, Em, Am, Dm, G, C. Every root falls a 5th.", "C F B° Em", "Am Dm G C", "the circle", prog("C", "F", "B°", "Em", "Am", "Dm", "G", "C")),
      card("Bach, Handel and Vivaldi used it constantly, and so do pop songs and jazz standards like “Fly Me to the Moon”.", "vi ii", "V I", "Fly Me to the Moon", prog("Am7", "Dm7", "G7", "Cmaj7")),
      card("On guitar the move is easy to see: falling a 5th is the same as rising a 4th, so the next root is on the next string up, at the same fret.", "A", "D", "next string, same fret", prog("Am", "Dm")),
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Finish the circle of fifths progression in C major.",
      given: ["C", "F", null, "Em", null, null, "G", "C"],
      answer: ["C", "F", "B°", "Em", "Am", "Dm", "G", "C"],
      tiles: ["Am", "B°", "Dm", "D", "A"],
      labels: ["I", "IV", "vii°", "iii", "vi", "ii", "V", "I"],
      sound: prog("C", "F", "B°", "Em", "Am", "Dm", "G", "C"),
      miss: "Each root falls a 5th: C F B E A D G C",
    }),
    practice(
      "Find it on the guitar",
      { kind: "fretInterval", string: 4, fret: 0, semitones: 5, label: "perfect 4th (the next root after A)", hint: "Falling a 5th from A lands on D. On guitar, go to the next string up at the same fret: the open D string." },
      { kind: "fretInterval", string: 5, fret: 3, semitones: 5, label: "perfect 4th (the next root after G)", hint: "After G comes C. Next string up, same fret: A string, fret 3." },
    ),
    song("I Will Survive", "Gloria Gaynor", "A minor", ["Am", "Dm", "G", "C"], ["i", "iv", "VII", "III"], MINOR_RN),
  ],

  "9.2": [
    story(
      card("Harmonic rhythm is how fast the chords change. It's separate from the melody's rhythm.", "1 chord", "per bar", "slow", prog("C", "C", "F", "F")),
      card("One chord per bar or slower feels relaxed. Two or more per bar feels busy and pushes forward.", "2 chords", "per bar", "fast", paced(0.45, "C", "F", "G", "C", "C", "F", "G", "C")),
      card("Songs often speed up the harmonic rhythm near the end of a phrase, so the cadence feels like it's arriving.", "slow", "then fast", "into the cadence", prog("C", "F", "Dm", "G", "C")),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Slow harmonic rhythm or fast?", options: ["Slow", "Fast"], answer: "Fast", sound: paced(0.45, "C", "F", "G", "C", "Am", "F", "G", "C"), miss: "The chords changed quickly, about twice a second: fast" },
      { kind: "choice", prompt: "Listen. Slow harmonic rhythm or fast?", options: ["Slow", "Fast"], answer: "Slow", sound: paced(1.6, "C", "F", "G", "C"), miss: "Each chord lasted a long time: slow" },
    ),
    practice(
      "Use it in real songs",
      which("“La Bamba” and “Twist and Shout” keep cycling I, IV, V, changing every two beats. How does that harmonic rhythm feel?", "C F G  C F G", ["Relaxed", "Busy and driving"], "Busy and driving", paced(0.5, "C", "F", "G", "G", "C", "F", "G", "G"), "Two chords per bar keeps the song pushing forward"),
    ),
  ],

  "9.3": [
    story(
      card("You don't need the whole circle. Short slices of it are everywhere. The most famous is ii, V, I.", "ii V", "I", "Dm G C", prog("Dm7", "G7", "Cmaj7")),
      card("ii–V–I is the backbone of jazz standards. In C it's Dm7, G7, Cmaj7.", "Dm7 G7", "Cmaj7", "in C", prog("Dm7", "G7", "Cmaj7")),
      card("Add one more link and you get vi, ii, V, I: Am, Dm, G, C. It's the sound of old-time pop and doo-wop turnarounds.", "Am Dm", "G C", "vi ii V I", prog("Am", "Dm", "G", "C")),
    ),
    practice(
      "Name it",
      which("What's ii–V–I in G major?", "G major: ii V I", ["Am7 D7 Gmaj7", "Dm7 G7 Cmaj7", "Em7 A7 Dmaj7"], "Am7 D7 Gmaj7", prog("Am7", "D7", "Gmaj7"), "In G, ii is Am, V is D and I is G"),
      which("What's ii–V–I in F major?", "F major: ii V I", ["Gm7 C7 Fmaj7", "Dm7 G7 Cmaj7", "Bbmaj7 C7 F"], "Gm7 C7 Fmaj7", prog("Gm7", "C7", "Fmaj7"), "In F, ii is Gm, V is C and I is F"),
      { kind: "order", prompt: "Put vi–ii–V–I in C major in order.", given: [null, null, null, "C"], answer: ["Am", "Dm", "G", "C"], tiles: ["G", "Dm", "Am", "F"], labels: ["vi", "ii", "V", "I"], sound: prog("Am", "Dm", "G", "C"), miss: "vi ii V I in C: Am Dm G C" },
    ),
    song("Autumn Leaves", "jazz standard", "G major", ["Am7", "D7", "Gmaj7"], ["ii7", "V7", "Imaj7"], ["Imaj7", "ii7", "iii7", "IVmaj7", "V7", "vi7"]),
  ],

  "9.4": [
    story(
      card("Chords have jobs. The tonic, I, is home: rest and arrival. iii and vi can stand in for it.", "I", "vi", "tonic", prog("C", "Am")),
      card("Pre-dominant chords, ii and IV, set up the dominant. They lead away from home.", "ii", "IV", "pre-dominant", prog("Dm", "F")),
      card("Dominant chords, V and vii°, create tension that pulls back to I.", "V", "vii°", "dominant", prog("G", "B°", "C")),
      card("Most progressions follow the same story: home, set-up, pull, home. I, IV, V, I is the simplest version.", "T PD", "D T", "I IV V I", prog("C", "F", "G", "C")),
    ),
    practice("Sort it", {
      kind: "order",
      layout: "list",
      prompt: "Give each chord in C major its job.",
      given: ["Tonic", null, null, null],
      answer: ["Tonic", "Pre-dominant", "Dominant", "Pre-dominant"],
      tiles: ["Dominant", "Pre-dominant", "Pre-dominant", "Tonic"],
      labels: ["C (I)", "F (IV)", "G (V)", "Dm (ii)"],
      sound: prog("C", "F", "G", "Dm"),
      miss: "I is tonic, ii and IV are pre-dominant, V is dominant",
    }),
    practice(
      "Name it",
      which("In G major, what job does the D chord do?", "D in G major", FUNCTIONS, "Dominant (pull home)", prog("D", "G"), "D is V in G: dominant, pulling back to G"),
      which("In C major, what job does Am usually do?", "Am in C major", FUNCTIONS, "Tonic (home)", prog("C", "Am"), "vi shares two notes with I (C and E), so it stands in for the tonic"),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Does the last chord sound like home, or like it's pulling somewhere?", options: ["Home", "Pulling"], answer: "Pulling", sound: prog("C", "F", "G"), miss: "It stopped on V, the dominant, which pulls back to I" },
    ),
    practice(
      "Use it in real songs",
      which("“Twist and Shout” by the Beatles loops D, G, A. In D major, what job does the A chord do?", "D  G  A", FUNCTIONS, "Dominant (pull home)", prog("D", "G", "A", "A", "D"), "A is V in D: dominant. That's why the song keeps pulling back to D"),
    ),
  ],

  "9.5": [
    story(
      card("A sequence repeats a chord pattern starting on a new note, like a melody moved up or down a step.", "Am Dm", "G C", "pattern", prog("Am", "Dm", "G", "C")),
      card("Inside a sequence, the pattern is stronger than the usual rules. Chords can move in ways they normally wouldn't, because your ear follows the repeating shape.", "pattern", "pattern", "repeat", prog("Bm", "F#", "A", "E")),
      card("The verse of “Hotel California” is a sequence: Bm to F♯, then A to E, then G to D. Each pair moves down a 4th.", "Bm F♯", "A E", "same move", prog("Bm", "F#", "A", "E", "G", "D", "Em", "F#")),
    ),
    practice(
      "Name it",
      which("In “Hotel California”, Bm goes to F♯, then A goes to E. How does each pair move?", "Bm F♯  A E", ["Down a 4th", "Up a 3rd", "Down a step"], "Down a 4th", prog("Bm", "F#", "A", "E"), "B down to F♯ and A down to E are both a 4th: the same move, repeated"),
      which("What makes a sequence a sequence?", "Bm F♯ A E G D", ["The same pattern repeats on new notes", "Every chord is major", "It always ends on V"], "The same pattern repeats on new notes", prog("Bm", "F#", "A", "E", "G", "D"), "A sequence is one pattern, moved to new starting notes"),
    ),
    song("Hotel California", "Eagles", "B minor", ["Bm", "F#", "A", "E"], ["i", "V", "VII", "IV"], ["i", "iv", "IV", "V", "VI", "VII"]),
  ],

  "9.6": [
    story(
      card("The subtonic chord, ♭VII, is built on the lowered 7th note. In D major that's C, borrowed from D minor.", "D", "C", "I ♭VII", prog("D", "C")),
      card("Rock loves it. ♭VII can go straight home to I, or to IV first.", "♭VII", "IV I", "classic rock", prog("C", "G", "D")),
      card("♭VII–IV–I is a classic rock ending. In D: C, G, D. It's the opposite direction of V–I, and it sounds open and anthemic instead of tense.", "C G", "D", "♭VII IV I", prog("C", "G", "D")),
    ),
    practice(
      "Name it",
      which("In D major, which chord is ♭VII?", "D major: ♭VII", ["C", "C♯°", "G"], "C", prog("D", "C", "D"), "The 7th note of D major is C♯. Lower it to C and build a major chord: C"),
      which("In A major, which chord is ♭VII?", "A major: ♭VII", ["G", "G♯°", "F"], "G", prog("A", "G", "D", "A"), "A major's 7th is G♯. Lowered, it's G: a G major chord"),
    ),
    practice(
      "Find it on the guitar",
      { kind: "fretInterval", string: 3, fret: 0, semitones: 10, label: "minor 7th (the root of ♭VII in D)", hint: "♭VII's root is a whole step below D: C. Above the open D string, try the B string, fret 1." },
    ),
    song("Sweet Child O' Mine", "Guns N' Roses", "D major", ["D", "C", "G", "D"], ["I", "♭VII", "IV", "I"], ["I", "ii", "IV", "V", "vi", "♭VII"]),
  ],

  "9.7": [
    story(
      card("I, V, vi, IV turns up in hit after hit. In C: C, G, Am, F.", "C G", "Am F", "I V vi IV", prog("C", "G", "Am", "F")),
      card("It works because it mixes home (I), pull (V), a darker stand-in for home (vi) and a set-up (IV), then loops.", "I V", "vi IV", "the loop", prog("C", "G", "Am", "F", "C")),
      card("Start the same four chords on vi and it turns darker: vi, IV, I, V. In C: Am, F, C, G.", "Am F", "C G", "vi IV I V", prog("Am", "F", "C", "G")),
    ),
    practice(
      "Name it",
      which("What's I–V–vi–IV in G major?", "G major: I V vi IV", ["G D Em C", "G C D Em", "G Em C D"], "G D Em C", prog("G", "D", "Em", "C"), "In G: I = G, V = D, vi = Em, IV = C"),
      which("What's I–V–vi–IV in D major?", "D major: I V vi IV", ["D A Bm G", "D G A Bm", "D Bm G A"], "D A Bm G", prog("D", "A", "Bm", "G"), "In D: I = D, V = A, vi = Bm, IV = G"),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Does it start on I (bright) or vi (dark)?", options: ["I–V–vi–IV", "vi–IV–I–V"], answer: "vi–IV–I–V", sound: prog("Am", "F", "C", "G"), miss: "It opened on the minor chord: vi–IV–I–V" },
    ),
    song("Don't Stop Believin'", "Journey", "E major", ["E", "B", "C♯m", "A"], ["I", "V", "vi", "IV"], MAJOR_RN),
  ],

  "9.8": [
    story(
      card("In minor keys, i, VII, VI, VII rocks back and forth: Am, G, F, G.", "Am G", "F G", "i VII VI VII", prog("Am", "G", "F", "G")),
      card("Its cousin is the Andalusian descent from flamenco: i, VII, VI, V. The bass walks down A, G, F, E.", "Am G", "F E", "Andalusian", prog("Am", "G", "F", "E")),
      card("The last chord makes the difference: G (VII) keeps it rocking, while E (major V) pulls hard back to Am.", "G", "E", "VII or V", prog("Am", "G", "F", "E", "Am")),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Does it end on VII (G) or the Andalusian V (E)?", options: ["VII: i–VII–VI–VII", "V: i–VII–VI–V"], answer: "V: i–VII–VI–V", sound: prog("Am", "G", "F", "E"), miss: "The last chord had G♯ and leaned back to Am: the Andalusian V" },
      { kind: "choice", prompt: "Listen. Does it end on VII (G) or the Andalusian V (E)?", options: ["VII: i–VII–VI–VII", "V: i–VII–VI–V"], answer: "VII: i–VII–VI–VII", sound: prog("Am", "G", "F", "G"), miss: "It rocked back up to G: i–VII–VI–VII" },
    ),
    practice(
      "Use it in real songs",
      which("“Hit the Road Jack” by Ray Charles walks down Am, G, F, E. Which progression is that?", "Am G F E", ["i–VII–VI–VII", "Andalusian (i–VII–VI–V)", "I–V–vi–IV"], "Andalusian (i–VII–VI–V)", prog("Am", "G", "F", "E"), "It walks down to E, the major V: the Andalusian descent"),
    ),
    song("All Along the Watchtower", "Jimi Hendrix", "C♯ minor", ["C♯m", "B", "A", "B"], ["i", "VII", "VI", "VII"], MINOR_RN),
  ],
};
