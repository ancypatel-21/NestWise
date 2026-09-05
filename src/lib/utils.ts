/**
 * Tiny className combiner. Keeps component code readable without pulling in a dependency.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function formatDate(value: Date | string, opts?: Intl.DateTimeFormatOptions): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", opts ?? { dateStyle: "medium" }).format(date);
}

/** Deterministic index into an array from a date — used for "one per day" content. */
export function dailyIndex(length: number, seed = new Date()): number {
  if (length <= 0) return 0;
  const dayNumber = Math.floor(
    Date.UTC(seed.getUTCFullYear(), seed.getUTCMonth(), seed.getUTCDate()) / 86_400_000,
  );
  return ((dayNumber % length) + length) % length;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function pct(part: number, whole: number): number {
  if (whole <= 0) return 0;
  return Math.round((part / whole) * 100);
}
