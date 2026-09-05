import Link from "next/link";
import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { resolveActiveChild } from "@/lib/active-child";
import { ageFromDob } from "@/lib/personalization/age";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";

export const metadata: Metadata = { title: "Activities" };

export default async function ActivitiesPage() {
  const ctx = await requireFamilyContext();
  const active = ctx.children.length ? await resolveActiveChild(ctx.children) : null;
  const months = active ? Math.max(ageFromDob(active.dateOfBirth).months, 0) : 0;

  const all = await db.activity.findMany({
    where: { weekend: false },
    orderBy: [{ ageMinMonths: "asc" }, { title: "asc" }],
  });
  const forAge = active
    ? all.filter((a) => months >= a.ageMinMonths - 2 && months <= a.ageMaxMonths + 2)
    : all;
  const rest = all.filter((a) => !forAge.includes(a));

  return (
    <div>
      <PageHeader
        title="Parent-led activities"
        intro={
          active
            ? `Matched to ${active.nameOrNickname} (${ageFromDob(active.dateOfBirth).label}). Each shows materials, steps, the skill it supports and safety notes.`
            : "Simple things to do together for ages 0–3, with the skill each one supports."
        }
        backHref="/child"
        backLabel="Child dashboard"
      />

      {forAge.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold">Good for now</h2>
          <ActivityGrid items={forAge} />
        </section>
      )}

      <section>
        <h2 className="mb-3 text-lg font-bold">{forAge.length ? "More activities" : "All activities"}</h2>
        <ActivityGrid items={rest.length ? rest : all} />
      </section>

      <Callout tone="info" className="mt-6">
        Playing an activity supports skills — it doesn't guarantee developmental outcomes. Follow
        your child's interest and stop when they've had enough.
      </Callout>
    </div>
  );
}

function ActivityGrid({
  items,
}: {
  items: Array<{ slug: string; title: string; category: string; skillsSupported: string[]; timeMin: number }>;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((a) => (
        <Link
          key={a.slug}
          href={`/child/activities/${a.slug}`}
          className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)]"
        >
          <div className="flex items-center justify-between gap-2">
            <Badge tone="accent">{a.category}</Badge>
            <span className="text-xs text-[var(--color-ink-faint)]">{a.timeMin} min</span>
          </div>
          <p className="mt-2 font-bold">{a.title}</p>
          <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
            Supports: {a.skillsSupported.slice(0, 2).join(", ")}
          </p>
        </Link>
      ))}
    </div>
  );
}
