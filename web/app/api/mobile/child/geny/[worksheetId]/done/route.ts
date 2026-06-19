import { NextResponse } from "next/server";
import { requireMobileChild } from "@/lib/mobile/require-mobile-auth";
import { markWorksheetDone } from "@/lib/parent/parent-worksheets.server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ worksheetId: string }> }
) {
  const auth = await requireMobileChild(request);
  if (auth instanceof NextResponse) return auth;

  const { worksheetId: worksheetIdStr } = await params;
  const worksheetId = parseInt(worksheetIdStr, 10);
  if (Number.isNaN(worksheetId)) {
    return NextResponse.json({ error: "invalid_worksheet_id" }, { status: 400 });
  }

  const ok = await markWorksheetDone(worksheetId, auth.childId);
  if (!ok) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
