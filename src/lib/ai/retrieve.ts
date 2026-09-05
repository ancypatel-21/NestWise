import type { Content, ContentType, Stage } from "@prisma/client";
import { db } from "@/lib/db";
import type { CategoryKey } from "@/lib/safety/constants";

/** Rough prior on how useful each content type is for a Q&A answer. */
const TYPE_PRIOR: Partial<Record<ContentType, number>> = {
  SYMPTOM: 1.6,
  LESSON: 1.3,
  WEEK_PREGNANCY: 1.2,
  BIRTH_TOPIC: 1.3,
  POSTPARTUM_TOPIC: 1.3,
  FIRST_DAYS: 1.3,
  FOOD: 1.1,
  EXERCISE: 1.1,
  DEVELOPMENT: 1.2,
  PARENT_LEARNING: 1.1,
  DISCIPLINE: 1.1,
  RESOURCE: 0.7,
  FACT: 0.5,
};

const STOP_WORDS = new Set(
  "the a an of to in on for and or is are be my i we our what how why when should can could do does did with at as it this that about".split(
    " ",
  ),
);

const CATEGORY_TO_STAGE: Record<CategoryKey, Stage[]> = {
  PREGNANCY: ["PREGNANCY", "GENERAL"],
  BIRTH: ["BIRTH", "PREGNANCY", "GENERAL"],
  POSTPARTUM: ["POSTPARTUM", "BIRTH", "GENERAL"],
  BABY: ["CHILD", "POSTPARTUM", "GENERAL"],
  PARENTING: ["CHILD", "GENERAL"],
  GENERAL: ["GENERAL", "PREGNANCY", "CHILD", "BIRTH", "POSTPARTUM"],
};

export interface RetrievedChunk {
  content: Content;
  score: number;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
}

/**
 * Keyword / term-frequency retrieval over published curated content (PRD §50). This is the
 * deterministic stand-in for vector search (PRD §55) — swap the body for a pgvector query later
 * without changing callers.
 */
export async function retrieve(
  question: string,
  category: CategoryKey,
  limit = 4,
): Promise<RetrievedChunk[]> {
  const stages = CATEGORY_TO_STAGE[category];
  const pool = await db.content.findMany({
    where: { published: true, stage: { in: stages } },
  });

  const queryTerms = tokenize(question);
  if (queryTerms.length === 0) return [];

  const titleTerms = new Set(queryTerms.filter((t) => t.length >= 4));

  const scored = pool
    .map((content) => {
      const title = content.title.toLowerCase();
      const summary = content.summary.toLowerCase();
      const bodyTokens = tokenize(
        `${content.summary} ${content.keyTakeaways.join(" ")} ${JSON.stringify(content.blocks)}`,
      );
      const counts = new Map<string, number>();
      for (const t of bodyTokens) counts.set(t, (counts.get(t) ?? 0) + 1);

      let score = 0;
      let matchedTerms = 0;
      for (const term of queryTerms) {
        let hit = false;
        if (counts.has(term)) {
          score += 1 + Math.log(counts.get(term)!);
          hit = true;
        }
        if (title.includes(term)) {
          score += titleTerms.has(term) ? 3 : 1.5;
          hit = true;
        }
        if (content.category.toLowerCase().includes(term)) score += 1.2;
        if (summary.includes(term)) score += 0.6;
        if (hit) matchedTerms += 1;
      }
      // Reward breadth of match so a doc hitting many query words beats one hammering a single word.
      score *= 1 + matchedTerms / Math.max(queryTerms.length, 1);
      score *= TYPE_PRIOR[content.contentType] ?? 1;

      return { content, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}
