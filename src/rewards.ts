import { addCards, rarityOf, unlockRarity } from "./cards";
import { PASS, STREAK_BONUS, nextArtist } from "./lessons/challenge";
import { addDays } from "./progress";
import type { Progress } from "./store";
import { currentStreak } from "./streak";

/** XP for each review card you remember. */
export const REVIEW_XP = 5;

/** Streak freezes you can save up. */
export const MAX_FREEZES = 2;

/** Days that keep the streak going: days with a finished lesson or review, plus frozen days. */
export const streakDays = (p: Progress) => [...(p.learnDays ?? []), ...(p.frozen ?? [])];

export const lessonStreak = (p: Progress, today: string) => currentStreak(streakDays(p), today);

/** Covers yesterday with a saved freeze when it was missed but the day before kept the streak. */
export function useFreeze(p: Progress, today: string): Progress {
  const days = new Set(streakDays(p));
  const yesterday = addDays(today, -1);
  if (!(p.freezes ?? 0) || days.has(today) || days.has(yesterday) || !days.has(addDays(today, -2))) return p;
  return { ...p, frozen: [...(p.frozen ?? []), yesterday], freezes: (p.freezes ?? 0) - 1 };
}

/** Marks today as a learning day. */
export function recordLearnDay(p: Progress, today: string): Progress {
  const q = useFreeze(p, today);
  return q.learnDays?.includes(today) ? q : { ...q, learnDays: [...(q.learnDays ?? []), today].sort() };
}

/** A remembered review card earns XP; every answer counts toward today's review quest. */
export function reviewReward(p: Progress, today: string, remembered: boolean): Progress {
  const t = p.today?.day === today ? p.today : { day: today, sections: 0, xp: 0, claimed: [] };
  const xp = remembered ? REVIEW_XP : 0;
  return recordLearnDay({ ...p, xp: p.xp + xp, today: { ...t, reviews: (t.reviews ?? 0) + 1, xp: t.xp + xp } }, today);
}

export interface ChallengeReward {
  progress: Progress;
  bonus: number;
  rarity: number;
  /** Cards from a first pass: the next artist, plus a second one for a perfect score. */
  unlocked?: string;
  extra?: string;
  /** A replay's perfect score lifts this chapter's card to Epic. */
  upgraded?: string;
  replay: boolean;
}

/**
 * A finished challenge. Only the first pass of a chapter unlocks cards; replays give XP, and a
 * perfect replay upgrades the card that chapter unlocked. `priorBest` is the best XP before this run.
 */
export function challengeReward(p: Progress, chapter: number, correct: number, total: number, streak: number, priorBest = 0): ChallengeReward {
  const score = total ? correct / total : 0;
  const bonus = streak >= 2 ? STREAK_BONUS : 0;
  // Players from before `cleared` existed: a passing best score means the chapter was cleared.
  const replay = (p.cleared ?? []).includes(chapter) || priorBest >= PASS * total * 10;
  let progress: Progress = { ...p, xp: p.xp + bonus };
  const rarity = unlockRarity(score, streak);
  if (score < PASS) return { progress, bonus, rarity, replay };
  if (!replay) {
    const owned = progress.artists ?? [];
    const unlocked = nextArtist(owned);
    const extra = unlocked && score === 1 ? nextArtist([...owned, unlocked]) : undefined;
    progress = addCards(progress, [unlocked, extra].filter((a): a is string => !!a), rarity);
    progress = {
      ...progress,
      cleared: [...(progress.cleared ?? []), chapter],
      chapterCard: unlocked ? { ...progress.chapterCard, [chapter]: unlocked } : progress.chapterCard,
    };
    return { progress, bonus, rarity, unlocked, extra, replay };
  }
  const card = progress.chapterCard?.[chapter];
  if (score === 1 && card && rarityOf(progress, card) < 2) {
    progress = { ...progress, cards: { ...progress.cards, [card]: { r: 2, q: progress.cards?.[card]?.q ?? 0 } } };
    return { progress, bonus, rarity: 2, upgraded: card, replay };
  }
  return { progress, bonus, rarity, replay };
}
