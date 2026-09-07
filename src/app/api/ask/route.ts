import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser, getFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { answerQuestion } from "@/lib/ai/answer";
import { socraticFeedback, socraticQuestion } from "@/lib/ai/socratic";
import { rephrasePassage } from "@/lib/ai/rephrase";
import { weeksToMonths } from "@/lib/personalization/pregnancy";
import { track } from "@/lib/analytics";

const bodySchema = z.object({
  mode: z
    .enum(["answer", "socratic-question", "socratic-feedback", "rephrase"])
    .default("answer"),
  question: z.string().max(1000).optional(),
  module: z.string().optional(),
  detail: z.enum(["simple", "standard", "deep"]).optional(),
  // socratic
  topic: z.string().max(120).optional(),
  socraticQuestion: z.string().max(600).optional(),
  modelAnswer: z.string().max(2000).optional(),
  learnerAnswer: z.string().max(2000).optional(),
  // rephrase
  text: z.string().max(2000).optional(),
  style: z.enum(["simple", "example", "personal"]).optional(),
});

function readerContext(ctx: Awaited<ReturnType<typeof getFamilyContext>>): string {
  if (!ctx) return "";
  const bits: string[] = [];
  const s = ctx.stage;
  if (s.mode === "pregnancy" && s.pregnancyWeek) bits.push(`${s.pregnancyWeek} weeks pregnant`);
  if (s.mode === "child" && s.childAgeMonths != null) bits.push(`child aged ${s.childAgeMonths} months`);
  if (ctx.role === "PARTNER") bits.push("the partner, not the person expecting");
  for (const d of ctx.personalization.dietaryPreferences) bits.push(d.toLowerCase());
  for (const a of ctx.personalization.allergies) bits.push(`${a} allergy`);
  return bits.join(", ");
}

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
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const body = parsed.data;
  const ctx = await getFamilyContext();
  const stageCtx = {
    pregnancyWeek: ctx?.stage.pregnancyWeek,
    childAgeMonths: ctx?.stage.childAgeMonths,
  };

  if (body.mode === "socratic-question") {
    const res = await socraticQuestion(body.topic, stageCtx);
    track("socratic_question", { llm: res.llmUsed });
    return NextResponse.json(res);
  }

  if (body.mode === "rephrase") {
    if (!body.text || !body.style) {
      return NextResponse.json({ error: "Nothing to rephrase." }, { status: 400 });
    }
    const res = await rephrasePassage(
      body.text,
      body.style,
      body.style === "personal" ? readerContext(ctx) : undefined,
    );
    track("rephrase", { style: body.style, llm: res.llmUsed });
    return NextResponse.json(res);
  }

  if (body.mode === "socratic-feedback") {
    if (!body.socraticQuestion || !body.modelAnswer) {
      return NextResponse.json({ error: "Missing question." }, { status: 400 });
    }
    const res = await socraticFeedback({
      question: body.socraticQuestion,
      modelAnswer: body.modelAnswer,
      learnerAnswer: body.learnerAnswer ?? "",
    });
    track("socratic_feedback", { llm: res.llmUsed });
    return NextResponse.json(res);
  }

  // default: answer a question
  if (!body.question || body.question.trim().length < 3) {
    return NextResponse.json({ error: "Please enter a question." }, { status: 400 });
  }
  const result = await answerQuestion(body.question, {
    ...stageCtx,
    role: ctx?.role,
    module: body.module,
    detail: body.detail,
    stageLabel: stageLabel(ctx),
  });

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
