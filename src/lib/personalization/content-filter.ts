import type { Content, Role } from "@prisma/client";

export interface ContentFilterOptions {
  pregnancyWeek?: number;
  childAgeMonths?: number;
  role?: Role;
  allergies?: string[];
  dietaryPreferences?: string[];
}

/**
 * Filter curated content to what is relevant now (PRD §50: personalise only with data the user
 * chose to provide). Nutrition/food entries that name a declared allergen are removed entirely;
 * dietary preferences are used to rank, not hide, so guidance stays discoverable.
 */
export function filterContent<T extends Content>(
  items: T[],
  opts: ContentFilterOptions,
): T[] {
  const allergies = (opts.allergies ?? []).map((a) => a.toLowerCase().trim()).filter(Boolean);

  return items.filter((item) => {
    if (opts.role && item.role && item.role !== opts.role) return false;

    if (item.pregnancyWeek != null && opts.pregnancyWeek != null) {
      if (Math.abs(item.pregnancyWeek - opts.pregnancyWeek) > 1) return false;
    }

    if (
      (item.ageMinMonths != null || item.ageMaxMonths != null) &&
      opts.childAgeMonths != null
    ) {
      const min = item.ageMinMonths ?? 0;
      const max = item.ageMaxMonths ?? 10_000;
      if (opts.childAgeMonths < min || opts.childAgeMonths > max) return false;
    }

    if (allergies.length && item.contentType === "FOOD") {
      const haystack = `${item.title} ${item.summary} ${JSON.stringify(item.blocks)}`.toLowerCase();
      if (allergies.some((allergen) => haystack.includes(allergen))) return false;
    }

    return true;
  });
}

/** True when a declared dietary preference conflicts with a food entry's category tags. */
export function conflictsWithDiet(
  foodCategory: string,
  dietaryPreferences: string[],
): boolean {
  const cat = foodCategory.toLowerCase();
  const prefs = dietaryPreferences.map((p) => p.toLowerCase());
  if (prefs.includes("vegan") && (cat.includes("meat") || cat.includes("dairy") || cat.includes("fish") || cat.includes("egg")))
    return true;
  if (prefs.includes("vegetarian") && (cat.includes("meat") || cat.includes("fish")))
    return true;
  return false;
}
