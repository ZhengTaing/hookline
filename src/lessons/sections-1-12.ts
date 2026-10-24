import type { BookChapter } from "./sections";

// Read-and-hear summaries of every section in chapters 1-12 of Hutchinson,
// "Music Theory for the 21st-Century Classroom" (GFDL 1.2). Examples use the
// format "label=notes": "~C4 E4" plays one note after another, "C3 E3 G3" plays
// a chord, and "|" separates chords in a progression.

export const CHAPTERS_1_12: BookChapter[] = [
  {
    n: 1,
    title: "Pitch and its notation",
    sections: [
      { id: "1.1", title: "Pitch", headline: "Higher keys, higher notes", text: "Pitch is how high or low a note sounds. On a piano, notes rise as you move right; on guitar, each fret up raises the pitch.", ex: ["low to high=~C3 G3 C4 G4 C5"] },
      { id: "1.2", title: "Notation", headline: "Five lines, letters A to G", text: "Notes sit on the five lines and four spaces of the staff. The treble clef's lines are E G B D F, and its spaces spell F A C E.", ex: ["lines E G B D F=~E4 G4 B4 D5 F5", "spaces F A C E=~F4 A4 C5 E5"] },
      { id: "1.3", title: "Octave Registers", headline: "Middle C is C4", text: "Each octave gets a number, starting from C. Middle C is C4, the C below it is C3, and the next one up is C5.", ex: ["C3=~C3", "C4=~C4", "C5=~C5"] },
      { id: "1.4", title: "Accidentals", headline: "Sharps up, flats down", text: "A sharp raises a note a half step, a flat lowers it a half step, and a natural cancels both. Double sharps and double flats move two half steps.", ex: ["F to F♯=~F4 F#4", "B to B♭=~B4 Bb4"] },
      { id: "1.5", title: "Enharmonic Notes", headline: "One sound, two names", text: "C♯ and D♭ are the same key on the piano and the same fret on the guitar. Notes that sound the same but are written differently are enharmonic.", ex: ["C♯ = D♭=~C#4 Db4"] },
    ],
  },
  {
    n: 2,
    title: "Major scales and key signatures",
    sections: [
      { id: "2.1", title: "Half Steps and Whole Steps", headline: "One fret, or two", text: "A half step is the distance to the very next note. A whole step is two half steps.", ex: ["half step=~C4 Db4", "whole step=~C4 D4"] },
      { id: "2.2", title: "The Major Scale", headline: "W W H, W, W W H", text: "A major scale is two matching tetrachords (W W H) joined by a whole step. It uses every letter once, in order.", ex: ["C major=~C4 D4 E4 F4 G4 A4 B4 C5", "D major=~D4 E4 F#4 G4 A4 B4 C#5 D5"] },
      { id: "2.3", title: "Major Key Signatures", headline: "Sharps F C G D A E B", text: "The key signature lists a key's sharps or flats once, at the start. Sharps always come in the order F C G D A E B; flats in the reverse order. There are 15 major key signatures.", ex: ["G major (1♯)=~G4 A4 B4 C5 D5 E5 F#5 G5", "F major (1♭)=~F4 G4 A4 Bb4 C5 D5 E5 F5"] },
    ],
  },
  {
    n: 3,
    title: "Minor scales and key signatures",
    sections: [
      { id: "3.1", title: "Minor Scales", headline: "Natural, harmonic, melodic", text: "Natural minor lowers 3, 6 and 7 of the major scale. Harmonic minor raises 7 back up. Melodic minor raises 6 and 7 going up, and comes down as natural minor.", ex: ["natural=~A3 B3 C4 D4 E4 F4 G4 A4", "harmonic=~A3 B3 C4 D4 E4 F4 G#4 A4", "melodic=~A3 B3 C4 D4 E4 F#4 G#4 A4"] },
      { id: "3.2", title: "Minor Key Signatures", headline: "Relative and parallel keys", text: "A minor key signature matches its natural minor scale. A minor shares C major's signature (relative keys); C minor shares C major's tonic (parallel keys).", ex: ["C major=C3 E3 G3", "A minor=A2 C3 E3", "C minor=C3 Eb3 G3"] },
      { id: "3.3", title: "Scale Degree Names", headline: "Tonic, dominant and the rest", text: "Degrees 1 to 7 are tonic, supertonic, mediant, subdominant, dominant, submediant and leading tone. In natural minor, 7 is the subtonic.", ex: ["tonic → dominant=~C4 G4", "leading tone → tonic=~B4 C5"] },
    ],
  },
  {
    n: 4,
    title: "Basics of rhythm",
    sections: [
      { id: "4.1", title: "Time Signature", headline: "How many, of what", text: "The top number of a time signature says how many beats are in a bar. The bottom number says which note value gets the beat.", ex: ["4/4 clicks=~C5 G4 G4 G4 C5 G4 G4 G4"] },
      { id: "4.2", title: "Durational Symbols", headline: "Whole, half, quarter, eighth", text: "In 4/4 a whole note fills a bar, a half note half a bar, a quarter note one beat, and eighths and sixteenths split the beat further. Each has a matching rest." },
      { id: "4.3", title: "Dots and Ties", headline: "A dot adds half", text: "A dot adds half the note's value: a dotted half lasts 3 beats. A tie joins two notes of the same pitch into one longer sound; a slur over different pitches just means play smoothly." },
      { id: "4.4", title: "Meter", headline: "Beats in twos or threes", text: "Simple meters split each beat in two (2/4, 3/4, 4/4). Compound meters split each beat in three (6/8, 9/8, 12/8), so the beat is a dotted quarter." },
      { id: "4.5", title: "Tuplets", headline: "Three in the space of two", text: "A tuplet squeezes an unusual number of notes into a beat. A triplet fits three eighths into one quarter-note beat.", ex: ["straight=~C5 C5 C5 C5", "triplets=~C5 C5 C5 C5 C5 C5"] },
      { id: "4.6", title: "Common Rhythmic Notation Errors", headline: "Show where the beats are", text: "Beam and group notes so each beat is easy to see. The exception is syncopation, which accents weak beats on purpose." },
    ],
  },
  {
    n: 5,
    title: "Intervals",
    sections: [
      { id: "5.1", title: "Introduction to Intervals", headline: "Count the letters", text: "An interval measures two pitches: harmonic if they sound together, melodic if one follows the other. Its number counts the letter names from bottom to top, including both.", ex: ["3rd · C–E=~C4 E4", "5th · C–G=~C4 G4", "harmonic 3rd=C4 E4"] },
      { id: "5.2", title: "How to Identify Perfect, Major, and Minor Intervals", headline: "Treat the lower note as the tonic", text: "Every note of a major scale is a major or perfect interval above its tonic. If the top note is a half step lower than that, the interval is minor.", ex: ["M3 · C–E=~C4 E4", "m3 · C–E♭=~C4 Eb4", "M6 · C–A=~C4 A4", "m6 · C–A♭=~C4 Ab4", "P5 · C–G=~C4 G4"] },
      { id: "5.3", title: "How to Write Perfect, Major, and Minor Intervals", headline: "Build from the major scale", text: "To write an interval above a note, use the lower note's major scale, then lower the top note a half step for minor. For small intervals below a note, count whole and half steps down." },
      { id: "5.4", title: "Inversion of Intervals Explained", headline: "Flip it, sizes add to 9", text: "Inverting an interval puts the bottom note on top. The numbers add up to 9 and the quality flips: major ↔ minor, perfect stays perfect, augmented ↔ diminished.", ex: ["M3 C–E=~C4 E4", "m6 E–C=~E4 C5"] },
      { id: "5.5", title: "Augmented and Diminished Intervals", headline: "One half step past", text: "Augmented is a half step larger than perfect or major; diminished is a half step smaller than perfect or minor. Any size can be augmented or diminished.", ex: ["P5=~C4 G4", "+5=~C4 G#4", "°5 (tritone)=~C4 Gb4"] },
    ],
  },
  {
    n: 6,
    title: "Triads",
    sections: [
      { id: "6.1", title: "Introduction to Triads", headline: "Root, third, fifth", text: "A triad is three notes stacked in thirds. Major stacks M3 + m3, minor m3 + M3, diminished two m3s, augmented two M3s.", ex: ["major=C3 E3 G3", "minor=C3 Eb3 G3", "diminished=C3 Eb3 Gb3", "augmented=C3 E3 G#3"] },
      { id: "6.2", title: "Lead–Sheet Symbols", headline: "C, Cm, C°, C+", text: "Lead-sheet symbols give a chord's root and quality and let the player choose the voicing. Uppercase letter alone is major; m is minor, ° diminished, + augmented.", ex: ["C=C3 E3 G3", "Cm=C3 Eb3 G3", "C°=C3 Eb3 Gb3", "C+=C3 E3 G#3"] },
      { id: "6.3", title: "Inverted Triads", headline: "The bass isn't always the root", text: "Root position has the root lowest; 1st inversion has the 3rd lowest; 2nd inversion the 5th. A slash chord like C/E names the bass note after the slash.", ex: ["C=C3 E3 G3", "C/E=E2 G3 C4", "C/G=G2 C4 E4"] },
      { id: "6.4", title: "Analyzing Chords", headline: "Root, quality, bass", text: "To name a spread-out chord, find the root by stacking the notes in thirds, decide the quality, then check which note is in the bass." },
      { id: "6.5", title: "Simple “Sus” Chords", headline: "Swap the 3rd", text: "A sus chord replaces the 3rd: sus4 uses the 4th, sus2 the 2nd. It sounds open, neither major nor minor.", ex: ["Csus4=C3 F3 G3", "C=C3 E3 G3", "Csus2=C3 D3 G3"] },
    ],
  },
  {
    n: 7,
    title: "Roman numerals and cadences",
    sections: [
      { id: "7.1", title: "Roman Numeral Chord Symbols", headline: "Chords as numbers", text: "Roman numerals name chords by scale degree, so patterns show up in any key and songs are easy to transpose. Uppercase is major, lowercase minor.", ex: ["I–IV–V in C=C3 E3 G3|F2 A2 C3|G2 B2 D3", "I–IV–V in G=G2 B2 D3|C3 E3 G3|D3 F#3 A3"] },
      { id: "7.2", title: "Diatonic Chords in Major", headline: "M m m M M m °", text: "Triads built on each degree of a major scale are I, ii, iii, IV, V, vi and vii°. Diatonic means using only the key's notes.", ex: ["all seven=C3 E3 G3|D3 F3 A3|E3 G3 B3|F3 A3 C4|G3 B3 D4|A3 C4 E4|B3 D4 F4"] },
      { id: "7.3", title: "Diatonic Chords in Minor", headline: "i ii° III iv V VI VII", text: "Minor keys usually use i, ii°, III, iv, V, VI and VII (or vii°). V and vii° borrow the raised leading tone from harmonic minor.", ex: ["i–VI–VII–i=A2 C3 E3|F2 A2 C3|G2 B2 D3|A2 C3 E3", "V–i=E2 G#2 B2|A2 C3 E3"] },
      { id: "7.4", title: "Cadences", headline: "Where phrases land", text: "A cadence is a harmonic arrival, like a comma or period. Authentic is V–I, plagal IV–I, deceptive V–vi, and a half cadence stops on V.", ex: ["authentic=G2 B2 D3|C3 E3 G3", "plagal=F2 A2 C3|C3 E3 G3", "deceptive=G2 B2 D3|A2 C3 E3", "half=C3 E3 G3|G2 B2 D3"] },
    ],
  },
  {
    n: 8,
    title: "Seventh chords",
    sections: [
      { id: "8.1", title: "Introduction to Seventh Chords", headline: "Add another 3rd", text: "A seventh chord adds a note a third above the fifth. The five common types are major 7, dominant 7, minor 7, half-diminished 7 and fully diminished 7.", ex: ["Cmaj7=C3 E3 G3 B3", "C7=C3 E3 G3 Bb3", "Cm7=C3 Eb3 G3 Bb3", "Cø7=C3 Eb3 Gb3 Bb3", "C°7=C3 Eb3 Gb3 A3"] },
      { id: "8.2", title: "The IV/5 “sus” chord", headline: "F/G instead of G7", text: "IV over scale degree 5 in the bass (F/G in C) sounds and works like V7. Pop songs often use it in place of V7.", ex: ["F/G → C=G2 F3 A3 C4|C3 E3 G3 C4", "G7 → C=G2 F3 B3 D4|C3 E3 G3 C4"] },
      { id: "8.3", title: "Roman Numerals of Diatonic Seventh Chords", headline: "Imaj7 ii7 iii7 IVmaj7 V7 vi7 viiø7", text: "Uppercase plus 7 means a dominant 7th; add maj7 for a major 7th; lowercase plus 7 is minor 7th; ø7 is half-diminished." },
    ],
  },
  {
    n: 9,
    title: "Harmonic progression and function",
    sections: [
      { id: "9.1", title: "The Circle of Fifths Progression", headline: "Roots falling by fifths", text: "I – IV – vii° – iii – vi – ii – V – I moves every root down a fifth. Bach, Handel and Vivaldi used it constantly, and so do songs like 'Fly Me to the Moon'.", ex: ["the circle=C3 E3 G3|F2 A2 C3|B2 D3 F3|E2 G2 B2|A2 C3 E3|D3 F3 A3|G2 B2 D3|C3 E3 G3"] },
      { id: "9.2", title: "Harmonic Rhythm", headline: "How long each chord lasts", text: "Harmonic rhythm is the pace of chord changes. A chord per bar feels relaxed; two per bar feels busier.", ex: ["slow=C3 E3 G3|C3 E3 G3|F2 A2 C3|F2 A2 C3", "fast=C3 E3 G3|F2 A2 C3|G2 B2 D3|C3 E3 G3"] },
      { id: "9.3", title: "Shorter Progressions from the Circle of Fifths", headline: "ii – V – I", text: "Short slices of the circle are everywhere, above all ii – V – I, the backbone of jazz standards. vi – ii – V – I adds one more link.", ex: ["ii–V–I=D3 F3 A3|G2 B2 D3|C3 E3 G3", "vi–ii–V–I=A2 C3 E3|D3 F3 A3|G2 B2 D3|C3 E3 G3"] },
      { id: "9.4", title: "Harmonic Function", headline: "Home, prolong, set up, pull", text: "Chords have tendencies. I is tonic (rest), iii and vi prolong it, ii and IV are pre-dominant, V and vii° are dominant and pull back to I.", ex: ["I–IV–V–I=C3 E3 G3|F2 A2 C3|G2 B2 D3|C3 E3 G3"] },
      { id: "9.5", title: "Exceptions Created by Harmonic Sequences", headline: "Patterns can break the rules", text: "When a chord pattern repeats on new steps (a sequence), chords can move in unusual ways, as in the verses of 'Hotel California'." },
      { id: "9.6", title: "The Subtonic VII Chord in Popular Music", headline: "♭VII, rock's favorite", text: "The subtonic ♭VII (C in D major) can lead to tonic, dominant or pre-dominant chords. ♭VII – IV – I is a classic rock ending.", ex: ["♭VII–IV–I=C3 E3 G3|G2 B2 D3|D3 F#3 A3"] },
      { id: "9.7", title: "The Best–Seller Progression", headline: "I – V – vi – IV", text: "I – V – vi – IV turns up in hit after hit. Starting it on vi gives the darker vi – IV – I – V.", ex: ["I–V–vi–IV=C3 E3 G3|G2 B2 D3|A2 C3 E3|F2 A2 C3"] },
      { id: "9.8", title: "The i–VII–VI–VII Progression", headline: "Am – G – F – G", text: "In minor, i – VII – VI – VII rocks back and forth. It's a cousin of the flamenco 'Andalusian' descent Am – G – F – E.", ex: ["i–VII–VI–VII=A2 C3 E3|G2 B2 D3|F2 A2 C3|G2 B2 D3", "Andalusian=A2 C3 E3|G2 B2 D3|F2 A2 C3|E2 G#2 B2"] },
    ],
  },
  {
    n: 10,
    title: "Non-chord tones",
    sections: [
      { id: "10.1", title: "Introduction to Non–Chord Tones", headline: "Notes outside the chord", text: "Non-chord tones are melody notes that don't belong to the chord. They're named by how they're approached and left: by the same note, a step or a leap." },
      { id: "10.2", title: "Passing Tones", headline: "Step through", text: "A passing tone fills the gap between two chord tones by step, moving in one direction.", ex: ["E–F–G over C=~E4 F4 G4"] },
      { id: "10.3", title: "Neighbor Tones", headline: "Step away and back", text: "A neighbor tone steps up or down from a note and returns to it.", ex: ["E–F–E over C=~E4 F4 E4"] },
      { id: "10.4", title: "Appoggiatura", headline: "Leap in, step out", text: "An appoggiatura is approached by leap and left by step, usually in the opposite direction. It's often accented and expressive.", ex: ["C–A–G over C=~C4 A4 G4"] },
      { id: "10.5", title: "Escape Tone", headline: "Step in, leap out", text: "An escape tone is approached by step and left by leap in the opposite direction.", ex: ["E–F–C over C=~E4 F4 C4"] },
      { id: "10.6", title: "Double Neighbor", headline: "Above and below", text: "A double neighbor visits both the upper and lower neighbors before returning to the chord tone.", ex: ["E–F–D–E=~E4 F4 D4 E4"] },
      { id: "10.7", title: "Anticipation", headline: "Arrive early", text: "An anticipation sounds a note of the next chord before that chord arrives.", ex: ["D early=~E4 D4 D4"] },
      { id: "10.8", title: "Pedal Point", headline: "Hold while chords move", text: "A pedal point is held through changing harmonies, starting as a chord tone and becoming a non-chord tone. It's usually in the bass.", ex: ["G pedal=G2 C4 E4|G2 C4 F4|G2 B3 D4|G2 C4 E4"] },
      { id: "10.9", title: "Suspension", headline: "Hold over, then fall", text: "A suspension holds a note from the previous chord into the next on a strong beat, then resolves down by step. They're named by intervals: 4–3, 7–6, 9–8.", ex: ["4–3=F3 A3 C4 F4|C3 G3 C4 F4|C3 G3 C4 E4"] },
    ],
  },
  {
    n: 11,
    title: "Melodic analysis",
    sections: [
      { id: "11.1", title: "Motive", headline: "The smallest idea", text: "A motive is the smallest recognizable melodic idea, like the four notes that open Beethoven's 5th.", ex: ["Beethoven's 5th=~G4 G4 G4 Eb4"] },
      { id: "11.2", title: "Melodic Alteration", headline: "Bend the motive", text: "Composers reuse motives in altered forms: inversion, interval change, augmentation and diminution, rhythmic change, ornamentation, extension and retrograde.", ex: ["original=~C4 D4 E4 G4", "inversion=~C4 B3 A3 F3", "retrograde=~G4 E4 D4 C4"] },
      { id: "11.3", title: "Fragment", headline: "A piece of a motive", text: "A fragment is a smaller piece split off from a motive or subphrase, often repeated on its own." },
      { id: "11.4", title: "Phrase", headline: "A complete thought", text: "A phrase feels finished. Most are four bars and, in classical music, end with a cadence. Five- to seven-bar phrases also happen." },
      { id: "11.5", title: "Subphrase", headline: "Usually two bars", text: "Subphrases sit between motives and phrases, usually two bars long. Label them a, b, and a′ when one comes back changed." },
    ],
  },
  {
    n: 12,
    title: "Form in popular music",
    sections: [
      { id: "12.1", title: "Verse–Chorus Form", headline: "The chorus holds the hook", text: "Verse–chorus is today's most common form. The chorus carries the hook; verses tell the story. Pre-choruses, post-choruses and bridges are common additions." },
      { id: "12.2", title: "AABA Form", headline: "32 bars, 8 at a time", text: "AABA ruled popular song from the 1930s to the 1950s. Each section is about 8 bars; the B section, or bridge, gives contrast." },
      { id: "12.3", title: "ABAC Form", headline: "Another 32-bar plan", text: "ABAC was also common in the 1930s–50s, as in 'White Christmas' and 'Star Dust'. It can also appear as ABAB′." },
      { id: "12.4", title: "The 12–Bar Blues", headline: "I · IV I · V IV I", text: "The 12-bar blues runs I for four bars, IV for two, I for two, then V, IV, I, I. It drove swing and early rock 'n' roll: 'Johnny B. Goode', 'Hound Dog'.", ex: ["the 12 bars=A2 C#3 E3|A2 C#3 E3|A2 C#3 E3|A2 C#3 E3|D3 F#3 A3|D3 F#3 A3|A2 C#3 E3|A2 C#3 E3|E2 G#2 B2|D3 F#3 A3|A2 C#3 E3|A2 C#3 E3"] },
      { id: "12.5", title: "Harmonically Closed and Open Sections", headline: "Ends on I, or on V", text: "A closed section ends on I; an open one ends elsewhere, usually V. Verses and bridges tend to be open so they pull into the chorus.", ex: ["closed=F2 A2 C3|G2 B2 D3|C3 E3 G3", "open=C3 E3 G3|F2 A2 C3|G2 B2 D3"] },
    ],
  },
];
