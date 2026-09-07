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
 * due date / child's age, but a signed-in adult can jump to any journey they have data for —
 * e.g. peek at Pre-birth while still weeks away. Stored in a cookie, cleared by choosing "Auto".
 */
export const MODE_OVERRIDE_COOKIE = "nw-mode";

export type OverridableMode = Extract<
  StageMode,
  "pregnancy" | "birth-countdown" | "postpartum" | "child"
>;

const LABELS: Record<OverridableMode, string> = {
  pregnancy: "Pregnancy",
  "birth-countdown": "Pre-birth",
  postpartum: "Postpartum",
  child: "Child & family",
};

/** All four journeys, in the order a family moves through them. */
export const ALL_MODES: OverridableMode[] = [
  "pregnancy",
  "birth-countdown",
  "postpartum",
  "child",
];

export function isOverridableMode(v: string | undefined | null): v is OverridableMode {
  return (
    v === "pregnancy" || v === "birth-countdown" || v === "postpartum" || v === "child"
  );
}

/**
 * Journeys the family can switch into. All four are always offered so a user can look
 * ahead (or back) at any point; a journey with no data on file still opens, just without
 * week/age specifics. `hasData` flags which ones are populated for the current family.
 */
export function availableModes(
  pregnancyProfile: PregnancyProfile | null,
  children: Child[],
): Array<{ value: OverridableMode; label: string; hasData: boolean }> {
  return ALL_MODES.map((value) => ({
    value,
    label: LABELS[value],
    hasData:
      value === "pregnancy" || value === "birth-countdown"
        ? pregnancyProfile != null
        : children.length > 0,
  }));
}

/**
 * Re-derive the stage for a manually chosen journey. Week/age details are filled in when the
 * family has the relevant profile; otherwise the journey still opens with just its mode set
 * (pages already handle "no pregnancy profile" / "no child yet" with a set-up prompt).
 */
export function applyModeOverride(
  natural: FamilyStage,
  override: OverridableMode,
  pregnancyProfile: PregnancyProfile | null,
  children: Child[],
  today: Date = new Date(),
): FamilyStage {
  if (override === "pregnancy" || override === "birth-countdown") {
    const part = override === "birth-countdown" ? 2 : 1;
    if (!pregnancyProfile) return { part, mode: override };
    const week = pregnancyWeekFromDueDate(pregnancyProfile.estimatedDueDate, today);
    const days = daysUntilDueDate(pregnancyProfile.estimatedDueDate, today);
    return {
      part,
      mode: override,
      pregnancyWeek: week,
      approxMonths: approxMonths(week),
      trimester: trimesterForWeek(week),
      dueDate: pregnancyProfile.estimatedDueDate.toISOString(),
      daysToDueDate: days,
    };
  }

  const part = override === "postpartum" ? 2 : 3;
  const youngest = [...children].sort(
    (a, b) => b.dateOfBirth.getTime() - a.dateOfBirth.getTime(),
  )[0];
  if (!youngest) return { part, mode: override };
  const age = ageFromDob(youngest.dateOfBirth, today);
  return {
    part,
    mode: override,
    primaryChildId: youngest.id,
    primaryChildName: youngest.nameOrNickname,
    childAgeMonths: age.months,
    childStageSlug: age.stageSlug,
  };
}
