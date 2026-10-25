import { DAILY, PACK_STREAK, goalOf, QUEST_GOAL, RARITIES, RARITY_HOW, SETS, activeQuest, packState, questFor, rarityOf, todayStats } from "../cards";
import { dueCards } from "../progress";
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
const GEMS = ["⚪", "🔷", "🟣", "🌟"];

/** A collectible card. A null rarity is a card you don't own yet. */
export function cardHtml(artist: string, rarity: number | null, extra = ""): string {
  const n = UNLOCK_ORDER.indexOf(artist) + 1;
  const cls = rarity === null ? "locked" : `r${rarity}`;
  return `
    <div class="acard ${cls} ${extra}" data-artist="${esc(artist)}" role="button" tabindex="0">
      <div class="artist-photo"><span>${esc(artist)}</span></div>
      <div class="acard-top"><span>#${n}</span><span>${rarity === null ? "🔒" : GEMS[rarity]}</span></div>
      <b>${esc(artist)}</b>
    </div>`;
}

/** The card flipping in, for challenge results and card packs. */
export function revealHtml(artist: string, rarity: number, note: string): string {
  return `
    <div class="reveal r${rarity}">
      <div class="reveal-rays"></div>
      ${cardHtml(artist, rarity, "flip-in")}
      <span class="rarity-tag r${rarity}">${RARITIES[rarity]} pull</span>
      <b>${esc(artist)}</b>
      <small>${note}</small>
    </div>`;
}

/** A teaser on the Learn page: the next artist to unlock, linking to the Artists tab. */
export function renderArtistTeaser(progress: Progress): string {
  const owned = progress.artists ?? [];
  const next = UNLOCK_ORDER.find((a) => !owned.includes(a));
  if (!next) return "";
  return `
    <a class="artist-teaser" href="#artists">
      ${cardHtml(next, null)}
      <span><small>Next card to unlock</small><b>${esc(next)}</b><small>Pass a chapter challenge. A perfect score pulls Epic cards. ${owned.length} of ${UNLOCK_ORDER.length} collected →</small></span>
    </a>`;
}

function renderQuests(p: Progress, today: string): string {
  const quest = activeQuest(p);
  const t = todayStats(p, today);
  const pack = packState(p, today);
  const due = dueCards(p, today).length;
  const daily = DAILY.map((q, i) => {
    // The review quest only shows on days with cards to review.
    if (q.of === "reviews" && !due && !t.reviews) return "";
    const goal = goalOf(p, today, i);
    const have = Math.min(t[q.of], goal);
    const claimed = t.claimed.includes(i);
    const reward = claimed
      ? `<span class="quest-reward done">✓</span>`
      : have >= goal
        ? `<button class="quest-reward claim" data-claim="${i}">Claim +${q.xp}</button>`
        : `<span class="quest-reward">+${q.xp} XP</span>`;
    return `
      <div class="quest${have >= goal && !claimed ? " ready" : ""}">
        <span class="quest-icon">${["📖", "⚡", "🎯", "↻"][i]}</span>
        <div><div class="quest-line"><b>${q.title}</b><small>${have}/${goal}</small></div><div class="qbar"><i style="width:${(have / goal) * 100}%"></i></div></div>
        ${reward}
      </div>`;
  }).join("");
  const days = Math.min(pack.streak, PACK_STREAK);
  return `
    <section class="quests">
      <h2>Quests</h2>
      ${
        quest
          ? `<div class="artist-quest" data-artist="${esc(quest.artist)}">
              ${cardHtml(quest.artist, rarityOf(p, quest.artist))}
              <div>
                <small>Artist quest · ${esc(quest.artist)}</small>
                <b>Finish ${QUEST_GOAL} sections with ${esc(quest.artist)} songs</b>
                <div class="qbar"><i style="width:${(quest.done / QUEST_GOAL) * 100}%"></i></div>
                <small>${quest.done}/${QUEST_GOAL} · Levels the card up to ${RARITIES[rarityOf(p, quest.artist) + 1]}</small>
              </div>
            </div>`
          : ""
      }
      ${daily}
      <div class="quest weekly${pack.ready ? " ready" : ""}">
        <span class="quest-icon">🔥</span>
        <div><div class="quest-line"><b>${PACK_STREAK}-day streak</b><small>${pack.claimed ? "Done this week" : `${days}/${PACK_STREAK}`}</small></div>
          <div class="qdays">${Array.from({ length: PACK_STREAK }, (_, i) => `<i class="${i < days || pack.claimed ? "on" : ""}"></i>`).join("")}</div></div>
        ${pack.ready ? `<button class="quest-reward claim" id="open-pack">Open pack</button>` : `<span class="quest-reward pack">🎴 Pack</span>`}
      </div>
      <p class="credit">Each pack also gives a ❄️ streak freeze, which covers one missed day. You have ${p.freezes ?? 0} of 2.</p>
    </section>`;
}

