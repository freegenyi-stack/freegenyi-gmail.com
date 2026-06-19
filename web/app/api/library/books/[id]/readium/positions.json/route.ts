import { assertLibraryBookAccess } from "@/lib/library/library-access.server";
import { LIBRARY_ERROR, libraryAccessHttpStatus } from "@/lib/library/library-errors";
import { getReadiumPositions } from "@/lib/library/readium.server";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bookId = parseInt(id, 10);
  if (Number.isNaN(bookId)) {
    return NextResponse.json({ error: LIBRARY_ERROR.INVALID_BOOK }, { status: 400 });
  }

  const access = await assertLibraryBookAccess(bookId);
  if ("error" in access) {
    return NextResponse.json({ error: access.error }, { status: libraryAccessHttpStatus(access.error) });
  }

  const positions = await getReadiumPositions(bookId);
  if (!positions) {
    return NextResponse.json({ error: "Positions introuvables" }, { status: 404 });
  }

  return NextResponse.json(positions, {
    headers: {
      "Content-Type": "application/vnd.readium.position-list+json",
      "Cache-Control": "private, max-age=300",
    },
  });
}
