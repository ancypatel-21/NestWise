import type { AskCategory, SafetyLevel } from "@prisma/client";
import { classifyCategory, classifySafety } from "@/lib/safety/classify";
import {
  EMERGENCY_DISCLAIMER,
  MEDICAL_SCOPE_NOTE,
  NO_CONTENT_FALLBACK,
} from "@/lib/safety/constants";
import { retrieve, type RetrievedChunk } from "./retrieve";
import { generate, isLlmEnabled, type DetailLevel } from "./llm";

export interface AskContext {
  pregnancyWeek?: number;
  childAgeMonths?: number;
  role?: string;
  module?: string;
  stageLabel?: string;
  detail?: DetailLevel;
}

export interface AskCitation {
  title: string;
  href: string;
}

export interface AskResult {
  question: string;
  category: AskCategory;
  safetyLevel: SafetyLevel;
  answer: string;
  citations: AskCitation[];
  followUps: string[];
  emergency: boolean;
  llmUsed: boolean;
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
    case "BIRTH_TOPIC":
      return `/birth/learn/${slug}`;
    case "POSTPARTUM_TOPIC":
    case "FIRST_DAYS":
      return `/postpartum/topic/${slug}`;
    case "DEVELOPMENT":
      return `/child/timeline/${slug.replace("dev-", "")}`;
    case "LESSON":
      return `/learn/_/${slug}`;
    default:
      return "/learn";
  }
}

function toCitations(chunks: RetrievedChunk[]): AskCitation[] {
  return chunks.map((c) => ({
    title: c.content.title,
    href: hrefForContent(c.content.contentType, c.content.slug),
  }));
}

const CAUTION_BY_LEVEL: Record<SafetyLevel, string> = {
  LEVEL_1: MEDICAL_SCOPE_NOTE,
  LEVEL_2:
    "This sounds specific to you. The notes above are general education only — please share this with your midwife, doctor, or your child's clinician, who can assess your situation. Seek care sooner if anything is getting worse quickly.",
  LEVEL_3: EMERGENCY_DISCLAIMER,
};

function composeDeterministic(chunks: RetrievedChunk[], level: SafetyLevel): string {
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
  return `${lead}Here's what NestWise's reviewed material covers on this:\n\n${chunks[0].content.summary}\n\n${points}\n\n${CAUTION_BY_LEVEL[level]}`;
}

/** A few relevant next questions, drawn from the retrieved topics. */
function buildFollowUps(chunks: RetrievedChunk[], category: AskCategory): string[] {
  const fromContent = chunks
    .slice(0, 3)
    .map((c) => {
      switch (c.content.contentType) {
        case "SYMPTOM":
          return `What are the warning signs with ${c.content.title.toLowerCase()}?`;
        case "EXERCISE":
          return `How do I do "${c.content.title}" safely?`;
        case "FOOD":
          return `What's a good swap for "${c.content.title}"?`;
        default:
          return `Tell me more about ${c.content.title.toLowerCase()}.`;
      }
    });
  const generic: Record<AskCategory, string> = {
    PREGNANCY: "What should I focus on this week?",
    BIRTH: "What can my partner do during labour?",
    POSTPARTUM: "What's normal in the first two weeks after birth?",
    BABY: "What does my baby need most at this age?",
    PARENTING: "How do I handle a toddler tantrum calmly?",
    GENERAL: "What should I learn next?",
  };
  return [...new Set([...fromContent, generic[category]])].slice(0, 3);
}

/**
 * Full Ask NestWise pipeline:
 * question -> category -> retrieve reviewed content -> compose grounded answer (Claude when
 * available, deterministic template otherwise) -> safety classification -> caution/escalation
 * -> answer + citations + suggested follow-ups. Persisting the AskLog is the caller's job.
 */
export async function answerQuestion(
  question: string,
  ctx: AskContext = {},
): Promise<AskResult> {
  const category = classifyCategory(question, ctx) as AskCategory;
  const safetyLevel = classifySafety(question);
  const chunks = await retrieve(question, category);

  const context = chunks
    .map(
      (c) =>
        `## ${c.content.title}\n${c.content.summary}\n- ${c.content.keyTakeaways.join("\n- ")}`,
    )
    .join("\n\n");

  const modelText = await generate({
    question,
    context,
    safetyGuidance: CAUTION_BY_LEVEL[safetyLevel],
    detail: ctx.detail ?? "standard",
    stage: ctx.stageLabel,
  });

  const answer = modelText ?? composeDeterministic(chunks, safetyLevel);

  return {
    question,
    category,
    safetyLevel,
    answer,
    citations: toCitations(chunks),
    followUps: buildFollowUps(chunks, category),
    emergency: safetyLevel === "LEVEL_3",
    llmUsed: Boolean(modelText) && isLlmEnabled(),
  };
}
