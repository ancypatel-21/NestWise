import type { AskCategory, SafetyLevel } from "@prisma/client";
import type { Citation } from "@/types";
import { classifyCategory, classifySafety } from "@/lib/safety/classify";
import {
  EMERGENCY_DISCLAIMER,
  MEDICAL_SCOPE_NOTE,
  NO_CONTENT_FALLBACK,
} from "@/lib/safety/constants";
import { retrieve, type RetrievedChunk } from "./retrieve";
import { generate } from "./llm";

export interface AskContext {
  pregnancyWeek?: number;
  childAgeMonths?: number;
  role?: string;
  module?: string;
}

export interface AskResult {
  question: string;
  category: AskCategory;
  safetyLevel: SafetyLevel;
  answer: string;
  citations: Citation[];
  emergency: boolean;
}

function toCitations(chunks: RetrievedChunk[]): Citation[] {
  return chunks.map((c) => ({
    title: c.content.title,
    href: hrefForContent(c.content.contentType, c.content.slug),
    source: c.content.source,
    reviewedAt: c.content.reviewedAt?.toISOString() ?? null,
  }));
}

function hrefForContent(type: string, slug: string): string {
  switch (type) {
    case "SYMPTOM":
      return `/symptoms/${slug}`;
    case "EXERCISE":
      return `/exercise/${slug}`;
    case "FOOD":
      return `/nutrition/${slug}`;
    case "RESOURCE":
      return `/resources#${slug}`;
    case "WEEK_PREGNANCY":
      return `/journey/week/${slug.replace(/\D/g, "")}`;
    default:
      return `/learn/_/${slug}`;
  }
}

const CAUTION_BY_LEVEL: Record<SafetyLevel, string> = {
  LEVEL_1: MEDICAL_SCOPE_NOTE,
  LEVEL_2:
    "This sounds specific to you. The notes below are general education only — please share these symptoms with your midwife, doctor, or your child's clinician, who can assess your situation. Seek care sooner if anything is getting worse quickly.",
  LEVEL_3: EMERGENCY_DISCLAIMER,
};

function composeDeterministic(
  question: string,
  chunks: RetrievedChunk[],
  level: SafetyLevel,
): string {
  if (chunks.length === 0) {
    return `${NO_CONTENT_FALLBACK}\n\n${CAUTION_BY_LEVEL[level]}`;
  }

  const lead =
    level === "LEVEL_3"
      ? "Please read this first: if this is happening right now, contact emergency services or your provider before anything else.\n\n"
      : "";

  const points = chunks
    .flatMap((c) => c.content.keyTakeaways.slice(0, 2))
    .slice(0, 5)
    .map((t) => `• ${t}`)
    .join("\n");

  const summary = chunks[0].content.summary;

  return `${lead}Here's what NestWise's reviewed material covers on this:\n\n${summary}\n\n${points}\n\n${CAUTION_BY_LEVEL[level]}`;
}

/**
 * Full Ask NestWise pipeline (PRD §50):
 * question -> category -> retrieve reviewed content -> compose grounded answer -> safety
 * classification -> caution/escalation -> answer + citations. Persisting the AskLog is the
 * caller's job (server action / route handler) so this stays pure and testable.
 */
export async function answerQuestion(
  question: string,
  ctx: AskContext = {},
): Promise<AskResult> {
  const category = classifyCategory(question, ctx);
  const safetyLevel = classifySafety(question);
  const chunks = await retrieve(question, category);

  const context = chunks
    .map((c) => `## ${c.content.title}\n${c.content.summary}\n- ${c.content.keyTakeaways.join("\n- ")}`)
    .join("\n\n");

  const modelText = await generate({
    prompt: `Answer the family's question using ONLY the context. Question: ${question}`,
    context,
  });

  const answer = modelText
    ? `${modelText}\n\n${CAUTION_BY_LEVEL[safetyLevel]}`
    : composeDeterministic(question, chunks, safetyLevel);

  return {
    question,
    category: category as AskCategory,
    safetyLevel,
    answer,
    citations: toCitations(chunks),
    emergency: safetyLevel === "LEVEL_3",
  };
}
