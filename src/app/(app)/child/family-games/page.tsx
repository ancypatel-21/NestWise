import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { isKidsMode } from "@/lib/kids-mode";
import { PageHeader } from "@/components/ui/PageHeader";
import { FamilyGamesBrowser } from "./FamilyGamesBrowser";

export const metadata: Metadata = { title: "Family games" };

export default async function FamilyGamesPage() {
  await requireFamilyContext();
  const kids = await isKidsMode();
  const games = await db.familyGame.findMany({ orderBy: { title: "asc" } });

  return (
    <div>
      <PageHeader
        title="Family games"
        intro="Games that bring the family together without expensive materials. Filter by age, players, place, time and materials."
        backHref={kids ? undefined : "/child"}
        backLabel="Child dashboard"
      />
      <FamilyGamesBrowser
        games={games.map((g) => ({
          slug: g.slug,
          title: g.title,
          description: g.description,
          minPlayers: g.minPlayers,
          maxPlayers: g.maxPlayers,
          indoor: g.indoor,
          outdoor: g.outdoor,
          timeMin: g.timeMin,
          needsMaterials: g.needsMaterials,
          ageMinYears: Math.round(g.ageMinMonths / 12),
          instructions: g.instructions,
          skillsPracticed: g.skillsPracticed,
        }))}
      />
    </div>
  );
}
