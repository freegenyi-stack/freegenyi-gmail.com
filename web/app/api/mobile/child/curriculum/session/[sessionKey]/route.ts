import { NextResponse } from "next/server";
import { requireMobileChild } from "@/lib/mobile/require-mobile-auth";
import { getCurriculumPlayPayload } from "@/lib/curriculum/assign.server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionKey: string }> }
) {
  const auth = await requireMobileChild(request);
  if (auth instanceof NextResponse) return auth;

  const { sessionKey } = await params;
  const play = await getCurriculumPlayPayload(sessionKey, auth.childId);
  if (!play) {
    return NextResponse.json({ error: "session_not_found" }, { status: 404 });
  }

  return NextResponse.json({ play, langue: "fr" });
}
