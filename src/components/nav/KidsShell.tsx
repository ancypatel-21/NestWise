import Link from "next/link";
import { Gamepad2, Puzzle, Sparkles, Users } from "lucide-react";
import { exitKidsMode } from "@/lib/actions/kids-mode";

const KID_LINKS = [
  { href: "/child/games", label: "Games", icon: Gamepad2 },
  { href: "/child/quiz", label: "Quizzes", icon: Puzzle },
  { href: "/child/activities", label: "Activities", icon: Sparkles },
  { href: "/child/family-games", label: "Family", icon: Users },
];

/** Simplified, contained shell for kid mode — no adult health content is reachable. */
export function KidsShell({ children }: { children: React.ReactNode }) {
  return (
    <div data-part="3" className="min-h-dvh">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link href="/child" className="flex items-center gap-2 text-lg font-extrabold">
          <span className="grid h-9 w-9 place-items-center rounded-[var(--radius-md)] nw-gradient text-lg">
            🦉
          </span>
          NestWise Kids
        </Link>
        <form action={exitKidsMode}>
          <button className="min-h-9 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm font-semibold">
            Grown-up exit
          </button>
        </form>
      </header>

      <nav className="mx-auto flex max-w-4xl flex-wrap gap-2 px-4 pb-4">
        {KID_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex min-h-11 items-center gap-2 rounded-full bg-[var(--color-surface)] px-4 text-sm font-bold shadow-[var(--shadow-soft)]"
          >
            <l.icon size={18} aria-hidden />
            {l.label}
          </Link>
        ))}
      </nav>

      <main id="main" className="mx-auto max-w-4xl px-4 pb-16">
        {children}
      </main>
    </div>
  );
}
