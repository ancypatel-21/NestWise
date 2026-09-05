import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "../AuthForm";
import { logIn } from "@/lib/actions/auth";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage() {
  if (await getSessionUser()) redirect("/home");
  return (
    <>
      <h1 className="text-xl font-extrabold tracking-tight">Welcome back</h1>
      <p className="mb-5 mt-1 text-sm text-[var(--color-ink-soft)]">
        Log in to pick up where you left off.
      </p>
      <AuthForm mode="login" action={logIn} />
    </>
  );
}
