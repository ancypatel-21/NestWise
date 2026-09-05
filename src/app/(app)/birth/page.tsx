import type { Metadata } from "next";
import { CalendarClock } from "lucide-react";
import { requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { LinkCard } from "@/components/ui/Card";
import { Callout } from "@/components/ui/Callout";
import { pct } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/Progress";

export const metadata: Metadata = { title: "Birth preparation" };

export default async function BirthPage() {
  const ctx = await requireFamilyContext();
  const days = ctx.stage.daysToDueDate;

  const checklists = await db.checklist.findMany({
    where: { familyId: ctx.familyId },
    include: { items: true },
  });
  const motherBag = checklists.find((c) => c.kind === "MOTHER_BAG");
  const babyBag = checklists.find((c) => c.kind === "BABY_BAG");
  const contacts = await db.contact.count({ where: { familyId: ctx.familyId } });

  const bagPct = (c?: typeof motherBag) =>
    c ? pct(c.items.filter((i) => i.checked).length, c.items.length) : 0;

  return (
    <div>
      <PageHeader
        title="Birth preparation"
        intro="Gentle countdown from about four weeks before your estimated due date."
      />

      <Card className="mb-6 nw-gradient">
        <div className="flex items-center gap-3">
          <CalendarClock className="text-[var(--color-accent-strong)]" aria-hidden />
          <div>
            <p className="text-xl font-extrabold">
              {days == null
                ? "Counting down to your estimated due date"
                : days >= 0
                  ? `About ${days} days to your estimated due date`
                  : `${Math.abs(days)} days past your estimate`}
            </p>
            <p className="text-sm text-[var(--color-ink-soft)]">
              Due dates are estimates — this doesn't mean labour starts on that day.
            </p>
          </div>
        </div>
      </Card>

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <Card>
          <p className="font-bold">Mother's hospital bag</p>
          <ProgressBar value={bagPct(motherBag)} label="Packed" className="mt-2" />
        </Card>
        <Card>
          <p className="font-bold">Baby's hospital bag</p>
          <ProgressBar value={bagPct(babyBag)} label="Packed" className="mt-2" />
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <LinkCard href="/birth/hospital-bag" eyebrow="Checklist" title="Hospital bags">
          Two independent lists, plus custom items and a completion percentage.
        </LinkCard>
        <LinkCard href="/birth/learn" eyebrow="Learn" title="Understanding childbirth">
          Signs of labour, stages, pain options, C-section, skin-to-skin and more.
        </LinkCard>
        <LinkCard href="/birth/preferences" eyebrow="Prepare" title="Birth preferences">
          Preferences and questions to discuss with your team.
        </LinkCard>
        <LinkCard href="/birth/ask" eyebrow="Ask" title="Birth questions">
          Same safety rules as the main assistant.
        </LinkCard>
        <LinkCard href="/postpartum/body" eyebrow="Get ready" title="Postpartum body changes">
          Understand recovery before it begins.
        </LinkCard>
        <LinkCard href="/settings" eyebrow="Contacts" title={`Important contacts (${contacts})`}>
          Provider, hospital, pediatrician, emergency contact.
        </LinkCard>
      </div>

      <Callout tone="info" className="mt-6">
        Check your hospital or birth centre's own guidance too — every place is a little different.
      </Callout>
    </div>
  );
}
