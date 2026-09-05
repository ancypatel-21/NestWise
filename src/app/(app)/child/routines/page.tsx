import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { resolveActiveChild } from "@/lib/active-child";
import { ageFromDob } from "@/lib/personalization/age";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Callout } from "@/components/ui/Callout";
import { EmptyState } from "@/components/ui/EmptyState";
import { ChildSwitcher } from "@/components/child/ChildSwitcher";
import { RoutineBuilder } from "./RoutineBuilder";
import { RoutineControls } from "./RoutineControls";

export const metadata: Metadata = { title: "Routine builder" };

export default async function RoutinesPage() {
  const ctx = await requireFamilyContext();
  if (ctx.children.length === 0) {
    return (
      <div>
        <PageHeader title="Routine builder" backHref="/child" />
        <EmptyState title="Add a child profile first" />
      </div>
    );
  }
  const active = (await resolveActiveChild(ctx.children))!;
  const routines = await db.routine.findMany({
    where: { childId: active.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Routine builder"
        intro="Build gentle rhythms for feeding, sleep, play, school and bedtime. The goal is organisation, not a rigid schedule."
        backHref="/child"
        backLabel="Child dashboard"
      />

      <ChildSwitcher
        activeId={active.id}
        children={ctx.children.map((c) => ({
          id: c.id,
          name: c.nameOrNickname,
          ageLabel: ageFromDob(c.dateOfBirth).label,
        }))}
      />

      <Callout tone="info" className="my-6">
        Routines here are a planning aid. They are not medically rigid schedules — adapt them to
        your child and your day.
      </Callout>

      <div className="grid gap-6 lg:grid-cols-2">
        <RoutineBuilder childId={active.id} />

        <div className="space-y-3">
          <h2 className="text-lg font-bold">Saved routines</h2>
          {routines.length === 0 ? (
            <EmptyState title="No routines yet" />
          ) : (
            routines.map((r) => {
              const items = (r.items as unknown as Array<{ label: string; time: string }>) ?? [];
              return (
                <Card key={r.id}>
                  <div className="flex items-center justify-between">
                    <p className="font-bold">{r.title}</p>
                    <RoutineControls id={r.id} enabled={r.enabled} />
                  </div>
                  <ol className="mt-2 space-y-1 text-sm text-[var(--color-ink-soft)]">
                    {items.map((it, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{it.label}</span>
                        <span className="tabular-nums">{it.time}</span>
                      </li>
                    ))}
                  </ol>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
