import { describe, expect, it } from "vitest";
import { QUEST_GOAL, addCards, claimDaily, countToday, featuredSections, levelCards, openPack, questFor, rarityOf, unlockRarity } from "./cards";
import { emptyProgress } from "./store";

describe("cards", () => {
  it("earns rarity from score and streak", () => {
    expect(unlockRarity(0.8, 1)).toBe(0);
    expect(unlockRarity(0.8, 3)).toBe(1);
    expect(unlockRarity(1, 0)).toBe(2);
  });
  it("levels a card up after its artist quest", () => {
    let p = addCards(emptyProgress(), ["Olivia Rodrigo"], 0);
    expect(rarityOf(p, "Olivia Rodrigo")).toBe(0);
    const ids = featuredSections("Olivia Rodrigo").slice(0, QUEST_GOAL);
    expect(ids).toHaveLength(QUEST_GOAL);
    p = { ...p, completedLessons: ids };
    expect(questFor(p, "Olivia Rodrigo")?.done).toBe(QUEST_GOAL);
    const { progress, upgraded } = levelCards(p);
    expect(upgraded).toEqual(["Olivia Rodrigo"]);
    expect(rarityOf(progress, "Olivia Rodrigo")).toBe(1);
    expect(questFor(progress, "Olivia Rodrigo")?.done).toBe(0);
  });
  it("claims a daily quest once, only when done", () => {
    let p = claimDaily(emptyProgress(), "2026-10-25", 0);
    expect(p.xp).toBe(0);
    p = countToday(p, "2026-10-25", 40, true);
    p = claimDaily(claimDaily(p, "2026-10-25", 0), "2026-10-25", 0);
    expect(p.xp).toBe(20);
    expect(countToday(p, "2026-10-26", 0, false).today?.sections).toBe(0);
  });
  it("opens the weekly pack on a 5-day streak", () => {
    const visits = ["2026-10-21", "2026-10-22", "2026-10-23", "2026-10-24", "2026-10-25"];
    const { progress, artist } = openPack({ ...emptyProgress(), learnDays: visits }, "2026-10-25");
    expect(artist).toBe("Olivia Rodrigo");
    expect(rarityOf(progress, "Olivia Rodrigo")).toBe(1);
    expect(openPack(progress, "2026-10-25").artist).toBeUndefined();
  });
});
