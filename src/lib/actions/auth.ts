"use server";

import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signIn } from "@/lib/auth";
import { track } from "@/lib/analytics";

export interface AuthFormState {
  error?: string;
}

const signupSchema = z.object({
  displayName: z.string().min(1, "Please enter your name").max(80),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Use at least 8 characters").max(200),
});

export async function signUp(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signupSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists. Try logging in." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await db.user.create({
    data: {
      email,
      passwordHash,
      displayName: parsed.data.displayName,
      // Provisional role; the onboarding flow sets the real one.
      role: "PARENT_CAREGIVER",
    },
  });
  track("account_created", {});

  await signIn("credentials", {
    email,
    password: parsed.data.password,
    redirectTo: "/onboarding",
  });
  return {};
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function logIn(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Enter your email and password." };

  try {
    await signIn("credentials", {
      email: parsed.data.email.toLowerCase(),
      password: parsed.data.password,
      redirectTo: "/home",
    });
    return {};
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Those details didn't match an account." };
    }
    throw err;
  }
}
