import type { Metadata } from "next";
import { getSessionUser, requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { savedSlugs } from "@/lib/content";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BookmarkButton } from "@/components/ui/BookmarkButton";

export const metadata: Metadata = { title: "Resources" };

export default async function ResourcesPage() {
  const ctx = await requireFamilyContext();
  const user = await getSessionUser();
  const saved = user ? await savedSlugs(user.id, "resource") : new Set<string>();

  const items = await db.content.findMany({
    where: { contentType: "RESOURCE", published: true },
    orderBy: { title: "asc" },
  });

  const preferredStages =
    ctx.stage.part === 3 ? ["CHILD", "GENERAL"] : ctx.stage.part === 2 ? ["POSTPARTUM", "PREGNANCY", "GENERAL"] : ["PREGNANCY", "GENERAL"];
  const sorted = [...items].sort(
    (a, b) => Number(preferredStages.includes(b.stage)) - Number(preferredStages.includes(a.stage)),
  );

  return (
    <div>
      <PageHeader
        title="Books, articles & resources"
        intro="Recommendations matched to your stage. Each explains why it's useful right now."
      />
      <div className="space-y-3">
        {sorted.map((r) => (
          <Card key={r.id} id={r.slug} className="flex items-start justify-between gap-3">
            <div>
              <Badge tone="accent">{r.category}</Badge>
              <p className="mt-2 font-bold">{r.title}</p>
              <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{r.summary}</p>
            </div>
            <BookmarkButton
              refType="resource"
              refSlug={r.slug}
              title={r.title}
              href={`/resources#${r.slug}`}
              initialSaved={saved.has(r.slug)}
              compact
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
