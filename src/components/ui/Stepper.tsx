import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Progress">
      {steps.map((label, i) => {
        const state = i < current ? "done" : i === current ? "active" : "todo";
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold",
                state === "done" && "bg-[var(--color-success)] text-white",
                state === "active" && "bg-[var(--color-accent)] text-[var(--color-accent-contrast)]",
                state === "todo" && "bg-[var(--color-surface-muted)] text-[var(--color-ink-faint)]",
              )}
              aria-current={state === "active" ? "step" : undefined}
            >
              {state === "done" ? <Check size={14} aria-hidden /> : i + 1}
            </span>
            <span
              className={cn(
                "hidden text-xs font-semibold sm:block",
                state === "todo" ? "text-[var(--color-ink-faint)]" : "text-[var(--color-ink)]",
              )}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <span className="h-0.5 flex-1 rounded bg-[var(--color-border)]" aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function StreakBadge({ days }: { days: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-caution-surface)] px-3 py-1 text-sm font-bold text-[var(--color-caution)]">
      <span aria-hidden>🔥</span>
      {days}-day streak
    </span>
  );
}
