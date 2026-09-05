import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser, getFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { answerQuestion } from "@/lib/ai/answer";
import { track } from "@/lib/analytics";

const bodySchema = z.object({
  question: z.string().min(3).max(1000),
  module: z.string().optional(),
});

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
  });

  // Audit (PRD §58). Stored under the user's own account; deletable with the account.
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

  track("ask_answered", { category: result.category, safetyLevel: result.safetyLevel });

  return NextResponse.json(result);
}
