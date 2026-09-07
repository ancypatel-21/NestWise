"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CheckboxRow } from "@/components/ui/Field";
import { cn } from "@/lib/utils";

export function TopicPicker({
  topics,
  initialSelected,
  initialWeak,
}: {
  topics: string[];
  initialSelected: string[];
  initialWeak: boolean;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [weak, setWeak] = useState(initialWeak);

  function toggle(t: string) {
    setSelected((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));
  }

  function generate() {
    const params = new URLSearchParams();
    if (selected.length) params.set("t", selected.join(","));
    if (weak) params.set("weak", "1");
    params.set("go", "1");
    router.push(`/quiz/build?${params.toString()}`);
  }

  return (
    <div className="nw-paper p-5">
      <p className="font-display text-lg font-bold">Pick your topics</p>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
        Choose any topics (or none for a mix). NestWise builds an 8-question quiz on the spot.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {topics.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => toggle(t)}
            className={cn(
              "min-h-9 border-2 px-3 text-sm font-semibold [border-radius:14px_10px_13px_11px/11px_13px_10px_14px]",
              selected.includes(t)
                ? "border-[var(--color-graphite)] bg-[var(--color-accent)] text-[var(--color-accent-contrast)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-soft)]",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <CheckboxRow
          label="Focus on what I've struggled with"
          description="Weights the quiz toward questions you've missed before and topics you've tested least."
          checked={weak}
          onChange={(e) => setWeak(e.target.checked)}
        />
      </div>

      <Button onClick={generate} className="mt-4">
        Generate quiz
      </Button>
    </div>
  );
}
