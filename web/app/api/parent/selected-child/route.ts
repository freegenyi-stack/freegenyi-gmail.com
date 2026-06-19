import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { children, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { userCanAccessChild } from "@/lib/family/server";
import { isFamilyAdult } from "@/lib/family/constants";
import { PARENT_CHILD_COOKIE } from "@/lib/parent/selected-child";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  if (!user || !isFamilyAdult(user.role)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = (await req.json()) as { childId?: number };
  const childId = body.childId;
  if (!childId || Number.isNaN(childId)) {
    return NextResponse.json({ error: "Enfant invalide" }, { status: 400 });
  }

  const [child] = await db.select().from(children).where(eq(children.id, childId)).limit(1);
  if (!child) {
    return NextResponse.json({ error: "Enfant introuvable" }, { status: 404 });
  }

  const allowed = await userCanAccessChild(user, child);
  if (!allowed) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const res = NextResponse.json({ success: true, childId });
  res.cookies.set(PARENT_CHILD_COOKIE, String(childId), {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    httpOnly: false,
  });
  return res;
}
