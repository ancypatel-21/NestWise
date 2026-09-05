"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireFamilyContext } from "@/lib/auth/session";
import { track } from "@/lib/analytics";

const entrySchema = z.object({
  childId: z.string().min(1),
  title: z.string().min(1).max(120),
  description: z.string().max(2000).optional(),
  date: z.string(),
});

async function assertOwnsChild(childId: string) {
  const ctx = await requireFamilyContext();
  if (!ctx.children.some((c) => c.id === childId)) throw new Error("Not found");
}

export async function addJournalEntry(formData: FormData) {
  const parsed = entrySchema.safeParse({
    childId: formData.get("childId"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    date: formData.get("date"),
  });
  if (!parsed.success) return;
  await assertOwnsChild(parsed.data.childId);
  const date = new Date(parsed.data.date);
  if (Number.isNaN(date.getTime())) return;

  await db.journalEntry.create({
    data: {
      childId: parsed.data.childId,
      title: parsed.data.title.trim(),
      description: parsed.data.description?.trim() || null,
      date,
    },
  });
  track("journal_entry_added", {});
  revalidatePath("/child/journal");
}

export async function deleteJournalEntry(id: string) {
  const entry = await db.journalEntry.findUnique({ where: { id } });
  if (!entry) return;
  await assertOwnsChild(entry.childId);
  await db.journalEntry.delete({ where: { id } });
  revalidatePath("/child/journal");
}
