"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import type { AuthFormState } from "@/lib/actions/auth";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "One moment…" : label}
    </Button>
  );
}

export function AuthForm({
  mode,
  action,
}: {
  mode: "signup" | "login";
  action: (prev: AuthFormState, data: FormData) => Promise<AuthFormState>;
}) {
  const [state, formAction] = useActionState<AuthFormState, FormData>(action, {});
  const isSignup = mode === "signup";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && <Callout tone="caution" title="Try again">{state.error}</Callout>}

      {isSignup && (
        <Field label="Your name" htmlFor="displayName" required>
          <Input id="displayName" name="displayName" autoComplete="name" required />
        </Field>
      )}

      <Field label="Email" htmlFor="email" required>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>

      <Field
        label="Password"
        htmlFor="password"
        hint={isSignup ? "At least 8 characters." : undefined}
        required
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          required
          minLength={isSignup ? 8 : undefined}
        />
      </Field>

      <SubmitButton label={isSignup ? "Create account" : "Log in"} />

      <p className="text-center text-sm text-[var(--color-ink-soft)]">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[var(--color-accent-strong)]">
              Log in
            </Link>
          </>
        ) : (
          <>
            New to NestWise?{" "}
            <Link href="/signup" className="font-semibold text-[var(--color-accent-strong)]">
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
