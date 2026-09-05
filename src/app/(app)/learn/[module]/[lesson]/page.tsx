import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSessionUser, requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { completedSlugs, savedSlugs } from "@/lib/content";
import { LEARN_MODULES } from "@/content/learn-modules";
import { ContentDetail } from "@/components/ContentDetail";
import { Card, CardTitle } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

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
  const { module: modSlug, lesson: lessonSlug } = await params;
  const meta = LEARN_MODULES.find((m) => m.slug === modSlug);
  const content = await db.content.findUnique({ where: { slug: lessonSlug } });
  if (!meta || !content || content.contentType !== "LESSON") notFound();

  const user = await getSessionUser();
  const [done, saved] = await Promise.all([
    user ? completedSlugs(user.id) : new Set<string>(),
    user ? savedSlugs(user.id, "lesson") : new Set<string>(),
  ]);

  const quiz = await db.quiz.findFirst({ where: { category: { contains: meta.title } } });
  const href = `/learn/${meta.slug}/${content.slug}`;

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
    >
      {quiz && (
        <Card className="mt-6 bg-[var(--color-accent-surface)]">
          <CardTitle>Quick quiz</CardTitle>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            Check what stuck with a short {quiz.title} quiz.
          </p>
          <ButtonLink href={`/quiz/${quiz.slug}`} size="sm" className="mt-3">
            Take the quiz
          </ButtonLink>
        </Card>
      )}
    </ContentDetail>
  );
}
