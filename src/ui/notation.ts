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

/** Beats per rhythm token, in quarter notes. A token ending in "r" is a rest; "t" is a triplet eighth; "~" ties. */
const TOKEN_BEATS: Record<string, number> = { w: 4, "h.": 3, h: 2, "q.": 1.5, q: 1, "e.": 0.75, e: 0.5, s: 0.25, t: 1 / 3 };

/** Durations in beats for a rhythm, rests negative, with tied notes merged. */
export function rhythmBeats(tokens: string[]): number[] {
  const out: number[] = [];
  let tie = false;
  for (const t of tokens) {
    if (t === "~") {
      tie = true;
      continue;
    }
    if (t === "|") continue;
    const rest = t.endsWith("r");
    const beats = TOKEN_BEATS[rest ? t.slice(0, -1) : t] ?? 1;
    if (tie && out.length) out[out.length - 1] += beats;
    else out.push(rest ? -beats : beats);
    tie = false;
  }
  return out;
}

/**
 * Rhythm on one line: note values (w h h. q q. e e. s t), rests (wr hr qr er), and "~" to tie
 * two notes. `time` like "4/4" draws a time signature first; "|" draws a bar line.
 */
export function rhythmSvg(tokens: string[], time?: string): string {
  const line = 70;
  let s = "";
  let x = 26;
  if (time) {
    const [top, bottom] = time.split("/");
    s += `<text class="time" x="${x}" y="${line - 6}" text-anchor="middle">${top}</text><text class="time" x="${x}" y="${line + 22}" text-anchor="middle">${bottom}</text>`;
    x += 30;
  }
  const notes = tokens.filter((t) => t !== "~" && t !== "|");
  const total = notes.reduce((n, t) => n + (TOKEN_BEATS[t.replace(/r$/, "")] ?? 1), 0);
  const unit = Math.min(52, (284 - x - 20) / Math.max(total, 1));
  const heads: number[] = [];
  const ties: number[] = [];
  let tripletRun: number[] = [];
  const flushTriplet = () => {
    if (tripletRun.length >= 3) s += `<text class="tuplet" x="${(tripletRun[0] + tripletRun[tripletRun.length - 1]) / 2 + 6}" y="22" text-anchor="middle">3</text>`;
    tripletRun = [];
  };
  for (const t of tokens) {
    if (t === "~") {
      ties.push(heads.length - 1);
      continue;
    }
    if (t === "|") {
      s += `<line x1="${x + 4}" x2="${x + 4}" y1="${line - 18}" y2="${line + 18}" />`;
      x += 16;
      continue;
    }
    const rest = t.endsWith("r");
    const v = rest ? t.slice(0, -1) : t;
    const beats = TOKEN_BEATS[v] ?? 1;
    const cx = x + 8;
    if (rest) {
      if (v === "w") s += `<rect x="${cx - 8}" y="${line}" width="16" height="6" />`;
      else if (v === "h") s += `<rect x="${cx - 8}" y="${line - 6}" width="16" height="6" />`;
      else if (v === "q") s += `<path class="rest" d="M${cx - 3} ${line - 18} l6 7 l-6 6 l6 7 q-7 -2 -3 6" />`;
      else s += `<circle cx="${cx - 2}" cy="${line - 6}" r="3" /><path class="rest" d="M${cx - 2} ${line - 4} q5 1 6 -3 l-6 18" />`;
      heads.push(cx);
      flushTriplet();
    } else {
      const open = v === "w" || v.startsWith("h");
      s += `<ellipse class="${open ? "open" : ""}" cx="${cx}" cy="${line}" rx="7" ry="5" transform="rotate(-20 ${cx} ${line})" />`;
      if (v !== "w") s += `<line x1="${cx + 6.5}" x2="${cx + 6.5}" y1="${line - 2}" y2="${line - 36}" />`;
      const flags = v.startsWith("e") || v === "t" ? 1 : v === "s" ? 2 : 0;
      for (let f = 0; f < flags; f++) s += `<path class="flag" d="M${cx + 6.5} ${line - 36 + f * 8} q4 6 10 9 q-2 4 -3 8" />`;
      if (v.endsWith(".")) s += `<circle cx="${cx + 14}" cy="${line - 2}" r="2.2" />`;
      heads.push(cx);
      if (v === "t") {
        tripletRun.push(cx);
        if (tripletRun.length === 3) flushTriplet();
      } else flushTriplet();
    }
    x += Math.max(22, beats * unit);
  }
  flushTriplet();
  for (const i of ties) if (heads[i + 1] !== undefined) s += `<path class="tie" d="M${heads[i] + 2} ${line + 9} q${(heads[i + 1] - heads[i]) / 2} 12 ${heads[i + 1] - heads[i] - 4} 0" />`;
  // Busy rhythms (lots of short notes) get a wider picture that scales down, instead of running off the edge.
  const width = Math.max(300, x + 16);
  s = `<line x1="8" x2="${width - 8}" y1="${line}" y2="${line}" />` + s;
  return `<svg class="staff rhythm" viewBox="0 0 ${width} 110" role="img" aria-label="A rhythm${time ? ` in ${time}` : ""}">${s}</svg>`;
}
