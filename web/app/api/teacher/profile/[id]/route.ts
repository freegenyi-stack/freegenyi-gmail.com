import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getTeacherPublicProfile } from "@/lib/teacher/profile.server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const [viewer] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  if (!viewer) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const role = viewer.role || "";
  if (!["parent", "coparent", "enseignant"].includes(role)) {
    return NextResponse.json({ error: "Accès réservé" }, { status: 403 });
  }

  const { id } = await params;
  const teacherId = parseInt(id, 10);
  if (Number.isNaN(teacherId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  const profile = await getTeacherPublicProfile(teacherId, viewer.id);
  if (!profile) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });

  return NextResponse.json({ profile });
}
