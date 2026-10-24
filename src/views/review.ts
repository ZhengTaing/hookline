import { dueCards } from "../progress";
import type { Progress } from "../store";

/**
 * The Review tab: due cards one at a time. Tap to see the answer, then say whether you knew it.
 * Calls `onAnswer` with the card's text and whether it was remembered.
 */
export function mountReview(root: HTMLElement, progress: Progress, today: string, onAnswer: (text: string, remembered: boolean) => void): void {
  const due = dueCards(progress, today);
  if (!due.length) {
    const upcoming = progress.review.map((r) => r.due).filter((d) => d > today).sort()[0];
    root.innerHTML = `
      <section class="review">
        <p class="eyebrow">Review</p>
        <h2>All caught up</h2>
        <p class="muted">${
          progress.review.length
            ? `${progress.review.length} card${progress.review.length === 1 ? "" : "s"} in your deck. The next one comes back on ${upcoming}.`
            : "Finish a section and its key fact becomes a card here. Anything you miss comes back too."
        }</p>
        <a class="btn" href="#learn">Back to the course</a>
      </section>`;
    return;
  }

  const card = due[0];
  const isFact = !!card.back;
  root.innerHTML = `
    <section class="review">
      <p class="eyebrow">Review · ${due.length} due</p>
      <button class="flash" type="button" data-flip>
        <span class="flash-front">${isFact ? card.text : "Remember this?"}</span>
        <span class="flash-back" hidden>${isFact ? card.back : card.text}</span>
        <small class="hint">Tap to see the answer</small>
      </button>
      <div class="row push" data-grade hidden>
        <button class="btn ghost" type="button" data-again>Again tomorrow</button>
        <button class="btn" type="button" data-knew>I knew it</button>
      </div>
    </section>`;
  root.querySelector("[data-flip]")!.addEventListener("click", () => {
    root.querySelector<HTMLElement>(".flash-back")!.hidden = false;
    root.querySelector<HTMLElement>(".flash .hint")!.hidden = true;
    root.querySelector<HTMLElement>("[data-grade]")!.hidden = false;
  });
  root.querySelector("[data-again]")!.addEventListener("click", () => onAnswer(card.text, false));
  root.querySelector("[data-knew]")!.addEventListener("click", () => onAnswer(card.text, true));
}
