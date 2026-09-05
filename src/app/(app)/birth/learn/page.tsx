import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { byType } from "@/lib/content";
import { ContentListPage } from "@/components/ContentListPage";

export const metadata: Metadata = { title: "Understanding childbirth" };

export default async function BirthLearnPage() {
  await requireFamilyContext();
  const items = await byType("BIRTH_TOPIC");
  return (
    <ContentListPage
      title="Understanding childbirth"
      intro="Calm, neutral overviews. Not every birth follows the same sequence — use these to understand the possibilities and prepare questions."
      backHref="/birth"
      items={items}
      hrefFor={(c) => `/birth/learn/${c.slug}`}
      groupBy={() => "Modules"}
      footerNote="Ask your team what any recommendation means for you, and remember you can ask questions and change your mind during labour."
    />
  );
}
