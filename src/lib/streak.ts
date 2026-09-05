import { startOfDay } from "@/lib/personalization/pregnancy";

/**
 * Consecutive-day streak ending today (or yesterday), from a list of activity timestamps.
 * Used for the learning streak on the progress dashboards (PRD §37, §2.2).
 */
export function computeStreak(dates: Date[], today: Date = new Date()): number {
  if (dates.length === 0) return 0;
  const days = new Set(dates.map((d) => startOfDay(d).getTime()));
  const DAY = 86_400_000;

  let cursor = startOfDay(today).getTime();
  if (!days.has(cursor)) {
    cursor -= DAY; // allow a streak that's current as of yesterday
    if (!days.has(cursor)) return 0;
  }

  let streak = 0;
  while (days.has(cursor)) {
    streak += 1;
    cursor -= DAY;
  }
  return streak;
}
