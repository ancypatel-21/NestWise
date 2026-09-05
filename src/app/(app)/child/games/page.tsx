import Link from "next/link";
import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { resolveActiveChild } from "@/lib/active-child";
import { ageFromDob } from "@/lib/personalization/age";
import { isKidsMode } from "@/lib/kids-mode";
import { PageHeader } from "@/components/ui/PageHeader";
import { Callout } from "@/components/ui/Callout";

export const metadata: Metadata = { title: "Learning games" };

export default async function GamesLibraryPage() {
  const ctx = await requireFamilyContext();
  const kids = await isKidsMode();
  const active = ctx.children.length ? await resolveActiveChild(ctx.children) : null;
  const months = active ? Math.max(ageFromDob(active.dateOfBirth).months, 24) : 24;

  const games = await db.game.findMany({ orderBy: [{ category: "asc" }, { title: "asc" }] });
  const playable = games.filter((g) => g.minAgeMonths <= months + 12);

  const byCategory = new Map<string, typeof games>();
  for (const g of playable) byCategory.set(g.category, [...(byCategory.get(g.category) ?? []), g]);

  return (
    <div>
      <PageHeader
        title="Learning games"
        intro={kids ? "Pick a game!" : "Bright, quick games across colours, numbers, letters, nature, science and more. Difficulty adapts to how the player is doing — not their age alone."}
        backHref={kids ? undefined : "/child"}
        backLabel="Child dashboard"
      />

      <div className="space-y-6">
        {[...byCategory.entries()].map(([cat, list]) => (
          <section key={cat}>
            <h2 className="mb-3 text-lg font-bold">{cat}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((g) => (
                <Link
                  key={g.slug}
                  href={`/child/games/${g.slug}`}
                  className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
                >
                  <p className="font-bold">{g.title}</p>
                  {!kids && (
                    <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                      {g.skillsSupported.slice(0, 2).join(", ")}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {!kids && (
        <Callout tone="info" className="mt-6">
          Games are for fun and practice. They don't measure intelligence or guarantee
          developmental outcomes, and game scores are kept separate from any clinical milestones.
        </Callout>
      )}
    </div>
  );
}
