"use client";

import { useEffect, useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import type { GameFormat } from "@prisma/client";
import { buildGame, nextLevel, type BuiltGame, type GameConfig } from "@/lib/games/engine";
import { recordGameProgress } from "@/lib/actions/progress";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/Progress";
import { cn } from "@/lib/utils";

export function GamePlayer({
  gameSlug,
  format,
  config,
  skills,
  startLevel,
  childId,
}: {
  gameSlug: string;
  format: GameFormat;
  config: GameConfig;
  skills: string[];
  startLevel: number;
  childId: string | null;
}) {
  const [level, setLevel] = useState(startLevel);
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [nonce, setNonce] = useState(0);
  // Rounds use Math.random, so build only on the client to avoid an SSR/CSR mismatch.
  const [built, setBuilt] = useState<BuiltGame | null>(null);

  useEffect(() => {
    setBuilt(buildGame(format, config, level));
    setRound(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }, [format, config, level, nonce]);

  if (!built) {
    return (
      <Card>
        <p className="text-center text-sm text-[var(--color-ink-faint)]">Loading game…</p>
      </Card>
    );
  }

  const game: BuiltGame = built;
  const current = game.rounds[round];
  const isLast = round === game.rounds.length - 1;

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (current.correct.includes(i)) setScore((s) => s + 1);
  }

  function advance() {
    if (isLast) {
      setDone(true);
      const finalScore = score;
      const total = game.rounds.length;
      const newLevel = nextLevel(level, finalScore, total);
      if (childId) {
        void recordGameProgress({
          gameSlug,
          childId,
          level: newLevel,
          score: finalScore,
          skillsPracticed: skills,
        });
      }
      return;
    }
    setRound((r) => r + 1);
    setPicked(null);
  }

  function playAgain(nextLvl?: number) {
    setLevel(nextLvl ?? level);
    setRound(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    setNonce((n) => n + 1);
  }

  if (done) {
    const total = game.rounds.length;
    const passed = score >= game.passScore;
    const suggested = nextLevel(level, score, total);
    return (
      <Card className="text-center">
        <p className="text-3xl" aria-hidden>
          {passed ? "🌟" : "💪"}
        </p>
        <p className="mt-2 text-2xl font-extrabold">
          {score} / {total}
        </p>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          {passed
            ? suggested > level
              ? "Great work — the next round will be a little harder."
              : "Nice work!"
            : "Good try — let's play that level again."}
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Button onClick={() => playAgain(suggested)}>
            <RotateCcw size={16} aria-hidden />
            {suggested > level ? `Level ${suggested}` : "Play again"}
          </Button>
          {suggested !== level && (
            <Button variant="secondary" onClick={() => playAgain(level)}>
              Same level
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div>
      <ProgressBar
        value={(round / game.rounds.length) * 100}
        label={`Round ${round + 1} of ${game.rounds.length} · Level ${level}`}
        className="mb-4"
      />
      <Card>
        <p className="text-center text-xl font-bold">{current.prompt}</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {current.options.map((opt, i) => {
            const isCorrect = current.correct.includes(i);
            const isPicked = picked === i;
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                disabled={picked !== null}
                className={cn(
                  "flex min-h-20 flex-col items-center justify-center gap-1 rounded-[var(--radius-lg)] border p-3 text-center text-sm font-bold transition-colors",
                  picked === null &&
                    "border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-muted)]",
                  picked !== null && isCorrect && "border-[var(--color-success)] bg-[var(--color-success-surface)] text-[var(--color-success)]",
                  picked !== null && isPicked && !isCorrect && "border-[var(--color-danger)] bg-[var(--color-danger-surface)] text-[var(--color-danger)]",
                  picked !== null && !isCorrect && !isPicked && "opacity-50",
                )}
              >
                {opt.emoji && <span className="text-2xl" aria-hidden>{opt.emoji}</span>}
                <span>{opt.label}</span>
                {picked !== null && isCorrect && <Check size={16} aria-hidden />}
                {picked !== null && isPicked && !isCorrect && <X size={16} aria-hidden />}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className="mt-4 flex justify-end">
            <Button onClick={advance}>{isLast ? "Finish" : "Next"}</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
