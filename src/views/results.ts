import type { LessonResult } from "./lesson";

export function renderResults(result: LessonResult, streak: number, title: string, chapter: number, nextId: string | null): string {
  const accuracy = result.total ? Math.round((result.correct / result.total) * 100) : 0;
  const missed = [...new Set(result.missed)];
  const drill = result.lessonId.startsWith("practice-");
  return `
    <section class="results">
      <p class="eyebrow">${drill ? `${title} complete` : `Section ${result.lessonId} complete · ${title}`}</p>
      <div><span class="big-n">+${result.xp}</span><span class="muted"> XP</span></div>
      <div class="stats">
        <div><b>${streak}</b><span>day streak · today counted</span></div>
        <div><b>${result.total ? `${accuracy}%` : "—"}</b><span>${result.correct} of ${result.total} right</span></div>
        <div><b>×${result.bestCombo}</b><span>best combo</span></div>
        <div><b>${missed.length}</b><span>to review tomorrow</span></div>
      </div>
      ${
        missed.length
          ? `<ul class="missed">${missed.slice(0, 4).map((m) => `<li>${m}</li>`).join("")}</ul>`
          : `<p class="muted">Nothing missed. Clean run.</p>`
      }
      ${result.fact ? `<p class="muted small">Added to your review deck: “${result.fact.front}”</p>` : ""}
      ${nextId && !drill ? `<a class="btn" href="#lesson/${nextId}">Next: section ${nextId}</a>` : ""}
      <a class="btn ghost" href="#chapter/${chapter}">Back to the chapter</a>
      <a class="btn ghost" href="${drill ? `#drill/${chapter}` : `#lesson/${result.lessonId}`}">Play it again</a>
    </section>`;
}
