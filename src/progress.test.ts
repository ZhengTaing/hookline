import { describe, expect, it } from "vitest";
import { applyResult, isUnlocked, nextLessonId } from "./progress";
import { emptyProgress } from "./store";

const result = { lessonId: "1.1", xp: 80, correct: 7, total: 8, bestCombo: 5, missed: ["Where B is on the neck"] };

describe("progress", () => {
  it("records a finished lesson, XP, best score and review items", () => {
    const p = applyResult(emptyProgress(), result, "2026-10-25");
    expect(p.completedLessons).toEqual(["1.1"]);
    expect(p.xp).toBe(80);
    expect(p.best["1.1"]).toBe(80);
    expect(p.review).toEqual([{ text: "Where B is on the neck", due: "2026-10-25" }]);
  });
  it("keeps the best score and doesn't duplicate review items on a replay", () => {
    let p = applyResult(emptyProgress(), result, "2026-10-25");
    p = applyResult(p, { ...result, xp: 40 }, "2026-10-26");
    expect(p.best["1.1"]).toBe(80);
    expect(p.xp).toBe(120);
    expect(p.review).toHaveLength(1);
    expect(p.completedLessons).toEqual(["1.1"]);
  });
  it("unlocks lessons in order", () => {
    const p = applyResult(emptyProgress(), result, "2026-10-25");
    expect(nextLessonId(p)).toBe("1.4");
    expect(isUnlocked(p, "1.4")).toBe(true);
    expect(isUnlocked(p, "5.1")).toBe(false);
  });
});
