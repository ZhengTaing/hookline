// Dates are local calendar days as "YYYY-MM-DD", so a visit at 11pm and one at 8am
// the next morning count as two days in a row.

export function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function previousDay(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return dayKey(new Date(y, m - 1, d - 1));
}

/** Adds today to the visit list if it's missing. Returns a new sorted list. */
export function recordVisit(visits: string[], today: string): string[] {
  if (visits.includes(today)) return visits;
  return [...visits, today].sort();
}

/** Consecutive days ending today (or yesterday, so the streak isn't lost before you open the site). */
export function currentStreak(visits: string[], today: string): number {
  const set = new Set(visits);
  let cursor = set.has(today) ? today : previousDay(today);
  let count = 0;
  while (set.has(cursor)) {
    count++;
    cursor = previousDay(cursor);
  }
  return count;
}

export function bestStreak(visits: string[]): number {
  const sorted = [...new Set(visits)].sort();
  let best = 0;
  let run = 0;
  let prev = "";
  for (const day of sorted) {
    run = prev && previousDay(day) === prev ? run + 1 : 1;
    best = Math.max(best, run);
    prev = day;
  }
  return best;
}

/** The last `count` days, oldest first, marked visited or not. */
export function recentDays(visits: string[], today: string, count: number): { day: string; visited: boolean }[] {
  const set = new Set(visits);
  const days: string[] = [today];
  while (days.length < count) days.unshift(previousDay(days[0]));
  return days.map((day) => ({ day, visited: set.has(day) }));
}
