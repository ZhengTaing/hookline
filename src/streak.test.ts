import { describe, expect, it } from "vitest";
import { bestStreak, currentStreak, recentDays, recordVisit } from "./streak";

describe("streak", () => {
  it("counts consecutive days ending today", () => {
    expect(currentStreak(["2026-10-22", "2026-10-23", "2026-10-24"], "2026-10-24")).toBe(3);
  });
  it("keeps yesterday's streak alive before today's visit", () => {
    expect(currentStreak(["2026-10-22", "2026-10-23"], "2026-10-24")).toBe(2);
  });
  it("resets after a missed day", () => {
    expect(currentStreak(["2026-10-20", "2026-10-21"], "2026-10-24")).toBe(0);
  });
  it("crosses month boundaries", () => {
    expect(currentStreak(["2026-09-30", "2026-10-01"], "2026-10-01")).toBe(2);
  });
  it("finds the best run", () => {
    expect(bestStreak(["2026-10-01", "2026-10-02", "2026-10-03", "2026-10-10"])).toBe(3);
  });
  it("records a visit once", () => {
    expect(recordVisit(["2026-10-24"], "2026-10-24")).toEqual(["2026-10-24"]);
    expect(recordVisit([], "2026-10-24")).toEqual(["2026-10-24"]);
  });
  it("lists recent days oldest first", () => {
    const days = recentDays(["2026-10-24"], "2026-10-24", 3);
    expect(days.map((d) => d.day)).toEqual(["2026-10-22", "2026-10-23", "2026-10-24"]);
    expect(days.at(-1)?.visited).toBe(true);
  });
});
