"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircleHeart } from "lucide-react";

/** Floating button that jumps straight to Ask NestWise. Hidden on the Ask pages themselves. */
export function AskFab() {
  const pathname = usePathname();
  if (pathname === "/ask" || pathname === "/birth/ask") return null;

  return (
    <Link
      href="/ask"
      aria-label="Ask NestWise"
      className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center border-2 border-[var(--color-graphite)] bg-[var(--color-accent)] text-[var(--color-accent-contrast)] [border-radius:50%_46%_52%_48%/48%_52%_46%_50%] [box-shadow:3px_4px_0_rgba(58,50,40,0.28)] transition-transform hover:-translate-y-0.5 hover:rotate-3 lg:bottom-6 lg:right-6 lg:h-16 lg:w-16"
    >
      <MessageCircleHeart size={26} aria-hidden />
      <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-[var(--color-graphite)] bg-[var(--color-accent-3)]" />
    </Link>
  );
}
