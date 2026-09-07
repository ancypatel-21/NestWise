import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { resolveActiveChild } from "@/lib/active-child";
import { isKidsMode } from "@/lib/kids-mode";
import type { GameConfig } from "@/lib/games/engine";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import { GamePlayer } from "../GamePlayer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = await db.game.findUnique({ where: { slug } });
  return { title: g?.title ?? "Game" };
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const ctx = await requireFamilyContext();
  const { slug } = await params;
  const game = await db.game.findUnique({ where: { slug } });
  if (!game) notFound();

  const kids = await isKidsMode();
  const active = ctx.children.length ? await resolveActiveChild(ctx.children) : null;

  const lastProgress = active
    ? await db.gameProgress.findFirst({
        where: { childId: active.id, gameSlug: slug },
        orderBy: { completedAt: "desc" },
      })
    : null;
  const startLevel = lastProgress?.level ?? 1;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={game.title}
        backHref={kids ? "/child/games" : "/child/games"}
        backLabel="Games"
      />

      <GamePlayer
        gameSlug={game.slug}
        format={game.format}
        config={game.config as unknown as GameConfig}
        skills={game.skillsSupported}
        startLevel={startLevel}
        childId={active?.id ?? null}
      />

      {!kids && (
        <Card className="mt-6">
          <CardTitle>Skills supported by this activity</CardTitle>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {game.skillsSupported.map((s) => (
              <li
                key={s}
                className="rounded-full bg-[var(--color-accent-surface)] px-2.5 py-0.5 text-xs font-semibold text-[var(--color-accent-strong)]"
              >
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-[var(--color-ink-soft)]">
            This is educational play. It won't medically improve intelligence or guarantee outcomes,
            and results are separate from clinical developmental milestones.
          </p>
        </Card>
      )}
    </div>
  );
}
