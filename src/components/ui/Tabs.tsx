"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export function Tabs({ items, initial }: { items: TabItem[]; initial?: string }) {
  const [active, setActive] = useState(initial ?? items[0]?.id);
  const base = useId();

  return (
    <div>
      <div
        role="tablist"
        aria-label="Section tabs"
        className="flex flex-wrap gap-1 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-1"
      >
        {items.map((item) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              role="tab"
              id={`${base}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${base}-panel-${item.id}`}
              onClick={() => setActive(item.id)}
              className={cn(
                "min-h-10 flex-1 rounded-[var(--radius-sm)] px-3 text-sm font-semibold transition-colors",
                selected
                  ? "bg-[var(--color-surface)] text-[var(--color-ink)] shadow-[var(--shadow-soft)]"
                  : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${base}-panel-${item.id}`}
          aria-labelledby={`${base}-tab-${item.id}`}
          hidden={item.id !== active}
          className="pt-5"
        >
          {item.id === active && item.content}
        </div>
      ))}
    </div>
  );
}
