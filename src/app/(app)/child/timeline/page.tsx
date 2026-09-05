import Link from "next/link";
import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { resolveActiveChild } from "@/lib/active-child";
import { ageFromDob } from "@/lib/personalization/age";
import { CHILD_STAGES } from "@/content/child-development";
import { PageHeader } from "@/components/ui/PageHeader";
import { Callout } from "@/components/ui/Callout";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Development timeline" };

export default async function ChildTimelinePage() {
  const ctx = await requireFamilyContext();
  const active = ctx.children.length ? await resolveActiveChild(ctx.children) : null;
  const months = active ? ageFromDob(active.dateOfBirth).months : -1;

  const firstYear = CHILD_STAGES.filter((s) => s.band === "First year");
  const yearly = CHILD_STAGES.filter((s) => s.band === "Yearly stages");

  const isCurrent = (min: number, max: number) => months >= min && months < max;

  return (
    <div>
      <PageHeader
        title="Child development timeline"
        intro="Month-by-month for the first year, then yearly bands to age 12. Every stage covers all six areas of development, a For Parents section, and positive discipline."
        backHref="/child"
        backLabel="Child dashboard"
      />

      <Callout tone="info" className="mb-6">
        Development is a range, not a pass/fail timeline. Missing something on a list at a given age
        is usually normal variation — persistent concerns are worth a conversation with a pediatric
        professional.
      </Callout>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-bold">First year</h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {firstYear.map((s) => (
            <Link
              key={s.slug}
              href={`/child/timeline/${s.slug}`}
              className={cn(
                "rounded-[var(--radius-md)] border p-3 text-center text-sm font-bold",
                isCurrent(s.ageMinMonths, s.ageMaxMonths)
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-contrast)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-muted)]",
              )}
            >
              {s.title}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Yearly stages</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {yearly.map((s) => (
            <Link
              key={s.slug}
              href={`/child/timeline/${s.slug}`}
              className={cn(
                "rounded-[var(--radius-md)] border p-3 text-center text-sm font-bold",
                isCurrent(s.ageMinMonths, s.ageMaxMonths)
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-contrast)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-muted)]",
              )}
            >
              {s.title}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
