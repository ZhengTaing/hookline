import type { LessonResult } from "./lesson";

export function renderResults(result: LessonResult, streak: number, title: string, chapter: number, nextId: string | null, extra = ""): string {
  const accuracy = result.total ? Math.round((result.correct / result.total) * 100) : 0;
  const missed = [...new Set(result.missed)];
  const drill = /^(practice|challenge)-/.test(result.lessonId);
  const weak = result.lessonId === "practice-weak";
  const again = weak ? "#drill/weak" : result.lessonId.startsWith("challenge-") ? `#challenge/${chapter}` : drill ? `#drill/${chapter}` : `#lesson/${result.lessonId}`;
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
      ${extra}
      ${nextId && !drill ? `<a class="btn" href="#lesson/${nextId}">Next: section ${nextId}</a>` : ""}
      <a class="btn ghost" href="${weak ? "#practice" : `#chapter/${chapter}`}">${weak ? "Back to review" : "Back to the chapter"}</a>
      <a class="btn ghost" href="${again}">Play it again</a>
    </section>`;
}

