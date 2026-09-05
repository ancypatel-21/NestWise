"use client";

import { useState, useTransition } from "react";
import { deleteChild } from "@/lib/actions/children";
import { Button } from "@/components/ui/Button";

export function DeleteChildButton({ childId, name }: { childId: string; name: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-xs font-semibold text-[var(--color-danger)] hover:underline"
      >
        Remove
      </button>
    );
  }

  return (
    <span className="flex items-center gap-2">
      <span className="text-xs text-[var(--color-ink-soft)]">Delete {name}?</span>
      <Button
        variant="danger"
        size="sm"
        disabled={pending}
        onClick={() => start(() => deleteChild(childId))}
      >
        {pending ? "…" : "Yes"}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
        No
      </Button>
    </span>
  );
}
