import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-display font-bold transition-colors disabled:opacity-50 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  primary:
    "nw-btn bg-[var(--color-accent)] text-[var(--color-accent-contrast)] hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,var(--color-graphite))]",
  secondary: "nw-btn bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)]",
  ghost:
    "rounded-[var(--radius-md)] bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)]",
  danger: "nw-btn bg-[var(--color-danger)] text-white hover:brightness-110",
};

const sizes: Record<Size, string> = {
  sm: "min-h-9 px-3.5 text-sm",
  md: "min-h-11 px-5 text-base",
  lg: "min-h-12 px-6 text-lg",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export function ButtonLink({
  href,
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Link>, "href">) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
