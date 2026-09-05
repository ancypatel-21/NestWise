import type { FamilyStage } from "@/types";
import { weeksToMonths } from "@/lib/personalization/pregnancy";

/** A quick "where are we right now" pill (PRD §7, §64). */
export function StagePill({ stage }: { stage: FamilyStage }) {
  let text = "Let's set up your journey";

  if (stage.mode === "pregnancy" && stage.pregnancyWeek) {
    text = weeksToMonths(stage.pregnancyWeek);
  } else if (stage.mode === "birth-countdown" && stage.daysToDueDate != null) {
    text =
      stage.daysToDueDate >= 0
        ? `About ${stage.daysToDueDate} days to your estimated due date`
        : `${Math.abs(stage.daysToDueDate)} days past your estimated due date`;
  } else if (stage.mode === "postpartum") {
    text = `First weeks with ${stage.primaryChildName ?? "your baby"}`;
  } else if (stage.mode === "child" && stage.primaryChildName) {
    text = `${stage.primaryChildName} · ${stage.childAgeMonths ?? 0} months`;
  }

  return (
    <span className="rounded-full bg-[var(--color-surface)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-ink-soft)] shadow-[var(--shadow-soft)]">
      {text}
    </span>
  );
}
