import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { resolveActiveChild } from "@/lib/active-child";
import { ageFromDob } from "@/lib/personalization/age";
import { computeStreak } from "@/lib/streak";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import { Callout } from "@/components/ui/Callout";
import { EmptyState } from "@/components/ui/EmptyState";
import { StreakBadge } from "@/components/ui/Stepper";
import { ChildSwitcher } from "@/components/child/ChildSwitcher";

export const metadata: Metadata = { title: "Learning progress" };

export default async function ChildProgressPage() {
  const ctx = await requireFamilyContext();
  if (ctx.children.length === 0) {
    return (
      <div>
        <PageHeader title="Learning progress" backHref="/child" />
        <EmptyState title="No child profile yet" />
      </div>
    );
  }

  const active = (await resolveActiveChild(ctx.children))!;

  const [games, attempts] = await Promise.all([
    db.gameProgress.findMany({ where: { childId: active.id }, orderBy: { completedAt: "desc" } }),
    db.quizAttempt.findMany({ where: { childId: active.id }, orderBy: { completedAt: "desc" } }),
  ]);

  const streak = computeStreak([
    ...games.map((g) => g.completedAt),
    ...attempts.map((a) => a.completedAt),
  ]);

  const skillCounts = new Map<string, number>();
  for (const g of games)
    for (const s of g.skillsPracticed) skillCounts.set(s, (skillCounts.get(s) ?? 0) + 1);
  const topSkills = [...skillCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

  const categoryCounts = new Map<string, number>();
  for (const g of games)
    categoryCounts.set(g.gameSlug, (categoryCounts.get(g.gameSlug) ?? 0) + 1);
  const favourites = [...categoryCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);

  return (
    <div>
      <PageHeader
        title={`${active.nameOrNickname}'s learning activity`}
        intro={`${ageFromDob(active.dateOfBirth).label} old. This is a record of educational play — not a developmental assessment.`}
        backHref="/child"
        backLabel="Child dashboard"
        action={streak > 0 ? <StreakBadge days={streak} /> : undefined}
      />

      <ChildSwitcher
        activeId={active.id}
        children={ctx.children.map((c) => ({
          id: c.id,
          name: c.nameOrNickname,
          ageLabel: ageFromDob(c.dateOfBirth).label,
        }))}
      />

      <Callout tone="caution" className="my-6" title="Important">
        Do not read a child's normal development as "behind" from app game performance. Educational
        game results and clinical developmental milestones are separate things.
      </Callout>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="text-center">
          <p className="text-3xl font-extrabold">{games.length}</p>
          <p className="text-sm text-[var(--color-ink-soft)]">games played</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-extrabold">{attempts.length}</p>
          <p className="text-sm text-[var(--color-ink-soft)]">quizzes tried</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-extrabold">{skillCounts.size}</p>
          <p className="text-sm text-[var(--color-ink-soft)]">skill areas practised</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardTitle>Skills practised</CardTitle>
          {topSkills.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--color-ink-soft)]">Play a game to see this fill in.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm">
              {topSkills.map(([skill, n]) => (
                <li key={skill} className="flex justify-between">
                  <span className="text-[var(--color-ink-soft)]">{skill}</span>
                  <span className="font-semibold">×{n}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <CardTitle>Favourite games</CardTitle>
          {favourites.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--color-ink-soft)]">No favourites yet.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm">
              {favourites.map(([slug, n]) => (
                <li key={slug} className="flex justify-between">
                  <span className="text-[var(--color-ink-soft)]">{slug.replace(/-/g, " ")}</span>
                  <span className="font-semibold">×{n}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
