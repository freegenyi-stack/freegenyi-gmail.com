import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { authoringResources, teacherDocuments, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";

/** Legacy — redirige vers l'export Mon Atelier si le document a été migré. */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const userId = parseInt(session.user.id, 10);
  const docId = parseInt((await params).id, 10);
  const format = req.nextUrl.searchParams.get("format") || "pdf";

  if (Number.isNaN(docId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || user.role !== "enseignant") {
    return NextResponse.json({ error: "Réservé aux enseignants" }, { status: 403 });
  }

  const [migrated] = await db
    .select({ id: authoringResources.id })
    .from(authoringResources)
    .where(
      and(
        eq(authoringResources.legacyDocumentId, docId),
        eq(authoringResources.ownerUserId, userId),
        eq(authoringResources.ownerRole, "enseignant")
      )
    )
    .limit(1);

  if (migrated) {
    const target = `/api/authoring/resources/${migrated.id}/export?format=${encodeURIComponent(format)}`;
    return NextResponse.redirect(new URL(target, req.url));
  }

  const [doc] = await db
    .select()
    .from(teacherDocuments)
    .where(and(eq(teacherDocuments.id, docId), eq(teacherDocuments.userId, userId)))
    .limit(1);

  if (!doc) {
    return NextResponse.json({ error: "Document introuvable" }, { status: 404 });
  }

  const target = `/dashboard/enseignant/atelier`;
  return NextResponse.redirect(new URL(target, req.url));
}
