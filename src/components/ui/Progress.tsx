import { cn } from "@/lib/utils";
import { clamp } from "@/lib/utils";

export function ProgressBar({
  value,
  label,
  className,
}: {
  value: number; // 0..100
  label?: string;
  className?: string;
}) {
  const v = clamp(Math.round(value), 0, 100);
  return (
    <div className={className}>
      {label && (
        <div className="mb-1 flex justify-between text-xs font-semibold text-[var(--color-ink-soft)]">
          <span>{label}</span>
          <span>{v}%</span>
        </div>
      )}
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-muted)]"
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "progress"}
      >
        <div
          className="h-full rounded-full bg-[var(--color-accent)] transition-[width]"
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}

export function ProgressCircle({
  value,
  size = 120,
  stroke = 12,
  caption,
  sub,
}: {
  value: number;
  size?: number;
  stroke?: number;
  caption?: string;
  sub?: string;
}) {
  const v = clamp(value, 0, 100);
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div
      className="relative inline-grid place-items-center"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-surface-muted)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - (v / 100) * circ}
        />
      </svg>
      <span className="absolute grid place-items-center text-center">
        <span className="text-xl font-extrabold text-[var(--color-ink)]">
          {caption ?? `${Math.round(v)}%`}
        </span>
        {sub && <span className="text-[0.7rem] text-[var(--color-ink-soft)]">{sub}</span>}
      </span>
    </div>
  );
}
