import { NextRequest, NextResponse } from "next/server";
import { sendParentMissionAlerts, sendParentWeeklyDigest } from "@/lib/parent/parent-notify.server";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET non configuré" }, { status: 503 });
  }
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const dryRun = req.nextUrl.searchParams.get("dryRun") === "1";
  const locale = req.nextUrl.searchParams.get("locale") || "fr";
  const result = await sendParentWeeklyDigest({ locale, dryRun });
  return NextResponse.json(result);
}
