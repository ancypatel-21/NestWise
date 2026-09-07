import type { Metadata } from "next";
import { getSessionUser, requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { QUESTION_BY_PROMPT } from "@/lib/quiz-index";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Callout } from "@/components/ui/Callout";
import { ReviewDeck, type ReviewCard } from "./ReviewDeck";

export const metadata: Metadata = { title: "Daily review" };

export default async function ReviewPage() {
  await requireFamilyContext();
  const user = await getSessionUser();
  if (!user) return null;

  const due = await db.reviewItem.findMany({
    where: { userId: user.id, dueAt: { lte: new Date() } },
    orderBy: { dueAt: "asc" },
    take: 15,
  });

  const cards: ReviewCard[] = due
    .map((item) => {
      const question = QUESTION_BY_PROMPT.get(item.prompt);
      return question ? { prompt: item.prompt, question } : null;
    })
    .filter((c): c is ReviewCard => c !== null);

  const totalTracked = await db.reviewItem.count({ where: { userId: user.id } });

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Daily review"
        intro="A few questions you've got wrong before, brought back at spaced intervals so they actually stick."
        backHref="/quiz"
        backLabel="Quizzes"
      />

      {cards.length === 0 ? (
        <EmptyState title="Nothing due — you're on top of it">
          {totalTracked > 0
            ? `NestWise is tracking ${totalTracked} question${totalTracked === 1 ? "" : "s"}. They'll come back for review over the next few days.`
            : "Miss a question in any quiz and it'll show up here for spaced review."}
        </EmptyState>
      ) : (
        <>
          <Callout tone="tip" className="mb-4">
            {cards.length} card{cards.length === 1 ? "" : "s"} due. Get one right and it moves to a
            longer interval; miss it and it comes back sooner.
          </Callout>
          <ReviewDeck cards={cards} />
        </>
      )}
    </div>
  );
}
