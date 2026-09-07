import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { blocksOf } from "@/lib/content";
import { CHILD_STAGES } from "@/content/child-development";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { ContentBlocks } from "@/components/ui/ContentBlocks";
import { EmptyState } from "@/components/ui/EmptyState";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ stage: string }>;
}): Promise<Metadata> {
  const { stage } = await params;
  const meta = CHILD_STAGES.find((s) => s.slug === stage);
  return { title: meta ? `${meta.title} development` : "Development" };
}

export default async function ChildStagePage({
  params,
}: {
  params: Promise<{ stage: string }>;
}) {
  await requireFamilyContext();
  const { stage } = await params;
  const meta = CHILD_STAGES.find((s) => s.slug === stage);
  if (!meta) notFound();

  const [dev, parent, discipline] = await Promise.all([
    db.content.findUnique({ where: { slug: `dev-${stage}` } }),
    db.content.findUnique({ where: { slug: `parent-${stage}` } }),
    db.content.findUnique({ where: { slug: `discipline-${stage}` } }),
  ]);
  if (!dev) notFound();

  const idx = CHILD_STAGES.findIndex((s) => s.slug === stage);
  const prev = CHILD_STAGES[idx - 1];
  const next = CHILD_STAGES[idx + 1];

  return (
    <div>
      <PageHeader
        title={meta.title}
        intro={dev.summary}
        backHref="/child/timeline"
        backLabel="Timeline"
      />

      <div className="mb-4 flex gap-2">
        {prev && (
          <a
            href={`/child/timeline/${prev.slug}`}
            className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm font-semibold"
          >
            ← {prev.title}
          </a>
        )}
        {next && (
          <a
            href={`/child/timeline/${next.slug}`}
            className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm font-semibold"
          >
            {next.title} →
          </a>
        )}
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)]">
        <Tabs
          items={[
            { id: "dev", label: "Development", content: <ContentBlocks blocks={blocksOf(dev)} /> },
            {
              id: "parents",
              label: "For parents",
              content: parent ? (
                <ContentBlocks blocks={blocksOf(parent)} />
              ) : (
                <EmptyState title="Coming soon" />
              ),
            },
            {
              id: "discipline",
              label: "Discipline & habits",
              content: discipline ? (
                <ContentBlocks blocks={blocksOf(discipline)} />
              ) : (
                <EmptyState title="Coming soon" />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
