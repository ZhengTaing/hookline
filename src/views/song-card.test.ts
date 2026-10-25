import { describe, expect, it } from "vitest";
import { chapterSong, renderSongCard } from "./song-card";

describe("chapter songs", () => {
  it("finds every picked song in the playlist and keeps the guitar step", () => {
    for (const n of [1, 2, 3]) {
      const song = chapterSong(n);
      expect(song, `chapter ${n}`).toBeDefined();
      expect(renderSongCard(song!)).toContain("Build it on guitar");
    }
  });
});
