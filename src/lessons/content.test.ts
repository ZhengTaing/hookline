import { describe, expect, it } from "vitest";
import { intervalName, parseNote } from "../music";
import { allLessons } from "./content";

const SIZE_WORDS: Record<number, string> = { 1: "unison", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th", 6: "6th", 7: "7th", 8: "8ve" };

describe("lesson content", () => {
  it("has unique lesson ids", () => {
    const ids = allLessons().map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("always includes the right answer among staff options", () => {
    for (const lesson of allLessons())
      for (const step of lesson.steps) {
        if (step.type !== "rush") continue;
        for (const q of step.questions) {
          if (q.kind !== "staff") continue;
          const size = parseNote(q.upper).step - parseNote(q.lower).step + 1;
          const answer = q.options.some((o) => /^[PMm+°]/.test(o)) ? intervalName(q.lower, q.upper) : SIZE_WORDS[size];
          expect(q.options, `${lesson.id} ${q.lower}-${q.upper}`).toContain(answer);
        }
      }
  });

  it("only uses song choices that include the answer", () => {
    for (const lesson of allLessons())
      for (const step of lesson.steps)
        if (step.type === "songMatch")
          for (const r of step.rounds) {
            expect(r.choices).toContain(r.song);
            expect(r.notes[1] - r.notes[0]).toBe({ P5: 7, m3: 3, M6: 9 }[r.interval]);
          }
  });
});
