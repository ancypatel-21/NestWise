import { PlayCircle, Youtube } from "lucide-react";

/**
 * A "watch a short video" card. Opens a curated YouTube search for the lesson topic in a new tab,
 * so it never shows a broken embed and always surfaces current, relevant videos.
 */
export function VideoCard({
  query,
  label = "Watch a short video on this",
  minutes,
}: {
  query: string;
  label?: string;
  minutes?: number;
}) {
  const href = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group mt-6 flex items-center gap-4 border-2 border-[var(--color-graphite)] bg-[var(--color-surface)] p-4 [border-radius:20px_12px_18px_14px/14px_18px_12px_20px] [box-shadow:3px_4px_0_rgba(58,50,40,0.13)] transition-transform hover:-translate-y-0.5"
    >
      <span className="grid h-14 w-20 shrink-0 place-items-center border-2 border-[var(--color-graphite)] bg-[var(--color-accent-surface)] [border-radius:12px_8px_11px_9px/9px_11px_8px_12px]">
        <PlayCircle className="text-[var(--color-accent-strong)]" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 font-display text-base font-bold text-[var(--color-ink)]">
          <Youtube size={16} aria-hidden />
          {label}
        </span>
        <span className="block truncate text-xs text-[var(--color-ink-soft)]">
          Opens a YouTube search for “{query}”{minutes ? ` · ~${minutes} min read` : ""}
        </span>
      </span>
    </a>
  );
}
