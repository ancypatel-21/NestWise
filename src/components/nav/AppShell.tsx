import Link from "next/link";
import { cookies } from "next/headers";
import { Search, Settings } from "lucide-react";
import type { FamilyContext } from "@/types";
import { availableModes, MODE_OVERRIDE_COOKIE } from "@/lib/personalization/mode-override";
import { mobileNavForStage, navForStage } from "./nav-config";
import { MobileTabBar, SidebarNav } from "./NavLinks";
import { ModeSwitcher } from "./ModeSwitcher";
import { StagePill } from "./StagePill";
import { AskFab } from "./AskFab";

const PART_LABEL: Record<number, string> = {
  1: "Pregnancy",
  2: "Birth & Postpartum",
  3: "Child & Family",
};

export async function AppShell({
  ctx,
  children,
}: {
  ctx: FamilyContext;
  children: React.ReactNode;
}) {
  const items = navForStage(ctx.stage);
  const mobileItems = mobileNavForStage(ctx.stage);
  const modeOptions = availableModes(ctx.pregnancyProfile, ctx.children);
  const overrideActive = !!(await cookies()).get(MODE_OVERRIDE_COOKIE)?.value;

  return (
    <div data-part={ctx.stage.part} className="min-h-dvh">
      <a href="#main" className="nw-skip-link">
        Skip to content
      </a>

      <div className="mx-auto flex max-w-[1400px] gap-6 px-4 lg:px-8">
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-6 py-6 lg:flex">
          <Link href="/home" className="flex items-center gap-2 px-2">
            <span className="grid h-9 w-9 place-items-center rounded-[var(--radius-md)] nw-gradient text-lg">
              🪺
            </span>
            <span className="text-lg font-extrabold tracking-tight">NestWise</span>
          </Link>
          <span className="px-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">
            {PART_LABEL[ctx.stage.part]}
          </span>
          <SidebarNav items={items} />
          <div className="mt-auto flex flex-col gap-1">
            <Link
              href="/search"
              className="flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] px-3 text-sm font-semibold text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-muted)]"
            >
              <Search size={18} aria-hidden /> Search
            </Link>
            <Link
              href="/settings"
              className="flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] px-3 text-sm font-semibold text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-muted)]"
            >
              <Settings size={18} aria-hidden /> Settings
            </Link>
          </div>
        </aside>

        <div className="min-w-0 flex-1 pb-24 pt-4 lg:pb-10 lg:pt-6">
          <header className="mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 lg:hidden">
              <span className="grid h-8 w-8 place-items-center rounded-[var(--radius-md)] nw-gradient">
                🪺
              </span>
              <span className="font-extrabold">NestWise</span>
            </div>
            <StagePill stage={ctx.stage} />
            <div className="flex items-center gap-2">
              <ModeSwitcher
                current={ctx.stage.mode}
                options={modeOptions}
                overrideActive={overrideActive}
              />
              <Link
                href="/search"
                aria-label="Search"
                className="grid h-10 w-10 place-items-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] lg:hidden"
              >
                <Search size={18} aria-hidden />
              </Link>
              <Link
                href="/settings"
                aria-label="Settings"
                className="grid h-10 w-10 place-items-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] lg:hidden"
              >
                <Settings size={18} aria-hidden />
              </Link>
            </div>
          </header>

          <main id="main">{children}</main>
        </div>
      </div>

      <MobileTabBar items={mobileItems} />
      <AskFab />
    </div>
  );
}
