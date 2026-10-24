import { NOTE_NAMES, OPEN_STRINGS, fretMidi, intervalName, parseNote } from "../music";
import type { RushQuestion, Step } from "./types";

// Teach before testing: the first time a lesson uses a kind of question, a worked example
// of that kind comes first, showing where to look and why the answer is right.

const STRINGS = ["high E", "B", "G", "D", "A", "low E"];
const SIZE_WORDS: Record<number, string> = { 1: "unison", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th", 6: "6th", 7: "7th", 8: "octave" };
const LETTERS = "CDEFGAB";

/** Every spot on frets 0-5 that plays a pitch class. */
export function spotsFor(pitchClass: number): { string: number; fret: number }[] {
  const out: { string: number; fret: number }[] = [];
  for (let st = 0; st < 6; st++) for (let f = 0; f <= 5; f++) if ((OPEN_STRINGS[st] + f) % 12 === pitchClass) out.push({ string: st, fret: f });
  return out;
}

/** What kind of question this is, for deciding whether it has been shown yet. Null for plain text questions. */
export function formatOf(q: RushQuestion): string | null {
  if (q.kind !== "choice") return q.kind;
  if (q.visual) return `choice-${q.visual.type}`;
  if (q.sound && q.sound.kind !== "none") return "choice-ear";
  return null;
}

function where(spots: { string: number; fret: number }[]): string {
  return spots.map((s) => `${STRINGS[s.string]} string ${s.fret === 0 ? "open" : `fret ${s.fret}`}`).join(", ");
}

const NECK = "The top line is the high E string and the bottom line is the low E string. The numbers are frets; 0 means play the string open.";

/** A worked example for a question's format. Fretboard examples use a different note than the question. */
function demoFor(q: RushQuestion): Step {
  if (q.kind === "findNote") {
    const pc = (q.pitchClass + 7) % 12;
    const example: RushQuestion = { kind: "findNote", pitchClass: pc, prompt: `Find ${NOTE_NAMES[pc]}` };
    return { type: "demo", question: example, note: `${NECK} ${NOTE_NAMES[pc]} is at ${where(spotsFor(pc))}. Tapping any of them counts.` };
  }
  if (q.kind === "fretInterval") {
    const fret = q.fret >= 2 ? q.fret - 2 : q.fret + 2;
    const example: RushQuestion = { ...q, fret };
    const base = NOTE_NAMES[fretMidi(q.string, fret) % 12];
    return {
      type: "demo",
      question: example,
      note: `${NECK} Start from the black dot (${base}). A ${q.label} is ${q.semitones} half steps up, so count ${q.semitones} frets up the same string. The green dots are every right answer, including the same note on other strings.`,
    };
  }
  if (q.kind === "staff") {
    const lo = parseNote(q.lower);
    const hi = parseNote(q.upper);
    const size = hi.step - lo.step + 1;
    const letters = Array.from({ length: size }, (_, i) => LETTERS[(LETTERS.indexOf(lo.letter) + i) % 7]).join(", ");
    const named = q.options.some((o) => /^[PMm+°]/.test(o));
    const quality = named
      ? ` Then check the quality: is ${hi.letter}${hi.accidental} in ${lo.letter}${lo.accidental}'s major scale? Here the answer is ${intervalName(q.lower, q.upper)}.`
      : "";
    return {
      type: "demo",
      question: q,
      note: `Count the letter names from the bottom note to the top note, including both: ${letters}. That's ${size} letters, so it's a ${SIZE_WORDS[size] ?? `${size}th`}.${quality}`,
    };
  }
  if (q.kind === "choice" && !q.visual)
    return { type: "demo", question: q, note: `Press play and listen, then pick what you heard. Replay it as often as you like. This one: ${q.miss.replace(/\.$/, "")}.` };
  return { type: "demo", question: q, note: q.kind === "choice" ? `${q.miss.replace(/\.$/, "")}.` : "" };
}

/** Inserts a worked example before the first question of each format in a lesson. */
export function withDemos(steps: Step[]): Step[] {
  const seen = new Set<string>();
  const out: Step[] = [];
  for (const step of steps) {
    if (step.type !== "rush" && step.type !== "practice") {
      out.push(step);
      continue;
    }
    let questions = step.questions;
    for (const q of step.questions) {
      const format = formatOf(q);
      if (!format || seen.has(format)) continue;
      seen.add(format);
      const demo = demoFor(q);
      out.push(demo);
      // Don't ask the exact example again right away, as long as enough questions are left.
      if (demo.type === "demo" && demo.question === q && questions.length > 2) questions = questions.filter((x) => x !== q);
    }
    out.push({ ...step, questions });
  }
  return out;
}
