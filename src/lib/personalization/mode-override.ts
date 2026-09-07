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

export function isOverridableMode(v: string | undefined | null): v is OverridableMode {
  return (
    v === "pregnancy" || v === "birth-countdown" || v === "postpartum" || v === "child"
  );
}

/** Journeys the family can switch into, given the data on file. */
export function availableModes(
  pregnancyProfile: PregnancyProfile | null,
  children: Child[],
): Array<{ value: OverridableMode; label: string }> {
  const modes: OverridableMode[] = [];
  if (pregnancyProfile) modes.push("pregnancy", "birth-countdown");
  if (children.length) modes.push("postpartum", "child");
  return modes.map((value) => ({ value, label: LABELS[value] }));
}

/** Re-derive the stage for a manually chosen journey, keeping week/age details accurate. */
export function applyModeOverride(
  natural: FamilyStage,
  override: OverridableMode,
  pregnancyProfile: PregnancyProfile | null,
  children: Child[],
  today: Date = new Date(),
): FamilyStage {
  if (override === "pregnancy" || override === "birth-countdown") {
    if (!pregnancyProfile) return natural;
    const week = pregnancyWeekFromDueDate(pregnancyProfile.estimatedDueDate, today);
    const days = daysUntilDueDate(pregnancyProfile.estimatedDueDate, today);
    return {
      part: override === "birth-countdown" ? 2 : 1,
      mode: override,
      pregnancyWeek: week,
      approxMonths: approxMonths(week),
      trimester: trimesterForWeek(week),
      dueDate: pregnancyProfile.estimatedDueDate.toISOString(),
      daysToDueDate: days,
    };
  }

  const youngest = [...children].sort(
    (a, b) => b.dateOfBirth.getTime() - a.dateOfBirth.getTime(),
  )[0];
  if (!youngest) return natural;
  const age = ageFromDob(youngest.dateOfBirth, today);
  return {
    part: override === "postpartum" ? 2 : 3,
    mode: override,
    primaryChildId: youngest.id,
    primaryChildName: youngest.nameOrNickname,
    childAgeMonths: age.months,
    childStageSlug: age.stageSlug,
  };
}
