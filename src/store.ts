import { supabase } from "./supabase";

export interface Progress {
  visits: string[];
  completedLessons: string[];
}

const EMPTY: Progress = { visits: [], completedLessons: [] };
const GUEST_KEY = "hookline.progress";

function normalize(data: unknown): Progress {
  const d = (data ?? {}) as Partial<Progress>;
  return {
    visits: Array.isArray(d.visits) ? d.visits : [],
    completedLessons: Array.isArray(d.completedLessons) ? d.completedLessons : [],
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
    return { ...EMPTY };
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
