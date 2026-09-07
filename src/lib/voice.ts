/**
 * Picks a soft female English voice from the browser's speech-synthesis engine.
 * Voices load asynchronously, so callers subscribe via `onVoicesReady`.
 */

// Known female voice names across macOS / iOS / Windows / Chrome engines.
const FEMALE_NAMES = [
  "samantha",
  "victoria",
  "karen",
  "moira",
  "tessa",
  "fiona",
  "serena",
  "allison",
  "ava",
  "susan",
  "zira",
  "hazel",
  "catherine",
  "google uk english female",
  "google us english",
];

export function pickSoftFemaleVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const en = voices.filter((v) => v.lang?.toLowerCase().startsWith("en"));
  const pool = en.length ? en : voices;

  // 1. An explicit "female" in the name.
  const explicit = pool.find((v) => /female/i.test(v.name));
  if (explicit) return explicit;

  // 2. A name from the known-female list.
  const known = pool.find((v) =>
    FEMALE_NAMES.some((n) => v.name.toLowerCase().includes(n)),
  );
  if (known) return known;

  // 3. Fall back to the first English voice (usually the OS default, often female).
  return pool[0] ?? null;
}

/** Runs `cb` once voices are available (immediately if they already are). */
export function onVoicesReady(cb: () => void): () => void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return () => {};
  if (window.speechSynthesis.getVoices().length) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.speechSynthesis.addEventListener("voiceschanged", handler);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", handler);
}
