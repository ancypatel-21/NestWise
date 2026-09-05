import { LifeBuoy, Stethoscope } from "lucide-react";
import { EMERGENCY_DISCLAIMER, MEDICAL_SCOPE_NOTE } from "@/lib/safety/constants";
import { Callout } from "@/components/ui/Callout";

/** PRD §11: the emergency disclaimer, shown verbatim wherever health Q&A appears. */
export function EmergencyBanner() {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-danger)_40%,transparent)] bg-[var(--color-danger-surface)] p-4 text-sm text-[var(--color-danger)]"
    >
      <LifeBuoy size={20} className="mt-0.5 shrink-0" aria-hidden />
      <p>
        <strong className="font-bold">{EMERGENCY_DISCLAIMER}</strong>
      </p>
    </div>
  );
}

/** PRD §1 principle: educational information and decision support, not diagnosis. */
export function MedicalScopeNote({ className }: { className?: string }) {
  return (
    <p
      className={
        "flex items-start gap-2 text-xs text-[var(--color-ink-soft)] " + (className ?? "")
      }
    >
      <Stethoscope size={14} className="mt-0.5 shrink-0" aria-hidden />
      <span>{MEDICAL_SCOPE_NOTE}</span>
    </p>
  );
}

export function SafetyDisclaimer() {
  return (
    <Callout tone="info" title="How to use NestWise health content">
      {MEDICAL_SCOPE_NOTE} Urgent warning signs are always marked. When something needs a
      professional, NestWise will say so rather than guess.
    </Callout>
  );
}
