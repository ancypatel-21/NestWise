import type { Content } from "@prisma/client";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContentBlocks } from "@/components/ui/ContentBlocks";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import { CompletionToggle } from "@/components/ui/CompletionToggle";
import { Card, CardTitle } from "@/components/ui/Card";
import { blocksOf } from "@/lib/content";

/**
 * Shared renderer for a single Content entry (lesson, symptom, exercise, food, birth/postpartum
 * topic, development page…). Bookmark + completion are opt-in per call site.
 */
export function ContentDetail({
  content,
  backHref,
  backLabel,
  refType,
  href,
  saved = false,
  completed = false,
  showCompletion = false,
  children,
}: {
  content: Content;
  backHref: string;
  backLabel?: string;
  refType: string;
  href: string;
  saved?: boolean;
  completed?: boolean;
  showCompletion?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <article>
      <PageHeader
        title={content.title}
        intro={content.summary}
        backHref={backHref}
        backLabel={backLabel}
        action={
          <div className="flex gap-2">
            <BookmarkButton
              refType={refType}
              refSlug={content.slug}
              title={content.title}
              href={href}
              initialSaved={saved}
            />
            {showCompletion && (
              <CompletionToggle contentSlug={content.slug} path={href} initialCompleted={completed} />
            )}
          </div>
        }
      />

      {content.keyTakeaways.length > 0 && (
        <Card className="mb-6 bg-[var(--color-accent-surface)]">
          <CardTitle>Key takeaways</CardTitle>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--color-ink)]">
            {content.keyTakeaways.map((k, i) => (
              <li key={i}>{k}</li>
            ))}
          </ul>
        </Card>
      )}

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)]">
        <ContentBlocks blocks={blocksOf(content)} />
      </div>

      {children}

      <div className="mt-6">
        <SourceBadge
          source={content.source}
          reviewedAt={content.reviewedAt}
          references={content.referenceUrls}
        />
      </div>
    </article>
  );
}
