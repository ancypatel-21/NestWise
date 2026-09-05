/**
 * Pregnancy timing helpers. PRD §5.1 / §8: content uses gestational weeks; months are an
 * approximation only. A full-term pregnancy is counted as 40 weeks from the last menstrual
 * period (LMP), which is 280 days before the estimated due date (EDD).
 */

const DAY_MS = 86_400_000;
export const FULL_TERM_WEEKS = 40;
export const FULL_TERM_DAYS = FULL_TERM_WEEKS * 7;

export function startOfDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / DAY_MS);
}

/**
 * Current gestational week from an estimated due date.
 * Clamped to 1..42 so early/overdue inputs still resolve to a real timeline page.
 */
export function pregnancyWeekFromDueDate(dueDate: Date, today: Date = new Date()): number {
  const daysUntilDue = daysBetween(today, dueDate);
  const gestationalDays = FULL_TERM_DAYS - daysUntilDue;
  // "Current" gestational week = completed weeks + 1, following the common tracker convention
  // that the due date reads as week 40 (not 41). Overdue days roll past 40, capped at 42.
  const week =
    gestationalDays >= FULL_TERM_DAYS
      ? FULL_TERM_WEEKS + Math.floor((gestationalDays - FULL_TERM_DAYS) / 7)
      : Math.floor(gestationalDays / 7) + 1;
  return Math.min(42, Math.max(1, week));
}

export function dueDateFromWeek(week: number, today: Date = new Date()): Date {
  const gestationalDays = (week - 1) * 7;
  const daysUntilDue = FULL_TERM_DAYS - gestationalDays;
  return startOfDay(new Date(today.getTime() + daysUntilDue * DAY_MS));
}

export function daysUntilDueDate(dueDate: Date, today: Date = new Date()): number {
  return daysBetween(today, dueDate);
}

export function trimesterForWeek(week: number): 1 | 2 | 3 {
  if (week <= 13) return 1;
  if (week <= 27) return 2;
  return 3;
}

/**
 * Human phrasing per PRD §5.1 example: "8 weeks — approximately 2 months".
 * Uses the common clinical convention of ~4.34 weeks per month.
 */
export function weeksToMonths(week: number): string {
  const months = Math.max(1, Math.round(week / 4.34524));
  return `${week} weeks — approximately ${months} month${months === 1 ? "" : "s"}`;
}

export function approxMonths(week: number): number {
  return Math.max(1, Math.round(week / 4.34524));
}
