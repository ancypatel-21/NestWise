import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function PageHeader({
  title,
  intro,
  backHref,
  backLabel = "Back",
  action,
}: {
  title: string;
  intro?: string;
  backHref?: string;
  backLabel?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      {backHref && (
        <Link
          href={backHref}
          className="mb-2 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent-strong)]"
        >
          <ChevronLeft size={16} aria-hidden />
          {backLabel}
        </Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="nw-heading-mark text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          {intro && <p className="mt-2 max-w-2xl text-[var(--color-ink-soft)]">{intro}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

export function SectionGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}
