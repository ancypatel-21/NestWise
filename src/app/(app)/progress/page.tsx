import type { Metadata } from "next";
import { getSessionUser, requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import { ProgressCircle } from "@/components/ui/Progress";
import { StreakBadge } from "@/components/ui/Stepper";
import { pct } from "@/lib/utils";
import { computeStreak } from "@/lib/streak";

export const metadata: Metadata = { title: "Progress" };

export default async function ProgressPage() {
  await requireFamilyContext();
  const user = await getSessionUser();
  if (!user) return null;

  const [completions, lessonTotal, attempts, bookmarks] = await Promise.all([
    db.lessonCompletion.findMany({ where: { userId: user.id } }),
    db.content.count({ where: { contentType: "LESSON", published: true } }),
    db.quizAttempt.findMany({ where: { userId: user.id }, orderBy: { completedAt: "desc" } }),
    db.bookmark.count({ where: { userId: user.id } }),
  ]);

  const streak = computeStreak([
    ...completions.map((c) => c.completedAt),
    ...attempts.map((a) => a.completedAt),
  ]);

  const quizAvg =
    attempts.length > 0
      ? Math.round(
          (attempts.reduce((s, a) => s + a.score / a.total, 0) / attempts.length) * 100,
        )
      : 0;

  return (
    <div>
      <PageHeader
        title="Your learning progress"
        intro="A gentle view of what you've explored. Nothing here is a test or a health measure."
        action={streak > 0 ? <StreakBadge days={streak} /> : undefined}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="flex flex-col items-center">
          <ProgressCircle value={pct(completions.length, lessonTotal)} sub="lessons" />
          <p className="mt-2 text-sm font-semibold text-[var(--color-ink-soft)]">
            {completions.length} of {lessonTotal} lessons
          </p>
        </Card>
        <Card className="flex flex-col items-center justify-center text-center">
          <p className="text-3xl font-extrabold">{attempts.length}</p>
          <p className="text-sm text-[var(--color-ink-soft)]">quiz attempts</p>
          {attempts.length > 0 && (
            <p className="mt-1 text-xs text-[var(--color-ink-faint)]">avg {quizAvg}%</p>
          )}
        </Card>
        <Card className="flex flex-col items-center justify-center text-center">
          <p className="text-3xl font-extrabold">{bookmarks}</p>
          <p className="text-sm text-[var(--color-ink-soft)]">saved items</p>
        </Card>
      </div>

      <Card className="mt-6">
        <CardTitle>Recent quizzes</CardTitle>
        {attempts.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--color-ink-soft)]">No quizzes yet.</p>
        ) : (
          <ul className="mt-2 divide-y divide-[var(--color-border)]">
            {attempts.slice(0, 8).map((a) => (
              <li key={a.id} className="flex justify-between py-2 text-sm">
                <span className="text-[var(--color-ink-soft)]">{a.quizSlug.replace(/-/g, " ")}</span>
                <span className="font-semibold">
                  {a.score}/{a.total}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
