import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSessionUser, requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { savedSlugs, completedSlugs } from "@/lib/content";
import { ContentDetail } from "@/components/ContentDetail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = await db.content.findUnique({ where: { slug } });
  return { title: c?.title ?? "Childbirth" };
}

export default async function BirthTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireFamilyContext();
  const { slug } = await params;
  const content = await db.content.findUnique({ where: { slug } });
  if (!content || content.contentType !== "BIRTH_TOPIC") notFound();

  const user = await getSessionUser();
  const [saved, done] = await Promise.all([
    user ? savedSlugs(user.id, "lesson") : new Set<string>(),
    user ? completedSlugs(user.id) : new Set<string>(),
  ]);

  return (
    <ContentDetail
      content={content}
      backHref="/birth/learn"
      backLabel="Understanding childbirth"
      refType="lesson"
      href={`/birth/learn/${content.slug}`}
      saved={saved.has(content.slug)}
      completed={done.has(content.slug)}
      showCompletion
    />
  );
}
