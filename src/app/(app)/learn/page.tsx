import Link from "next/link";
import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/session";
import { completedSlugs } from "@/lib/content";
import { LEARN_MODULES } from "@/content/learn-modules";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/Progress";
import { pct } from "@/lib/utils";

export const metadata: Metadata = { title: "Learn" };

export default async function LearnHubPage() {
  const ctx = await requireFamilyContext();
  const user = await getSessionUser();
  const isChildStage = ctx.stage.part === 3;

  const lessons = await db.content.findMany({
    where: { contentType: "LESSON", published: true },
  });
  const done = user ? await completedSlugs(user.id) : new Set<string>();

  const lessonsByCategory = new Map<string, number>();
  const doneByCategory = new Map<string, number>();
  for (const l of lessons) {
    lessonsByCategory.set(l.category, (lessonsByCategory.get(l.category) ?? 0) + 1);
    if (done.has(l.slug))
      doneByCategory.set(l.category, (doneByCategory.get(l.category) ?? 0) + 1);
  }

  return (
    <div>
      <PageHeader
        title={isChildStage ? "Parent learning" : "Pregnancy learning hub"}
        intro="Short lessons with key takeaways and a quick quiz. Save anything to read later; mark lessons complete to track progress."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LEARN_MODULES.map((m) => {
          const total = lessonsByCategory.get(m.title) ?? m.lessons.length;
          const completed = doneByCategory.get(m.title) ?? 0;
          return (
            <Link
              key={m.slug}
              href={`/learn/${m.slug}`}
              className="flex flex-col gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
            >
              <span className="text-3xl" aria-hidden>
                {m.emoji}
              </span>
              <span className="text-base font-bold">{m.title}</span>
              <span className="text-sm text-[var(--color-ink-soft)]">{m.blurb}</span>
              <ProgressBar
                value={pct(completed, total)}
                label={`${completed}/${total} lessons`}
                className="mt-1"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
