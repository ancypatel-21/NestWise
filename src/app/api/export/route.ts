import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

/**
 * Machine-readable export of everything tied to this account (PRD §52, §38).
 * Passwords are never included.
 */
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const memberships = await db.familyMembership.findMany({
    where: { userId: user.id },
    include: {
      family: {
        include: {
          pregnancyProfile: true,
          children: { include: { journalEntries: true, routines: true, gameProgress: true, quizAttempts: true } },
          checklists: { include: { items: true } },
          contacts: true,
        },
      },
    },
  });

  const [bookmarks, completions, quizAttempts, askLogs] = await Promise.all([
    db.bookmark.findMany({ where: { userId: user.id } }),
    db.lessonCompletion.findMany({ where: { userId: user.id } }),
    db.quizAttempt.findMany({ where: { userId: user.id } }),
    db.askLog.findMany({ where: { userId: user.id } }),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    account: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      country: user.country,
      timezone: user.timezone,
      preferences: user.preferences,
      createdAt: user.createdAt,
    },
    families: memberships.map((m) => m.family),
    bookmarks,
    lessonCompletions: completions,
    quizAttempts,
    askLog: askLogs,
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "content-type": "application/json",
      "content-disposition": `attachment; filename="nestwise-export-${Date.now()}.json"`,
    },
  });
}
