import Link from "next/link";
import type { Metadata } from "next";
import { getSessionUser, requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";

export const metadata: Metadata = { title: "Quizzes" };

export default async function QuizListPage() {
  const ctx = await requireFamilyContext();
  const user = await getSessionUser();

  const stageFilter =
    ctx.stage.part === 3 ? ["CHILD", "GENERAL"] : ctx.stage.part === 2 ? ["BIRTH", "POSTPARTUM", "PREGNANCY"] : ["PREGNANCY", "GENERAL"];

  const [quizzes, attempts] = await Promise.all([
    db.quiz.findMany({ orderBy: { title: "asc" } }),
    user ? db.quizAttempt.findMany({ where: { userId: user.id } }) : [],
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
        intro="Short multiple-choice checks with an explanation after every answer. Retry as often as you like — nothing here is graded and symptoms are never gamified."
      />

      <div className="space-y-3">
        {[...relevant, ...others].map((q) => {
          const best = bestBySlug.get(q.slug);
          return (
            <Link
              key={q.id}
              href={`/quiz/${q.slug}`}
              className="flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)]"
            >
              <span>
                <span className="block font-bold">{q.title}</span>
                <span className="text-sm text-[var(--color-ink-soft)]">{q.category}</span>
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
