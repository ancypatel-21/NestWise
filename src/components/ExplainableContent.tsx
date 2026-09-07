"use client";

import { useState } from "react";
import { Lightbulb, Sparkles, User, X } from "lucide-react";
import type { ContentBlock } from "@/types";
import { Callout } from "@/components/ui/Callout";
import { cn } from "@/lib/utils";

type Style = "simple" | "example" | "personal";

const STYLES: { key: Style; label: string; icon: typeof Lightbulb }[] = [
  { key: "simple", label: "Simpler", icon: Sparkles },
  { key: "example", label: "Give an example", icon: Lightbulb },
  { key: "personal", label: "For my situation", icon: User },
];

/** Lesson content where each paragraph can be re-explained by the AI tutor. */
export function ExplainableContent({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) =>
        block.type === "paragraph" ? (
          <ExplainableParagraph key={i} text={block.text} />
        ) : (
          <StaticBlock key={i} block={block} />
        ),
      )}
    </div>
  );
}

function ExplainableParagraph({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState<Style | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function run(s: Style) {
    setStyle(s);
    setLoading(true);
    setResult(null);
    setHint(null);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: "rephrase", text, style: s }),
      });
      const data = await res.json();
      setResult(res.ok ? data.text : (data.error ?? "Couldn't rephrase that."));
      setHint(data.hint ?? null);
    } catch {
      setResult("Couldn't reach the tutor. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="group relative">
      <p className="text-[0.95rem] text-[var(--color-ink-soft)]">
        {text}{" "}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "ml-1 inline-flex items-center gap-1 whitespace-nowrap border border-[var(--color-border)] px-1.5 py-0.5 align-middle text-[0.68rem] font-bold text-[var(--color-accent-strong)] [border-radius:8px] transition-opacity",
            open ? "opacity-100" : "opacity-0 focus:opacity-100 group-hover:opacity-100",
          )}
        >
          <Sparkles size={11} aria-hidden />
          Explain differently
        </button>
      </p>

      {open && (
        <div className="mt-2 border-2 border-[var(--color-graphite)] bg-[var(--color-accent-surface)] p-3 [border-radius:16px_10px_15px_11px/11px_15px_10px_16px]">
          <div className="flex flex-wrap items-center gap-1.5">
            {STYLES.map((s) => (
              <button
                key={s.key}
                onClick={() => run(s.key)}
                className={cn(
                  "inline-flex min-h-8 items-center gap-1 border-2 px-2.5 text-xs font-bold [border-radius:12px_8px_11px_9px/9px_11px_8px_12px]",
                  style === s.key
                    ? "border-[var(--color-graphite)] bg-[var(--color-accent)] text-[var(--color-accent-contrast)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-soft)]",
                )}
              >
                <s.icon size={12} aria-hidden />
                {s.label}
              </button>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                setResult(null);
                setStyle(null);
              }}
              aria-label="Close"
              className="ml-auto text-[var(--color-ink-faint)] hover:text-[var(--color-ink)]"
            >
              <X size={14} aria-hidden />
            </button>
          </div>

          {loading && (
            <p className="mt-2 text-xs text-[var(--color-ink-faint)]">Rephrasing…</p>
          )}
          {result && !loading && (
            <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--color-ink)]">{result}</p>
          )}
          {hint && !loading && (
            <p className="mt-1.5 text-[0.7rem] text-[var(--color-ink-faint)]">{hint}</p>
          )}
        </div>
      )}
    </div>
  );
}

function StaticBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "heading":
      return <h3 className="text-lg font-bold text-[var(--color-ink)]">{block.text}</h3>;
    case "list":
      return block.ordered ? (
        <ol className="list-decimal space-y-1.5 pl-5 text-[0.95rem] text-[var(--color-ink-soft)]">
          {block.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ol>
      ) : (
        <ul className="list-disc space-y-1.5 pl-5 text-[0.95rem] text-[var(--color-ink-soft)]">
          {block.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="space-y-2">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-[0.95rem] text-[var(--color-ink-soft)]">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--color-accent-surface)] text-xs font-bold text-[var(--color-accent-strong)]">
                {i + 1}
              </span>
              {it}
            </li>
          ))}
        </ol>
      );
    case "keyvalue":
      return (
        <dl className="grid gap-2 border-2 border-[var(--color-border)] p-4 [border-radius:14px] sm:grid-cols-2">
          {block.pairs.map((p, i) => (
            <div key={i}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">
                {p.label}
              </dt>
              <dd className="text-sm text-[var(--color-ink)]">{p.value}</dd>
            </div>
          ))}
        </dl>
      );
    case "callout":
      return (
        <Callout tone={block.tone} title={block.title} compact={block.tone !== "emergency"}>
          {block.text}
        </Callout>
      );
    default:
      return null;
  }
}
