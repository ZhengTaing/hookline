import { describe, expect, it } from "vitest";
import { intervalName, parseNote } from "../music";
import { KEY_TABLES } from "./chapters-2-4";
import { CHORD_HELPERS } from "./chapters-6-9";
import { NEW_LAYOUT, allLessons, chapterPractice } from "./content";
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

describe("put it in order", () => {
  it("keeps given slots in the answer and offers every missing note as a tile", () => {
    for (const l of allLessons())
      for (const s of l.steps)
        if (s.type === "practice")
          for (const q of s.questions)
            if (q.kind === "order") {
              expect(q.given.length, l.id).toBe(q.answer.length);
              q.given.forEach((g, i) => g !== null && expect(g, l.id).toBe(q.answer[i]));
              const missing = q.answer.filter((_, i) => q.given[i] === null);
              for (const m of missing) expect(q.tiles, `${l.id} ${q.prompt}`).toContain(m);
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
  it("has one step per book section, each opening with its read-and-hear card or story cards", () => {
    const sections = BOOK_CHAPTERS.flatMap((c) => c.sections.map((s) => s.id));
    expect(sections.length).toBe(189);
    expect(allLessons().map((l) => l.id)).toEqual(sections);
    for (const l of allLessons()) expect(["read", "story"], l.id).toContain(l.steps[0].type);
  });

  it("follows the mockup's steps, with no duels or timed rounds", () => {
    const gameTypes = new Set(["duel", "rush", "songMatch"]);
    const moved = allLessons().filter((l) => NEW_LAYOUT.has(Number(l.id.split(".")[0])));
    expect(moved.length).toBeGreaterThan(0);
    for (const l of moved) {
      for (const s of l.steps) expect(gameTypes.has(s.type), `${l.id} has a ${s.type} step`).toBe(false);
      expect(l.steps.some((s) => s.type === "practice" && s.title === "Use it in real songs"), `${l.id} has no real-song step`).toBe(true);
    }
  });

  it("builds each short check from the section's own card", () => {
    for (const ch of BOOK_CHAPTERS)
      for (const sec of ch.sections) {
        if (!NEW_LAYOUT.has(ch.n)) continue;
        const lesson = allLessons().find((l) => l.id === sec.id)!;
        const own = [sec.headline, ...(sec.ex ?? []).map((e) => e.slice(0, e.lastIndexOf("=")))];
        for (const s of lesson.steps)
          if (s.type === "practice" && s.title === "Check")
            for (const q of s.questions) if (q.kind === "choice") expect(own, `${sec.id} check`).toContain(q.answer);
      }
  });
});

describe("chapter practice", () => {
  it("gathers every question from a chapter's sections without story cards", () => {
    const drill = chapterPractice(2)!;
    expect(drill.steps.some((s) => s.type === "story")).toBe(false);
    const count = (steps: typeof drill.steps) => steps.reduce((n, s) => n + (s.type === "practice" ? s.questions.length : 0), 0);
    const lessons = allLessons().filter((l) => l.id.startsWith("2."));
    expect(count(drill.steps)).toBe(lessons.reduce((n, l) => n + count(l.steps), 0));
  });
});
