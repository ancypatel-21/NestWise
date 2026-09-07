"use client";

import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";

/**
 * "Now you try" — after reading a lesson, NestWise asks one open question. You answer in your
 * own words and get feedback. Same Socratic endpoint as Ask NestWise, scoped to this lesson.
 */
export function LessonCheck({ topic }: { topic: string }) {
  const [phase, setPhase] = useState<"idle" | "question" | "feedback">("idle");
  const [question, setQuestion] = useState("");
  const [modelAnswer, setModelAnswer] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  async function startCheck() {
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: "socratic-question", topic }),
      });
      const data = await res.json();
      if (res.ok) {
        setQuestion(data.question);
        setModelAnswer(data.modelAnswer);
        setPhase("question");
      }
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode: "socratic-feedback",
          socraticQuestion: question,
          modelAnswer,
          learnerAnswer: answer.trim(),
        }),
      });
      const data = await res.json();
      setFeedback(data.feedback ?? modelAnswer);
      setPhase("feedback");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mt-6 nw-paper--alt bg-[var(--color-surface)]">
      <CardTitle className="flex items-center gap-2">
        <GraduationCap size={18} aria-hidden />
        Now you try
      </CardTitle>

      {phase === "idle" && (
        <>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            Answer one question in your own words — the best way to check it's stuck.
          </p>
          <Button size="sm" className="mt-3" onClick={startCheck} disabled={loading}>
            {loading ? "…" : "Ask me a question"}
          </Button>
        </>
      )}

      {phase !== "idle" && (
        <>
          <p className="mt-2 font-semibold text-[var(--color-ink)]">{question}</p>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={3}
            disabled={phase === "feedback"}
            placeholder="Type what you think…"
            className="mt-2 w-full border-2 border-[var(--color-graphite)] bg-[var(--color-surface)] p-2 text-sm [border-radius:12px_9px_11px_10px/10px_11px_9px_12px] disabled:opacity-70"
          />
          {phase === "question" && (
            <div className="mt-2 flex gap-2">
              <Button size="sm" onClick={submit} disabled={loading}>
                {loading ? "Checking…" : "Check my answer"}
              </Button>
              <Button size="sm" variant="ghost" onClick={submit} disabled={loading}>
                Just show me
              </Button>
            </div>
          )}
          {phase === "feedback" && (
            <div className="mt-3 whitespace-pre-wrap border-2 border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3 text-sm text-[var(--color-ink)] [border-radius:12px]">
              {feedback}
            </div>
          )}
        </>
      )}
    </Card>
  );
}
