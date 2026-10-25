import sectionSongs from "../data/section-songs.json";
import { findSong, loadSongMeta, playSong, songKey, stopSong, type Song } from "../songs";

interface SectionSongs {
  listen: string;
  guitar: string;
  songs: { title: string; artist: string; note?: string }[];
}

const SECTIONS = sectionSongs as Record<string, SectionSongs>;

/** The playlist songs picked for a section, if any have been picked yet. */
export function songsFor(sectionId: string): { pick: SectionSongs; songs: (Song & { note?: string })[] } | undefined {
  const pick = SECTIONS[sectionId];
  if (!pick) return undefined;
  const songs = pick.songs.flatMap((s) => {
    const song = findSong(s.title, s.artist);
    return song ? [{ ...song, note: s.note }] : [];
  });
  return songs.length ? { pick, songs } : undefined;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const time = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.round(sec % 60)).padStart(2, "0")}`;
const searchUrl = (s: Song) => `https://music.apple.com/us/search?term=${encodeURIComponent(`${s.title} ${s.artist}`)}`;
/** Long credit lines ("HUNTR/X, EJAE, …") shortened to the first name. */
const shortArtist = (a: string) => (a.length > 28 ? a.split(",")[0] : a);

/** "Hear it in your playlist": a section's songs, each with art, a preview and an Apple Music link. */
export function renderSectionSongs(sectionId: string): string {
  const found = songsFor(sectionId);
  if (!found) return "";
  const { pick, songs } = found;
  return `
    <article class="song-card">
      <p class="song-eyebrow">Hear it in your playlist</p>
      <p class="song-text">${esc(pick.listen)}</p>
      ${songs
        .map(
          (s, i) => `
        <div class="song-row" data-song="${esc(songKey(s.title, s.artist))}" style="--i:${i}">
          <div class="song-art"></div>
          <div class="song-head">
            <a href="${searchUrl(s)}" target="_blank" rel="noopener"><b>${esc(s.title)}</b></a>
            <span>${esc(shortArtist(s.artist))}${s.year ? ` · ${s.year}` : ""}${s.seconds ? ` · ${time(s.seconds)}` : ""}</span>
            ${s.note ? `<span class="song-note">${esc(s.note)}</span>` : ""}
          </div>
          <button class="song-preview" type="button" aria-label="Play a preview of ${esc(s.title)}" hidden></button>
        </div>`,
        )
        .join("")}
      <div class="song-guitar"><b>Build it on guitar</b><p>${esc(pick.guitar)}</p></div>
    </article>`;
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

/** Fills rendered song rows with album art, Apple Music links and preview buttons. */
export async function hydrateSongs(root: ParentNode): Promise<void> {
  const rows = [...root.querySelectorAll<HTMLElement>(".song-row")];
  if (!rows.length) return;
  const meta = await loadSongMeta();
  const card = root.querySelector<HTMLElement>(".song-card");
  rows.forEach((row, i) => {
    const m = meta[row.dataset.song ?? ""];
    if (!m || !row.isConnected) return;
    if (m.url) row.querySelector("a")!.href = m.url;
    if (m.artwork) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.alt = "";
      img.onload = () => {
        row.querySelector(".song-art")!.replaceChildren(img);
        // The first song's art colors the whole card.
        const tint = i === 0 ? tintFrom(img) : null;
        if (tint && card) card.style.setProperty("--song-tint", tint);
      };
      img.src = m.artwork.replace("600x600", "200x200");
    }
    if (m.preview) {
      const btn = row.querySelector<HTMLButtonElement>(".song-preview")!;
      btn.hidden = false;
      btn.addEventListener("click", async () => {
        const on = btn.classList.contains("on");
        root.querySelectorAll(".song-preview.on").forEach((b) => b.classList.remove("on"));
        if (on) return stopSong();
        const [title, artist] = (row.dataset.song ?? "").split("|");
        const audio = await playSong(title, artist);
        if (!audio) return;
        btn.classList.add("on");
        audio.onpause = audio.onended = () => btn.classList.remove("on");
      });
    }
  });
  // Stop any preview when leaving the page.
  window.addEventListener("hashchange", stopSong, { once: true });
}
