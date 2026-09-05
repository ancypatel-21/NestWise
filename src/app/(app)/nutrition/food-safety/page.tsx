import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSessionUser, requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { savedSlugs } from "@/lib/content";
import { ContentDetail } from "@/components/ContentDetail";

export const metadata: Metadata = { title: "Food safety in pregnancy" };

export default async function FoodSafetyPage() {
  await requireFamilyContext();
  const content = await db.content.findUnique({ where: { slug: "food-safety" } });
  if (!content) notFound();

  const user = await getSessionUser();
  const saved = user ? await savedSlugs(user.id, "lesson") : new Set<string>();

  return (
    <ContentDetail
      content={content}
      backHref="/nutrition"
      backLabel="Nutrition"
      refType="lesson"
      href="/nutrition/food-safety"
      saved={saved.has(content.slug)}
    />
  );
}
