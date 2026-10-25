import { CHAPTER_1 } from "./chapter-1";
import { CHAPTER_2 } from "./chapter-2";
import { CHAPTER_3 } from "./chapter-3";
import { CHAPTER_4 } from "./chapter-4";
import { CHAPTER_5 } from "./chapter-5";
import { CHAPTER_6 } from "./chapter-6";
import { CHAPTER_7 } from "./chapter-7";
import { CHAPTER_8 } from "./chapter-8";
import { CHAPTER_9 } from "./chapter-9";
import { CHAPTER_10 } from "./chapter-10";
import { CHAPTER_11 } from "./chapter-11";
import { CHAPTER_12 } from "./chapter-12";
import { CHAPTER_13 } from "./chapter-13";
import { CHAPTER_14 } from "./chapter-14";
import { CHAPTER_15 } from "./chapter-15";
import { CHAPTER_16 } from "./chapter-16";
import { CHAPTER_17 } from "./chapter-17";
import { CHAPTER_18 } from "./chapter-18";
import { CHAPTER_19 } from "./chapter-19";
import { CHAPTER_20 } from "./chapter-20";
import { CHAPTER_21 } from "./chapter-21";
import { CHAPTER_22 } from "./chapter-22";
import { CHAPTER_23 } from "./chapter-23";
import { CHAPTER_24 } from "./chapter-24";
import { CHAPTER_25 } from "./chapter-25";
import { CHAPTER_26 } from "./chapter-26";
import { CHAPTER_27 } from "./chapter-27";
import { CHAPTER_28 } from "./chapter-28";
import { CHAPTER_29 } from "./chapter-29";
import { CHAPTER_30 } from "./chapter-30";
import { CHAPTER_31 } from "./chapter-31";
import { CHAPTER_32 } from "./chapter-32";
import { CHAPTER_33 } from "./chapter-33";
import { CHAPTER_34 } from "./chapter-34";
import { CHAPTER_35 } from "./chapter-35";
import { BOOK_CHAPTERS, type BookChapter, parseExample } from "./sections";
import { parseNote } from "../music";
import type { Lesson, RushQuestion, Step, Unit, Visual } from "./types";

// Lessons adapted from Robert Hutchinson, "Music Theory for the 21st-Century Classroom"
// (GNU Free Documentation License 1.2). Section numbers refer to that book.


/** Hand-written steps for every section. */
const WRITTEN: Record<string, Step[]> = { ...CHAPTER_1, ...CHAPTER_2, ...CHAPTER_3, ...CHAPTER_4, ...CHAPTER_5, ...CHAPTER_6, ...CHAPTER_7, ...CHAPTER_8, ...CHAPTER_9, ...CHAPTER_10, ...CHAPTER_11, ...CHAPTER_12, ...CHAPTER_13, ...CHAPTER_14, ...CHAPTER_15, ...CHAPTER_16, ...CHAPTER_17, ...CHAPTER_18, ...CHAPTER_19, ...CHAPTER_20, ...CHAPTER_21, ...CHAPTER_22, ...CHAPTER_23, ...CHAPTER_24, ...CHAPTER_25, ...CHAPTER_26, ...CHAPTER_27, ...CHAPTER_28, ...CHAPTER_29, ...CHAPTER_30, ...CHAPTER_31, ...CHAPTER_32, ...CHAPTER_33, ...CHAPTER_34, ...CHAPTER_35 };

/** Spreads picks around without randomness, so a section always asks the same thing. */
const rotate = <T,>(items: T[], by: number): T[] => items.map((_, k) => items[(k + by) % items.length]);

/**
 * An example's notes drawn on the treble staff, moved up by octaves so nothing sits far below
 * it. Null for progressions or anything too spread out to read.
 */
function onStaff(example: string): Visual | null {
  const notes = example.slice(example.lastIndexOf("=") + 1).replace(/^~/, "").trim();
  if (notes.includes("|")) return null;
  const names = notes.split(/\s+/);
  const parsed = names.map(parseNote);
  const low = Math.min(...parsed.map((n) => n.step));
  const high = Math.max(...parsed.map((n) => n.step));
  if (high - low > 12 || names.length > 8) return null;
  const up = Math.max(0, Math.ceil((4 * 7 - low) / 7));
  const moved = parsed.map((n) => `${n.letter}${n.accidental}${n.octave + up}`);
  return { type: "staff", notes: moved, chord: !example.slice(example.lastIndexOf("=") + 1).startsWith("~") && names.length > 1 };
}

