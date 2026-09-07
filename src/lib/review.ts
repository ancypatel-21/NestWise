/**
 * Spaced repetition — a simple Leitner ladder. A question you get wrong enters box 1, due now.
 * Get it right in review and it moves up a box with a longer interval; get it wrong and it
 * drops back to box 1. No settings, no decks to manage — just "what's due today".
 */
export const BOX_INTERVAL_DAYS = [0, 1, 3, 7, 16, 45];
export const MAX_BOX = 5;

const DAY_MS = 86_400_000;

export function nextSchedule(box: number, correct: boolean): { box: number; dueAt: Date } {
  const newBox = correct ? Math.min(MAX_BOX, box + 1) : 1;
  const days = BOX_INTERVAL_DAYS[newBox] ?? 1;
  return { box: newBox, dueAt: new Date(Date.now() + days * DAY_MS) };
}

export function boxLabel(box: number): string {
  return ["", "Learning", "Getting there", "Familiar", "Strong", "Learned"][box] ?? "Learning";
}
