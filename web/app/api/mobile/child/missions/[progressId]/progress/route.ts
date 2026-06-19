import { NextResponse } from "next/server";
import { requireMobileChild } from "@/lib/mobile/require-mobile-auth";
import { updateMobileMissionProgress } from "@/lib/mobile/child-missions.server";
import type { ActivityResult } from "@/types/activity";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ progressId: string }> }
) {
  const auth = await requireMobileChild(request);
  if (auth instanceof NextResponse) return auth;

  const { progressId: progressIdStr } = await params;
  const progressId = parseInt(progressIdStr, 10);
  if (Number.isNaN(progressId)) {
    return NextResponse.json({ error: "invalid_progress_id" }, { status: 400 });
  }

  const body = (await request.json()) as {
    status: "in_progress" | "done";
    result?: ActivityResult;
  };

  if (body.status !== "in_progress" && body.status !== "done") {
    return NextResponse.json({ error: "invalid_status" }, { status: 400 });
  }

  const res = await updateMobileMissionProgress({
    progressId,
    childId: auth.childId,
    status: body.status,
    result: body.result,
  });

  if ("error" in res) {
    return NextResponse.json({ error: res.code || "update_failed", message: res.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
