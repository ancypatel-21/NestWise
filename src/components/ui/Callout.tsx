import { AlertTriangle, Info, ShieldAlert, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "info" | "caution" | "emergency" | "tip";

const config: Record<Tone, { icon: typeof Info; wrap: string; label: string }> = {
  info: {
    icon: Info,
    wrap: "bg-[var(--color-info-surface)] text-[var(--color-info)] border-[color-mix(in_srgb,var(--color-info)_30%,transparent)]",
    label: "Good to know",
  },
  tip: {
    icon: Sparkles,
    wrap: "bg-[var(--color-accent-surface)] text-[var(--color-accent-strong)] border-[color-mix(in_srgb,var(--color-accent)_35%,transparent)]",
    label: "Tip",
  },
  caution: {
    icon: AlertTriangle,
    wrap: "bg-[var(--color-caution-surface)] text-[var(--color-caution)] border-[color-mix(in_srgb,var(--color-caution)_35%,transparent)]",
    label: "Worth checking with a professional",
  },
  emergency: {
    icon: ShieldAlert,
    wrap: "bg-[var(--color-danger-surface)] text-[var(--color-danger)] border-[color-mix(in_srgb,var(--color-danger)_40%,transparent)]",
    label: "Urgent — seek help now",
  },
};

/**
 * State communicated by icon + label + colour together (PRD §46: never colour alone; §53).
 */
export function Callout({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: Tone;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { icon: Icon, wrap, label } = config[tone];
  return (
    <div
      className={cn(
        "border-2 p-4 [border-radius:16px_22px_14px_20px/20px_14px_22px_16px] [box-shadow:2px_3px_0_rgba(58,50,40,0.1)]",
        wrap,
        className,
      )}
      role={tone === "emergency" ? "alert" : undefined}
    >
      <p className="flex items-center gap-2 text-sm font-bold">
        <Icon size={18} aria-hidden />
        <span>{title ?? label}</span>
      </p>
      <div className="mt-1.5 text-sm text-[var(--color-ink)]">{children}</div>
    </div>
  );
}
