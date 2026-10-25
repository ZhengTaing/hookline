// Looks up every song the lessons use on Apple's free iTunes Search API (no key needed) and writes
// album art, Apple Music links, previews and release dates to public/song-meta.json.
// Runs in the deploy workflow. If Apple can't be reached, the site falls back to the
// playlist details and an Apple Music search link, so a failure here never blocks a deploy.
import { readFile, writeFile } from "node:fs/promises";

const read = async (f) => JSON.parse(await readFile(new URL(`../src/data/${f}`, import.meta.url), "utf8"));
const sections = await read("section-songs.json");
const challenges = await read("challenges.json");
// Every [title, artist] named in the section songs and the challenge rounds.
const picks = [
  ...Object.values(sections).flatMap((s) => s.songs),
  ...Object.values(challenges.chapters).flatMap((c) =>
    c.rounds.flatMap((r) => [...(r.questions ?? []).map((q) => q.song), ...(r.intro ?? [])]).map(([title, artist]) => ({ title, artist })),
  ),
];
const norm = (s) => s.toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N} ]/gu, "").trim();
// Reuse what the live site already has, so each deploy only looks up new songs.
const live = await fetch("https://zhengtaing.github.io/hookline/song-meta.json")
  .then((r) => (r.ok ? r.json() : {}))
  .catch(() => ({}));
const meta = {};

for (const { title, artist } of picks) {
  const key = `${title}|${artist}`;
  if (meta[key]) continue;
  if (live[key]?.preview) {
    meta[key] = live[key];
    continue;
  }
  try {
    // Long credit lines ("HUNTR/X, EJAE, …") search better by their first name.
    const url = `https://itunes.apple.com/search?country=us&entity=song&limit=10&term=${encodeURIComponent(`${title} ${artist.split(",")[0]}`)}`;
    const { results = [] } = await (await fetch(url)).json();
    const hit =
      results.find((r) => norm(r.trackName) === norm(title) && norm(artist).includes(norm(r.artistName).split(" ")[0])) ??
      results.find((r) => norm(r.trackName).startsWith(norm(title)));
    if (!hit) {
      console.warn(`No match for ${key}`);
      continue;
    }
    meta[key] = {
      artwork: hit.artworkUrl100?.replace("100x100bb", "600x600bb"),
      url: hit.trackViewUrl,
      preview: hit.previewUrl,
      released: hit.releaseDate,
      genre: hit.primaryGenreName,
      ms: hit.trackTimeMillis,
    };
    console.log(`Found ${key}`);
  } catch (err) {
    console.warn(`Lookup failed for ${key}: ${err.message}`);
  }
  // Stay well under the API's limit of about 20 calls a minute.
  await new Promise((r) => setTimeout(r, 3500));
}

await writeFile(new URL("../public/song-meta.json", import.meta.url), JSON.stringify(meta, null, 1));
console.log(`Wrote ${Object.keys(meta).length} songs to public/song-meta.json`);
