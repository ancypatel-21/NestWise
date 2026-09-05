"use client";

import { useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import type { Citation } from "@/types";
import { Button } from "@/components/ui/Button";
import { EmergencyBanner } from "@/components/safety";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { cn } from "@/lib/utils";

interface Turn {
  role: "user" | "assistant";
  text: string;
  citations?: Citation[];
  emergency?: boolean;
  safetyLevel?: "LEVEL_1" | "LEVEL_2" | "LEVEL_3";
}

const SAMPLES = [
  "Why am I feeling tired this week?",
  "What foods contain iron?",
  "What should I pack for the hospital?",
  "How do I burp a newborn?",
];

export function AskChat({ module }: { module?: string }) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  async function ask(question: string) {
    if (!question.trim() || loading) return;
    setTurns((t) => [...t, { role: "user", text: question }]);
    setValue("");
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question, module }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTurns((t) => [
          ...t,
          { role: "assistant", text: data.error ?? "Something went wrong. Please try again." },
        ]);
      } else {
        setTurns((t) => [
          ...t,
          {
            role: "assistant",
            text: data.answer,
            citations: data.citations,
            emergency: data.emergency,
            safetyLevel: data.safetyLevel,
          },
        ]);
      }
    } catch {
      setTurns((t) => [
        ...t,
        { role: "assistant", text: "I can't reach the answer service right now. The Learn and Symptom sections still work without it." },
      ]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => listRef.current?.scrollTo(0, listRef.current.scrollHeight));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <EmergencyBanner />

      <div
        ref={listRef}
        className="max-h-[55vh] space-y-4 overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
      >
        {turns.length === 0 && (
          <div className="py-6 text-center">
            <Sparkles className="mx-auto text-[var(--color-accent-strong)]" aria-hidden />
            <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
              Ask a question about your stage. Answers come from NestWise's reviewed content, with
              sources and a safety check.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {SAMPLES.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-muted)]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {turns.map((turn, i) => (
          <div
            key={i}
            className={cn("flex", turn.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-[var(--radius-lg)] px-4 py-3 text-sm",
                turn.role === "user"
                  ? "bg-[var(--color-accent)] text-[var(--color-accent-contrast)]"
                  : "bg-[var(--color-surface-muted)] text-[var(--color-ink)]",
              )}
            >
              {turn.emergency && (
                <p className="mb-2 rounded-[var(--radius-sm)] bg-[var(--color-danger-surface)] px-2 py-1 text-xs font-bold text-[var(--color-danger)]">
                  Possible emergency — seek immediate help
                </p>
              )}
              <p className="whitespace-pre-wrap">{turn.text}</p>
              {turn.citations && turn.citations.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-semibold text-[var(--color-ink-soft)]">Sources</p>
                  {turn.citations.map((c, ci) => (
                    <SourceBadge
                      key={ci}
                      source={`${c.title} — ${c.source}`}
                      reviewedAt={c.reviewedAt ?? undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <p className="text-sm text-[var(--color-ink-faint)]">NestWise is looking through reviewed content…</p>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(value);
        }}
        className="flex gap-2"
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask about this stage…"
          aria-label="Your question"
          className="min-h-11 flex-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm"
        />
        <Button type="submit" disabled={loading || !value.trim()}>
          <Send size={16} aria-hidden />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}
