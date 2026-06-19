import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getPublishedBookById } from "@/lib/library/books.server";
import { getUserReadingProgress } from "@/lib/library/user-library.server";
import { redirect } from "next/navigation";
import { requireTeacherPage } from "@/lib/teacher/requireTeacherPage";
import BookReaderClient from "@/app/[locale]/dashboard/parent/bibliotheque/[id]/BookReaderClient";

export default async function TeacherBookReaderPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id: idStr } = await params;
  await requireTeacherPage(locale);

  const bookId = parseInt(idStr, 10);
  if (Number.isNaN(bookId)) redirect(`/${locale}/dashboard/enseignant/bibliotheque`);

  const session = await auth();
  if (!session?.user?.email) redirect(`/${locale}/auth/login`);

  const book = await getPublishedBookById(bookId);
  if (!book?.fileUrl) redirect(`/${locale}/dashboard/enseignant/bibliotheque`);

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));
  if (!user) redirect(`/${locale}/auth/login`);

  const progress = await getUserReadingProgress(user.id, bookId);

  return (
    <BookReaderClient
      bookId={bookId}
      title={book.title}
      format={book.format}
      language={book.language}
      initialLocatorJson={progress?.locatorJson ?? null}
      initialPercent={progress?.percent ?? 0}
      pageCount={book.pageCount}
      userId={user.id}
      backHref="/dashboard/enseignant/bibliotheque"
      readerRole="teacher"
    />
  );
}
