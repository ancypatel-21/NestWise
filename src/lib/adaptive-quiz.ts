import type { QuizQuestion } from "@/types";
import { db } from "@/lib/db";
import { QUIZZES } from "@/content/quizzes";
import { LEARN_QUIZZES } from "@/content/learn-quizzes";

interface Candidate {
  q: QuizQuestion;
  module: string;
}

const ALL_CANDIDATES: Candidate[] = [
  ...LEARN_QUIZZES.flatMap((quiz) => quiz.questions.map((q) => ({ q, module: quiz.category }))),
  ...QUIZZES.flatMap((quiz) => quiz.questions.map((q) => ({ q, module: quiz.category }))),
];

export const ADAPTIVE_TOPICS = [...new Set(LEARN_QUIZZES.map((q) => q.category))];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build a quiz on the fly. Pick topics (or leave empty for "anything"), and optionally weight
 * toward what the learner has struggled with — questions they've missed before, then topics
 * they've spent least time on. Adaptive without being complicated.
 */
export async function buildAdaptiveQuiz(
  userId: string,
  topics: string[],
  focusWeak: boolean,
  count = 8,
): Promise<QuizQuestion[]> {
  const pool = topics.length
    ? ALL_CANDIDATES.filter((c) => topics.includes(c.module))
    : ALL_CANDIDATES;

  if (!focusWeak) {
    return dedupe(shuffle(pool).map((c) => c.q)).slice(0, count);
  }

  const [reviewItems, attempts] = await Promise.all([
    db.reviewItem.findMany({ where: { userId }, select: { prompt: true } }),
    db.quizAttempt.findMany({ where: { userId }, select: { missed: true, quizSlug: true } }),
  ]);
  const missedPrompts = new Set([
    ...reviewItems.map((r) => r.prompt),
    ...attempts.flatMap((a) => a.missed),
  ]);
  const seenModules = new Set(
    attempts.map((a) => a.quizSlug.replace(/^learn-/, "")),
  );

  const scored = pool.map((c) => {
    let score = Math.random();
    if (missedPrompts.has(c.q.prompt)) score += 3; // bring back what you got wrong
    if (!seenModules.has(slugish(c.module))) score += 1; // and topics you haven't tested
    return { c, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return dedupe(scored.map((s) => s.c.q)).slice(0, count);
}

function dedupe(qs: QuizQuestion[]): QuizQuestion[] {
  const seen = new Set<string>();
  return qs.filter((q) => (seen.has(q.prompt) ? false : (seen.add(q.prompt), true)));
}

function slugish(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
