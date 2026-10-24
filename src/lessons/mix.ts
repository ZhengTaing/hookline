import { intervalName, parseNote } from "../music";
import type { Lesson, RushQuestion, Sound, Step } from "./types";

// Adds the "learn it" steps to every lesson, between the intro cards and the timed round:
// a rule card with sounds to tap, an untimed identify set, a fretboard step, an ear check,
// and, where there's a good fit, labeling the chords of a real song.

/** The takeaway of each lesson, in the book's terms. */
const RULES: Record<string, string> = {
  "1.1": "Music uses seven letters, A to G, then starts again. Each fret is one half step up.",
  "1.4": "A sharp raises a note one fret, a flat lowers it one fret. E–F and B–C have nothing between them.",
  "2.1": "A half step is one fret. A whole step is two.",
  "2.2": "Every major scale follows W W H W W W H and uses each letter once.",
  "2.3": "Sharps come in the order F C G D A E B; flats in the reverse. The key signature names the key.",
  "3.1": "Natural minor lowers 3, 6 and 7. Harmonic minor raises 7 back up. Melodic minor raises 6 and 7 going up only.",
  "3.2": "Every major key shares its key signature with a minor key, a minor 3rd below: its relative minor.",
  "3.3": "Each scale degree has a name: tonic, supertonic, mediant, subdominant, dominant, submediant, leading tone.",
  "4.1": "The top number of a time signature counts beats in a bar. The bottom number says which note gets the beat.",
  "4.3": "A dot adds half the note's value. A tie joins two notes into one longer sound.",
  "4.4": "Simple meter splits each beat in two. Compound meter splits it in three.",
  "5.1": "Count letter names from the lower note to the upper one, including both. That's the interval's size.",
  "5.2": "Treat the lower note as the tonic. If the top note is in its major scale, the interval is major or perfect. A half step lower is minor.",
  "6.1": "Major = M3 + m3. Minor = m3 + M3. Diminished = two minor 3rds. Augmented = two major 3rds.",
  "6.2": "A letter alone is major. Add m for minor, ° for diminished, + for augmented.",
  "6.3": "The bass note decides the position. Root in the bass is root position, 3rd is 1st inversion, 5th is 2nd inversion.",
  "6.5": "A sus chord replaces the 3rd with a 2nd (sus2) or a 4th (sus4).",
  "7.1": "In major: I, IV and V are major; ii, iii and vi are minor; vii° is diminished.",
  "7.3": "In minor: i and iv are minor, III, VI and VII are major, ii° is diminished, and V borrows the raised 7th.",
  "7.4": "Authentic: V–I. Plagal: IV–I. Half: ends on V. Deceptive: V–vi.",
  "8.1": "maj7 = major triad + M7. 7 = major triad + m7. m7 = minor triad + m7. ø7 = dim triad + m7. °7 = dim triad + dim 7.",
  "8.3": "In major, I and IV are maj7, ii, iii and vi are m7, V is a dominant 7, and vii is ø7.",
  "9.1": "Roots falling by 5ths are the strongest progression: … vi – ii – V – I.",
  "9.4": "Tonic (I) is home, iii and vi prolong it, ii and IV are pre-dominant, V and vii° are dominant.",
  "9.7": "I – V – vi – IV is the best-seller. ♭VII and i – VII – VI – VII are rock and pop favorites.",
  "10.1": "Passing tones step through. Neighbors step away and back. Appoggiaturas leap in and step out. Escape tones step in and leap out.",
  "10.7": "Suspensions hold over and step down. Retardations step up. Anticipations arrive early. Pedal points hold still.",
  "11.1": "A motive is the smallest idea. Change it by inversion, retrograde, augmentation, interval change or extension.",
  "11.4": "Motive < subphrase (about 2 bars) < phrase (about 4 bars, ending with a cadence).",
  "12.1": "Verse–chorus is the modern default. AABA is the older 32-bar song form, with B as the bridge.",
  "12.4": "12-bar blues: I I I I · IV IV I I · V IV I I. Sections ending on I are closed, on V are open.",
  "13.1": "A perfect authentic cadence needs root-position V and I and the tonic on top. Anything else is imperfect.",
  "13.3": "A period is an antecedent (weaker ending) answered by a consequent (stronger ending).",
  "14.1": "Accompaniment can be chorale, arpeggiated, block chords, afterbeats, or a riff.",
  "14.6": "3–2 clave: three hits in the first bar, two in the second.",
  "15.1": "New sections feel new when you change an element: melody, harmony, rhythm, timbre, texture, articulation, dynamics or register.",
  "16.2": "Triads: root = nothing, 3rd in bass = 6, 5th = 6/4. Sevenths: 7, 6/5, 4/3, 4/2.",
  "16.3": "The cadential 6/4 (I6/4 – V) is really V with two notes resolving down.",
  "17.1": "A secondary dominant is the V of a chord other than I, like V/V. It brings a new sharp or natural.",
  "18.1": "A secondary diminished chord is the vii° of another chord: its root sits a half step below the target.",
  "19.1": "Borrowed chords come from the parallel minor: iv, ♭VI, ♭VII, ♭III and ii°.",
  "20.1": "The Neapolitan is a major chord on ♭2, usually in 1st inversion, leading to V.",
  "21.1": "Augmented sixth chords put ♭6 and ♯4 around the dominant. Italian adds 1, French adds 2, German adds ♭3.",
  "22.1": "Closely related keys differ by at most one sharp or flat. Major keys tend to move to V, minor keys to III.",
  "22.4": "A pivot chord belongs to both keys and opens the door between them.",
  "23.1": "Enharmonic pivots are spelled one way in the old key and another way in the new one, like V7 = Ger+6.",
  "24.1": "Binary is A B. Rounded binary brings back part of A. Ternary is A B A, with a full return.",
  "25.1": "Sonata: exposition, development, recapitulation. Rondo: a returning refrain, A B A C A B A.",
  "26.2": "Two voices can move in contrary, oblique, similar or parallel motion.",
  "26.3": "No parallel 5ths or octaves. Keep the upper voices within an octave. Double the root.",
  "27.1": "Leading tones rise. Chord 7ths fall. Augmented sixths spread out to the octave.",
  "30.1": "Species: 1:1, 2:1, 4:1, suspensions, then all mixed (florid).",
  "30.7": "A fugue opens with the subject, then the answer a 5th up, against a countersubject.",
  "31.1": "Jazz chords add 9ths, 11ths and 13ths. Altered dominants bend the 5th or 9th.",
  "31.8": "ii7 – V7 – Imaj7 is the core jazz progression. Dorian fits m7, Mixolydian fits 7.",
  "32.1": "Impressionists used whole-tone scales, planing, quartal chords and polychords for color.",
  "33.1": "Pitch classes are numbered C = 0 to B = 11. Tn adds n to each, wrapping around 12.",
  "34.1": "A twelve-tone row has four forms: prime, retrograde, inversion and retrograde inversion.",
  "35.1": "Minimalism grows music by adding notes (additive) or letting copies drift apart (phasing).",
};

