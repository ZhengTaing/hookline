import challenges from "../data/challenges.json";
import type { Lesson, RushQuestion, Step } from "./types";
import { COURSE, chapterPractice } from "./content";

type SongRef = [string, string];
interface Round {
  title: string;
  /** Questions taken from the chapter's own practice set. */
  drill?: number;
  questions?: { song: SongRef; prompt: string; options: string[]; answer: string; miss: string }[];
  /** Songs for a "name that intro" round; each one's options are the others' titles. */
  intro?: SongRef[];
}

const DATA = challenges as unknown as { artists: string[]; chapters: Record<string, { rounds: Round[] }> };

/** Artists in the order chapter challenges unlock them. */
export const UNLOCK_ORDER = DATA.artists;

/** Score needed to pass a challenge and unlock an artist. */
export const PASS = 0.7;

const song = ([title, artist]: SongRef) => ({ kind: "song" as const, title, artist });

function roundSteps(n: number, round: Round): Step {
  let questions: RushQuestion[] = [];
  if (round.drill) {
    const pool = (chapterPractice(n)?.steps ?? []).flatMap((s) => (s.type === "practice" ? s.questions : []));
    // An even spread across the chapter, the same every time.
    const gap = Math.max(1, Math.floor(pool.length / round.drill));
    questions = pool.filter((_, i) => i % gap === 0).slice(0, round.drill);
  }
  if (round.questions) {
    questions = round.questions.map((q) => ({ kind: "choice", prompt: q.prompt, options: q.options, answer: q.answer, sound: song(q.song), miss: q.miss }));
  }
  if (round.intro) {
    const titles = round.intro.map(([t]) => t);
    questions = round.intro.map((ref, i) => ({
      kind: "choice",
      prompt: "Listen. Which song is this?",
      // The answer plus the next three titles in the round, so every option is a real song.
      options: [0, 1, 2, 3].map((k) => titles[(i + k) % titles.length]),
      answer: ref[0],
      sound: song(ref),
      miss: `That was ${ref[0]}`,
    }));
  }
  return { type: "practice", title: round.title, questions };
}

/** The end-of-chapter challenge: three rounds with songs from the playlist. */
export function chapterChallenge(n: number): Lesson | undefined {
  const data = DATA.chapters[String(n)];
  const unit = COURSE[n - 1];
  if (!data || !unit) return undefined;
  return {
    id: `challenge-${n}`,
    section: String(n),
    title: `Chapter ${n} challenge`,
    summary: unit.title,
    steps: data.rounds.map((r) => roundSteps(n, r)),
  };
}

export function challengeRounds(n: number): string[] {
  return DATA.chapters[String(n)]?.rounds.map((r) => r.title) ?? [];
}

/** The next artist a passed challenge unlocks, if any are left. */
export function nextArtist(owned: string[]): string | undefined {
  return UNLOCK_ORDER.find((a) => !owned.includes(a));
}
