import { allLessons } from "./lessons/content";
import type { Progress, ReviewItem } from "./store";
import type { LessonResult } from "./views/lesson";

/** Folds a finished lesson into progress. Missed items come back the next day. */
export function applyResult(progress: Progress, result: LessonResult, tomorrow: string): Progress {
  const completed = progress.completedLessons.includes(result.lessonId)
    ? progress.completedLessons
    : [...progress.completedLessons, result.lessonId];
  const known = new Set(progress.review.map((r) => r.text));
  const fresh: ReviewItem[] = [...new Set(result.missed)].filter((t) => !known.has(t)).map((text) => ({ text, due: tomorrow }));
  if (result.fact && !known.has(result.fact.front)) fresh.push({ text: result.fact.front, back: result.fact.back, due: tomorrow });
  return {
    ...progress,
    completedLessons: completed,
    xp: progress.xp + result.xp,
    best: { ...progress.best, [result.lessonId]: Math.max(progress.best[result.lessonId] ?? 0, result.xp) },
    review: [...progress.review, ...fresh],
  };
}

/** The first lesson in course order that isn't finished yet. */
export function nextLessonId(progress: Progress): string | null {
  return allLessons().find((l) => !progress.completedLessons.includes(l.id))?.id ?? null;
}

/** A lesson is open once every lesson before it is finished. */
export function isUnlocked(progress: Progress, lessonId: string): boolean {
  // Preview builds (VITE_UNLOCK_ALL=1) open every lesson for trying things out.
  if (import.meta.env.VITE_UNLOCK_ALL === "1") return true;
  const lessons = allLessons();
  const i = lessons.findIndex((l) => l.id === lessonId);
  return lessons.slice(0, i).every((l) => progress.completedLessons.includes(l.id));
}

/** Days until a card comes back, by how many times in a row it was remembered. */
export const REVIEW_GAPS = [1, 3, 7, 14, 30];

export function addDays(day: string, n: number): string {
  const [y, m, d] = day.split("-").map(Number);
  const date = new Date(y, m - 1, d + n);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function dueCards(progress: Progress, today: string): ReviewItem[] {
  return progress.review.filter((r) => r.due <= today);
}

/** Schedules a card again: remembered cards come back later each time, missed ones tomorrow. */
export function answerCard(progress: Progress, text: string, remembered: boolean, today: string): Progress {
  return {
    ...progress,
    review: progress.review.map((r) => {
      if (r.text !== text) return r;
      const box = remembered ? Math.min((r.box ?? 0) + 1, REVIEW_GAPS.length) : 0;
      return { ...r, box, due: addDays(today, remembered ? REVIEW_GAPS[box - 1] : 1) };
    }),
  };
}
