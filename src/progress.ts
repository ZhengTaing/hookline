import { allLessons } from "./lessons/content";
import type { Progress } from "./store";
import type { LessonResult } from "./views/lesson";

/** Folds a finished lesson into progress. Missed items come back the next day. */
export function applyResult(progress: Progress, result: LessonResult, tomorrow: string): Progress {
  const completed = progress.completedLessons.includes(result.lessonId)
    ? progress.completedLessons
    : [...progress.completedLessons, result.lessonId];
  const known = new Set(progress.review.map((r) => r.text));
  const fresh = [...new Set(result.missed)].filter((t) => !known.has(t)).map((text) => ({ text, due: tomorrow }));
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
  const lessons = allLessons();
  const i = lessons.findIndex((l) => l.id === lessonId);
  return lessons.slice(0, i).every((l) => progress.completedLessons.includes(l.id));
}
