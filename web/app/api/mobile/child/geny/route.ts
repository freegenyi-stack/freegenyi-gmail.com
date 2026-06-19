import { NextResponse } from "next/server";
import { requireMobileChild } from "@/lib/mobile/require-mobile-auth";
import { getPendingWorksheetsForChild } from "@/lib/parent/parent-worksheets.server";

export async function GET(request: Request) {
  const auth = await requireMobileChild(request);
  if (auth instanceof NextResponse) return auth;

  const worksheets = await getPendingWorksheetsForChild(auth.childId, 20);
  return NextResponse.json({ worksheets });
}
