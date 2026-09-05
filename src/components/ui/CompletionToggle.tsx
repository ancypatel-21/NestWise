"use client";

import { useState, useTransition } from "react";
import { Check, Circle } from "lucide-react";
import { toggleCompletion } from "@/lib/actions/progress";
import { cn } from "@/lib/utils";

export function CompletionToggle({
  contentSlug,
  path,
  initialCompleted = false,
}: {
  contentSlug: string;
  path?: string;
  initialCompleted?: boolean;
}) {
  const [done, setDone] = useState(initialCompleted);
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      aria-pressed={done}
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await toggleCompletion({ contentSlug, path });
          setDone(res.completed);
        })
      }
      className={cn(
        "inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-md)] px-4 text-sm font-semibold transition-colors disabled:opacity-50",
        done
          ? "bg-[var(--color-success-surface)] text-[var(--color-success)]"
          : "bg-[var(--color-accent)] text-[var(--color-accent-contrast)] hover:bg-[var(--color-accent-strong)]",
      )}
    >
      {done ? <Check size={16} aria-hidden /> : <Circle size={16} aria-hidden />}
      {done ? "Completed" : "Mark complete"}
    </button>
  );
}
