"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireFamilyContext } from "@/lib/auth/session";

const itemSchema = z.object({ label: z.string().min(1).max(60), time: z.string().max(10) });
const routineSchema = z.object({
  childId: z.string().min(1),
  title: z.string().min(1).max(80),
  items: z.array(itemSchema).min(1).max(20),
});

async function assertOwnsChild(childId: string) {
  const ctx = await requireFamilyContext();
  if (!ctx.children.some((c) => c.id === childId)) throw new Error("Not found");
}

export async function saveRoutine(input: z.infer<typeof routineSchema>) {
  const data = routineSchema.parse(input);
  await assertOwnsChild(data.childId);
  await db.routine.create({
    data: {
      childId: data.childId,
      title: data.title,
      items: data.items as unknown as object,
      enabled: true,
    },
  });
  revalidatePath("/child/routines");
}

export async function toggleRoutine(id: string, enabled: boolean) {
  const routine = await db.routine.findUnique({ where: { id } });
  if (!routine) return;
  await assertOwnsChild(routine.childId);
  await db.routine.update({ where: { id }, data: { enabled } });
  revalidatePath("/child/routines");
}

export async function deleteRoutine(id: string) {
  const routine = await db.routine.findUnique({ where: { id } });
  if (!routine) return;
  await assertOwnsChild(routine.childId);
  await db.routine.delete({ where: { id } });
  revalidatePath("/child/routines");
}
