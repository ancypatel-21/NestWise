"use client";

import { useState, useTransition } from "react";
import { updatePreferences } from "@/lib/actions/settings";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";

const DIET = ["Omnivore", "Vegetarian", "Vegan", "Pescatarian", "Halal", "Kosher"];
const ALLERGIES = ["peanut", "tree nuts", "milk", "egg", "soy", "wheat/gluten", "fish", "shellfish", "sesame"];
const INTERESTS = ["Baby development", "Mother's body", "Nutrition", "Exercise & movement", "Birth planning", "Newborn basics", "Partner preparation", "Mental & emotional wellbeing"];
const REMINDERS = ["Weekly pregnancy update", "Daily fact", "New lesson", "Due-date preparation", "Hospital-bag reminder", "Weekend family activity"];

function toggle(list: string[], v: string) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(toggle(value, o))}
          className={
            "min-h-9 rounded-full border px-3.5 text-sm font-semibold " +
            (value.includes(o)
              ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-contrast)]"
              : "border-[var(--color-border)] bg-[var(--color-surface)]")
          }
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function PreferencesForm({
  initial,
  showDiet,
}: {
  initial: {
    dietaryPreferences: string[];
    allergies: string[];
    contentPreferences: string[];
    reminders: string[];
  };
  showDiet: boolean;
}) {
  const [diet, setDiet] = useState(initial.dietaryPreferences);
  const [allergies, setAllergies] = useState(initial.allergies);
  const [interests, setInterests] = useState(initial.contentPreferences);
  const [reminders, setReminders] = useState(initial.reminders);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  return (
    <Card>
      <CardTitle>Personalisation & notifications</CardTitle>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
        Foods that name a declared allergy are hidden from your nutrition lists. NestWise avoids
        anxiety-inducing medical notifications.
      </p>

      <div className="mt-5 space-y-5">
        {showDiet && (
          <>
            <div>
              <p className="mb-2 text-sm font-semibold">Dietary preference</p>
              <ChipGroup options={DIET} value={diet} onChange={setDiet} />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">Food allergies / intolerances</p>
              <ChipGroup options={ALLERGIES} value={allergies} onChange={setAllergies} />
            </div>
          </>
        )}
        <div>
          <p className="mb-2 text-sm font-semibold">Content interests</p>
          <ChipGroup options={INTERESTS} value={interests} onChange={setInterests} />
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Notifications</p>
          <ChipGroup options={REMINDERS} value={reminders} onChange={setReminders} />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Button
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              setSaved(false);
              await updatePreferences({
                dietaryPreferences: diet,
                allergies,
                contentPreferences: interests,
                reminders,
              });
              setSaved(true);
            })
          }
        >
          {pending ? "Saving…" : "Save preferences"}
        </Button>
        {saved && <span className="text-sm text-[var(--color-success)]">Saved.</span>}
      </div>
    </Card>
  );
}
