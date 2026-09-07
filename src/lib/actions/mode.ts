"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { isOverridableMode, MODE_OVERRIDE_COOKIE } from "@/lib/personalization/mode-override";

/**
 * Manual journey switch from the header dropdown. Passing `null` (or "auto") clears the
 * override so the stage falls back to being derived from due date / child age.
 */
export async function setModeOverride(mode: string | null) {
  await requireUser();
  const jar = await cookies();

  if (mode && isOverridableMode(mode)) {
    jar.set(MODE_OVERRIDE_COOKIE, mode, {
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
