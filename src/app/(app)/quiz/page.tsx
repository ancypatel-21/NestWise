import Link from "next/link";
import type { Metadata } from "next";
import { RefreshCw } from "lucide-react";
import { getSessionUser, requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Quizzes" };

export default async function QuizListPage() {
  const ctx = await requireFamilyContext();
  const user = await getSessionUser();

  const stageFilter =
    ctx.stage.part === 3
      ? ["CHILD", "GENERAL"]
      : ctx.stage.part === 2
        ? ["BIRTH", "POSTPARTUM", "PREGNANCY"]
        : ["PREGNANCY", "GENERAL"];

  const [quizzes, attempts, dueReview, totalReview] = await Promise.all([
    db.quiz.findMany({ orderBy: { title: "asc" } }),
    user ? db.quizAttempt.findMany({ where: { userId: user.id } }) : [],
    user
      ? db.reviewItem.count({ where: { userId: user.id, dueAt: { lte: new Date() } } })
      : 0,
    user ? db.reviewItem.count({ where: { userId: user.id } }) : 0,
  ]);

  const bestBySlug = new Map<string, { score: number; total: number }>();
  for (const a of attempts) {
    const prev = bestBySlug.get(a.quizSlug);
    if (!prev || a.score / a.total > prev.score / prev.total)
      bestBySlug.set(a.quizSlug, { score: a.score, total: a.total });
  }

  const relevant = quizzes.filter((q) => stageFilter.includes(q.stage));
  const others = quizzes.filter((q) => !stageFilter.includes(q.stage));

  return (
    <div>
      <PageHeader
        title="Quizzes"
        intro="6–7 questions per topic, with an explanation after every answer. Retry as often as you like — nothing here is graded and symptoms are never gamified."
      />

      {totalReview > 0 && (
        <div className="mb-6 nw-paper nw-paper--alt bg-[var(--color-accent-surface)] p-5">
          <p className="flex items-center gap-2 font-display text-lg font-bold">
            <RefreshCw size={18} aria-hidden />
            Daily review
          </p>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            {dueReview > 0
              ? `${dueReview} question${dueReview === 1 ? "" : "s"} due for spaced review right now.`
              : `Nothing due yet — NestWise is tracking ${totalReview} question${totalReview === 1 ? "" : "s"} to bring back over the next few days.`}
          </p>
          {dueReview > 0 && (
            <ButtonLink href="/quiz/review" size="sm" className="mt-3">
              Start review ({dueReview})
            </ButtonLink>
          )}
        </div>
      )}

      <div className="space-y-3">
        {[...relevant, ...others].map((q) => {
          const best = bestBySlug.get(q.slug);
          const count = Array.isArray(q.questions) ? (q.questions as unknown[]).length : 0;
          return (
            <Link
              key={q.id}
              href={`/quiz/${q.slug}`}
              className="nw-paper nw-paper--alt flex items-center justify-between gap-3 p-4"
            >
              <span>
                <span className="block font-display text-base font-bold text-[var(--color-ink)]">
                  {q.title}
                </span>
                <span className="text-sm text-[var(--color-ink-soft)]">
                  {q.category} · {count} questions
                </span>
              </span>
              {best ? (
                <Badge tone="success">
                  Best {best.score}/{best.total}
                </Badge>
              ) : (
                <Badge>Not tried</Badge>
              )}
            </Link>
          );
        })}
      </div>

      <Callout tone="info" className="mt-6">
        Quizzes are for learning, not assessment. They never diagnose or score your health.
      </Callout>
    </div>
  );
}
