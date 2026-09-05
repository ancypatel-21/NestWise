"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Baby, Sparkles, HeartHandshake } from "lucide-react";
import { Stepper } from "@/components/ui/Stepper";
import { Button } from "@/components/ui/Button";
import { Field, Input, CheckboxRow } from "@/components/ui/Field";
import { Card } from "@/components/ui/Card";
import { Callout } from "@/components/ui/Callout";
import { weeksToMonths } from "@/lib/personalization/pregnancy";
import { completeOnboarding, type OnboardingInput } from "@/lib/actions/onboarding";
import { cn } from "@/lib/utils";

type Intent = "expecting" | "arrived" | "parenting";
type RoleKey = "MOTHER" | "PARTNER" | "PARENT_CAREGIVER";

const INTENTS: Array<{ key: Intent; label: string; hint: string; icon: typeof Baby }> = [
  { key: "expecting", label: "We are expecting a baby", hint: "Pregnancy guidance for you and your partner", icon: HeartHandshake },
  { key: "arrived", label: "Our baby has arrived", hint: "Newborn care and the first weeks", icon: Baby },
  { key: "parenting", label: "I want parenting / child-development guidance", hint: "Development, activities and learning", icon: Sparkles },
];

const ROLES: Array<{ key: RoleKey; label: string }> = [
  { key: "MOTHER", label: "Mother" },
  { key: "PARTNER", label: "Partner / Father" },
  { key: "PARENT_CAREGIVER", label: "Parent / Caregiver" },
];

