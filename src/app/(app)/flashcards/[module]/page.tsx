import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { flashcardsForModule } from "@/lib/flashcards";
import { LEARN_MODULES } from "@/content/learn-modules";
import { PageHeader } from "@/components/ui/PageHeader";
import { FlashcardDeck } from "@/components/FlashcardDeck";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ module: string }>;
}): Promise<Metadata> {
  const { module: mod } = await params;
  const meta = LEARN_MODULES.find((m) => m.slug === mod);
  return { title: meta ? `${meta.title} flashcards` : "Flashcards" };
}

export default async function ModuleFlashcardsPage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  await requireFamilyContext();
  const { module: mod } = await params;
  const meta = LEARN_MODULES.find((m) => m.slug === mod);
  const cards = flashcardsForModule(mod);
  if (!meta || cards.length === 0) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title={`${meta.emoji} ${meta.title} flashcards`}
        intro="Tap a card to reveal its key points, then rate how well you knew it."
        backHref="/flashcards"
        backLabel="All flashcards"
      />
      <FlashcardDeck cards={cards} />
    </div>
  );
}
