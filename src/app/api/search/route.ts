import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

export interface SearchHit {
  title: string;
  href: string;
  kind: string;
  snippet: string;
}

export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ hits: [] });

  const contains = { contains: q, mode: "insensitive" as const };

  const [content, quizzes, activities, games, familyGames] = await Promise.all([
    db.content.findMany({
      where: { published: true, OR: [{ title: contains }, { summary: contains }, { category: contains }] },
      take: 20,
    }),
    db.quiz.findMany({ where: { OR: [{ title: contains }, { category: contains }] }, take: 8 }),
    db.activity.findMany({ where: { OR: [{ title: contains }, { category: contains }] }, take: 10 }),
    db.game.findMany({ where: { OR: [{ title: contains }, { category: contains }] }, take: 10 }),
    db.familyGame.findMany({ where: { OR: [{ title: contains }, { description: contains }] }, take: 8 }),
  ]);

  const hits: SearchHit[] = [
    ...content.map((c) => ({
      title: c.title,
      href: contentHref(c.contentType, c.slug),
      kind: kindLabel(c.contentType),
      snippet: c.summary,
    })),
    ...quizzes.map((q) => ({ title: q.title, href: `/quiz/${q.slug}`, kind: "Quiz", snippet: q.category })),
    ...activities.map((a) => ({
      title: a.title,
      href: `/child/activities/${a.slug}`,
      kind: a.weekend ? "Weekend activity" : "Activity",
      snippet: a.skillsSupported.join(", "),
    })),
    ...games.map((g) => ({
      title: g.title,
      href: `/child/games/${g.slug}`,
      kind: "Learning game",
      snippet: g.category,
    })),
    ...familyGames.map((g) => ({
      title: g.title,
      href: `/child/family-games`,
      kind: "Family game",
      snippet: g.description,
    })),
  ];

  return NextResponse.json({ hits: hits.slice(0, 40) });
}

function contentHref(type: string, slug: string): string {
  switch (type) {
    case "WEEK_PREGNANCY":
      return `/journey/week/${slug.replace(/\D/g, "")}`;
    case "SYMPTOM":
      return `/symptoms/${slug}`;
    case "EXERCISE":
      return `/exercise/${slug}`;
    case "FOOD":
      return `/nutrition/${slug}`;
    case "RESOURCE":
      return `/resources#${slug}`;
    case "BIRTH_TOPIC":
      return `/birth/learn/${slug}`;
    case "POSTPARTUM_TOPIC":
    case "FIRST_DAYS":
      return `/postpartum/topic/${slug}`;
    case "DEVELOPMENT":
      return `/child/timeline/${slug.replace("dev-", "")}`;
    case "PARENT_LEARNING":
      return `/child/timeline/${slug.replace("parent-", "")}`;
    case "DISCIPLINE":
      return `/child/timeline/${slug.replace("discipline-", "")}`;
    case "FACT":
      return `/facts`;
    default:
      return `/learn`;
  }
}

function kindLabel(type: string): string {
  return (
    {
      WEEK_PREGNANCY: "Pregnancy week",
      LESSON: "Lesson",
      SYMPTOM: "Symptom",
      FOOD: "Food",
      EXERCISE: "Exercise",
      RESOURCE: "Resource",
      DEVELOPMENT: "Child development",
      BIRTH_TOPIC: "Childbirth",
      POSTPARTUM_TOPIC: "Postpartum",
      FIRST_DAYS: "First days home",
      FACT: "Fact",
      PARENT_LEARNING: "Parent learning",
      DISCIPLINE: "Discipline & habits",
    }[type] ?? "Content"
  );
}
