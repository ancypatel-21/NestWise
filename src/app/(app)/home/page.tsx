import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CalendarClock,
  MessageCircleHeart,
  Sparkles,
} from "lucide-react";
import { requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { dailyIndex } from "@/lib/utils";
import { weeksToMonths } from "@/lib/personalization/pregnancy";
import { Card, CardTitle, LinkCard } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { MedicalScopeNote } from "@/components/safety";

export const metadata: Metadata = { title: "Home" };

export default async function HomePage() {
  const ctx = await requireFamilyContext();
  const { stage } = ctx;

  const stageForFacts: Record<typeof stage.mode, string[]> = {
    pregnancy: ["PREGNANCY", "GENERAL"],
    "birth-countdown": ["BIRTH", "PREGNANCY", "GENERAL"],
    postpartum: ["POSTPARTUM", "BIRTH", "GENERAL"],
    child: ["CHILD", "GENERAL"],
    unset: ["PREGNANCY", "GENERAL"],
  };
  const allFacts = await db.content.findMany({ where: { contentType: "FACT", published: true } });
  const factPool = allFacts.filter((f) => stageForFacts[stage.mode].includes(f.stage));
  const facts = factPool.length ? factPool : allFacts;
  const todaysFact = facts[dailyIndex(facts.length)];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="nw-heading-mark text-3xl font-bold tracking-tight sm:text-4xl">
          {greeting()}, {ctx.personalization.role === "PARTNER" ? "partner" : "there"} 👋
        </h1>
        <p className="mt-2 text-[var(--color-ink-soft)]">
          Where are we right now, what's happening, and what could we learn or do today?
        </p>
      </div>

      {stage.mode === "pregnancy" && <PregnancyDashboard ctx={ctx} />}
      {stage.mode === "birth-countdown" && <BirthCountdownDashboard ctx={ctx} />}
      {stage.mode === "postpartum" && <PostpartumDashboard ctx={ctx} />}
      {stage.mode === "child" && <ChildDashboard ctx={ctx} />}

      {todaysFact && (
        <Card>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-strong)]">
            <Sparkles size={14} aria-hidden /> Today's fact · {todaysFact.category}
          </div>
          <p className="mt-2 text-[0.95rem]">{todaysFact.title}</p>
          <Link
            href="/facts"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent-strong)]"
          >
            More facts <ArrowRight size={14} aria-hidden />
          </Link>
        </Card>
      )}

      <Card className="bg-[var(--color-accent-surface)]">
        <div className="flex items-center gap-3">
          <MessageCircleHeart className="text-[var(--color-accent-strong)]" aria-hidden />
          <div className="flex-1">
            <CardTitle>Ask NestWise</CardTitle>
            <p className="text-sm text-[var(--color-ink-soft)]">
              A question about this stage? Get an answer grounded in reviewed content.
            </p>
          </div>
          <ButtonLink href="/ask" size="sm">
            Ask
          </ButtonLink>
        </div>
      </Card>

      <MedicalScopeNote />
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

async function PregnancyDashboard({ ctx }: { ctx: Awaited<ReturnType<typeof requireFamilyContext>> }) {
  const week = ctx.stage.pregnancyWeek ?? 12;
  const [weekContent, lessons, quiz] = await Promise.all([
    db.content.findFirst({ where: { contentType: "WEEK_PREGNANCY", pregnancyWeek: week } }),
    db.content.findMany({ where: { contentType: "LESSON", stage: "PREGNANCY", published: true }, take: 40 }),
    db.quiz.findFirst({ where: { stage: "PREGNANCY" } }),
  ]);
  const lesson = lessons[dailyIndex(lessons.length, new Date())];

  return (
    <>
      <Card className="nw-gradient">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-strong)]">
              This week
            </p>
            <p className="text-2xl font-extrabold">{weeksToMonths(week)}</p>
          </div>
          <ButtonLink href={`/journey/week/${week}`} size="sm">
            Open week {week}
          </ButtonLink>
        </div>
        {weekContent && (
          <p className="mt-3 text-sm text-[var(--color-ink-soft)]">{weekContent.summary}</p>
        )}
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <LinkCard href={`/journey/week/${week}`} eyebrow="Baby & body" title={`Week ${week} development`}>
          What's growing this week and what many people notice.
        </LinkCard>
        <LinkCard href={`/journey/week/${week}`} eyebrow="Partner action" title="Support this week">
          The recurring "how can I support my partner?" prompt.
        </LinkCard>
        {lesson && (
          <LinkCard href={`/learn`} eyebrow="Recommended learning" title={lesson.title}>
            {lesson.category}
          </LinkCard>
        )}
        <LinkCard href="/nutrition" eyebrow="Nutrition" title="A meal idea for today">
          Filtered to your preferences and allergies.
        </LinkCard>
        <LinkCard href="/exercise" eyebrow="Movement" title="A gentle activity">
          Trimester-aware, with safety notes.
        </LinkCard>
        {quiz && (
          <LinkCard href={`/quiz/${quiz.slug}`} eyebrow="Quick quiz" title={quiz.title}>
            Check what's stuck. Retry any time.
          </LinkCard>
        )}
        <LinkCard href="/journey" eyebrow="Continue" title="Your week-by-week journey">
          Jump to any week.
        </LinkCard>
        <LinkCard href="/bookmarks" eyebrow="Saved" title="Your saved content">
          Lessons, meals and activities you kept.
        </LinkCard>
      </div>
    </>
  );
}

