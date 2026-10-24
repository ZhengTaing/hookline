import { COURSE, UPCOMING } from "../lessons/content";
import { isUnlocked, nextLessonId } from "../progress";
import type { Progress } from "../store";
import { bestStreak, currentStreak, recentDays } from "../streak";

export function renderToday(progress: Progress, today: string, isNewToday: boolean): string {
  const streak = currentStreak(progress.visits, today);
  const best = bestStreak(progress.visits);
  const days = recentDays(progress.visits, today, 14);
  const nextId = nextLessonId(progress);
  const dueReviews = progress.review.filter((r) => r.due <= today).length;

  const dots = days
    .map((d) => `<i class="dot${d.visited ? " on" : ""}${d.day === today ? " today" : ""}" title="${d.day}"></i>`)
    .join("");

  const units = COURSE.map((unit, ui) => {
    const lessons = unit.lessons
      .map((l) => {
        const done = progress.completedLessons.includes(l.id);
        const open = isUnlocked(progress, l.id);
        const state = done ? "done" : l.id === nextId ? "next" : open ? "open" : "locked";
        const label = done ? "✓" : l.id === nextId ? "Next" : "";
        const inner = `<span class="unit-n">${l.id}</span>
            <span class="unit-text"><strong>${l.title}</strong><small>${l.summary}</small></span>
            <em>${label}</em>`;
        return open
          ? `<li class="unit ${state}"><a href="#lesson/${l.id}">${inner}</a></li>`
          : `<li class="unit ${state}"><span class="row">${inner}</span></li>`;
      })
      .join("");
    return `
      <section class="course-unit">
        <p class="eyebrow">Unit ${ui + 1} · ${unit.chapter}</p>
        <h3>${unit.title}</h3>
        <ol class="units">${lessons}</ol>
      </section>`;
  }).join("");

  const upcoming = UPCOMING.map(
    (u, i) => `<li class="unit locked"><span class="row"><span class="unit-n">${COURSE.length + i + 1}</span>
      <span class="unit-text"><strong>${u.title}</strong><small>${u.chapter}</small></span><em>Soon</em></span></li>`,
  ).join("");

  return `
    <section class="today">
      <p class="eyebrow">${isNewToday ? "You showed up. That counts." : "Welcome back"}</p>
      <div class="streak">
        <span class="streak-n">${streak}</span>
        <span class="streak-label">day${streak === 1 ? "" : "s"} in a row<br /><small>Best: ${best} · ${progress.xp} XP</small></span>
      </div>
      <div class="dots" aria-label="Last 14 days">${dots}</div>
      ${
        nextId
          ? `<a class="btn" href="#lesson/${nextId}">Continue · lesson ${nextId}</a>`
          : `<p class="muted">You've finished every lesson so far. New ones are on the way.</p>`
      }
      ${dueReviews ? `<p class="muted small">${dueReviews} thing${dueReviews === 1 ? "" : "s"} to review. Review sessions arrive in a later update.</p>` : ""}
    </section>

    <section class="course">
      <h2>Your course</h2>
      ${units}
      <section class="course-unit">
        <p class="eyebrow">Coming next</p>
        <ol class="units">${upcoming}</ol>
      </section>
      <p class="credit">Lessons adapted from Robert Hutchinson, <em>Music Theory for the 21st-Century Classroom</em>, under the GNU Free Documentation License.</p>
    </section>
  `;
}
