import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  addNewsComment,
  deleteOwnNewsComment,
  listNewsComments,
  reportNewsComment,
  toggleNewsCommentLike,
  type NewsCommentAttachmentType,
} from "@/lib/news/comments.server";
import { saveNewsCommentMedia } from "@/lib/news/news-comment-media.server";

async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  if (!user || !["enseignant", "parent", "coparent"].includes(user.role || "")) return null;
  return user;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const articleId = parseInt(id, 10);
  if (Number.isNaN(articleId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  const result = await listNewsComments(articleId, user.id);
  return NextResponse.json(result);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const articleId = parseInt(id, 10);
  if (Number.isNaN(articleId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    try {
      const formData = await req.formData();
      const body = String(formData.get("body") ?? "");
      const parentRaw = formData.get("parentId");
      const parentId = parentRaw ? parseInt(String(parentRaw), 10) : null;
      const attachmentSticker = String(formData.get("attachmentSticker") ?? "").trim() || null;
      const attachmentUrlField = String(formData.get("attachmentUrl") ?? "").trim() || null;
      const attachmentTypeField = String(formData.get("attachmentType") ?? "none") as NewsCommentAttachmentType;
      const file = formData.get("file") as File | null;

      let attachmentType: NewsCommentAttachmentType = attachmentTypeField;
      let attachmentUrl = attachmentUrlField;

      if (file && file.size > 0) {
        const saved = await saveNewsCommentMedia(user.id, file);
        attachmentType = saved.attachmentType;
        attachmentUrl = saved.url;
      } else if (attachmentSticker) {
        attachmentType = "sticker";
      } else if (attachmentUrl && attachmentType === "gif") {
        attachmentType = "gif";
      }

      const result = await addNewsComment(user.id, articleId, {
        body,
        parentId: Number.isNaN(parentId as number) ? null : parentId,
        attachmentType,
        attachmentUrl,
        attachmentSticker,
      });

      if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
      return NextResponse.json(result, { status: 201 });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Envoi impossible.";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
  }

  const body = (await req.json()) as {
    body?: string;
    action?: string;
    commentId?: number;
    parentId?: number | null;
    attachmentType?: NewsCommentAttachmentType;
    attachmentUrl?: string | null;
    attachmentSticker?: string | null;
  };

  if (body.action === "like" && body.commentId) {
    const result = await toggleNewsCommentLike(user.id, body.commentId);
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json(result);
  }

  if (body.action === "report" && body.commentId) {
    const result = await reportNewsComment(user.id, body.commentId);
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "delete" && body.commentId) {
    const result = await deleteOwnNewsComment(user.id, body.commentId);
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  const result = await addNewsComment(user.id, articleId, {
    body: body.body,
    parentId: body.parentId,
    attachmentType: body.attachmentType,
    attachmentUrl: body.attachmentUrl,
    attachmentSticker: body.attachmentSticker,
  });

  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json(result, { status: 201 });
}
