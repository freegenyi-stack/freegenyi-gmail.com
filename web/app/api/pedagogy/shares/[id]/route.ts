import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  deletePedagogyShare,
  recordPedagogyShareView,
  reportPedagogyShare,
  togglePedagogyShareLike,
} from "@/lib/pedagogy/shares.server";

async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  return user ?? null;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const shareId = parseInt(id, 10);
  if (Number.isNaN(shareId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const action = body.action as string;

  if (action === "like") {
    const result = await togglePedagogyShareLike(user.id, shareId);
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json(result);
  }

  if (action === "view") {
    await recordPedagogyShareView(shareId);
    return NextResponse.json({ ok: true });
  }

  if (action === "report") {
    const result = await reportPedagogyShare(user.id, shareId);
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (user.role !== "enseignant") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id } = await params;
  const shareId = parseInt(id, 10);
  if (Number.isNaN(shareId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  const result = await deletePedagogyShare(user.id, shareId);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ ok: true });
}
