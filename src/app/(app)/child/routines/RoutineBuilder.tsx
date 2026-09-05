"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { saveRoutine } from "@/lib/actions/routines";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";

const PRESETS = ["Feeding", "Sleep", "Bath", "Reading", "Play", "School", "Homework", "Bedtime"];

export function RoutineBuilder({ childId }: { childId: string }) {
  const [title, setTitle] = useState("Bedtime");
  const [items, setItems] = useState<Array<{ label: string; time: string }>>([
    { label: "Bath", time: "18:30" },
    { label: "Story", time: "19:00" },
    { label: "Lights out", time: "19:20" },
  ]);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  function update(i: number, patch: Partial<{ label: string; time: string }>) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  function submit() {
    setSaved(false);
    start(async () => {
      await saveRoutine({ childId, title, items: items.filter((i) => i.label.trim()) });
      setSaved(true);
    });
  }

  return (
    <Card>
      <CardTitle>New routine</CardTitle>
      <div className="mt-3 space-y-4">
        <Field label="Routine name" htmlFor="rname">
          <Select id="rname" value={title} onChange={(e) => setTitle(e.target.value)}>
            {PRESETS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </Select>
        </Field>

        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className="flex gap-2">
              <Input
                aria-label="Step"
                value={it.label}
                onChange={(e) => update(i, { label: e.target.value })}
                placeholder="Step"
              />
              <Input
                aria-label="Time"
                type="time"
                value={it.time}
                onChange={(e) => update(i, { time: e.target.value })}
                className="max-w-[8rem]"
              />
              <button
                type="button"
                aria-label="Remove step"
                onClick={() => setItems((p) => p.filter((_, idx) => idx !== i))}
                className="grid w-10 shrink-0 place-items-center rounded-[var(--radius-md)] text-[var(--color-ink-faint)] hover:text-[var(--color-danger)]"
              >
                <Trash2 size={16} aria-hidden />
              </button>
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setItems((p) => [...p, { label: "", time: "" }])}
          >
            <Plus size={16} aria-hidden /> Add step
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button type="button" onClick={submit} disabled={pending}>
            {pending ? "Saving…" : "Save routine"}
          </Button>
          {saved && <span className="text-sm text-[var(--color-success)]">Saved.</span>}
        </div>
      </div>
    </Card>
  );
}
