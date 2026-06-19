import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { children, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { userCanAccessChild } from "@/lib/family/server";
import { isFamilyAdult } from "@/lib/family/constants";
import { buildChildWorkbook } from "@/lib/parent/printable-workbook.server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ childId: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { childId: childIdRaw } = await params;
  const childId = parseInt(childIdRaw, 10);
  if (Number.isNaN(childId)) {
    return NextResponse.json({ error: "Enfant invalide" }, { status: 400 });
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  if (!user || !isFamilyAdult(user.role)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const [child] = await db.select().from(children).where(eq(children.id, childId)).limit(1);
  if (!child) {
    return NextResponse.json({ error: "Enfant introuvable" }, { status: 404 });
  }

  const allowed = await userCanAccessChild(user, child);
  if (!allowed) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const locale = req.nextUrl.searchParams.get("locale") || "fr";
  const result = await buildChildWorkbook(childId, locale);
  if (!result) {
    return NextResponse.json({ error: "Enfant introuvable" }, { status: 404 });
  }

  const safeName = child.fullName.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-") || "enfant";
  const filename = `cahier-revision-${safeName}.pdf`;

  return new NextResponse(new Uint8Array(result.pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
