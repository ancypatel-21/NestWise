import type { ContentBlock } from "@/types";
import { Callout } from "./Callout";

/** Renders the structured block array stored on Content.blocks (PRD §63.10). */
export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  );
}

function BlockView({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <h3 className="text-lg font-bold text-[var(--color-ink)]">{block.text}</h3>
      );
    case "paragraph":
      return <p className="text-[0.95rem] text-[var(--color-ink-soft)]">{block.text}</p>;
    case "list":
      return block.ordered ? (
        <ol className="list-decimal space-y-1.5 pl-5 text-[0.95rem] text-[var(--color-ink-soft)]">
          {block.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ol>
      ) : (
        <ul className="list-disc space-y-1.5 pl-5 text-[0.95rem] text-[var(--color-ink-soft)]">
          {block.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="space-y-2">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-[0.95rem] text-[var(--color-ink-soft)]">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--color-accent-surface)] text-xs font-bold text-[var(--color-accent-strong)]">
                {i + 1}
              </span>
              {it}
            </li>
          ))}
        </ol>
      );
    case "keyvalue":
      return (
        <dl className="grid gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] p-4 sm:grid-cols-2">
          {block.pairs.map((p, i) => (
            <div key={i}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">
                {p.label}
              </dt>
              <dd className="text-sm text-[var(--color-ink)]">{p.value}</dd>
            </div>
          ))}
        </dl>
      );
    case "callout":
      return (
        <Callout tone={block.tone} title={block.title}>
          {block.text}
        </Callout>
      );
    default:
      return null;
  }
}
