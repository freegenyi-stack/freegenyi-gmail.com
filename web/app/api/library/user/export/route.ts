import { NextRequest, NextResponse } from "next/server";
import { assertUserLibraryAccess } from "@/lib/library/library-access.server";
import { exportAnnotationsMarkdown, exportAnnotationsPdf } from "@/lib/library/user-library.server";
import { getPublishedBookById } from "@/lib/library/books.server";

export async function GET(req: NextRequest) {
  const userId = parseInt(req.nextUrl.searchParams.get("userId") || "", 10);
  const bookId = parseInt(req.nextUrl.searchParams.get("bookId") || "", 10);
  const format = req.nextUrl.searchParams.get("format") || "md";

  if (Number.isNaN(userId) || Number.isNaN(bookId)) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const access = await assertUserLibraryAccess(userId, bookId);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: 403 });

  const book = await getPublishedBookById(bookId);
  const title = book?.title ?? "Livre";

  if (format === "pdf") {
    const pdf = await exportAnnotationsPdf(userId, bookId, title);
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="annotations-${bookId}.pdf"`,
      },
    });
  }

  const md = await exportAnnotationsMarkdown(userId, bookId, title);
  return new NextResponse(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="annotations-${bookId}.md"`,
    },
  });
}
