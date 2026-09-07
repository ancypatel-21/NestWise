"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Apple,
  BabyIcon,
  BookMarked,
  BookOpen,
  CalendarHeart,
  Dumbbell,
  Gamepad2,
  Home,
  ListChecks,
  type LucideIcon,
  MessageCircleHeart,
  NotebookPen,
  Sparkles,
  Stethoscope,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { IconKey, NavItem } from "./nav-config";

const ICONS: Record<IconKey, LucideIcon> = {
  home: Home,
  journey: CalendarHeart,
  learn: BookOpen,
  ask: MessageCircleHeart,
  nutrition: Apple,
  movement: Dumbbell,
  symptoms: Stethoscope,
  progress: TrendingUp,
  quiz: ListChecks,
  saved: BookMarked,
  bag: NotebookPen,
  labor: BookOpen,
  firstDays: BabyIcon,
  recovery: Stethoscope,
  wellbeing: Sparkles,
  development: TrendingUp,
  activities: Activity,
  games: Gamepad2,
  family: Sparkles,
};

function useIsActive() {
  const pathname = usePathname();
  return (href: string) =>
    pathname === href || (href !== "/home" && pathname.startsWith(href));
}

export function SidebarNav({ items }: { items: NavItem[] }) {
  const isActive = useIsActive();
  return (
    <nav aria-label="Primary" className="flex flex-col gap-1">
      {items.map((item) => {
        const Icon = ICONS[item.icon];
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-3 border-2 px-3 text-sm font-semibold transition-colors [border-radius:14px_10px_13px_11px/11px_13px_10px_14px]",
              active
                ? "border-[var(--color-graphite)] bg-[var(--color-accent-surface)] text-[var(--color-ink)]"
                : "border-transparent text-[var(--color-ink-soft)] hover:border-[var(--color-border)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink)]",
            )}
          >
            <Icon size={18} aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileTabBar({ items }: { items: NavItem[] }) {
  const isActive = useIsActive();
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-[var(--color-border)] bg-[var(--color-surface)] pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      {items.map((item) => {
        const Icon = ICONS[item.icon];
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-[0.65rem] font-semibold",
              active ? "text-[var(--color-accent-strong)]" : "text-[var(--color-ink-faint)]",
            )}
          >
            <Icon size={20} aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
