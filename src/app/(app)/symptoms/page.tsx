import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { byType } from "@/lib/content";
import { ContentListPage } from "@/components/ContentListPage";
import { SafetyDisclaimer } from "@/components/safety";

export const metadata: Metadata = { title: "Symptom explorer" };

export default async function SymptomsPage() {
  await requireFamilyContext();
  const items = await byType("SYMPTOM");
  return (
    <div>
      <div className="mb-6">
        <SafetyDisclaimer />
      </div>
      <ContentListPage
        title="Symptom explorer"
        intro="Common pregnancy experiences explained: why they can happen, general self-care, what to monitor, and clear signs to get help. This is not a diagnosis tool."
        items={items}
        hrefFor={(c) => `/symptoms/${c.slug}`}
        groupBy={() => "Common experiences"}
        footerNote="The symptom explorer never assesses your situation — a clinician does that. If a symptom worries you, contact your care provider."
      />
    </div>
  );
}
