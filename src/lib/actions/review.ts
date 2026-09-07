"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { nextSchedule } from "@/lib/review";
import { track } from "@/lib/analytics";

/** Add missed questions to the review queue (called after a quiz). Idempotent per prompt. */
export async function queueForReview(prompts: string[], userId: string): Promise<void> {
  const clean = [...new Set(prompts.map((p) => p.trim()).filter(Boolean))].slice(0, 40);
  for (const prompt of clean) {
    await db.reviewItem.upsert({
      where: { userId_prompt: { userId, prompt } },
      create: { userId, prompt, box: 1, dueAt: new Date(), lastResult: "wrong" },
      // If it already exists, a fresh miss pulls it back to box 1, due now.
      update: { box: 1, dueAt: new Date(), lastResult: "wrong" },
    });
  }
}

const gradeSchema = z.object({ prompt: z.string().min(1), correct: z.boolean() });

/** Grade one review card and reschedule it. */
export async function gradeReview(input: z.infer<typeof gradeSchema>): Promise<void> {
  const user = await requireUser();
  const { prompt, correct } = gradeSchema.parse(input);
  const item = await db.reviewItem.findUnique({
    where: { userId_prompt: { userId: user.id, prompt } },
  });
  if (!item) return;
  const { box, dueAt } = nextSchedule(item.box, correct);
  await db.reviewItem.update({
    where: { id: item.id },
    data: { box, dueAt, lastResult: correct ? "right" : "wrong", reviewedAt: new Date() },
  });
  track("review_graded", { correct, box });
}
