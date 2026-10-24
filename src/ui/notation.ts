import { NOTE_NAMES, OPEN_STRINGS, parseNote } from "../music";

// Treble staff: E4 (diatonic step 30) sits on the bottom line at y=80, lines are 10 apart.
const yFor = (step: number) => 80 - (step - 30) * 5;

// Where key-signature accidentals sit, as note names, in the standard order.
const SHARP_SPOTS = ["F5", "C5", "G5", "D5", "A4", "E5", "B4"];
const FLAT_SPOTS = ["B4", "E5", "A4", "D5", "G4", "C5", "F4"];

/**
 * Notes on a treble staff, left to right, or stacked when `chord` is set.
 * `keySig` is sharps (positive) or flats (negative).
 */
export function staffSvg(notes: string[], opts: { keySig?: number; chord?: boolean } = {}): string {
  const keySig = opts.keySig ?? 0;
  const sigWidth = Math.abs(keySig) * 10;
  const width = Math.max(276, 70 + sigWidth + (opts.chord ? 60 : notes.length * 34));
  let s = "";
  for (let i = 0; i < 5; i++) s += `<line x1="8" x2="${width - 8}" y1="${40 + i * 10}" y2="${40 + i * 10}" />`;
  s += `<text class="clef" x="12" y="86">𝄞</text>`;
  const spots = keySig > 0 ? SHARP_SPOTS : FLAT_SPOTS;
  for (let i = 0; i < Math.abs(keySig); i++) {
    const yy = yFor(parseNote(spots[i]).step);
    s += `<text class="acc" x="${58 + i * 10}" y="${yy + 6}">${keySig > 0 ? "♯" : "♭"}</text>`;
  }
  const startX = 84 + sigWidth;
  notes.forEach((name, i) => {
    const n = parseNote(name);
    const x = opts.chord ? startX + 20 : startX + i * 34 + (notes.length === 2 ? 22 : 0);
    const yy = yFor(n.step);
    for (let ly = 90; ly <= yy; ly += 10) s += `<line x1="${x - 13}" x2="${x + 13}" y1="${ly}" y2="${ly}" />`;
    for (let ly = 30; ly >= yy; ly -= 10) s += `<line x1="${x - 13}" x2="${x + 13}" y1="${ly}" y2="${ly}" />`;
    if (n.accidental) s += `<text class="acc" x="${x - 24}" y="${yy + 6}">${n.accidental === "b" ? "♭" : "♯"}</text>`;
    s += `<ellipse cx="${x}" cy="${yy}" rx="7.5" ry="5.2" transform="rotate(-20 ${x} ${yy})" />`;
  });
  return `<svg class="staff" viewBox="0 0 ${width} 110" role="img" aria-label="Notes on a treble staff">${s}</svg>`;
}

export interface FretMark {
  string: number;
  fret: number;
  tone: "given" | "right" | "wrong";
}

/** Frets 0-5 of a guitar neck, high E on top. Each position is a tappable `.spot`. */
export function fretboardSvg(marks: FretMark[]): string {
  const X = (f: number) => 22 + f * 46;
  const Y = (st: number) => 14 + st * 22;
  let s = `<line class="nut" x1="44" x2="44" y1="14" y2="124" />`;
  for (let f = 1; f <= 5; f++) s += `<line class="fret" x1="${X(f) + 22}" x2="${X(f) + 22}" y1="14" y2="124" />`;
  for (const f of [3, 5]) s += `<circle class="inlay" cx="${X(f)}" cy="${Y(2) + 11}" r="3" />`;
  for (let st = 0; st < 6; st++)
    s += `<line class="string" x1="${X(0)}" x2="274" y1="${Y(st)}" y2="${Y(st)}" stroke-width="${0.8 + st * 0.25}" />`;
  for (let f = 0; f <= 5; f++) s += `<text class="fret-n" x="${X(f)}" y="134">${f}</text>`;
  ["e", "B", "G", "D", "A", "E"].forEach((n, st) => (s += `<text class="fret-n" x="5" y="${Y(st) + 3.5}">${n}</text>`));
  for (let st = 0; st < 6; st++)
    for (let f = 0; f <= 5; f++) {
      const mark = marks.find((m) => m.string === st && m.fret === f);
      s += `<g class="spot" data-string="${st}" data-fret="${f}"><rect x="${X(f) - 22}" y="${Y(st) - 11}" width="44" height="22" />`;
      if (mark)
        s += `<circle class="mark ${mark.tone}" cx="${X(f)}" cy="${Y(st)}" r="9" /><text class="mark-t" x="${X(f)}" y="${Y(st) + 3.5}">${NOTE_NAMES[(OPEN_STRINGS[st] + f) % 12]}</text>`;
      s += `</g>`;
    }
  return `<svg class="fretboard" viewBox="0 0 280 140" role="img" aria-label="Guitar fretboard, frets 0 to 5">${s}</svg>`;
}
