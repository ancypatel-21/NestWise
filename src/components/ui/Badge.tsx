import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "info" | "success" | "caution" | "danger";

const tones: Record<Tone, string> = {
  neutral: "bg-[var(--color-surface-muted)] text-[var(--color-ink-soft)]",
  accent: "bg-[var(--color-accent-surface)] text-[var(--color-accent-strong)]",
  info: "bg-[var(--color-info-surface)] text-[var(--color-info)]",
  success: "bg-[var(--color-success-surface)] text-[var(--color-success)]",
  caution: "bg-[var(--color-caution-surface)] text-[var(--color-caution)]",
  danger: "bg-[var(--color-danger-surface)] text-[var(--color-danger)]",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Chip({
  active,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "min-h-9 border-2 px-3.5 text-sm font-semibold transition-colors [border-radius:14px_10px_13px_11px/11px_13px_10px_14px]",
        active
          ? "border-[var(--color-graphite)] bg-[var(--color-accent)] text-[var(--color-accent-contrast)]"
          : "border-[var(--color-graphite)] bg-[var(--color-surface)] text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-muted)]",
        className,
      )}
      {...props}
    />
  );
}
