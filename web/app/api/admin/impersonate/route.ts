import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminSession } from "@/lib/admin/requireAdmin";
import { clearImpersonationCookies, setImpersonationCookies } from "@/lib/admin/impersonate";

export async function POST(req: NextRequest) {
  const admin = await requireAdminSession();
  if ("error" in admin) {
    return NextResponse.json({ error: admin.error }, { status: 401 });
  }

  const body = (await req.json()) as { userId?: number };
  const targetId = body.userId;
  if (!targetId || Number.isNaN(targetId)) {
    return NextResponse.json({ error: "userId requis" }, { status: 400 });
  }

  const session = await auth();
  const adminId = session?.user?.id ? parseInt(session.user.id, 10) : 0;
  if (!adminId) return NextResponse.json({ error: "Session invalide" }, { status: 401 });

  const [target] = await db.select().from(users).where(eq(users.id, targetId)).limit(1);
  if (!target) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  if (target.email === admin.email) {
    return NextResponse.json({ error: "Impossible de s'impersonate soi-même" }, { status: 400 });
  }

  await setImpersonationCookies(targetId, adminId);

  return NextResponse.json({
    success: true,
    redirect: `/dashboard/${target.role === "enseignant" ? "enseignant" : target.role === "admin" ? "admin" : "parent"}`,
    targetName: target.fullName || target.email,
  });
}

export async function DELETE() {
  const admin = await requireAdminSession();
  if ("error" in admin) {
    return NextResponse.json({ error: admin.error }, { status: 401 });
  }

  await clearImpersonationCookies();
  return NextResponse.json({ success: true, redirect: "/dashboard/admin" });
}
