/**
 * The single swap point for a real language model (PRD §50, §55).
 *
 * Today NestWise composes answers deterministically from retrieved, reviewed content — there is no
 * model call, so answers can never drift from curated sources. To enable a real LLM later:
 *   1. Implement `generate()` to call the Claude API (model: "claude-sonnet-5") with `prompt`.
 *   2. Keep the RAG + safety pipeline in src/lib/ai/answer.ts unchanged — only the final
 *      natural-language phrasing should come from the model, and only grounded in `context`.
 *   3. Never send user-identifying or health data beyond what the user chose to provide (PRD §50).
 */

export interface GenerateInput {
  prompt: string;
  context: string;
}

export function isLlmEnabled(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/**
 * Returns null when no model is configured; callers then use the deterministic composer.
 */
export async function generate(_input: GenerateInput): Promise<string | null> {
  if (!isLlmEnabled()) return null;
  // TODO: wire Anthropic Messages API here. Intentionally not implemented so the app runs
  // key-free and answers stay grounded in curated content.
  return null;
}
