import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { byType } from "@/lib/content";
import { ContentListPage } from "@/components/ContentListPage";

export const metadata: Metadata = { title: "Movement" };

export default async function ExercisePage() {
  await requireFamilyContext();
  const items = await byType("EXERCISE");
  return (
    <ContentListPage
      title="Exercise & movement"
      intro="Gentle, stage-aware activity. Each has a purpose, suitable stage, steps, safety notes and clear stop signs."
      items={items}
      hrefFor={(c) => `/exercise/${c.slug}`}
      groupBy={() => "Exercises"}
      footerNote="Check with your midwife or doctor before starting new exercise, especially with any pregnancy complications. An AI-guided instructor is a planned future feature."
    />
  );
}
