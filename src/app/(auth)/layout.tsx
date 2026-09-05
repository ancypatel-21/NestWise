import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh place-items-center px-5 py-10" data-part="1">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2 text-lg font-extrabold">
          <span className="grid h-9 w-9 place-items-center rounded-[var(--radius-md)] nw-gradient text-lg">
            🪺
          </span>
          NestWise
        </Link>
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)]">
          {children}
        </div>
      </div>
    </div>
  );
}
