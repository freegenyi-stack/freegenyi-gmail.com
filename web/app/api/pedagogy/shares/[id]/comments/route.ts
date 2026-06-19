import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { pedagogyShares, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  addPedagogyShareComment,
  deletePedagogyShareComment,
  listPedagogyShareCommentsForUser,
  reportPedagogyShareComment,
} from "@/lib/pedagogy/shares.server";

async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  return user ?? null;
}

async function getShareAuthorId(shareId: number) {
  const [share] = await db
    .select({ authorId: pedagogyShares.authorId })
    .from(pedagogyShares)
    .where(eq(pedagogyShares.id, shareId))
    .limit(1);
  return share?.authorId ?? null;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const shareId = parseInt(id, 10);
  if (Number.isNaN(shareId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  const shareAuthorId = await getShareAuthorId(shareId);
  const comments = await listPedagogyShareCommentsForUser(shareId, user.id, shareAuthorId ?? undefined);
  return NextResponse.json({ comments });
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
  const action = String(body.action || "create");

  if (action === "report") {
    const commentId = parseInt(String(body.commentId || ""), 10);
    if (Number.isNaN(commentId)) {
      return NextResponse.json({ error: "Commentaire invalide" }, { status: 400 });
    }
    const result = await reportPedagogyShareComment(user.id, shareId, commentId);
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json(result);
  }

  const text = String(body.body || "").trim();
  if (!text) return NextResponse.json({ error: "Commentaire vide" }, { status: 400 });

  const result = await addPedagogyShareComment(user.id, shareId, text);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json(result);
}

export async function DELETE(
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
  const commentId = parseInt(String(body.commentId || ""), 10);
  if (Number.isNaN(commentId)) {
    return NextResponse.json({ error: "Commentaire invalide" }, { status: 400 });
  }

  const result = await deletePedagogyShareComment(user.id, shareId, commentId);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ ok: true });
}
