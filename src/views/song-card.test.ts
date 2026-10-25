import { describe, expect, it } from "vitest";
import challenges from "../data/challenges.json";
import sectionSongs from "../data/section-songs.json";
import { chapterChallenge } from "../lessons/challenge";
import { findSong } from "../songs";
import { renderSectionSongs, songsFor } from "./song-card";

describe("playlist songs", () => {
  it("finds every section song in the playlists and keeps the guitar step", () => {
    for (const id of Object.keys(sectionSongs)) {
      expect(songsFor(id)?.songs.length, id).toBe(3);
      expect(renderSectionSongs(id)).toContain("Build it on guitar");
    }
  });

  it("builds a 3-round challenge whose songs are all in the playlists", () => {
    for (const n of Object.keys(challenges.chapters)) {
      const lesson = chapterChallenge(Number(n))!;
      expect(lesson.steps).toHaveLength(3);
      for (const step of lesson.steps) {
        if (step.type !== "practice") continue;
        expect(step.questions.length, `${n} ${step.title}`).toBeGreaterThan(0);
        for (const q of step.questions) {
          if (q.kind !== "choice") continue;
          expect(q.options).toContain(q.answer);
          if (q.sound?.kind === "song") expect(findSong(q.sound.title, q.sound.artist), q.sound.title).toBeDefined();
        }
      }
    }
  });
});
