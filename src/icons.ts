const svg = (body: string) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

export const ICONS = {
  learn: svg('<path d="M4 6l8-3 8 3-8 3z"/><path d="M7 8v5c0 1.5 2.5 3 5 3s5-1.5 5-3V8"/>'),
  practice: svg('<path d="M3 12h3l2-5 3 10 3-7 2 2h5"/>'),
  artists: svg('<path d="M12 3l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.4l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z"/>'),
  songs: svg('<circle cx="7" cy="17" r="3"/><path d="M10 17V5l10-2v12"/><circle cx="17" cy="15" r="3"/>'),
  chords: svg('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M5 8h14M5 13h14M10 3v18M14 3v18"/>'),
  quiz: svg('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 015 0c0 1.7-2.5 2-2.5 3.5M12 17h.01"/>'),
};
