import "./style.css";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";
import { ICONS } from "./icons";
import { COURSE, chapterPractice, findLesson } from "./lessons/content";
import { answerCard, applyResult, nextLessonId, weakPractice } from "./progress";
import { emptyProgress, loadProgress, saveProgress, type Progress } from "./store";
import { dayKey, recordVisit } from "./streak";
import { cloud } from "./firebase";
import { runLesson, type LessonResult } from "./views/lesson";
import { renderLogin } from "./views/login";
import { renderResults } from "./views/results";
import { renderChallengeIntro, renderChallengeResults } from "./views/challenge";
import { hydrateArtists, renderArtistTeaser, renderCollection, showReveal, wireCollection } from "./views/artists";
import { RARITIES, claimDaily, countToday, levelCards, mixArtists, mixSong, openPack } from "./cards";
import { challengeReward, isCleared, lessonStreak, replayCard, recordLearnDay, reviewReward, useFreeze } from "./rewards";
import { hydrateSongs, renderSectionSongs } from "./views/song-card";
import { PASS, UNLOCK_ORDER, challengeRounds, chapterChallenge, nextArtist } from "./lessons/challenge";
import { mountReview } from "./views/review";
import { renderChapter, renderToday } from "./views/today";

type Tab = "learn" | "practice" | "artists";
const TABS: { id: Tab; label: string }[] = [
  { id: "learn", label: "Learn" },
  { id: "practice", label: "Review" },
  { id: "artists", label: "Artists" },
];

const app = document.querySelector<HTMLDivElement>("#app")!;
let progress: Progress = emptyProgress();
let isNewToday = false;
let userId: string | null = null;
let email = "";
let signedIn = false;
let stopLesson: (() => void) | null = null;
// Navigation memory for transitions: where we came from, and where the tab highlight was.
let lastHash: string | null = null;
let pillLeft: number | null = null;
let celebrated = false;
const calm = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** How deep a page sits: tabs 0, a chapter 1, a lesson 2. Going deeper slides in from the right, back from the left. */
function depthOf(hash: string): number {
  return hash.startsWith("lesson/") || hash.startsWith("drill/") || hash.startsWith("challenge/") ? 2 : hash.startsWith("chapter/") ? 1 : 0;
}

/** Animate the new page in, based on where we came from. */
function enterPage(hash: string): void {
  const prev = lastHash;
  lastHash = hash;
  const content = app.querySelector<HTMLElement>(".content");
  if (!content || prev === null || prev === hash) return;
  const a = depthOf(prev);
  const b = depthOf(hash);
  content.classList.add(b > a ? "nav-fwd" : b < a ? "nav-back" : "nav-tab");
}

/** A placeholder in the shape of the Learn page while progress loads. */
function showSkeleton(): void {
  app.innerHTML = `
    <header class="top"><span class="wordmark">Hookline</span></header>
    <main class="content" aria-busy="true" aria-label="Loading your progress">
      <div class="skel-group">
        <span class="sk" style="width:35%;height:14px"></span>
        <span class="sk" style="width:45%;height:56px"></span>
        <span class="sk" style="width:70%;height:12px"></span>
        <span class="sk" style="width:100%;height:48px;border-radius:12px"></span>
      </div>
      <div class="skel-group">
        ${Array.from({ length: 5 }, () => `<span class="sk" style="width:100%;height:44px"></span>`).join("")}
      </div>
    </main>`;
}

/** Count a number up from 0 in an element whose text is like "+40". */
function countUp(el: HTMLElement | null, to: number, prefix = ""): void {
  if (!el || calm() || to <= 0) return;
  const start = performance.now();
  const ms = Math.min(900, 300 + to * 8);
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / ms);
    el.textContent = `${prefix}${Math.round(to * (1 - Math.pow(1 - t, 3)))}`;
    if (t < 1) requestAnimationFrame(step);
  };
  el.textContent = `${prefix}0`;
  requestAnimationFrame(step);
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

function tomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return dayKey(d);
}

function shell(tab: Tab, body: string): void {
  const account = cloud && userId
    ? `<button class="link" type="button" id="sign-out">Log out</button>`
    : cloud
    ? `<button class="link" type="button" id="sign-in">Sign in</button>`
    : `<span class="muted">Guest mode</span>`;
  app.innerHTML = `
    <header class="top">
      <span class="wordmark">Hookline</span>
      <span class="account">${email ? `<span class="muted">${escapeHtml(email)}</span>` : ""}${account}</span>
    </header>
    <main class="content">${body}</main>
    <nav class="tabs" aria-label="Sections">
      <span class="tab-pill" aria-hidden="true"></span>
      ${TABS.map(
        (t) => `<a href="#${t.id}" class="${t.id === tab ? "on" : ""}" ${t.id === tab ? 'aria-current="page"' : ""}>
          ${ICONS[t.id]}<span>${t.label}</span></a>`,
      ).join("")}
    </nav>
  `;
  // Slide the tab highlight from the last tab to this one.
  const on = app.querySelector<HTMLElement>(".tabs a.on");
  const pill = app.querySelector<HTMLElement>(".tab-pill");
  if (on && pill) {
    pill.style.width = `${on.offsetWidth}px`;
    pill.style.transform = `translateX(${pillLeft ?? on.offsetLeft}px)`;
    const target = on.offsetLeft;
    pillLeft = target;
    requestAnimationFrame(() => requestAnimationFrame(() => (pill.style.transform = `translateX(${target}px)`)));
  }
  document.querySelector("#sign-out")?.addEventListener("click", async () => {
    if (cloud) await signOut(cloud.auth);
  });
  document.querySelector("#sign-in")?.addEventListener("click", () => showLogin());
}

/** Shows a "couldn't save" note at the top of a page. */
function saveFailed(where: string, text: string): void {
  const note = document.createElement("p");
  note.className = "fb no";
  note.textContent = text;
  app.querySelector(where)?.prepend(note);
}

async function finishLesson(result: LessonResult, title: string): Promise<void> {
  stopLesson = null;
  const today = dayKey(new Date());
  const run = /^(practice|challenge)-(\d+)$/.exec(result.lessonId);
  const section = !/^(practice|challenge)-/.test(result.lessonId);
  const priorBest = progress.best[result.lessonId] ?? 0;
  // Quests: today's counts, the streak's learning day, then any artist cards whose quest this section finished.
  progress = recordLearnDay(countToday(applyResult(progress, result, tomorrow()), today, result.xp, section), today);
  const leveled = levelCards(progress);
  progress = leveled.progress;
  const chapter = run ? Number(run[2]) : COURSE.findIndex((u) => u.lessons.some((l) => l.id === result.lessonId)) + 1;
  const streak = lessonStreak(progress, today);
  let extra = "";
  if (run?.[1] === "challenge") {
    const reward = challengeReward(progress, chapter, result.correct, result.total, streak, priorBest);
    progress = reward.progress;
    shell(
      "learn",
      renderChallengeResults({
        result, chapter, rounds: challengeRounds(chapter), streak: { days: streak, bonus: reward.bonus },
        owned: progress.artists!.length, total: UNLOCK_ORDER.length, pass: PASS, hasNext: chapter < COURSE.length, reward,
      }),
    );
    void hydrateArtists(app);
    lastHash = `challenge/${chapter}/play`;
    window.scrollTo(0, 0);
    countUp(app.querySelector<HTMLElement>(".big-n"), result.xp + reward.bonus, "+");
    try {
      await saveProgress(userId, progress);
    } catch {
      saveFailed(".challenge-results", "Your result couldn't be saved. Check your connection, then play the challenge again.");
    }
    return;
  } else if (section) {
    // Every section ends with songs from the playlist; a chapter's last section opens its challenge.
    const last = COURSE[chapter - 1]?.lessons.at(-1)?.id === result.lessonId;
    // Finishing a chapter doesn't give a card by itself: put its challenge first so it can't be missed.
    const card = nextArtist(progress.artists ?? []);
    const prompt =
      last && chapterChallenge(chapter)
        ? `<a class="chapter-done" href="#challenge/${chapter}"><small>Chapter ${chapter} done!</small><b>🎴 Play the challenge${card ? ` to unlock ${card}` : ""}</b><span>Your card comes from passing it. A perfect score unlocks two.</span></a>`
        : "";
    extra = prompt + renderSectionSongs(result.lessonId, mixSong(result.lessonId, mixArtists(progress)));
  }
  shell("learn", renderResults(result, streak, title, chapter, nextLessonId(progress), extra));
  void hydrateSongs(app);
  const up = leveled.upgraded[0];
  if (up) showReveal(up, progress.cards![up].r, `Artist quest done! ${up} leveled up to ${RARITIES[progress.cards![up].r]}.`);
  lastHash = `lesson/${result.lessonId}`;
  app.querySelector(".content")?.classList.add("nav-tab");
  window.scrollTo(0, 0);
  countUp(app.querySelector<HTMLElement>(".big-n"), result.xp, "+");
  try {
    await saveProgress(userId, progress);
  } catch {
    saveFailed(".results", "Your result couldn't be saved. Check your connection, then play the lesson again.");
  }
}

