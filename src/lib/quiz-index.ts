import type { QuizQuestion } from "@/types";
import { QUIZZES } from "@/content/quizzes";
import { LEARN_QUIZZES } from "@/content/learn-quizzes";

/** All quiz questions across every quiz, indexed by their prompt text. */
export const QUESTION_BY_PROMPT: Map<string, QuizQuestion> = (() => {
  const map = new Map<string, QuizQuestion>();
  for (const quiz of [...QUIZZES, ...LEARN_QUIZZES]) {
    for (const q of quiz.questions) map.set(q.prompt, q);
  }
  return map;
})();

/** Resolve a list of missed prompt strings to full questions, de-duplicated. */
export function questionsFromPrompts(prompts: string[]): QuizQuestion[] {
  const seen = new Set<string>();
  const out: QuizQuestion[] = [];
  for (const p of prompts) {
    if (seen.has(p)) continue;
    seen.add(p);
    const q = QUESTION_BY_PROMPT.get(p);
    if (q) out.push(q);
  }
  return out;
}
