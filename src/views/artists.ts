import { UNLOCK_ORDER } from "../lessons/challenge";
import type { Progress } from "../store";
import { artFor } from "./song-card";

/** Wikipedia article for each artist shown so far (a trial with the first two unlocks). */
const WIKI: Record<string, string> = { "Olivia Rodrigo": "Olivia_Rodrigo", aespa: "Aespa" };

const SHOWN = UNLOCK_ORDER.filter((a) => WIKI[a]);

/** "Your artists": a big photo card for each artist, unlocked by passing chapter challenges. */
export function renderArtistCards(progress: Progress): string {
  const owned = progress.artists ?? [];
  const next = UNLOCK_ORDER.find((a) => !owned.includes(a));
  const cards = SHOWN.map((a) => {
    const have = owned.includes(a);
    const status = have ? "Unlocked" : a === next ? "Next unlock · pass a chapter challenge" : "Locked";
    return `
      <div class="artist-card${have ? "" : " locked"}" data-artist="${a}">
        <div class="artist-photo"><span>${a}</span></div>
        <b>${a}</b>
        <small>${status}</small>
      </div>`;
  }).join("");
  return `
    <section class="artists">
      <h2>Your artists <small>${owned.length} of ${UNLOCK_ORDER.length}</small></h2>
      <div class="artist-grid">${cards}</div>
      <p class="credit">Photos: Wikipedia</p>
    </section>`;
}

/** Spotify photos found at deploy time (see scripts/fetch-artists.mjs), if any. */
type SpotifyArtists = Record<string, { image: string; url?: string }>;
let spotifyLoad: Promise<SpotifyArtists> | null = null;
const spotify = () =>
  (spotifyLoad ??= fetch(`${import.meta.env.BASE_URL}artist-meta.json`)
    .then((r): Promise<SpotifyArtists> => (r.ok ? r.json() : Promise.resolve({})))
    .catch((): SpotifyArtists => ({})));

/** Loads each card's photo: Spotify first, then Wikipedia, then the artist's album art. */
export async function hydrateArtists(root: ParentNode): Promise<void> {
  const fromSpotify = await spotify();
  const credit = root.querySelector(".artists .credit");
  if (credit && Object.keys(fromSpotify).length) credit.textContent = "Photos: Spotify";
  root.querySelectorAll<HTMLElement>(".artist-card").forEach(async (card) => {
    const artist = card.dataset.artist ?? "";
    const sp = fromSpotify[artist];
    if (sp) {
      // Spotify's rules: show its photos unaltered (no grey filter) and link back to Spotify.
      card.classList.add("spotify");
      // Spotify asks that its content links back to Spotify.
      const link = document.createElement("a");
      link.href = sp.url ?? "https://open.spotify.com";
      link.target = "_blank";
      link.rel = "noopener";
      link.className = "artist-link";
      link.textContent = "Open in Spotify";
      card.append(link);
    }
    let src: string | undefined = sp?.image;
    if (!src) try {
      const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${WIKI[artist]}`);
      const d = r.ok ? await r.json() : {};
      src = d.thumbnail?.source ?? d.originalimage?.source;
    } catch {
      src = undefined;
    }
    src ??= await artFor(artist);
    if (!src || !card.isConnected) return;
    const img = new Image();
    img.alt = artist;
    img.onload = () => card.querySelector(".artist-photo")!.replaceChildren(img);
    img.src = src;
  });
}
