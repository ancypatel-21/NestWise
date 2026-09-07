import Link from "next/link";
import type { Metadata } from "next";
import { getSessionUser, requireFamilyContext } from "@/lib/auth/session";
import { completedSlugs } from "@/lib/content";
import { recommendNext } from "@/lib/personalization/recommend";
import { ALL_LESSONS, LEARN_MODULES } from "@/content/learn-modules";
import { slugify } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar, ProgressCircle } from "@/components/ui/Progress";
import { ButtonLink } from "@/components/ui/Button";
import { pct } from "@/lib/utils";

export const metadata: Metadata = { title: "Learn" };

export default async function LearnHubPage() {
  const ctx = await requireFamilyContext();
  const user = await getSessionUser();

  const done = user ? await completedSlugs(user.id) : new Set<string>();
  const rec = user ? await recommendNext(ctx, user.id) : null;

  const totalLessons = ALL_LESSONS.length;
  const doneLessons = ALL_LESSONS.filter((x) => done.has(x.slug)).length;

  return (
    <div>
      <PageHeader
        title="Learning hub"
        intro="16 short modules for pregnancy and the first weeks. Read a lesson, watch a video, take the quiz — NestWise tracks what sticks."
      />

      <div className="mb-6 flex flex-wrap items-center gap-5 nw-paper p-5">
        <ProgressCircle
          value={pct(doneLessons, totalLessons)}
          size={92}
          stroke={10}
          caption={`${doneLessons}/${totalLessons}`}
          sub="lessons"
        />
        <div className="min-w-0 flex-1">
          {rec ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-strong)]">
                Continue
              </p>
              <p className="font-display text-lg font-bold text-[var(--color-ink)]">{rec.title}</p>
              <p className="text-sm text-[var(--color-ink-soft)]">{rec.reason}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <ButtonLink href={rec.href} size="sm">
                  {rec.kind === "quiz" ? "Take the quiz" : "Continue"}
                </ButtonLink>
                <ButtonLink href="/quiz/build" size="sm" variant="secondary">
                  Quiz me
                </ButtonLink>
                <ButtonLink href="/flashcards" size="sm" variant="secondary">
                  Flashcards
                </ButtonLink>
              </div>
            </>
          ) : (
            <p className="text-sm text-[var(--color-ink-soft)]">
              Pick any module to start. Your progress and quiz scores build a knowledge map on the
              Progress page.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LEARN_MODULES.map((m) => {
          const slugs = m.lessons.map((l) => `${m.slug}--${slugify(l.title)}`);
          const total = slugs.length;
          const completed = slugs.filter((s) => done.has(s)).length;
          return (
            <Link
              key={m.slug}
              href={`/learn/${m.slug}`}
              className="nw-paper nw-paper--alt flex flex-col gap-2 p-5 transition-transform hover:-translate-y-0.5"
            >
              <span className="text-3xl" aria-hidden>
                {m.emoji}
              </span>
              <span className="font-display text-base font-bold text-[var(--color-ink)]">
                {m.title}
              </span>
              <span className="text-sm text-[var(--color-ink-soft)]">{m.blurb}</span>
              <ProgressBar
                value={pct(completed, total)}
                label={completed === total ? "Complete" : `${completed}/${total} lessons`}
                className="mt-1"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
