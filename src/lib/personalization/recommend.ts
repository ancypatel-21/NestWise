import { db } from "@/lib/db";
import type { FamilyContext } from "@/types";
import { completedSlugs } from "@/lib/content";
import { ALL_LESSONS, LEARN_MODULES } from "@/content/learn-modules";
import { trimesterForWeek } from "./pregnancy";

export interface Recommendation {
  kind: "lesson" | "quiz" | "activity" | "week";
  title: string;
  href: string;
  reason: string;
  minutes?: number;
}

/** Modules that matter most in each trimester, in priority order. */
const TRIMESTER_FOCUS: Record<1 | 2 | 3, string[]> = {
  1: ["Understanding Pregnancy", "Nutrition", "Baby Development", "Mental & Emotional Wellbeing", "Prenatal Appointments"],
  2: ["Baby Development", "Exercise & Movement", "Prenatal Tests", "Sleep", "Financial Preparation"],
  3: ["Birth Planning", "Feeding Basics", "Newborn Basics", "Preparing the Home", "Partner Preparation"],
};

/**
 * A lightweight, explainable "what to learn next" recommender. It blends the user's stage, their
 * stated interests, and what they've already completed — and always returns a reason.
 */
export async function recommendNext(
  ctx: FamilyContext,
  userId: string,
): Promise<Recommendation | null> {
  const done = await completedSlugs(userId);

  if (ctx.stage.mode === "pregnancy" || ctx.stage.mode === "birth-countdown") {
    const week = ctx.stage.pregnancyWeek ?? 12;
    const tri = trimesterForWeek(week);
    const interests = ctx.personalization.contentPreferences ?? [];

    // Priority order: interests first, then trimester focus, then everything else.
    const ordered = [
      ...LEARN_MODULES.filter((m) => interests.some((i) => moduleMatchesInterest(m.title, i))),
      ...LEARN_MODULES.filter((m) => TRIMESTER_FOCUS[tri].includes(m.title)).sort(
        (a, b) => TRIMESTER_FOCUS[tri].indexOf(a.title) - TRIMESTER_FOCUS[tri].indexOf(b.title),
      ),
      ...LEARN_MODULES,
    ];
    const seen = new Set<string>();

    for (const mod of ordered) {
      if (seen.has(mod.slug)) continue;
      seen.add(mod.slug);

      const lessons = ALL_LESSONS.filter((x) => x.module.slug === mod.slug);
      const next = lessons.find((x) => !done.has(x.slug));
      if (next) {
        const isInterest = interests.some((i) => moduleMatchesInterest(mod.title, i));
        const reason = isInterest
          ? `You said you're interested in ${mod.title.toLowerCase()} — here's a good next lesson.`
          : `At ${week} weeks (trimester ${tri}), ${mod.title.toLowerCase()} is worth focusing on now.`;
        return {
          kind: "lesson",
          title: next.lesson.title,
          href: `/learn/${mod.slug}/${next.slug}`,
          reason,
          minutes: next.lesson.minutes,
        };
      }

      // All lessons done but the module quiz isn't attempted -> suggest the quiz.
      const attempted = await db.quizAttempt.count({
        where: { userId, quizSlug: `learn-${mod.slug}` },
      });
      if (lessons.length > 0 && attempted === 0) {
        return {
          kind: "quiz",
          title: `${mod.title} quiz`,
          href: `/quiz/learn-${mod.slug}`,
          reason: `You've finished the ${mod.title} lessons — take the quiz to lock it in.`,
        };
      }
    }

    // Everything covered — point at this week's page.
    return {
      kind: "week",
      title: `Week ${week}`,
      href: `/journey/week/${week}`,
      reason: "You've worked through the lessons — here's what's happening this week.",
    };
  }

  if (ctx.stage.mode === "child" && ctx.stage.childStageSlug) {
    const months = ctx.stage.childAgeMonths ?? 0;
    const dev = await db.content.findFirst({
      where: {
        contentType: "DEVELOPMENT",
        ageMinMonths: { lte: months },
        ageMaxMonths: { gte: months },
      },
    });
    if (dev && !done.has(dev.slug)) {
      return {
        kind: "lesson",
        title: dev.title,
        href: `/child/timeline/${dev.slug.replace("dev-", "")}`,
        reason: `Your child is ${months} months old — this covers what to expect and encourage now.`,
      };
    }
    const activity = await db.activity.findFirst({
      where: {
        weekend: false,
        ageMinMonths: { lte: months + 2 },
        ageMaxMonths: { gte: Math.max(months - 2, 0) },
      },
      orderBy: { ageMinMonths: "desc" },
    });
    if (activity) {
      return {
        kind: "activity",
        title: activity.title,
        href: `/child/activities/${activity.slug}`,
        reason: `A play idea matched to ${months} months — supports ${activity.skillsSupported.slice(0, 2).join(" and ").toLowerCase()}.`,
      };
    }
  }

  if (ctx.stage.mode === "postpartum") {
    const topic = await db.content.findFirst({ where: { contentType: "FIRST_DAYS" } });
    if (topic) {
      return {
        kind: "lesson",
        title: topic.title,
        href: `/postpartum/topic/${topic.slug}`,
        reason: "In the first weeks, the newborn-care basics are the most useful thing to review.",
      };
    }
  }

  return null;
}

function moduleMatchesInterest(moduleTitle: string, interest: string): boolean {
  const m = moduleTitle.toLowerCase();
  const i = interest.toLowerCase();
  if (i.includes("nutrition")) return m.includes("nutrition");
  if (i.includes("baby development")) return m.includes("baby development");
  if (i.includes("mother")) return m.includes("mother");
  if (i.includes("exercise") || i.includes("movement")) return m.includes("exercise");
  if (i.includes("birth")) return m.includes("birth");
  if (i.includes("newborn")) return m.includes("newborn");
  if (i.includes("partner")) return m.includes("partner");
  if (i.includes("wellbeing") || i.includes("emotional")) return m.includes("wellbeing");
  return false;
}
