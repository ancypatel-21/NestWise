"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { removeBookmark } from "@/lib/actions/bookmarks";

export function RemoveBookmarkButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      aria-label="Remove bookmark"
      disabled={pending}
      onClick={() => start(() => removeBookmark(id))}
      className="grid h-8 w-8 place-items-center rounded-[var(--radius-sm)] text-[var(--color-ink-faint)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-danger)] disabled:opacity-50"
    >
      <Trash2 size={15} aria-hidden />
    </button>
  );
}
