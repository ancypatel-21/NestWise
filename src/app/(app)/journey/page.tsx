import Link from "next/link";
import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { trimesterForWeek, weeksToMonths } from "@/lib/personalization/pregnancy";
import { PageHeader } from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Journey" };

export default async function JourneyPage() {
  const ctx = await requireFamilyContext();
  const current = ctx.stage.pregnancyWeek ?? null;
  const weeks = await db.content.findMany({
    where: { contentType: "WEEK_PREGNANCY", published: true },
    orderBy: { pregnancyWeek: "asc" },
  });

  const byTrimester = [1, 2, 3].map((t) => ({
    t,
    weeks: weeks.filter((w) => trimesterForWeek(w.pregnancyWeek ?? 0) === t),
  }));

  return (
    <div>
      <PageHeader
        title="Your pregnancy journey"
        intro="Week-by-week from early pregnancy to term. Content is organised by gestational week — months are only approximate."
      />

      {current && (
        <div className="mb-6 rounded-[var(--radius-lg)] nw-gradient p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-strong)]">
            You are here
          </p>
          <p className="text-xl font-extrabold">{weeksToMonths(current)}</p>
          <Link
            href={`/journey/week/${current}`}
            className="mt-2 inline-block text-sm font-semibold text-[var(--color-accent-strong)]"
          >
            Open week {current} →
          </Link>
        </div>
      )}

      <div className="space-y-8">
        {byTrimester.map(({ t, weeks: ws }) => (
          <section key={t}>
            <h2 className="mb-3 text-lg font-bold">Trimester {t}</h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
              {ws.map((w) => {
                const n = w.pregnancyWeek ?? 0;
                const isCurrent = n === current;
                return (
                  <Link
                    key={w.id}
                    href={`/journey/week/${n}`}
                    aria-current={isCurrent ? "page" : undefined}
                    className={cn(
                      "flex flex-col items-center rounded-[var(--radius-md)] border p-3 text-center transition-colors",
                      isCurrent
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-contrast)]"
                        : "border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-muted)]",
                    )}
                  >
                    <span className="text-lg font-extrabold">{n}</span>
                    <span className="text-[0.65rem] opacity-80">week</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
