"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { KIDS_COOKIE } from "@/lib/kids-mode";

export async function enterKidsMode() {
  (await cookies()).set(KIDS_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 6,
  });
  redirect("/child");
}

export async function exitKidsMode() {
  (await cookies()).delete(KIDS_COOKIE);
  redirect("/child");
}
