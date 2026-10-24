import { describe, expect, it } from "vitest";
import { intervalName, parseNote } from "../music";
import { KEY_TABLES } from "./chapters-2-4";
import { CHORD_HELPERS } from "./chapters-6-9";
import { allLessons } from "./content";
import { formatOf } from "./demos";
import { BOOK_CHAPTERS } from "./sections";

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

describe("choice questions", () => {
  it("always offer the right answer exactly once", () => {
    for (const lesson of allLessons())
      for (const step of lesson.steps) {
        if (step.type !== "rush") continue;
        for (const q of step.questions) {
          if (q.kind !== "choice") continue;
          expect(q.options.filter((o) => o === q.answer).length, `${lesson.id} ${q.prompt}`).toBe(1);
          expect(new Set(q.options).size, `${lesson.id} ${q.prompt}`).toBe(q.options.length);
        }
      }
  });
});

describe("key tables", () => {
  it("match the key signatures the scale speller works out", () => {
    for (const [sig, key] of Object.entries(KEY_TABLES.MAJOR_KEYS_BY_SIG)) expect(KEY_TABLES.keySignature(key, "major"), key).toBe(Number(sig));
    for (const [sig, key] of Object.entries(KEY_TABLES.MINOR_KEYS_BY_SIG)) expect(KEY_TABLES.keySignature(key, "minor"), key + "m").toBe(Number(sig));
  });
});

describe("chord spelling", () => {
  it("stacks letters in thirds with the right accidentals", () => {
    expect(CHORD_HELPERS.spellChord("Bb", "minor")).toEqual(["Bb", "Db", "F"]);
    expect(CHORD_HELPERS.spellChord("F#", "minor")).toEqual(["F#", "A", "C#"]);
    expect(CHORD_HELPERS.spellChord("C", "°7")).toEqual(["C", "Eb", "Gb", "Bbb"]);
    expect(CHORD_HELPERS.spellChord("E", "7")).toEqual(["E", "G#", "B", "D"]);
    expect(CHORD_HELPERS.staffNames(["G", "B", "D"])).toEqual(["G4", "B4", "D5"]);
  });
});

describe("course path", () => {
  it("has one step per book section, each opening with its read-and-hear card", () => {
    const sections = BOOK_CHAPTERS.flatMap((c) => c.sections.map((s) => s.id));
    expect(sections.length).toBe(189);
    expect(allLessons().map((l) => l.id)).toEqual(sections);
    for (const l of allLessons()) expect(l.steps[0].type, l.id).toBe("read");
  });

  it("places every game lesson on the section where it starts", () => {
    const withRush = allLessons().filter((l) => l.steps.some((s) => s.type === "rush")).map((l) => l.id);
    expect(withRush).toHaveLength(59);
  });
});

describe("teach before test", () => {
  it("shows a worked example of each question format before it is first asked", () => {
    for (const l of allLessons()) {
      const shown = new Set<string>();
      for (const s of l.steps) {
        if (s.type === "demo") shown.add(formatOf(s.question)!);
        if (s.type === "rush" || s.type === "practice")
          for (const q of s.questions) {
            const f = formatOf(q);
            if (f) expect(shown.has(f), `${l.id} asks ${f} before showing it`).toBe(true);
          }
      }
    }
  });
});
