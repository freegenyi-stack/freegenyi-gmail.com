import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { searchPublishedResources } from "@/lib/authoring/resources.server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const q = req.nextUrl.searchParams.get("q") ?? "";
  const limitRaw = req.nextUrl.searchParams.get("limit");
  const limit = limitRaw ? Math.min(50, Math.max(1, parseInt(limitRaw, 10) || 20)) : 20;

  const resources = await searchPublishedResources(q, limit);
  return NextResponse.json({ resources });
}
