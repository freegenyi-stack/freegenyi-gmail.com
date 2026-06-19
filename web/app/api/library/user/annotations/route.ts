import { NextRequest, NextResponse } from "next/server";
import { assertUserLibraryAccess } from "@/lib/library/library-access.server";
import {
  addUserAnnotation,
  deleteUserAnnotation,
  listUserAnnotations,
} from "@/lib/library/user-library.server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id?: string }> }
) {
  void params;
  const userId = parseInt(req.nextUrl.searchParams.get("userId") || "", 10);
  const bookId = parseInt(req.nextUrl.searchParams.get("bookId") || "", 10);
  if (Number.isNaN(userId) || Number.isNaN(bookId)) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const access = await assertUserLibraryAccess(userId, bookId);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: 403 });

  const annotations = await listUserAnnotations(userId, bookId);
  return NextResponse.json({ annotations });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    userId?: number;
    bookId?: number;
    locator?: unknown;
    label?: string;
    noteText?: string;
    kind?: string;
    color?: string;
  };

  if (!body.userId || !body.bookId || !body.locator) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const access = await assertUserLibraryAccess(body.userId, body.bookId);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: 403 });

  const id = await addUserAnnotation({
    userId: body.userId,
    bookId: body.bookId,
    locator: body.locator,
    label: body.label,
    noteText: body.noteText,
    kind: body.kind,
    color: body.color,
  });

  return NextResponse.json({ id });
}

export async function DELETE(req: NextRequest) {
  const userId = parseInt(req.nextUrl.searchParams.get("userId") || "", 10);
  const bookId = parseInt(req.nextUrl.searchParams.get("bookId") || "", 10);
  const annotationId = parseInt(req.nextUrl.searchParams.get("annotationId") || "", 10);

  if (Number.isNaN(userId) || Number.isNaN(bookId) || Number.isNaN(annotationId)) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const access = await assertUserLibraryAccess(userId, bookId);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: 403 });

  await deleteUserAnnotation(userId, bookId, annotationId);
  return NextResponse.json({ success: true });
}
