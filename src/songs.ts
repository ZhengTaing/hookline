import playlist from "./data/playlist.json";

/** One song from the user's playlist exports (play counts left out on purpose), newest first. */
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

export const PLAYLIST = playlist as Song[];

export const songKey = (title: string, artist: string) => `${title}|${artist}`;

export function findSong(title: string, artist: string): Song | undefined {
  return PLAYLIST.find((s) => s.title === title && s.artist === artist);
}

let metaLoad: Promise<Record<string, SongMeta>> | null = null;
export function loadSongMeta(): Promise<Record<string, SongMeta>> {
  metaLoad ??= fetch(`${import.meta.env.BASE_URL}song-meta.json`)
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => ({}));
  return metaLoad;
}

let current: HTMLAudioElement | null = null;
let stopTimer = 0;
let token = 0;

/** Plays a song's 30-second preview, cut to `seconds` if given. Returns the audio, if there is one. */
export async function playSong(title: string, artist: string, seconds?: number): Promise<HTMLAudioElement | null> {
  stopSong();
  const mine = token;
  const preview = (await loadSongMeta())[songKey(title, artist)]?.preview;
  // Stopped or replaced while the song list was loading.
  if (!preview || mine !== token) return null;
  current = new Audio(preview);
  void current.play().catch(() => undefined);
  if (seconds) stopTimer = window.setTimeout(stopSong, seconds * 1000);
  return current;
}

export function stopSong(): void {
  token++;
  clearTimeout(stopTimer);
  current?.pause();
  current = null;
}
