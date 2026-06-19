import { assertLibraryBookAccess } from "@/lib/library/library-access.server";
import { LIBRARY_ERROR, libraryAccessHttpStatus } from "@/lib/library/library-errors";
import { readReadiumResource } from "@/lib/library/readium.server";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; path: string[] }> }
) {
  const { id, path: pathParts } = await params;
  const bookId = parseInt(id, 10);
  if (Number.isNaN(bookId) || !pathParts?.length) {
    return NextResponse.json({ error: LIBRARY_ERROR.INVALID_BOOK }, { status: 400 });
  }

  const access = await assertLibraryBookAccess(bookId);
  if ("error" in access) {
    return NextResponse.json({ error: access.error }, { status: libraryAccessHttpStatus(access.error) });
  }

  const entryPath = pathParts.map(decodeURIComponent).join("/");
  const resource = await readReadiumResource(bookId, entryPath);
  if (!resource) {
    return NextResponse.json({ error: "Ressource introuvable" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(resource.buffer), {
    headers: {
      "Content-Type": resource.contentType,
      "Cache-Control": "private, max-age=86400",
    },
  });
}
