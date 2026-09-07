"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Send, Sparkles, BookOpen, Baby } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmergencyBanner } from "@/components/safety";
import { cn } from "@/lib/utils";

type Detail = "simple" | "standard" | "deep";

interface Citation {
  title: string;
  href: string;
}

interface Turn {
  role: "user" | "assistant";
  text: string;
  citations?: Citation[];
  followUps?: string[];
  emergency?: boolean;
  grounded?: boolean;
}

const SAMPLES = [
  "Why am I so tired this week?",
  "Which foods are high in iron?",
  "What should I pack for the hospital?",
  "How do I burp a newborn?",
  "Is it normal for my toddler to have tantrums?",
];

const DETAILS: { key: Detail; label: string }[] = [
  { key: "simple", label: "Explain simply" },
  { key: "standard", label: "Standard" },
  { key: "deep", label: "Go deeper" },
];

export function AskChat({ module }: { module?: string }) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [value, setValue] = useState("");
  const [detail, setDetail] = useState<Detail>("standard");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  async function ask(question: string, level: Detail = detail) {
    if (!question.trim() || loading) return;
    setTurns((t) => [...t, { role: "user", text: question }]);
    setValue("");
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question, module, detail: level }),
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
            followUps: data.followUps,
            emergency: data.emergency,
            grounded: true,
          },
        ]);
      }
    } catch {
      setTurns((t) => [
        ...t,
        {
          role: "assistant",
          text: "I can't reach the tutor right now. The Learn, Nutrition and Symptom sections still work without it.",
        },
      ]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => listRef.current?.scrollTo(0, listRef.current.scrollHeight));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <EmergencyBanner />

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">
          Answer style
        </span>
        {DETAILS.map((d) => (
          <button
            key={d.key}
            onClick={() => setDetail(d.key)}
            className={cn(
              "min-h-8 border-2 px-3 text-xs font-bold [border-radius:12px_8px_11px_9px/9px_11px_8px_12px]",
              detail === d.key
                ? "border-[var(--color-graphite)] bg-[var(--color-accent)] text-[var(--color-accent-contrast)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-soft)]",
            )}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div
        ref={listRef}
        className="nw-paper max-h-[55vh] space-y-4 overflow-y-auto p-4"
      >
        {turns.length === 0 && (
          <div className="py-6 text-center">
            <Sparkles className="mx-auto text-[var(--color-accent-strong)]" aria-hidden />
            <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-ink-soft)]">
              Ask anything about your stage. NestWise finds the relevant reviewed lessons, explains
              in plain language, shows its sources, and sends urgent questions straight to real help.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {SAMPLES.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--color-ink-soft)] [border-radius:12px_9px_11px_10px/10px_11px_9px_12px] hover:border-[var(--color-graphite)]"
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
                "max-w-[88%] px-4 py-3 text-sm [border-radius:16px_10px_15px_11px/11px_15px_10px_16px]",
                turn.role === "user"
                  ? "border-2 border-[var(--color-graphite)] bg-[var(--color-accent)] text-[var(--color-accent-contrast)]"
                  : "border-2 border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-ink)]",
              )}
            >
              {turn.emergency && (
                <p className="mb-2 border-2 border-[var(--color-danger)] bg-[var(--color-danger-surface)] px-2 py-1 text-xs font-bold text-[var(--color-danger)] [border-radius:10px]">
                  Possible emergency — seek immediate help
                </p>
              )}
              <p className="whitespace-pre-wrap">{turn.text}</p>

              {turn.citations && turn.citations.length > 0 && (
                <p className="mt-3 flex flex-wrap items-center gap-1 text-xs text-[var(--color-ink-soft)]">
                  <BookOpen size={13} aria-hidden />
                  <span className="font-semibold">Based on:</span>
                  {turn.citations.map((c, ci) => (
                    <span key={ci}>
                      {ci > 0 && <span className="opacity-50"> · </span>}
                      <Link href={c.href} className="nw-underline font-semibold">
                        {c.title}
                      </Link>
                    </span>
                  ))}
                </p>
              )}

              {turn.followUps && turn.followUps.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {turn.followUps.map((f) => (
                    <button
                      key={f}
                      onClick={() => ask(f)}
                      className="border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[0.7rem] font-semibold text-[var(--color-ink-soft)] [border-radius:10px] hover:border-[var(--color-graphite)]"
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <p className="text-sm text-[var(--color-ink-faint)]">
            NestWise is reading the relevant lessons…
          </p>
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
          placeholder="Ask your tutor about this stage…"
          aria-label="Your question"
          className="min-h-11 flex-1 border-2 border-[var(--color-graphite)] bg-[var(--color-surface)] px-4 text-sm [border-radius:14px_9px_13px_10px/10px_13px_9px_14px]"
        />
        <Button type="submit" disabled={loading || !value.trim()}>
          <Send size={16} aria-hidden />
          <span className="sr-only">Send</span>
        </Button>
      </form>

      <p className="flex items-center gap-1.5 text-xs text-[var(--color-ink-faint)]">
        <Baby size={13} aria-hidden />
        Answers are grounded in NestWise's reviewed content and always cite their sources. If
        NestWise doesn't have reviewed material on your question, it will say so rather than guess.
      </p>
    </div>
  );
}
