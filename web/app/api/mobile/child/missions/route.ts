import { NextResponse } from "next/server";
import { requireMobileChild } from "@/lib/mobile/require-mobile-auth";
import { listChildAtelierMissions } from "@/lib/mobile/child-missions.server";
import { isActivityKind } from "@/lib/authoring/types";

export async function GET(request: Request) {
  const auth = await requireMobileChild(request);
  if (auth instanceof NextResponse) return auth;

  const missions = await listChildAtelierMissions(auth.childId);
  return NextResponse.json({
    missions: missions.map((m) => ({
      progressId: m.progressId,
      resourceId: m.resourceId,
      resourceTitle: m.resourceTitle,
      resourceKind: m.resourceKind,
      isActivity: isActivityKind(m.resourceKind),
      teacherName: m.teacherName,
      status: m.status,
      note: m.note,
      xpEarned: m.xpEarned,
    })),
  });
}
