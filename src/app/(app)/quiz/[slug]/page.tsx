import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import type { QuizQuestion } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { QuizPlayer } from "../QuizPlayer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const quiz = await db.quiz.findUnique({ where: { slug } });
  return { title: quiz?.title ?? "Quiz" };
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireFamilyContext();
  const { slug } = await params;
  const quiz = await db.quiz.findUnique({ where: { slug } });
  if (!quiz) notFound();

  const questions = quiz.questions as unknown as QuizQuestion[];

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={quiz.title} intro={quiz.category} backHref="/quiz" backLabel="All quizzes" />
      <QuizPlayer quizSlug={quiz.slug} title={quiz.title} questions={questions} />
    </div>
  );
}
