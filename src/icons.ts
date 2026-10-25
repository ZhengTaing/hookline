const svg = (body: string) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

export const ICONS = {
  learn: svg('<path d="M4 6l8-3 8 3-8 3z"/><path d="M7 8v5c0 1.5 2.5 3 5 3s5-1.5 5-3V8"/>'),
  practice: svg('<path d="M3 12h3l2-5 3 10 3-7 2 2h5"/>'),
  artists: svg('<path d="M12 3l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.4l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z"/>'),
};
