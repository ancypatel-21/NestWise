import { daysBetween, startOfDay } from "./pregnancy";

export interface ChildAge {
  totalDays: number;
  months: number; // whole months since birth
  years: number;
  label: string; // "3 months", "1 year 2 months", "6 years"
  stageSlug: string; // maps to a Content / timeline stage
}

/**
 * Age of a child from date of birth. PRD §26: the first year is described month-by-month,
 * later years in yearly bands. Development is never treated as pass/fail (PRD §26, §37).
 */
export function ageFromDob(dob: Date, today: Date = new Date()): ChildAge {
  const totalDays = Math.max(0, daysBetween(dob, today));
  const months = Math.floor(totalDays / 30.4375);
  const years = Math.floor(months / 12);
  const remMonths = months % 12;

  let label: string;
  if (months < 24) {
    label = `${months} month${months === 1 ? "" : "s"}`;
  } else if (remMonths === 0) {
    label = `${years} year${years === 1 ? "" : "s"}`;
  } else {
    label = `${years} year${years === 1 ? "" : "s"} ${remMonths} month${remMonths === 1 ? "" : "s"}`;
  }

  return { totalDays, months, years, label, stageSlug: stageSlugForMonths(months) };
}

/**
 * Timeline stage slug for a given age in months.
 * Months 1..12 -> "month-N"; then yearly bands "age-1-2" .. "age-11-12".
 */
export function stageSlugForMonths(months: number): string {
  if (months < 12) return `month-${Math.max(1, months + 1)}`;
  const lower = Math.min(11, Math.floor(months / 12));
  return `age-${lower}-${lower + 1}`;
}

export function monthsSince(date: Date, today: Date = new Date()): number {
  return Math.floor(Math.max(0, daysBetween(date, today)) / 30.4375);
}

export { startOfDay };
