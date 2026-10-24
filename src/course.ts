export interface Unit {
  id: string;
  title: string;
  summary: string;
}

// The core course. Lesson content arrives in M1 (units 1-2) and M4 (units 3-6).
export const UNITS: Unit[] = [
  { id: "notes", title: "Notes and the fretboard", summary: "12 notes, octaves, half steps" },
  { id: "intervals", title: "Intervals", summary: "3rds, 5ths, and why they sound like that" },
  { id: "major-scale", title: "The major scale", summary: "W W H W W W H" },
  { id: "chords-in-a-key", title: "Chords in a key", summary: "I ii iii IV V vi vii°" },
  { id: "progressions", title: "Progressions", summary: "I–V–vi–IV and friends" },
  { id: "minor-and-modes", title: "Minor keys and modes", summary: "Aeolian, Dorian, Mixolydian" },
];
