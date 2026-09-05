"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { track } from "@/lib/analytics";

const schema = z.object({
  refType: z.string().min(1).max(40),
  refSlug: z.string().min(1).max(120),
  title: z.string().min(1).max(160),
  href: z.string().min(1).max(240),
});

export async function toggleBookmark(input: z.infer<typeof schema>): Promise<{ saved: boolean }> {
  const user = await requireUser();
  const data = schema.parse(input);

  const existing = await db.bookmark.findUnique({
    where: {
      userId_refType_refSlug: { userId: user.id, refType: data.refType, refSlug: data.refSlug },
    },
  });

  if (existing) {
    await db.bookmark.delete({ where: { id: existing.id } });
    track("bookmark_removed", { refType: data.refType });
    revalidatePath("/bookmarks");
    return { saved: false };
  }

  await db.bookmark.create({ data: { ...data, userId: user.id } });
  track("bookmark_added", { refType: data.refType });
  revalidatePath("/bookmarks");
  return { saved: true };
}

export async function removeBookmark(id: string): Promise<void> {
  const user = await requireUser();
  await db.bookmark.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/bookmarks");
}
