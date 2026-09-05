"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteRoutine, toggleRoutine } from "@/lib/actions/routines";

export function RoutineControls({ id, enabled }: { id: string; enabled: boolean }) {
  const [pending, start] = useTransition();
  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-ink-soft)]">
        <input
          type="checkbox"
          checked={enabled}
          disabled={pending}
          onChange={(e) => start(() => toggleRoutine(id, e.target.checked))}
          className="h-4 w-4 accent-[var(--color-accent)]"
        />
        {enabled ? "On" : "Off"}
      </label>
      <button
        type="button"
        aria-label="Delete routine"
        disabled={pending}
        onClick={() => confirm("Delete this routine?") && start(() => deleteRoutine(id))}
        className="text-[var(--color-ink-faint)] hover:text-[var(--color-danger)]"
      >
        <Trash2 size={15} aria-hidden />
      </button>
    </div>
  );
}
