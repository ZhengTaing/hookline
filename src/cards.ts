import sectionSongs from "./data/section-songs.json";
import { UNLOCK_ORDER } from "./lessons/challenge";
import { addDays, dueCards } from "./progress";
import { currentStreak } from "./streak";
import type { Progress } from "./store";

export const RARITIES = ["Common", "Rare", "Epic", "Legendary"] as const;

/** How each rarity is earned, shown on the card detail. */
export const RARITY_HOW = [
  "Pass a chapter challenge",
  "Pass it on a 3+ day streak",
  "Get a perfect score",
  "Finish artist quests to level a card up",
];

/** Album pages: [name, first card index, last card index + 1]. */
export const SETS: [string, number, number][] = [
  ["Rookie", 0, 10],
  ["Rising", 10, 25],
  ["Headliner", 25, 40],
  ["Icon", 40, 50],
];

/** Sections featuring an artist to finish for one rarity level. */
export const QUEST_GOAL = 3;

export const DAILY = [
  { title: "Finish 1 section", goal: 1, of: "sections", xp: 20 },
  { title: "Earn 60 XP", goal: 60, of: "xp", xp: 20 },
  { title: "Finish 3 sections", goal: 3, of: "sections", xp: 30 },
  { title: "Review your cards", goal: 3, of: "reviews", xp: 20 },
] as const;

/** Streak days for the weekly card pack. */
export const PACK_STREAK = 5;

const SONGS = sectionSongs as unknown as Record<string, { songs: { artist: string }[] }>;
const features = (credit: string, artist: string) => credit === artist || credit.split(/, | & /).includes(artist);

/** Section ids whose songs include this artist. */
export function featuredSections(artist: string): string[] {
  return Object.keys(SONGS).filter((id) => SONGS[id].songs.some((s) => features(s.artist, artist)));
}

const doneFeaturing = (p: Progress, artist: string) => featuredSections(artist).filter((id) => p.completedLessons.includes(id)).length;

/** An owned artist's rarity, 0 (Common) to 3 (Legendary). Artists unlocked before cards existed are Common. */
export const rarityOf = (p: Progress, artist: string) => p.cards?.[artist]?.r ?? 0;

/** Rarity for a challenge unlock: perfect is Epic, a 3+ day streak is Rare. */
export function unlockRarity(score: number, streak: number): number {
  return score === 1 ? 2 : streak >= 3 ? 1 : 0;
}

/** Adds cards at a rarity; their artist quests count sections finished from now on. */
export function addCards(p: Progress, artists: string[], r: number): Progress {
  const cards = { ...p.cards };
  for (const a of artists) cards[a] = { r, q: doneFeaturing(p, a) };
  return { ...p, artists: [...(p.artists ?? []), ...artists.filter((a) => !p.artists?.includes(a))], cards };
}

/** An artist quest: sections featuring them finished since the card's last level, toward QUEST_GOAL. */
export function questFor(p: Progress, artist: string): { done: number; left: number } | null {
  if (!p.artists?.includes(artist) || rarityOf(p, artist) >= 3) return null;
  const all = featuredSections(artist);
  const base = p.cards?.[artist]?.q ?? 0;
  const done = doneFeaturing(p, artist) - base;
  const left = all.length - base;
  // Only offer a quest the rest of the course can still finish.
  return left >= QUEST_GOAL ? { done: Math.min(done, QUEST_GOAL), left } : null;
}

/** The artist quest to show: the owned card closest to leveling up. */
export function activeQuest(p: Progress): { artist: string; done: number } | null {
  let best: { artist: string; done: number } | null = null;
  for (const a of [...(p.artists ?? [])].reverse()) {
    const q = questFor(p, a);
    if (q && (!best || q.done > best.done)) best = { artist: a, done: q.done };
  }
  return best;
}

