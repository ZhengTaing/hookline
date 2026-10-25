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

/** Loads each card's photo from Wikipedia, falling back to the artist's album art. */
export function hydrateArtists(root: ParentNode): void {
  root.querySelectorAll<HTMLElement>(".artist-card").forEach(async (card) => {
    const artist = card.dataset.artist ?? "";
    let src: string | undefined;
    try {
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
