import Link from "next/link";
import type { Metadata } from "next";
import { getSessionUser, requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import { ProgressBar, ProgressCircle } from "@/components/ui/Progress";
import { StreakBadge } from "@/components/ui/Stepper";
import { Badge } from "@/components/ui/Badge";
import { pct } from "@/lib/utils";
import { computeStreak } from "@/lib/streak";
import { learningOverview } from "@/lib/mastery";

export const metadata: Metadata = { title: "Progress" };

export default async function ProgressPage() {
  await requireFamilyContext();
  const user = await getSessionUser();
  if (!user) return null;

  const [completions, attempts, bookmarks, reviewTracked, overview] = await Promise.all([
    db.lessonCompletion.findMany({ where: { userId: user.id } }),
    db.quizAttempt.findMany({ where: { userId: user.id }, orderBy: { completedAt: "desc" } }),
    db.bookmark.count({ where: { userId: user.id } }),
    db.reviewItem.count({ where: { userId: user.id } }),
    learningOverview(user.id),
  ]);

  const streak = computeStreak([
    ...completions.map((c) => c.completedAt),
    ...attempts.map((a) => a.completedAt),
  ]);

  return (
    <div>
      <PageHeader
        title="Your learning"
        intro="How much of the curriculum you've explored and how well it's sticking. Nothing here is a test or a health measure."
        action={streak > 0 ? <StreakBadge days={streak} /> : undefined}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="flex flex-col items-center">
          <ProgressCircle value={overview.overall} caption={`${overview.overall}%`} sub="curriculum" />
          <p className="mt-2 text-sm font-semibold text-[var(--color-ink-soft)]">
            {overview.lessonsDone} of {overview.lessonsTotal} lessons read
          </p>
        </Card>
        <Card className="flex flex-col items-center justify-center text-center">
          <p className="font-display text-3xl font-bold">{attempts.length}</p>
          <p className="text-sm text-[var(--color-ink-soft)]">quizzes taken</p>
        </Card>
        <Card className="flex flex-col items-center justify-center text-center">
          <p className="font-display text-3xl font-bold">{reviewTracked}</p>
          <p className="text-sm text-[var(--color-ink-soft)]">in spaced review</p>
        </Card>
      </div>

      {(overview.weakest || overview.strongest) && (
        <Card className="mt-4 bg-[var(--color-accent-surface)]">
          <p className="text-sm text-[var(--color-ink)]">
            {overview.strongest && (
              <>
                You're strongest on <strong>{overview.strongest.title}</strong>.
              </>
            )}{" "}
            {overview.weakest && overview.weakest.slug !== overview.strongest?.slug && (
              <>
                A little more time on{" "}
                <Link
                  href={`/learn/${overview.weakest.slug}`}
                  className="font-semibold text-[var(--color-accent-strong)] underline"
                >
                  {overview.weakest.title}
                </Link>{" "}
                would round things out.
              </>
            )}
          </p>
        </Card>
      )}

      <h2 className="mb-3 mt-8 font-display text-lg font-bold">Knowledge map</h2>
      <Card>
        <ul className="divide-y divide-[var(--color-border)]">
          {overview.modules.map((m) => (
            <li key={m.slug}>
              <Link href={`/learn/${m.slug}`} className="flex items-center gap-3 py-2.5">
                <span className="text-xl" aria-hidden>
                  {m.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-[var(--color-ink)]">
                      {m.title}
                    </span>
                    <Badge
                      tone={m.band === "Strong" ? "success" : m.band === "Learning" ? "accent" : "neutral"}
                    >
                      {m.band}
                    </Badge>
                  </span>
                  <ProgressBar value={m.strength} className="mt-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-[var(--color-ink-faint)]">
          Strength blends lessons read with your best quiz score for each topic.
        </p>
      </Card>

      <Card className="mt-6">
        <CardTitle>Recent quizzes</CardTitle>
        {attempts.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--color-ink-soft)]">No quizzes yet.</p>
        ) : (
          <ul className="mt-2 divide-y divide-[var(--color-border)]">
            {attempts.slice(0, 8).map((a) => (
              <li key={a.id} className="flex justify-between py-2 text-sm">
                <span className="text-[var(--color-ink-soft)]">
                  {a.quizSlug.replace(/^learn-/, "").replace(/-/g, " ")}
                </span>
                <span className="font-semibold">
                  {a.score}/{a.total}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <p className="mt-4 text-xs text-[var(--color-ink-faint)]">
        {bookmarks} saved item{bookmarks === 1 ? "" : "s"} · educational progress only, not a
        developmental or health assessment.
      </p>
    </div>
  );
}
