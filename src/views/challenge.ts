import type { LessonResult } from "./lesson";

const COLORS = ["#c2255c", "#6b3fa0", "#2f6f9f"];

export function renderChallengeIntro(n: number, chapterTitle: string, rounds: { name: string; about: string; maxXp: number }[], pass: number): string {
  const total = rounds.reduce((a, r) => a + r.maxXp / 10, 0);
  return `
    <section class="challenge-intro dark-panel">
      <p class="muted">Chapter ${n} · ${chapterTitle}</p>
      <p class="song-eyebrow pink">Chapter challenge</p>
      <h1>${rounds.length} rounds with your songs</h1>
      <p class="muted">Only uses what this chapter taught. Each round mixes K-pop, Olivia, Selena and Ariana.</p>
      ${rounds
        .map(
          (r, i) => `
        <div class="round-card" style="--i:${i}">
          <span class="round-n" style="background:${COLORS[i % COLORS.length]}">${i + 1}</span>
          <div><b>${r.name}</b><span>${r.about}</span></div>
          <em>up to ${r.maxXp}</em>
        </div>`,
        )
        .join("")}
      <div class="round-card goal">
        <span class="round-n"></span>
        <div><b>Win to unlock an artist</b><span>Get ${Math.ceil(total * pass)} of ${total} or more right</span></div>
      </div>
      <a class="btn pink-btn" href="#challenge/${n}/play">Start the challenge</a>
      <a class="btn ghost on-dark" href="#chapter/${n}">Back to the chapter</a>
    </section>`;
}

export function renderChallengeResults(
  result: LessonResult,
  n: number,
  rounds: { name: string }[],
  streak: { days: number; bonus: number },
  unlocked: string | undefined,
  owned: number,
  total: number,
  pass: number,
  hasNext: boolean,
  extraArtist?: string,
): string {
  const passed = result.total > 0 && result.correct / result.total >= pass;
  return `
    <section class="challenge-results dark-panel">
      <p class="muted">Chapter ${n} challenge complete · ${result.correct} of ${result.total}</p>
      <div><span class="big-n">+${result.xp + streak.bonus}</span><span class="muted"> XP</span></div>
      <div class="round-xp">
        ${rounds.map((r, i) => `<div><span>${r.name}</span><b>+${result.stepXp?.[i] ?? 0}</b></div>`).join("")}
        ${streak.bonus ? `<div><span>Streak bonus (${streak.days} days)</span><b>+${streak.bonus}</b></div>` : ""}
      </div>
      ${
        unlocked
          ? `<div class="unlock"><p class="song-eyebrow">Artist unlocked</p><div class="unlock-art" data-artist="${unlocked}"></div><b>${unlocked}</b><span>${extraArtist ? `Perfect score! ${extraArtist} unlocked too.` : "They join your Artists tab. A perfect score unlocks two."}</span></div>`
          : `<p class="muted">${passed ? `Passed. You've collected all ${total} artists.` : `Get ${Math.round(pass * 100)}% or more to unlock an artist. Play it again when you're ready.`}</p>`
      }
      <div class="unlock-count"><span>Artists unlocked</span><span>${owned} of ${total}</span></div>
      <div class="unlock-bar"><i style="width:${(owned / total) * 100}%"></i></div>
      ${hasNext ? `<a class="btn on-dark-btn" href="#chapter/${n + 1}">On to chapter ${n + 1}</a>` : ""}
      <a class="btn ghost on-dark" href="#challenge/${n}/play">Play it again</a>
    </section>`;
}
