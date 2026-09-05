/**
 * Data-driven child learning games (PRD §31–§33). Every §31 category is covered by data using one
 * of these generic formats; difficulty scales with the player's level, which itself follows
 * demonstrated ability rather than age alone (PRD §33).
 *
 * PRD §32/§37: game performance is educational only and must never be presented as a medical or
 * developmental assessment.
 */
import type { GameFormat } from "@prisma/client";

export interface GameRound {
  prompt: string;
  /** Options shown to the child. */
  options: GameOption[];
  /** Index/indices into options that count as correct. */
  correct: number[];
}

export interface GameOption {
  label: string;
  emoji?: string;
}

export interface GameConfig {
  /** Pool the engine samples rounds from. Shape depends on format. */
  items: Array<{ label: string; emoji?: string; group?: string; value?: number }>;
  /** Optional per-format hint text for the parent-facing panel. */
  instructions?: string;
}

export interface BuiltGame {
  rounds: GameRound[];
  level: number;
  passScore: number;
}

function sample<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(n, copy.length));
}

/** Rounds and option count grow with level. */
export function roundsForLevel(level: number): number {
  return Math.min(10, 4 + Math.floor(level / 2));
}
export function optionsForLevel(level: number): number {
  return Math.min(6, 3 + Math.floor(level / 2));
}

export function buildGame(
  format: GameFormat,
  config: GameConfig,
  level: number,
): BuiltGame {
  const roundCount = roundsForLevel(level);
  const optionCount = optionsForLevel(level);
  const rounds: GameRound[] = [];

  for (let r = 0; r < roundCount; r++) {
    rounds.push(buildRound(format, config, optionCount));
  }

  return { rounds, level, passScore: Math.ceil(roundCount * 0.7) };
}

function buildRound(
  format: GameFormat,
  config: GameConfig,
  optionCount: number,
): GameRound {
  const { items } = config;

  switch (format) {
    case "COUNT": {
      const [pick] = sample(items, 1);
      const count = pick?.value ?? 1 + Math.floor(Math.random() * 5);
      const answers = new Set<number>([count]);
      while (answers.size < optionCount) {
        answers.add(Math.max(1, count + (Math.floor(Math.random() * 5) - 2)));
      }
      const opts = [...answers].sort(() => Math.random() - 0.5);
      return {
        prompt: `How many ${pick?.label ?? "objects"}? ${(pick?.emoji ?? "⭐").repeat(count)}`,
        options: opts.map((n) => ({ label: String(n) })),
        correct: [opts.indexOf(count)],
      };
    }

    case "PATTERN": {
      const seq = sample(items, 3);
      const next = seq[seq.length % seq.length];
      const distractors = sample(
        items.filter((i) => i.label !== next.label),
        optionCount - 1,
      );
      const opts = [next, ...distractors].sort(() => Math.random() - 0.5);
      return {
        prompt: `What comes next? ${seq.map((s) => s.emoji ?? s.label).join(" ")} …`,
        options: opts.map((o) => ({ label: o.label, emoji: o.emoji })),
        correct: [opts.findIndex((o) => o.label === next.label)],
      };
    }

    case "ODD_ONE_OUT": {
      const groups = [...new Set(items.map((i) => i.group).filter(Boolean))] as string[];
      const mainGroup = groups[Math.floor(Math.random() * groups.length)] ?? undefined;
      const same = sample(items.filter((i) => i.group === mainGroup), optionCount - 1);
      const odd = sample(items.filter((i) => i.group && i.group !== mainGroup), 1)[0] ?? items[0];
      const opts = [...same, odd].sort(() => Math.random() - 0.5);
      return {
        prompt: "Which one does not belong?",
        options: opts.map((o) => ({ label: o.label, emoji: o.emoji })),
        correct: [opts.findIndex((o) => o.label === odd.label)],
      };
    }

    case "MATCH":
    case "MEMORY": {
      const [target] = sample(items, 1);
      const distractors = sample(
        items.filter((i) => i.label !== target.label),
        optionCount - 1,
      );
      const opts = [target, ...distractors].sort(() => Math.random() - 0.5);
      return {
        prompt: `Find the match for: ${target.group ?? target.label}`,
        options: opts.map((o) => ({ label: o.label, emoji: o.emoji })),
        correct: [opts.findIndex((o) => o.label === target.label)],
      };
    }

    case "MCQ": {
      const [target] = sample(items, 1);
      const distractors = sample(
        items.filter((i) => i.label !== target.label),
        optionCount - 1,
      );
      const opts = [target, ...distractors].sort(() => Math.random() - 0.5);
      return {
        prompt: target.group ?? `Which is "${target.label}"?`,
        options: opts.map((o) => ({ label: o.label, emoji: o.emoji })),
        correct: [opts.findIndex((o) => o.label === target.label)],
      };
    }

    case "CHOOSE":
    default: {
      const [target] = sample(items, 1);
      const distractors = sample(
        items.filter((i) => i.label !== target.label),
        optionCount - 1,
      );
      const opts = [target, ...distractors].sort(() => Math.random() - 0.5);
      return {
        prompt: `Tap the ${target.label}`,
        options: opts.map((o) => ({ label: o.label, emoji: o.emoji })),
        correct: [opts.findIndex((o) => o.label === target.label)],
      };
    }
  }
}

export function nextLevel(currentLevel: number, score: number, total: number): number {
  const ratio = total > 0 ? score / total : 0;
  if (ratio >= 0.85) return currentLevel + 1;
  if (ratio < 0.5 && currentLevel > 1) return currentLevel - 1;
  return currentLevel;
}
