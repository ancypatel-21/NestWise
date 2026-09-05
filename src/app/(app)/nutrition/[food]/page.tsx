import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSessionUser, requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { savedSlugs } from "@/lib/content";
import { ContentDetail } from "@/components/ContentDetail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ food: string }>;
}): Promise<Metadata> {
  const { food } = await params;
  const c = await db.content.findUnique({ where: { slug: food } });
  return { title: c?.title ?? "Food" };
}

export default async function FoodPage({
  params,
}: {
  params: Promise<{ food: string }>;
}) {
  await requireFamilyContext();
  const { food } = await params;
  const content = await db.content.findUnique({ where: { slug: food } });
  if (!content || content.contentType !== "FOOD") notFound();

  const user = await getSessionUser();
  const saved = user ? await savedSlugs(user.id, "meal") : new Set<string>();

  return (
    <ContentDetail
      content={content}
      backHref="/nutrition"
      backLabel="Nutrition"
      refType="meal"
      href={`/nutrition/${content.slug}`}
      saved={saved.has(content.slug)}
    />
  );
}
