import Link from "next/link";
import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import { requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { filterContent } from "@/lib/personalization/content-filter";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";

export const metadata: Metadata = { title: "Nutrition" };

export default async function NutritionPage() {
  const ctx = await requireFamilyContext();
  const isPostpartum = ctx.stage.mode === "postpartum";

  const foods = await db.content.findMany({
    where: { contentType: "FOOD", published: true },
    orderBy: { title: "asc" },
  });

  const visible = filterContent(foods, {
    allergies: ctx.personalization.allergies,
  });
  const hiddenCount = foods.length - visible.length;

  const MEAL_ORDER = ["Breakfast", "Lunch", "Snack", "Dinner", "Hydration"];
  const grouped = new Map<string, typeof visible>();
  for (const f of visible) {
    const meal = f.category.split(" · ")[0];
    grouped.set(meal, [...(grouped.get(meal) ?? []), f]);
  }
  const byMeal = new Map<string, typeof visible>();
  for (const meal of MEAL_ORDER) {
    if (grouped.has(meal)) byMeal.set(meal, grouped.get(meal)!);
  }
  for (const [meal, items] of grouped) {
    if (!byMeal.has(meal)) byMeal.set(meal, items);
  }

  return (
    <div>
      <PageHeader
        title={isPostpartum ? "Postpartum nutrition" : "Pregnancy nutrition"}
        intro="Educational meal ideas — examples, not prescriptions. Adjust to your appetite, culture and budget."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <Link href="/nutrition/food-safety">
          <Card className="h-full bg-[var(--color-caution-surface)]">
            <div className="flex items-center gap-2">
              <ShieldAlert size={18} className="text-[var(--color-caution)]" aria-hidden />
              <CardTitle>Food safety in pregnancy</CardTitle>
            </div>
            <p className="mt-1 text-sm text-[var(--color-ink)]">
              Foods to be cautious with, safe preparation, caffeine, fish and pasteurisation.
            </p>
          </Card>
        </Link>
        <Card>
          <CardTitle>Your filters</CardTitle>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {ctx.personalization.dietaryPreferences.map((d) => (
              <Badge key={d} tone="accent">
                {d}
              </Badge>
            ))}
            {ctx.personalization.allergies.map((a) => (
              <Badge key={a} tone="caution">
                no {a}
              </Badge>
            ))}
            {ctx.personalization.dietaryPreferences.length === 0 &&
              ctx.personalization.allergies.length === 0 && (
                <span className="text-sm text-[var(--color-ink-soft)]">
                  None set —{" "}
                  <Link href="/settings" className="underline">
                    add preferences
                  </Link>
                </span>
              )}
          </div>
          {hiddenCount > 0 && (
            <p className="mt-2 text-xs text-[var(--color-ink-faint)]">
              {hiddenCount} item{hiddenCount === 1 ? "" : "s"} hidden because they name a declared
              allergy.
            </p>
          )}
        </Card>
      </div>

      <div className="space-y-6">
        {[...byMeal.entries()].map(([meal, items]) => (
          <section key={meal}>
            <h2 className="mb-3 text-lg font-bold">{meal}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((f) => (
                <Link
                  key={f.id}
                  href={`/nutrition/${f.slug}`}
                  className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)]"
                >
                  <span className="block font-bold">{f.title}</span>
                  <span className="mt-1 block text-sm text-[var(--color-ink-soft)]">
                    {f.summary}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Callout tone="info" className="mt-6">
        Nutrition here is general education. It won't claim a food treats a medical condition. Ask
        your provider about supplements.
      </Callout>
    </div>
  );
}
