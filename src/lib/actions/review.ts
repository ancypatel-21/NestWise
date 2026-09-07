"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { nextSchedule } from "@/lib/review";
import { track } from "@/lib/analytics";

/** Add missed questions to the review queue (called after a quiz). Idempotent per prompt.
 * `confident` marks a "confidently wrong" answer — a genuine misconception worth surfacing first. */
export async function queueForReview(
  prompts: string[],
  userId: string,
  opts: { confident?: boolean } = {},
): Promise<void> {
  const clean = [...new Set(prompts.map((p) => p.trim()).filter(Boolean))].slice(0, 40);
  const result = opts.confident ? "confident-wrong" : "wrong";
  for (const prompt of clean) {
    await db.reviewItem.upsert({
      where: { userId_prompt: { userId, prompt } },
      create: { userId, prompt, box: 1, dueAt: new Date(), lastResult: result },
      update: { box: 1, dueAt: new Date(), lastResult: result },
    });
  }
}

/** Queue missed prompts from a custom/adaptive quiz (no QuizAttempt row is written). */
export async function queueMissedForReview(prompts: string[]): Promise<void> {
  const user = await requireUser();
  await queueForReview(prompts.slice(0, 40), user.id);
}

const gradeSchema = z.object({ prompt: z.string().min(1).max(300), correct: z.boolean() });

/**
 * Grade one review item (a missed quiz question OR a flashcard, keyed by "card:<slug>") and
 * reschedule it. Upserts, so flashcards enter spaced repetition the first time you rate one.
 */
export async function gradeReview(input: z.infer<typeof gradeSchema>): Promise<void> {
  const user = await requireUser();
  const { prompt, correct } = gradeSchema.parse(input);
  const existing = await db.reviewItem.findUnique({
    where: { userId_prompt: { userId: user.id, prompt } },
  });
  const { box, dueAt } = nextSchedule(existing?.box ?? 1, correct);
  await db.reviewItem.upsert({
    where: { userId_prompt: { userId: user.id, prompt } },
    create: {
      userId: user.id,
      prompt,
      box,
      dueAt,
      lastResult: correct ? "right" : "wrong",
    },
    update: { box, dueAt, lastResult: correct ? "right" : "wrong", reviewedAt: new Date() },
  });
  track("review_graded", { correct, box, card: prompt.startsWith("card:") });
}
