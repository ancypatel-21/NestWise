import Link from "next/link";
import { cn } from "@/lib/utils";

export function Card({
  className,
  as: As = "div",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { as?: React.ElementType }) {
  return <As className={cn("nw-paper p-5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-xl font-bold tracking-tight text-[var(--color-ink)]", className)}
      {...props}
    />
  );
}

export function CardMeta({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-[var(--color-ink-soft)]", className)} {...props} />;
}

/** A card that is entirely a link — used across dashboards and libraries. */
export function LinkCard({
  href,
  title,
  children,
  eyebrow,
  className,
}: {
  href: string;
  title: string;
  eyebrow?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "nw-paper nw-paper--alt group flex flex-col gap-1 p-5 transition-transform hover:-translate-y-0.5 hover:-rotate-[0.4deg] hover:shadow-[var(--shadow-lift)]",
        className,
      )}
    >
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-strong)]">
          {eyebrow}
        </span>
      )}
      <span className="font-display text-lg font-bold text-[var(--color-ink)] group-hover:text-[var(--color-accent-strong)]">
        {title}
      </span>
      {children && <span className="text-sm text-[var(--color-ink-soft)]">{children}</span>}
    </Link>
  );
}
