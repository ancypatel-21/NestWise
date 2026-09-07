import type { Metadata } from "next";
import { getSessionUser, requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { questionsFromPrompts } from "@/lib/quiz-index";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Callout } from "@/components/ui/Callout";
import { QuizPlayer } from "../QuizPlayer";

export const metadata: Metadata = { title: "Review what you missed" };

export default async function QuizReviewPage() {
  await requireFamilyContext();
  const user = await getSessionUser();
  if (!user) return null;

  const attempts = await db.quizAttempt.findMany({
    where: { userId: user.id },
    orderBy: { completedAt: "desc" },
    take: 40,
  });

  // Count how often each prompt has been missed; bring back the ones missed most.
  const missCount = new Map<string, number>();
  for (const a of attempts) for (const p of a.missed) missCount.set(p, (missCount.get(p) ?? 0) + 1);

  const prompts = [...missCount.entries()]
    .sort((x, y) => y[1] - x[1])
    .map(([p]) => p)
    .slice(0, 12);
  const questions = questionsFromPrompts(prompts);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Review what you missed"
        intro="NestWise brings back the questions you've got wrong, so the tricky bits actually stick."
        backHref="/quiz"
        backLabel="All quizzes"
      />

      {questions.length === 0 ? (
        <EmptyState title="Nothing to review — nice work">
          Missed questions from any quiz will show up here for a second go.
        </EmptyState>
      ) : (
        <>
          <Callout tone="tip" className="mb-4">
            {questions.length} question{questions.length === 1 ? "" : "s"} you've missed before,
            most-missed first. Re-take the full quizzes to update your progress.
          </Callout>
          <QuizPlayer
            quizSlug="review-missed"
            title="Your review set"
            questions={questions}
            recordAttempts={false}
          />
        </>
      )}
    </div>
  );
}
