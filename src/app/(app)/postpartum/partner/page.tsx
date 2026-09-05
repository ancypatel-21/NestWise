import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSessionUser, requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { savedSlugs } from "@/lib/content";
import { ContentDetail } from "@/components/ContentDetail";

export const metadata: Metadata = { title: "Partner postpartum support" };

export default async function PartnerPostpartumPage() {
  await requireFamilyContext();
  const content = await db.content.findUnique({ where: { slug: "partner-postpartum-support" } });
  if (!content) notFound();
  const user = await getSessionUser();
  const saved = user ? await savedSlugs(user.id, "lesson") : new Set<string>();

  return (
    <ContentDetail
      content={content}
      backHref="/home"
      backLabel="Home"
      refType="lesson"
      href="/postpartum/partner"
      saved={saved.has(content.slug)}
    />
  );
}
