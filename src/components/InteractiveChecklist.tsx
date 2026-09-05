"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  addChecklistItem,
  deleteChecklistItem,
  toggleChecklistItem,
} from "@/lib/actions/checklists";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/Progress";
import { pct } from "@/lib/utils";

export interface ChecklistItemView {
  id: string;
  label: string;
  category: string;
  checked: boolean;
  custom: boolean;
}

export function InteractiveChecklist({
  checklistId,
  items,
  path,
  addLabel = "Add your own item",
}: {
  checklistId: string;
  items: ChecklistItemView[];
  path: string;
  addLabel?: string;
}) {
  const [optimistic, setOptimistic] = useOptimistic(items);
  const [, start] = useTransition();
  const [newLabel, setNewLabel] = useState("");

  const byCategory = new Map<string, ChecklistItemView[]>();
  for (const it of optimistic)
    byCategory.set(it.category, [...(byCategory.get(it.category) ?? []), it]);

  const done = optimistic.filter((i) => i.checked).length;

  function toggle(id: string, checked: boolean) {
    start(async () => {
      setOptimistic((prev) => prev.map((i) => (i.id === id ? { ...i, checked } : i)));
      await toggleChecklistItem(id, checked, path);
    });
  }

  function add() {
    const label = newLabel.trim();
    if (!label) return;
    setNewLabel("");
    start(async () => {
      await addChecklistItem(checklistId, label, "Custom", path);
    });
  }

  function remove(id: string) {
    start(async () => {
      setOptimistic((prev) => prev.filter((i) => i.id !== id));
      await deleteChecklistItem(id, path);
    });
  }

  return (
    <div>
      <ProgressBar value={pct(done, optimistic.length)} label={`${done}/${optimistic.length} done`} className="mb-4" />

      <div className="space-y-5">
        {[...byCategory.entries()].map(([category, list]) => (
          <div key={category}>
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-[var(--color-ink-faint)]">
              {category}
            </h3>
            <ul className="space-y-1.5">
              {list.map((it) => (
                <li key={it.id}>
                  <label className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                    <input
                      type="checkbox"
                      className="h-5 w-5 shrink-0 accent-[var(--color-accent)]"
                      checked={it.checked}
                      onChange={(e) => toggle(it.id, e.target.checked)}
                    />
                    <span
                      className={
                        "flex-1 text-sm " +
                        (it.checked ? "text-[var(--color-ink-faint)] line-through" : "")
                      }
                    >
                      {it.label}
                    </span>
                    {it.custom && (
                      <button
                        type="button"
                        onClick={() => remove(it.id)}
                        aria-label="Remove item"
                        className="text-[var(--color-ink-faint)] hover:text-[var(--color-danger)]"
                      >
                        <Trash2 size={15} aria-hidden />
                      </button>
                    )}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={addLabel}
          className="min-h-10 flex-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm"
        />
        <Button type="button" onClick={add} size="sm" variant="secondary">
          <Plus size={16} aria-hidden /> Add
        </Button>
      </div>
    </div>
  );
}
