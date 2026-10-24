const COPY: Record<string, { title: string; body: string; milestone: string }> = {
  songs: { title: "My songs", body: "Your drafts, with each lesson turned into a change you can hear.", milestone: "M5" },
  chords: { title: "Chords", body: "Chord sheets that auto-scroll and transpose, with Roman numerals.", milestone: "M6" },
  quiz: { title: "Quiz", body: "Questions about songs you actually listen to.", milestone: "M7" },
};

export function renderPlaceholder(tab: string): string {
  const c = COPY[tab];
  return `
    <section class="placeholder">
      <h2>${c.title}</h2>
      <p>${c.body}</p>
      <p class="muted">Coming in milestone ${c.milestone}.</p>
    </section>
  `;
}
