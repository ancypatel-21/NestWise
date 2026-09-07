import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check, Clock, PlayCircle } from "lucide-react";
import { getSessionUser, requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { completedSlugs } from "@/lib/content";
import { LEARN_MODULES } from "@/content/learn-modules";
import { slugify } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { ButtonLink } from "@/components/ui/Button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ module: string }>;
}): Promise<Metadata> {
  const { module: mod } = await params;
  const meta = LEARN_MODULES.find((m) => m.slug === mod);
  return { title: meta?.title ?? "Module" };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  await requireFamilyContext();
  const { module: modSlug } = await params;
  const meta = LEARN_MODULES.find((m) => m.slug === modSlug);
  if (!meta) notFound();

  const user = await getSessionUser();
  const done = user ? await completedSlugs(user.id) : new Set<string>();
  const quiz = await db.quiz.findUnique({ where: { slug: `learn-${meta.slug}` } });

  return (
    <div>
      <PageHeader
        title={`${meta.emoji} ${meta.title}`}
        intro={meta.blurb}
        backHref="/learn"
        backLabel="Learning hub"
      />

      <ol className="space-y-3">
        {meta.lessons.map((lesson, i) => {
          const slug = `${meta.slug}--${slugify(lesson.title)}`;
          const complete = done.has(slug);
          return (
            <li key={slug}>
              <Link
                href={`/learn/${meta.slug}/${slug}`}
                className="nw-paper nw-paper--alt flex items-center gap-3 p-4"
              >
                <span
                  className={
                    "grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold " +
                    (complete
                      ? "bg-[var(--color-success)] text-white"
                      : "bg-[var(--color-accent-surface)] text-[var(--color-accent-strong)]")
                  }
                >
                  {complete ? <Check size={16} aria-hidden /> : i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-[var(--color-ink)]">{lesson.title}</span>
                  <span className="mt-0.5 flex items-center gap-3 text-xs text-[var(--color-ink-faint)]">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} aria-hidden /> {lesson.minutes} min read
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <PlayCircle size={12} aria-hidden /> video
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {quiz && (
          <div className="nw-paper nw-paper--alt bg-[var(--color-accent-surface)] p-5">
            <p className="font-display text-lg font-bold">Module quiz</p>
            <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
              {(quiz.questions as unknown[]).length} questions covering the whole module.
            </p>
            <ButtonLink href={`/quiz/${quiz.slug}`} size="sm" className="mt-3">
              Take the quiz
            </ButtonLink>
          </div>
        )}
        <div className="nw-paper p-5">
          <p className="font-display text-lg font-bold">Flashcards</p>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            One card per lesson, from its key takeaways. Flip and self-rate.
          </p>
          <ButtonLink href={`/flashcards/${meta.slug}`} size="sm" variant="secondary" className="mt-3">
            Study {meta.lessons.length} cards
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
