import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { db } from "@/lib/db";
import { getFamilyStage } from "@/lib/personalization/stage";
import {
  applyJourneyOverride,
  isJourney,
  MODE_OVERRIDE_COOKIE,
} from "@/lib/personalization/mode-override";
import type { FamilyContext } from "@/types";
import { auth } from "./index";

/**
 * Load the signed-in user + their family context in one place (PRD §40: role-based views).
 * Cached per-request so pages and layout can both call it cheaply.
 */
export const getSessionUser = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) return null;
  return db.user.findUnique({
    where: { id: session.user.id },
    include: {
      memberships: { include: { family: true } },
    },
  });
});

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

export const getFamilyContext = cache(async (): Promise<FamilyContext | null> => {
  const user = await getSessionUser();
  if (!user) return null;

  const membership = user.memberships[0];
  if (!membership) return null;

  const [pregnancyProfile, children] = await Promise.all([
    db.pregnancyProfile.findUnique({ where: { familyId: membership.familyId } }),
    db.child.findMany({ where: { familyId: membership.familyId }, orderBy: { dateOfBirth: "asc" } }),
  ]);

  const naturalStage = getFamilyStage(pregnancyProfile, children);
  const override = (await cookies()).get(MODE_OVERRIDE_COOKIE)?.value;
  const stage = isJourney(override)
    ? applyJourneyOverride(naturalStage, override, pregnancyProfile, children)
    : naturalStage;

  return {
    familyId: membership.familyId,
    role: membership.role,
    stage,
    pregnancyProfile,
    children,
    personalization: {
      role: membership.role,
      dietaryPreferences: pregnancyProfile?.dietaryPreferences ?? [],
      allergies: pregnancyProfile?.allergies ?? [],
      contentPreferences: pregnancyProfile?.contentPreferences ?? [],
      country: user.country,
      timezone: user.timezone,
    },
  };
});

export async function requireFamilyContext(): Promise<FamilyContext> {
  const ctx = await getFamilyContext();
  if (!ctx) redirect("/onboarding");
  return ctx;
}

export function requireRole(actual: Role, allowed: Role[]) {
  if (!allowed.includes(actual)) redirect("/home");
}
