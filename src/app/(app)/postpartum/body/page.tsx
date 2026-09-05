import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { listContent } from "@/lib/content";
import { ContentListPage } from "@/components/ContentListPage";

export const metadata: Metadata = { title: "Postpartum body changes" };

export default async function PostpartumBodyPage() {
  await requireFamilyContext();
  const items = await listContent({ contentType: "POSTPARTUM_TOPIC", category: "Recovery" });
  return (
    <ContentListPage
      title="Preparing for postpartum body changes"
      intro="Common recovery experiences, why they happen, general comfort, and the warning signs that mean you should seek care. Recovery timelines vary — these are not guarantees."
      backHref="/home"
      items={items}
      hrefFor={(c) => `/postpartum/topic/${c.slug}`}
      groupBy={() => "Recovery topics"}
      footerNote="If you've given birth and something feels wrong — heavy bleeding, a hot painful wound, a swollen painful calf, or a very low mood — contact your provider."
    />
  );
}
