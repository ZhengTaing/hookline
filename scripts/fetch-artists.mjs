// Looks up artist photos on the Spotify Web API and writes public/artist-meta.json.
// Runs in the deploy workflow with the SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET repository
// secrets. Without them (or if Spotify can't be reached) the site uses Wikipedia photos instead.
import { readFile, writeFile } from "node:fs/promises";

const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret } = process.env;
if (!id || !secret) {
  console.log("No Spotify secrets; skipping artist photos");
  process.exit(0);
}

const { artists } = JSON.parse(await readFile(new URL("../src/data/challenges.json", import.meta.url), "utf8"));
const auth = await fetch("https://accounts.spotify.com/api/token", {
  method: "POST",
  headers: { Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
  body: "grant_type=client_credentials",
}).then((r) => r.json());
if (!auth.access_token) throw new Error(`Spotify sign-in failed: ${auth.error ?? "no token"}`);

const meta = {};
for (const name of artists) {
  const url = `https://api.spotify.com/v1/search?type=artist&limit=5&q=${encodeURIComponent(name)}`;
  const { artists: found } = await fetch(url, { headers: { Authorization: `Bearer ${auth.access_token}` } }).then((r) => r.json());
  const items = found?.items ?? [];
  const hit = items.find((a) => a.name.toLowerCase() === name.toLowerCase()) ?? items[0];
  if (!hit?.images?.length) {
    console.warn(`No Spotify photo for ${name}`);
    continue;
  }
  // Spotify lists its images largest first.
  meta[name] = { image: hit.images[0].url, url: hit.external_urls?.spotify };
  console.log(`Found ${name} (${hit.name})`);
}

await writeFile(new URL("../public/artist-meta.json", import.meta.url), JSON.stringify(meta, null, 1));
console.log(`Wrote ${Object.keys(meta).length} artists to public/artist-meta.json`);
