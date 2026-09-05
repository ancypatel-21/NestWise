import type { SafetyLevel } from "@prisma/client";
import {
  CATEGORY_KEYWORDS,
  EMERGENCY_PATTERNS,
  PERSONAL_CONCERN_PATTERNS,
  type CategoryKey,
} from "./constants";

/**
 * Route a health-related question to a broad safety level (PRD §51).
 *  - LEVEL_3: any emergency pattern -> prominent "seek immediate help" wording.
 *  - LEVEL_2: personal-symptom phrasing -> cautious info + warning signs + see a professional.
 *  - LEVEL_1: general education.
 * Deliberately conservative: overlapping signals escalate.
 */
export function classifySafety(question: string): SafetyLevel {
  const q = question.trim();
  if (EMERGENCY_PATTERNS.some((re) => re.test(q))) return "LEVEL_3";
  if (PERSONAL_CONCERN_PATTERNS.some((re) => re.test(q))) return "LEVEL_2";
  return "LEVEL_1";
}

/** Broad topic bucket for retrieval + routing (PRD §50). */
export function classifyCategory(
  question: string,
  ctx?: { pregnancyWeek?: number; childAgeMonths?: number },
): CategoryKey {
  const q = question.trim();
  // Order matters: postpartum cues ("after birth", "lochia") should win over the generic
  // "birth" keyword; specific child/parenting cues before the broad pregnancy net.
  for (const key of ["POSTPARTUM", "BIRTH", "BABY", "PARENTING", "PREGNANCY"] as const) {
    if (CATEGORY_KEYWORDS[key].test(q)) return key;
  }
  if (ctx?.pregnancyWeek != null) return "PREGNANCY";
  if (ctx?.childAgeMonths != null) return ctx.childAgeMonths < 18 ? "BABY" : "PARENTING";
  return "GENERAL";
}

export function safetyLevelLabel(level: SafetyLevel): string {
  return {
    LEVEL_1: "General education",
    LEVEL_2: "Personal health concern",
    LEVEL_3: "Possible emergency",
  }[level];
}
