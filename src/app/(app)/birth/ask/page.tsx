import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/PageHeader";
import { AskChat } from "../../ask/AskChat";
import { MedicalScopeNote } from "@/components/safety";

export const metadata: Metadata = { title: "Birth questions" };

export default async function BirthAskPage() {
  await requireFamilyContext();
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Birth questions"
        intro="Ask about labour, the hospital, pain options, C-sections or the first hours after delivery. The same safety rules as the main assistant apply."
        backHref="/birth"
        backLabel="Birth preparation"
      />
      <AskChat module="birth" />
      <div className="mt-4">
        <MedicalScopeNote />
      </div>
    </div>
  );
}
