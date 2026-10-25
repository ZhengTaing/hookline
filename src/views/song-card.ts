import playlist from "../data/playlist.json";
import picks from "../data/chapter-songs.json";

/** One song from the user's playlist export (play counts left out on purpose). */
export interface Song {
  title: string;
  artist: string;
  album: string;
  year: number | null;
  genre: string;
  seconds: number | null;
}

/** What the deploy step found on Apple's iTunes Search API (see scripts/fetch-songs.mjs). */
export interface SongMeta {
  artwork?: string;
  url?: string;
  preview?: string;
  released?: string;
  genre?: string;
  ms?: number;
}

export interface ChapterSong {
  song: Song;
  listen: string;
  guitar: string;
}

const PICKS = picks as Record<string, { title: string; artist: string; listen: string; guitar: string }>;
const PLAYLIST = playlist as Song[];

/** The playlist song that closes chapter n, if one has been picked yet. */
export function chapterSong(n: number): ChapterSong | undefined {
  const pick = PICKS[String(n)];
  const song = pick && PLAYLIST.find((s) => s.title === pick.title && s.artist === pick.artist);
  return song && { song, listen: pick.listen, guitar: pick.guitar };
}

const key = (s: Song) => `${s.title}|${s.artist}`;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const time = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.round(sec % 60)).padStart(2, "0")}`;
const searchUrl = (s: Song) => `https://music.apple.com/us/search?term=${encodeURIComponent(`${s.title} ${s.artist}`)}`;

export function renderSongCard({ song, listen, guitar }: ChapterSong): string {
  const chips = [song.year, song.genre, song.seconds ? time(song.seconds) : null].filter(Boolean);
  return `
    <article class="song-card" data-song="${esc(key(song))}">
      <div class="song-top">
        <div class="song-art"><span>${esc(song.album)}</span></div>
        <div class="song-head">
          <p class="song-eyebrow">Hear it in your playlist</p>
          <h2>${esc(song.title)}</h2>
          <p>${esc(song.artist)}</p>
        </div>
      </div>
      <div class="song-chips">${chips.map((c) => `<span>${esc(String(c))}</span>`).join("")}</div>
      <div class="song-play" hidden>
        <button class="song-preview" type="button" aria-label="Play 30-second preview"></button>
        <div class="song-bar"><i></i></div>
      </div>
      <p class="song-text"><b>Listen for:</b> ${esc(listen)}</p>
      <div class="song-guitar"><b>Build it on guitar</b><p>${esc(guitar)}</p></div>
      <a class="btn song-link" href="${searchUrl(song)}" target="_blank" rel="noopener">Open in Apple Music</a>
    </article>`;
}

let metaLoad: Promise<Record<string, SongMeta>> | null = null;
function loadMeta(): Promise<Record<string, SongMeta>> {
  metaLoad ??= fetch(`${import.meta.env.BASE_URL}song-meta.json`)
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => ({}));
  return metaLoad;
}

/** The album art's average color, darkened so white text stays readable on it. */
function tintFrom(img: HTMLImageElement): string | null {
  try {
    const c = document.createElement("canvas");
    c.width = c.height = 8;
    const g = c.getContext("2d");
    if (!g) return null;
    g.drawImage(img, 0, 0, 8, 8);
    const d = g.getImageData(0, 0, 8, 8).data;
    let r = 0, gr = 0, b = 0;
    for (let i = 0; i < d.length; i += 4) [r, gr, b] = [r + d[i], gr + d[i + 1], b + d[i + 2]];
    const n = d.length / 4;
    const k = Math.min(1, 110 / Math.max(r / n, gr / n, b / n, 1));
    return `rgb(${Math.round((r / n) * k)}, ${Math.round((gr / n) * k)}, ${Math.round((b / n) * k)})`;
  } catch {
    return null;
  }
}

let playing: HTMLAudioElement | null = null;

/** Fills a rendered song card with album art, the real link, a preview player and its color. */
export async function hydrateSongCard(root: ParentNode): Promise<void> {
  const card = root.querySelector<HTMLElement>(".song-card");
  if (!card) return;
  const meta = (await loadMeta())[card.dataset.song ?? ""];
  if (!meta || !card.isConnected) return;
  if (meta.url) card.querySelector<HTMLAnchorElement>(".song-link")!.href = meta.url;
  if (meta.artwork) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.alt = "";
    img.onload = () => {
      card.querySelector(".song-art")!.replaceChildren(img);
      const tint = tintFrom(img);
      if (tint) card.style.setProperty("--song-tint", tint);
      card.classList.add("has-art");
    };
    img.src = meta.artwork;
  }
  if (meta.preview) {
    const box = card.querySelector<HTMLElement>(".song-play")!;
    const btn = box.querySelector<HTMLButtonElement>(".song-preview")!;
    const bar = box.querySelector<HTMLElement>(".song-bar i")!;
    box.hidden = false;
    btn.addEventListener("click", () => {
      if (playing && !playing.paused) {
        playing.pause();
        return;
      }
      playing ??= new Audio(meta.preview);
      playing.ontimeupdate = () => (bar.style.width = `${(playing!.currentTime / (playing!.duration || 30)) * 100}%`);
      playing.onplay = () => btn.classList.add("on");
      playing.onpause = playing.onended = () => btn.classList.remove("on");
      void playing.play();
    });
    // Stop the preview when the card leaves the page.
    window.addEventListener("hashchange", () => { playing?.pause(); playing = null; }, { once: true });
  }
}
