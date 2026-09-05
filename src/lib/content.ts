import type { Content, ContentType, Prisma, Stage } from "@prisma/client";
import { db } from "@/lib/db";
import type { ContentBlock } from "@/types";

export function blocksOf(c: Content): ContentBlock[] {
  return (c.blocks as unknown as ContentBlock[]) ?? [];
}

export function listContent(where: Prisma.ContentWhereInput) {
  return db.content.findMany({ where: { published: true, ...where }, orderBy: { title: "asc" } });
}

export function byType(contentType: ContentType, stage?: Stage) {
  return listContent(stage ? { contentType, stage } : { contentType });
}

export function getContent(slug: string) {
  return db.content.findUnique({ where: { slug } });
}

/** Which bookmark refSlugs the user has saved, for initial toggle state. */
export async function savedSlugs(userId: string, refType: string): Promise<Set<string>> {
  const rows = await db.bookmark.findMany({
    where: { userId, refType },
    select: { refSlug: true },
  });
  return new Set(rows.map((r) => r.refSlug));
}

export async function completedSlugs(userId: string): Promise<Set<string>> {
  const rows = await db.lessonCompletion.findMany({
    where: { userId },
    select: { contentSlug: true },
  });
  return new Set(rows.map((r) => r.contentSlug));
}
