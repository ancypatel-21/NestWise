"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { track } from "@/lib/analytics";

const completionSchema = z.object({
  contentSlug: z.string().min(1).max(120),
  path: z.string().optional(),
});

/** Mark / unmark a lesson complete for the signed-in adult (PRD §9, §37). */
export async function toggleCompletion(
  input: z.infer<typeof completionSchema>,
): Promise<{ completed: boolean }> {
  const user = await requireUser();
  const { contentSlug, path } = completionSchema.parse(input);

  const existing = await db.lessonCompletion.findUnique({
    where: { contentSlug_userId: { contentSlug, userId: user.id } },
  });

  if (existing) {
    await db.lessonCompletion.delete({ where: { id: existing.id } });
    if (path) revalidatePath(path);
    return { completed: false };
  }

  await db.lessonCompletion.create({ data: { contentSlug, userId: user.id } });
  track("lesson_completed", {});
  if (path) revalidatePath(path);
  return { completed: true };
}

const quizSchema = z.object({
  quizSlug: z.string().min(1),
  score: z.number().int().min(0),
  total: z.number().int().min(1),
  missed: z.array(z.string().max(400)).max(40).default([]),
  childId: z.string().optional(),
});

export async function recordQuizAttempt(input: z.infer<typeof quizSchema>): Promise<void> {
  const user = await requireUser();
  const data = quizSchema.parse(input);
  await db.quizAttempt.create({
    data: {
      quizSlug: data.quizSlug,
      score: data.score,
      total: data.total,
      missed: data.missed,
      userId: data.childId ? null : user.id,
      childId: data.childId ?? null,
    },
  });
  track("quiz_completed", { scorePct: Math.round((data.score / data.total) * 100) });
}

const gameSchema = z.object({
  gameSlug: z.string().min(1),
  childId: z.string().min(1),
  level: z.number().int().min(1),
  score: z.number().int().min(0),
  skillsPracticed: z.array(z.string()).default([]),
});

export async function recordGameProgress(input: z.infer<typeof gameSchema>): Promise<void> {
  await requireUser();
  const data = gameSchema.parse(input);
  // Confirm the child belongs to the caller's family before writing (PRD §40).
  const user = await requireUser();
  const child = await db.child.findFirst({
    where: { id: data.childId, family: { members: { some: { userId: user.id } } } },
  });
  if (!child) return;

  await db.gameProgress.create({ data });
  track("game_completed", { level: data.level });
}
