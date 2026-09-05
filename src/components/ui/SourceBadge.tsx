import { BookOpenCheck, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

/**
 * Provenance for health-related educational content (PRD §11.2, §44.6):
 * shows the source, when it was last reviewed, and trusted references.
 */
export function SourceBadge({
  source,
  reviewedAt,
  references = [],
}: {
  source: string;
  reviewedAt?: string | Date | null;
  references?: string[];
}) {
  const isPlaceholder = /placeholder/i.test(source);
  return (
    <div className="nw-paper nw-paper--soft bg-[var(--color-surface-muted)] p-4 text-sm text-[var(--color-ink-soft)]">
      <p className="flex items-center gap-2 font-display text-lg font-bold text-[var(--color-ink)]">
        <BookOpenCheck size={18} aria-hidden />
        {isPlaceholder ? "Content status" : "Source"}
      </p>
      <p className="mt-1.5 text-sm text-[var(--color-ink)]">{source}</p>
      <p className="mt-1 text-sm">
        {reviewedAt
          ? `Last reviewed ${formatDate(reviewedAt)}`
          : "Not yet reviewed by a clinician"}
      </p>
      {references.length > 0 && (
        <ul className="mt-2.5 space-y-1">
          {references.map((r) => (
            <li key={r}>
              <a
                href={r}
                target="_blank"
                rel="noreferrer"
                className="nw-underline inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent-strong)]"
              >
                {r.replace(/^https?:\/\//, "").split("/")[0]}
                <ExternalLink size={13} aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
