import Link from "next/link";
import type { Metadata } from "next";
import { EmergencyBanner } from "@/components/safety";
import { Card, CardTitle } from "@/components/ui/Card";
import { Callout } from "@/components/ui/Callout";
import { EMERGENCY_DISCLAIMER } from "@/lib/safety/constants";

export const metadata: Metadata = { title: "Safety & sources" };

export default function AboutSafetyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12" data-part="1">
      <Link href="/" className="text-sm font-semibold text-[var(--color-accent-strong)]">
        ← Back
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Safety &amp; sources</h1>
      <p className="mt-2 text-[var(--color-ink-soft)]">
        NestWise is a family education companion. It supports decisions; it does not make medical
        ones.
      </p>

      <div className="mt-8 space-y-5">
        <EmergencyBanner />

        <Card>
          <CardTitle>What NestWise is</CardTitle>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-[var(--color-ink-soft)]">
            <li>Stage-based educational content for pregnancy, birth, postpartum and child development.</li>
            <li>General guidance to help you prepare, learn and talk to professionals with more confidence.</li>
            <li>Tools like checklists, quizzes, activities and a private milestone journal.</li>
          </ul>
        </Card>

        <Card>
          <CardTitle>What NestWise is not</CardTitle>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-[var(--color-ink-soft)]">
            <li>Not a diagnosis tool. The Symptom Explorer and Ask NestWise never diagnose.</li>
            <li>Not an emergency service. {EMERGENCY_DISCLAIMER}</li>
            <li>Not a replacement for your midwife, doctor, health visitor or your child's clinician.</li>
          </ul>
        </Card>

        <Card>
          <CardTitle>How Ask NestWise works</CardTitle>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-[var(--color-ink-soft)]">
            <li>Your question is sorted into a topic (pregnancy, birth, postpartum, baby, parenting, general).</li>
            <li>NestWise retrieves the most relevant reviewed content it holds.</li>
            <li>The answer is composed <em>only</em> from that content — it doesn't free-style medical claims.</li>
            <li>A safety check adds cautions, warning signs, or an urgent-help message where needed.</li>
            <li>Sources are shown with every health-related answer.</li>
          </ol>
          <Callout tone="info" className="mt-4">
            If NestWise has no reviewed content on your question, it says so rather than guessing.
          </Callout>
        </Card>

        <Card>
          <CardTitle>Content status</CardTitle>
          <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
            The educational content in this build is clearly-labelled placeholder text with the
            correct structure and safety framing. It has not yet been reviewed by clinicians and
            should not be treated as authoritative. Every health entry shows its source and review
            status.
          </p>
        </Card>

        <Card>
          <CardTitle>Your data</CardTitle>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-[var(--color-ink-soft)]">
            <li>NestWise collects only what a feature needs.</li>
            <li>You can export your data and delete your account or a child's profile at any time in Settings.</li>
            <li>Child-facing areas never show adult pregnancy or health content.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
