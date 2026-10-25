import { UNLOCK_ORDER } from "../lessons/challenge";
import type { Progress } from "../store";
import { artFor } from "./song-card";

/** Spotify photos and links found at deploy time (see scripts/fetch-artists.mjs). */
type SpotifyArtist = { image: string; url?: string };
let spotifyLoad: Promise<Record<string, SpotifyArtist>> | null = null;
const spotify = () =>
  (spotifyLoad ??= fetch(`${import.meta.env.BASE_URL}artist-meta.json`)
    .then((r): Promise<Record<string, SpotifyArtist>> => (r.ok ? r.json() : Promise.resolve({})))
    .catch((): Record<string, SpotifyArtist> => ({})));

/** An artist's Spotify photo, or one of their album covers if Spotify had none. */
export async function artistPhoto(artist: string): Promise<string | undefined> {
  return (await spotify())[artist]?.image ?? (await artFor(artist))?.replace("600x600", "300x300");
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

const tile = (a: string, i: number, owned: string[], next?: string) => {
  const have = owned.includes(a);
  const status = have ? "Unlocked" : a === next ? "Next unlock" : "Locked";
  return `
    <div class="artist-card${have ? "" : " locked"}${a === next ? " next" : ""}" data-artist="${esc(a)}" style="--i:${Math.min(i, 12)}">
      <div class="artist-photo"><span>${esc(a)}</span></div>
      <b>${esc(a)}</b>
      <small>#${i + 1} · ${status}</small>
    </div>`;
};

/** A teaser on the Learn page: the next artist to unlock, linking to the Artists tab. */
export function renderArtistTeaser(progress: Progress): string {
  const owned = progress.artists ?? [];
  const next = UNLOCK_ORDER.find((a) => !owned.includes(a));
  if (!next) return "";
  return `
    <a class="artist-teaser" href="#artists">
      ${tile(next, UNLOCK_ORDER.indexOf(next), owned, next)}
      <span><small>Next artist to unlock</small><b>${esc(next)}</b><small>Pass a chapter challenge. A perfect score unlocks two. ${owned.length} of ${UNLOCK_ORDER.length} collected →</small></span>
    </a>`;
}

/** The Artists tab: every artist you can unlock, newest unlock first, then the whole list. */
export function renderCollection(progress: Progress): string {
  const owned = progress.artists ?? [];
  const next = UNLOCK_ORDER.find((a) => !owned.includes(a));
  const newest = owned[owned.length - 1];
  const feature = newest ?? next;
  return `
    <section class="collection">
      <p class="eyebrow">${owned.length} of ${UNLOCK_ORDER.length} collected</p>
      <h1>Your artists</h1>
      ${
        feature
          ? `<div class="artist-hero" data-artist="${esc(feature)}">
              <div class="artist-photo"><span>${esc(feature)}</span></div>
              <p class="song-eyebrow">${newest ? "Newest unlock" : "Your first unlock"}</p>
              <h2>${esc(feature)}</h2>
              ${newest && next ? `<p class="muted">Next up: <b>${esc(next)}</b>. Pass a chapter challenge to unlock them. A perfect score unlocks two.</p>` : ""}
              ${newest ? "" : `<p class="muted">Pass any chapter challenge to unlock them. A perfect score unlocks two.</p>`}
            </div>`
          : ""
      }
      <div class="unlock-bar"><i style="width:${(owned.length / UNLOCK_ORDER.length) * 100}%"></i></div>
      <div class="artist-grid">${UNLOCK_ORDER.map((a, i) => tile(a, i, owned, next)).join("")}</div>
      <p class="credit">The 50 artists you have the most songs from in your playlists. Photos: Spotify.</p>
    </section>`;
}

/** Fills artist photos (and Spotify links) into rendered cards. */
export async function hydrateArtists(root: ParentNode): Promise<void> {
  const fromSpotify = await spotify();
  root.querySelectorAll<HTMLElement>(".artist-card, .artist-hero").forEach(async (card) => {
    const artist = card.dataset.artist ?? "";
    const sp = fromSpotify[artist];
    // Spotify's rules: its photos stay unaltered and link back to Spotify.
    if (sp?.url && !card.closest("a")) {
      const link = document.createElement("a");
      link.href = sp.url;
      link.target = "_blank";
      link.rel = "noopener";
      link.className = "artist-link";
      link.textContent = "Open in Spotify";
      card.append(link);
    }
    const src = await artistPhoto(artist);
    if (!src || !card.isConnected) return;
    const img = new Image();
    img.alt = artist;
    // A lazy image only loads once it is in the page, so add it now and drop the name on load.
    img.loading = "lazy";
    img.onload = () => card.querySelector(".artist-photo span")?.remove();
    img.src = src;
    card.querySelector(".artist-photo")!.append(img);
  });
}
