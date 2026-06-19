import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { children, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { userCanAccessChild } from "@/lib/family/server";
import { isFamilyAdult } from "@/lib/family/constants";
import { buildProgramSectionDetail } from "@/lib/curriculum/hub.server";
import { loadBundleFromFiles } from "@/lib/curriculum/loader.server";
import { buildSessionPayload } from "@/lib/curriculum/session-builder.server";
import { pickCompetencyWithExercises } from "@/lib/curriculum/assign.server";
import { curriculumSessionToPrintHtml } from "@/lib/curriculum/print.server";
import type { CurriculumSubject } from "@/lib/curriculum/types";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const sp = req.nextUrl.searchParams;
  const childId = parseInt(sp.get("childId") ?? "", 10);
  const maqtaId = sp.get("maqtaId");
  const subject = (sp.get("subject") ?? "ar_islam_civique") as CurriculumSubject;

  if (!childId || !maqtaId) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  const userId = parseInt(session.user.id, 10);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || (!isFamilyAdult(user.role) && user.role !== "teacher")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const [child] = await db.select().from(children).where(eq(children.id, childId)).limit(1);
  if (!child) return NextResponse.json({ error: "Enfant introuvable" }, { status: 404 });

  if (user.role !== "teacher") {
    const allowed = await userCanAccessChild(user, child);
    if (!allowed) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const detail = await buildProgramSectionDetail("DZ", "1AP", subject, maqtaId);
  if (!detail) return NextResponse.json({ error: "Section introuvable" }, { status: 404 });

  const bundle = await loadBundleFromFiles("DZ", "1AP", subject);
  const competencyId = pickCompetencyWithExercises(detail, bundle);
  if (!competencyId || !bundle) {
    return NextResponse.json({ error: "Aucun exercice à imprimer pour cette section." }, { status: 404 });
  }

  const built = buildSessionPayload({
    bundle,
    competencyId,
    source: user.role === "teacher" ? "teacher_quick" : "parent_geny",
    itemsMin: 4,
    itemsMax: 6,
  });
  if ("error" in built) {
    return NextResponse.json({ error: built.error }, { status: 404 });
  }

  const html = curriculumSessionToPrintHtml(built, {
    childName: child.fullName,
    sectionTitle: detail.titreFr,
  });

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
