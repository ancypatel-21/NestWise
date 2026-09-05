"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { ContactKind } from "@prisma/client";
import { db } from "@/lib/db";
import { requireUser, requireFamilyContext } from "@/lib/auth/session";
import { signOut } from "@/lib/auth";
import { track } from "@/lib/analytics";

const profileSchema = z.object({
  displayName: z.string().min(1).max(80),
  country: z.string().min(2).max(2),
  timezone: z.string().max(64),
});

export async function updateProfile(formData: FormData) {
  const user = await requireUser();
  const parsed = profileSchema.safeParse({
    displayName: formData.get("displayName"),
    country: formData.get("country"),
    timezone: formData.get("timezone"),
  });
  if (!parsed.success) return;
  await db.user.update({ where: { id: user.id }, data: parsed.data });
  revalidatePath("/settings");
}

export async function updatePreferences(input: {
  dietaryPreferences: string[];
  allergies: string[];
  contentPreferences: string[];
  reminders: string[];
}) {
  const ctx = await requireFamilyContext();
  const user = await requireUser();

  await db.user.update({
    where: { id: user.id },
    data: {
      preferences: {
        ...(typeof user.preferences === "object" && user.preferences ? user.preferences : {}),
        interests: input.contentPreferences,
        reminders: input.reminders,
      },
    },
  });

  if (ctx.pregnancyProfile) {
    await db.pregnancyProfile.update({
      where: { familyId: ctx.familyId },
      data: {
        dietaryPreferences: input.dietaryPreferences,
        allergies: input.allergies,
        contentPreferences: input.contentPreferences,
      },
    });
  }
  track("preferences_updated", {});
  revalidatePath("/settings");
  revalidatePath("/nutrition");
}

const dueSchema = z.object({ estimatedDueDate: z.string() });
export async function updateDueDate(formData: FormData) {
  const ctx = await requireFamilyContext();
  if (!ctx.pregnancyProfile) return;
  const parsed = dueSchema.safeParse({ estimatedDueDate: formData.get("estimatedDueDate") });
  if (!parsed.success) return;
  const d = new Date(parsed.data.estimatedDueDate);
  if (Number.isNaN(d.getTime())) return;
  await db.pregnancyProfile.update({
    where: { familyId: ctx.familyId },
    data: { estimatedDueDate: d },
  });
  revalidatePath("/settings");
  revalidatePath("/home");
}

const contactSchema = z.object({
  kind: z.enum(["PROVIDER", "HOSPITAL", "PEDIATRICIAN", "EMERGENCY"]),
  name: z.string().min(1).max(120),
  phone: z.string().max(40).optional(),
  notes: z.string().max(200).optional(),
});

export async function addContact(formData: FormData) {
  const ctx = await requireFamilyContext();
  const parsed = contactSchema.safeParse({
    kind: formData.get("kind"),
    name: formData.get("name"),
    phone: formData.get("phone") || undefined,
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) return;
  await db.contact.create({
    data: { familyId: ctx.familyId, ...parsed.data, kind: parsed.data.kind as ContactKind },
  });
  revalidatePath("/settings");
}

export async function deleteContact(id: string) {
  const ctx = await requireFamilyContext();
  await db.contact.deleteMany({ where: { id, familyId: ctx.familyId } });
  revalidatePath("/settings");
}

/** PRD §52: full account + data deletion. */
export async function deleteAccount() {
  const user = await requireUser();
  const memberships = await db.familyMembership.findMany({ where: { userId: user.id } });
  // If the user is the only member of a family, remove the whole family (cascades everything).
  for (const m of memberships) {
    const count = await db.familyMembership.count({ where: { familyId: m.familyId } });
    if (count <= 1) {
      await db.family.delete({ where: { id: m.familyId } });
    }
  }
  await db.user.delete({ where: { id: user.id } });
  track("account_deleted", {});
  await signOut({ redirectTo: "/" });
}

/** PRD §52 / §38: machine-readable export of the user's own data. */
export async function requestExport(): Promise<void> {
  redirect("/api/export");
}