const DIET = ["Omnivore", "Vegetarian", "Vegan", "Pescatarian", "Halal", "Kosher"];
const ALLERGIES = ["peanut", "tree nuts", "milk", "egg", "soy", "wheat/gluten", "fish", "shellfish", "sesame"];
const INTERESTS = ["Baby development", "Mother's body", "Nutrition", "Exercise & movement", "Birth planning", "Newborn basics", "Partner preparation", "Mental & emotional wellbeing"];
const REMINDERS = ["Weekly pregnancy update", "Daily fact", "New lesson", "Due-date preparation"];

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function OnboardingWizard({ defaultName }: { defaultName: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [intent, setIntent] = useState<Intent | null>(null);
  const [role, setRole] = useState<RoleKey | null>(null);
  const [dueMode, setDueMode] = useState<"date" | "week">("date");
  const [dueDate, setDueDate] = useState("");
  const [week, setWeek] = useState<number | "">("");
  const [childName, setChildName] = useState("");
  const [childDob, setChildDob] = useState("");
  const [diet, setDiet] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [reminders, setReminders] = useState<string[]>([]);

  const steps = useMemo(() => {
    const middle = intent === "expecting" ? "Pregnancy" : "Your child";
    return ["Journey", "Role", middle, "Preferences"];
  }, [intent]);

  const canNext = () => {
    if (step === 0) return !!intent;
    if (step === 1) return !!role;
    if (step === 2) {
      if (intent === "expecting") return dueMode === "date" ? !!dueDate : !!week;
      return !!childDob;
    }
    return true;
  };

  function submit() {
    setError(null);
    const payload: OnboardingInput = {
      intent: intent!,
      role: role!,
      dueDateMode: dueMode,
      dueDate: dueDate || undefined,
      currentWeek: week === "" ? undefined : Number(week),
      childName: childName || undefined,
      childDob: childDob || undefined,
      dietaryPreferences: diet,
      allergies,
      contentPreferences: interests,
      reminders,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      country: "US",
    };
    start(async () => {
      try {
        await completeOnboarding(payload);
      } catch (e) {
        // redirect() throws NEXT_REDIRECT which we let the router handle
        if (e && typeof e === "object" && "digest" in e && String((e as { digest: string }).digest).startsWith("NEXT_REDIRECT")) {
          router.push("/home");
          return;
        }
        setError("Something went wrong saving your details. Please try again.");
      }
    });
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-10">
      <div className="mb-8">
        <Stepper steps={steps} current={step} />
      </div>

      {error && <Callout tone="caution" title="Try again">{error}</Callout>}

      {step === 0 && (
        <section aria-labelledby="q1">
          <h1 id="q1" className="text-2xl font-extrabold tracking-tight">
            What brings you to NestWise?
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            This sets your starting point. You can change it later.
          </p>
          <div className="mt-5 grid gap-3">
            {INTENTS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setIntent(opt.key)}
                className={cn(
                  "flex items-center gap-3 rounded-[var(--radius-lg)] border p-4 text-left",
                  intent === opt.key
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-surface)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)]",
                )}
              >
                <opt.icon className="text-[var(--color-accent-strong)]" aria-hidden />
                <span>
                  <span className="block font-bold">{opt.label}</span>
                  <span className="block text-sm text-[var(--color-ink-soft)]">{opt.hint}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 1 && (
        <section aria-labelledby="q2">
          <h1 id="q2" className="text-2xl font-extrabold tracking-tight">
            What is your role?
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            NestWise tailors guidance to your role. Inclusive of different family structures.
          </p>
          <div className="mt-5 grid gap-3">
            {ROLES.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setRole(opt.key)}
                className={cn(
                  "rounded-[var(--radius-lg)] border p-4 text-left font-bold",
                  role === opt.key
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-surface)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)]",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 2 && intent === "expecting" && (
        <section aria-labelledby="q3">
          <h1 id="q3" className="text-2xl font-extrabold tracking-tight">
            Where are you in the pregnancy?
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            Pregnancy content is organised by week — months are only an approximation.
          </p>
          <div className="mt-4 flex gap-2">
            <Button
              type="button"
              variant={dueMode === "date" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setDueMode("date")}
            >
              I know my due date
            </Button>
            <Button
              type="button"
              variant={dueMode === "week" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setDueMode("week")}
            >
              I know my current week
            </Button>
          </div>
          <div className="mt-4">
            {dueMode === "date" ? (
              <Field label="Estimated due date" htmlFor="dueDate">
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </Field>
            ) : (
              <Field
                label="Current pregnancy week"
                htmlFor="week"
                hint={week ? weeksToMonths(Number(week)) : "We'll convert this to an approximate month for you."}
              >
                <Input
                  id="week"
                  type="number"
                  min={1}
                  max={42}
                  value={week}
                  onChange={(e) => setWeek(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </Field>
            )}
          </div>
          <Callout tone="info" className="mt-4">
            Your due date is an estimate. NestWise avoids implying labour will happen on that exact
            day.
          </Callout>
        </section>
      )}

      {step === 2 && intent !== "expecting" && (
        <section aria-labelledby="q3b">
          <h1 id="q3b" className="text-2xl font-extrabold tracking-tight">
            Tell us about your child
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            Only the date of birth is needed. A name or nickname is optional.
          </p>
          <div className="mt-5 grid gap-4">
            <Field label="Name or nickname (optional)" htmlFor="childName">
              <Input
                id="childName"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="e.g. Poppy, or Baby"
              />
            </Field>
            <Field label="Date of birth" htmlFor="childDob" required>
              <Input
                id="childDob"
                type="date"
                value={childDob}
                onChange={(e) => setChildDob(e.target.value)}
              />
            </Field>
          </div>
        </section>
      )}

      {step === 3 && (
        <section aria-labelledby="q4">
          <h1 id="q4" className="text-2xl font-extrabold tracking-tight">
            Optional personalisation
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            Skip anything you'd rather not share. Foods that name an allergy you add are hidden
            from your nutrition lists.
          </p>

          <div className="mt-5 space-y-6">
            <fieldset>
              <legend className="text-sm font-semibold">Dietary preference</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {DIET.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDiet(toggle(diet, d))}
                    className={cn(
                      "min-h-9 rounded-full border px-3.5 text-sm font-semibold",
                      diet.includes(d)
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-contrast)]"
                        : "border-[var(--color-border)] bg-[var(--color-surface)]",
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-semibold">Food allergies / intolerances</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {ALLERGIES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setAllergies(toggle(allergies, d))}
                    className={cn(
                      "min-h-9 rounded-full border px-3.5 text-sm font-semibold",
                      allergies.includes(d)
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-contrast)]"
                        : "border-[var(--color-border)] bg-[var(--color-surface)]",
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-semibold">Content interests</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {INTERESTS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setInterests(toggle(interests, d))}
                    className={cn(
                      "min-h-9 rounded-full border px-3.5 text-sm font-semibold",
                      interests.includes(d)
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-contrast)]"
                        : "border-[var(--color-border)] bg-[var(--color-surface)]",
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold">Reminder preferences</legend>
              {REMINDERS.map((r) => (
                <CheckboxRow
                  key={r}
                  label={r}
                  checked={reminders.includes(r)}
                  onChange={() => setReminders(toggle(reminders, r))}
                />
              ))}
              <p className="text-xs text-[var(--color-ink-faint)]">
                You can change or turn these off any time. NestWise avoids anxiety-inducing medical
                notifications.
              </p>
            </fieldset>
          </div>
        </section>
      )}

      <div className="mt-8 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || pending}
        >
          Back
        </Button>
        {step < 3 ? (
          <Button
            type="button"
            onClick={() => canNext() && setStep((s) => s + 1)}
            disabled={!canNext()}
          >
            Continue
          </Button>
        ) : (
          <Button type="button" onClick={submit} disabled={pending}>
            {pending ? "Setting up…" : "Finish"}
          </Button>
        )}
      </div>

      {step === 3 && (
        <Card className="mt-6 text-center text-sm text-[var(--color-ink-soft)]">
          You can adjust everything later in <strong>Settings</strong>.
        </Card>
      )}
    </div>
  );
}
