import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { pregnancyWeekSeeds } from "../src/content/pregnancy-weeks";
import { LEARN_MODULES, learnLessonSeeds } from "../src/content/learn-modules";
import { symptomSeeds } from "../src/content/symptoms";
import { nutritionSeeds } from "../src/content/nutrition";
import { exerciseSeeds } from "../src/content/exercise";
import { factSeeds } from "../src/content/facts";
import { resourceSeeds } from "../src/content/resources";
import { QUIZZES } from "../src/content/quizzes";
import { birthPostpartumSeeds } from "../src/content/birth-postpartum";
import { childDevelopmentSeeds } from "../src/content/child-development";
import { ACTIVITY_SEEDS } from "../src/content/activities";
import { FAMILY_GAME_SEEDS } from "../src/content/family-games";
import { GAME_SEEDS } from "../src/content/games";
import type { ContentSeed } from "../src/content/_helpers";

const db = new PrismaClient();

async function seedContent() {
  const all: ContentSeed[] = [
    ...pregnancyWeekSeeds(),
    ...learnLessonSeeds(),
    ...symptomSeeds(),
    ...nutritionSeeds(),
    ...exerciseSeeds(),
    ...factSeeds(),
    ...resourceSeeds(),
    ...birthPostpartumSeeds(),
    ...childDevelopmentSeeds(),
  ];

  for (const c of all) {
    const data: Prisma.ContentCreateInput = {
      slug: c.slug,
      title: c.title,
      contentType: c.contentType,
      stage: c.stage,
      category: c.category,
      role: c.role ?? null,
      pregnancyWeek: c.pregnancyWeek ?? null,
      ageMinMonths: c.ageMinMonths ?? null,
      ageMaxMonths: c.ageMaxMonths ?? null,
      summary: c.summary,
      blocks: c.blocks as unknown as Prisma.InputJsonValue,
      keyTakeaways: c.keyTakeaways,
      source: c.source ?? "Placeholder — pending expert review",
      referenceUrls: c.referenceUrls ?? [],
      reviewedAt: c.reviewedAt ?? null,
      published: true,
    };
    await db.content.upsert({ where: { slug: c.slug }, create: data, update: data });
  }
  console.log(`  content: ${all.length} entries`);
}

async function seedQuizzes() {
  for (const q of QUIZZES) {
    const data = {
      slug: q.slug,
      title: q.title,
      category: q.category,
      stage: q.stage,
      ageRange: q.ageRange ?? null,
      questions: q.questions as unknown as Prisma.InputJsonValue,
    };
    await db.quiz.upsert({ where: { slug: q.slug }, create: data, update: data });
  }
  console.log(`  quizzes: ${QUIZZES.length}`);
}

async function seedActivities() {
  for (const a of ACTIVITY_SEEDS) {
    await db.activity.upsert({ where: { slug: a.slug }, create: a, update: a });
  }
  console.log(`  activities: ${ACTIVITY_SEEDS.length}`);
}

async function seedFamilyGames() {
  for (const g of FAMILY_GAME_SEEDS) {
    await db.familyGame.upsert({ where: { slug: g.slug }, create: g, update: g });
  }
  console.log(`  family games: ${FAMILY_GAME_SEEDS.length}`);
}

async function seedGames() {
  for (const g of GAME_SEEDS) {
    const data = {
      slug: g.slug,
      title: g.title,
      category: g.category,
      format: g.format,
      minAgeMonths: g.minAgeMonths,
      skillsSupported: g.skillsSupported,
      config: g.config as unknown as Prisma.InputJsonValue,
    };
    await db.game.upsert({ where: { slug: g.slug }, create: data, update: data });
  }
  console.log(`  learning games: ${GAME_SEEDS.length}`);
}

/** A convenience login for local development / the E2E suite. */
async function seedDemoUser() {
  const email = "demo@nestwise.test";
  const passwordHash = await bcrypt.hash("nestwise123", 10);
  const user = await db.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      displayName: "Demo Parent",
      role: "MOTHER",
      country: "GB",
      timezone: "Europe/London",
    },
  });

  let membership = await db.familyMembership.findFirst({ where: { userId: user.id } });
  if (!membership) {
    const family = await db.family.create({ data: { name: "Demo Family" } });
    membership = await db.familyMembership.create({
      data: { userId: user.id, familyId: family.id, role: "MOTHER" },
    });
  }

  // Keep the demo perpetually ~18 weeks pregnant so it's always in the pregnancy journey.
  const due = new Date();
  due.setDate(due.getDate() + 7 * 22);
  await db.pregnancyProfile.upsert({
    where: { familyId: membership.familyId },
    create: {
      familyId: membership.familyId,
      estimatedDueDate: due,
      dietaryPreferences: ["Vegetarian"],
      allergies: ["peanut"],
      contentPreferences: ["Baby development", "Nutrition"],
    },
    update: { estimatedDueDate: due },
  });
  console.log(`  demo user: ${email} / nestwise123 (~18 weeks pregnant)`);
}

async function main() {
  console.log("Seeding NestWise…");
  await seedContent();
  await seedQuizzes();
  await seedActivities();
  await seedFamilyGames();
  await seedGames();
  await seedDemoUser();
  console.log(`  learn modules (static): ${LEARN_MODULES.length}`);
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
