import { rephrase as llmRephrase, isLlmEnabled, type RephraseStyle } from "./llm";

export type { RephraseStyle };

export interface RephraseResult {
  text: string;
  llmUsed: boolean;
  hint?: string;
}

function sentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Deterministic "simpler": keep the shortest, most declarative sentences and drop asides. */
function simplerFallback(text: string): string {
  const ss = sentences(text)
    .map((s) => s.replace(/\s*\([^)]*\)/g, "").replace(/\s*—[^—]*—\s*/g, " ").trim())
    .filter((s) => s.length > 0)
    .sort((a, b) => a.length - b.length);
  const kept = ss.slice(0, Math.min(2, ss.length));
  return `In short: ${kept.join(" ")}`;
}

/**
 * Rephrase a lesson passage. Uses Claude when available; otherwise a light transform for
 * "simple", and an honest nudge for the styles that really need the model.
 */
export async function rephrasePassage(
  text: string,
  style: RephraseStyle,
  readerContext?: string,
): Promise<RephraseResult> {
  const out = await llmRephrase(text, style, readerContext);
  if (out) return { text: out, llmUsed: true };

  if (style === "simple") {
    return { text: simplerFallback(text), llmUsed: false };
  }
  if (style === "personal") {
    return {
      text: readerContext
        ? `For your situation (${readerContext}), the parts of this that matter most are the practical steps — focus on those and bring anything you're unsure about to your next appointment.\n\n${text}`
        : text,
      llmUsed: false,
      hint: "Turn on the AI tutor (add an ANTHROPIC_API_KEY) for a fully tailored explanation.",
    };
  }
  return {
    text: `Here it is with the key idea first: ${sentences(text)[0] ?? text}\n\n${text}`,
    llmUsed: false,
    hint: "Turn on the AI tutor (add an ANTHROPIC_API_KEY) for a worked example.",
  };
}

export { isLlmEnabled };
