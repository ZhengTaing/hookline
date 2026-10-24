import { describe, expect, it } from "vitest";
import { intervalName, parseNote } from "./music";

describe("music", () => {
  it("parses notes", () => {
    expect(parseNote("C4").midi).toBe(60);
    expect(parseNote("Eb4").midi).toBe(63);
    expect(parseNote("F#3").midi).toBe(54);
  });
  it("names intervals by spelling", () => {
    expect(intervalName("C4", "E4")).toBe("M3");
    expect(intervalName("C4", "Eb4")).toBe("m3");
    expect(intervalName("F4", "B4")).toBe("+4");
    expect(intervalName("B4", "F5")).toBe("°5");
    expect(intervalName("E4", "C5")).toBe("m6");
    expect(intervalName("C4", "C5")).toBe("P8");
  });
});
