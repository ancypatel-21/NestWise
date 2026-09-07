import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser, getFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { answerQuestion } from "@/lib/ai/answer";
import { weeksToMonths } from "@/lib/personalization/pregnancy";
import { track } from "@/lib/analytics";

const bodySchema = z.object({
  question: z.string().min(3).max(1000),
  module: z.string().optional(),
  detail: z.enum(["simple", "standard", "deep"]).optional(),
});

function stageLabel(ctx: Awaited<ReturnType<typeof getFamilyContext>>): string {
  if (!ctx) return "not set up yet";
  const s = ctx.stage;
  if (s.mode === "pregnancy" && s.pregnancyWeek) return weeksToMonths(s.pregnancyWeek);
  if (s.mode === "birth-countdown") return `about ${s.daysToDueDate ?? 0} days from the due date`;
  if (s.mode === "postpartum") return "the first weeks after birth";
  if (s.mode === "child" && s.childAgeMonths != null) return `child aged ${s.childAgeMonths} months`;
  return "getting started";
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a question." }, { status: 400 });
  }

  const ctx = await getFamilyContext();
  const result = await answerQuestion(parsed.data.question, {
    pregnancyWeek: ctx?.stage.pregnancyWeek,
    childAgeMonths: ctx?.stage.childAgeMonths,
    role: ctx?.role,
    module: parsed.data.module,
    detail: parsed.data.detail,
    stageLabel: stageLabel(ctx),
  });

  // Audit trail. Stored under the user's own account; deletable with the account.
  await db.askLog.create({
    data: {
      userId: user.id,
      question: result.question,
      category: result.category,
      safetyLevel: result.safetyLevel,
      answer: result.answer,
      citations: result.citations as unknown as object,
    },
  });

  track("ask_answered", {
    category: result.category,
    safetyLevel: result.safetyLevel,
    llm: result.llmUsed,
  });

  return NextResponse.json(result);
}
