import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { assertUserLibraryAccess } from "@/lib/library/library-access.server";
import {
  getUserBookReview,
  listBookReviewsForTeachers,
  upsertBookReview,
} from "@/lib/library/user-library.server";

export async function GET(req: NextRequest) {
  const bookId = parseInt(req.nextUrl.searchParams.get("bookId") || "", 10);
  const userId = parseInt(req.nextUrl.searchParams.get("userId") || "", 10);
  const scope = req.nextUrl.searchParams.get("scope");

  if (Number.isNaN(bookId)) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  if (scope === "teachers") {
    const reviews = await listBookReviewsForTeachers(bookId);
    return NextResponse.json({ reviews });
  }

  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const access = await assertUserLibraryAccess(userId, bookId);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: 403 });

  const review = await getUserBookReview(userId, bookId);
  return NextResponse.json({ review });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = (await req.json()) as {
    userId?: number;
    bookId?: number;
    rating?: number;
    comment?: string;
    visibility?: string;
  };

  const userId = body.userId ?? parseInt(session.user.id, 10);
  const bookId = body.bookId;
  const rating = body.rating;

  if (!bookId || rating == null) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const access = await assertUserLibraryAccess(userId, bookId);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: 403 });

  await upsertBookReview({
    userId,
    bookId,
    rating,
    comment: body.comment,
    visibility: body.visibility,
  });

  return NextResponse.json({ success: true });
}
