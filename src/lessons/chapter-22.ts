import { parseNote } from "../music";
import { chordsSound } from "./chords-sound";
import type { RushQuestion, Sound, Step, StoryCard } from "./types";

// Chapter 22, modulation: changing key. Guitarists change key by sliding shapes up the neck, so the
// lessons hear a key move, find the new tonic on the fretboard, pick pivot chords that live in both
// keys, spot the new key from its accidentals, and label pop's famous "up a step" final choruses.

const midi = (...names: string[]) => names.map((n) => parseNote(n).midi);
const voiced = (...chords: string[][]): Sound => ({ kind: "progression", gap: 0.9, chords: chords.map((c) => midi(...c)) });
const prog = (...symbols: string[]): Sound => chordsSound(symbols);
const card = (text: string, left: string, right: string, label: string, sound: Sound): StoryCard => ({ text, left, right, label, sound });
const story = (...cards: StoryCard[]): Step => ({ type: "story", cards });
const practice = (title: string, ...questions: RushQuestion[]): Step => ({ type: "practice", title, questions });

const PIVOT = voiced(["C3", "E3", "G3"], ["A2", "C3", "E3"], ["D3", "F#3", "A3", "C4"], ["G2", "B2", "D3"]);

export const CHAPTER_22: Record<string, Step[]> = {
  "22.1": [
    story(
      card("Modulation is a change of key in the middle of a piece. The music picks a new home.", "C major", "G major", "new home", prog("C", "F", "G", "C", "D", "G")),
      card("Pop calls it a key change, often a sudden jump for the last chorus. Classical theory usually means a smoother move confirmed by a cadence.", "pop", "classical", "two styles", prog("C", "G", "C", "D", "A", "D")),
      card("Beyoncé's “Love on Top” is famous for it: near the end the song moves up a half step, then again, and again, four times.", "up ½", "×4", "Love on Top", prog("C", "C#", "D", "Eb")),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Does the key change?", options: ["Yes, it moves up", "No, same key"], answer: "Yes, it moves up", sound: prog("C", "G", "C", "D", "A", "D"), miss: "It started home on C, then settled on D: a new key" },
      { kind: "choice", prompt: "Listen. Does the key change?", options: ["Yes, it moves up", "No, same key"], answer: "No, same key", sound: prog("C", "Am", "F", "G", "C"), miss: "Every chord is in C and it ends on C: no change" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 4, fret: 3, semitones: 2, label: "D, the new tonic one whole step up", hint: "The song's tonic is C (A string, fret 3). A key change up a whole step moves every shape up two frets: D at fret 5." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "In “Love on Top”, each key change near the end moves the song up by how much?", options: ["A half step", "A whole step", "An octave"], answer: "A half step", sound: prog("C", "C#", "D", "Eb"), miss: "Each one is a half step: one fret up on the guitar" },
    ),
  ],

  "22.2": [
    story(
      card("Tonicization is a visit: a secondary dominant points at a chord for a moment, then the music goes back home.", "D7 → G", "back to C", "a visit", prog("C", "D7", "G", "C")),
      card("Modulation is moving in: the new key is set up and confirmed with a cadence there, and the music stays a while.", "D7 → G", "cadence in G", "moving in", prog("C", "Am", "D7", "G", "C", "D7", "G")),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Is G just visited (tonicized), or does it become the new home (modulation)?", options: ["Just visited", "New home"], answer: "Just visited", sound: prog("C", "D7", "G", "F", "G", "C"), miss: "It touched G, then cadenced back in C: tonicization" },
      { kind: "choice", prompt: "Listen. Visited or new home?", options: ["Just visited", "New home"], answer: "New home", sound: prog("C", "Am", "D7", "G", "C", "Am", "D7", "G"), miss: "It cadenced on G twice and stayed: a modulation" },
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "What confirms a real modulation?", options: ["A cadence in the new key", "One secondary dominant", "A louder chorus"], answer: "A cadence in the new key", miss: "A cadence in the new key confirms the move" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "A verse in C has one D7 → G moment, then carries on in C. Is that a modulation?", options: ["No, a tonicization", "Yes, a modulation"], answer: "No, a tonicization", miss: "A short visit without settling is tonicization" },
    ),
  ],

  "22.3": [
    story(
      card("Closely related keys differ by at most one sharp or flat. Every key has five of them.", "±1 ♯/♭", "5 keys", "close", prog("C", "G", "F", "Am")),
      card("For C major they're G, F, A minor, E minor and D minor: the keys of its major and minor chords.", "G F Am", "Em Dm", "C's family", prog("C", "Dm", "Em", "F", "G", "Am")),
      card("Major keys most often modulate to V (C → G). Minor keys most often go to the relative major (Am → C).", "C → G", "Am → C", "favorite moves", prog("Am", "G", "C")),
    ),
    practice("Put it in order", {
      kind: "order",
      layout: "list",
      prompt: "List C major's closely related keys, from the chords of the key.",
      given: ["D minor", null, null, null, "A minor"],
      answer: ["D minor", "E minor", "F major", "G major", "A minor"],
      tiles: ["F major", "G major", "E minor", "B♭ major", "D major"],
      labels: ["ii", "iii", "IV", "V", "vi"],
      miss: "ii, iii, IV, V, vi: D minor, E minor, F, G, A minor",
    }),
    practice(
      "Name it",
      { kind: "choice", prompt: "A piece in G major modulates. Which key is most likely?", options: ["D major (V)", "E♭ major", "F♯ minor"], answer: "D major (V)", miss: "Major keys most often go to V. In G that's D" },
      { kind: "choice", prompt: "A piece in E minor modulates. Which key is most likely?", options: ["G major (relative major)", "E major", "B♭ major"], answer: "G major (relative major)", miss: "Minor keys most often go to the relative major: G" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Your song is in A major. Which key is closely related?", options: ["E major", "E♭ major", "C major"], answer: "E major", miss: "E is V of A and differs by one sharp: closely related" },
    ),
  ],

  "22.4": [
    story(
      card("A pivot chord belongs to both keys, so the music can turn on it. Am is vi in C and ii in G.", "vi in C", "ii in G", "Am", PIVOT),
      card("Before the pivot, you hear it in the old key. After it, the new key's V (D7) takes over and the cadence lands in G.", "Am", "D7 → G", "the turn", PIVOT),
      card("Bach does this all the time in his chorales: one shared chord, and the key has quietly moved.", "C", "G", "Bach", PIVOT),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "Which chord could pivot from C major to G major?", options: ["Em", "F", "B♭"], answer: "Em", sound: prog("C", "Em", "D7", "G"), miss: "Em is iii in C and vi in G: it's in both keys. F and B♭ aren't in G" },
      { kind: "choice", prompt: "In G major, what is Am?", options: ["ii", "vi", "IV"], answer: "ii", miss: "G, A: A is the 2nd degree, minor: ii" },
    ),
    practice("Put it in order", {
      kind: "order",
      prompt: "Label the pivot chord Am in both keys.",
      given: [null, null],
      answer: ["vi", "ii"],
      tiles: ["ii", "vi", "iii", "IV"],
      labels: ["in C", "in G"],
      sound: PIVOT,
      miss: "Am is vi in C and ii in G",
    }),
    practice(
      "Find it on the guitar",
      { kind: "findNote", pitchClass: 9, prompt: "Find A, the root of the pivot chord Am.", hint: "Open A string, or low E string, fret 5." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Writing a song in C, you want the bridge in G. Which chord makes a smooth door between them?", options: ["Am", "E♭", "B♭"], answer: "Am", sound: PIVOT, miss: "Am lives in both C and G, so it makes a natural pivot" },
    ),
  ],

  "22.5": [
    story(
      card("After a modulation, look for new accidentals that keep coming back. They point to the new key.", "F♯ F♯", "→ G", "sharps", prog("C", "D7", "G", "D7", "G")),
      card("A new sharp is often the new leading tone (F♯ leads to G). A new flat is often the new 4th (B♭ is 4 in F).", "new ♯ = 7", "new ♭ = 4", "the clue", prog("C", "C7", "F", "Bb", "C7", "F")),
      card("Then confirm it with a cadence in the new key.", "V", "I", "confirm", prog("D7", "G")),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "A piece in C keeps using F♯ and cadences on G. What's the new key?", options: ["G major", "F♯ major", "D major"], answer: "G major", miss: "F♯ is the leading tone of G: G major" },
      { kind: "choice", prompt: "A piece in C keeps using B♭ and cadences on F. What's the new key?", options: ["F major", "B♭ major", "D minor"], answer: "F major", miss: "B♭ is 4 in F major, and it cadences on F" },
      { kind: "choice", prompt: "A piece in C keeps using G♯ and cadences on Am. What's the new key?", options: ["A minor", "G♯ minor", "E major"], answer: "A minor", miss: "G♯ is the leading tone of A minor" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Reading a lead sheet in G, the bridge starts using C♯ and lands on D. Where did it go?", options: ["D major", "C♯ major", "A minor"], answer: "D major", sound: prog("G", "A7", "D"), miss: "C♯ is the leading tone of D: the bridge is in D (V of G)" },
    ),
  ],

  "22.6": [
    story(
      card("Sometimes the pivot isn't a plain chord in the key. It can be chromatic in one key and normal in the other.", "chromatic", "diatonic", "chromatic pivot", prog("C", "Ab", "Db", "Ab")),
      card("For example, A♭ is a borrowed ♭VI in C major but plain IV in E♭ major. That door leads somewhere farther away.", "♭VI in C", "IV in E♭", "A♭", prog("C", "Ab", "Bb", "Eb")),
      card("Schubert loved these surprise doors into faraway keys.", "C", "E♭", "Schubert", prog("C", "Fm", "Ab", "Bb7", "Eb")),
    ),
    practice(
      "Name it",
      { kind: "choice", prompt: "A♭ is ♭VI in C major. What is it in E♭ major?", options: ["IV", "V", "vi"], answer: "IV", miss: "E♭, F, G, A♭: A♭ is the 4th degree, IV" },
      { kind: "choice", prompt: "Why use a chromatic pivot?", options: ["To reach a faraway key smoothly", "To stay in the same key", "To slow the tempo"], answer: "To reach a faraway key smoothly", miss: "Chromatic chords open doors to keys that aren't closely related" },
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. C, then A♭, then B♭, then E♭. Did it end in C?", options: ["No, it moved to E♭", "Yes, still C"], answer: "No, it moved to E♭", sound: prog("C", "Ab", "Bb", "Eb"), miss: "A♭ pivoted, B♭ (V of E♭) followed, and it landed on E♭" },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "Film scores often use ♭VI as a door into a faraway key for a big emotional moment. In C, which chord is that door?", options: ["A♭", "Am", "F"], answer: "A♭", sound: prog("C", "Ab", "Bb", "Eb"), miss: "A♭ is ♭VI in C, borrowed from minor" },
    ),
  ],

  "22.7": [
    story(
      card("A direct modulation skips the pivot and just jumps. Often there's a pause, or the new key starts with its own V.", "C", "D", "just jump", prog("C", "G", "C", "D", "A", "D")),
      card("Pop's version moves the final chorus up a step (sometimes called the “truck driver” key change). It lifts the energy right at the end.", "chorus", "up a step", "truck driver", prog("C", "F", "G", "C", "D", "G", "A", "D")),
      card("“My Heart Will Go On” and “Livin' on a Prayer” both jump up for their last chorus. John Williams uses direct jumps in Star Wars too.", "Celine Dion", "Bon Jovi", "big finish", prog("G", "C", "D", "G", "A", "D", "E", "A")),
    ),
    practice(
      "Name it by ear",
      { kind: "choice", prompt: "Listen. Smooth pivot, or a direct jump?", options: ["Direct jump", "Smooth pivot"], answer: "Direct jump", sound: prog("C", "G", "C", "D", "A", "D"), miss: "It went straight from C to D with no shared chord: direct" },
    ),
    practice(
      "Play it on the guitar",
      { kind: "fretInterval", string: 5, fret: 3, semitones: 2, label: "A, the new tonic after a whole-step jump from G", hint: "The song is in G (low E string, fret 3). Jump the last chorus up a whole step: A at fret 5. Every chord shape moves up two frets." },
    ),
    practice(
      "Use it in real songs",
      { kind: "choice", prompt: "“Livin' on a Prayer” jumps to a higher key for its last chorus with no pivot chord. What kind of modulation is that?", options: ["Direct modulation", "Pivot-chord modulation", "Tonicization"], answer: "Direct modulation", miss: "A sudden jump with no shared chord: direct modulation" },
    ),
  ],
};
