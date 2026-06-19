import { auth } from "@/auth";
import { db } from "@/db";
import { childDevicePairings, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getPublishedBookById, getReadingProgress } from "@/lib/library/books.server";
import { getFamilyChildren, userCanAccessChild } from "@/lib/family/server";
import { redirect, notFound } from "next/navigation";
import { getChildSessionFromCookies } from "@/lib/child-session";
import BookReaderClient from "@/app/[locale]/dashboard/parent/bibliotheque/[id]/BookReaderClient";

export default async function ChildLobbyBookPage({
  params,
}: {
  params: Promise<{ locale: string; childId: string; id: string }>;
}) {
  const { locale, childId: childIdStr, id: idStr } = await params;
  const childId = parseInt(childIdStr, 10);
  const bookId = parseInt(idStr, 10);
  if (Number.isNaN(childId) || Number.isNaN(bookId)) notFound();

  const session = await auth();
  const childSession = await getChildSessionFromCookies();
  let allowed = false;

  if (session?.user?.email) {
    const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
    if (user) {
      const children = await getFamilyChildren(user);
      const child = children.find((c) => c.id === childId);
      if (child) allowed = await userCanAccessChild(user, child);
    }
  } else if (childSession?.childId === childId) {
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
    allowed = !!pairing;
  }

  if (!allowed) redirect(`/${locale}/child`);

  const book = await getPublishedBookById(bookId);
  if (!book?.fileUrl) redirect(`/${locale}/lobby/${childId}/bibliotheque`);

  const progress = await getReadingProgress(childId, bookId);
  const initialLocatorJson = progress?.locatorJson ?? progress?.location ?? null;
  const initialPercent = progress?.percent ?? 0;

  return (
    <BookReaderClient
      bookId={bookId}
      title={book.title}
      format={book.format}
      language={book.language}
      initialLocatorJson={initialLocatorJson}
      initialPercent={initialPercent}
      pageCount={book.pageCount}
      childId={childId}
      backHref={`/lobby/${childId}/bibliotheque`}
      kioskMode
      readerRole="child"
    />
  );
}
