"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ChecklistKind } from "@prisma/client";
import { db } from "@/lib/db";
import { requireFamilyContext } from "@/lib/auth/session";
import { CHECKLIST_TEMPLATES } from "@/content/checklists";

async function assertOwnsChecklist(checklistId: string) {
  const ctx = await requireFamilyContext();
  const cl = await db.checklist.findFirst({
    where: { id: checklistId, familyId: ctx.familyId },
  });
  if (!cl) throw new Error("Not found");
  return ctx;
}

/** Ensure a family's checklist exists, seeding default items from the template. */
export async function ensureChecklist(kind: ChecklistKind) {
  const ctx = await requireFamilyContext();
  const existing = await db.checklist.findUnique({
    where: { familyId_kind: { familyId: ctx.familyId, kind } },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });
  if (existing) return existing;

  const tpl = CHECKLIST_TEMPLATES.find((t) => t.kind === kind)!;
  return db.checklist.create({
    data: {
      familyId: ctx.familyId,
      kind,
      items: {
        create: tpl.items.map((it, i) => ({ label: it.label, category: it.category, sortOrder: i })),
      },
    },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function toggleChecklistItem(itemId: string, checked: boolean, path: string) {
  const z0 = z.object({ itemId: z.string(), checked: z.boolean() });
  z0.parse({ itemId, checked });
  const item = await db.checklistItem.findUnique({ where: { id: itemId } });
  if (!item) return;
  await assertOwnsChecklist(item.checklistId);
  await db.checklistItem.update({ where: { id: itemId }, data: { checked } });
  revalidatePath(path);
}

export async function addChecklistItem(
  checklistId: string,
  label: string,
  category: string,
  path: string,
) {
  const parsed = z
    .object({ label: z.string().min(1).max(160), category: z.string().max(60) })
    .parse({ label, category });
  await assertOwnsChecklist(checklistId);
  const count = await db.checklistItem.count({ where: { checklistId } });
  await db.checklistItem.create({
    data: {
      checklistId,
      label: parsed.label,
      category: parsed.category || "Custom",
      custom: true,
      sortOrder: count + 1,
    },
  });
  revalidatePath(path);
}

export async function deleteChecklistItem(itemId: string, path: string) {
  const item = await db.checklistItem.findUnique({ where: { id: itemId } });
  if (!item) return;
  await assertOwnsChecklist(item.checklistId);
  await db.checklistItem.delete({ where: { id: itemId } });
  revalidatePath(path);
}
