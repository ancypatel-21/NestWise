"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Compass } from "lucide-react";
import type { StageMode } from "@/types";
import type { OverridableMode } from "@/lib/personalization/mode-override";
import { setModeOverride } from "@/lib/actions/mode";
import { cn } from "@/lib/utils";

const CURRENT_LABEL: Partial<Record<StageMode, string>> = {
  pregnancy: "Pregnancy",
  "birth-countdown": "Pre-birth",
  postpartum: "Postpartum",
  child: "Child & family",
  unset: "Set up",
};

/** Header dropdown to jump between journeys the family has data for (PRD §3, §6). */
export function ModeSwitcher({
  current,
  options,
  overrideActive,
}: {
  current: StageMode;
  options: Array<{ value: OverridableMode; label: string; hasData: boolean }>;
  overrideActive: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (options.length === 0) return null;

  function choose(mode: string | null) {
    setOpen(false);
    startTransition(async () => {
      await setModeOverride(mode);
      router.refresh();
    });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={pending}
        className="inline-flex min-h-10 items-center gap-1.5 rounded-full border-2 border-[var(--color-graphite)] bg-[var(--color-surface)] px-3 text-sm font-bold text-[var(--color-ink)] shadow-[var(--shadow-soft)] disabled:opacity-60"
      >
        <Compass size={15} aria-hidden />
        <span className="hidden sm:inline">Journey:</span>
        {CURRENT_LABEL[current] ?? "Journey"}
        <ChevronDown size={15} aria-hidden className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-[var(--radius-lg)] border-2 border-[var(--color-graphite)] bg-[var(--color-surface)] p-1 shadow-[4px_6px_0_rgba(58,50,40,0.2)]"
        >
          <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">
            Switch journey
          </p>
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              role="menuitemradio"
              aria-checked={overrideActive && current === o.value}
              onClick={() => choose(o.value)}
              className="flex w-full items-center justify-between gap-2 rounded-[var(--radius-md)] px-3 py-2 text-left text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)]"
            >
              <span className="flex items-center gap-1.5">
                {o.label}
                {!o.hasData && (
                  <span className="text-xs font-medium text-[var(--color-ink-faint)]">
                    · set up
                  </span>
                )}
              </span>
              {current === o.value && <Check size={15} aria-hidden />}
            </button>
          ))}
          <div className="my-1 border-t border-[var(--color-border)]" />
          <button
            type="button"
            role="menuitemradio"
            aria-checked={!overrideActive}
            onClick={() => choose(null)}
            className="flex w-full items-center justify-between gap-2 rounded-[var(--radius-md)] px-3 py-2 text-left text-sm font-semibold text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-muted)]"
          >
            Auto (match my dates)
            {!overrideActive && <Check size={15} aria-hidden />}
          </button>
        </div>
      )}
    </div>
  );
}
