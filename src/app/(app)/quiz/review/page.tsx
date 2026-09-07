import type { Metadata } from "next";
import { getSessionUser, requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { QUESTION_BY_PROMPT } from "@/lib/quiz-index";
import { CARD_PREFIX, flashcardBySlug, lessonSlugFromCardKey } from "@/lib/flashcards";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Callout } from "@/components/ui/Callout";
import { ButtonLink } from "@/components/ui/Button";
import { ReviewDeck, type ReviewCard } from "./ReviewDeck";

export const metadata: Metadata = { title: "Daily review" };

export default async function ReviewPage() {
  await requireFamilyContext();
  const user = await getSessionUser();
  if (!user) return null;

  const due = await db.reviewItem.findMany({
    where: { userId: user.id, dueAt: { lte: new Date() } },
    take: 20,
  });
  // Confidently-wrong misconceptions first, then oldest-due.
  due.sort((a, b) => {
    const ac = a.lastResult === "confident-wrong" ? 0 : 1;
    const bc = b.lastResult === "confident-wrong" ? 0 : 1;
    return ac - bc || a.dueAt.getTime() - b.dueAt.getTime();
  });
  const confidentCount = due.filter((d) => d.lastResult === "confident-wrong").length;

  const cards: ReviewCard[] = [];
  for (const item of due) {
    if (item.prompt.startsWith(CARD_PREFIX)) {
      const card = flashcardBySlug(lessonSlugFromCardKey(item.prompt));
      if (card) cards.push({ kind: "flashcard", card });
    } else {
      const question = QUESTION_BY_PROMPT.get(item.prompt);
      if (question) cards.push({ kind: "question", prompt: item.prompt, question });
    }
  }

  const totalTracked = await db.reviewItem.count({ where: { userId: user.id } });

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Daily review"
        intro="A mix of questions you've missed and flashcards you've flagged — brought back at spaced intervals so they actually stick."
        backHref="/quiz"
        backLabel="Quizzes"
      />

      {cards.length === 0 ? (
        <EmptyState title="Nothing due — you're on top of it">
          {totalTracked > 0
            ? `NestWise is tracking ${totalTracked} item${totalTracked === 1 ? "" : "s"}. They'll come back over the next few days.`
            : "Miss a quiz question or flag a flashcard, and it'll show up here for spaced review."}
          <div className="mt-3">
            <ButtonLink href="/flashcards" size="sm" variant="secondary">
              Study flashcards
            </ButtonLink>
          </div>
        </EmptyState>
      ) : (
        <>
          <Callout tone="tip" className="mb-4">
            {cards.length} due. Get one right and it moves to a longer interval; miss it and it
            comes back sooner.
          </Callout>
          {confidentCount > 0 && (
            <Callout tone="caution" className="mb-4" compact>
              {confidentCount} of these you were <strong>sure about but got wrong</strong> — they're
              first in the deck.
            </Callout>
          )}
          <ReviewDeck cards={cards} />
        </>
      )}
    </div>
  );
}
