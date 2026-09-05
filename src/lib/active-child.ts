import { cookies } from "next/headers";
import type { Child } from "@prisma/client";

export const ACTIVE_CHILD_COOKIE = "nw-active-child";

/** Resolve which child the child-facing pages are currently about. Defaults to the youngest. */
export async function resolveActiveChild(children: Child[]): Promise<Child | null> {
  if (children.length === 0) return null;
  const wanted = (await cookies()).get(ACTIVE_CHILD_COOKIE)?.value;
  return children.find((c) => c.id === wanted) ?? children[0];
}
