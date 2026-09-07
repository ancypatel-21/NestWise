"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { isJourney, MODE_OVERRIDE_COOKIE } from "@/lib/personalization/mode-override";

/**
 * Manual journey switch from the header dropdown. Passing `null` (or "auto") clears the
 * override so the journey falls back to being derived from due date / child age.
 */
export async function setJourneyOverride(journey: string | null) {
  await requireUser();
  const jar = await cookies();

  if (journey && isJourney(journey)) {
    jar.set(MODE_OVERRIDE_COOKIE, journey, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  } else {
    jar.delete(MODE_OVERRIDE_COOKIE);
  }

  revalidatePath("/", "layout");
}
