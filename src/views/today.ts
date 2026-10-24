import { UNITS } from "../course";
import { bestStreak, currentStreak, recentDays } from "../streak";
import type { Progress } from "../store";

export function renderToday(progress: Progress, today: string, isNewToday: boolean): string {
  const streak = currentStreak(progress.visits, today);
  const best = bestStreak(progress.visits);
  const days = recentDays(progress.visits, today, 14);

  const dots = days
    .map((d) => `<i class="dot${d.visited ? " on" : ""}${d.day === today ? " today" : ""}" title="${d.day}"></i>`)
    .join("");

  const units = UNITS.map(
    (u, i) => `
      <li class="unit${i === 0 ? " next" : ""}">
        <span class="unit-n">${i + 1}</span>
        <span class="unit-text"><strong>${u.title}</strong><small>${u.summary}</small></span>
        <em>${i === 0 ? "Next" : "Locked"}</em>
      </li>`,
  ).join("");

  return `
    <section class="today">
      <p class="eyebrow">${isNewToday ? "You showed up. That counts." : "Welcome back"}</p>
      <div class="streak">
        <span class="streak-n">${streak}</span>
        <span class="streak-label">day${streak === 1 ? "" : "s"} in a row<br /><small>Best: ${best}</small></span>
      </div>
      <div class="dots" aria-label="Last 14 days">${dots}</div>
    </section>

    <section class="course">
      <h2>Your course</h2>
      <ol class="units">${units}</ol>
      <button class="btn" type="button" disabled>First lesson arrives in the next update</button>
    </section>
  `;
}
