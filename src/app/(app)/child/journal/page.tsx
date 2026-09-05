import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { resolveActiveChild } from "@/lib/active-child";
import { formatDate } from "@/lib/utils";
import { addJournalEntry, deleteJournalEntry } from "@/lib/actions/journal";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Callout } from "@/components/ui/Callout";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { ChildSwitcher } from "@/components/child/ChildSwitcher";
import { DeleteEntryButton } from "./DeleteEntryButton";
import { ageFromDob } from "@/lib/personalization/age";

export const metadata: Metadata = { title: "Milestone journal" };

const SUGGESTIONS = [
  "First smile",
  "First roll",
  "First steps",
  "First word",
  "Favourite food",
  "First day of school",
];

export default async function JournalPage() {
  const ctx = await requireFamilyContext();
  if (ctx.children.length === 0) {
    return (
      <div>
        <PageHeader title="Milestone journal" backHref="/child" />
        <EmptyState title="Add a child profile first" />
      </div>
    );
  }
  const active = (await resolveActiveChild(ctx.children))!;
  const entries = await db.journalEntry.findMany({
    where: { childId: active.id },
    orderBy: { date: "desc" },
  });

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <PageHeader
        title="Milestone journal"
        intro={`A private space for ${active.nameOrNickname}'s memories. Only your family can see this.`}
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
        This journal is private by default. You can delete any entry — or the whole child profile
        and its media — at any time in Family settings.
      </Callout>

      <Card className="mb-8">
        <form action={addJournalEntry} className="space-y-4">
          <input type="hidden" name="childId" value={active.id} />
          <Field label="Memory" htmlFor="title" required>
            <Input
              id="title"
              name="title"
              required
              maxLength={120}
              placeholder="e.g. First steps"
              list="milestone-suggestions"
            />
            <datalist id="milestone-suggestions">
              {SUGGESTIONS.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </Field>
          <Field label="Date" htmlFor="date" required>
            <Input id="date" name="date" type="date" defaultValue={today} required />
          </Field>
          <Field label="Notes (optional)" htmlFor="description">
            <Textarea id="description" name="description" maxLength={2000} />
          </Field>
          <p className="text-xs text-[var(--color-ink-faint)]">
            Photo upload is planned — this build keeps entries text-only so nothing sensitive is
            stored.
          </p>
          <Button type="submit">Add memory</Button>
        </form>
      </Card>

      {entries.length === 0 ? (
        <EmptyState title="No memories yet">Add your first above.</EmptyState>
      ) : (
        <ol className="space-y-3">
          {entries.map((e) => (
            <li key={e.id}>
              <Card className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-strong)]">
                    {formatDate(e.date)}
                  </p>
                  <p className="mt-1 font-bold">{e.title}</p>
                  {e.description && (
                    <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{e.description}</p>
                  )}
                </div>
                <DeleteEntryButton id={e.id} action={deleteJournalEntry} />
              </Card>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
