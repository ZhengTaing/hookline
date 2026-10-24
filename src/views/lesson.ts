import { chord, feedback, melodic, tone } from "../audio";
import { INTERVAL_WORDS, NOTE_NAMES, displayName, fretMidi, intervalName, parseNote } from "../music";
import type { DuelRound, Lesson, RushQuestion, Sound, Step, Visual } from "../lessons/types";
import { spotsFor } from "../lessons/demos";
import { fretboardSvg, staffSvg } from "../ui/notation";

export interface LessonResult {
  lessonId: string;
  xp: number;
  correct: number;
  total: number;
  bestCombo: number;
  /** Short descriptions of what was missed, for review cards. */
  missed: string[];
  /** The section's key fact, added as a review card. */
  fact?: { front: string; back: string };
}

const SIZE_WORDS: Record<number, string> = { 1: "unison", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th", 6: "6th", 7: "7th", 8: "8ve" };

function play(sound: Sound): void {
  if (sound.kind === "melodic") melodic(sound.notes, sound.gap);
  if (sound.kind === "chord") chord(sound.notes);
  if (sound.kind === "progression") sound.chords.forEach((c, i) => chord(c, i * (sound.gap ?? 0.9)));
  if (sound.kind === "withChord") {
    const gap = sound.gap ?? 0.5;
    sound.chord.forEach((n) => tone(n, 0, gap * sound.notes.length + 0.6, 0.07));
    melodic(sound.notes, gap);
  }
}

function visualHtml(v: Visual): string {
  if (v.type === "staff") return staffSvg(v.notes, { keySig: v.keySig, chord: v.chord });
  if (v.type === "big") return `<p class="big-note${v.text.length > 8 ? " long" : ""}">${v.text}</p>${v.caption ? `<p class="hint">${v.caption}</p>` : ""}`;
  return fretboardSvg(v.marks.map((m) => ({ ...m, tone: "given" as const })));
}

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Runs a lesson inside `root`, one step at a time. Calls `onFinish` with the
 * result, or `onExit` if the person leaves early.
 */
export function runLesson(
  root: HTMLElement,
  lesson: Lesson,
  onFinish: (result: LessonResult) => void,
  onExit: () => void,
): () => void {
  const result: LessonResult = { lessonId: lesson.id, xp: 0, correct: 0, total: 0, bestCombo: 0, missed: [], fact: lesson.fact };
  let stepIndex = 0;
  let cleanup: (() => void) | null = null;

  const score = (ok: boolean, xp: number, miss: string) => {
    result.total++;
    if (ok) {
      result.correct++;
      result.xp += xp;
    } else {
      result.missed.push(miss);
    }
    feedback(ok);
  };

  function frame(inner: string): void {
    const bars = lesson.steps.map((_, i) => `<i class="${i <= stepIndex ? "on" : ""}"></i>`).join("");
    root.innerHTML = `
      <div class="lesson">
        <div class="lesson-top">
          <button class="x" type="button" data-exit aria-label="Leave lesson">×</button>
          <div class="steps">${bars}</div>
        </div>
        <div class="lesson-body">${inner}</div>
      </div>`;
    root.querySelector("[data-exit]")!.addEventListener("click", () => {
      cleanup?.();
      onExit();
    });
  }

  function next(): void {
    cleanup?.();
    cleanup = null;
    stepIndex++;
    if (stepIndex >= lesson.steps.length) onFinish(result);
    else runStep(lesson.steps[stepIndex]);
  }

  function runStep(step: Step): void {
    if (step.type === "story") story(step.cards);
    else if (step.type === "duel") duel(step.rounds);
    else if (step.type === "rush") rush(step.seconds, step.source, step.questions);
    else if (step.type === "practice") rush(0, step.title, step.questions);
    else if (step.type === "read") read(step);
    else if (step.type === "demo") demo(step);
    else if (step.type === "realSong") realSong(step);
    else if (step.type === "songMatch") songMatch(step.rounds);
    else tapBeat(step);
  }

  // ---- story cards ----
  function story(cards: Extract<Step, { type: "story" }>["cards"]): void {
    let i = 0;
    const draw = (withSound: boolean) => {
      const c = cards[i];
      const dots = cards.map((_, k) => `<i class="${k <= i ? "on" : ""}"></i>`).join("");
      const viz =
        c.left || c.right
          ? `<div class="viz"><span class="bubble fill">${c.left ?? ""}</span><span class="gap"><span>${c.label ?? ""}</span></span><span class="bubble">${c.right ?? ""}</span></div>`
          : `<div class="viz"><span class="bubble fill">♪</span></div>`;
      const last = i === cards.length - 1;
      frame(`
        <div class="minibars">${dots}</div>
        <p class="eyebrow">Intro · book section ${lesson.section}</p>
        <button class="story" type="button" data-tap aria-label="${last ? "Hear it again" : "Next card"}">
          ${viz}<span class="story-text">${c.text}</span>
        </button>
        <p class="hint">${last ? "Tap the card to hear it again" : "Tap the card for the next one"}</p>
        ${last ? `<button class="btn" type="button" data-next>Got it</button>` : ""}`);
      if (withSound) play(c.sound);
      root.querySelector("[data-tap]")!.addEventListener("click", () => {
        if (i < cards.length - 1) {
          i++;
          draw(true);
        } else play(c.sound);
      });
      root.querySelector("[data-next]")?.addEventListener("click", next);
    };
    draw(stepIndex > 0);
  }

  // ---- sound duel ----
  function duel(rounds: DuelRound[]): void {
    let r = 0;
    const draw = () => {
      const round = rounds[r];
      const root0 = 55 + Math.floor(Math.random() * 8);
      const targetSide = Math.random() < 0.5 ? "A" : "B";
      const notesFor = (side: string) => (side === targetSide ? round.target : round.other).map((n) => root0 + n);
      const sound = (side: string) => {
        const n = notesFor(side);
        const mode = round.play ?? (n.length > 2 ? "chord" : "melodic");
        if (mode === "chord") chord(n);
        else melodic(n, n.length > 2 ? 0.22 : 0.45);
      };
      let answered = false;
      frame(`
        <p class="eyebrow">Hear it · duel ${r + 1} of ${rounds.length}</p>
        <h2>${round.question}</h2>
        <div class="duel">
          <button type="button" data-play="A">A<small>tap to play</small></button>
          <button type="button" data-play="B">B<small>tap to play</small></button>
        </div>
        <div class="opts">
          <button class="opt" type="button" data-pick="A">A</button>
          <button class="opt" type="button" data-pick="B">B</button>
        </div>
        <p class="fb" aria-live="polite">Play both, then pick.</p>
        <button class="btn push" type="button" data-next disabled>${r < rounds.length - 1 ? "Next duel" : "Continue"}</button>`);
      root.querySelectorAll<HTMLButtonElement>("[data-play]").forEach((b) =>
        b.addEventListener("click", () => sound(b.dataset.play!)),
      );
      root.querySelectorAll<HTMLButtonElement>("[data-pick]").forEach((b) =>
        b.addEventListener("click", () => {
          if (answered) return;
          answered = true;
          const ok = b.dataset.pick === targetSide;
          root.querySelector(`[data-play="${targetSide}"]`)!.classList.add("right");
          b.classList.add(ok ? "right" : "wrong");
          const fb = root.querySelector(".fb")!;
          fb.className = `fb ${ok ? "ok" : "no"}`;
          fb.textContent = `${ok ? "Yes." : `It was ${targetSide}.`} ${round.why}`;
          score(ok, 10, `Hearing a ${round.targetLabel}`);
          root.querySelector<HTMLButtonElement>("[data-next]")!.disabled = false;
        }),
      );
      root.querySelector("[data-next]")!.addEventListener("click", () => {
        if (r < rounds.length - 1) {
          r++;
          draw();
        } else next();
      });
    };
    draw();
  }

  // ---- timed rush ----
  /** The timed speed round. With `seconds` 0 it's an untimed practice set, and `source` is its title. */
  function rush(seconds: number, source: string, questions: RushQuestion[]): void {
    const untimed = seconds === 0;
    const order = untimed ? questions : shuffle(questions);
    const end = Date.now() + seconds * 1000;
    let q = 0;
    let combo = 0;
    let points = 0;
    let locked = false;
    let finished = false;
    const multiplier = () => Math.min(1 + Math.floor(combo / 2), 4);

    const timer = untimed ? 0 : window.setInterval(() => {
      const left = Math.max(0, end - Date.now());
      const bar = root.querySelector<HTMLElement>(".timer i");
      if (bar) bar.style.width = `${(left / (seconds * 1000)) * 100}%`;
      const t = root.querySelector(".time");
      if (t) t.textContent = String(Math.ceil(left / 1000));
      if (left <= 0 && !finished) next();
    }, 150);
    cleanup = () => {
      finished = true;
      window.clearInterval(timer);
    };

    const answer = (ok: boolean, miss: string) => {
      if (ok) {
        combo++;
        result.bestCombo = Math.max(result.bestCombo, combo);
        points += 10 * multiplier();
      } else combo = 0;
      score(ok, ok ? (untimed ? 5 : 10 * multiplier()) : 0, miss);
      locked = true;
      if (untimed) {
        const btn = root.querySelector<HTMLButtonElement>("[data-next]")!;
        btn.disabled = false;
        btn.addEventListener("click", () => {
          if (q < order.length - 1) {
            q++;
            locked = false;
            draw();
          } else next();
        });
        return;
      }
      window.setTimeout(() => {
        if (finished) return;
        locked = false;
        if (q < order.length - 1) {
          q++;
          draw();
        } else next();
      }, 900);
    };

    const head = () => {
      if (untimed) return `<p class="eyebrow">${source} · ${q + 1} of ${order.length}</p>`;
      const left = Math.max(0, end - Date.now());
      return `
        <div class="hud"><span>Score <b>${points}</b></span><span>${q + 1}/${order.length} · <b class="time">${Math.ceil(left / 1000)}</b>s</span></div>
        <div class="timer"><i style="width:${(left / (seconds * 1000)) * 100}%"></i></div>
        <div class="combo">${combo >= 2 ? `Combo ×${multiplier()} · ${combo} in a row` : ""}</div>`;
    };

    const foot = () => (untimed ? `<button class="btn push" type="button" data-next disabled>${q < order.length - 1 ? "Next" : "Continue"}</button>` : "");
    const plus = () => (untimed ? "Yes!" : `+${10 * Math.min(1 + Math.floor((combo + 1) / 2), 4)}`);

    const draw = () => {
      const question = order[q];
      if (question.kind === "staff") {
        const named = question.options.some((o) => /^[PMm+°]/.test(o));
        const size = parseNote(question.upper).step - parseNote(question.lower).step + 1;
        const right = named ? intervalName(question.lower, question.upper) : SIZE_WORDS[size];
        frame(`${head()}
          ${untimed ? "" : `<p class="eyebrow">Book ${source}</p>`}
          <h2>${named ? "Name this interval" : "How big is this interval?"}</h2>
          ${staffSvg([question.lower, question.upper])}
          <div class="opts">${question.options.map((o) => `<button class="opt" type="button" data-o="${o}">${o}</button>`).join("")}</div>
          <p class="fb" aria-live="polite"></p>${foot()}`);
        root.querySelectorAll<HTMLButtonElement>("[data-o]").forEach((b) =>
          b.addEventListener("click", () => {
            if (locked) return;
            const ok = b.dataset.o === right;
            b.classList.add(ok ? "right" : "wrong");
            if (!ok) root.querySelector(`[data-o="${right}"]`)!.classList.add("right");
            const fb = root.querySelector(".fb")!;
            fb.className = `fb ${ok ? "ok" : "no"}`;
            fb.textContent = ok ? plus() : `It's a ${right}.`;
            melodic([parseNote(question.lower).midi, parseNote(question.upper).midi], 0.45);
            answer(ok, `${displayName(question.lower)} up to ${displayName(question.upper)} is a ${right}`);
          }),
        );
        return;
      }

      if (question.kind === "choice") {
        const options = shuffle(question.options);
        frame(`${head()}
          ${untimed ? "" : `<p class="eyebrow">Book ${source}</p>`}
          <h2>${question.prompt}</h2>
          ${question.visual ? visualHtml(question.visual) : ""}
          ${question.sound ? `<button class="${question.visual ? "btn ghost" : "play-big"}" type="button" data-sound>▶ Play</button>` : ""}
          <div class="opts${options.some((o) => o.length > 14) ? " stack" : ""}">${options.map((o) => `<button class="opt" type="button" data-o="${o}">${o}</button>`).join("")}</div>
          <p class="fb" aria-live="polite"></p>${foot()}`);
        if (question.sound) {
          const s = question.sound;
          root.querySelector("[data-sound]")!.addEventListener("click", () => play(s));
          play(s);
        }
        root.querySelectorAll<HTMLButtonElement>("[data-o]").forEach((b) =>
          b.addEventListener("click", () => {
            if (locked) return;
            const ok = b.dataset.o === question.answer;
            b.classList.add(ok ? "right" : "wrong");
            if (!ok) root.querySelector(`[data-o="${CSS.escape(question.answer)}"]`)!.classList.add("right");
            const fb = root.querySelector(".fb")!;
            fb.className = `fb ${ok ? "ok" : "no"}`;
            fb.textContent = ok ? plus() : `It's ${question.answer}.`;
            answer(ok, question.miss);
          }),
        );
        return;
      }

      const given =
        question.kind === "fretInterval" ? { string: question.string, fret: question.fret } : null;
      const prompt =
        question.kind === "fretInterval"
          ? `Tap a ${question.label} above ${NOTE_NAMES[fretMidi(question.string, question.fret) % 12]}`
          : question.prompt ?? `Find ${NOTE_NAMES[question.pitchClass]}`;
      const drawBoard = (hit?: { string: number; fret: number; ok: boolean }) => {
        const marks = [
          ...(given ? [{ ...given, tone: "given" as const }] : []),
          ...(hit ? [{ string: hit.string, fret: hit.fret, tone: hit.ok ? ("right" as const) : ("wrong" as const) }] : []),
        ];
        frame(`${head()}
          ${untimed ? "" : `<p class="eyebrow">Book ${source}</p>`}
          <h2>${prompt}</h2>
          ${question.kind === "findNote" ? `<p class="big-note">${NOTE_NAMES[question.pitchClass]}</p>` : ""}
          ${fretboardSvg(marks)}
          <p class="fb" aria-live="polite">${hit ? "" : "Anywhere on frets 0 to 5."}</p>${foot()}`);
        root.querySelector(".fretboard")!.addEventListener("click", (e) => {
          const spot = (e.target as Element).closest<SVGGElement>(".spot");
          if (!spot || locked) return;
          const st = Number(spot.dataset.string);
          const f = Number(spot.dataset.fret);
          const m = fretMidi(st, f);
          let ok: boolean;
          let miss: string;
          if (question.kind === "fretInterval") {
            const base = fretMidi(question.string, question.fret);
            ok = m > base && (m - base) % 12 === question.semitones;
            miss = `A ${question.label} is ${question.semitones} frets up`;
            melodic([base, m], 0.4);
          } else {
            ok = m % 12 === question.pitchClass;
            miss = `Where ${NOTE_NAMES[question.pitchClass]} is on the neck`;
            tone(m, 0, 0.9);
          }
          drawBoard({ string: st, fret: f, ok });
          const fb = root.querySelector(".fb")!;
          fb.className = `fb ${ok ? "ok" : "no"}`;
          fb.textContent = ok ? "Yes." : `That's ${NOTE_NAMES[m % 12]}${question.kind === "fretInterval" ? `, ${INTERVAL_WORDS[(((m - fretMidi(question.string, question.fret)) % 12) + 12) % 12] ?? "a unison"} up` : ""}.`;
          answer(ok, miss);
        });
      };
      drawBoard();
    };
    draw();
  }

  // ---- read and hear ----
  function read(step: Extract<Step, { type: "read" }>): void {
    frame(`
      <p class="eyebrow">${step.section} · ${step.title}</p>
      <h2>${step.headline}</h2>
      <p class="read-text">${step.text}</p>
      ${step.chips.length ? `<p class="hint left">Hear it:</p><div class="chips">${step.chips.map((c, i) => `<button class="chip" type="button" data-chip="${i}">${c.label}</button>`).join("")}</div>` : ""}
      <button class="btn push" type="button" data-next>Next</button>`);
    root.querySelectorAll<HTMLButtonElement>("[data-chip]").forEach((b) =>
      b.addEventListener("click", () => {
        root.querySelectorAll(".chip.on").forEach((c) => c.classList.remove("on"));
        b.classList.add("on");
        play(step.chips[Number(b.dataset.chip)].sound);
      }),
    );
    root.querySelector("[data-next]")!.addEventListener("click", next);
  }

  // ---- worked example ----
  function demo(step: Extract<Step, { type: "demo" }>): void {
    const q = step.question;
    let prompt = "";
    let body = "";
    let sound: Sound | null = null;
    if (q.kind === "findNote") {
      prompt = q.prompt ?? `Find ${NOTE_NAMES[q.pitchClass]}`;
      body = `<p class="big-note">${NOTE_NAMES[q.pitchClass]}</p>${fretboardSvg(spotsFor(q.pitchClass).map((p) => ({ ...p, tone: "right" as const })))}`;
    } else if (q.kind === "fretInterval") {
      const base = fretMidi(q.string, q.fret);
      prompt = `Tap a ${q.label} above ${NOTE_NAMES[base % 12]}`;
      const answers = spotsFor((base + q.semitones) % 12).filter((p) => fretMidi(p.string, p.fret) > base);
      body = fretboardSvg([{ string: q.string, fret: q.fret, tone: "given" }, ...answers.map((p) => ({ ...p, tone: "right" as const }))]);
      sound = { kind: "melodic", notes: [base, base + q.semitones], gap: 0.45 };
    } else if (q.kind === "staff") {
      const named = q.options.some((o) => /^[PMm+°]/.test(o));
      const size = parseNote(q.upper).step - parseNote(q.lower).step + 1;
      const answer = named ? intervalName(q.lower, q.upper) : SIZE_WORDS[size];
      prompt = named ? "Name this interval" : "How big is this interval?";
      body = `${staffSvg([q.lower, q.upper])}<div class="opts">${q.options.map((o) => `<span class="opt${o === answer ? " right" : ""}">${o}</span>`).join("")}</div>`;
      sound = { kind: "melodic", notes: [parseNote(q.lower).midi, parseNote(q.upper).midi], gap: 0.45 };
    } else {
      prompt = q.prompt;
      const visual = q.visual ? visualHtml(q.visual) : "";
      body = `${visual}<div class="opts${q.options.some((o) => o.length > 14) ? " stack" : ""}">${q.options.map((o) => `<span class="opt${o === q.answer ? " right" : ""}">${o}</span>`).join("")}</div>`;
      sound = q.sound && q.sound.kind !== "none" ? q.sound : null;
    }
    frame(`
      <p class="eyebrow">Watch one first</p>
      <h2>${prompt}</h2>
      ${body}
      ${sound ? `<button class="btn ghost" type="button" data-sound>▶ Hear it</button>` : ""}
      <p class="demo-note">${step.note}</p>
      <button class="btn push" type="button" data-next>Your turn</button>`);
    if (sound) {
      const s = sound;
      root.querySelector("[data-sound]")!.addEventListener("click", () => play(s));
      play(s);
    }
    root.querySelector("[data-next]")!.addEventListener("click", next);
  }

  // ---- real song ----
  function realSong(step: Extract<Step, { type: "realSong" }>): void {
    const picks: (string | null)[] = step.chords.map(() => null);
    let checked = false;
    const search = encodeURIComponent(`${step.song} ${step.artist}`);
    const draw = () => {
      frame(`
        <p class="eyebrow">Real song · chapter ${lesson.section.split(".")[0]}</p>
        <h2>“${step.song}” (${step.artist}) is in ${step.key}. Label each chord.</h2>
        <div class="song-grid" style="--n:${step.chords.length}">
          ${step.chords.map((c) => `<b>${c}</b>`).join("")}
          ${picks.map((p, i) => `<button class="slot${checked ? (p === step.answer[i] ? " right" : " wrong") : ""}" type="button" data-slot="${i}">${p ?? ""}</button>`).join("")}
          ${checked ? step.answer.map((a, i) => `<small>${picks[i] === a ? "" : a}</small>`).join("") : ""}
        </div>
        <div class="numerals">${step.options.map((o) => `<button class="opt" type="button" data-num="${o}">${o}</button>`).join("")}</div>
        <p class="hint left">Tap a label to fill the next slot. Tap a slot to clear it.</p>
        <p class="fb" aria-live="polite"></p>
        <p class="hint left">Hear the original: <a href="https://www.youtube.com/results?search_query=${search}" target="_blank" rel="noopener">find it on YouTube</a></p>
        <div class="row push">
          <button class="btn ghost" type="button" data-hear>▶ Hear it</button>
          <button class="btn" type="button" data-check ${checked || picks.some((p) => !p) ? "disabled" : ""}>Check</button>
        </div>
        ${checked ? `<button class="btn" type="button" data-next>Continue</button>` : ""}`);
      root.querySelector("[data-hear]")!.addEventListener("click", () => play(step.sound));
      root.querySelectorAll<HTMLButtonElement>("[data-num]").forEach((b) =>
        b.addEventListener("click", () => {
          if (checked) return;
          const i = picks.indexOf(null);
          if (i >= 0) picks[i] = b.dataset.num!;
          draw();
        }),
      );
      root.querySelectorAll<HTMLButtonElement>("[data-slot]").forEach((b) =>
        b.addEventListener("click", () => {
          if (checked) return;
          picks[Number(b.dataset.slot)] = null;
          draw();
        }),
      );
      root.querySelector("[data-check]")!.addEventListener("click", () => {
        checked = true;
        const right = picks.filter((p, i) => p === step.answer[i]).length;
        const ok = right === step.answer.length;
        score(ok, ok ? 20 : 0, `${step.song}: ${step.chords.join(" ")} is ${step.answer.join(" ")} in ${step.key}`);
        draw();
        const fb = root.querySelector(".fb")!;
        fb.className = `fb ${ok ? "ok" : "no"}`;
        fb.textContent = ok ? `All ${right} right. That's ${step.answer.join(" – ")}.` : `${right} of ${step.answer.length} right. The answers are under each slot.`;
      });
      root.querySelector("[data-next]")?.addEventListener("click", next);
    };
    draw();
    play(step.sound);
  }

  // ---- song match ----
  function songMatch(rounds: Extract<Step, { type: "songMatch" }>["rounds"]): void {
    let r = 0;
    const draw = () => {
      const round = rounds[r];
      let answered = false;
      frame(`
        <p class="eyebrow">Use it · song match ${r + 1} of ${rounds.length}</p>
        <h2>This interval opens a song you know. Which one?</h2>
        <button class="btn ghost" type="button" data-play>▶ Play the interval</button>
        <div class="list">${round.choices.map((c) => `<button class="opt left" type="button" data-c="${c}">${c}</button>`).join("")}</div>
        <p class="fb" aria-live="polite">Hum each opening in your head and compare.</p>
        <button class="btn push" type="button" data-next disabled>${r < rounds.length - 1 ? "Next" : "Finish"}</button>`);
      const playIt = () => melodic(round.notes, 0.5);
      root.querySelector("[data-play]")!.addEventListener("click", playIt);
      root.querySelectorAll<HTMLButtonElement>("[data-c]").forEach((b) =>
        b.addEventListener("click", () => {
          if (answered) return;
          answered = true;
          const ok = b.dataset.c === round.song;
          b.classList.add(ok ? "right" : "wrong");
          if (!ok) root.querySelector(`[data-c="${round.song}"]`)!.classList.add("right");
          const fb = root.querySelector(".fb")!;
          fb.className = `fb ${ok ? "ok" : "no"}`;
          fb.textContent = `${ok ? "Yes." : `It's ${round.song}.`} Its first two notes make a ${round.interval}. Use it as your memory hook.`;
          score(ok, 15, `${round.interval} sounds like the start of ${round.song}`);
          root.querySelector<HTMLButtonElement>("[data-next]")!.disabled = false;
        }),
      );
      root.querySelector("[data-next]")!.addEventListener("click", () => {
        if (r < rounds.length - 1) {
          r++;
          draw();
        } else next();
      });
      window.setTimeout(playIt, 200);
    };
    draw();
  }

  // ---- tap the beat ----
  function tapBeat(step: Extract<Step, { type: "tapBeat" }>): void {
    const beatMs = 60000 / step.bpm;
    const countIn = step.beatsPerBar;
    const beats = step.beatsPerBar * step.bars;
    const targets = step.pattern ? step.pattern.map((p) => (p * beatMs) / 2) : Array.from({ length: beats }, (_, i) => i * beatMs);
    const total = targets.length;
    const tolerance = Math.min(140, (step.pattern ? beatMs / 2 : beatMs) * 0.3);
    frame(`
      <p class="eyebrow">Feel it · ${step.pattern ? "tap the rhythm" : "tap the beat"}</p>
      <h2>${step.title}</h2>
      <p class="hint">${step.hint ?? `After ${countIn} count-in clicks, tap the big button on every beat. Beat 1 of each bar clicks louder.`}</p>
      <div class="beats">${Array.from({ length: total }, () => "<i></i>").join("")}</div>
      <button class="tap" type="button" data-start>Start</button>
      <p class="fb" aria-live="polite"></p>
      <button class="btn push" type="button" data-next disabled>Continue</button>`);
    const tapBtn = root.querySelector<HTMLButtonElement>("[data-start]")!;
    const fb = root.querySelector(".fb")!;
    const dots = root.querySelectorAll<HTMLElement>(".beats i");
    let start = 0;
    let running = false;
    let scored = false;
    const hits = new Set<number>();
    let timers: number[] = [];
    cleanup = () => timers.forEach((t) => window.clearTimeout(t));

    const begin = () => {
      running = true;
      hits.clear();
      dots.forEach((d) => (d.className = ""));
      fb.textContent = "";
      tapBtn.textContent = "Tap";
      start = performance.now() + countIn * beatMs;
      for (let i = 0; i < countIn + beats; i++) {
        const accent = i % step.beatsPerBar === 0;
        timers.push(window.setTimeout(() => tone(accent ? 96 : 89, 0, 0.05, i < countIn ? 0.12 : 0.06), i * beatMs));
      }
      if (step.pattern)
        for (const t of targets) timers.push(window.setTimeout(() => tone(81, 0, 0.08, 0.1), countIn * beatMs + t));
      timers.push(
        window.setTimeout(() => {
          running = false;
          const ok = hits.size >= Math.ceil(total * 0.75);
          dots.forEach((d, i) => !hits.has(i) && d.classList.add("miss"));
          fb.className = `fb ${ok ? "ok" : "no"}`;
          fb.textContent = step.pattern
            ? `${hits.size} of ${total} hits on time. ${ok ? "You've got the groove." : "Try again and copy the woodblock."}`
            : `${hits.size} of ${total} beats on time. ${ok ? "Nice and steady." : "Try again and listen for the loud click on 1."}`;
          if (!scored) score(ok, ok ? 20 : 0, `Keeping a steady beat in ${step.title}`);
          scored = true;
          tapBtn.textContent = "Try again";
          root.querySelector<HTMLButtonElement>("[data-next]")!.disabled = false;
        }, (countIn + beats) * beatMs + 300),
      );
    };

    tapBtn.addEventListener("pointerdown", () => {
      if (!running) {
        timers.forEach((t) => window.clearTimeout(t));
        timers = [];
        begin();
        return;
      }
      const t = performance.now() - start;
      let beat = 0;
      targets.forEach((x, i) => Math.abs(t - x) < Math.abs(t - targets[beat]) && (beat = i));
      if (Math.abs(t - targets[beat]) <= tolerance) {
        hits.add(beat);
        dots[beat].className = "hit";
      }
    });
    root.querySelector("[data-next]")!.addEventListener("click", next);
  }

  runStep(lesson.steps[0]);
  return () => cleanup?.();
}
