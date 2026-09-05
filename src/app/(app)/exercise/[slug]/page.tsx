import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSessionUser, requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { savedSlugs } from "@/lib/content";
import { ContentDetail } from "@/components/ContentDetail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = await db.content.findUnique({ where: { slug } });
  return { title: c?.title ?? "Exercise" };
}

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireFamilyContext();
  const { slug } = await params;
  const content = await db.content.findUnique({ where: { slug } });
  if (!content || content.contentType !== "EXERCISE") notFound();

  const user = await getSessionUser();
  const saved = user ? await savedSlugs(user.id, "exercise") : new Set<string>();

  return (
    <ContentDetail
      content={content}
      backHref="/exercise"
      backLabel="Movement"
      refType="exercise"
      href={`/exercise/${content.slug}`}
      saved={saved.has(content.slug)}
    />
  );
}
