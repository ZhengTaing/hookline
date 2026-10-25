import { describe, expect, it } from "vitest";
import { SETS, fullSets, mixArtists, mixSong, rarityOf } from "./cards";
import { UNLOCK_ORDER } from "./lessons/challenge";
import { allLessons } from "./lessons/content";
import { weakPractice } from "./progress";
import { challengeReward, lessonStreak, recordLearnDay, reviewReward, useFreeze } from "./rewards";
import { emptyProgress, type Progress } from "./store";

describe("rewards", () => {
  it("unlocks cards on a chapter's first pass only", () => {
    const first = challengeReward(emptyProgress(), 1, 8, 10, 0);
    expect(first.unlocked).toBe(UNLOCK_ORDER[0]);
    expect(first.progress.cleared).toEqual([1]);
    const again = challengeReward(first.progress, 1, 9, 10, 0);
    expect(again.replay).toBe(true);
    expect(again.unlocked).toBeUndefined();
    expect(again.progress.artists).toHaveLength(1);
  });
  it("lifts the chapter's card to Epic on a perfect replay", () => {
    const first = challengeReward(emptyProgress(), 1, 8, 10, 0);
    const perfect = challengeReward(first.progress, 1, 10, 10, 0);
    expect(perfect.upgraded).toBe(UNLOCK_ORDER[0]);
    expect(rarityOf(perfect.progress, UNLOCK_ORDER[0])).toBe(2);
  });
  it("treats a passing best score from before as a replay", () => {
    expect(challengeReward(emptyProgress(), 2, 10, 10, 0, 80).unlocked).toBeUndefined();
    expect(challengeReward(emptyProgress(), 2, 10, 10, 0, 40).unlocked).toBe(UNLOCK_ORDER[0]);
  });
  it("counts learning days and spends a freeze on one missed day", () => {
    let p: Progress = { ...emptyProgress(), learnDays: ["2026-10-22", "2026-10-23"], freezes: 1 };
    expect(lessonStreak(p, "2026-10-25")).toBe(0);
    p = useFreeze(p, "2026-10-25");
    expect(p.frozen).toEqual(["2026-10-24"]);
    expect(p.freezes).toBe(0);
    p = recordLearnDay(p, "2026-10-25");
    expect(lessonStreak(p, "2026-10-25")).toBe(4);
  });
  it("gives XP for remembered review cards and counts every review", () => {
    const p = reviewReward(reviewReward(emptyProgress(), "2026-10-25", true), "2026-10-25", false);
    expect(p.xp).toBe(5);
    expect(p.today?.reviews).toBe(2);
    expect(p.learnDays).toEqual(["2026-10-25"]);
  });
  it("adds a set-mix song once a set is full and its mix is on", () => {
    const rookie = UNLOCK_ORDER.slice(SETS[0][1], SETS[0][2]);
    const p = { ...emptyProgress(), artists: rookie, setMix: [0] };
    expect(fullSets(p)).toEqual([0]);
    expect(mixArtists(p)).toEqual(rookie);
    expect(mixSong("1.1", mixArtists(p))).toBeDefined();
    expect(mixArtists({ ...p, artists: rookie.slice(1) })).toEqual([]);
  });
  it("builds weak-spot practice from missed questions", () => {
    const lesson = allLessons()[0];
    const q = lesson.steps.flatMap((s) => (s.type === "practice" ? s.questions : [])).find((x) => "miss" in x)!;
    const p = { ...emptyProgress(), completedLessons: [lesson.id], review: [{ text: (q as { miss: string }).miss, due: "2026-10-26" }] };
    const weak = weakPractice(p);
    expect(weak?.steps[0].type).toBe("practice");
    expect(weakPractice(emptyProgress())).toBeUndefined();
  });
});
