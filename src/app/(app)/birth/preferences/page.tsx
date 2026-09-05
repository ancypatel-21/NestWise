import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { ensureChecklist } from "@/lib/actions/checklists";
import { CHECKLIST_TEMPLATES } from "@/content/checklists";
import { PageHeader } from "@/components/ui/PageHeader";
import { Callout } from "@/components/ui/Callout";
import { InteractiveChecklist } from "@/components/InteractiveChecklist";

export const metadata: Metadata = { title: "Birth preferences" };

const PATH = "/birth/preferences";

export default async function BirthPreferencesPage() {
  await requireFamilyContext();
  const list = await ensureChecklist("BIRTH_PREFERENCES");
  const appt = await ensureChecklist("APPT_QUESTIONS");

  return (
    <div>
      <PageHeader
        title="Birth preferences"
        intro="Record what matters to you and the questions you want to raise. These are preferences, not a guaranteed plan — labour can take its own course."
        backHref="/birth"
        backLabel="Birth preparation"
      />

      <Callout tone="info" className="mb-5">
        {CHECKLIST_TEMPLATES.find((t) => t.kind === "BIRTH_PREFERENCES")?.note} Tick the ones you've
        thought through, and add your own.
      </Callout>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)]">
        <InteractiveChecklist
          checklistId={list.id}
          items={list.items.map((i) => ({
            id: i.id,
            label: i.label,
            category: i.category,
            checked: i.checked,
            custom: i.custom,
          }))}
          path={PATH}
          addLabel="Add a preference or question"
        />
      </div>

      <h2 className="mb-3 mt-8 text-lg font-bold">Questions for my next appointment</h2>
      <p className="mb-4 text-sm text-[var(--color-ink-soft)]">
        NestWise helps you prepare the conversation — it doesn't replace your clinician.
      </p>
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)]">
        <InteractiveChecklist
          checklistId={appt.id}
          items={appt.items.map((i) => ({
            id: i.id,
            label: i.label,
            category: i.category,
            checked: i.checked,
            custom: i.custom,
          }))}
          path={PATH}
          addLabel="Add a question"
        />
      </div>
    </div>
  );
}
