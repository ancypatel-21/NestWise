import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "../AuthForm";
import { signUp } from "@/lib/actions/auth";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Create your account" };

export default async function SignupPage() {
  if (await getSessionUser()) redirect("/home");
  return (
    <>
      <h1 className="text-xl font-extrabold tracking-tight">Create your family profile</h1>
      <p className="mb-5 mt-1 text-sm text-[var(--color-ink-soft)]">
        A calm, warm space that grows with your family.
      </p>
      <AuthForm mode="signup" action={signUp} />
    </>
  );
}
