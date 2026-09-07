import { ALL_LESSONS, LEARN_MODULES } from "@/content/learn-modules";
import { slugify } from "@/lib/utils";

/**
 * Flashcards are derived from lesson key-takeaways — one card per lesson. Front: the lesson
 * title (recall the key points). Back: its takeaways. Cards share the spaced-repetition engine
 * with quiz review via a "card:<lessonSlug>" key on ReviewItem.
 */
export interface Flashcard {
  lessonSlug: string;
  moduleSlug: string;
  moduleTitle: string;
  front: string;
  back: string[];
}

export const CARD_PREFIX = "card:";
export const cardKey = (lessonSlug: string) => `${CARD_PREFIX}${lessonSlug}`;
export const isCardKey = (k: string) => k.startsWith(CARD_PREFIX);
export const lessonSlugFromCardKey = (k: string) => k.slice(CARD_PREFIX.length);

export function allFlashcards(): Flashcard[] {
  return ALL_LESSONS.map(({ module: m, lesson, slug }) => ({
    lessonSlug: slug,
    moduleSlug: m.slug,
    moduleTitle: m.title,
    front: lesson.title,
    back: lesson.takeaways,
  }));
}

export function flashcardsForModule(moduleSlug: string): Flashcard[] {
  return allFlashcards().filter((c) => c.moduleSlug === moduleSlug);
}

export function flashcardBySlug(lessonSlug: string): Flashcard | undefined {
  return allFlashcards().find((c) => c.lessonSlug === lessonSlug);
}

/** Module list with card counts, for the flashcards index. */
export function flashcardModules() {
  return LEARN_MODULES.map((m) => ({
    slug: m.slug,
    title: m.title,
    emoji: m.emoji,
    count: m.lessons.length,
  }));
}

export { slugify };
