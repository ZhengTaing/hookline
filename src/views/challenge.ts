import type { LessonResult } from "./lesson";
import { revealHtml } from "./artists";
import type { ChallengeReward } from "../rewards";

const RARITY_NOTE = [
  "Pass on a 3+ day streak for Rare, or get a perfect score for Epic.",
  "Your 3+ day streak made this a Rare card.",
  "Your perfect score made this an Epic card.",
  "Legendary!",
];

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

export interface ChallengeResultsView {
  result: LessonResult;
  chapter: number;
  rounds: { name: string }[];
  streak: { days: number; bonus: number };
  owned: number;
  total: number;
  pass: number;
  hasNext: boolean;
  reward: Pick<ChallengeReward, "unlocked" | "extra" | "upgraded" | "rarity" | "replay">;
}

export function renderChallengeResults(v: ChallengeResultsView): string {
  const { result, chapter: n, rounds, streak, owned, total, pass, hasNext, reward } = v;
  const passed = result.total > 0 && result.correct / result.total >= pass;
  const card = reward.unlocked
    ? `<div class="unlock">${revealHtml(reward.unlocked, reward.rarity, reward.extra ? `Perfect score! ${reward.extra} joins your album too.` : RARITY_NOTE[reward.rarity])}</div>`
    : reward.upgraded
      ? `<div class="unlock">${revealHtml(reward.upgraded, 2, "Card upgraded to Epic. A perfect replay can still upgrade this chapter's card.")}</div>`
      : `<p class="muted">${
          !passed
            ? `Get ${Math.round(pass * 100)}% or more to ${reward.replay ? "pass" : "unlock an artist"}. Play it again when you're ready.`
            : reward.replay
              ? "Replays give XP. New cards come from your first pass of each chapter, and a perfect replay upgrades this chapter's card to Epic."
              : `Passed. You've collected all ${total} artists.`
        }</p>`;
  return `
    <section class="challenge-results dark-panel">
      <p class="muted">Chapter ${n} challenge${reward.replay ? " · replay" : ""} · ${result.correct} of ${result.total}</p>
      <div><span class="big-n">+${result.xp + streak.bonus}</span><span class="muted"> XP</span></div>
      <div class="round-xp">
        ${rounds.map((r, i) => `<div><span>${r.name}</span><b>+${result.stepXp?.[i] ?? 0}</b></div>`).join("")}
        ${streak.bonus ? `<div><span>Streak bonus (${streak.days} days)</span><b>+${streak.bonus}</b></div>` : ""}
      </div>
      ${card}
      <div class="unlock-count"><span>Artists unlocked</span><span>${owned} of ${total}</span></div>
      <div class="unlock-bar"><i style="width:${(owned / total) * 100}%"></i></div>
      ${hasNext ? `<a class="btn on-dark-btn" href="#chapter/${n + 1}">On to chapter ${n + 1}</a>` : ""}
      <a class="btn ghost on-dark" href="#challenge/${n}/play">Play it again</a>
    </section>`;
}
