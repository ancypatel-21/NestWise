"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireFamilyContext } from "@/lib/auth/session";
import { ACTIVE_CHILD_COOKIE } from "@/lib/active-child";
import { track } from "@/lib/analytics";

export async function setActiveChild(childId: string) {
  const ctx = await requireFamilyContext();
  const child = ctx.children.find((c) => c.id === childId);
  if (!child) return;
  (await cookies()).set(ACTIVE_CHILD_COOKIE, childId, { path: "/", sameSite: "lax" });
  revalidatePath("/child");
}

const addSchema = z.object({
  nameOrNickname: z.string().min(1).max(60),
  dateOfBirth: z.string(),
});

export async function addChild(formData: FormData) {
  const ctx = await requireFamilyContext();
  const parsed = addSchema.safeParse({
    nameOrNickname: formData.get("nameOrNickname"),
    dateOfBirth: formData.get("dateOfBirth"),
  });
  if (!parsed.success) return;
  const dob = new Date(parsed.data.dateOfBirth);
  if (Number.isNaN(dob.getTime())) return;

  await db.child.create({
    data: {
      familyId: ctx.familyId,
      nameOrNickname: parsed.data.nameOrNickname.trim(),
      dateOfBirth: dob,
    },
  });
  track("child_added", {});
  revalidatePath("/settings/family");
  revalidatePath("/child");
}

/** PRD §38, §52: parents can remove a child profile and its data (journal, progress) at any time. */
export async function deleteChild(childId: string) {
  const ctx = await requireFamilyContext();
  const child = ctx.children.find((c) => c.id === childId);
  if (!child) return;
  await db.child.delete({ where: { id: childId } }); // cascades journal, progress, completions
  track("child_deleted", {});
  revalidatePath("/settings/family");
  redirect("/settings/family");
}
