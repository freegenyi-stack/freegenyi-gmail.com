import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getFamilyChildren } from "@/lib/family/server";
import { isFamilyAdult } from "@/lib/family/constants";
import { getParentDashboardInsights } from "@/lib/parent/dashboard-insights.server";
import { renderParentWeeklyReportPdf } from "@/lib/parent/parent-report-pdf.server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  if (!user || !isFamilyAdult(user.role)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const children = await getFamilyChildren(user);
  if (children.length === 0) {
    return NextResponse.json({ error: "Aucun enfant" }, { status: 404 });
  }

  const locale = req.nextUrl.searchParams.get("locale") || "fr";
  const insights = await getParentDashboardInsights(children);
  const pdf = await renderParentWeeklyReportPdf({
    parentName: user.fullName || "Parent",
    locale,
    children: insights.children,
  });

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="rapport-hebdo-freegeny.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
