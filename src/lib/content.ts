import type { Content, ContentType, Prisma, Stage } from "@prisma/client";
import { db } from "@/lib/db";
import type { ContentBlock } from "@/types";

export function blocksOf(c: Content): ContentBlock[] {
  return (c.blocks as unknown as ContentBlock[]) ?? [];
}

/** Flatten a content entry to plain, speakable text (for the "Listen" audio mode). */
export function plainText(c: Content): string {
  const parts: string[] = [c.title, c.summary];
  for (const b of blocksOf(c)) {
    if (b.type === "paragraph" || b.type === "heading") parts.push(b.text);
    else if (b.type === "list" || b.type === "steps") parts.push(...b.items);
    else if (b.type === "callout") parts.push(`${b.title ?? ""}. ${b.text}`);
    else if (b.type === "keyvalue") parts.push(...b.pairs.map((p) => `${p.label}: ${p.value}`));
  }
  if (c.keyTakeaways.length) parts.push("Key takeaways.", ...c.keyTakeaways);
  return parts.filter(Boolean).join(". ").replace(/\.\.+/g, ".");
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
