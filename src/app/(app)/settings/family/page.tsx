import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { addChild } from "@/lib/actions/children";
import { ageFromDob } from "@/lib/personalization/age";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import { Callout } from "@/components/ui/Callout";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { DeleteChildButton } from "./DeleteChildButton";

export const metadata: Metadata = { title: "Family settings" };

const ROLE_LABEL: Record<string, string> = {
  MOTHER: "Mother",
  PARTNER: "Partner / Father",
  PARENT_CAREGIVER: "Parent / Caregiver",
};

export default async function FamilySettingsPage() {
  const ctx = await requireFamilyContext();
  const members = await db.familyMembership.findMany({
    where: { familyId: ctx.familyId },
    include: { user: true },
  });

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Family"
        intro="Members, roles and child profiles."
        backHref="/settings"
        backLabel="Settings"
      />

      <Card>
        <CardTitle>Members</CardTitle>
        <ul className="mt-3 space-y-2">
          {members.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-border)] p-3 text-sm"
            >
              <span className="font-semibold">{m.user.displayName}</span>
              <Badge tone="accent">{ROLE_LABEL[m.role]}</Badge>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-[var(--color-ink-faint)]">
          Inviting a second adult to a shared family account is a planned feature.
        </p>
      </Card>

      <Card>
        <CardTitle>Children</CardTitle>
        <Callout tone="info" className="mt-3">
          Child profiles are private by default. Deleting a child removes their journal, routines and
          all learning progress — permanently.
        </Callout>
        <ul className="mt-3 space-y-2">
          {ctx.children.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-border)] p-3 text-sm"
            >
              <span>
                <span className="font-semibold">{c.nameOrNickname}</span>{" "}
                <span className="text-[var(--color-ink-faint)]">
                  · {ageFromDob(c.dateOfBirth).label} · born {formatDate(c.dateOfBirth)}
                </span>
              </span>
              <DeleteChildButton childId={c.id} name={c.nameOrNickname} />
            </li>
          ))}
          {ctx.children.length === 0 && (
            <li className="text-sm text-[var(--color-ink-soft)]">No child profiles yet.</li>
          )}
        </ul>

        <form action={addChild} className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Name or nickname" htmlFor="nameOrNickname">
            <Input id="nameOrNickname" name="nameOrNickname" required maxLength={60} />
          </Field>
          <Field label="Date of birth" htmlFor="dateOfBirth">
            <Input id="dateOfBirth" name="dateOfBirth" type="date" required />
          </Field>
          <div className="sm:col-span-2">
            <Button type="submit" size="sm">
              Add child
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
