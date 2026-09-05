import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { ensureChecklist } from "@/lib/actions/checklists";
import { CHECKLIST_TEMPLATES } from "@/content/checklists";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { Callout } from "@/components/ui/Callout";
import { InteractiveChecklist } from "@/components/InteractiveChecklist";

export const metadata: Metadata = { title: "Hospital bag" };

const PATH = "/birth/hospital-bag";

export default async function HospitalBagPage() {
  await requireFamilyContext();
  const mother = await ensureChecklist("MOTHER_BAG");
  const baby = await ensureChecklist("BABY_BAG");

  const view = (c: typeof mother) =>
    c.items.map((i) => ({
      id: i.id,
      label: i.label,
      category: i.category,
      checked: i.checked,
      custom: i.custom,
    }));

  return (
    <div>
      <PageHeader
        title="Hospital bag"
        intro="Two independent checklists. Tick items off, add your own, and watch the completion percentage."
        backHref="/birth"
        backLabel="Birth preparation"
      />

      <Callout tone="info" className="mb-5">
        {CHECKLIST_TEMPLATES.find((t) => t.kind === "MOTHER_BAG")?.note}
      </Callout>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)]">
        <Tabs
          items={[
            {
              id: "mother",
              label: "Mother's bag",
              content: (
                <InteractiveChecklist checklistId={mother.id} items={view(mother)} path={PATH} />
              ),
            },
            {
              id: "baby",
              label: "Baby's bag",
              content: (
                <InteractiveChecklist checklistId={baby.id} items={view(baby)} path={PATH} />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
