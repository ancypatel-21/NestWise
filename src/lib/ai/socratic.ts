import type { QuizQuestion } from "@/types";
import { LEARN_QUIZZES } from "@/content/learn-quizzes";
import { QUIZZES } from "@/content/quizzes";
import { classifyCategory } from "@/lib/safety/classify";
import { retrieve } from "./retrieve";
import { generate, isLlmEnabled } from "./llm";

export interface SocraticQuestion {
  question: string;
  modelAnswer: string;
  topic: string;
  citations: { title: string; href: string }[];
  llmUsed: boolean;
}

const BANK: { q: QuizQuestion; module: string }[] = [
  ...LEARN_QUIZZES.flatMap((z) => z.questions.map((q) => ({ q, module: z.category }))),
  ...QUIZZES.flatMap((z) => z.questions.map((q) => ({ q, module: z.category }))),
];

function pick<T>(arr: T[]): T | undefined {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Socratic mode: NestWise asks the learner a question first, they answer in their own words,
 * then it gives feedback. Retrieval-grounded; uses Claude for phrasing when available, and a
 * question from the curated bank as the deterministic fallback.
 */
export async function socraticQuestion(
  topic: string | undefined,
  ctx: { pregnancyWeek?: number; childAgeMonths?: number },
): Promise<SocraticQuestion> {
  const label = (topic ?? "").trim();
  const category = classifyCategory(label || "general pregnancy learning", ctx);
  const chunks = await retrieve(label || category, category, 4);
  const citations = chunks.map((c) => ({
    title: c.content.title,
    href: `/learn/_/${c.content.slug}`,
  }));

  // Deterministic seed: a real quiz question near the topic.
  const relevant = label
    ? BANK.filter((b) => b.module.toLowerCase().includes(label.toLowerCase()))
    : [];
  const seed = pick(relevant.length ? relevant : BANK)!;
  const seedModelAnswer = `${seed.q.choices[seed.q.answerIndex]} — ${seed.q.explanation}`;

  if (isLlmEnabled()) {
    const context = chunks
      .map((c) => `## ${c.content.title}\n${c.content.summary}\n- ${c.content.keyTakeaways.join("\n- ")}`)
      .join("\n\n");
    const text = await generate({
      question: `Ask the learner ONE short open question that checks their understanding of "${label || "this stage"}". Do not answer it. Then, on a new line starting with "ANSWER:", give the ideal 2-3 sentence answer, using ONLY the context.`,
      context,
      safetyGuidance: "",
      detail: "standard",
    });
    if (text) {
      const [qPart, ...aParts] = text.split(/\n?ANSWER:\s*/i);
      const modelAnswer = aParts.join(" ").trim() || seedModelAnswer;
      return {
        question: qPart.replace(/^question:\s*/i, "").trim() || seed.q.prompt,
        modelAnswer,
        topic: label || category.toLowerCase(),
        citations,
        llmUsed: true,
      };
    }
  }

  return {
    question: seed.q.prompt,
    modelAnswer: seedModelAnswer,
    topic: label || seed.module,
    citations,
    llmUsed: false,
  };
}

export async function socraticFeedback(input: {
  question: string;
  modelAnswer: string;
  learnerAnswer: string;
}): Promise<{ feedback: string; llmUsed: boolean }> {
  const { question, modelAnswer, learnerAnswer } = input;

  if (isLlmEnabled()) {
    const text = await generate({
      question: `The learner was asked: "${question}". They answered: "${learnerAnswer}". The ideal answer is: "${modelAnswer}". Give warm, specific feedback in 2-4 sentences: what they got right, what to add or correct. Do not be harsh. End with the correct answer stated plainly.`,
      context: modelAnswer,
      safetyGuidance: "",
      detail: "standard",
    });
    if (text) return { feedback: text.trim(), llmUsed: true };
  }

  // Deterministic: light keyword overlap + reveal the model answer.
  const learnerWords = new Set(
    learnerAnswer.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 3),
  );
  const modelWords = modelAnswer
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const hit = modelWords.filter((w) => learnerWords.has(w));
  const overlap = modelWords.length ? hit.length / modelWords.length : 0;

  const opener =
    learnerAnswer.trim().length < 3
      ? "No worries — have a look at the answer and try saying it back in your own words."
      : overlap > 0.25
        ? "Good — you've got the main idea."
        : "Close. You've touched on part of it; here's the fuller picture.";

  return {
    feedback: `${opener}\n\nThe key point: ${modelAnswer}`,
    llmUsed: false,
  };
}

/** For unit tests. */
export const _bankSize = BANK.length;
