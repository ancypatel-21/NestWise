"use client";

import { useMemo, useState } from "react";
import { Users, Clock, Home, Package } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Badge";
import { Accordion } from "@/components/ui/Accordion";

export interface FamilyGameView {
  slug: string;
  title: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  indoor: boolean;
  outdoor: boolean;
  timeMin: number;
  needsMaterials: boolean;
  ageMinMonths: number;
  instructions: string[];
  skillsPracticed: string[];
}

type Place = "any" | "indoor" | "outdoor";
type TimeBand = "any" | "quick" | "medium" | "long";

/** NestWise covers pregnancy to age 3, so age is filtered in three yearly bands. */
const AGE_BANDS = [
  { key: "0-1", label: "0–1 yr", maxMonths: 12 },
  { key: "1-2", label: "1–2 yrs", maxMonths: 24 },
  { key: "2-3", label: "2–3 yrs", maxMonths: 36 },
] as const;
type AgeBand = (typeof AGE_BANDS)[number]["key"] | "any";

function ageLabel(months: number) {
  return months < 12 ? `${months} mo+` : `${Math.round(months / 12)} yr+`;
}

export function FamilyGamesBrowser({ games }: { games: FamilyGameView[] }) {
  const [age, setAge] = useState<AgeBand>("any");
  const [players, setPlayers] = useState<number | "any">("any");
  const [place, setPlace] = useState<Place>("any");
  const [time, setTime] = useState<TimeBand>("any");
  const [noMaterials, setNoMaterials] = useState(false);

  const filtered = useMemo(
    () =>
      games.filter((g) => {
        if (age !== "any") {
          const band = AGE_BANDS.find((b) => b.key === age);
          if (band && g.ageMinMonths >= band.maxMonths) return false;
        }
        if (players !== "any" && (players < g.minPlayers || players > g.maxPlayers)) return false;
        if (place === "indoor" && !g.indoor) return false;
        if (place === "outdoor" && !g.outdoor) return false;
        if (time === "quick" && g.timeMin > 10) return false;
        if (time === "medium" && (g.timeMin < 10 || g.timeMin > 25)) return false;
        if (time === "long" && g.timeMin < 25) return false;
        if (noMaterials && g.needsMaterials) return false;
        return true;
      }),
    [games, age, players, place, time, noMaterials],
  );

  return (
    <div>
      <Card className="mb-6 space-y-4">
        <Row icon={<Users size={16} />} label="Child age">
          <Chip active={age === "any"} onClick={() => setAge("any")}>
            Any
          </Chip>
          {AGE_BANDS.map((b) => (
            <Chip key={b.key} active={age === b.key} onClick={() => setAge(b.key)}>
              {b.label}
            </Chip>
          ))}
        </Row>
        <Row icon={<Users size={16} />} label="Players">
          {(["any", 2, 3, 4, 5, 6] as const).map((p) => (
            <Chip key={p} active={players === p} onClick={() => setPlayers(p)}>
              {p === "any" ? "Any" : p}
            </Chip>
          ))}
        </Row>
        <Row icon={<Home size={16} />} label="Where">
          {(["any", "indoor", "outdoor"] as const).map((p) => (
            <Chip key={p} active={place === p} onClick={() => setPlace(p)}>
              {p === "any" ? "Any" : p === "indoor" ? "Indoor" : "Outdoor"}
            </Chip>
          ))}
        </Row>
        <Row icon={<Clock size={16} />} label="Time">
          {(["any", "quick", "medium", "long"] as const).map((t) => (
            <Chip key={t} active={time === t} onClick={() => setTime(t)}>
              {t === "any" ? "Any" : t === "quick" ? "≤10 min" : t === "medium" ? "10–25 min" : "25+ min"}
            </Chip>
          ))}
        </Row>
        <Row icon={<Package size={16} />} label="Materials">
          <Chip active={noMaterials} onClick={() => setNoMaterials((v) => !v)}>
            No materials needed
          </Chip>
        </Row>
      </Card>

      <p className="mb-3 text-base text-[var(--color-ink-soft)]">
        {filtered.length} game{filtered.length === 1 ? "" : "s"}
      </p>

      <div className="space-y-4">
        {filtered.map((g) => (
          <Card key={g.slug}>
            <p className="text-xl font-bold sm:text-2xl">{g.title}</p>
            <p className="mt-1 text-sm font-semibold text-[var(--color-ink-faint)]">
              {g.minPlayers}–{g.maxPlayers} players · {g.timeMin} min · {ageLabel(g.ageMinMonths)}
              {g.indoor && g.outdoor ? " · indoor/outdoor" : g.outdoor ? " · outdoor" : " · indoor"}
              {g.needsMaterials ? "" : " · no materials"}
            </p>
            <p className="mt-2 text-base leading-relaxed text-[var(--color-ink-soft)]">
              {g.description}
            </p>
            <div className="mt-3 text-base">
              <Accordion
                items={[
                  {
                    id: "how",
                    title: "How to play",
                    content: (
                      <ol className="list-decimal space-y-2 pl-5 text-base leading-relaxed">
                        {g.instructions.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ol>
                    ),
                  },
                ]}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">
        {icon}
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
