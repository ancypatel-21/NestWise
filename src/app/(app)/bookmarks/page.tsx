import Link from "next/link";
import type { Metadata } from "next";
import { BookMarked } from "lucide-react";
import { getSessionUser, requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { RemoveBookmarkButton } from "./RemoveBookmarkButton";

export const metadata: Metadata = { title: "Saved" };

export default async function BookmarksPage() {
  await requireFamilyContext();
  const user = await getSessionUser();
  if (!user) return null;

  const bookmarks = await db.bookmark.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const grouped = new Map<string, typeof bookmarks>();
  for (const b of bookmarks) grouped.set(b.refType, [...(grouped.get(b.refType) ?? []), b]);

  return (
    <div>
      <PageHeader title="Saved" intro="Everything you've bookmarked, grouped by type." />

      {bookmarks.length === 0 ? (
        <EmptyState icon={<BookMarked size={28} />} title="Nothing saved yet">
          Use the <strong>Save</strong> button on any lesson, meal, exercise, activity or resource.
        </EmptyState>
      ) : (
        <div className="space-y-6">
          {[...grouped.entries()].map(([type, list]) => (
            <section key={type}>
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-[var(--color-ink-faint)]">
                {type}s
              </h2>
              <div className="space-y-2">
                {list.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
                  >
                    <Link href={b.href} className="font-semibold hover:underline">
                      {b.title}
                    </Link>
                    <div className="flex items-center gap-2">
                      <Badge>{b.refType}</Badge>
                      <RemoveBookmarkButton id={b.id} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
