"use client";

import { useState, useTransition } from "react";
import { deleteAccount } from "@/lib/actions/settings";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";

export function DangerZone() {
  const [confirming, setConfirming] = useState(false);
  const [text, setText] = useState("");
  const [pending, start] = useTransition();

  return (
    <Card className="border-[color-mix(in_srgb,var(--color-danger)_35%,transparent)]">
      <CardTitle>Delete account</CardTitle>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
        Permanently deletes your account and, if you're the only member, your whole family — including
        every child profile, journal entry, routine and saved item. This cannot be undone. Export
        your data first if you want a copy.
      </p>

      {!confirming ? (
        <Button variant="secondary" className="mt-4" onClick={() => setConfirming(true)}>
          Delete my account
        </Button>
      ) : (
        <div className="mt-4 space-y-3">
          <label className="block text-sm font-semibold">
            Type <span className="font-mono">DELETE</span> to confirm
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-1 min-h-10 w-full max-w-xs rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm"
            />
          </label>
          <div className="flex gap-2">
            <Button
              variant="danger"
              disabled={text !== "DELETE" || pending}
              onClick={() => start(() => deleteAccount())}
            >
              {pending ? "Deleting…" : "Permanently delete"}
            </Button>
            <Button variant="ghost" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
