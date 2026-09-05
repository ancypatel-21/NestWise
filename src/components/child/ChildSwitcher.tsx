"use client";

import { useTransition } from "react";
import { setActiveChild } from "@/lib/actions/children";
import { cn } from "@/lib/utils";

export function ChildSwitcher({
  children,
  activeId,
}: {
  children: Array<{ id: string; name: string; ageLabel: string }>;
  activeId: string;
}) {
  const [pending, start] = useTransition();
  if (children.length < 2) return null;

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Choose child">
      {children.map((c) => (
        <button
          key={c.id}
          disabled={pending}
          onClick={() => start(() => setActiveChild(c.id))}
          className={cn(
            "min-h-10 rounded-full border px-4 text-sm font-semibold transition-colors disabled:opacity-50",
            c.id === activeId
              ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-contrast)]"
              : "border-[var(--color-border)] bg-[var(--color-surface)]",
          )}
        >
          {c.name} · {c.ageLabel}
        </button>
      ))}
    </div>
  );
}
