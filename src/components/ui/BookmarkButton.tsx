"use client";

import { useState, useTransition } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toggleBookmark } from "@/lib/actions/bookmarks";
import { cn } from "@/lib/utils";

export function BookmarkButton({
  refType,
  refSlug,
  title,
  href,
  initialSaved = false,
  compact = false,
}: {
  refType: string;
  refSlug: string;
  title: string;
  href: string;
  initialSaved?: boolean;
  compact?: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      aria-pressed={saved}
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await toggleBookmark({ refType, refSlug, title, href });
          setSaved(res.saved);
        })
      }
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm font-semibold transition-colors disabled:opacity-50",
        compact ? "min-h-9" : "min-h-10",
        saved
          ? "bg-[var(--color-accent-surface)] text-[var(--color-accent-strong)]"
          : "bg-[var(--color-surface)] text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-muted)]",
      )}
    >
      {saved ? <BookmarkCheck size={16} aria-hidden /> : <Bookmark size={16} aria-hidden />}
      {compact ? null : saved ? "Saved" : "Save"}
    </button>
  );
}
