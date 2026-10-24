import { describe, expect, it } from "vitest";
import { diatonicChord, intervalName, keySignature, parseNote, scaleMidi, spellScale } from "./music";

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

describe("scales and keys", () => {
  it("spells major scales with each letter once", () => {
    expect(spellScale("D", "major")).toEqual(["D", "E", "F#", "G", "A", "B", "C#"]);
    expect(spellScale("Bb", "major")).toEqual(["Bb", "C", "D", "Eb", "F", "G", "A"]);
    expect(spellScale("F#", "major")).toEqual(["F#", "G#", "A#", "B", "C#", "D#", "E#"]);
  });
  it("spells minor scales, including harmonic minor", () => {
    expect(spellScale("A", "minor")).toEqual(["A", "B", "C", "D", "E", "F", "G"]);
    expect(spellScale("C", "minor")).toEqual(["C", "D", "Eb", "F", "G", "Ab", "Bb"]);
    expect(spellScale("A", "minor", [7])).toEqual(["A", "B", "C", "D", "E", "F", "G#"]);
  });
  it("counts key signatures", () => {
    expect(keySignature("G", "major")).toBe(1);
    expect(keySignature("Eb", "major")).toBe(-3);
    expect(keySignature("C", "minor")).toBe(-3);
    expect(keySignature("E", "minor")).toBe(1);
    expect(keySignature("C#", "major")).toBe(7);
  });
  it("turns a scale into rising MIDI notes", () => {
    expect(scaleMidi(spellScale("C", "major"))).toEqual([60, 62, 64, 65, 67, 69, 71, 72]);
    expect(scaleMidi(spellScale("A", "minor"))).toEqual([69, 71, 72, 74, 76, 77, 79, 81]);
  });
});

describe("diatonicChord", () => {
  it("builds the triads of a major key", () => {
    expect([1, 2, 3, 4, 5, 6, 7].map((d) => diatonicChord("C", "major", d).roman)).toEqual(["I", "ii", "iii", "IV", "V", "vi", "vii°"]);
    expect([1, 2, 3, 4, 5, 6, 7].map((d) => diatonicChord("G", "major", d).symbol)).toEqual(["G", "Am", "Bm", "C", "D", "Em", "F♯°"]);
  });

  it("builds minor-key triads with a raised leading tone on V and vii°", () => {
    expect([1, 2, 3, 4, 5, 6, 7].map((d) => diatonicChord("A", "minor", d).roman)).toEqual(["i", "ii°", "III", "iv", "V", "VI", "vii°"]);
    expect(diatonicChord("A", "minor", 5).notes).toEqual(["E", "G#", "B"]);
  });

  it("builds diatonic seventh chords", () => {
    expect([1, 2, 3, 4, 5, 6, 7].map((d) => diatonicChord("C", "major", d, true).roman)).toEqual(["Imaj7", "ii7", "iii7", "IVmaj7", "V7", "vi7", "viiø7"]);
    expect(diatonicChord("F", "major", 5, true).symbol).toBe("C7");
  });
});
