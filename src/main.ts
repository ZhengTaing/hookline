import "./style.css";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";
import { ICONS } from "./icons";
import { COURSE, chapterPractice, findLesson } from "./lessons/content";
import { answerCard, applyResult, nextLessonId } from "./progress";
import { emptyProgress, loadProgress, saveProgress, type Progress } from "./store";
import { currentStreak, dayKey, recordVisit } from "./streak";
import { cloud } from "./firebase";
import { runLesson, type LessonResult } from "./views/lesson";
import { renderLogin } from "./views/login";
import { renderPlaceholder } from "./views/placeholder";
import { renderResults } from "./views/results";
import { mountReview } from "./views/review";
import { renderChapter, renderToday } from "./views/today";

type Tab = "learn" | "practice" | "songs" | "chords" | "quiz";
const TABS: { id: Tab; label: string }[] = [
  { id: "learn", label: "Learn" },
  { id: "practice", label: "Review" },
  { id: "songs", label: "My songs" },
  { id: "chords", label: "Chords" },
  { id: "quiz", label: "Quiz" },
];

const app = document.querySelector<HTMLDivElement>("#app")!;
let progress: Progress = emptyProgress();
let isNewToday = false;
let userId: string | null = null;
let email = "";
let signedIn = false;
let stopLesson: (() => void) | null = null;

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
      ${TABS.map(
        (t) => `<a href="#${t.id}" class="${t.id === tab ? "on" : ""}" ${t.id === tab ? 'aria-current="page"' : ""}>
          ${ICONS[t.id]}<span>${t.label}</span></a>`,
      ).join("")}
    </nav>
  `;
  document.querySelector("#sign-out")?.addEventListener("click", async () => {
    if (cloud) await signOut(cloud.auth);
  });
  document.querySelector("#sign-in")?.addEventListener("click", () => showLogin());
}

async function finishLesson(result: LessonResult, title: string): Promise<void> {
  stopLesson = null;
  progress = applyResult(progress, result, tomorrow());
  const chapter = result.lessonId.startsWith("practice-")
    ? Number(result.lessonId.slice("practice-".length))
    : COURSE.findIndex((u) => u.lessons.some((l) => l.id === result.lessonId)) + 1;
  shell("learn", renderResults(result, currentStreak(progress.visits, dayKey(new Date())), title, chapter, nextLessonId(progress)));
  window.scrollTo(0, 0);
  try {
    await saveProgress(userId, progress);
  } catch {
    const note = document.createElement("p");
    note.className = "fb no";
    note.textContent = "Your result couldn't be saved. Check your connection, then play the lesson again.";
    app.querySelector(".results")?.prepend(note);
  }
}

function route(): void {
  stopLesson?.();
  stopLesson = null;
  const hash = location.hash.slice(1);

  if (hash.startsWith("lesson/")) {
    const lesson = findLesson(hash.slice("lesson/".length));
    if (lesson) {
      app.innerHTML = `<main class="lesson-root"></main>`;
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

  if (hash.startsWith("drill/")) {
    const n = Number(hash.slice("drill/".length));
    const drill = chapterPractice(n);
    if (drill) {
      app.innerHTML = `<main class="lesson-root"></main>`;
      window.scrollTo(0, 0);
      stopLesson = runLesson(
        app.querySelector<HTMLElement>(".lesson-root")!,
        drill,
        (result) => void finishLesson(result, drill.title),
        () => (location.hash = `#chapter/${n}`),
      );
      return;
    }
  }

  if (hash.startsWith("chapter/")) {
    shell("learn", renderChapter(progress, Number(hash.slice("chapter/".length))));
    window.scrollTo(0, 0);
    return;
  }

  if (hash === "practice") {
    shell("practice", `<div class="review-root"></div>`);
    const today = dayKey(new Date());
    mountReview(app.querySelector<HTMLElement>(".review-root")!, progress, today, (text, remembered) => {
      progress = answerCard(progress, text, remembered, today);
      route();
      saveProgress(userId, progress).catch(() => {
        const note = document.createElement("p");
        note.className = "fb no";
        note.textContent = "Couldn't save your review. Check your connection.";
        app.querySelector(".review")?.prepend(note);
      });
    });
    return;
  }

  const tab = (TABS.some((t) => t.id === hash) ? hash : "learn") as Tab;
  shell(tab, tab === "learn" ? renderToday(progress, dayKey(new Date()), isNewToday) : renderPlaceholder(tab));
}

function renderError(message: string): void {
  app.innerHTML = `<section class="placeholder"><h2>Something went wrong</h2><p>${escapeHtml(message)}</p>
    <button class="btn" type="button" onclick="location.reload()">Try again</button></section>`;
}

async function enter(id: string | null, userEmail = ""): Promise<void> {
  userId = id;
  email = userEmail;
  try {
    progress = await loadProgress(userId);
    const today = dayKey(new Date());
    isNewToday = !progress.visits.includes(today);
    if (isNewToday) {
      progress = { ...progress, visits: recordVisit(progress.visits, today) };
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
