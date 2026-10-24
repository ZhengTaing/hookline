import "./style.css";
import type { Session } from "@supabase/supabase-js";
import { ICONS } from "./icons";
import { loadProgress, saveProgress, type Progress } from "./store";
import { dayKey, recordVisit } from "./streak";
import { supabase } from "./supabase";
import { renderLogin } from "./views/login";
import { renderPlaceholder } from "./views/placeholder";
import { renderToday } from "./views/today";

type Tab = "learn" | "practice" | "songs" | "chords" | "quiz";
const TABS: { id: Tab; label: string }[] = [
  { id: "learn", label: "Learn" },
  { id: "practice", label: "Practice" },
  { id: "songs", label: "My songs" },
  { id: "chords", label: "Chords" },
  { id: "quiz", label: "Quiz" },
];

const app = document.querySelector<HTMLDivElement>("#app")!;
let progress: Progress = { visits: [], completedLessons: [] };
let isNewToday = false;
let userId: string | null = null;
let email = "";

function currentTab(): Tab {
  const t = location.hash.slice(1) as Tab;
  return TABS.some((x) => x.id === t) ? t : "learn";
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

function renderShell(): void {
  const tab = currentTab();
  const body = tab === "learn" ? renderToday(progress, dayKey(new Date()), isNewToday) : renderPlaceholder(tab);
  const account = supabase
    ? `<button class="link" type="button" id="sign-out">Log out</button>`
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
    await supabase?.auth.signOut();
  });
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
    renderShell();
  } catch (e) {
    renderError(e instanceof Error ? e.message : "Your progress couldn't be loaded.");
  }
}

function showLogin(message = "", mode: "signin" | "signup" = "signin"): void {
  app.innerHTML = renderLogin(message, mode);
  const form = document.querySelector<HTMLFormElement>("#login-form")!;
  const msg = form.querySelector<HTMLParagraphElement>(".form-msg")!;

  document.querySelector("#toggle-mode")!.addEventListener("click", () => {
    showLogin("", mode === "signup" ? "signin" : "signup");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!supabase) return;
    const data = new FormData(form);
    const creds = { email: String(data.get("email")), password: String(data.get("password")) };
    if (creds.password.length < 8) {
      msg.textContent = "Use a password with at least 8 characters.";
      return;
    }
    msg.textContent = mode === "signup" ? "Creating your account..." : "Logging in...";
    const { data: result, error } =
      mode === "signup" ? await supabase.auth.signUp(creds) : await supabase.auth.signInWithPassword(creds);
    if (error) {
      msg.textContent = error.message;
    } else if (mode === "signup" && !result.session) {
      msg.textContent = "Check your email to confirm your account, then log in.";
    }
  });
}

async function start(): Promise<void> {
  if (!supabase) {
    await enter(null);
    return;
  }
  let activeUser: string | null | undefined;
  const handle = (session: Session | null) => {
    const id = session?.user.id ?? null;
    if (id === activeUser) return;
    activeUser = id;
    // Deferred: Supabase can deadlock if its own calls run inside the auth callback.
    setTimeout(() => (session ? void enter(session.user.id, session.user.email ?? "") : showLogin()), 0);
  };
  supabase.auth.onAuthStateChange((_event, session) => handle(session));
  const { data } = await supabase.auth.getSession();
  handle(data.session);
}

window.addEventListener("hashchange", () => {
  if (userId !== null || !supabase) renderShell();
});

void start();
