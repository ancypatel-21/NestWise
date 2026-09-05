import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "./OnboardingWizard";
import { getSessionUser, getFamilyContext } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Set up your journey" };

export default async function OnboardingPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  // If they already have a resolvable stage, they've onboarded.
  const ctx = await getFamilyContext();
  if (ctx && ctx.stage.mode !== "unset") redirect("/home");

  return (
    <div className="min-h-dvh" data-part="1">
      <OnboardingWizard defaultName={user.displayName} />
    </div>
  );
}
