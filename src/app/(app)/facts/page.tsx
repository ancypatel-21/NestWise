import type { Metadata } from "next";
import { getSessionUser, requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { savedSlugs } from "@/lib/content";
import { dailyIndex } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BookmarkButton } from "@/components/ui/BookmarkButton";

export const metadata: Metadata = { title: "Daily fact" };

export default async function FactsPage() {
  const ctx = await requireFamilyContext();
  const user = await getSessionUser();

  const stageOrder =
    ctx.stage.part === 3
      ? ["CHILD", "GENERAL", "POSTPARTUM"]
      : ctx.stage.part === 2
        ? ["BIRTH", "POSTPARTUM", "PREGNANCY"]
        : ["PREGNANCY", "GENERAL"];

  const all = await db.content.findMany({
    where: { contentType: "FACT", published: true },
    orderBy: { slug: "asc" },
  });
  const saved = user ? await savedSlugs(user.id, "fact") : new Set<string>();

  const relevant = all.filter((f) => stageOrder.includes(f.stage));
  const pool = relevant.length ? relevant : all;
  const today = pool[dailyIndex(pool.length)];

  return (
    <div>
      <PageHeader
        title="NestWise facts"
        intro="One short, evidence-minded fact a day, plus a browsable set. Save the ones you like."
      />

      {today && (
        <Card className="mb-8 nw-gradient">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge tone="accent">Today · {today.category}</Badge>
              <p className="mt-3 text-lg font-bold">{today.title}</p>
            </div>
            <BookmarkButton
              refType="fact"
              refSlug={today.slug}
              title={today.title}
              href="/facts"
              initialSaved={saved.has(today.slug)}
              compact
            />
          </div>
        </Card>
      )}

      <h2 className="mb-3 text-lg font-bold">Browse</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {pool.map((f) => (
          <Card key={f.id} className="flex items-start justify-between gap-3">
            <div>
              <Badge>{f.category}</Badge>
              <p className="mt-2 text-sm">{f.title}</p>
            </div>
            <BookmarkButton
              refType="fact"
              refSlug={f.slug}
              title={f.title}
              href="/facts"
              initialSaved={saved.has(f.slug)}
              compact
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
