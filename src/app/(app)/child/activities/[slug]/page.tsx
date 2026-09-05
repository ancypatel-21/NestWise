import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSessionUser, requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import { Callout } from "@/components/ui/Callout";
import { BookmarkButton } from "@/components/ui/BookmarkButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = await db.activity.findUnique({ where: { slug } });
  return { title: a?.title ?? "Activity" };
}

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireFamilyContext();
  const { slug } = await params;
  const a = await db.activity.findUnique({ where: { slug } });
  if (!a) notFound();

  const user = await getSessionUser();
  const saved = user
    ? await db.bookmark.findUnique({
        where: { userId_refType_refSlug: { userId: user.id, refType: "activity", refSlug: a.slug } },
      })
    : null;

  const back = a.weekend ? "/child/weekend" : "/child/activities";

  return (
    <div>
      <PageHeader
        title={a.title}
        intro={`${a.category} · about ${a.timeMin} minutes`}
        backHref={back}
        backLabel={a.weekend ? "Weekend activities" : "Activities"}
        action={
          <BookmarkButton
            refType="activity"
            refSlug={a.slug}
            title={a.title}
            href={`/child/activities/${a.slug}`}
            initialSaved={!!saved}
          />
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle>Instructions</CardTitle>
          <ol className="mt-2 space-y-2">
            {a.instructions.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-[var(--color-ink-soft)]">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--color-accent-surface)] text-xs font-bold text-[var(--color-accent-strong)]">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>

          <CardTitle className="mt-6">Parent participation</CardTitle>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{a.parentParticipation}</p>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardTitle>At a glance</CardTitle>
            <dl className="mt-2 space-y-2 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">
                  Recommended age
                </dt>
                <dd>{ageLabel(a.ageMinMonths, a.ageMaxMonths)}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">
                  Supervision
                </dt>
                <dd>{a.supervisionLevel}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">
                  Materials
                </dt>
                <dd>{a.materials.length ? a.materials.join(", ") : "None needed"}</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <CardTitle>Skills supported</CardTitle>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--color-ink-soft)]">
              {a.skillsSupported.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Callout tone="caution" className="mt-6" title="Safety considerations">
        <ul className="list-disc space-y-1 pl-5">
          {a.safetyNotes.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </Callout>
    </div>
  );
}

function ageLabel(min: number, max: number) {
  const fmt = (m: number) => (m < 24 ? `${m} mo` : `${Math.floor(m / 12)} yr`);
  return `${fmt(min)} – ${fmt(max)}`;
}
