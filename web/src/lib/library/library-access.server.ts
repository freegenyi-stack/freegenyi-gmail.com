import { auth } from "@/auth";
import { db } from "@/db";
import { childDevicePairings, children, users } from "@/db/schema";
import { getChildSessionFromCookies } from "@/lib/child-session";
import { userCanAccessChild } from "@/lib/family/server";
import { isFamilyAdult } from "@/lib/family/constants";
import { canAudienceAccessBook } from "@/lib/library/audience";
import { getPublishedBookById } from "@/lib/library/books.server";
import { LIBRARY_ERROR, type LibraryErrorCode } from "@/lib/library/library-errors";
import { and, eq } from "drizzle-orm";

function bookAccessDenied(book: { audience: string } | null, ctx: "teacher" | "parent" | "child"): boolean {
  if (!book) return true;
  return !canAudienceAccessBook(book.audience as "teachers" | "parents" | "family", ctx);
}

export async function assertLibraryBookAccess(
  bookId: number
): Promise<{ ok: true; ctx: "teacher" | "parent" | "child" } | { error: LibraryErrorCode }> {
  const book = await getPublishedBookById(bookId);
  if (!book?.fileUrl) return { error: LIBRARY_ERROR.BOOK_NOT_FOUND };

  const session = await auth();
  if (session?.user?.email) {
    const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
    if (!user) return { error: LIBRARY_ERROR.UNAUTHORIZED };

    if (user.role === "enseignant") {
      if (bookAccessDenied(book, "teacher")) return { error: LIBRARY_ERROR.ACCESS_DENIED };
      return { ok: true, ctx: "teacher" };
    }

    if (isFamilyAdult(user.role)) {
      if (bookAccessDenied(book, "parent")) return { error: LIBRARY_ERROR.ACCESS_DENIED };
      return { ok: true, ctx: "parent" };
    }

    return { error: LIBRARY_ERROR.UNAUTHORIZED };
  }

  const childSession = await getChildSessionFromCookies();
  if (childSession) {
    const [pairing] = await db
      .select()
      .from(childDevicePairings)
      .where(
        and(
          eq(childDevicePairings.childId, childSession.childId),
          eq(childDevicePairings.deviceToken, childSession.deviceToken)
        )
      )
      .limit(1);
    if (!pairing) return { error: LIBRARY_ERROR.UNAUTHORIZED };
    if (bookAccessDenied(book, "child")) return { error: LIBRARY_ERROR.ACCESS_DENIED };
    return { ok: true, ctx: "child" };
  }

  return { error: LIBRARY_ERROR.UNAUTHORIZED };
}

export async function assertChildLibraryAccess(
  childId: number,
  bookId: number
): Promise<{ ok: true } | { error: LibraryErrorCode }> {
  const book = await getPublishedBookById(bookId);
  if (!book?.fileUrl || bookAccessDenied(book, "child")) return { error: LIBRARY_ERROR.BOOK_NOT_FOUND };

  const session = await auth();
  if (session?.user?.id) {
    const userId = parseInt(session.user.id, 10);
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (user && isFamilyAdult(user.role)) {
      const [child] = await db.select().from(children).where(eq(children.id, childId)).limit(1);
      if (!child) return { error: LIBRARY_ERROR.CHILD_NOT_FOUND };
      if (await userCanAccessChild(user, child)) return { ok: true };
    }
  }

  const childSession = await getChildSessionFromCookies();
  if (childSession?.childId === childId) {
    const [pairing] = await db
      .select()
      .from(childDevicePairings)
      .where(
        and(
          eq(childDevicePairings.childId, childId),
          eq(childDevicePairings.deviceToken, childSession.deviceToken)
        )
      )
      .limit(1);
    if (pairing) return { ok: true };
  }

  return { error: LIBRARY_ERROR.ACCESS_DENIED };
}

export async function assertUserLibraryAccess(
  userId: number,
  bookId: number
): Promise<{ ok: true; userId: number } | { error: LibraryErrorCode }> {
  const session = await auth();
  if (!session?.user?.id) return { error: LIBRARY_ERROR.UNAUTHORIZED };

  const sessionUserId = parseInt(session.user.id, 10);
  if (sessionUserId !== userId) return { error: LIBRARY_ERROR.ACCESS_DENIED };

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) return { error: LIBRARY_ERROR.UNAUTHORIZED };

  const book = await getPublishedBookById(bookId);
  if (!book?.fileUrl) return { error: LIBRARY_ERROR.BOOK_NOT_FOUND };

  const ctx = user.role === "enseignant" ? "teacher" : "parent";
  if (bookAccessDenied(book, ctx)) return { error: LIBRARY_ERROR.ACCESS_DENIED };

  return { ok: true, userId };
}
