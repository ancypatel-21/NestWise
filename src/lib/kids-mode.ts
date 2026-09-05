import { cookies } from "next/headers";

/**
 * "Kid mode" separates the child-facing experience from adult pregnancy/health content
 * (PRD §4.4, §40, §52). It's a lightweight session flag; a PIN-protected exit is a noted
 * future enhancement.
 */
export const KIDS_COOKIE = "nw-kids-mode";

/** Routes a child-facing profile may use. Everything else redirects to /child. */
export const KID_ALLOWED_PREFIXES = [
  "/child/games",
  "/child/quiz",
  "/child/activities",
  "/child/weekend",
  "/child/family-games",
  "/quiz",
];

export async function isKidsMode(): Promise<boolean> {
  const store = await cookies();
  return store.get(KIDS_COOKIE)?.value === "1";
}

export function isKidAllowedPath(pathname: string): boolean {
  if (pathname === "/child" || pathname === "/kids") return true;
  return KID_ALLOWED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}
