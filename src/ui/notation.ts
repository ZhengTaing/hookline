import { NOTE_NAMES, OPEN_STRINGS, parseNote } from "../music";

/** Two notes on a treble staff. E4 sits on the bottom line. */
export function staffSvg(lower: string, upper: string): string {
  const y = (step: number) => 80 - (step - 30) * 5;
  let s = "";
  for (let i = 0; i < 5; i++) s += `<line x1="8" x2="268" y1="${40 + i * 10}" y2="${40 + i * 10}" />`;
  s += `<text class="clef" x="12" y="86">𝄞</text>`;
  [
    [lower, 140],
    [upper, 190],
  ].forEach(([name, xs]) => {
    const n = parseNote(name as string);
    const x = xs as number;
    const yy = y(n.step);
    for (let ly = 90; ly <= yy; ly += 10) s += `<line x1="${x - 14}" x2="${x + 14}" y1="${ly}" y2="${ly}" />`;
    for (let ly = 30; ly >= yy; ly -= 10) s += `<line x1="${x - 14}" x2="${x + 14}" y1="${ly}" y2="${ly}" />`;
    if (n.accidental) s += `<text class="acc" x="${x - 26}" y="${yy + 6}">${n.accidental === "b" ? "♭" : "♯"}</text>`;
    s += `<ellipse cx="${x}" cy="${yy}" rx="8" ry="5.5" transform="rotate(-20 ${x} ${yy})" />`;
  });
  return `<svg class="staff" viewBox="0 0 276 110" role="img" aria-label="Two notes on a treble staff">${s}</svg>`;
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
