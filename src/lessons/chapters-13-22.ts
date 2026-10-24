import { parseNote } from "../music";
import type { RushQuestion, Sound, Unit } from "./types";

// Chapters 13-22 of Hutchinson, "Music Theory for the 21st-Century Classroom":
// phrases in combination, accompaniment and contrast, figured bass, secondary chords,
// mode mixture, the Neapolitan, augmented sixth chords, and modulation.

/** MIDI numbers for space-separated note names, e.g. "C3 E3 G3 C4". */
const m = (names: string) => names.split(" ").map((n) => parseNote(n).midi);

const prog = (chords: string[], gap = 0.85): Sound => ({ kind: "progression", chords: chords.map(m), gap });

function choice(prompt: string, answer: string, wrong: string[], miss: string, extra: Partial<Extract<RushQuestion, { kind: "choice" }>> = {}): RushQuestion {
  return { kind: "choice", prompt, options: [answer, ...wrong], answer, miss, ...extra };
}

// Chords in C major, voiced for the synth.
const C = "C3 E3 G3 C4";
const F = "F2 F3 A3 C4";
const G = "G2 G3 B3 D4";
const G7 = "G2 F3 B3 D4";
const Am = "A2 E3 A3 C4";
const Dm = "D3 F3 A3 D4";

export const CHAPTERS_13_22: Unit[] = [
  {
    id: "phrase-pairs",
    title: "Phrases in combination",
    chapter: "Chapter 13",
    summary: "Strong and weak endings, and phrases that ask and answer",
    lessons: [
      {
        id: "13.1",
        section: "13.1",
        title: "Perfect and imperfect endings",
        summary: "Not every V–I is a full stop",
        steps: [
          {
            type: "story",
            cards: [
              { text: "A perfect authentic cadence (PAC) is the strongest ending there is.", left: "V", right: "I", label: "PAC", sound: prog([G, "C3 E3 G3 C4 C5"]) },
              { text: "It needs three things: V then I, both with the root in the bass, and the melody landing on the tonic.", left: "G", right: "C", label: "melody → C", sound: prog(["G2 G3 B3 D4 D5", "C3 E3 G3 C4 C5"]) },
              { text: "Miss any one and it's imperfect (IAC). Here the melody lands on E. It sounds less final.", left: "melody", right: "E", label: "IAC", sound: prog(["G2 G3 B3 D4 D5", "C3 C4 G4 E5"]) },
              { text: "Endings on I are conclusive. Half cadences and deceptive cadences are not.", left: "I", right: "V", label: "closed · open", sound: prog([C, F, G]) },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Practice 13.9",
            questions: [
              choice("Listen. Perfect or imperfect?", "Perfect (PAC)", ["Imperfect (IAC)"], "The melody landed on the tonic over root-position V–I", { sound: prog(["F2 A3 C4 F4", "G2 G3 B3 D4 D5", "C3 E3 G3 C4 C5"]) }),
              choice("Listen. Perfect or imperfect?", "Imperfect (IAC)", ["Perfect (PAC)"], "The melody ended on the 3rd, so it's imperfect", { sound: prog(["F2 A3 C4 F4", "G2 G3 B3 D4 B4", "C3 C4 G4 E5"]) }),
              choice("V6 – I with tonic on top is a…", "IAC", ["PAC", "Half cadence"], "V6 is inverted, so it can't be perfect"),
              choice("Which ending is the most conclusive?", "PAC", ["IAC", "Half cadence", "Deceptive cadence"], "PAC is the strongest"),
              choice("Which cadences are inconclusive?", "Half and deceptive", ["Perfect and plagal", "Only plagal"], "They don't end on I"),
              choice("vii° – I with tonic on top is a…", "IAC", ["PAC", "Plagal"], "Using vii° instead of V makes it imperfect"),
            ],
          },
        ],
      },
      {
        id: "13.3",
        section: "13.2–13.8",
        title: "Question and answer",
        summary: "Sentences, periods, and phrases that overlap",
        steps: [
          {
            type: "story",
            cards: [
              { text: "A period is two phrases: a question, then an answer.", left: "question", right: "answer", label: "→", sound: prog([C, F, G, G, C, F, G7, C], 0.5) },
              { text: "The question (antecedent) ends weak, often on V. The answer (consequent) ends strong, on I.", left: "HC", right: "PAC", label: "→", sound: prog([C, G, G7, C], 0.7) },
              { text: "Parallel period: both phrases start the same way. Contrasting: they start differently.", left: "a … ", right: "a …", label: "parallel", sound: { kind: "melodic", notes: m("E4 D4 C4 D4 E4 E4 D4 E4 D4 C4 D4 E4 C4 C4"), gap: 0.24 } },
              { text: "A sentence: say an idea, say it again (or one step up), then run on to the cadence.", left: "idea idea", right: "→ cadence", label: "1 + 1 + 2", sound: { kind: "melodic", notes: m("C4 E4 G4 D4 F4 A4 G4 F4 E4 D4 C4"), gap: 0.24 } },
              { text: "Double period: four phrases. Elision: one phrase's last bar is the next one's first.", sound: prog([C, G, C, C, F, G7, C], 0.45) },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Practice 13.9",
            questions: [
              choice("The first phrase of a period is the…", "Antecedent", ["Consequent", "Coda"], "Antecedent asks, consequent answers"),
              choice("The consequent phrase ends with a…", "Stronger cadence", ["Weaker cadence", "Key change"], "The answer ends more conclusively"),
              choice("Both phrases begin with the same melody. That's a…", "Parallel period", ["Contrasting period", "Sentence"], "Same start = parallel"),
              choice("Idea, repeat it, then run to the cadence. That's a…", "Sentence", ["Period", "Double period"], "That's the sentence"),
              choice("A double period has at least…", "4 phrases", ["2 phrases", "3 phrases"], "Two groups of two phrases"),
              choice("When the last bar of one phrase is the first of the next, it's an…", "Elision", ["Extension", "Anticipation"], "Overlapping phrases: elision"),
              choice("A common antecedent ending is…", "Half cadence", ["PAC", "Picardy third"], "The question often stops on V"),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "texture",
    title: "Accompaniment and contrast",
    chapter: "Chapters 14–15",
    summary: "How to play behind a melody, and how to make a new section feel new",
    lessons: [
      {
        id: "14.1",
        section: "14.1–14.5, 14.7",
        title: "Accompaniment patterns",
        summary: "Arpeggios, block chords, afterbeats and riffs",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Texture is how many notes sound at once, and how busy the rhythm is.", sound: prog(["C3 E4 G4 C5 E5"], 1) },
              { text: "Chorale: block chords that move together, one per beat. Like a hymn.", left: "♩ ♩", right: "♩ ♩", label: "chorale", sound: prog([C, F, G, C], 0.6) },
              { text: "Arpeggiated: the chord is played one note at a time. Fingerpicking does this.", left: "C", right: "G E G", label: "arpeggio", sound: { kind: "melodic", notes: m("C3 G3 E4 G3 C3 G3 E4 G3"), gap: 0.18 } },
              { text: "Afterbeats: bass on the beat, chord right after. Think oom-pah, or reggae's skank.", left: "oom", right: "pah", label: "afterbeat", sound: prog(["C2", "E3 G3 C4", "G2", "E3 G3 C4", "C2", "E3 G3 C4", "G2", "E3 G3 C4"], 0.25) },
              { text: "A riff is a short repeated pattern, often in the bass. Sometimes it IS the song.", sound: { kind: "melodic", notes: m("E2 G2 A2 E2 G2 Bb2 A2 E2 G2 A2 G2 E2"), gap: 0.2 } },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Section 14.2–14.7",
            questions: [
              choice("Listen. What kind of accompaniment?", "Arpeggiated", ["Block chords", "Afterbeats"], "One chord note at a time: arpeggiated", { sound: { kind: "melodic", notes: m("C3 G3 E4 G3 F2 C4 A3 C4"), gap: 0.18 } }),
              choice("Listen. What kind of accompaniment?", "Afterbeats", ["Arpeggiated", "Block chords"], "Bass on the beat, chord after it: afterbeats", { sound: prog(["C2", "E3 G3 C4", "G2", "E3 G3 C4", "F2", "F3 A3 C4", "C2", "F3 A3 C4"], 0.25) }),
              choice("Listen. What kind of accompaniment?", "Block chords", ["Arpeggiated", "Afterbeats"], "Whole chords struck together: block chords", { sound: prog([C, C, F, F, G, G, C, C], 0.3) }),
              choice("A short repeated pattern in the bass is a…", "Riff", ["Pedal point", "Cadence"], "That's a riff"),
              choice("Fingerpicking a chord one string at a time is…", "Arpeggiated", ["Chorale", "Afterbeats"], "Broken chord = arpeggio"),
              choice("Texture's vertical side is…", "How many notes at once", ["How fast the notes move", "How loud it is"], "Vertical = notes stacked at once; horizontal = rhythm"),
            ],
          },
        ],
      },
      {
        id: "14.6",
        section: "14.6",
        title: "The clave",
        summary: "Tap the 3–2 rhythm",
        steps: [
          {
            type: "story",
            cards: [
              { text: "The clave is a two-bar rhythm at the heart of Afro-Cuban music.", sound: { kind: "progression", chords: [[81], [], [], [81], [], [], [81], [], [], [], [81], [], [81], [], [], []], gap: 0.17 } },
              { text: "3–2 clave: three hits in bar one, two in bar two.", left: "x . . x . . x .", right: ". . x . x . . .", label: "3 | 2", sound: { kind: "progression", chords: [[81], [], [], [81], [], [], [81], [], [], [], [81], [], [81], [], [], []], gap: 0.17 } },
              { text: "Flip it and you get 2–3 clave. The '3' side's 3-3-2 feel shows up all over pop.", left: "2", right: "3", label: "flip", sound: { kind: "progression", chords: [[], [], [81], [], [81], [], [], [], [81], [], [], [81], [], [], [81], []], gap: 0.17 } },
            ],
          },
          {
            type: "tapBeat",
            bpm: 90,
            beatsPerBar: 4,
            bars: 2,
            title: "Tap the 3–2 clave",
            pattern: [0, 3, 6, 10, 12],
            hint: "After 4 count-in clicks, tap with the woodblock: three hits, then two.",
          },
          {
            type: "rush",
            seconds: 30,
            source: "Section 14.6",
            questions: [
              choice("3–2 clave has how many hits in the first bar?", "3", ["2", "4"], "3 then 2"),
              choice("The clave comes from…", "Afro-Cuban music", ["Baroque organ music", "Barbershop"], "It's essential to Afro-Cuban music"),
              choice("3–2 clave, flipped, is…", "2–3 clave", ["4–4 clave", "3–3 clave"], "Swap the bars: 2–3"),
            ],
          },
        ],
      },
      {
        id: "15.1",
        section: "15.1–15.3",
        title: "Making sections contrast",
        summary: "Change an element and the new part feels new",
        steps: [
          {
            type: "story",
            cards: [
              { text: "A chorus or bridge feels new because something changed. The book lists the 'elements of music'.", sound: { kind: "melodic", notes: m("E4 D4 C4 D4 E4 E4 E4"), gap: 0.25 } },
              { text: "Register: same tune, higher or lower.", left: "low", right: "high", label: "register", sound: { kind: "melodic", notes: m("E3 D3 C3 D3 E3 E5 D5 C5 D5 E5"), gap: 0.22 } },
              { text: "Harmony: switch major to minor, or change key.", left: "C", right: "Cm", label: "harmony", sound: prog([C, "C3 Eb3 G3 C4"], 1) },
              { text: "Rhythm: change the most common note value. Texture: more or fewer parts.", left: "♩", right: "♬", label: "rhythm", sound: { kind: "melodic", notes: m("C4 C4 G4 G4 A4 A4 G4"), gap: 0.18 } },
              { text: "Also: timbre (which instrument), articulation (short or smooth), and dynamics (loud or soft).", sound: { kind: "none" } },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Section 15.1",
            questions: [
              choice("Loud versus soft is…", "Dynamics", ["Register", "Timbre"], "Volume is dynamics"),
              choice("Short, clipped notes versus smooth ones is…", "Articulation", ["Dynamics", "Texture"], "Staccato vs legato is articulation"),
              choice("High versus low is…", "Register", ["Dynamics", "Harmony"], "Where it sits is register"),
              choice("Guitar versus piano playing the same note: the difference is…", "Timbre", ["Register", "Rhythm"], "Tone color is timbre"),
              choice("Listen. What changed the second time?", "Harmony", ["Register", "Rhythm"], "Major turned minor", { sound: prog([C, F, G, C, "C3 Eb3 G3 C4", "F2 F3 Ab3 C4", G, "C3 Eb3 G3 C4"], 0.45) }),
              choice("Listen. What changed the second time?", "Register", ["Harmony", "Rhythm"], "Same tune, an octave higher", { sound: { kind: "melodic", notes: m("G3 E3 C3 E3 G3 G4 E4 C4 E4 G4"), gap: 0.24 } }),
              choice("Adding a drummer and bass for the chorus changes the…", "Texture", ["Key", "Register"], "More parts = thicker texture"),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "figured-bass",
    title: "Figured bass",
    chapter: "Chapter 16",
    summary: "Numbers that say which note is in the bass",
    lessons: [
      {
        id: "16.2",
        section: "16.1–16.2",
        title: "Inversion symbols",
        summary: "6, 6/4, 6/5, 4/3, 4/2",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Baroque players read a bass line with numbers under it and filled in the chords. Theory kept the numbers.", sound: prog([C, "E2 G3 C4", F, G, C], 0.6) },
              { text: "Triads. Root in bass: no number. 3rd in bass: 6. 5th in bass: 6/4.", left: "I6", right: "I6/4", label: "E · G bass", sound: prog(["C3 E3 G3 C4", "E2 G3 C4 E4", "G2 C4 E4 G4"], 0.8) },
              { text: "Seventh chords. Root: 7. 3rd: 6/5. 5th: 4/3. 7th: 4/2.", left: "V7", right: "V4/2", label: "→", sound: prog(["G2 F3 B3 D4", "B2 F3 G3 D4", "D3 F3 G3 B3", "F2 G3 B3 D4"], 0.8) },
              { text: "Slash chords say the same thing: G7/B is V6/5, C/E is I6.", left: "C/E", right: "I6", label: "=", sound: prog(["E2 G3 C4 E4"], 1) },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Practice 16.6",
            questions: [
              choice("A triad with its 3rd in the bass is labeled…", "6", ["6/4", "4/3"], "3rd in bass: 6"),
              choice("A triad with its 5th in the bass is labeled…", "6/4", ["6", "6/5"], "5th in bass: 6/4"),
              choice("A seventh chord with its 3rd in the bass is labeled…", "6/5", ["4/3", "4/2"], "3rd in bass: 6/5"),
              choice("A seventh chord with its 7th in the bass is labeled…", "4/2", ["6/5", "4/3"], "7th in bass: 4/2"),
              choice("C/E in C major is…", "I6", ["I6/4", "iii"], "E is the 3rd of C: I6"),
              choice("G7/B in C major is…", "V6/5", ["V4/3", "vii°"], "B is the 3rd of G7: V6/5"),
              choice("G7/D in C major is…", "V4/3", ["V6/5", "V4/2"], "D is the 5th of G7: V4/3"),
              choice("F/C in C major is…", "IV6/4", ["IV6", "I"], "C is the 5th of F: IV6/4"),
            ],
          },
        ],
      },
      {
        id: "16.3",
        section: "16.3–16.4",
        title: "The cadential six-four",
        summary: "I6/4 that's really V in disguise",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Six-four chords are unstable, so they show up in a few set patterns.", sound: prog(["G2 C4 E4 G4"], 1.2) },
              { text: "Cadential 6/4: I6/4 → V → I. The bass sits on 5 the whole time V arrives.", left: "I6/4", right: "V", label: "→", sound: prog(["F2 F3 A3 C4", "G2 G3 C4 E4", "G2 G3 B3 D4", "C3 G3 C4 E4"], 0.8) },
              { text: "It works like V with two suspensions on top that resolve down.", left: "C E", right: "B D", label: "↓", sound: prog(["G2 G3 C4 E4", "G2 G3 B3 D4"], 1) },
              { text: "Others: a passing 6/4 between two chords, a pedal 6/4 over a held bass, and an arpeggiated one where the bass walks the chord.", sound: prog(["C3 E3 G3 C4", "D3 F3 G3 B3", "E3 E3 G3 C4"], 0.7) },
            ],
          },
          {
            type: "rush",
            seconds: 45,
            source: "Practice 16.6",
            questions: [
              choice("The cadential 6/4 usually goes to…", "V", ["IV", "vi"], "I6/4 → V → I"),
              choice("In the cadential 6/4, the bass note is…", "Scale degree 5", ["Scale degree 1", "Scale degree 3"], "The bass is on 5 under both chords"),
              choice("The cadential 6/4 acts like a…", "V chord with suspensions", ["Tonic chord", "Pre-dominant chord"], "It's V with a 6–5 and 4–3 above"),
              choice("A 6/4 over a held bass note is a…", "Pedal 6/4", ["Cadential 6/4", "Passing 6/4"], "Held bass = pedal"),
              choice("Listen. What follows the 6/4?", "V", ["IV", "I in root position"], "Cadential 6/4 resolves to V", { sound: prog(["D3 F3 A3 D4", "G2 G3 C4 E4", "G2 G3 B3 D4"], 0.9) }),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "secondary-chords",
    title: "Secondary chords",
    chapter: "Chapters 17–18",
    summary: "Borrowing the V of another chord",
    lessons: [
      {
        id: "17.1",
        section: "17.1–17.6",
        title: "Secondary dominants",
        summary: "V/V, V/vi and friends",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Any major or minor chord can get its own V for a moment. That's a secondary dominant.", sound: prog([C, "D3 F#3 A3 D4", G, C]) },
              { text: "V/V ('five of five'): in C, G is V, and the V of G is D. So D major sneaks in.", left: "D", right: "G", label: "V/V → V", sound: prog(["D3 F#3 A3 C4", G]) },
              { text: "V/vi: E major leads to Am. The G♯ gives it away.", left: "E", right: "Am", label: "V/vi → vi", sound: prog(["E2 G#3 B3 E4", Am]) },
              { text: "V7/IV: add B♭ to C and it wants to go to F.", left: "C7", right: "F", label: "V7/IV → IV", sound: prog(["C3 E3 Bb3 C4", F]) },
              { text: "A short visit like this is tonicization. The key doesn't really change.", sound: prog([C, "A2 C#3 E3 A3", Dm, G7, C], 0.7) },
            ],
          },
          {
            type: "rush",
            seconds: 75,
            source: "Practice 17.7",
            questions: [
              choice("In C major, V/V is…", "D", ["G", "A"], "V of G is D"),
              choice("In C major, V/vi is…", "E", ["Am", "G"], "V of Am is E"),
              choice("In C major, V/ii is…", "A", ["D", "E"], "V of Dm is A"),
              choice("In C major, V7/IV is…", "C7", ["F7", "G7"], "V7 of F is C7"),
              choice("In G major, V/V is…", "A", ["D", "E"], "V of D is A"),
              choice("In D major, V/vi is…", "F♯", ["Bm", "A"], "V of Bm is F♯"),
              choice("A brief visit to another chord's key is…", "Tonicization", ["Modulation", "Elision"], "Short stay = tonicization"),
              choice("Listen. What chord comes right before G?", "V/V", ["ii", "IV"], "D major with F♯: V/V", { sound: prog([C, "D3 F#3 A3 C4", G]) }),
            ],
          },
        ],
      },
      {
        id: "18.1",
        section: "18.1–18.4",
        title: "Secondary diminished chords",
        summary: "vii°7 of another chord",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Instead of V of a chord, you can use its vii°: a diminished chord a half step below.", sound: prog([C, "F#3 A3 C4 Eb4", G]) },
              { text: "vii°7/V in C: F♯ A C E♭, then G. Every note squeezes toward G.", left: "F♯°7", right: "G", label: "½ step up", sound: prog(["F#3 A3 C4 Eb4", "G3 B3 D4"]) },
              { text: "vii°/vi: G♯° leading into Am.", left: "G♯°", right: "Am", label: "→", sound: prog(["G#3 B3 D4", "A3 C4 E4"]) },
              { text: "Find the target: the root of a secondary diminished chord is a half step under it.", left: "C♯°", right: "Dm", label: "→ ii", sound: prog(["C#3 E3 G3 Bb3", "D3 F3 A3 D4"]) },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Practice 18.5",
            questions: [
              choice("In C major, vii°7/V is…", "F♯°7", ["B°7", "G♯°7"], "A half step below G: F♯°7"),
              choice("In C major, vii°/vi is…", "G♯°", ["F♯°", "C♯°"], "A half step below A: G♯°"),
              choice("In C major, vii°/ii is…", "C♯°", ["B°", "D♯°"], "A half step below D: C♯°"),
              choice("C♯°7 in C major leads to…", "Dm", ["C", "G"], "C♯ is a half step under D"),
              choice("In G major, vii°7/V is…", "C♯°7", ["F♯°7", "D♯°7"], "V in G is D; a half step below is C♯"),
              choice("The root of a secondary diminished chord is…", "A half step below its target", ["A 5th above its target", "The same as its target"], "Like a leading tone to the target"),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "chromatic-chords",
    title: "Borrowed and chromatic chords",
    chapter: "Chapters 19–21",
    summary: "Minor-key colors in a major key, the Neapolitan, and augmented sixths",
    lessons: [
      {
        id: "19.1",
        section: "19.1–19.5",
        title: "Borrowed chords",
        summary: "iv, ♭VI, ♭VII from the parallel minor",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Mode mixture: a major-key song borrows chords from its parallel minor (C major borrows from C minor).", sound: prog([C, F, "F2 F3 Ab3 C4", C]) },
              { text: "The minor iv. Fm in C major. That bittersweet move from IV to iv is everywhere.", left: "IV", right: "iv", label: "F → Fm", sound: prog([F, "F2 F3 Ab3 C4", C], 1) },
              { text: "♭VI and ♭VII: A♭ and B♭ in C. Big, cinematic, very rock.", left: "A♭", right: "B♭", label: "♭VI ♭VII", sound: prog(["Ab2 Ab3 C4 Eb4", "Bb2 Bb3 D4 F4", "C3 G3 C4 E4"], 0.8) },
              { text: "Deceptive cadence with ♭VI: V goes to A♭ instead of C. A bigger surprise.", left: "V", right: "♭VI", label: "→", sound: prog([G7, "Ab2 Ab3 C4 Eb4"], 1) },
              { text: "The Picardy third: a minor-key piece ends on a major I. Sunshine at the last second.", left: "Cm", right: "C", label: "Picardy", sound: prog(["C3 Eb3 G3 C4", "G2 G3 B3 D4", "C3 E3 G3 C4"], 0.9) },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Practice 19.6",
            questions: [
              choice("Borrowed chords come from the…", "Parallel minor", ["Relative minor", "Dominant key"], "Same tonic, minor mode: C minor for C major"),
              choice("In C major, the borrowed iv is…", "Fm", ["F", "Dm"], "iv from C minor is Fm"),
              choice("In C major, ♭VI is…", "A♭", ["Am", "A"], "♭VI lowers A to A♭"),
              choice("In G major, ♭VII is…", "F", ["F♯°", "E"], "♭VII in G is F"),
              choice("In D major, the borrowed iv is…", "Gm", ["G", "Em"], "iv from D minor is Gm"),
              choice("Listen. What happened to the IV?", "It turned minor", ["It went up a step", "Nothing"], "IV → iv, borrowed from minor", { sound: prog([C, F, "F2 F3 Ab3 C4", C]) }),
              choice("A minor-key piece ending on a major I has a…", "Picardy third", ["Neapolitan", "Deceptive cadence"], "That's the Picardy third"),
            ],
          },
        ],
      },
      {
        id: "20.1",
        section: "20.1–20.2",
        title: "The Neapolitan chord",
        summary: "♭II, the dramatic pre-dominant",
        steps: [
          {
            type: "story",
            cards: [
              { text: "The Neapolitan is a major chord built on the lowered 2nd degree: ♭II.", left: "D♭", right: "in C", label: "♭II", sound: prog(["Db3 F3 Ab3 Db4"], 1.2) },
              { text: "It's usually in first inversion (N6), with the 4th degree in the bass.", left: "N6", right: "F bass", label: "=", sound: prog(["F2 Ab3 Db4 F4"], 1.2) },
              { text: "It's a pre-dominant: N6 → V → i. Mostly in minor keys, and very dramatic.", left: "N6", right: "V", label: "→", sound: prog(["A2 A3 C4 E4", "D3 F3 Bb3 D4", "E2 G#3 B3 E4", "A2 A3 C4 E4"], 0.9) },
              { text: "The ♭2 usually falls to the leading tone: B♭ down to G♯ in A minor.", left: "B♭", right: "G♯", label: "↓", sound: { kind: "melodic", notes: m("Bb4 G#4 A4"), gap: 0.5 } },
            ],
          },
          {
            type: "rush",
            seconds: 45,
            source: "Practice 20.3",
            questions: [
              choice("The Neapolitan is built on…", "The lowered 2nd degree", ["The raised 4th degree", "The 5th degree"], "♭2"),
              choice("In A minor, the Neapolitan is…", "B♭", ["B°", "B"], "♭II in A minor is B♭ major"),
              choice("In C minor, the Neapolitan is…", "D♭", ["D°", "D"], "♭II in C is D♭ major"),
              choice("The Neapolitan usually appears in…", "1st inversion", ["Root position", "2nd inversion"], "N6 is the usual form"),
              choice("The Neapolitan's job is…", "Pre-dominant", ["Tonic", "Dominant"], "It leads to V"),
              choice("Listen. What's the dramatic chord before V?", "Neapolitan", ["iv", "Secondary dominant"], "B♭ in A minor: ♭II", { sound: prog(["A2 A3 C4 E4", "D3 F3 Bb3 D4", "E2 G#3 B3 E4", "A2 A3 C4 E4"], 0.8) }),
            ],
          },
        ],
      },
      {
        id: "21.1",
        section: "21.1–21.7",
        title: "Augmented sixth chords",
        summary: "Italian, French, German",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Augmented sixth chords squeeze outward onto the dominant. ♭6 falls, ♯4 rises, both land on 5.", left: "A♭ F♯", right: "G G", label: "→", sound: prog(["Ab2 C4 F#4", "G2 B3 G4"], 1) },
              { text: "Italian (It+6): ♭6, 1, ♯4. In C: A♭ C F♯.", left: "It+6", right: "A♭ C F♯", label: "=", sound: prog(["Ab2 C4 F#4", "G2 B3 D4 G4"], 1) },
              { text: "French (Fr+6): add 2. In C: A♭ C D F♯. Sounds whole-tone and spooky.", left: "Fr+6", right: "+ D", label: "=", sound: prog(["Ab2 C4 D4 F#4", "G2 B3 D4 G4"], 1) },
              { text: "German (Ger+6): add ♭3. In C: A♭ C E♭ F♯. Sounds exactly like A♭7.", left: "Ger+6", right: "+ E♭", label: "=", sound: prog(["Ab2 C4 Eb4 F#4", "G2 C4 E4 G4", "G2 B3 D4 G4"], 1) },
              { text: "On a lead sheet, a German sixth just looks like A♭7 going to G. Same sound, different spelling.", sound: prog(["Ab2 C4 Eb4 Gb4", "G2 B3 D4 G4"], 1) },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Practice 21.8",
            questions: [
              choice("Every augmented sixth chord has…", "♭6 and ♯4", ["♭2 and 5", "♭7 and 3"], "♭6 and ♯4 make the augmented 6th"),
              choice("The Italian sixth adds…", "1", ["2", "♭3"], "It+6 = ♭6, 1, ♯4"),
              choice("The French sixth adds…", "2", ["1", "♭3"], "Fr+6 adds scale degree 2"),
              choice("The German sixth adds…", "♭3", ["2", "5"], "Ger+6 adds ♭3"),
              choice("Augmented sixth chords usually resolve to…", "V", ["IV", "ii"], "They squeeze out to 5 (or to I6/4 then V)"),
              choice("In C major, the German sixth sounds like…", "A♭7", ["G7", "D7"], "A♭ C E♭ F♯ = A♭ C E♭ G♭"),
              choice("In C major, the Italian sixth is…", "A♭ C F♯", ["A♭ C E♭ F♯", "G B D F"], "♭6, 1, ♯4"),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "modulation",
    title: "Changing key",
    chapter: "Chapter 22",
    summary: "Moving to a new home, and the chords that get you there",
    lessons: [
      {
        id: "22.1",
        section: "22.1–22.3",
        title: "Modulation and related keys",
        summary: "Where songs like to move",
        steps: [
          {
            type: "story",
            cards: [
              { text: "Modulation is a real key change: a new home, confirmed by a cadence in the new key.", sound: prog([C, Am, "D3 F#3 A3 C4", G, "D3 F#3 A3 D4", G], 0.7) },
              { text: "Tonicization is a quick visit. Modulation is moving in.", left: "visit", right: "move", label: "vs", sound: prog([C, "D3 F#3 A3 C4", G, C], 0.7) },
              { text: "Closely related keys differ by one sharp or flat at most. C major has five: G, F, Am, Em, Dm.", left: "C", right: "G F Am Em Dm", label: "close", sound: prog([C, G, F, Am], 0.6) },
              { text: "Most common moves: major keys go to the dominant (C → G). Minor keys go to the relative major (Am → C).", left: "C → G", right: "Am → C", label: "usual", sound: prog([Am, "E2 G#3 B3 E4", Am, G, C], 0.6) },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Practice 22.8",
            questions: [
              choice("Which key is closely related to C major?", "E minor", ["D major", "E♭ major", "B♭ major"], "Em has 1 sharp, close to C's none"),
              choice("Which key is NOT closely related to G major?", "A major", ["D major", "E minor", "C major"], "A major has 3 sharps, two more than G"),
              choice("A major key most often modulates to…", "Its dominant", ["Its parallel minor", "A half step up"], "C → G is the classic move"),
              choice("A minor key most often modulates to…", "Its relative major", ["Its dominant minor", "A tritone away"], "Am → C"),
              choice("A short visit to another key's V is…", "Tonicization", ["Modulation", "Mode mixture"], "Brief = tonicization"),
              choice("How many closely related keys does every key have?", "5", ["2", "7"], "Relative, dominant + its relative, subdominant + its relative"),
              choice("A modulation is confirmed by…", "A cadence in the new key", ["One accidental", "A pedal point"], "The new key needs its own cadence"),
            ],
          },
        ],
      },
      {
        id: "22.4",
        section: "22.4–22.7",
        title: "Pivot chords",
        summary: "One chord that belongs to both keys",
        steps: [
          {
            type: "story",
            cards: [
              { text: "A pivot chord is in both keys. It's the door between them.", left: "Am", right: "vi = ii", label: "C → G", sound: prog([C, F, Am, "D3 F#3 A3 C4", G], 0.75) },
              { text: "Am is vi in C and ii in G. Play it, then D7 pulls you into G.", left: "vi in C", right: "ii in G", label: "pivot", sound: prog([Am, "D3 F#3 A3 C4", G], 0.9) },
              { text: "Spot the new key from new accidentals (F♯ → G major) and a cadence that lands there.", sound: prog([G, "D3 F#3 A3 C4", G], 0.9) },
              { text: "No pivot? Pop often just jumps: the truck-driver key change, up a step for the last chorus.", left: "C", right: "D", label: "+1 step", sound: prog([C, G, C, "D3 F#3 A3 D4", "A2 A3 C#4 E4", "D3 F#3 A3 D4"], 0.55) },
            ],
          },
          {
            type: "rush",
            seconds: 60,
            source: "Practice 22.8",
            questions: [
              choice("C to G: which chord could pivot?", "Am", ["F", "B♭"], "Am is vi in C and ii in G"),
              choice("C to G: which chord could NOT pivot?", "F", ["Am", "Em", "C"], "F isn't in G major (it has F♯)"),
              choice("Em is iii in C. In G, it's…", "vi", ["ii", "iii"], "E is the 6th degree of G"),
              choice("A new F♯ in a C major song suggests a move to…", "G major", ["F major", "D minor"], "F♯ is G major's one sharp"),
              choice("A new B♭ in a C major song suggests a move to…", "F major", ["G major", "E minor"], "B♭ is F major's one flat"),
              choice("Listen. Did it change key?", "Yes, to G", ["No, still C"], "Am – D7 – G, then cadence in G", { sound: prog([C, Am, "D3 F#3 A3 C4", G, "D3 F#3 A3 C4", G], 0.6) }),
              choice("A sudden jump up a step for the last chorus has…", "No pivot chord", ["A Neapolitan", "A cadential 6/4"], "Direct modulation, no pivot"),
            ],
          },
        ],
      },
    ],
  },
];
