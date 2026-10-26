import { UNLOCK_ORDER, challengeRounds, chapterChallenge } from "../lessons/challenge";
import { COURSE, chapterPractice } from "../lessons/content";
import type { Lesson, Unit } from "../lessons/types";
import { dueCards, isUnlocked, nextLessonId } from "../progress";
import type { Progress } from "../store";
import { bestStreak, currentStreak, recentDays } from "../streak";
import { DAILY, featuredSections, goalOf, questFor, rarityOf, todayStats } from "../cards";
import { isCleared, streakDays } from "../rewards";

/** Rough minutes for a section: the summary and a check, or a full game lesson. */
function minutes(lesson: Lesson): number {
  return lesson.steps.some((s) => s.type === "rush") || lesson.steps.length > 4 ? 6 : 2;
}

function chapterOf(lessonId: string): Unit | undefined {
  return COURSE.find((u) => u.lessons.some((l) => l.id === lessonId));
}

const CREDIT = `<p class="credit">Lessons adapted from Robert Hutchinson, <em>Music Theory for the 21st-Century Classroom</em>, under the GNU Free Documentation License.</p>`;

/** The Learn tab: streak, what's next, and every chapter of the book. */
/** `celebrate` animates today's streak (only the first time the page shows on a new day). */
export function renderToday(progress: Progress, today: string, _isNewToday: boolean, celebrate = false, extra = ""): string {
  const learned = streakDays(progress);
  const frozen = new Set(progress.frozen ?? []);
  const streak = currentStreak(learned, today);
  const best = bestStreak(learned);
  const days = recentDays(learned, today, 14);
  const t = todayStats(progress, today);
  const nextId = nextLessonId(progress);
  const current = nextId ? chapterOf(nextId) : undefined;
  const next = nextId ? chapterOf(nextId)?.lessons.find((l) => l.id === nextId) : undefined;
  const due = dueCards(progress, today).length;

  const dots = days
    .map((d) => `<i class="dot${d.visited ? " on" : ""}${frozen.has(d.day) ? " frozen" : ""}${d.day === today ? ` today${celebrate ? " pop" : ""}` : ""}" title="${d.day}"></i>`)
    .join("");

  const chapters = COURSE.map((unit, ui) => {
    const i = Math.min(ui, 12);
    const done = unit.lessons.filter((l) => progress.completedLessons.includes(l.id)).length;
    const total = unit.lessons.length;
    const current = unit.lessons.some((l) => l.id === nextId);
    const open = isUnlocked(progress, unit.lessons[0].id);
    const state = done === total ? "done" : current ? "next" : open ? "open" : "locked";
    const label = done === total ? "Done" : current ? "Now" : "";
    const inner = `<span class="unit-n">${ui + 1}</span>
      <span class="unit-text"><strong>${unit.title}</strong><small>${unit.chapter} · ${done ? `${done} of ${total}` : total} sections</small>
      <span class="meter"><i style="width:${(done / total) * 100}%"></i></span></span>
      <em>${label}</em>`;
    return `<li class="unit ${state}" style="--i:${i}"><a href="#chapter/${ui + 1}">${inner}</a></li>`;
  }).join("");

  return `
    <section class="today today-card">
      <div class="today-head"><span>Today</span><span>🔥 ${streak} lesson day${streak === 1 ? "" : "s"}${progress.freezes ? ` · ❄️ ${progress.freezes}` : ""}</span></div>
      <div class="streak">
        <span class="streak-n${celebrate ? " flip" : ""}">${streak}</span>
        <span class="streak-label">day${streak === 1 ? "" : "s"} in a row<br /><small>${progress.learnDays?.includes(today) ? `Best: ${best}` : "Finish a section or review to keep it going"} · ${progress.xp} XP</small></span>
      </div>
      <div class="dots" aria-label="Last 14 days">${dots}</div>
      ${
        next
          ? `<div class="today-next"><small>Next section · ${chapterOf(next.id)?.chapter ?? ""}</small><b>${next.id} ${next.title}</b>${questBadge(progress, next.id)}</div>
            <a class="btn" href="#lesson/${next.id}">Continue</a>`
          : `<p class="muted">You've finished the whole book.</p>`
      }
      ${(() => {
        const open = openChallenges(progress);
        const card = UNLOCK_ORDER.find((a) => !progress.artists?.includes(a));
        return open.length && card
          ? `<a class="btn pink-btn" href="#challenge/${open[0]}">🎴 Chapter ${open[0]} challenge: unlock ${card}${open.length > 1 ? ` (${open.length} waiting)` : ""}</a>`
          : "";
      })()}
      <a class="today-quests" href="#artists" aria-label="Today's quests">
        ${DAILY.map((q, i) =>
          q.of === "reviews" && !due && !t.reviews
            ? ""
            : `<span class="${t.claimed.includes(i) ? "done" : t[q.of] >= goalOf(progress, today, i) ? "ready" : ""}"><b>${["📖", "⚡", "🎯", "↻"][i]} ${Math.min(t[q.of], goalOf(progress, today, i))}/${goalOf(progress, today, i)}</b><small>${q.title.replace(/^\w+ \d+ /, "")}</small></span>`,
        ).join("")}
      </a>
      ${due ? `<a class="btn ghost" href="#practice">Review ${due} card${due === 1 ? "" : "s"}</a>` : ""}
    </section>
    ${
      current
        ? `<section class="course chapter-now">
            <h2>${current.chapter} · ${current.title}</h2>
            <ol class="units">${sectionRows(progress, current, nextId)}</ol>
            <p class="credit">${
              progress.artists?.length
                ? "Badges mark sections with songs by an artist you own. Finish 3 of them to level up that card."
                : "🔒 badges mark songs by your next artist. Pass a chapter challenge to collect them, then those sections count toward their quest."
            }</p>
          </section>`
        : ""
    }
    ${extra}
    <section class="course">
      <h2>The book, chapter by chapter</h2>
      <ol class="units">${chapters}</ol>
      ${CREDIT}
    </section>`;
}

/** The badge on a section that moves an artist quest forward: the first owned artist featured in its songs. */
function questBadge(progress: Progress, lessonId: string): string {
  if (progress.completedLessons.includes(lessonId)) return "";
  const quest = (progress.artists ?? []).find((a) => questFor(progress, a) && featuredSections(a).includes(lessonId));
  if (quest) return `<span class="tag quest-tag">${["⚪", "🔷", "🟣", "🌟"][rarityOf(progress, quest)]} ${quest} quest</span>`;
  // Artists you don't own yet show a locked badge as a tease. Pick the one featured in the fewest
  // sections, so the badges vary instead of naming the same big artist everywhere.
  const tease = UNLOCK_ORDER.filter((a) => !progress.artists?.includes(a) && featuredSections(a).includes(lessonId)).sort(
    (a, b) => featuredSections(a).length - featuredSections(b).length,
  )[0];
  return tease ? `<span class="tag quest-tag locked">🔒 ${tease} quest</span>` : "";
}

/** Finished chapters whose challenge you haven't passed yet. */
function openChallenges(progress: Progress): number[] {
  return COURSE.flatMap((u, i) => {
    const n = i + 1;
    if (!chapterChallenge(n) || !u.lessons.every((l) => progress.completedLessons.includes(l.id))) return [];
    const total = challengeRounds(n).reduce((a, r) => a + r.maxXp / 10, 0);
    return isCleared(progress, n, total) ? [] : [n];
  });
}

/** A chapter's sections as course-path rows. */
function sectionRows(progress: Progress, unit: Unit, nextId: string | null): string {
  return unit.lessons
    .map((l, li) => {
      const done = progress.completedLessons.includes(l.id);
      const open = isUnlocked(progress, l.id);
      const state = done ? "done" : l.id === nextId ? "next" : open ? "open" : "locked";
      const label = done ? "Done" : l.id === nextId ? "Now" : "";
      const game = l.steps.some((s) => s.type === "rush") ? `<span class="tag">Game</span>` : "";
      const inner = `<span class="unit-n">${l.id}</span>
        <span class="unit-text"><strong>${l.title}</strong><small>${l.summary}</small>${game}${questBadge(progress, l.id)}</span>
        <em>${label}</em>`;
      return open
        ? `<li class="unit ${state}" style="--i:${Math.min(li, 12)}"><a href="#lesson/${l.id}">${inner}</a></li>`
        : `<li class="unit ${state}" style="--i:${Math.min(li, 12)}"><span class="row">${inner}</span></li>`;
    })
    .join("");
}

/** One chapter's course path: every section of the book, in order. */
export function renderChapter(progress: Progress, n: number): string {
  const unit = COURSE[n - 1];
  if (!unit) return `<p class="muted">No such chapter.</p>`;
  const nextId = nextLessonId(progress);
  const mins = Math.round(unit.lessons.reduce((t, l) => t + minutes(l), 0) / unit.lessons.length);
  const firstOpen = unit.lessons.find((l) => !progress.completedLessons.includes(l.id) && isUnlocked(progress, l.id));

  const rows = sectionRows(progress, unit, nextId);

  return `
    <section class="course chapter">
      <a class="back" href="#learn">← All chapters</a>
      <p class="eyebrow">Unit ${n} · ${unit.chapter}</p>
      <h2>${unit.title}</h2>
      <p class="muted">${unit.lessons.length} sections, about ${mins} min each</p>
      <ol class="units">${rows}</ol>
      ${
        firstOpen
          ? `<a class="btn" href="#lesson/${firstOpen.id}">Continue ${firstOpen.id}</a>`
          : unit.lessons.every((l) => progress.completedLessons.includes(l.id))
            ? `<p class="muted">Chapter done. Replay any section above.</p>`
            : `<p class="muted">Finish the earlier chapters to open this one.</p>`
      }
      ${chapterPractice(n) ? `<a class="btn ghost" href="#drill/${n}">Practice this chapter's questions</a>` : ""}
      ${chapterChallenge(n) ? `<a class="btn" href="#challenge/${n}">Chapter challenge: songs from your playlists</a>` : ""}
      ${n < COURSE.length ? `<a class="btn ghost" href="#chapter/${n + 1}">Next chapter: ${COURSE[n].title}</a>` : ""}
    </section>`;
}
