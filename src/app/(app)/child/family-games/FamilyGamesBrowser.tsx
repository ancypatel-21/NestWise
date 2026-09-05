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
  ageMinYears: number;
  instructions: string[];
  skillsPracticed: string[];
}

type Place = "any" | "indoor" | "outdoor";
type TimeBand = "any" | "quick" | "medium" | "long";

export function FamilyGamesBrowser({ games }: { games: FamilyGameView[] }) {
  const [age, setAge] = useState<number | "any">("any");
  const [players, setPlayers] = useState<number | "any">("any");
  const [place, setPlace] = useState<Place>("any");
  const [time, setTime] = useState<TimeBand>("any");
  const [noMaterials, setNoMaterials] = useState(false);

  const filtered = useMemo(
    () =>
      games.filter((g) => {
        if (age !== "any" && g.ageMinYears > age) return false;
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
          {(["any", 3, 4, 5, 6, 8, 10] as const).map((a) => (
            <Chip key={a} active={age === a} onClick={() => setAge(a)}>
              {a === "any" ? "Any" : `${a}+`}
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

      <p className="mb-3 text-sm text-[var(--color-ink-soft)]">
        {filtered.length} game{filtered.length === 1 ? "" : "s"}
      </p>

      <div className="space-y-3">
        {filtered.map((g) => (
          <Card key={g.slug}>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-bold">{g.title}</p>
              <span className="text-xs text-[var(--color-ink-faint)]">
                {g.minPlayers}–{g.maxPlayers} players · {g.timeMin} min · {g.ageMinYears}+
                {g.indoor && g.outdoor ? " · indoor/outdoor" : g.outdoor ? " · outdoor" : " · indoor"}
                {g.needsMaterials ? "" : " · no materials"}
              </span>
            </div>
            <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{g.description}</p>
            <div className="mt-3">
              <Accordion
                items={[
                  {
                    id: "how",
                    title: "How to play",
                    content: (
                      <ol className="list-decimal space-y-1 pl-5">
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
      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">
        {icon}
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
