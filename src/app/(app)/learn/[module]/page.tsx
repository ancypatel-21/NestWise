import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { getSessionUser, requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { completedSlugs } from "@/lib/content";
import { LEARN_MODULES } from "@/content/learn-modules";
import { PageHeader } from "@/components/ui/PageHeader";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ module: string }>;
}): Promise<Metadata> {
  const { module: mod } = await params;
  const meta = LEARN_MODULES.find((m) => m.slug === mod);
  return { title: meta?.title ?? "Module" };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  await requireFamilyContext();
  const { module: modSlug } = await params;
  const meta = LEARN_MODULES.find((m) => m.slug === modSlug);
  if (!meta) notFound();

  const user = await getSessionUser();
  const lessons = await db.content.findMany({
    where: { contentType: "LESSON", category: meta.title, published: true },
  });
  const done = user ? await completedSlugs(user.id) : new Set<string>();

  return (
    <div>
      <PageHeader
        title={`${meta.emoji} ${meta.title}`}
        intro={meta.blurb}
        backHref="/learn"
        backLabel="Learning hub"
      />

      <ol className="space-y-3">
        {lessons.map((lesson, i) => {
          const complete = done.has(lesson.slug);
          return (
            <li key={lesson.id}>
              <Link
                href={`/learn/${meta.slug}/${lesson.slug}`}
                className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)]"
              >
                <span
                  className={
                    "grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold " +
                    (complete
                      ? "bg-[var(--color-success)] text-white"
                      : "bg-[var(--color-accent-surface)] text-[var(--color-accent-strong)]")
                  }
                >
                  {complete ? <Check size={16} aria-hidden /> : i + 1}
                </span>
                <span className="font-semibold">{lesson.title}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
