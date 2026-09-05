import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  children,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center",
        className,
      )}
    >
      {icon && <div className="text-[var(--color-accent-strong)]" aria-hidden>{icon}</div>}
      <p className="text-base font-bold text-[var(--color-ink)]">{title}</p>
      {children && (
        <div className="max-w-sm text-sm text-[var(--color-ink-soft)]">{children}</div>
      )}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-muted)]",
        className,
      )}
    />
  );
}
