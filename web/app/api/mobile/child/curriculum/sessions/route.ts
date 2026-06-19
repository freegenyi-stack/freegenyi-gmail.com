import { NextResponse } from "next/server";
import { requireMobileChild } from "@/lib/mobile/require-mobile-auth";
import { listPendingCurriculumSessions } from "@/lib/curriculum/assign.server";

export async function GET(request: Request) {
  const auth = await requireMobileChild(request);
  if (auth instanceof NextResponse) return auth;

  const sessions = await listPendingCurriculumSessions(auth.childId);
  return NextResponse.json({ sessions });
}
