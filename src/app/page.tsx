import Link from "next/link";
import {
  BookOpen,
  HeartHandshake,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
  Baby,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MEDICAL_SCOPE_NOTE } from "@/lib/safety/constants";

const JOURNEY = [
  { emoji: "🤰", title: "Pregnancy", text: "Week-by-week guidance for the person expecting and their partner." },
  { emoji: "🏥", title: "Birth & postpartum", text: "Calm preparation for labour, the hospital, recovery and the first days home." },
  { emoji: "🧸", title: "Child & family", text: "Development, activities, games and parent learning from birth to age 12." },
];

const FEATURES = [
  { icon: BookOpen, title: "Stage-based learning", text: "Short lessons and quizzes matched to your week or your child's age." },
  { icon: MessageCircleHeart, title: "Ask NestWise", text: "Answers grounded in reviewed content, with a clear safety layer." },
  { icon: HeartHandshake, title: "Partner guidance", text: "Concrete ways for partners to help at every stage." },
  { icon: Sparkles, title: "Activities & games", text: "Things to do together that support development without pressure." },
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh" data-part="1">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <span className="flex items-center gap-2 text-lg font-extrabold">
          <span className="grid h-9 w-9 place-items-center rounded-[var(--radius-md)] nw-gradient text-lg">
            🪺
          </span>
          NestWise
        </span>
        <nav className="flex items-center gap-2">
          <Link
            href="/login"
            className="min-h-10 rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
          >
            Log in
          </Link>
          <ButtonLink href="/signup" size="sm">
            Get started
          </ButtonLink>
        </nav>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-5 pb-16 pt-10 text-center sm:pt-16">
          <p className="mx-auto mb-4 w-fit rounded-full bg-[var(--color-accent-surface)] px-3 py-1 text-xs font-semibold text-[var(--color-accent-strong)]">
            Pregnancy → Birth → Newborn → Toddler → Child
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            A family learning companion that grows alongside your family
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--color-ink-soft)]">
            NestWise helps you feel prepared, informed and connected — from the first weeks of
            pregnancy through your child's development to age 12. Warm and educational, never
            clinical or overwhelming.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/signup" size="lg">
              Start your journey
            </ButtonLink>
            <ButtonLink href="/about-safety" size="lg" variant="secondary">
              How NestWise handles safety
            </ButtonLink>
          </div>
          <p className="mx-auto mt-6 flex max-w-xl items-center justify-center gap-2 text-xs text-[var(--color-ink-faint)]">
            <ShieldCheck size={14} aria-hidden />
            {MEDICAL_SCOPE_NOTE}
          </p>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-5 pb-16 sm:grid-cols-3">
          {JOURNEY.map((j) => (
            <Card key={j.title} className="text-center">
              <div className="text-4xl" aria-hidden>
                {j.emoji}
              </div>
              <h2 className="mt-2 text-lg font-bold">{j.title}</h2>
              <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{j.text}</p>
            </Card>
          ))}
        </section>

        <section className="nw-gradient">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <h2 className="text-center text-2xl font-extrabold tracking-tight">
              What you'll find inside
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)]"
                >
                  <f.icon className="text-[var(--color-accent-strong)]" aria-hidden />
                  <h3 className="mt-3 font-bold">{f.title}</h3>
                  <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-16 text-center">
          <Baby className="mx-auto text-[var(--color-accent-strong)]" aria-hidden />
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight">
            Three questions, at every stage
          </h2>
          <p className="mt-2 text-[var(--color-ink-soft)]">
            What is happening right now? What should I know? What can we do together?
          </p>
          <div className="mt-8">
            <ButtonLink href="/signup" size="lg">
              Create your family profile
            </ButtonLink>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--color-border)] py-8 text-center text-xs text-[var(--color-ink-faint)]">
        <p>
          NestWise provides educational information, not medical diagnosis or emergency care.
        </p>
        <p className="mt-1">
          <Link href="/about-safety" className="underline">
            Safety &amp; sources
          </Link>
        </p>
      </footer>
    </div>
  );
}
