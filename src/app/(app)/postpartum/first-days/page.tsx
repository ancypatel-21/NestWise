import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { byType } from "@/lib/content";
import { ContentListPage } from "@/components/ContentListPage";

export const metadata: Metadata = { title: "First days home" };

export default async function FirstDaysPage() {
  await requireFamilyContext();
  const items = await byType("FIRST_DAYS");
  return (
    <ContentListPage
      title="First days after birth"
      intro="A guided set of newborn-care basics — feeding, diapering, burping, safe sleep, bathing, soothing — plus looking after the parents."
      backHref="/home"
      items={items}
      hrefFor={(c) => `/postpartum/topic/${c.slug}`}
      groupBy={() => "First days home"}
      footerNote="When in doubt about the baby's health — poor feeding, few wet nappies, hard to wake, fever, fast breathing, or yellowing skin — contact their clinician."
    />
  );
}
