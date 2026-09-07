import Anthropic from "@anthropic-ai/sdk";

/**
 * The language-model layer for Ask NestWise.
 *
 * NestWise is retrieval-first: every answer is grounded in curated, reviewed content. When an
 * Anthropic API key (or `ant auth login` profile) is available, `generate()` uses Claude to phrase
 * that grounded answer naturally and warmly. When it isn't, callers fall back to a deterministic
 * template so the product still works with zero configuration.
 *
 * The model is instructed to answer ONLY from the supplied context and to defer to a professional
 * when the context doesn't cover the question — it never free-styles medical claims.
 */

const MODEL = "claude-opus-5";

let client: Anthropic | null = null;
function getClient(): Anthropic | null {
  if (client) return client;
  try {
    // Resolves ANTHROPIC_API_KEY, ANTHROPIC_AUTH_TOKEN, or an `ant auth login` profile.
    client = new Anthropic();
    return client;
  } catch {
    return null;
  }
}

export function isLlmEnabled(): boolean {
  return Boolean(
    process.env.ANTHROPIC_API_KEY ||
      process.env.ANTHROPIC_AUTH_TOKEN ||
      process.env.NESTWISE_LLM === "1",
  );
}

export type DetailLevel = "simple" | "standard" | "deep";

export interface GenerateInput {
  question: string;
  context: string;
  safetyGuidance: string;
  detail: DetailLevel;
  stage?: string;
}

const DETAIL_INSTRUCTIONS: Record<DetailLevel, string> = {
  simple:
    "Explain it very simply, as if to someone hearing about this for the first time. Short sentences. One or two key points. Avoid jargon entirely.",
  standard:
    "Give a clear, friendly explanation in 2–4 short paragraphs or a few bullet points. Define any term you introduce.",
  deep:
    "Give a thorough explanation: the what, the why, what usually helps, what to avoid, and what to watch for. Use short paragraphs and bullets. Still plain-language.",
};

/**
 * Returns a natural-language answer grounded in `context`, or null when no model is configured
 * (the caller then uses its deterministic composer).
 */
export async function generate(input: GenerateInput): Promise<string | null> {
  if (!isLlmEnabled()) return null;
  const c = getClient();
  if (!c) return null;

  const system = [
    "You are Ask NestWise, a warm, calm learning tutor for expecting and new parents (pregnancy through age 3).",
    "You are NOT a doctor and you never diagnose. You provide general education and decision support only.",
    "Answer ONLY using the CONTEXT provided by the app. If the context does not clearly cover the question, say so plainly and suggest the right kind of professional to ask — do not guess or invent facts.",
    "Never give medication names or doses. Never imply certainty about an individual's situation.",
    DETAIL_INSTRUCTIONS[input.detail],
    "End with the SAFETY GUIDANCE line exactly as given, on its own paragraph.",
  ].join(" ");

  try {
    const res = await c.messages.create({
      model: MODEL,
      max_tokens: 1200,
      system,
      messages: [
        {
          role: "user",
          content:
            `STAGE: ${input.stage ?? "unknown"}\n\n` +
            `CONTEXT (the only facts you may use):\n${input.context || "(no relevant reviewed content found)"}\n\n` +
            `SAFETY GUIDANCE (include verbatim as the final paragraph):\n${input.safetyGuidance}\n\n` +
            `QUESTION: ${input.question}`,
        },
      ],
    });
    const text = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    return text || null;
  } catch {
    return null;
  }
}
