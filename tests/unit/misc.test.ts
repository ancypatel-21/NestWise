import { describe, expect, it } from "vitest";
import { filterContent } from "@/lib/personalization/content-filter";
import { getFamilyStage } from "@/lib/personalization/stage";
import { computeStreak } from "@/lib/streak";
import { buildGame, nextLevel, roundsForLevel } from "@/lib/games/engine";
import { isKidAllowedPath } from "@/lib/kids-mode";
import { dueDateFromWeek } from "@/lib/personalization/pregnancy";
import {
  applyJourneyOverride,
  availableJourneys,
  journeyForMode,
} from "@/lib/personalization/mode-override";

const baseContent = {
  id: "x",
  slug: "x",
  title: "",
  contentType: "FOOD" as const,
  stage: "PREGNANCY" as const,
  category: "Snack",
  role: null,
  pregnancyWeek: null,
  ageMinMonths: null,
  ageMaxMonths: null,
  summary: "",
  blocks: [] as unknown as object,
  keyTakeaways: [] as string[],
  source: "",
  referenceUrls: [] as string[],
  reviewedAt: null,
  published: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("content filter (PRD §13, §50)", () => {
  it("hides foods that name a declared allergen", () => {
    const items = [
      { ...baseContent, slug: "a", title: "Peanut butter toast", summary: "peanut butter" },
      { ...baseContent, slug: "b", title: "Apple slices", summary: "apple" },
    ];
    const out = filterContent(items, { allergies: ["peanut"] });
    expect(out.map((i) => i.slug)).toEqual(["b"]);
  });

  it("matches pregnancy week within ±1", () => {
    const items = [
      { ...baseContent, slug: "w10", contentType: "WEEK_PREGNANCY" as const, pregnancyWeek: 10 },
      { ...baseContent, slug: "w20", contentType: "WEEK_PREGNANCY" as const, pregnancyWeek: 20 },
    ];
    expect(filterContent(items, { pregnancyWeek: 11 }).map((i) => i.slug)).toEqual(["w10"]);
  });
});

describe("family stage resolver (PRD §3, §17)", () => {
  const today = new Date("2026-06-01T00:00:00Z");

  it("pregnancy mode well before the due date", () => {
    const profile = {
      familyId: "f",
      estimatedDueDate: dueDateFromWeek(20, today),
      createdAt: today,
    } as never;
    const s = getFamilyStage(profile, [], today);
    expect(s.mode).toBe("pregnancy");
    expect(s.part).toBe(1);
    expect(s.pregnancyWeek).toBe(20);
  });

  it("birth-countdown within 4 weeks of the due date", () => {
    const due = new Date(today.getTime() + 10 * 86_400_000);
    const profile = { familyId: "f", estimatedDueDate: due, createdAt: today } as never;
    const s = getFamilyStage(profile, [], today);
    expect(s.mode).toBe("birth-countdown");
    expect(s.part).toBe(2);
  });

  it("postpartum then child mode based on the youngest child's age", () => {
    const newborn = { id: "c1", dateOfBirth: new Date(today.getTime() - 14 * 86_400_000), createdAt: today } as never;
    const toddler = { id: "c2", dateOfBirth: new Date("2024-01-01"), createdAt: new Date("2024-01-01") } as never;
    expect(getFamilyStage(null, [newborn], today).mode).toBe("postpartum");
    expect(getFamilyStage(null, [toddler], today).mode).toBe("child");
  });

  it("unset with no profile and no children", () => {
    expect(getFamilyStage(null, [], today).mode).toBe("unset");
  });
});

describe("manual journey switch (PRD §3, §6)", () => {
  const today = new Date("2026-06-01T00:00:00Z");
  const profile = {
    familyId: "f",
    estimatedDueDate: dueDateFromWeek(20, today),
    createdAt: today,
  } as never;
  const toddler = {
    id: "c1",
    nameOrNickname: "Bo",
    dateOfBirth: new Date("2024-06-01"),
    createdAt: new Date("2024-06-01"),
  } as never;

  it("always offers all three journeys, flagging which have data", () => {
    expect(availableJourneys(null, []).map((m) => m.value)).toEqual([
      "pregnancy",
      "birth-postpartum",
      "child",
    ]);
    // pregnancy profile but no child
    expect(availableJourneys(profile, []).map((m) => [m.value, m.hasData])).toEqual([
      ["pregnancy", true],
      ["birth-postpartum", true],
      ["child", false],
    ]);
    // both on file
    expect(availableJourneys(profile, [toddler]).every((m) => m.hasData)).toBe(true);
  });

  it("maps a resolved mode back to its journey", () => {
    expect(journeyForMode("pregnancy")).toBe("pregnancy");
    expect(journeyForMode("birth-countdown")).toBe("birth-postpartum");
    expect(journeyForMode("postpartum")).toBe("birth-postpartum");
    expect(journeyForMode("child")).toBe("child");
    expect(journeyForMode("unset")).toBeNull();
  });

  it("re-derives an accurate stage for the chosen journey", () => {
    const natural = getFamilyStage(profile, [], today);
    expect(natural.mode).toBe("pregnancy");

    // Birth & Postpartum with a pregnancy but no child -> pre-birth
    const prebirth = applyJourneyOverride(natural, "birth-postpartum", profile, [], today);
    expect(prebirth.mode).toBe("birth-countdown");
    expect(prebirth.part).toBe(2);
    expect(prebirth.pregnancyWeek).toBe(20);

    // Birth & Postpartum once a baby is on file -> postpartum
    const post = applyJourneyOverride(natural, "birth-postpartum", profile, [toddler], today);
    expect(post.mode).toBe("postpartum");

    const toChild = applyJourneyOverride(natural, "child", profile, [toddler], today);
    expect(toChild.mode).toBe("child");
    expect(toChild.primaryChildName).toBe("Bo");
  });

  it("still opens a journey with no data on file, just without specifics", () => {
    const natural = getFamilyStage(profile, [], today);
    const toChild = applyJourneyOverride(natural, "child", profile, [], today);
    expect(toChild).toEqual({ part: 3, mode: "child" });
    expect(toChild.primaryChildId).toBeUndefined();
  });
});

describe("streak (PRD §37)", () => {
  it("counts consecutive days ending today", () => {
    const today = new Date("2026-06-10T12:00:00Z");
    const dates = [
      new Date("2026-06-10T09:00:00Z"),
      new Date("2026-06-09T20:00:00Z"),
      new Date("2026-06-08T08:00:00Z"),
      new Date("2026-06-05T08:00:00Z"),
    ];
    expect(computeStreak(dates, today)).toBe(3);
  });
  it("is 0 when nothing recent", () => {
    expect(computeStreak([new Date("2026-01-01")], new Date("2026-06-10"))).toBe(0);
  });
});

describe("game engine (PRD §32, §33)", () => {
  const config = {
    items: [
      { label: "red", emoji: "🟥" },
      { label: "blue", emoji: "🟦" },
      { label: "green", emoji: "🟩" },
      { label: "yellow", emoji: "🟨" },
    ],
  };

  it("builds the right number of rounds for a level, each with a valid answer", () => {
    const g = buildGame("CHOOSE", config, 3);
    expect(g.rounds.length).toBe(roundsForLevel(3));
    for (const r of g.rounds) {
      expect(r.correct.length).toBeGreaterThan(0);
      expect(r.correct[0]).toBeGreaterThanOrEqual(0);
      expect(r.correct[0]).toBeLessThan(r.options.length);
    }
  });

  it("never shows the same option label twice, even from a pool with repeats", () => {
    const dupPool = {
      items: [
        { label: "red", emoji: "🔴" },
        { label: "blue", emoji: "🔵" },
        { label: "red", emoji: "🔴" },
        { label: "blue", emoji: "🔵" },
      ],
    };
    for (const fmt of ["CHOOSE", "PATTERN", "MATCH", "MEMORY", "MCQ"] as const) {
      for (let i = 0; i < 40; i++) {
        for (const r of buildGame(fmt, dupPool, 5).rounds) {
          const labels = r.options.map((o) => o.label);
          expect(new Set(labels).size).toBe(labels.length);
          expect(r.correct[0]).toBeGreaterThanOrEqual(0);
          expect(r.correct[0]).toBeLessThan(r.options.length);
        }
      }
    }
  });

  it("advances level on a strong score, drops on a weak one", () => {
    expect(nextLevel(2, 9, 10)).toBe(3);
    expect(nextLevel(2, 2, 10)).toBe(1);
    expect(nextLevel(1, 0, 10)).toBe(1); // never below 1
    expect(nextLevel(3, 7, 10)).toBe(3); // steady
  });
});

describe("kid-mode route guard (PRD §4.4, §40, §52)", () => {
  it("allows games, quizzes and activities only", () => {
    expect(isKidAllowedPath("/child")).toBe(true);
    expect(isKidAllowedPath("/child/games/tap-the-colour")).toBe(true);
    expect(isKidAllowedPath("/quiz/week-8-knowledge")).toBe(true);
    expect(isKidAllowedPath("/journey")).toBe(false);
    expect(isKidAllowedPath("/symptoms/nausea")).toBe(false);
    expect(isKidAllowedPath("/ask")).toBe(false);
    expect(isKidAllowedPath("/child/journal")).toBe(false);
  });
});
