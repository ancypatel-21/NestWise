"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Accordion({
  items,
}: {
  items: Array<{ id: string; title: string; content: React.ReactNode }>;
}) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  return (
    <div className="divide-y divide-[var(--color-border)] overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id}>
            <button
              className="flex min-h-12 w-full items-center justify-between gap-3 px-4 text-left text-sm font-semibold text-[var(--color-ink)]"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : item.id)}
            >
              {item.title}
              <ChevronDown
                size={18}
                className={cn("shrink-0 transition-transform", isOpen && "rotate-180")}
                aria-hidden
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 text-sm text-[var(--color-ink-soft)]">{item.content}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
