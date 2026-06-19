import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getPublishedBookById, getReadingProgress } from "@/lib/library/books.server";
import { getUserReadingProgress } from "@/lib/library/user-library.server";
import { getFamilyChildren } from "@/lib/family/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import BookReaderClient from "./BookReaderClient";

export default async function ParentBookReaderPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ child?: string }>;
}) {
  const { locale, id: idStr } = await params;
  const t = await getTranslations("Library");
  const { child: childParam } = await searchParams;
  const bookId = parseInt(idStr, 10);
  if (Number.isNaN(bookId)) redirect(`/${locale}/dashboard/parent/bibliotheque`);

  const session = await auth();
  if (!session?.user?.email) redirect(`/${locale}/auth/login`);

  const book = await getPublishedBookById(bookId);
  if (!book || !book.fileUrl) redirect(`/${locale}/dashboard/parent/bibliotheque`);

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));
  if (!user) redirect(`/${locale}/auth/login`);

  const children = await getFamilyChildren(user);
  const selectedChildId = childParam ? parseInt(childParam, 10) : NaN;
  const activeChild =
    childParam && !Number.isNaN(selectedChildId)
      ? children.find((c) => c.id === selectedChildId) ?? null
      : null;

  let initialLocatorJson: string | null = null;
  let initialPercent = 0;
  let childId: number | null = null;
  let userId: number | null = user.id;

  if (activeChild) {
    childId = activeChild.id;
    userId = null;
    const progress = await getReadingProgress(activeChild.id, bookId);
    initialLocatorJson = progress?.locatorJson ?? progress?.location ?? null;
    initialPercent = progress?.percent ?? 0;
  } else {
    const progress = await getUserReadingProgress(user.id, bookId);
    initialLocatorJson = progress?.locatorJson ?? null;
    initialPercent = progress?.percent ?? 0;
  }

  return (
    <>
      {children.length > 0 && (
        <div className="fixed top-4 left-1/2 z-[205] flex -translate-x-1/2 flex-wrap justify-center gap-2 rounded-2xl border border-orange-100 bg-[#FFFBF7]/95 px-3 py-2 shadow-lg shadow-orange-100/40 backdrop-blur-md">
          <a
            href={`/${locale}/dashboard/parent/bibliotheque/${bookId}`}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold ${
              !activeChild ? "bg-orange-600 text-white" : "border border-orange-200 text-slate-600"
            }`}
          >
            {t("myReading")}
          </a>
          {children.map((c) => (
            <a
              key={c.id}
              href={`/${locale}/dashboard/parent/bibliotheque/${bookId}?child=${c.id}`}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold ${
                activeChild?.id === c.id
                  ? "bg-orange-600 text-white"
                  : "border border-orange-200 text-slate-600"
              }`}
            >
              {c.fullName.split(" ")[0]}
            </a>
          ))}
        </div>
      )}
      <BookReaderClient
        bookId={bookId}
        title={book.title}
        format={book.format}
        language={book.language}
        initialLocatorJson={initialLocatorJson}
        initialPercent={initialPercent}
        pageCount={book.pageCount}
        childId={childId}
        userId={userId}
        backHref="/dashboard/parent/bibliotheque"
        readerRole="parent"
      />
    </>
  );
}