/**
 * For a section without book exercises of its own: a check on exactly what its card just said
 * (which sentence sums it up) and, when the card has two or more examples, which one is playing.
 */
function sectionCheck(ch: BookChapter, i: number): Step[] {
  const sec = ch.sections[i];
  const steps: Step[] = [];
  const others = ch.sections.filter((s) => s.id !== sec.id && s.headline !== sec.headline);
  if (others.length >= 2) {
    const wrong = rotate(others, i).slice(0, 2).map((s) => s.headline);
    steps.push({
      type: "practice",
      title: "Check",
      questions: [{ kind: "choice", prompt: `Which one sums up “${sec.title}”?`, options: rotate([sec.headline, ...wrong], i % 3), answer: sec.headline, miss: `${sec.title}: ${sec.headline}` }],
    });
  }
  const chips = (sec.ex ?? []).map(parseExample).slice(0, 4);
  const distinct = chips.length >= 2 && new Set(chips.map((c) => c.label)).size === chips.length;
  const drawn = (sec.ex ?? []).slice(0, 4).map(onStaff);
  if (distinct && drawn.every((d) => d)) {
    const pick = (i + 1) % chips.length;
    steps.push({
      type: "practice",
      title: "Name it on the staff",
      questions: [{ kind: "choice", prompt: "Which example from the card is this?", options: chips.map((c) => c.label), answer: chips[pick].label, visual: drawn[pick]!, sound: chips[pick].sound, miss: `That's ${chips[pick].label}` }],
    });
  }
  if (distinct) {
    const pick = chips[i % chips.length];
    steps.push({
      type: "practice",
      title: "Name it by ear",
      questions: [{ kind: "choice", prompt: "Listen. Which example from the card is this?", options: chips.map((c) => c.label), answer: pick.label, sound: pick.sound, miss: `That was ${pick.label}` }],
    });
  }
  return steps;
}

/**
 * The course path: one unit per book chapter, one step per section. Each step opens with the
 * section's read-and-hear card. Where the book has exercises for the section, they follow;
 * other sections get a short check on what their own card said.
 */
export const COURSE: Unit[] = BOOK_CHAPTERS.map((ch) => ({
  id: `ch${ch.n}`,
  title: ch.title,
  chapter: `Chapter ${ch.n}`,
  summary: `${ch.sections.length} sections`,
  lessons: ch.sections.map((sec, i): Lesson => {
    const read: Step = { type: "read", section: sec.id, title: sec.title, headline: sec.headline, text: sec.text, chips: (sec.ex ?? []).map(parseExample) };
    const rawRest = WRITTEN[sec.id] ?? sectionCheck(ch, i);
    // Every question gets a Hint: what the section's card said (skipped when its headline is the answer).
    const tip = `${sec.title}: ${sec.text}`;
    const withTip = (qs: RushQuestion[]) => qs.map((q) => ("answer" in q && q.answer === sec.headline ? q : { ...q, tip: q.tip ?? tip }));
    const rest = rawRest.map((s): Step => (s.type === "practice" || s.type === "rush" ? { ...s, questions: withTip(s.questions) } : s));
    return {
      id: sec.id,
      section: sec.id,
      title: sec.title,
      summary: sec.headline,
      // Hand-written chapters open with their own story cards instead of the summary card.
      steps: WRITTEN[sec.id]?.[0]?.type === "story" ? rest : [read, ...rest],
      fact: { front: `${sec.title}?`, back: `${sec.headline}. ${sec.text}` },
    };
  }),
}));

export function allLessons() {
  return COURSE.flatMap((u) => u.lessons);
}

export function findLesson(id: string) {
  return allLessons().find((l) => l.id === id);
}

/**
 * Extra practice for a whole chapter: every question from its sections' lessons, section by
 * section, with no story cards. Finishing it adds XP and review cards but no completed lesson.
 */
export function chapterPractice(n: number): Lesson | undefined {
  const unit = COURSE[n - 1];
  if (!unit) return undefined;
  const steps = unit.lessons.flatMap((l) =>
    l.steps.flatMap((s): Step[] => {
      if (s.type === "practice") return [{ ...s, title: `${l.id} · ${s.title}` }];
      if (s.type === "rush") return [{ type: "practice", title: `${l.id} · ${s.source}`, questions: s.questions }];
      if (s.type === "realSong" || s.type === "tapBeat") return [s];
      return [];
    }),
  );
  return steps.length ? { id: `practice-${n}`, section: String(n), title: `Chapter ${n} practice`, summary: unit.title, steps } : undefined;
}
