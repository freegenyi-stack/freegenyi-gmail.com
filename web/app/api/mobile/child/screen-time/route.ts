import { NextResponse } from "next/server";
import { db } from "@/db";
import { children } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireMobileChild } from "@/lib/mobile/require-mobile-auth";
import { getChildScreenTimeMinutes } from "@/lib/parent/parent-worksheets.server";
import { logChildScreenTimeAction } from "@/lib/actions/children";
import { parseChildLearningProfileJson } from "@/lib/child/learning-profile";

export async function GET(request: Request) {
  const auth = await requireMobileChild(request);
  if (auth instanceof NextResponse) return auth;

  const [child] = await db
    .select({ learningProfile: children.learningProfile })
    .from(children)
    .where(eq(children.id, auth.childId))
    .limit(1);

  const profile = parseChildLearningProfileJson(child?.learningProfile);
  const minutesToday = await getChildScreenTimeMinutes(auth.childId);

  return NextResponse.json({
    minutesToday,
    dailyLimitMinutes: profile.dailyScreenMinutes ?? 20,
    date: new Date().toISOString().slice(0, 10),
  });
}

export async function POST(request: Request) {
  const auth = await requireMobileChild(request);
  if (auth instanceof NextResponse) return auth;

  const body = (await request.json()) as { minutesToday?: number };
  if (typeof body.minutesToday !== "number") {
    return NextResponse.json({ error: "invalid_params" }, { status: 400 });
  }

  await logChildScreenTimeAction(auth.childId, body.minutesToday);
  return NextResponse.json({ ok: true });
}
