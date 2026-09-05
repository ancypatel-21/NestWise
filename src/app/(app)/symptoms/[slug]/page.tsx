import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSessionUser, requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { savedSlugs } from "@/lib/content";
import { ContentDetail } from "@/components/ContentDetail";
import { MedicalScopeNote } from "@/components/safety";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = await db.content.findUnique({ where: { slug } });
  return { title: c?.title ?? "Symptom" };
}

export default async function SymptomDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireFamilyContext();
  const { slug } = await params;
  const content = await db.content.findUnique({ where: { slug } });
  if (!content || content.contentType !== "SYMPTOM") notFound();

  const user = await getSessionUser();
  const saved = user ? await savedSlugs(user.id, "symptom") : new Set<string>();

  return (
    <ContentDetail
      content={content}
      backHref="/symptoms"
      backLabel="Symptom explorer"
      refType="symptom"
      href={`/symptoms/${content.slug}`}
      saved={saved.has(content.slug)}
    >
      <div className="mt-4">
        <MedicalScopeNote />
      </div>
    </ContentDetail>
  );
}
