import Link from "next/link";
import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "Weekend activities" };

export default async function WeekendPage() {
  await requireFamilyContext();
  const items = await db.activity.findMany({
    where: { weekend: true },
    orderBy: { title: "asc" },
  });

  const byCategory = new Map<string, typeof items>();
  for (const a of items) byCategory.set(a.category, [...(byCategory.get(a.category) ?? []), a]);

  return (
    <div>
      <PageHeader
        title="Weekend activities"
        intro="Bigger projects for when there's more time — art, science, outdoors, cooking, building and more. Each lists time, materials, supervision level and safety notes."
        backHref="/child"
        backLabel="Child dashboard"
      />
      <div className="space-y-6">
        {[...byCategory.entries()].map(([cat, list]) => (
          <section key={cat}>
            <h2 className="mb-3 text-lg font-bold">{cat}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((a) => (
                <Link
                  key={a.slug}
                  href={`/child/activities/${a.slug}`}
                  className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)]"
                >
                  <div className="flex items-center justify-between">
                    <Badge tone="accent">{a.timeMin} min</Badge>
                    <span className="text-xs text-[var(--color-ink-faint)]">{a.supervisionLevel}</span>
                  </div>
                  <p className="mt-2 font-bold">{a.title}</p>
                  <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                    {a.skillsSupported.slice(0, 3).join(", ")}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
