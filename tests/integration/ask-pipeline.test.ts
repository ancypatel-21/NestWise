import { describe, expect, it, beforeAll } from "vitest";
import { db } from "@/lib/db";
import { answerQuestion } from "@/lib/ai/answer";

/**
 * Integration: Ask NestWise pipeline (PRD §50) over the seeded content.
 * Requires the dev database to be seeded (`npm run seed`).
 */
const hasDb = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDb)("ask pipeline over seeded content", () => {
  beforeAll(async () => {
    const count = await db.content.count();
    if (count === 0) throw new Error("Seed the database first: npm run seed");
  });

  it("answers a nutrition question with grounded citations, Level 1", async () => {
    const res = await answerQuestion("What foods contain iron?", { pregnancyWeek: 18 });
    expect(res.safetyLevel).toBe("LEVEL_1");
    expect(res.category).toBe("PREGNANCY"); // pregnancy-week context steers a general question
    expect(res.citations.length).toBeGreaterThan(0);
    expect(res.answer.toLowerCase()).toContain("iron");
  });

  it("wraps a personal symptom question in Level 2 caution", async () => {
    const res = await answerQuestion("I have been vomiting all day, should I worry?");
    expect(res.safetyLevel).toBe("LEVEL_2");
    expect(res.answer).toMatch(/midwife|doctor|provider|professional/i);
    expect(res.emergency).toBe(false);
  });

  it("flags a possible emergency at Level 3 with the disclaimer", async () => {
    const res = await answerQuestion("I have heavy bleeding and feel faint");
    expect(res.safetyLevel).toBe("LEVEL_3");
    expect(res.emergency).toBe(true);
    expect(res.answer).toMatch(/emergency services|immediate/i);
  });

  it("retrieves the nausea symptom page for a nausea question", async () => {
    const res = await answerQuestion("Is nausea common at this stage?");
    expect(res.citations.some((c) => /nausea/i.test(c.title))).toBe(true);
  });
});

describe.skipIf(!hasDb)("seeded content coverage (PRD §54)", () => {
  it("has every pregnancy week 4–40", async () => {
    const weeks = await db.content.findMany({
      where: { contentType: "WEEK_PREGNANCY" },
      select: { pregnancyWeek: true },
    });
    const nums = new Set(weeks.map((w) => w.pregnancyWeek));
    for (let w = 4; w <= 40; w++) expect(nums.has(w)).toBe(true);
  });

  it("has a development, parent-learning and discipline page for every child stage", async () => {
    const dev = await db.content.count({ where: { contentType: "DEVELOPMENT" } });
    const parent = await db.content.count({ where: { contentType: "PARENT_LEARNING" } });
    const disc = await db.content.count({ where: { contentType: "DISCIPLINE" } });
    expect(dev).toBe(23); // 12 months + 11 yearly bands
    expect(parent).toBe(23);
    expect(disc).toBe(23);
  });

  it("covers the PRD §31 learning-game categories", async () => {
    const games = await db.game.findMany({ select: { category: true } });
    const cats = new Set(games.map((g) => g.category));
    for (const c of ["Colors", "Numbers", "ABC / letters", "Emotions", "Science", "Geography"]) {
      expect(cats.has(c)).toBe(true);
    }
  });
});
