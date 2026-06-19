import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getFamilyChildren } from "@/lib/family/server";
import { isFamilyAdult } from "@/lib/family/constants";
import { buildFamilyWorkbook } from "@/lib/parent/printable-workbook.server";

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
  const result = await buildFamilyWorkbook(
    children.map((c) => c.id),
    locale
  );
  if (!result) {
    return NextResponse.json({ error: "Génération impossible" }, { status: 500 });
  }

  return new NextResponse(new Uint8Array(result.pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="cahier-famille-freegeny.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
