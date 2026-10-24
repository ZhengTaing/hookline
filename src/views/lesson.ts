import { chord, feedback, melodic, tone } from "../audio";
import { INTERVAL_WORDS, NOTE_NAMES, displayName, fretMidi, intervalName, parseNote } from "../music";
import type { DuelRound, Lesson, RushQuestion, Sound, Step } from "../lessons/types";
import { fretboardSvg, staffSvg } from "../ui/notation";

export interface LessonResult {
  lessonId: string;
  xp: number;
  correct: number;
  total: number;
  bestCombo: number;
  /** Short descriptions of what was missed, for review cards. */
  missed: string[];
}

const SIZE_WORDS: Record<number, string> = { 1: "unison", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th", 6: "6th", 7: "7th", 8: "8ve" };

function play(sound: Sound): void {
  if (sound.kind === "melodic") melodic(sound.notes, sound.gap);
  if (sound.kind === "chord") chord(sound.notes);
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
  const result: LessonResult = { lessonId: lesson.id, xp: 0, correct: 0, total: 0, bestCombo: 0, missed: [] };
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
    else songMatch(step.rounds);
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
        if (n.length > 2) chord(n);
        else melodic(n, 0.45);
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
  function rush(seconds: number, source: string, questions: RushQuestion[]): void {
    const order = shuffle(questions);
    const end = Date.now() + seconds * 1000;
    let q = 0;
    let combo = 0;
    let points = 0;
    let locked = false;
    let finished = false;
    const multiplier = () => Math.min(1 + Math.floor(combo / 2), 4);

    const timer = window.setInterval(() => {
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
      score(ok, ok ? 10 * multiplier() : 0, miss);
      locked = true;
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
      const left = Math.max(0, end - Date.now());
      return `
        <div class="hud"><span>Score <b>${points}</b></span><span>${q + 1}/${order.length} · <b class="time">${Math.ceil(left / 1000)}</b>s</span></div>
        <div class="timer"><i style="width:${(left / (seconds * 1000)) * 100}%"></i></div>
        <div class="combo">${combo >= 2 ? `Combo ×${multiplier()} · ${combo} in a row` : ""}</div>`;
    };

    const draw = () => {
      const question = order[q];
      if (question.kind === "staff") {
        const named = question.options.some((o) => /^[PMm+°]/.test(o));
        const size = parseNote(question.upper).step - parseNote(question.lower).step + 1;
        const right = named ? intervalName(question.lower, question.upper) : SIZE_WORDS[size];
        frame(`${head()}
          <p class="eyebrow">Book ${source}</p>
          <h2>${named ? "Name this interval" : "How big is this interval?"}</h2>
          ${staffSvg(question.lower, question.upper)}
          <div class="opts">${question.options.map((o) => `<button class="opt" type="button" data-o="${o}">${o}</button>`).join("")}</div>
          <p class="fb" aria-live="polite"></p>`);
        root.querySelectorAll<HTMLButtonElement>("[data-o]").forEach((b) =>
          b.addEventListener("click", () => {
            if (locked) return;
            const ok = b.dataset.o === right;
            b.classList.add(ok ? "right" : "wrong");
            if (!ok) root.querySelector(`[data-o="${right}"]`)!.classList.add("right");
            const fb = root.querySelector(".fb")!;
            fb.className = `fb ${ok ? "ok" : "no"}`;
            fb.textContent = ok ? `+${10 * Math.min(1 + Math.floor((combo + 1) / 2), 4)}` : `It's a ${right}.`;
            melodic([parseNote(question.lower).midi, parseNote(question.upper).midi], 0.45);
            answer(ok, `${displayName(question.lower)} up to ${displayName(question.upper)} is a ${right}`);
          }),
        );
        return;
      }

      const given =
        question.kind === "fretInterval" ? { string: question.string, fret: question.fret } : null;
      const prompt =
        question.kind === "fretInterval"
          ? `Tap a ${question.label} above ${NOTE_NAMES[fretMidi(question.string, question.fret) % 12]}`
          : `Find ${NOTE_NAMES[question.pitchClass]}`;
      const drawBoard = (hit?: { string: number; fret: number; ok: boolean }) => {
        const marks = [
          ...(given ? [{ ...given, tone: "given" as const }] : []),
          ...(hit ? [{ string: hit.string, fret: hit.fret, tone: hit.ok ? ("right" as const) : ("wrong" as const) }] : []),
        ];
        frame(`${head()}
          <p class="eyebrow">Book ${source}</p>
          <h2>${prompt}</h2>
          ${question.kind === "findNote" ? `<p class="big-note">${NOTE_NAMES[question.pitchClass]}</p>` : ""}
          ${fretboardSvg(marks)}
          <p class="fb" aria-live="polite">${hit ? "" : "Anywhere on frets 0 to 5."}</p>`);
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

  runStep(lesson.steps[0]);
  return () => cleanup?.();
}
