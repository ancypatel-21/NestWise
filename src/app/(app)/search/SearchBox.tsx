"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { SearchHit } from "@/app/api/search/route";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

export function SearchBox() {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    clearTimeout(timer.current);
    if (q.trim().length < 2) {
      setHits([]);
      return;
    }
    setLoading(true);
    setTouched(true);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setHits(data.hits ?? []);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer.current);
  }, [q]);

  return (
    <div>
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]"
          aria-hidden
        />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search weeks, symptoms, lessons, foods, activities, games…"
          aria-label="Search NestWise"
          className="min-h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] pl-11 pr-4 text-[0.95rem]"
        />
      </div>

      <div className="mt-6 space-y-2">
        {loading && <p className="text-sm text-[var(--color-ink-faint)]">Searching…</p>}
        {!loading && touched && hits.length === 0 && q.trim().length >= 2 && (
          <EmptyState title="No matches">Try a different word.</EmptyState>
        )}
        {hits.map((h, i) => (
          <Link
            key={i}
            href={h.href}
            className="flex items-start justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
          >
            <span>
              <span className="block font-semibold">{h.title}</span>
              <span className="block text-sm text-[var(--color-ink-soft)]">{h.snippet}</span>
            </span>
            <Badge>{h.kind}</Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
