import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { children, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { userCanAccessChild } from "@/lib/family/server";
import { getChildScreenTimeMinutes } from "@/lib/parent/parent-worksheets.server";
import { getChildSessionFromCookies } from "@/lib/child-session";
import { childDevicePairings } from "@/db/schema";
import { and } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ childId: string }> }
) {
  const { childId: childIdStr } = await params;
  const childId = parseInt(childIdStr, 10);
  if (Number.isNaN(childId)) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const [child] = await db.select().from(children).where(eq(children.id, childId)).limit(1);
  if (!child) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let allowed = false;
  const session = await auth();
  if (session?.user?.id) {
    const userId = parseInt(session.user.id, 10);
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (user) allowed = await userCanAccessChild(user, child);
  } else {
    const childSession = await getChildSessionFromCookies();
    if (childSession?.childId === childId) {
      const [pairing] = await db
        .select()
        .from(childDevicePairings)
        .where(
          and(
            eq(childDevicePairings.childId, childId),
            eq(childDevicePairings.deviceToken, childSession.deviceToken)
          )
        )
        .limit(1);
      allowed = !!pairing;
    }
  }

  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const minutesToday = await getChildScreenTimeMinutes(childId);
  const date = new Date().toISOString().slice(0, 10);
  return NextResponse.json({ minutesToday, date, dailyLimit: child.learningProfile ? JSON.parse(child.learningProfile).dailyScreenMinutes : 20 });
}
