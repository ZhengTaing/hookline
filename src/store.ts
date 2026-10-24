import { supabase } from "./supabase";

export interface ReviewItem {
  text: string;
  /** Local day key when it should come back. */
  due: string;
}

export interface Progress {
  visits: string[];
  completedLessons: string[];
  xp: number;
  /** Best lesson score (XP earned in one run), by lesson id. */
  best: Record<string, number>;
  review: ReviewItem[];
}

const GUEST_KEY = "hookline.progress";

export function emptyProgress(): Progress {
  return { visits: [], completedLessons: [], xp: 0, best: {}, review: [] };
}

function normalize(data: unknown): Progress {
  const d = (data ?? {}) as Partial<Progress>;
  return {
    visits: Array.isArray(d.visits) ? d.visits : [],
    completedLessons: Array.isArray(d.completedLessons) ? d.completedLessons : [],
    xp: typeof d.xp === "number" ? d.xp : 0,
    best: d.best && typeof d.best === "object" ? d.best : {},
    review: Array.isArray(d.review) ? d.review : [],
  };
}

/** Progress is one JSON row per user in the `progress` table, or browser storage in guest mode. */
export async function loadProgress(userId: string | null): Promise<Progress> {
  if (supabase && userId) {
    const { data, error } = await supabase.from("progress").select("data").eq("user_id", userId).maybeSingle();
    if (error) throw error;
    return normalize(data?.data);
  }
  try {
    return normalize(JSON.parse(localStorage.getItem(GUEST_KEY) ?? "null"));
  } catch {
    return emptyProgress();
  }
}

export async function saveProgress(userId: string | null, progress: Progress): Promise<void> {
  if (supabase && userId) {
    const { error } = await supabase
      .from("progress")
      .upsert({ user_id: userId, data: progress, updated_at: new Date().toISOString() });
    if (error) throw error;
    return;
  }
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify(progress));
  } catch {
    // Private browsing can block storage. Progress just won't persist.
  }
}
