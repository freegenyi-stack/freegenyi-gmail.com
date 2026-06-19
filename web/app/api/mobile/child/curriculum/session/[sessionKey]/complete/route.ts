import { NextResponse } from "next/server";
import { requireMobileChild } from "@/lib/mobile/require-mobile-auth";
import { completeSession, findActiveBundle } from "@/lib/curriculum/progress.server";
import { db } from "@/db";
import { curriculumSessions, children } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { normalizeChildLevel, parseSubjectParam } from "@/lib/curriculum/progress.server";

type CompleteBody = {
  score?: number;
  correctCount?: number;
  totalCount?: number;
  subject?: string;
  answers?: Record<string, unknown>;
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionKey: string }> }
) {
  const auth = await requireMobileChild(request);
  if (auth instanceof NextResponse) return auth;

  const { sessionKey } = await params;
  let body: CompleteBody = {};
  try {
    body = (await request.json()) as CompleteBody;
  } catch {
    /* optional body */
  }

  const [session] = await db
    .select()
    .from(curriculumSessions)
    .where(
      and(
        eq(curriculumSessions.sessionKey, sessionKey),
        eq(curriculumSessions.childId, auth.childId)
      )
    )
    .limit(1);

  if (!session) {
    return NextResponse.json({ error: "session_not_found" }, { status: 404 });
  }

  const payload = session.payloadJson as { xpReward?: number; subject?: string; items?: unknown[] };
  const total = body.totalCount ?? payload.items?.length ?? 1;
  const correct = body.correctCount ?? 0;
  const ratio = total > 0 ? correct / total : 0;
  const score = body.score ?? Math.round(ratio * 100);
  const xpEarned = Math.round((payload.xpReward ?? 20) * ratio);
  const stars = ratio >= 0.95 ? 3 : ratio >= 0.75 ? 2 : ratio >= 0.5 ? 1 : 0;

  const subject = parseSubjectParam(body.subject ?? payload.subject ?? null);
  const [child] = await db
    .select({ educationLevel: children.educationLevel })
    .from(children)
    .where(eq(children.id, auth.childId))
    .limit(1);
  const level = normalizeChildLevel(child?.educationLevel);

  const dbBundle =
    session.bundleId ??
    (subject ? (await findActiveBundle("DZ", level, subject))?.id : undefined);

  await completeSession(sessionKey, auth.childId, {
    score,
    xpEarned,
    stars,
    competencyId: session.competencyId,
    bundleId: dbBundle ?? undefined,
    answersJson: body.answers,
  });

  return NextResponse.json({
    success: true,
    score,
    xpEarned,
    stars,
  });
}