function renderAlbum(p: Progress, next?: string): string {
  const owned = p.artists ?? [];
  const current = Math.max(0, SETS.findIndex(([, a, b]) => UNLOCK_ORDER.slice(a, b).some((x) => !owned.includes(x))));
  const pages = SETS.map(([name, a, b], i) => {
    const set = UNLOCK_ORDER.slice(a, b);
    const have = set.filter((x) => owned.includes(x)).length;
    const full = have === set.length;
    return {
      chip: `<button class="set-chip${i === current ? " on" : ""}${full ? " full" : ""}" data-set="${i}">${name} ${have}/${set.length}</button>`,
      page: `
        <div class="album-page${full ? " full" : ""}" data-page="${i}"${i === current ? "" : " hidden"}>
          <div class="album-head"><b>${name} set</b><small>${full ? "Set complete ✨" : `${have}/${set.length} filled`}</small></div>
          <div class="album-grid">${set.map((x) => cardHtml(x, owned.includes(x) ? rarityOf(p, x) : null, x === next ? "next" : "")).join("")}</div>
          ${
            full
              ? `<button class="set-mix${p.setMix?.includes(i) ? " on" : ""}" data-mix="${i}"><span><b>${name} mix</b><small>Each section adds a song by these ${set.length} artists</small></span><i></i></button>`
              : `<p class="credit">Fill this set to unlock the ${name} mix: an extra song by its artists in every section.</p>`
          }
        </div>`,
    };
  });
  return `
    <section class="album">
      <h2>Album</h2>
      <div class="set-chips">${pages.map((x) => x.chip).join("")}</div>
      ${pages.map((x) => x.page).join("")}
      <p class="credit">⚪ Common · 🔷 Rare · 🟣 Epic · 🌟 Legendary. Fill a set for a holo page. Photos: Spotify.</p>
    </section>`;
}

/** The Artists tab: the next unlock, quests, then the album of all 50 cards. */
export function renderCollection(progress: Progress, today: string): string {
  const owned = progress.artists ?? [];
  const next = UNLOCK_ORDER.find((a) => !owned.includes(a));
  return `
    <section class="collection">
      <div class="collection-head"><h1>Artists</h1><small>${owned.length} of ${UNLOCK_ORDER.length}</small></div>
      ${
        next
          ? `<div class="next-unlock">
              ${cardHtml(next, null)}
              <div><small>Next unlock</small><b>${esc(next)}</b><span>Pass your next chapter challenge</span><div class="unlock-bar"><i style="width:${(owned.length / UNLOCK_ORDER.length) * 100}%"></i></div></div>
            </div>`
          : ""
      }
      ${renderQuests(progress, today)}
      ${renderAlbum(progress, next)}
    </section>`;
}

function showSheet(progress: Progress, artist: string, url?: string): void {
  const owned = progress.artists?.includes(artist);
  const r = owned ? rarityOf(progress, artist) : null;
  const quest = owned ? questFor(progress, artist) : null;
  const sheet = document.createElement("div");
  sheet.className = "card-sheet";
  sheet.innerHTML = `
    <div class="card-sheet-body">
      ${cardHtml(artist, r, "big")}
      <span class="rarity-tag ${r === null ? "" : `r${r}`}">${r === null ? "Locked" : RARITIES[r]}</span>
      ${quest ? `<p class="muted">Artist quest: ${quest.done}/${QUEST_GOAL} sections with their songs to reach ${RARITIES[r! + 1]}.</p>` : ""}
      <ol class="rarity-ladder">${RARITIES.map((name, i) => `<li class="r${i}${r !== null && i <= r ? " have" : ""}"><b>${GEMS[i]} ${name}</b><small>${RARITY_HOW[i]}</small></li>`).join("")}</ol>
      ${url ? `<a class="artist-link" href="${url}" target="_blank" rel="noopener">Open in Spotify</a>` : ""}
      <button class="btn ghost" data-close>Close</button>
    </div>`;
  sheet.addEventListener("click", (e) => {
    if (e.target === sheet || (e.target as HTMLElement).closest("[data-close]")) sheet.remove();
  });
  document.body.append(sheet);
  void hydrateArtists(sheet);
}

/** Pops a card reveal over the page, for opening a card pack. */
export function showReveal(artist: string, rarity: number, note: string): void {
  const sheet = document.createElement("div");
  sheet.className = "card-sheet dark";
  sheet.innerHTML = `<div class="card-sheet-body">${revealHtml(artist, rarity, note)}<button class="btn on-dark-btn" data-close>Put in album</button></div>`;
  sheet.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("[data-close]")) sheet.remove();
  });
  document.body.append(sheet);
  void hydrateArtists(sheet);
}

/** Wires the Artists tab: set chips, card details, quest claims and the card pack. */
export function wireCollection(root: HTMLElement, progress: Progress, on: { claim: (i: number) => void; openPack: () => void; toggleMix: (i: number) => void }): void {
  root.addEventListener("click", async (e) => {
    const el = e.target as HTMLElement;
    const chip = el.closest<HTMLElement>("[data-set]");
    if (chip) {
      root.querySelectorAll(".set-chip").forEach((c) => c.classList.toggle("on", c === chip));
      root.querySelectorAll<HTMLElement>(".album-page").forEach((pg) => (pg.hidden = pg.dataset.page !== chip.dataset.set));
      return;
    }
    const mix = el.closest<HTMLElement>("[data-mix]");
    if (mix) return on.toggleMix(Number(mix.dataset.mix));
    const claim = el.closest<HTMLElement>("[data-claim]");
    if (claim) return on.claim(Number(claim.dataset.claim));
    if (el.closest("#open-pack")) return on.openPack();
    const card = el.closest<HTMLElement>(".album .acard, .artist-quest, .next-unlock .acard");
    if (card) showSheet(progress, card.dataset.artist ?? "", (await spotify())[card.dataset.artist ?? ""]?.url);
  });
}

/** Fills artist photos into rendered cards. */
export async function hydrateArtists(root: ParentNode): Promise<void> {
  root.querySelectorAll<HTMLElement>(".acard").forEach(async (card) => {
    const artist = card.dataset.artist ?? "";
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
