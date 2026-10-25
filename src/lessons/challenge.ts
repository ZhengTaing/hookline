import challenges from "../data/challenges.json";
import type { Lesson, RushQuestion, Step } from "./types";
import { COURSE, chapterPractice } from "./content";

type SongRef = [string, string];
interface Round {
  title: string;
  /** One line for the challenge's intro screen. */
  about: string;
  /** Questions taken from the chapter's own practice set. */
  drill?: number;
  questions?: { song: SongRef; prompt: string; options: string[]; answer: string; miss: string }[];
  /** Songs for a "name that intro" round; each one's options are the others' titles. */
  intro?: SongRef[];
}

const DATA = challenges as unknown as { artists: string[]; chapters: Record<string, { rounds: Round[] }> };

/** Artists in the order chapter challenges unlock them. */
export const UNLOCK_ORDER = DATA.artists;

/** XP for each right answer in a challenge (see the lesson player). */
export const XP_PER_ANSWER = 10;

/** Bonus XP for finishing a challenge on a streak of two days or more. */
export const STREAK_BONUS = 10;

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
    const tip = "Write out the key's scale from its home note, then count up to the step you need. Majors go whole, whole, half, whole, whole, whole, half.";
    questions = round.questions.map((q) => ({ kind: "choice", prompt: q.prompt, options: q.options, answer: q.answer, sound: song(q.song), miss: q.miss, tip }));
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

/** Each round's name, its one-line description and the most XP it can give. */
export function challengeRounds(n: number): { name: string; about: string; maxXp: number }[] {
  const lesson = chapterChallenge(n);
  return (DATA.chapters[String(n)]?.rounds ?? []).map((r, i) => {
    const step = lesson?.steps[i];
    return { name: r.title.replace(/^Round \d+: /, ""), about: r.about, maxXp: step?.type === "practice" ? step.questions.length * XP_PER_ANSWER : 0 };
  });
}

/** The next artist a passed challenge unlocks, if any are left. */
export function nextArtist(owned: string[]): string | undefined {
  return UNLOCK_ORDER.find((a) => !owned.includes(a));
}
