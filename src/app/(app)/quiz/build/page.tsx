import Link from "next/link";
import type { Metadata } from "next";
import { getSessionUser, requireFamilyContext } from "@/lib/auth/session";
import { ADAPTIVE_TOPICS, buildAdaptiveQuiz } from "@/lib/adaptive-quiz";
import { queueMissedForReview } from "@/lib/actions/review";
import { PageHeader } from "@/components/ui/PageHeader";
import { Callout } from "@/components/ui/Callout";
import { EmptyState } from "@/components/ui/EmptyState";
import { QuizPlayer } from "../QuizPlayer";
import { TopicPicker } from "./TopicPicker";

export const metadata: Metadata = { title: "Quiz me" };

export default async function QuizBuildPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string; weak?: string; go?: string }>;
}) {
  await requireFamilyContext();
  const user = await getSessionUser();
  if (!user) return null;

  const sp = await searchParams;
  const selected = (sp.t ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const weak = sp.weak === "1";
  const go = sp.go === "1";

  const questions = go ? await buildAdaptiveQuiz(user.id, selected, weak, 8) : [];

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Quiz me"
        intro="Build a quick quiz on the topics you choose — NestWise pulls the questions, and can weight it toward what you've found tricky."
        backHref="/quiz"
        backLabel="Quizzes"
      />

      {!go ? (
        <TopicPicker topics={ADAPTIVE_TOPICS} initialSelected={selected} initialWeak={weak} />
      ) : questions.length === 0 ? (
        <EmptyState title="No questions for that mix">
          <Link href="/quiz/build" className="underline">
            Try different topics
          </Link>
          .
        </EmptyState>
      ) : (
        <>
          <Callout tone="tip" className="mb-4">
            {questions.length} questions{weak ? ", weighted toward your weak spots" : ""}
            {selected.length ? ` · ${selected.join(", ")}` : " · mixed topics"}. Missed ones go
            into your daily review.{" "}
            <Link href="/quiz/build" className="underline">
              Rebuild
            </Link>
          </Callout>
          <QuizPlayer
            quizSlug="adaptive"
            title="Your custom quiz"
            questions={questions}
            recordAttempts={false}
            queueMissed={queueMissedForReview}
          />
        </>
      )}
    </div>
  );
}
