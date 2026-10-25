import { doc, getDoc, setDoc } from "firebase/firestore";
import { cloud } from "./firebase";

export interface ReviewItem {
  /** The front of the card: a question, or a fact to remember when there's no back. */
  text: string;
  back?: string;
  /** Local day key when it should come back. */
  due: string;
  /** How many times in a row it was remembered; sets the next gap. */
  box?: number;
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
const RESET_KEY = "hookline.resetTag";

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

/** Progress is one Firestore document per user, `progress/{uid}`, or browser storage in guest mode. */
export async function loadProgress(userId: string | null): Promise<Progress> {
  if (cloud && userId) {
    const snap = await getDoc(doc(cloud.db, "progress", userId));
    if (snap.exists()) return normalize(snap.data().data);
    // First sign-in: start from whatever was played on this device as a guest.
    return loadProgress(null);
  }
  try {
    // Test builds carry a reset tag; a new tag starts guest progress over.
    const tag = import.meta.env.VITE_RESET_TAG as string | undefined;
    if (tag && localStorage.getItem(RESET_KEY) !== tag) {
      localStorage.removeItem(GUEST_KEY);
      localStorage.setItem(RESET_KEY, tag);
    }
    return normalize(JSON.parse(localStorage.getItem(GUEST_KEY) ?? "null"));
  } catch {
    return emptyProgress();
  }
}

export async function saveProgress(userId: string | null, progress: Progress): Promise<void> {
  if (cloud && userId) {
    await setDoc(doc(cloud.db, "progress", userId), { data: progress, updatedAt: new Date().toISOString() });
    return;
  }
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify(progress));
  } catch {
    // Private browsing can block storage. Progress just won't persist.
  }
}
