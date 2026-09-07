/**
 * Simple hand-drawn, gently animated figures for the movement library — a visual cue for how
 * each exercise looks. Line art in the sketchbook style; animation respects reduced-motion.
 */
export type FigureKind =
  | "walk"
  | "catcow"
  | "squat"
  | "stretch"
  | "breathe"
  | "leglift"
  | "wallpush"
  | "pelvicfloor";

/** Map an exercise slug to the closest figure. */
export function figureForSlug(slug: string): FigureKind {
  if (slug.includes("walk")) return "walk";
  if (slug.includes("cat-cow") || slug.includes("pelvic-tilt")) return "catcow";
  if (slug.includes("squat")) return "squat";
  if (slug.includes("stretch") || slug.includes("hamstring")) return "stretch";
  if (slug.includes("breathing") || slug.includes("relax")) return "breathe";
  if (slug.includes("leg-lift") || slug.includes("side-lying")) return "leglift";
  if (slug.includes("wall-push") || slug.includes("push-up")) return "wallpush";
  if (slug.includes("pelvic-floor")) return "pelvicfloor";
  if (slug.includes("flow") || slug.includes("routine")) return "catcow";
  return "breathe";
}

const S = {
  stroke: "currentColor",
  strokeWidth: 5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

function head(cx: number, cy: number, r = 11) {
  return <circle cx={cx} cy={cy} r={r} {...S} />;
}

/** Rounded belly for the pregnant figure. */
function belly(cx: number, cy: number, className?: string) {
  return <circle className={className} cx={cx} cy={cy} r={13} {...S} />;
}

function Figures({ kind }: { kind: FigureKind }) {
  switch (kind) {
    case "walk":
      return (
        <svg viewBox="0 0 160 160" role="img" aria-label="Figure walking">
          {head(70, 34)}
          <path d="M70 45 L70 92" {...S} />
          {belly(83, 70)}
          <path className="nw-fig-anim arm" d="M70 55 L92 66" {...S} />
          <path className="nw-fig-anim leg-front" d="M70 92 L86 132" {...S} />
          <path className="nw-fig-anim leg-back" d="M70 92 L54 132" {...S} />
          <path d="M18 140 L142 140" {...S} strokeWidth={4} opacity={0.4} />
        </svg>
      );
    case "catcow":
      return (
        <svg viewBox="0 0 160 160" role="img" aria-label="Figure on hands and knees, arching the back">
          {head(40, 74)}
          <path className="nw-fig-anim spine" d="M50 78 Q92 58 128 78" {...S} />
          {belly(92, 92, "nw-fig-anim spine")}
          <path d="M52 80 L52 122" {...S} />
          <path d="M124 80 L124 122" {...S} />
          <path d="M30 124 L140 124" {...S} strokeWidth={4} opacity={0.4} />
        </svg>
      );
    case "squat":
      return (
        <svg viewBox="0 0 160 160" role="img" aria-label="Figure squatting">
          <g className="nw-fig-anim body">
            {head(80, 30)}
            <path d="M80 41 L80 82" {...S} />
            {belly(94, 62)}
            <path d="M80 52 L104 52" {...S} />
          </g>
          <path d="M80 90 L58 128" {...S} />
          <path d="M80 90 L102 128" {...S} />
          <path d="M24 138 L136 138" {...S} strokeWidth={4} opacity={0.4} />
        </svg>
      );
    case "stretch":
      return (
        <svg viewBox="0 0 160 160" role="img" aria-label="Seated figure stretching forward">
          <g className="nw-fig-anim torso">
            {head(60, 44)}
            <path d="M60 55 L60 96" {...S} />
            {belly(74, 78)}
            <path d="M60 66 L96 84" {...S} />
          </g>
          <path d="M60 100 L120 100" {...S} />
          <path d="M120 100 L120 116" {...S} />
          <path d="M28 122 L134 122" {...S} strokeWidth={4} opacity={0.4} />
        </svg>
      );
    case "breathe":
      return (
        <svg viewBox="0 0 160 160" role="img" aria-label="Seated figure breathing slowly">
          {head(80, 34)}
          <path d="M80 45 L80 104" {...S} />
          {belly(80, 78, "nw-fig-anim belly")}
          <path d="M80 58 L54 74" {...S} />
          <path d="M80 58 L106 74" {...S} />
          <path d="M56 104 L104 104" {...S} />
          <path d="M28 118 L132 118" {...S} strokeWidth={4} opacity={0.4} />
        </svg>
      );
    case "leglift":
      return (
        <svg viewBox="0 0 160 160" role="img" aria-label="Side-lying figure lifting the top leg">
          {head(36, 84)}
          <path d="M46 88 L96 96" {...S} />
          {belly(78, 86)}
          <path d="M96 96 L138 108" {...S} />
          <path className="nw-fig-anim top-leg" d="M96 96 L136 88" {...S} />
          <path d="M22 122 L146 122" {...S} strokeWidth={4} opacity={0.4} />
        </svg>
      );
    case "wallpush":
      return (
        <svg viewBox="0 0 160 160" role="img" aria-label="Figure doing a standing push-up against a wall">
          <path d="M126 24 L126 140" {...S} strokeWidth={5} opacity={0.5} />
          <g className="nw-fig-anim push-arm">
            {head(64, 40)}
            <path d="M64 51 L64 100" {...S} />
            {belly(78, 74)}
            <path d="M64 60 L112 58" {...S} />
          </g>
          <path d="M64 100 L52 138" {...S} />
          <path d="M64 100 L78 138" {...S} />
        </svg>
      );
    case "pelvicfloor":
      return (
        <svg viewBox="0 0 160 160" role="img" aria-label="Seated figure practising pelvic-floor lifts">
          {head(80, 34)}
          <path d="M80 45 L80 100" {...S} />
          {belly(80, 74)}
          <path d="M80 58 L56 72" {...S} />
          <path d="M80 58 L104 72" {...S} />
          <path d="M52 100 L108 100" {...S} />
          <path className="nw-fig-anim lift-mark" d="M80 118 L80 100 M72 108 L80 100 L88 108" {...S} strokeWidth={4} />
          <path d="M26 118 L134 118" {...S} strokeWidth={4} opacity={0.4} />
        </svg>
      );
  }
}

export function ExerciseFigure({
  kind,
  compact = false,
}: {
  kind: FigureKind;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div
        className="nw-fig grid h-full w-full place-items-center border-2 border-[var(--color-graphite)] bg-[var(--color-accent-surface)] p-2 [border-radius:16px_10px_15px_11px/11px_15px_10px_16px]"
        data-kind={kind}
      >
        <Figures kind={kind} />
      </div>
    );
  }
  return (
    <div
      className="nw-fig nw-paper mx-auto grid aspect-square w-full max-w-[220px] place-items-center bg-[var(--color-accent-surface)] p-4"
      data-kind={kind}
    >
      <Figures kind={kind} />
    </div>
  );
}
