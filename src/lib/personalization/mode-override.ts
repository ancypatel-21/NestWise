import type { Child, PregnancyProfile } from "@prisma/client";
import type { FamilyStage, StageMode } from "@/types";
import { ageFromDob } from "./age";
import {
  approxMonths,
  daysUntilDueDate,
  pregnancyWeekFromDueDate,
  trimesterForWeek,
} from "./pregnancy";

/**
 * Manual journey switch (header dropdown). The family's stage is normally derived from their
 * due date / child's age, but a signed-in adult can jump to any of the three journeys at any
 * time — e.g. peek at Birth & Postpartum while still weeks away. The chosen journey is stored
 * in a cookie and cleared by choosing "Auto".
 */
export const MODE_OVERRIDE_COOKIE = "nw-journey";

/** The product's three journeys (PRD §3). "Birth & Postpartum" spans two stage modes. */
export type Journey = "pregnancy" | "birth-postpartum" | "child";

export type OverridableMode = Extract<
  StageMode,
  "pregnancy" | "birth-countdown" | "postpartum" | "child"
>;

const JOURNEY_LABELS: Record<Journey, string> = {
  pregnancy: "Pregnancy",
  "birth-postpartum": "Birth & Postpartum",
  child: "Child & family",
};

/** In the order a family moves through them. */
export const ALL_JOURNEYS: Journey[] = ["pregnancy", "birth-postpartum", "child"];

export function isJourney(v: string | undefined | null): v is Journey {
  return v === "pregnancy" || v === "birth-postpartum" || v === "child";
}

/** Which journey a resolved stage mode belongs to. */
export function journeyForMode(mode: StageMode): Journey | null {
  if (mode === "pregnancy") return "pregnancy";
  if (mode === "birth-countdown" || mode === "postpartum") return "birth-postpartum";
  if (mode === "child") return "child";
  return null;
}

/**
 * The concrete stage mode a chosen journey resolves to for this family. "Birth & Postpartum"
 * is pre-birth while still expecting, and postpartum once a baby is on file.
 */
export function modeForJourney(
  journey: Journey,
  _pregnancyProfile: PregnancyProfile | null,
  children: Child[],
): OverridableMode {
  if (journey === "pregnancy") return "pregnancy";
  if (journey === "child") return "child";
  return children.length > 0 ? "postpartum" : "birth-countdown";
}

/**
 * All three journeys, always offered so a user can look ahead (or back) at any point. A
 * journey with nothing on file still opens, just without week/age specifics; `hasData` flags
 * which are populated for the current family.
 */
export function availableJourneys(
  pregnancyProfile: PregnancyProfile | null,
  children: Child[],
): Array<{ value: Journey; label: string; hasData: boolean }> {
  return ALL_JOURNEYS.map((value) => ({
    value,
    label: JOURNEY_LABELS[value],
    hasData:
      value === "pregnancy"
        ? pregnancyProfile != null
        : value === "child"
          ? children.length > 0
          : pregnancyProfile != null || children.length > 0,
  }));
}

/**
 * Re-derive the stage for a manually chosen journey. Week/age details are filled in when the
 * family has the relevant profile; otherwise the journey still opens with just its mode set
 * (pages already handle "no pregnancy profile" / "no child yet" with a set-up prompt).
 */
export function applyJourneyOverride(
  natural: FamilyStage,
  journey: Journey,
  pregnancyProfile: PregnancyProfile | null,
  children: Child[],
  today: Date = new Date(),
): FamilyStage {
  const mode = modeForJourney(journey, pregnancyProfile, children);

  if (mode === "pregnancy" || mode === "birth-countdown") {
    const part = mode === "birth-countdown" ? 2 : 1;
    if (!pregnancyProfile) return { part, mode };
    const week = pregnancyWeekFromDueDate(pregnancyProfile.estimatedDueDate, today);
    const days = daysUntilDueDate(pregnancyProfile.estimatedDueDate, today);
    return {
      part,
      mode,
      pregnancyWeek: week,
      approxMonths: approxMonths(week),
      trimester: trimesterForWeek(week),
      dueDate: pregnancyProfile.estimatedDueDate.toISOString(),
      daysToDueDate: days,
    };
  }

  const part = mode === "postpartum" ? 2 : 3;
  const youngest = [...children].sort(
    (a, b) => b.dateOfBirth.getTime() - a.dateOfBirth.getTime(),
  )[0];
  if (!youngest) return { part, mode };
  const age = ageFromDob(youngest.dateOfBirth, today);
  return {
    part,
    mode,
    primaryChildId: youngest.id,
    primaryChildName: youngest.nameOrNickname,
    childAgeMonths: age.months,
    childStageSlug: age.stageSlug,
  };
}