const ROOTS: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

/** Parses a chord symbol like "C♯m", "Bb", "Am7", "Cmaj7" or "Bø7". */
function chordParts(symbol: string): { pc: number; root: string; shape: number[] } | null {
  const mm = /^([A-G])([♯#♭b]?)(maj7|m7|ø7|°7|m|°|\+|7)?$/.exec(symbol);
  if (!mm) return null;
  const pc = (ROOTS[mm[1]] + (mm[2] === "♯" || mm[2] === "#" ? 1 : mm[2] ? 11 : 0)) % 12;
  const shapes: Record<string, number[]> = {
    "": [0, 4, 7], m: [0, 3, 7], "°": [0, 3, 6], "+": [0, 4, 8],
    maj7: [0, 4, 7, 11], "7": [0, 4, 7, 10], m7: [0, 3, 7, 10], "ø7": [0, 3, 6, 10], "°7": [0, 3, 6, 9],
  };
  return { pc, root: mm[1] + (mm[2] ?? ""), shape: shapes[mm[3] ?? ""] };
}

function chordsSound(symbols: string[]): Sound {
  return {
    kind: "progression",
    gap: 0.9,
    chords: symbols.map((s) => {
      const c = chordParts(s)!;
      const root = 48 + c.pc - (c.pc > 6 ? 12 : 0);
      return [root - 12, ...c.shape.map((x) => root + x)];
    }),
  };
}

const MAJOR_RN = ["I", "ii", "iii", "IV", "V", "vi"];
const MINOR_RN = ["i", "ii°", "III", "iv", "V", "VI", "VII"];

interface Song {
  song: string;
  artist: string;
  key: string;
  chords: string[];
  answer: string[];
  options: string[];
}

/** Real songs to analyze. Chord progressions are well known; check them against the recordings. */
const SONGS: Record<string, Song> = {
  "6.1": { song: "Zombie", artist: "The Cranberries", key: "E minor", chords: ["Em", "C", "G", "D"], answer: ["Minor", "Major", "Major", "Major"], options: ["Major", "Minor", "Diminished", "Augmented"] },
  "7.1": { song: "Let It Be", artist: "The Beatles", key: "C major", chords: ["C", "G", "Am", "F"], answer: ["I", "V", "vi", "IV"], options: MAJOR_RN },
  "7.3": { song: "Zombie", artist: "The Cranberries", key: "E minor", chords: ["Em", "C", "G", "D"], answer: ["i", "VI", "III", "VII"], options: MINOR_RN },
  "7.4": { song: "Hallelujah", artist: "Leonard Cohen", key: "C major", chords: ["F", "G", "Am", "F"], answer: ["IV", "V", "vi", "IV"], options: MAJOR_RN },
  "8.3": { song: "Fly Me to the Moon", artist: "Frank Sinatra", key: "C major", chords: ["Am7", "Dm7", "G7", "Cmaj7"], answer: ["vi7", "ii7", "V7", "Imaj7"], options: ["Imaj7", "ii7", "iii7", "IVmaj7", "V7", "vi7"] },
  "9.1": { song: "I Will Survive", artist: "Gloria Gaynor", key: "A minor", chords: ["Am", "Dm", "G", "C"], answer: ["i", "iv", "VII", "III"], options: MINOR_RN },
  "9.7": { song: "Don't Stop Believin'", artist: "Journey", key: "E major", chords: ["E", "B", "C♯m", "A"], answer: ["I", "V", "vi", "IV"], options: MAJOR_RN },
  "12.4": { song: "Johnny B. Goode", artist: "Chuck Berry", key: "B♭ major (bars 1, 5, 9, 10)", chords: ["B♭", "E♭", "F", "E♭"], answer: ["I", "IV", "V", "IV"], options: ["I", "ii", "IV", "V", "vi"] },
  "17.1": { song: "Creep", artist: "Radiohead", key: "G major", chords: ["G", "B", "C"], answer: ["I", "V/vi", "IV"], options: ["I", "V/V", "V/vi", "IV", "V", "vi"] },
  "19.1": { song: "Creep", artist: "Radiohead", key: "G major", chords: ["G", "B", "C", "Cm"], answer: ["I", "V/vi", "IV", "iv"], options: ["I", "V/vi", "IV", "iv", "♭VI", "♭VII"] },
  "31.8": { song: "Autumn Leaves", artist: "jazz standard", key: "G major", chords: ["Am7", "D7", "Gmaj7", "Cmaj7"], answer: ["ii7", "V7", "Imaj7", "IVmaj7"], options: ["Imaj7", "ii7", "iii7", "IVmaj7", "V7", "vi7"] },
};

const SIZE_WORDS: Record<number, string> = { 1: "unison", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th", 6: "6th", 7: "7th", 8: "8ve" };

/** A staff interval question turned into a listening one. */
function staffToEar(q: Extract<RushQuestion, { kind: "staff" }>): RushQuestion {
  const named = q.options.some((o) => /^[PMm+°]/.test(o));
  const answer = named ? intervalName(q.lower, q.upper) : SIZE_WORDS[parseNote(q.upper).step - parseNote(q.lower).step + 1];
  return {
    kind: "choice",
    prompt: "Listen. Which interval is it?",
    options: q.options,
    answer,
    sound: { kind: "melodic", notes: [parseNote(q.lower).midi, parseNote(q.upper).midi], gap: 0.5 },
    miss: `By ear: that was a ${answer}`,
  };
}

/** Builds "find the root on the fretboard" questions from chord or note answers. */
function fretQuestions(questions: RushQuestion[]): RushQuestion[] {
  const found = questions.filter((q) => q.kind === "findNote" || q.kind === "fretInterval");
  if (found.length) return found.slice(0, 2);
  const out: RushQuestion[] = [];
  const seen = new Set<number>();
  for (const q of questions) {
    if (q.kind !== "choice") continue;
    const c = chordParts(q.answer);
    if (!c || seen.has(c.pc)) continue;
    seen.add(c.pc);
    const isNote = q.answer === c.root;
    out.push({
      kind: "findNote",
      pitchClass: c.pc,
      prompt: isNote ? `Find ${q.answer} on the neck` : `Find the root of ${q.answer} on the neck`,
    });
    if (out.length === 2) break;
  }
  return out;
}

/** Inserts the learn-it steps after the intro cards and duels, before the timed round. */
export function mixLesson(lesson: Lesson): Lesson {
  const rush = lesson.steps.find((s): s is Extract<Step, { type: "rush" }> => s.type === "rush");
  const questions = rush?.questions ?? [];
  const story = lesson.steps.find((s): s is Extract<Step, { type: "story" }> => s.type === "story");
  const extra: Step[] = [];

  const chips = (story?.cards ?? [])
    .filter((c) => c.left && c.right && !c.right.includes("?") && c.sound.kind !== "none")
    .slice(0, 6)
    .map((c) => ({ label: `${c.label ? `${c.label} · ` : ""}${c.left}–${c.right}`, sound: c.sound }));
  if (RULES[lesson.id]) extra.push({ type: "rule", title: "The rule", rule: RULES[lesson.id], chips });

  const visual = questions.filter((q) => q.kind === "staff" || (q.kind === "choice" && q.visual));
  const identify = (visual.length ? visual : questions.filter((q) => q.kind === "choice")).slice(0, 3);
  if (identify.length) extra.push({ type: "practice", title: visual.length ? "Identify" : "Check", questions: identify });

  const build = fretQuestions(questions);
  if (build.length) extra.push({ type: "practice", title: "On the guitar", questions: build });

  const ear = questions
    .filter((q) => !identify.includes(q))
    .flatMap((q): RushQuestion[] => {
      if (q.kind === "staff") return [staffToEar(q)];
      const listenable = q.kind === "choice" && q.sound && q.sound.kind !== "none" && (q.visual || /^Listen|quality/.test(q.prompt));
      if (q.kind === "choice" && listenable) {
        const { visual: _visual, ...rest } = q;
        return [{ ...rest, prompt: q.prompt.startsWith("Listen") ? q.prompt : `Listen. ${q.prompt}` }];
      }
      return [];
    })
    .slice(0, 2);
  if (ear.length) extra.push({ type: "practice", title: "Ear check", questions: ear });

  const song = SONGS[lesson.id];
  if (song) extra.push({ type: "realSong", ...song, sound: chordsSound(song.chords) });

  const introEnd = lesson.steps.findIndex((s) => s.type !== "story" && s.type !== "duel");
  const at = introEnd < 0 ? lesson.steps.length : introEnd;
  return { ...lesson, steps: [...lesson.steps.slice(0, at), ...extra, ...lesson.steps.slice(at)] };
}

export const MIX_DATA = { RULES, SONGS, chordParts };
