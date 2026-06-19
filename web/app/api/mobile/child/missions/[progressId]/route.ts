import { NextResponse } from "next/server";
import { requireMobileChild } from "@/lib/mobile/require-mobile-auth";
import { getMobileMissionPayload } from "@/lib/mobile/child-missions.server";

export async function GET(
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

  const locale = new URL(request.url).searchParams.get("locale") || "fr";
  const payload = await getMobileMissionPayload(progressId, auth.childId, locale);
  if (!payload) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json(payload);
}
