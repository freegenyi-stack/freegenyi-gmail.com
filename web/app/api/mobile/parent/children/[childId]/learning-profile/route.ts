import { NextResponse } from "next/server";
import { requireMobileParent } from "@/lib/mobile/require-mobile-auth";
import { updateChildLearningProfileForUser } from "@/lib/mobile/parent-child.server";
import type { LearningMode } from "@/lib/child/learning-profile";
import { DAILY_SCREEN_OPTIONS } from "@/lib/child/learning-profile";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ childId: string }> }
) {
  const auth = await requireMobileParent(request);
  if (auth instanceof NextResponse) return auth;

  const { childId: childIdStr } = await params;
  const childId = parseInt(childIdStr, 10);
  if (Number.isNaN(childId)) {
    return NextResponse.json({ error: "invalid_child_id" }, { status: 400 });
  }

  const body = (await request.json()) as {
    learningMode?: LearningMode;
    dailyScreenMinutes?: number;
  };

  if (
    body.learningMode &&
    !["guided", "semi_guided", "explorer"].includes(body.learningMode)
  ) {
    return NextResponse.json({ error: "invalid_learning_mode" }, { status: 400 });
  }

  if (
    body.dailyScreenMinutes !== undefined &&
    !(DAILY_SCREEN_OPTIONS as readonly number[]).includes(body.dailyScreenMinutes)
  ) {
    return NextResponse.json({ error: "invalid_screen_time" }, { status: 400 });
  }

  const result = await updateChildLearningProfileForUser(auth.user, childId, body);
  if ("error" in result) {
    return NextResponse.json({ error: result.code, message: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, profile: result.profile });
}