/** Levels up every card whose artist quest is done. Returns the new progress and the upgraded artists. */
export function levelCards(p: Progress): { progress: Progress; upgraded: string[] } {
  const upgraded: string[] = [];
  const cards = { ...p.cards };
  for (const a of p.artists ?? []) {
    const q = questFor(p, a);
    if (q && q.done >= QUEST_GOAL) {
      cards[a] = { r: rarityOf(p, a) + 1, q: doneFeaturing(p, a) };
      upgraded.push(a);
    }
  }
  return { progress: { ...p, cards }, upgraded };
}

/** Today's lesson counts, reset each day. */
export function todayStats(p: Progress, today: string) {
  const t = p.today?.day === today ? p.today : { day: today, sections: 0, xp: 0, claimed: [] as number[] };
  return { ...t, reviews: t.reviews ?? 0 };
}

/** Counts a finished lesson toward today's quests. */
export function countToday(p: Progress, today: string, xp: number, section: boolean): Progress {
  const t = todayStats(p, today);
  return { ...p, today: { ...t, sections: t.sections + (section ? 1 : 0), xp: t.xp + xp } };
}

/** A daily quest's goal today: the review quest asks for up to 3 of the cards actually due. */
export function goalOf(p: Progress, today: string, i: number): number {
  const q = DAILY[i];
  return q.of === "reviews" ? Math.max(1, Math.min(q.goal, todayStats(p, today).reviews + dueCards(p, today).length)) : q.goal;
}

export function claimDaily(p: Progress, today: string, i: number): Progress {
  const t = todayStats(p, today);
  const q = DAILY[i];
  if (!q || t.claimed.includes(i) || t[q.of] < goalOf(p, today, i)) return p;
  return { ...p, xp: p.xp + q.xp, today: { ...t, claimed: [...t.claimed, i] } };
}

/** The Monday that starts this week, as a day key. */
export function weekOf(today: string): string {
  const [y, m, d] = today.split("-").map(Number);
  return addDays(today, -((new Date(y, m - 1, d).getDay() + 6) % 7));
}

export function packState(p: Progress, today: string): { streak: number; ready: boolean; claimed: boolean } {
  const streak = currentStreak([...(p.learnDays ?? []), ...(p.frozen ?? [])], today);
  const claimed = p.packWeek === weekOf(today);
  return { streak, claimed, ready: !claimed && streak >= PACK_STREAK && UNLOCK_ORDER.some((a) => !p.artists?.includes(a)) };
}

/** Opens the weekly card pack: the next artist joins as Rare, and you get a streak freeze. */
export function openPack(p: Progress, today: string): { progress: Progress; artist?: string } {
  if (!packState(p, today).ready) return { progress: p };
  const artist = UNLOCK_ORDER.find((a) => !p.artists?.includes(a))!;
  return { progress: { ...addCards(p, [artist], 1), packWeek: weekOf(today), freezes: Math.min(2, (p.freezes ?? 0) + 1) }, artist };
}

/** Album sets you have filled. */
export function fullSets(p: Progress): number[] {
  return SETS.flatMap(([, a, b], i) => (UNLOCK_ORDER.slice(a, b).every((x) => p.artists?.includes(x)) ? [i] : []));
}

/** Artists of the full sets whose song mix is on. */
export function mixArtists(p: Progress): string[] {
  const full = fullSets(p);
  return (p.setMix ?? []).filter((i) => full.includes(i)).flatMap((i) => UNLOCK_ORDER.slice(SETS[i][1], SETS[i][2]));
}

/** One extra song for a section from the set mix: a song already picked for another section, by a mix artist. */
export function mixSong(sectionId: string, artists: string[]): { title: string; artist: string } | undefined {
  if (!artists.length || !SONGS[sectionId]) return undefined;
  const own = new Set(SONGS[sectionId].songs.map((s) => s.artist));
  const pool = Object.values(SONGS)
    .flatMap((x) => x.songs as { title: string; artist: string }[])
    .filter((s, i, all) => artists.some((a) => features(s.artist, a)) && !own.has(s.artist) && all.findIndex((o) => o.title === s.title) === i);
  if (!pool.length) return undefined;
  const n = sectionId.split(".").reduce((a, x) => a * 31 + Number(x), 7);
  return pool[n % pool.length];
}
