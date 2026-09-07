"use client";

import { useState, useTransition } from "react";
import { Check, PartyPopper, X } from "lucide-react";
import type { QuizQuestion } from "@/types";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/Progress";
import { gradeReview } from "@/lib/actions/review";
import { cn } from "@/lib/utils";

export interface ReviewCard {
  prompt: string;
  question: QuizQuestion;
}

export function ReviewDeck({ cards }: { cards: ReviewCard[] }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [right, setRight] = useState(0);
  const [, start] = useTransition();

  const card = cards[i];
  const done = i >= cards.length;

  function choose(choiceIdx: number) {
    if (picked !== null || !card) return;
    setPicked(choiceIdx);
    const correct = choiceIdx === card.question.answerIndex;
    if (correct) setRight((r) => r + 1);
    start(() => {
      void gradeReview({ prompt: card.prompt, correct });
    });
  }

  function next() {
    setI((n) => n + 1);
    setPicked(null);
  }

  if (done) {
    return (
      <Card className="text-center">
        <PartyPopper className="mx-auto text-[var(--color-accent-strong)]" aria-hidden />
        <p className="mt-2 font-display text-2xl font-bold">
          {right} / {cards.length} right
        </p>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          Cards you got right move to a longer interval. The rest will come back sooner.
        </p>
        <ButtonLink href="/home" variant="secondary" className="mt-4">
          Back to home
        </ButtonLink>
      </Card>
    );
  }

  const q = card.question;

  return (
    <div>
      <ProgressBar
        value={(i / cards.length) * 100}
        label={`Card ${i + 1} of ${cards.length}`}
        className="mb-4"
      />
      <Card>
        <p className="font-display text-lg font-bold">{q.prompt}</p>
        <div className="mt-4 space-y-2">
          {q.choices.map((choice, ci) => {
            const isAnswer = ci === q.answerIndex;
            const isPicked = ci === picked;
            return (
              <button
                key={ci}
                onClick={() => choose(ci)}
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
              {q.explanation}
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={next}>{i === cards.length - 1 ? "Finish" : "Next card"}</Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
