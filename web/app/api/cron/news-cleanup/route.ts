import { NextRequest, NextResponse } from "next/server";
import { purgeExpiredNewsArticles } from "@/lib/news/articles.server";

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
  if (dryRun) {
    return NextResponse.json({ ok: true, dryRun: true, message: "Purge simulée — rien supprimé" });
  }

  const result = await purgeExpiredNewsArticles();
  return NextResponse.json({ ok: true, ...result });
}
