import { NextRequest, NextResponse } from "next/server";
import { assertChildLibraryAccess } from "@/lib/library/library-access.server";
import { saveReadingProgress } from "@/lib/library/books.server";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    childId?: number;
    bookId?: number;
    locatorJson?: string;
    percent?: number;
    location?: string;
  };

  const childId = body.childId;
  const bookId = body.bookId;
  if (!childId || !bookId) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const access = await assertChildLibraryAccess(childId, bookId);
  if ("error" in access) {
    return NextResponse.json({ error: access.error }, { status: 403 });
  }

  await saveReadingProgress({
    childId,
    bookId,
    locatorJson: body.locatorJson,
    location: body.location,
    percent: body.percent ?? 0,
  });

  return NextResponse.json({ success: true });
}
