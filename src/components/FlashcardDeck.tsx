"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, RotateCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/Progress";
import { gradeReview } from "@/lib/actions/review";
import { cardKey, type Flashcard } from "@/lib/flashcards";

export function FlashcardDeck({
  cards,
  doneHref = "/flashcards",
}: {
  cards: Flashcard[];
  doneHref?: string;
}) {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knew, setKnew] = useState(0);
  const [, start] = useTransition();

  const card = cards[i];
  const finished = i >= cards.length;

  function grade(correct: boolean) {
    if (!card) return;
    if (correct) setKnew((k) => k + 1);
    start(() => {
      void gradeReview({ prompt: cardKey(card.lessonSlug), correct });
    });
    setFlipped(false);
    setI((n) => n + 1);
  }

  if (finished) {
    return (
      <Card className="text-center">
        <Sparkles className="mx-auto text-[var(--color-accent-strong)]" aria-hidden />
        <p className="mt-2 font-display text-2xl font-bold">
          {knew} / {cards.length} knew it
        </p>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          The ones you marked “review again” will come back sooner in your Daily review.
        </p>
        <Link
          href={doneHref}
          className="mt-4 inline-block text-sm font-semibold text-[var(--color-accent-strong)] underline"
        >
          Back to flashcards
        </Link>
      </Card>
    );
  }

  return (
    <div>
      <ProgressBar
        value={(i / cards.length) * 100}
        label={`Card ${i + 1} of ${cards.length}`}
        className="mb-4"
      />

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="nw-paper flex min-h-[15rem] w-full flex-col items-center justify-center gap-3 p-6 text-center"
        aria-label={flipped ? "Show question" : "Reveal answer"}
      >
        {!flipped ? (
          <>
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-strong)]">
              {card.moduleTitle}
            </span>
            <span className="font-display text-xl font-bold text-[var(--color-ink)]">
              {card.front}
            </span>
            <span className="text-sm text-[var(--color-ink-soft)]">
              Recall the key points, then tap to flip
            </span>
          </>
        ) : (
          <ul className="w-full list-disc space-y-2 pl-6 text-left text-[0.95rem] text-[var(--color-ink)]">
            {card.back.map((b, bi) => (
              <li key={bi}>{b}</li>
            ))}
          </ul>
        )}
      </button>

      {flipped ? (
        <div className="mt-4 flex justify-center gap-3">
          <Button variant="secondary" onClick={() => grade(false)}>
            <RotateCw size={16} aria-hidden /> Review again
          </Button>
          <Button onClick={() => grade(true)}>
            <Check size={16} aria-hidden /> Knew it
          </Button>
        </div>
      ) : (
        <p className="mt-3 text-center text-xs text-[var(--color-ink-faint)]">
          Tap the card to see the answer
        </p>
      )}
    </div>
  );
}
