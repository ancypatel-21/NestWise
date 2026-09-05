import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { listContent } from "@/lib/content";
import { ContentListPage } from "@/components/ContentListPage";
import { SafetyDisclaimer } from "@/components/safety";

export const metadata: Metadata = { title: "Parent wellbeing" };

export default async function WellbeingPage() {
  await requireFamilyContext();
  const items = await listContent({
    contentType: "POSTPARTUM_TOPIC",
    category: "Parent wellbeing",
  });
  return (
    <div>
      <div className="mb-6">
        <SafetyDisclaimer />
      </div>
      <ContentListPage
        title="Parent wellbeing"
        intro="Sleep deprivation, emotional adjustment, asking for help, partner communication and mental-health awareness for both parents. Supportive information — it does not diagnose."
        backHref="/home"
        items={items}
        hrefFor={(c) => `/postpartum/topic/${c.slug}`}
        groupBy={() => "Wellbeing topics"}
        footerNote="If low or anxious mood lasts most days beyond two weeks, contact your provider. For any thoughts of harming yourself or the baby, seek help immediately."
      />
    </div>
  );
}
