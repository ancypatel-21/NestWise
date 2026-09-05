import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSessionUser, requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { savedSlugs, completedSlugs } from "@/lib/content";
import { ContentDetail } from "@/components/ContentDetail";
import { MedicalScopeNote } from "@/components/safety";

const ALLOWED = ["POSTPARTUM_TOPIC", "FIRST_DAYS"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = await db.content.findUnique({ where: { slug } });
  return { title: c?.title ?? "Postpartum" };
}

export default async function PostpartumTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireFamilyContext();
  const { slug } = await params;
  const content = await db.content.findUnique({ where: { slug } });
  if (!content || !ALLOWED.includes(content.contentType)) notFound();

  const user = await getSessionUser();
  const [saved, done] = await Promise.all([
    user ? savedSlugs(user.id, "lesson") : new Set<string>(),
    user ? completedSlugs(user.id) : new Set<string>(),
  ]);

  const back =
    content.category === "First days home"
      ? "/postpartum/first-days"
      : content.category === "Parent wellbeing"
        ? "/postpartum/wellbeing"
        : "/postpartum/body";

  return (
    <ContentDetail
      content={content}
      backHref={back}
      backLabel="Back"
      refType="lesson"
      href={`/postpartum/topic/${content.slug}`}
      saved={saved.has(content.slug)}
      completed={done.has(content.slug)}
      showCompletion
    >
      <div className="mt-4">
        <MedicalScopeNote />
      </div>
    </ContentDetail>
  );
}
