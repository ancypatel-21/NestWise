"use client";

import { useState, useTransition } from "react";
import { Check, X, RotateCcw } from "lucide-react";
import type { QuizQuestion } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/Progress";
import { recordQuizAttempt } from "@/lib/actions/progress";
import { cn } from "@/lib/utils";

export function QuizPlayer({
  quizSlug,
  title,
  questions,
  childId,
}: {
  quizSlug: string;
  title: string;
  questions: QuizQuestion[];
  childId?: string;
}) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [, startTransition] = useTransition();

  const q = questions[index];
  const isLast = index === questions.length - 1;

  function choose(i: number) {
    if (revealed) return;
    setPicked(i);
    setRevealed(true);
    if (i === q.answerIndex) setScore((s) => s + 1);
  }

  function next() {
    if (isLast) {
      setFinished(true);
      startTransition(() => {
        void recordQuizAttempt({ quizSlug, score, total: questions.length, childId });
      });
      return;
    }
    setIndex((n) => n + 1);
    setPicked(null);
    setRevealed(false);
  }

  function restart() {
    setIndex(0);
    setPicked(null);
    setRevealed(false);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    const passPct = Math.round((score / questions.length) * 100);
    return (
      <Card className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-accent-strong)]">
          {title}
        </p>
        <p className="mt-2 text-3xl font-extrabold">
          {score} / {questions.length}
        </p>
        <p className="mt-1 text-[var(--color-ink-soft)]">
          {passPct >= 70 ? "Nicely done." : "Worth another read, then try again."}
        </p>
        <Button onClick={restart} variant="secondary" className="mt-4">
          <RotateCcw size={16} aria-hidden /> Try again
        </Button>
      </Card>
    );
  }

  return (
    <div>
      <ProgressBar
        value={((index + (revealed ? 1 : 0)) / questions.length) * 100}
        label={`Question ${index + 1} of ${questions.length}`}
        className="mb-4"
      />
      <Card>
        <p className="text-lg font-bold">{q.prompt}</p>
        <div className="mt-4 space-y-2">
          {q.choices.map((choice, i) => {
            const isAnswer = i === q.answerIndex;
            const isPicked = i === picked;
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={revealed}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-[var(--radius-md)] border p-3 text-left text-sm font-semibold transition-colors",
                  !revealed && "border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-muted)]",
                  revealed && isAnswer && "border-[var(--color-success)] bg-[var(--color-success-surface)] text-[var(--color-success)]",
                  revealed && isPicked && !isAnswer && "border-[var(--color-danger)] bg-[var(--color-danger-surface)] text-[var(--color-danger)]",
                  revealed && !isAnswer && !isPicked && "border-[var(--color-border)] opacity-70",
                )}
              >
                {choice}
                {revealed && isAnswer && <Check size={16} aria-hidden />}
                {revealed && isPicked && !isAnswer && <X size={16} aria-hidden />}
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className="mt-4 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-3 text-sm text-[var(--color-ink-soft)]">
            {q.explanation}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button onClick={next} disabled={!revealed}>
            {isLast ? "See result" : "Next question"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
