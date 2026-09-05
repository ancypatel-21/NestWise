import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/PageHeader";
import { AskChat } from "./AskChat";
import { MedicalScopeNote } from "@/components/safety";

export const metadata: Metadata = { title: "Ask NestWise" };

export default async function AskPage() {
  await requireFamilyContext();
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Ask NestWise"
        intro="Answers are composed only from NestWise's reviewed content and always show their sources. Questions that sound urgent get a clear escalation message instead of guesswork."
      />
      <AskChat />
      <div className="mt-4">
        <MedicalScopeNote />
      </div>
    </div>
  );
}
