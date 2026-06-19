import { NextResponse } from "next/server";
import { requireMobileChild } from "@/lib/mobile/require-mobile-auth";
import { saveMobileChildReadingProgress } from "@/lib/mobile/child-library.server";

export async function POST(request: Request) {
  const auth = await requireMobileChild(request);
  if (auth instanceof NextResponse) return auth;

  const body = (await request.json()) as {
    bookId?: number;
    percent?: number;
    locatorJson?: string;
    location?: string;
  };

  if (!body.bookId) {
    return NextResponse.json({ error: "invalid_params" }, { status: 400 });
  }

  const result = await saveMobileChildReadingProgress({
    childId: auth.childId,
    bookId: body.bookId,
    percent: body.percent,
    locatorJson: body.locatorJson,
    location: body.location,
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.error === "forbidden" ? 403 : 404 });
  }

  return NextResponse.json({ ok: true });
}
