import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getSessionUser, requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { completedSlugs, savedSlugs } from "@/lib/content";
import { ALL_LESSONS, LEARN_MODULES } from "@/content/learn-modules";
import { ContentDetail } from "@/components/ContentDetail";
import { LessonCheck } from "@/components/LessonCheck";
import { Card, CardTitle } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { VideoCard } from "@/components/ui/VideoCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lesson: string }>;
}): Promise<Metadata> {
  const { lesson } = await params;
  const c = await db.content.findUnique({ where: { slug: lesson } });
  return { title: c?.title ?? "Lesson" };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ module: string; lesson: string }>;
}) {
  await requireFamilyContext();
  const { module: modSlug, lesson: lessonParam } = await params;
  const meta = LEARN_MODULES.find((m) => m.slug === modSlug);
  const content = await db.content.findUnique({ where: { slug: lessonParam } });
  if (!meta || !content || content.contentType !== "LESSON") notFound();

  const entry = ALL_LESSONS.find((x) => x.slug === lessonParam);
  const spec = entry?.lesson;

  const user = await getSessionUser();
  const [done, saved] = await Promise.all([
    user ? completedSlugs(user.id) : new Set<string>(),
    user ? savedSlugs(user.id, "lesson") : new Set<string>(),
  ]);

  const quiz = await db.quiz.findUnique({ where: { slug: `learn-${meta.slug}` } });
  const href = `/learn/${meta.slug}/${content.slug}`;

  const related = (spec?.related ?? [])
    .map((title) => ALL_LESSONS.find((x) => x.lesson.title === title))
    .filter(Boolean)
    .map((x) => ({
      title: x!.lesson.title,
      href: `/learn/${x!.module.slug}/${x!.slug}`,
      module: x!.module.title,
    }));

  return (
    <ContentDetail
      content={content}
      backHref={`/learn/${meta.slug}`}
      backLabel={meta.title}
      refType="lesson"
      href={href}
      saved={saved.has(content.slug)}
      completed={done.has(content.slug)}
      showCompletion
      interactive
    >
      {spec?.video && (
        <VideoCard query={spec.video} minutes={spec.minutes} />
      )}

      <LessonCheck topic={content.title} />

      {related.length > 0 && (
        <Card className="mt-6">
          <CardTitle>Related NestWise lessons</CardTitle>
          <ul className="mt-2 space-y-1.5">
            {related.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent-strong)]"
                >
                  <ArrowRight size={14} aria-hidden />
                  {r.title}
                  <span className="text-xs font-normal text-[var(--color-ink-faint)]">
                    · {r.module}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {quiz && quiz.questions && Array.isArray(quiz.questions) && quiz.questions.length > 0 && (
        <Card className="mt-6 nw-paper--alt bg-[var(--color-accent-surface)]">
          <CardTitle>Check what stuck</CardTitle>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            {(quiz.questions as unknown[]).length} questions on {meta.title.toLowerCase()}, with an
            explanation after every answer.
          </p>
          <ButtonLink href={`/quiz/${quiz.slug}`} size="sm" className="mt-3">
            Take the {meta.title} quiz
          </ButtonLink>
        </Card>
      )}
    </ContentDetail>
  );
}
