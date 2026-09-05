import Link from "next/link";
import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { isKidsMode } from "@/lib/kids-mode";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "Quizzes" };

export default async function ChildQuizListPage() {
  await requireFamilyContext();
  const kids = await isKidsMode();
  const quizzes = await db.quiz.findMany({
    where: { stage: { in: ["CHILD", "GENERAL"] } },
    orderBy: { title: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Quizzes"
        intro="Friendly knowledge checks with an explanation after every answer."
        backHref={kids ? undefined : "/child"}
        backLabel="Child dashboard"
      />
      <div className="space-y-3">
        {quizzes.map((q) => (
          <Link
            key={q.id}
            href={`/quiz/${q.slug}`}
            className="flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)]"
          >
            <span className="font-bold">{q.title}</span>
            <Badge tone="accent">{q.category}</Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