async function BirthCountdownDashboard({ ctx }: { ctx: Awaited<ReturnType<typeof requireFamilyContext>> }) {
  const days = ctx.stage.daysToDueDate ?? 0;
  const bag = await db.checklist.findUnique({
    where: { familyId_kind: { familyId: ctx.familyId, kind: "MOTHER_BAG" } },
    include: { items: true },
  });
  const checked = bag?.items.filter((i) => i.checked).length ?? 0;
  const total = bag?.items.length ?? 0;

  return (
    <>
      <Card className="nw-gradient">
        <div className="flex items-center gap-3">
          <CalendarClock className="text-[var(--color-accent-strong)]" aria-hidden />
          <div>
            <p className="text-2xl font-extrabold">
              {days >= 0 ? `About ${days} days to go` : `${Math.abs(days)} days past your estimate`}
            </p>
            <p className="text-sm text-[var(--color-ink-soft)]">
              Due dates are estimates — labour can start earlier or later.
            </p>
          </div>
        </div>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <LinkCard href="/birth/hospital-bag" eyebrow="Hospital bag" title={`${checked}/${total} packed`}>
          Two checklists, plus custom items.
        </LinkCard>
        <LinkCard href="/birth/learn" eyebrow="Learn" title="Understanding childbirth">
          Calm, neutral overviews of labour and birth.
        </LinkCard>
        <LinkCard href="/birth/preferences" eyebrow="Prepare" title="Birth preferences">
          Preferences and questions to discuss — not a fixed plan.
        </LinkCard>
        <LinkCard href="/birth" eyebrow="Birth prep" title="Everything for the countdown">
          Contacts, newborn essentials, postpartum prep.
        </LinkCard>
        <LinkCard href="/postpartum/body" eyebrow="Get ready" title="Postpartum body changes">
          Know what to expect before it happens.
        </LinkCard>
        <LinkCard href="/journey" eyebrow="Weeks" title="Week-by-week (still here)">
          The full pregnancy timeline.
        </LinkCard>
      </div>
    </>
  );
}

async function PostpartumDashboard({ ctx }: { ctx: Awaited<ReturnType<typeof requireFamilyContext>> }) {
  return (
    <>
      <Callout tone="tip" title={`First weeks with ${ctx.stage.primaryChildName ?? "your baby"}`}>
        Small, frequent everything. Look after the parents too — rest, food, and asking for help
        are part of newborn care.
      </Callout>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <LinkCard href="/postpartum/first-days" eyebrow="First days home" title="Feeding, sleep, soothing">
          Guided newborn-care basics.
        </LinkCard>
        <LinkCard href="/postpartum/body" eyebrow="Recovery" title="Your body after birth">
          What's typical, and the warning signs.
        </LinkCard>
        <LinkCard href="/postpartum/wellbeing" eyebrow="Wellbeing" title="Parent wellbeing">
          Sleep, mood, and where to get support.
        </LinkCard>
        <LinkCard href="/postpartum/partner" eyebrow="Partner" title="Partner postpartum support">
          Concrete ways to protect recovery.
        </LinkCard>
        <LinkCard href="/postpartum/nutrition" eyebrow="Nutrition" title="Eating for recovery">
          Practical, one-handed meals.
        </LinkCard>
        <LinkCard href="/child" eyebrow="Development" title="Your baby's first months">
          The child timeline is ready when you are.
        </LinkCard>
      </div>
    </>
  );
}

async function ChildDashboard({ ctx }: { ctx: Awaited<ReturnType<typeof requireFamilyContext>> }) {
  const months = ctx.stage.childAgeMonths ?? 0;
  const [dev, activities] = await Promise.all([
    db.content.findFirst({
      where: {
        contentType: "DEVELOPMENT",
        ageMinMonths: { lte: months },
        ageMaxMonths: { gte: months },
      },
    }),
    db.activity.findMany({
      where: { ageMinMonths: { lte: months }, ageMaxMonths: { gte: Math.max(months, 1) } },
      take: 3,
    }),
  ]);

  return (
    <>
      <Card className="nw-gradient">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-strong)]">
          {ctx.stage.primaryChildName}
        </p>
        <p className="text-2xl font-extrabold">{months} months old</p>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          Children develop at their own pace — this is a map, not a race.
        </p>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dev && (
          <LinkCard href={`/child/timeline/${dev.slug.replace("dev-", "")}`} eyebrow="Development" title={dev.title}>
            {dev.summary.slice(0, 90)}…
          </LinkCard>
        )}
        <LinkCard href="/child/activities" eyebrow="Do together" title="Age-appropriate activities">
          {activities.length} matched to this age.
        </LinkCard>
        <LinkCard href="/child/games" eyebrow="Learning games" title="Play and learn">
          Difficulty adapts to how they're doing.
        </LinkCard>
        <LinkCard href="/child/family-games" eyebrow="Family" title="Family games">
          Bonding, little or no materials.
        </LinkCard>
        <LinkCard href="/child/journal" eyebrow="Keepsake" title="Milestone journal">
          Private notes and photos, just for you.
        </LinkCard>
        <LinkCard href="/child/routines" eyebrow="Organise" title="Routine builder">
          Gentle rhythms, not rigid schedules.
        </LinkCard>
        <LinkCard href="/child/progress" eyebrow="Progress" title="Learning activity">
          Educational only — not a developmental assessment.
        </LinkCard>
        <LinkCard href="/learn" eyebrow="For parents" title="Parent learning">
          Communication, boundaries, sleep, screens.
        </LinkCard>
      </div>
    </>
  );
}
