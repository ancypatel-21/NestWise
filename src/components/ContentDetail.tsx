import type { Content } from "@prisma/client";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContentBlocks } from "@/components/ui/ContentBlocks";
import { ExplainableContent } from "@/components/ExplainableContent";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import { CompletionToggle } from "@/components/ui/CompletionToggle";
import { ListenButton } from "@/components/ui/ListenButton";
import { Card, CardTitle } from "@/components/ui/Card";
import { blocksOf, plainText } from "@/lib/content";

/**
 * Shared renderer for a single Content entry (lesson, symptom, exercise, food, birth/postpartum
 * topic, development page…). Key takeaways sit at the bottom so the explanation leads the page.
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
  hero,
  interactive = false,
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
  hero?: React.ReactNode;
  /** When true, each paragraph offers an AI "Explain differently" action (lesson pages). */
  interactive?: boolean;
  children?: React.ReactNode;
}) {
  const refs = content.referenceUrls ?? [];

  return (
    <article>
      <PageHeader
        title={content.title}
        intro={content.summary}
        backHref={backHref}
        backLabel={backLabel}
        action={
          <div className="flex flex-wrap gap-2">
            <ListenButton text={plainText(content)} />
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

      {hero && <div className="mb-6">{hero}</div>}

      <div className="nw-paper p-5">
        {interactive ? (
          <ExplainableContent blocks={blocksOf(content)} />
        ) : (
          <ContentBlocks blocks={blocksOf(content)} />
        )}
      </div>

      {children}

      {content.keyTakeaways.length > 0 && (
        <Card className="mt-6 nw-paper--alt bg-[var(--color-accent-surface)]">
          <CardTitle>Key takeaways</CardTitle>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--color-ink)]">
            {content.keyTakeaways.map((k, i) => (
              <li key={i}>{k}</li>
            ))}
          </ul>
        </Card>
      )}

      {refs.length > 0 && (
        <p className="mt-4 text-xs text-[var(--color-ink-faint)]">
          Further reading:{" "}
          {refs.map((r, i) => (
            <span key={r}>
              {i > 0 && " · "}
              <a href={r} target="_blank" rel="noreferrer" className="nw-underline">
                {r.replace(/^https?:\/\//, "").split("/")[0]}
              </a>
            </span>
          ))}
        </p>
      )}
    </article>
  );
}
