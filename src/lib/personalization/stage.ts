import type { Child, PregnancyProfile } from "@prisma/client";
import type { FamilyStage } from "@/types";
import { ageFromDob } from "./age";
import {
  approxMonths,
  daysUntilDueDate,
  pregnancyWeekFromDueDate,
  trimesterForWeek,
} from "./pregnancy";

/** PRD §17: birth-preparation mode begins gradually ~4 weeks before the due date. */
export const BIRTH_COUNTDOWN_DAYS = 28;
/** Weeks after birth that the home dashboard stays in the postpartum layout (PRD §21–25). */
export const POSTPARTUM_WEEKS = 12;

/**
 * Resolve the family's current stage. The dashboard and navigation adapt to this (PRD §3, §7).
 * A newer pregnancy profile always wins over an older child (expecting again). Otherwise the
 * youngest child drives child/postpartum mode.
 */
export function getFamilyStage(
  pregnancyProfile: PregnancyProfile | null,
  children: Child[],
  today: Date = new Date(),
): FamilyStage {
  const youngest = [...children].sort(
    (a, b) => b.dateOfBirth.getTime() - a.dateOfBirth.getTime(),
  )[0];

  const pregnancyIsCurrent =
    pregnancyProfile != null &&
    (!youngest || pregnancyProfile.createdAt.getTime() >= youngest.createdAt.getTime()) &&
    daysUntilDueDate(pregnancyProfile.estimatedDueDate, today) > -21;

  if (pregnancyIsCurrent && pregnancyProfile) {
    const week = pregnancyWeekFromDueDate(pregnancyProfile.estimatedDueDate, today);
    const days = daysUntilDueDate(pregnancyProfile.estimatedDueDate, today);
    const inCountdown = days <= BIRTH_COUNTDOWN_DAYS;
    return {
      part: inCountdown ? 2 : 1,
      mode: inCountdown ? "birth-countdown" : "pregnancy",
      pregnancyWeek: week,
      approxMonths: approxMonths(week),
      trimester: trimesterForWeek(week),
      dueDate: pregnancyProfile.estimatedDueDate.toISOString(),
      daysToDueDate: days,
    };
  }

  if (youngest) {
    const age = ageFromDob(youngest.dateOfBirth, today);
    const isPostpartum = age.totalDays <= POSTPARTUM_WEEKS * 7;
    return {
      part: isPostpartum ? 2 : 3,
      mode: isPostpartum ? "postpartum" : "child",
      primaryChildId: youngest.id,
      primaryChildName: youngest.nameOrNickname,
      childAgeMonths: age.months,
      childStageSlug: age.stageSlug,
    };
  }

  return { part: 1, mode: "unset" };
}
