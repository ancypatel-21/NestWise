import Link from "next/link";
import type { Metadata } from "next";
import { Trash2 } from "lucide-react";
import { getSessionUser, requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import {
  addContact,
  deleteContact,
  updateDueDate,
  updateProfile,
} from "@/lib/actions/settings";
import { signOutAction } from "@/lib/actions/session";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import { PreferencesForm } from "./PreferencesForm";
import { DangerZone } from "./DangerZone";

export const metadata: Metadata = { title: "Settings" };

const CONTACT_KINDS = [
  ["PROVIDER", "Healthcare provider"],
  ["HOSPITAL", "Hospital / birth centre"],
  ["PEDIATRICIAN", "Pediatrician"],
  ["EMERGENCY", "Emergency contact"],
] as const;

export default async function SettingsPage() {
  const ctx = await requireFamilyContext();
  const user = await getSessionUser();
  if (!user) return null;

  const prefs = (user.preferences ?? {}) as { interests?: string[]; reminders?: string[] };
  const contacts = await db.contact.findMany({ where: { familyId: ctx.familyId } });

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Settings" intro="Your profile, personalisation, contacts, data and account." />

      <Card>
        <CardTitle>Profile</CardTitle>
        <form action={updateProfile} className="mt-3 space-y-4">
          <Field label="Name" htmlFor="displayName">
            <Input id="displayName" name="displayName" defaultValue={user.displayName} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Country" htmlFor="country" hint="Two-letter code, e.g. US or GB.">
              <Input id="country" name="country" defaultValue={user.country} maxLength={2} />
            </Field>
            <Field label="Timezone" htmlFor="timezone">
              <Input id="timezone" name="timezone" defaultValue={user.timezone} />
            </Field>
          </div>
          <Button type="submit">Save profile</Button>
        </form>
      </Card>

      {ctx.pregnancyProfile && (
        <Card>
          <CardTitle>Pregnancy</CardTitle>
          <form action={updateDueDate} className="mt-3 flex flex-wrap items-end gap-3">
            <Field label="Estimated due date" htmlFor="edd">
              <Input
                id="edd"
                name="estimatedDueDate"
                type="date"
                defaultValue={ctx.pregnancyProfile.estimatedDueDate.toISOString().slice(0, 10)}
              />
            </Field>
            <Button type="submit">Update</Button>
          </form>
        </Card>
      )}

      <PreferencesForm
        showDiet={!!ctx.pregnancyProfile}
        initial={{
          dietaryPreferences: ctx.pregnancyProfile?.dietaryPreferences ?? [],
          allergies: ctx.pregnancyProfile?.allergies ?? [],
          contentPreferences:
            ctx.pregnancyProfile?.contentPreferences ?? prefs.interests ?? [],
          reminders: prefs.reminders ?? [],
        }}
      />

      <Card>
        <CardTitle>Important contacts</CardTitle>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          Optional. Stored privately for your family.
        </p>
        <ul className="mt-3 space-y-2">
          {contacts.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-border)] p-3 text-sm"
            >
              <span>
                <span className="font-semibold">{c.name}</span>{" "}
                <span className="text-[var(--color-ink-faint)]">
                  · {CONTACT_KINDS.find(([k]) => k === c.kind)?.[1]}
                  {c.phone ? ` · ${c.phone}` : ""}
                </span>
              </span>
              <form action={deleteContact.bind(null, c.id)}>
                <button aria-label="Delete contact" className="text-[var(--color-ink-faint)] hover:text-[var(--color-danger)]">
                  <Trash2 size={15} aria-hidden />
                </button>
              </form>
            </li>
          ))}
        </ul>
        <form action={addContact} className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Type" htmlFor="kind">
            <Select id="kind" name="kind" defaultValue="PROVIDER">
              {CONTACT_KINDS.map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Name" htmlFor="cname">
            <Input id="cname" name="name" required />
          </Field>
          <Field label="Phone" htmlFor="cphone">
            <Input id="cphone" name="phone" type="tel" />
          </Field>
          <Field label="Notes" htmlFor="cnotes">
            <Input id="cnotes" name="notes" />
          </Field>
          <div className="sm:col-span-2">
            <Button type="submit" size="sm">
              Add contact
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <CardTitle>Family</CardTitle>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          Manage members, roles and child profiles.
        </p>
        <Link
          href="/settings/family"
          className="mt-3 inline-block text-sm font-semibold text-[var(--color-accent-strong)]"
        >
          Open family settings →
        </Link>
      </Card>

      <Card>
        <CardTitle>Your data</CardTitle>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          Download everything tied to your account as JSON. Passwords are never included.
        </p>
        <a
          href="/api/export"
          className="mt-3 inline-flex min-h-10 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm font-semibold"
        >
          Export my data
        </a>
      </Card>

      <Card>
        <CardTitle>Session</CardTitle>
        <form action={signOutAction} className="mt-3">
          <Button variant="secondary" type="submit">
            Log out
          </Button>
        </form>
      </Card>

      <DangerZone />
    </div>
  );
}
