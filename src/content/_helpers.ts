import type { ContentType, Role, Stage } from "@prisma/client";
import type { ContentBlock } from "@/types";

/**
 * All seeded educational copy is placeholder scaffolding (PRD §63.8–63.9): it has the right
 * shape and safety framing, but must be replaced with expert-reviewed content before launch.
 */
export const PLACEHOLDER_SOURCE = "Placeholder — pending expert review";

export const TRUSTED_REFS = [
  "https://www.who.int",
  "https://www.nhs.uk",
  "https://www.cdc.gov",
  "https://medlineplus.gov",
];

export interface ContentSeed {
  slug: string;
  title: string;
  contentType: ContentType;
  stage: Stage;
  category: string;
  role?: Role | null;
  pregnancyWeek?: number | null;
  ageMinMonths?: number | null;
  ageMaxMonths?: number | null;
  summary: string;
  blocks: ContentBlock[];
  keyTakeaways: string[];
  source?: string;
  referenceUrls?: string[];
  reviewedAt?: Date | null;
}

export function para(text: string): ContentBlock {
  return { type: "paragraph", text };
}
export function heading(text: string): ContentBlock {
  return { type: "heading", text };
}
export function list(items: string[], ordered = false): ContentBlock {
  return { type: "list", ordered, items };
}
export function steps(items: string[]): ContentBlock {
  return { type: "steps", items };
}
export function callout(
  tone: "info" | "caution" | "emergency" | "tip",
  text: string,
  title?: string,
): ContentBlock {
  return { type: "callout", tone, text, title };
}
export function keyvalue(pairs: Array<{ label: string; value: string }>): ContentBlock {
  return { type: "keyvalue", pairs };
}
