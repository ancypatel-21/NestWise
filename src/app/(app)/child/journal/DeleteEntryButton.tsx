"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

export function DeleteEntryButton({
  id,
  action,
}: {
  id: string;
  action: (id: string) => Promise<void>;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      aria-label="Delete memory"
      disabled={pending}
      onClick={() => {
        if (confirm("Delete this memory? This cannot be undone.")) {
          start(() => action(id));
        }
      }}
      className="grid h-8 w-8 shrink-0 place-items-center rounded-[var(--radius-sm)] text-[var(--color-ink-faint)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-danger)] disabled:opacity-50"
    >
      <Trash2 size={15} aria-hidden />
    </button>
  );
}
