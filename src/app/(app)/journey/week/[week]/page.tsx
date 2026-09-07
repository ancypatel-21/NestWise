import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { blocksOf } from "@/lib/content";
import { weeksToMonths, trimesterForWeek } from "@/lib/personalization/pregnancy";
import type { ContentBlock } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { ContentBlocks } from "@/components/ui/ContentBlocks";
import { Card, CardTitle } from "@/components/ui/Card";
import { Callout } from "@/components/ui/Callout";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import { HeartHandshake } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ week: string }>;
}): Promise<Metadata> {
  const { week } = await params;
  return { title: `Week ${week}` };
}

/** Split a flat block array into sections keyed by their heading text. */
function sectionize(blocks: ContentBlock[]): Record<string, ContentBlock[]> {
  const out: Record<string, ContentBlock[]> = {};
  let key = "Overview";
  for (const b of blocks) {
    if (b.type === "heading") {
      key = b.text;
      out[key] = [];
    } else {
      (out[key] ??= []).push(b);
    }
  }
  return out;
}

export default async function WeekDetailPage({
  params,
}: {
  params: Promise<{ week: string }>;
}) {
  await requireFamilyContext();
  const week = Number((await params).week);
  if (!Number.isInteger(week) || week < 4 || week > 40) notFound();

  const content = await db.content.findFirst({
    where: { contentType: "WEEK_PREGNANCY", pregnancyWeek: week },
  });
  if (!content) notFound();

  const sections = sectionize(blocksOf(content));
  const partnerBlocks = [
    ...(sections["Partner / Father guide"] ?? []),
  ];
  const supportBlocks = sections["How can I support my partner this week?"] ?? [];

  const tabs = [
    {
      id: "baby",
      label: "Baby",
      content: <ContentBlocks blocks={sections["Baby development"] ?? []} />,
    },
    {
      id: "mother",
      label: "Your body",
      content: (
        <div className="space-y-4">
          <ContentBlocks blocks={sections["Your body this week"] ?? []} />
        </div>
      ),
    },
    {
      id: "checklist",
      label: "Checklist",
      content: <ContentBlocks blocks={sections["This week's checklist"] ?? []} />,
    },
    {
      id: "partner",
      label: "Partner guide",
      content: (
        <div className="space-y-4">
          <ContentBlocks blocks={partnerBlocks} />
          <Card className="bg-[var(--color-accent-surface)]">
            <div className="flex items-center gap-2">
              <HeartHandshake size={18} className="text-[var(--color-accent-strong)]" aria-hidden />
              <CardTitle>How can I support my partner this week?</CardTitle>
            </div>
            <div className="mt-2">
              <ContentBlocks blocks={supportBlocks} />
            </div>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={`Week ${week}`}
        intro={`${weeksToMonths(week)} · Trimester ${trimesterForWeek(week)}`}
        backHref="/journey"
        backLabel="All weeks"
        action={
          <BookmarkButton
            refType="week"
            refSlug={content.slug}
            title={`Week ${week}`}
            href={`/journey/week/${week}`}
          />
        }
      />

      <div className="mb-4 flex gap-2">
        {week > 4 && (
          <a
            href={`/journey/week/${week - 1}`}
            className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm font-semibold"
          >
            ← Week {week - 1}
          </a>
        )}
        {week < 40 && (
          <a
            href={`/journey/week/${week + 1}`}
            className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm font-semibold"
          >
            Week {week + 1} →
          </a>
        )}
      </div>

      <Callout tone="info" className="mb-5">
        Every pregnancy is different. Use this as general context for the stage, not a checklist you
        must match.
      </Callout>

      <div className="nw-paper p-5">
        <Tabs items={tabs} />
      </div>
    </div>
  );
}
