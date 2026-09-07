"use client";

import { useRef, useState, useTransition } from "react";
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
  recordAttempts = true,
  queueMissed,
}: {
  quizSlug: string;
  title: string;
  questions: QuizQuestion[];
  childId?: string;
  recordAttempts?: boolean;
  queueMissed?: (missed: string[]) => Promise<void>;
}) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<"sure" | "unsure" | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [, startTransition] = useTransition();
  const missed = useRef<string[]>([]);
  const confidentMisses = useRef<string[]>([]);

  const q = questions[index];
  const isLast = index === questions.length - 1;

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
  }

  function confirm(level: "sure" | "unsure") {
    if (picked === null || revealed) return;
    setConfidence(level);
    setRevealed(true);
    const correct = picked === q.answerIndex;
    if (correct) setScore((s) => s + 1);
    else {
      missed.current.push(q.prompt);
      if (level === "sure") confidentMisses.current.push(q.prompt);
    }
  }

  function next() {
    if (isLast) {
      setFinished(true);
      if (recordAttempts) {
        startTransition(() => {
          void recordQuizAttempt({
            quizSlug,
            score,
            total: questions.length,
            missed: missed.current,
            confidentMisses: confidentMisses.current,
            childId,
          });
        });
      } else if (queueMissed && missed.current.length) {
        const m = missed.current;
        startTransition(() => void queueMissed(m));
      }
      return;
    }
    setIndex((n) => n + 1);
    setPicked(null);
    setConfidence(null);
    setRevealed(false);
  }

  function restart() {
    setIndex(0);
    setPicked(null);
    setConfidence(null);
    setRevealed(false);
    setScore(0);
    setFinished(false);
    missed.current = [];
    confidentMisses.current = [];
  }

  if (finished) {
    const passPct = Math.round((score / questions.length) * 100);
    const cw = confidentMisses.current.length;
    return (
      <Card className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-accent-strong)]">
          {title}
        </p>
        <p className="mt-2 font-display text-3xl font-bold">
          {score} / {questions.length}
        </p>
        <p className="mt-1 text-[var(--color-ink-soft)]">
          {passPct >= 80
            ? "Nicely done — that's stuck."
            : passPct >= 50
              ? "Good going. A quick re-read of the missed ones will lock it in."
              : "Worth another read of the lesson, then try again."}
        </p>
        {cw > 0 && (
          <p className="mt-2 text-sm font-semibold text-[var(--color-caution)]">
            {cw} you were sure about but got wrong — those jump to the front of your Daily review.
          </p>
        )}
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
        <p className="font-display text-lg font-bold">{q.prompt}</p>
        <div className="mt-4 space-y-2">
          {q.choices.map((choice, i) => {
            const isAnswer = i === q.answerIndex;
            const isPicked = i === picked;
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                disabled={picked !== null}
                className={cn(
                  "flex w-full items-center justify-between gap-2 border-2 p-3 text-left text-sm font-semibold transition-colors [border-radius:14px_10px_13px_11px/11px_13px_10px_14px]",
                  picked === null && "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-graphite)]",
                  picked !== null && !revealed && isPicked && "border-[var(--color-graphite)] bg-[var(--color-accent-surface)]",
                  revealed && isAnswer && "border-[var(--color-success)] bg-[var(--color-success-surface)] text-[var(--color-success)]",
                  revealed && isPicked && !isAnswer && "border-[var(--color-danger)] bg-[var(--color-danger-surface)] text-[var(--color-danger)]",
                  revealed && !isAnswer && !isPicked && "border-[var(--color-border)] opacity-70",
                  picked !== null && !revealed && !isPicked && "border-[var(--color-border)] opacity-60",
                )}
              >
                {choice}
                {revealed && isAnswer && <Check size={16} aria-hidden />}
                {revealed && isPicked && !isAnswer && <X size={16} aria-hidden />}
              </button>
            );
          })}
        </div>

        {picked !== null && !revealed && (
          <div className="mt-4 flex items-center gap-2 border-2 border-[var(--color-border)] bg-[var(--color-surface-muted)] p-2.5 [border-radius:12px]">
            <span className="text-sm font-semibold text-[var(--color-ink)]">How sure are you?</span>
            <Button size="sm" onClick={() => confirm("sure")}>
              Confident
            </Button>
            <Button size="sm" variant="secondary" onClick={() => confirm("unsure")}>
              Not sure
            </Button>
          </div>
        )}

        {revealed && (
          <div className="mt-4 border-2 border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3 text-sm text-[var(--color-ink-soft)] [border-radius:12px]">
            {confidence === "sure" && picked !== q.answerIndex && (
              <span className="mr-1 font-semibold text-[var(--color-caution)]">
                You were confident here —
              </span>
            )}
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
