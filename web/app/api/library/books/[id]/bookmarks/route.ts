import { NextRequest, NextResponse } from "next/server";
import { assertChildLibraryAccess } from "@/lib/library/library-access.server";
import { db } from "@/db";
import { libraryBookmarks } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const childId = parseInt(req.nextUrl.searchParams.get("childId") || "", 10);
  const { id } = await params;
  const bookId = parseInt(id, 10);
  if (Number.isNaN(bookId) || Number.isNaN(childId)) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const access = await assertChildLibraryAccess(childId, bookId);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: 403 });

  const rows = await db
    .select()
    .from(libraryBookmarks)
    .where(and(eq(libraryBookmarks.childId, childId), eq(libraryBookmarks.bookId, bookId)))
    .orderBy(desc(libraryBookmarks.createdAt));

  return NextResponse.json({
    bookmarks: rows.map((r) => ({
      id: r.id,
      locator: JSON.parse(r.locatorJson),
      label: r.label,
      noteText: r.noteText,
      kind: r.kind,
      createdAt: r.createdAt,
    })),
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bookId = parseInt(id, 10);
  const body = (await req.json()) as {
    childId?: number;
    locator?: unknown;
    label?: string;
    noteText?: string;
    kind?: string;
  };

  if (!body.childId || !body.locator || Number.isNaN(bookId)) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const access = await assertChildLibraryAccess(body.childId, bookId);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: 403 });

  const [row] = await db
    .insert(libraryBookmarks)
    .values({
      childId: body.childId,
      bookId,
      locatorJson: JSON.stringify(body.locator),
      label: body.label?.trim() || null,
      noteText: body.noteText?.trim() || null,
      kind: body.kind || "bookmark",
    })
    .returning({ id: libraryBookmarks.id });

  return NextResponse.json({ id: row.id });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const bookmarkId = parseInt(req.nextUrl.searchParams.get("bookmarkId") || "", 10);
  const childId = parseInt(req.nextUrl.searchParams.get("childId") || "", 10);
  const { id } = await params;
  const bookId = parseInt(id, 10);

  if (Number.isNaN(bookmarkId) || Number.isNaN(childId) || Number.isNaN(bookId)) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const access = await assertChildLibraryAccess(childId, bookId);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: 403 });

  await db
    .delete(libraryBookmarks)
    .where(
      and(
        eq(libraryBookmarks.id, bookmarkId),
        eq(libraryBookmarks.childId, childId),
        eq(libraryBookmarks.bookId, bookId)
      )
    );

  return NextResponse.json({ success: true });
}
