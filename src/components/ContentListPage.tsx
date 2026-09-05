import Link from "next/link";
import type { Content } from "@prisma/client";
import { PageHeader } from "@/components/ui/PageHeader";
import { Callout } from "@/components/ui/Callout";

/** Generic grouped list of content links (used for exercises, symptoms, birth topics, etc.). */
export function ContentListPage({
  title,
  intro,
  backHref,
  items,
  hrefFor,
  groupBy = (c) => c.category,
  footerNote,
}: {
  title: string;
  intro?: string;
  backHref?: string;
  items: Content[];
  hrefFor: (c: Content) => string;
  groupBy?: (c: Content) => string;
  footerNote?: string;
}) {
  const groups = new Map<string, Content[]>();
  for (const c of items) {
    const g = groupBy(c);
    groups.set(g, [...(groups.get(g) ?? []), c]);
  }

  return (
    <div>
      <PageHeader title={title} intro={intro} backHref={backHref} />
      <div className="space-y-6">
        {[...groups.entries()].map(([group, list]) => (
          <section key={group}>
            {groups.size > 1 && <h2 className="mb-3 text-lg font-bold">{group}</h2>}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((c) => (
                <Link
                  key={c.id}
                  href={hrefFor(c)}
                  className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
                >
                  <span className="block font-bold">{c.title}</span>
                  <span className="mt-1 block text-sm text-[var(--color-ink-soft)]">
                    {c.summary}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
      {footerNote && (
        <Callout tone="info" className="mt-6">
          {footerNote}
        </Callout>
      )}
    </div>
  );
}
