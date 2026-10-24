import { COURSE, chapterPractice } from "../lessons/content";
import type { Lesson, Unit } from "../lessons/types";
import { dueCards, isUnlocked, nextLessonId } from "../progress";
import type { Progress } from "../store";
import { bestStreak, currentStreak, recentDays } from "../streak";

/** Rough minutes for a section: the summary and a check, or a full game lesson. */
function minutes(lesson: Lesson): number {
  return lesson.steps.some((s) => s.type === "rush") || lesson.steps.length > 4 ? 6 : 2;
}

function chapterOf(lessonId: string): Unit | undefined {
  return COURSE.find((u) => u.lessons.some((l) => l.id === lessonId));
}

const CREDIT = `<p class="credit">Lessons adapted from Robert Hutchinson, <em>Music Theory for the 21st-Century Classroom</em>, under the GNU Free Documentation License.</p>`;

/** The Learn tab: streak, what's next, and every chapter of the book. */
export function renderToday(progress: Progress, today: string, isNewToday: boolean): string {
  const streak = currentStreak(progress.visits, today);
  const best = bestStreak(progress.visits);
  const days = recentDays(progress.visits, today, 14);
  const nextId = nextLessonId(progress);
  const next = nextId ? chapterOf(nextId)?.lessons.find((l) => l.id === nextId) : undefined;
  const due = dueCards(progress, today).length;

  const dots = days
    .map((d) => `<i class="dot${d.visited ? " on" : ""}${d.day === today ? " today" : ""}" title="${d.day}"></i>`)
    .join("");

  const chapters = COURSE.map((unit, ui) => {
    const done = unit.lessons.filter((l) => progress.completedLessons.includes(l.id)).length;
    const total = unit.lessons.length;
    const current = unit.lessons.some((l) => l.id === nextId);
    const open = isUnlocked(progress, unit.lessons[0].id);
    const state = done === total ? "done" : current ? "next" : open ? "open" : "locked";
    const label = done === total ? "Done" : current ? "Now" : "";
    const inner = `<span class="unit-n">${ui + 1}</span>
      <span class="unit-text"><strong>${unit.title}</strong><small>${unit.chapter} · ${done ? `${done} of ${total}` : total} sections</small>
      <span class="meter"><i style="width:${(done / total) * 100}%"></i></span></span>
      <em>${label}</em>`;
    return `<li class="unit ${state}"><a href="#chapter/${ui + 1}">${inner}</a></li>`;
  }).join("");

  return `
    <section class="today">
      <p class="eyebrow">${isNewToday ? "You showed up. That counts." : "Welcome back"}</p>
      <div class="streak">
        <span class="streak-n">${streak}</span>
        <span class="streak-label">day${streak === 1 ? "" : "s"} in a row<br /><small>Best: ${best} · ${progress.xp} XP</small></span>
      </div>
      <div class="dots" aria-label="Last 14 days">${dots}</div>
      ${
        next
          ? `<a class="btn" href="#lesson/${next.id}">Continue ${next.id} · ${next.title}</a>`
          : `<p class="muted">You've finished the whole book.</p>`
      }
      ${due ? `<a class="btn ghost" href="#practice">Review ${due} card${due === 1 ? "" : "s"}</a>` : ""}
    </section>

    <section class="course">
      <h2>The book, chapter by chapter</h2>
      <ol class="units">${chapters}</ol>
      ${CREDIT}
    </section>`;
}

/** One chapter's course path: every section of the book, in order. */
export function renderChapter(progress: Progress, n: number): string {
  const unit = COURSE[n - 1];
  if (!unit) return `<p class="muted">No such chapter.</p>`;
  const nextId = nextLessonId(progress);
  const mins = Math.round(unit.lessons.reduce((t, l) => t + minutes(l), 0) / unit.lessons.length);
  const firstOpen = unit.lessons.find((l) => !progress.completedLessons.includes(l.id) && isUnlocked(progress, l.id));

  const rows = unit.lessons
    .map((l) => {
      const done = progress.completedLessons.includes(l.id);
      const open = isUnlocked(progress, l.id);
      const state = done ? "done" : l.id === nextId ? "next" : open ? "open" : "locked";
      const label = done ? "Done" : l.id === nextId ? "Now" : "";
      const game = l.steps.some((s) => s.type === "rush") ? `<span class="tag">Game</span>` : "";
      const inner = `<span class="unit-n">${l.id}</span>
        <span class="unit-text"><strong>${l.title}</strong><small>${l.summary}</small>${game}</span>
        <em>${label}</em>`;
      return open
        ? `<li class="unit ${state}"><a href="#lesson/${l.id}">${inner}</a></li>`
        : `<li class="unit ${state}"><span class="row">${inner}</span></li>`;
    })
    .join("");

  return `
    <section class="course chapter">
      <a class="back" href="#learn">← All chapters</a>
      <p class="eyebrow">Unit ${n} · ${unit.chapter}</p>
      <h2>${unit.title}</h2>
      <p class="muted">${unit.lessons.length} sections, about ${mins} min each</p>
      <ol class="units">${rows}</ol>
      ${
        firstOpen
          ? `<a class="btn" href="#lesson/${firstOpen.id}">Continue ${firstOpen.id}</a>`
          : unit.lessons.every((l) => progress.completedLessons.includes(l.id))
            ? `<p class="muted">Chapter done. Replay any section above.</p>`
            : `<p class="muted">Finish the earlier chapters to open this one.</p>`
      }
      ${chapterPractice(n) ? `<a class="btn ghost" href="#drill/${n}">Practice this chapter's questions</a>` : ""}
      ${n < COURSE.length ? `<a class="btn ghost" href="#chapter/${n + 1}">Next chapter: ${COURSE[n].title}</a>` : ""}
    </section>`;
}
