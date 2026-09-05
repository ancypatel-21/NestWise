/**
 * Minimal product analytics (PRD §55: track events without collecting health/child data).
 * No third-party SDK; events go to the server log. Any key that could carry health or child
 * detail is dropped before recording.
 */
const BLOCKED_KEYS = new Set([
  "symptom",
  "condition",
  "diagnosis",
  "childName",
  "childId",
  "dueDate",
  "notes",
  "question",
  "answer",
  "medication",
]);

export function track(event: string, props: Record<string, unknown> = {}): void {
  const safe: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if (BLOCKED_KEYS.has(k)) continue;
    if (typeof v === "string" && v.length > 64) continue;
    safe[k] = v;
  }
  if (process.env.NODE_ENV !== "test") {
    console.info(`[analytics] ${event}`, safe);
  }
}
