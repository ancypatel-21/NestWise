import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { byType } from "@/lib/content";
import { ContentListPage } from "@/components/ContentListPage";
import { ExerciseFigure, figureForSlug } from "@/components/ui/ExerciseFigure";

export const metadata: Metadata = { title: "Movement" };

export default async function ExercisePage() {
  await requireFamilyContext();
  const items = await byType("EXERCISE");
  return (
    <ContentListPage
      title="Exercise & movement"
      intro="Gentle, stage-aware activity with an illustrated guide for each move — purpose, suitable stage, step-by-step, safety notes and clear stop signs."
      items={items}
      hrefFor={(c) => `/exercise/${c.slug}`}
      groupBy={() => "Exercises"}
      leading={(c) => (
        <div className="mb-3 h-28 w-28">
          <ExerciseFigure kind={figureForSlug(c.slug)} compact />
        </div>
      )}
      footerNote="Check with your midwife or doctor before starting new exercise, especially with any pregnancy complications. The figures are a rough visual guide — follow the written steps."
    />
  );
}
