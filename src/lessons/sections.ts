import { parseNote } from "../music";
import { CHAPTERS_1_12 } from "./sections-1-12";
import { CHAPTERS_13_35 } from "./sections-13-35";
import type { Sound } from "./types";

/** One section of the book, summarized for the read-and-hear card. */
export interface BookSection {
  id: string;
  title: string;
  headline: string;
  text: string;
  /** Playable examples as "label=notes" (see sections-1-12.ts). */
  ex?: string[];
}

export interface BookChapter {
  n: number;
  title: string;
  sections: BookSection[];
}

export const BOOK_CHAPTERS: BookChapter[] = [...CHAPTERS_1_12, ...CHAPTERS_13_35];

/** Turns "M3 · C–E=~C4 E4" into a chip label and a sound. */
export function parseExample(example: string): { label: string; sound: Sound } {
  const cut = example.lastIndexOf("=");
  const label = example.slice(0, cut);
  const notes = example.slice(cut + 1);
  const midi = (s: string) => s.trim().split(/\s+/).map((n) => parseNote(n).midi);
  if (notes.startsWith("~")) return { label, sound: { kind: "melodic", notes: midi(notes.slice(1)), gap: 0.4 } };
  const chords = notes.split("|").map(midi);
  return { label, sound: chords.length === 1 ? { kind: "chord", notes: chords[0] } : { kind: "progression", chords, gap: 0.8 } };
}
