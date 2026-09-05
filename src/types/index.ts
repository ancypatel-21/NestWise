import type { Child, PregnancyProfile, Role } from "@prisma/client";

/** The product's three journeys (PRD §3). */
export type Part = 1 | 2 | 3;

export type StageMode =
  | "pregnancy"
  | "birth-countdown"
  | "postpartum"
  | "child"
  | "unset";

/** Resolved "where is this family right now" (PRD §3, §7, §17). */
export interface FamilyStage {
  part: Part;
  mode: StageMode;
  pregnancyWeek?: number;
  approxMonths?: number;
  trimester?: 1 | 2 | 3;
  dueDate?: string;
  daysToDueDate?: number;
  primaryChildId?: string;
  primaryChildName?: string;
  childAgeMonths?: number;
  childStageSlug?: string;
}

export interface Personalization {
  role: Role;
  dietaryPreferences: string[];
  allergies: string[];
  contentPreferences: string[];
  country: string;
  timezone: string;
}

export interface FamilyContext {
  familyId: string;
  role: Role;
  stage: FamilyStage;
  pregnancyProfile: PregnancyProfile | null;
  children: Child[];
  personalization: Personalization;
}

/** Structured content blocks stored in Content.blocks (keeps wording revisable, PRD §63.10). */
export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "callout"; tone: "info" | "caution" | "emergency" | "tip"; title?: string; text: string }
  | { type: "steps"; items: string[] }
  | { type: "keyvalue"; pairs: Array<{ label: string; value: string }> };

export interface QuizQuestion {
  prompt: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
}

export interface Citation {
  title: string;
  href: string;
  source: string;
  reviewedAt?: string | null;
}
