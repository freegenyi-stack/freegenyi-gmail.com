import { NextResponse } from "next/server";
import { requireMobileChild } from "@/lib/mobile/require-mobile-auth";
import { getMobileChildBookDetail } from "@/lib/mobile/child-library.server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  const auth = await requireMobileChild(request);
  if (auth instanceof NextResponse) return auth;

  const { bookId: bookIdStr } = await params;
  const bookId = parseInt(bookIdStr, 10);
  if (Number.isNaN(bookId)) {
    return NextResponse.json({ error: "invalid_book_id" }, { status: 400 });
  }

  const result = await getMobileChildBookDetail(auth.childId, bookId);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.error === "forbidden" ? 403 : 404 });
  }

  return NextResponse.json(result);
}