function route(): void {
  stopLesson?.();
  stopLesson = null;
  const hash = location.hash.slice(1);

  if (hash.startsWith("lesson/")) {
    const lesson = findLesson(hash.slice("lesson/".length));
    if (lesson) {
      app.innerHTML = `<main class="lesson-root sheet"></main>`;
      lastHash = hash;
      window.scrollTo(0, 0);
      stopLesson = runLesson(
        app.querySelector<HTMLElement>(".lesson-root")!,
        lesson,
        (result) => void finishLesson(result, lesson.title),
        () => (location.hash = `#chapter/${COURSE.findIndex((u) => u.lessons.includes(lesson)) + 1}`),
      );
      return;
    }
  }

  // "challenge/2" is the challenge's intro; "challenge/2/play" runs it.
  const intro = /^challenge\/(\d+)$/.exec(hash);
  if (intro && chapterChallenge(Number(intro[1]))) {
    const n = Number(intro[1]);
    const rounds = challengeRounds(n);
    const total = rounds.reduce((a, r) => a + r.maxXp / 10, 0);
    const replay = isCleared(progress, n, total) ? { card: replayCard(progress, n) ?? null } : undefined;
    shell("learn", renderChallengeIntro(n, COURSE[n - 1].title, rounds, PASS, replay));
    enterPage(hash);
    return;
  }

  if (hash.startsWith("drill/") || hash.startsWith("challenge/")) {
    const n = Number(hash.split("/")[1]);
    const drill = hash === "drill/weak" ? weakPractice(progress) : hash.startsWith("drill/") ? chapterPractice(n) : chapterChallenge(n);
    if (drill) {
      app.innerHTML = `<main class="lesson-root sheet"></main>`;
      lastHash = hash;
      window.scrollTo(0, 0);
      stopLesson = runLesson(
        app.querySelector<HTMLElement>(".lesson-root")!,
        drill,
        (result) => void finishLesson(result, drill.title),
        () => (location.hash = hash === "drill/weak" ? "#practice" : `#chapter/${n}`),
      );
      return;
    }
  }

  if (hash.startsWith("chapter/")) {
    shell("learn", renderChapter(progress, Number(hash.slice("chapter/".length))));
    enterPage(hash);
    window.scrollTo(0, 0);
    return;
  }

  if (hash === "practice") {
    shell("practice", `<div class="review-root"></div>`);
    enterPage(hash);
    const today = dayKey(new Date());
    mountReview(app.querySelector<HTMLElement>(".review-root")!, progress, today, (text, remembered) => {
      progress = reviewReward(answerCard(progress, text, remembered, today), today, remembered);
      route();
      saveProgress(userId, progress).catch(() => saveFailed(".review", "Couldn't save your review. Check your connection."));
    });
    return;
  }

  const tab = (TABS.some((t) => t.id === hash) ? hash : "learn") as Tab;
  shell(
    tab,
    tab === "learn"
      ? renderToday(progress, dayKey(new Date()), isNewToday, isNewToday && !celebrated, renderArtistTeaser(progress))
      : renderCollection(progress, dayKey(new Date())),
  );
  if (tab === "learn" || tab === "artists") void hydrateArtists(app);
  if (tab === "artists") {
    const save = () => {
      route();
      saveProgress(userId, progress).catch(() => saveFailed(".collection", "Couldn't save. Check your connection, then try again."));
    };
    wireCollection(app.querySelector<HTMLElement>(".collection")!, progress, {
      toggleMix: (i) => {
        const on = progress.setMix ?? [];
        progress = { ...progress, setMix: on.includes(i) ? on.filter((x) => x !== i) : [...on, i] };
        save();
      },
      claim: (i) => {
        progress = claimDaily(progress, dayKey(new Date()), i);
        save();
      },
      openPack: () => {
        const opened = openPack(progress, dayKey(new Date()));
        progress = opened.progress;
        save();
        if (opened.artist) showReveal(opened.artist, 1, "Your weekly streak pack: a Rare card and a streak freeze.");
      },
    });
  }
  if (tab === "learn") celebrated = true;
  enterPage(tab);
}

