"use client";

import { useState, useTransition } from "react";
import { Check, PartyPopper, RotateCw, X } from "lucide-react";
import type { QuizQuestion } from "@/types";
import type { Flashcard } from "@/lib/flashcards";
import { cardKey } from "@/lib/flashcards";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/Progress";
import { gradeReview } from "@/lib/actions/review";
import { cn } from "@/lib/utils";

export type ReviewCard =
  | { kind: "question"; prompt: string; question: QuizQuestion }
  | { kind: "flashcard"; card: Flashcard };

export function ReviewDeck({ cards }: { cards: ReviewCard[] }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [right, setRight] = useState(0);
  const [, start] = useTransition();

  const item = cards[i];
  const done = i >= cards.length;

  function record(prompt: string, correct: boolean) {
    if (correct) setRight((r) => r + 1);
    start(() => void gradeReview({ prompt, correct }));
  }

  function nextCard() {
    setI((n) => n + 1);
    setPicked(null);
    setFlipped(false);
  }

  if (done) {
    return (
      <Card className="text-center">
        <PartyPopper className="mx-auto text-[var(--color-accent-strong)]" aria-hidden />
        <p className="mt-2 font-display text-2xl font-bold">
          {right} / {cards.length} right
        </p>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          The ones you knew move to a longer interval. The rest come back sooner.
        </p>
        <ButtonLink href="/home" variant="secondary" className="mt-4">
          Back to home
        </ButtonLink>
      </Card>
    );
  }

  return (
    <div>
      <ProgressBar
        value={(i / cards.length) * 100}
        label={`${i + 1} of ${cards.length} · ${item.kind === "flashcard" ? "flashcard" : "question"}`}
        className="mb-4"
      />

      {item.kind === "question" ? (
        <Card>
          <p className="font-display text-lg font-bold">{item.question.prompt}</p>
          <div className="mt-4 space-y-2">
            {item.question.choices.map((choice, ci) => {
              const isAnswer = ci === item.question.answerIndex;
              const isPicked = ci === picked;
              return (
                <button
                  key={ci}
                  onClick={() => {
                    if (picked !== null) return;
                    setPicked(ci);
                    record(item.prompt, ci === item.question.answerIndex);
                  }}
                  disabled={picked !== null}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 border-2 p-3 text-left text-sm font-semibold transition-colors [border-radius:14px_10px_13px_11px/11px_13px_10px_14px]",
                    picked === null && "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-graphite)]",
                    picked !== null && isAnswer && "border-[var(--color-success)] bg-[var(--color-success-surface)] text-[var(--color-success)]",
                    picked !== null && isPicked && !isAnswer && "border-[var(--color-danger)] bg-[var(--color-danger-surface)] text-[var(--color-danger)]",
                    picked !== null && !isAnswer && !isPicked && "border-[var(--color-border)] opacity-70",
                  )}
                >
                  {choice}
                  {picked !== null && isAnswer && <Check size={16} aria-hidden />}
                  {picked !== null && isPicked && !isAnswer && <X size={16} aria-hidden />}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <>
              <div className="mt-4 border-2 border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3 text-sm text-[var(--color-ink-soft)] [border-radius:12px]">
                {item.question.explanation}
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={nextCard}>
                  {i === cards.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </>
          )}
        </Card>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="nw-paper flex min-h-[14rem] w-full flex-col items-center justify-center gap-3 p-6 text-center"
          >
            {!flipped ? (
              <>
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-strong)]">
                  {item.card.moduleTitle}
                </span>
                <span className="font-display text-xl font-bold">{item.card.front}</span>
                <span className="text-sm text-[var(--color-ink-soft)]">
                  Recall the key points, then tap to flip
                </span>
              </>
            ) : (
              <ul className="w-full list-disc space-y-2 pl-6 text-left text-[0.95rem] text-[var(--color-ink)]">
                {item.card.back.map((b, bi) => (
                  <li key={bi}>{b}</li>
                ))}
              </ul>
            )}
          </button>
          {flipped && (
            <div className="mt-4 flex justify-center gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  record(cardKey(item.card.lessonSlug), false);
                  nextCard();
                }}
              >
                <RotateCw size={16} aria-hidden /> Review again
              </Button>
              <Button
                onClick={() => {
                  record(cardKey(item.card.lessonSlug), true);
                  nextCard();
                }}
              >
                <Check size={16} aria-hidden /> Knew it
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
