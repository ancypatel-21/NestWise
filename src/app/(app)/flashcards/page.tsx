import Link from "next/link";
import type { Metadata } from "next";
import { Layers } from "lucide-react";
import { getSessionUser, requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { CARD_PREFIX, flashcardModules } from "@/lib/flashcards";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Flashcards" };

export default async function FlashcardsPage() {
  await requireFamilyContext();
  const user = await getSessionUser();

  const items = user
    ? await db.reviewItem.findMany({
        where: { userId: user.id, prompt: { startsWith: CARD_PREFIX } },
        select: { prompt: true, dueAt: true },
      })
    : [];
  const dueSlugs = new Set(
    items.filter((it) => it.dueAt <= new Date()).map((it) => it.prompt.slice(CARD_PREFIX.length)),
  );

  const modules = flashcardModules();

  return (
    <div>
      <PageHeader
        title="Flashcards"
        intro="One card per lesson, built from its key takeaways. Flip, rate yourself, and NestWise brings the shaky ones back in your Daily review."
        backHref="/learn"
        backLabel="Learn"
        action={
          items.some((it) => it.dueAt <= new Date()) ? (
            <ButtonLink href="/quiz/review" size="sm">
              Review due cards
            </ButtonLink>
          ) : undefined
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => {
          const due = flashcardModuleDue(m.slug, dueSlugs);
          return (
            <Link
              key={m.slug}
              href={`/flashcards/${m.slug}`}
              className="nw-paper nw-paper--alt flex items-center gap-3 p-4"
            >
              <span className="text-2xl" aria-hidden>
                {m.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-base font-bold text-[var(--color-ink)]">
                  {m.title}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-[var(--color-ink-soft)]">
                  <Layers size={12} aria-hidden /> {m.count} cards
                </span>
              </span>
              {due > 0 && <Badge tone="accent">{due} due</Badge>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function flashcardModuleDue(moduleSlug: string, dueSlugs: Set<string>): number {
  let n = 0;
  for (const s of dueSlugs) if (s.startsWith(`${moduleSlug}--`)) n++;
  return n;
}