function renderError(message: string): void {
  app.innerHTML = `<section class="placeholder"><h2>Something went wrong</h2><p>${escapeHtml(message)}</p>
    <button class="btn" type="button" onclick="location.reload()">Try again</button></section>`;
}

async function enter(id: string | null, userEmail = ""): Promise<void> {
  userId = id;
  email = userEmail;
  showSkeleton();
  try {
    progress = await loadProgress(userId);
    const today = dayKey(new Date());
    isNewToday = !progress.visits.includes(today);
    if (isNewToday) {
      // A saved streak freeze covers yesterday if you missed it.
      progress = useFreeze({ ...progress, visits: recordVisit(progress.visits, today) }, today);
      await saveProgress(userId, progress);
    }
    signedIn = true;
    route();
  } catch (e) {
    renderError(e instanceof Error ? e.message : "Your progress couldn't be loaded.");
  }
}

function showLogin(message = ""): void {
  signedIn = false;
  app.innerHTML = renderLogin(message);
  const msg = app.querySelector<HTMLParagraphElement>(".form-msg")!;
  app.querySelector("#google")!.addEventListener("click", async () => {
    if (!cloud) return;
    msg.textContent = "Signing in...";
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(cloud.auth, provider);
    } catch (e) {
      const code = (e as { code?: string }).code ?? "";
      // Some phone browsers block popups; fall back to a full-page sign-in.
      if (code === "auth/popup-blocked" || code === "auth/operation-not-supported-in-this-environment")
        await signInWithRedirect(cloud.auth, provider);
      else msg.textContent = code === "auth/popup-closed-by-user" ? "" : "Sign-in didn't work. Try again.";
    }
  });
  app.querySelector("#guest")!.addEventListener("click", () => void enter(null));
}

async function start(): Promise<void> {
  showSkeleton();
  if (!cloud) {
    await enter(null);
    return;
  }
  let activeUser: string | null | undefined;
  onAuthStateChanged(cloud.auth, (user) => {
    const id = user?.uid ?? null;
    if (id === activeUser) return;
    const first = activeUser === undefined;
    activeUser = id;
    if (user) void enter(user.uid, user.email ?? "");
    // Signed out: offer sign-in on first load, otherwise drop back to guest progress.
    else if (first) showLogin();
    else void enter(null);
  });
}

window.addEventListener("hashchange", () => {
  if (signedIn) route();
});

void start();
