import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/nav/AppShell";
import { getSessionUser, getFamilyContext } from "@/lib/auth/session";
import { isKidsMode, isKidAllowedPath } from "@/lib/kids-mode";
import { KidsShell } from "@/components/nav/KidsShell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const ctx = await getFamilyContext();
  if (!ctx || ctx.stage.mode === "unset") redirect("/onboarding");

  const pathname = (await headers()).get("x-pathname") ?? "";

  if (await isKidsMode()) {
    if (!isKidAllowedPath(pathname)) redirect("/child");
    return <KidsShell>{children}</KidsShell>;
  }

  return <AppShell ctx={ctx}>{children}</AppShell>;
}
