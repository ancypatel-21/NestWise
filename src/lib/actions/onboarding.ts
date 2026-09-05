"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import type { Role } from "@prisma/client";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { dueDateFromWeek } from "@/lib/personalization/pregnancy";
import { CHECKLIST_TEMPLATES } from "@/content/checklists";
import { track } from "@/lib/analytics";

const schema = z.object({
  intent: z.enum(["expecting", "arrived", "parenting"]),
  role: z.enum(["MOTHER", "PARTNER", "PARENT_CAREGIVER"]),
  // pregnancy
  dueDateMode: z.enum(["date", "week"]).optional(),
  dueDate: z.string().optional(),
  currentWeek: z.coerce.number().int().min(1).max(42).optional(),
  // child
  childName: z.string().max(60).optional(),
  childDob: z.string().optional(),
  // preferences (optional)
  dietaryPreferences: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  contentPreferences: z.array(z.string()).default([]),
  reminders: z.array(z.string()).default([]),
  timezone: z.string().default("UTC"),
  country: z.string().default("US"),
});

export type OnboardingInput = z.input<typeof schema>;

export async function completeOnboarding(raw: OnboardingInput): Promise<void> {
  const user = await requireUser();
  const data = schema.parse(raw);
  const role = data.role as Role;

  // One family per account for now (PRD §40).
  let membership = await db.familyMembership.findFirst({ where: { userId: user.id } });
  let familyId: string;
  if (membership) {
    familyId = membership.familyId;
    await db.familyMembership.update({ where: { id: membership.id }, data: { role } });
  } else {
    const family = await db.family.create({
      data: {
        name: `${user.displayName.split(" ")[0]}'s family`,
        members: { create: { userId: user.id, role } },
      },
    });
    familyId = family.id;
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      role,
      timezone: data.timezone,
      country: data.country,
      preferences: {
        journeyIntent: data.intent,
        learningFormat: data.contentPreferences[0] ?? null,
        interests: data.contentPreferences,
        reminders: data.reminders,
      },
    },
  });

  if (data.intent === "expecting") {
    let due: Date | null = null;
    if (data.dueDateMode === "date" && data.dueDate) {
      due = new Date(data.dueDate);
    } else if (data.currentWeek) {
      due = dueDateFromWeek(data.currentWeek);
    }
    if (!due || Number.isNaN(due.getTime())) {
      due = dueDateFromWeek(12); // sensible default; user can fix in settings
    }
    await db.pregnancyProfile.upsert({
      where: { familyId },
      create: {
        familyId,
        estimatedDueDate: due,
        dietaryPreferences: data.dietaryPreferences,
        allergies: data.allergies,
        contentPreferences: data.contentPreferences,
      },
      update: {
        estimatedDueDate: due,
        dietaryPreferences: data.dietaryPreferences,
        allergies: data.allergies,
        contentPreferences: data.contentPreferences,
      },
    });

    // Pre-create the birth-prep checklists so they're ready when countdown mode begins.
    await ensureChecklists(familyId);
  }

  if ((data.intent === "arrived" || data.intent === "parenting") && data.childDob) {
    const dob = new Date(data.childDob);
    if (!Number.isNaN(dob.getTime())) {
      await db.child.create({
        data: {
          familyId,
          nameOrNickname: data.childName?.trim() || "Baby",
          dateOfBirth: dob,
        },
      });
    }
    // Keep any dietary/allergy prefs on a pregnancy profile too if the user is also expecting later;
    // for now store nothing extra.
  }

  track("onboarding_completed", { intent: data.intent, role });
  redirect("/home");
}

async function ensureChecklists(familyId: string) {
  for (const tpl of CHECKLIST_TEMPLATES) {
    const existing = await db.checklist.findUnique({
      where: { familyId_kind: { familyId, kind: tpl.kind } },
    });
    if (existing) continue;
    await db.checklist.create({
      data: {
        familyId,
        kind: tpl.kind,
        items: {
          create: tpl.items.map((it, i) => ({
            label: it.label,
            category: it.category,
            sortOrder: i,
          })),
        },
      },
    });
  }
}
