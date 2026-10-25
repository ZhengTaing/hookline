import type { Sound } from "./types";

// Plays a list of chord symbols as a progression, for "use it in real songs" steps.

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

export function chordsSound(symbols: string[]): Sound {
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
