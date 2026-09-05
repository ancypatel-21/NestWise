import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { resolveActiveChild } from "@/lib/active-child";
import { ageFromDob } from "@/lib/personalization/age";
import { isKidsMode } from "@/lib/kids-mode";
import { enterKidsMode } from "@/lib/actions/kids-mode";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, LinkCard } from "@/components/ui/Card";
import { Callout } from "@/components/ui/Callout";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { ChildSwitcher } from "@/components/child/ChildSwitcher";

export const metadata: Metadata = { title: "Child dashboard" };

export default async function ChildDashboardPage() {
  const ctx = await requireFamilyContext();
  const kids = await isKidsMode();

  if (ctx.children.length === 0) {
    return (
      <div>
        <PageHeader title="Child & family" intro="Add a child to unlock the development timeline, activities and games." />
        <EmptyState title="No child profile yet">
          Add one in <a className="underline" href="/settings/family">Family settings</a>.
        </EmptyState>
      </div>
    );
  }

  const active = (await resolveActiveChild(ctx.children))!;
  const age = ageFromDob(active.dateOfBirth);

  const [dev, activities, games] = await Promise.all([
    db.content.findFirst({
      where: {
        contentType: "DEVELOPMENT",
        ageMinMonths: { lte: age.months },
        ageMaxMonths: { gte: age.months },
      },
    }),
    db.activity.count({
      where: { weekend: false, ageMinMonths: { lte: age.months }, ageMaxMonths: { gte: Math.max(age.months, 1) } },
    }),
    db.game.count({ where: { minAgeMonths: { lte: Math.max(age.months, 24) } } }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={kids ? "NestWise Kids" : `${active.nameOrNickname}'s space`}
        intro={kids ? "Pick something fun to play." : "Development, learning and things to do together."}
      />

      {!kids && (
        <>
          <ChildSwitcher
            activeId={active.id}
            children={ctx.children.map((c) => ({
              id: c.id,
              name: c.nameOrNickname,
              ageLabel: ageFromDob(c.dateOfBirth).label,
            }))}
          />

          <Card className="nw-gradient">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-strong)]">
              {active.nameOrNickname}
            </p>
            <p className="text-2xl font-extrabold">{age.label} old</p>
            <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
              Children develop at their own pace — this is a map, not a race.
            </p>
            <form action={enterKidsMode} className="mt-4">
              <Button size="sm" variant="secondary">
                Open Kid mode →
              </Button>
            </form>
          </Card>
        </>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {!kids && dev && (
          <LinkCard
            href={`/child/timeline/${dev.slug.replace("dev-", "")}`}
            eyebrow="Development"
            title={dev.title}
          >
            All six areas, plus For Parents and discipline.
          </LinkCard>
        )}
        <LinkCard href="/child/activities" eyebrow="Do together" title="Activities">
          {activities} matched to {active.nameOrNickname}'s age.
        </LinkCard>
        <LinkCard href="/child/games" eyebrow="Learning games" title="Games">
          {games} games; difficulty adapts as they play.
        </LinkCard>
        <LinkCard href="/child/quiz" eyebrow="Quizzes" title="Quizzes">
          Short, friendly knowledge checks.
        </LinkCard>
        <LinkCard href="/child/weekend" eyebrow="Weekends" title="Weekend activities">
          Bigger projects for when there's more time.
        </LinkCard>
        <LinkCard href="/child/family-games" eyebrow="Family" title="Family games">
          Filter by age, players, time and materials.
        </LinkCard>
        {!kids && (
          <>
            <LinkCard href="/child/progress" eyebrow="Progress" title="Learning activity">
              Educational only — not a developmental assessment.
            </LinkCard>
            <LinkCard href="/child/journal" eyebrow="Keepsake" title="Milestone journal">
              Private notes and photos.
            </LinkCard>
            <LinkCard href="/child/routines" eyebrow="Organise" title="Routine builder">
              Gentle rhythms for feeding, sleep, play and more.
            </LinkCard>
          </>
        )}
      </div>

      {!kids && (
        <Callout tone="info">
          Kid mode hides all adult pregnancy and health content and limits navigation to games and
          activities.
        </Callout>
      )}
    </div>
  );
}
