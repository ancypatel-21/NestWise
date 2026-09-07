import { db } from "@/lib/db";
import { completedSlugs } from "@/lib/content";
import { LEARN_MODULES } from "@/content/learn-modules";
import { slugify } from "@/lib/utils";

export interface ModuleMastery {
  slug: string;
  title: string;
  emoji: string;
  lessonsDone: number;
  lessonsTotal: number;
  quizPct: number | null;
  /** 0–100 blended score: half lessons read, half best quiz result. */
  strength: number;
  band: "New" | "Learning" | "Strong";
}

export interface LearningOverview {
  modules: ModuleMastery[];
  lessonsDone: number;
  lessonsTotal: number;
  overall: number; // % of the curriculum "mastered"
  weakest?: ModuleMastery;
  strongest?: ModuleMastery;
}

/** A simple, explainable picture of how well the learner knows each Learn module. */
export async function learningOverview(userId: string): Promise<LearningOverview> {
  const done = await completedSlugs(userId);
  const attempts = await db.quizAttempt.findMany({
    where: { userId, quizSlug: { startsWith: "learn-" } },
  });

  const bestPct = new Map<string, number>();
  for (const a of attempts) {
    const p = Math.round((a.score / a.total) * 100);
    bestPct.set(a.quizSlug, Math.max(bestPct.get(a.quizSlug) ?? 0, p));
  }

  const modules: ModuleMastery[] = LEARN_MODULES.map((m) => {
    const slugs = m.lessons.map((l) => `${m.slug}--${slugify(l.title)}`);
    const lessonsDone = slugs.filter((s) => done.has(s)).length;
    const lessonsTotal = slugs.length;
    const quizPct = bestPct.has(`learn-${m.slug}`) ? bestPct.get(`learn-${m.slug}`)! : null;
    const strength = Math.round(
      50 * (lessonsTotal ? lessonsDone / lessonsTotal : 0) + 0.5 * (quizPct ?? 0),
    );
    return {
      slug: m.slug,
      title: m.title,
      emoji: m.emoji,
      lessonsDone,
      lessonsTotal,
      quizPct,
      strength,
      band: strength >= 75 ? "Strong" : strength >= 30 ? "Learning" : "New",
    };
  });

  const lessonsDone = modules.reduce((s, m) => s + m.lessonsDone, 0);
  const lessonsTotal = modules.reduce((s, m) => s + m.lessonsTotal, 0);
  const overall = Math.round(
    modules.reduce((s, m) => s + m.strength, 0) / Math.max(modules.length, 1),
  );
  const started = modules.filter((m) => m.strength > 0);
  const weakest = started.length ? [...started].sort((a, b) => a.strength - b.strength)[0] : undefined;
  const strongest = started.length
    ? [...started].sort((a, b) => b.strength - a.strength)[0]
    : undefined;

  return { modules, lessonsDone, lessonsTotal, overall, weakest, strongest };
}
