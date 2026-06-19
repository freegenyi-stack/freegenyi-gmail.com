import { redirect } from "next/navigation";
import { getPublishedBookById } from "@/lib/library/books.server";
import { getTranslations } from "next-intl/server";
import BookReaderClient from "@/app/[locale]/dashboard/parent/bibliotheque/[id]/BookReaderClient";
import { requireExploreSession } from "@/lib/explore/session.server";
import { exploreBibliothequePath } from "@/lib/explore/constants";

export default async function ExploreParentBookPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id: idStr } = await params;
  await requireExploreSession("parent", locale);
  const t = await getTranslations("Explore");
  const bookId = parseInt(idStr, 10);
  const backHref = exploreBibliothequePath("parent");

  if (Number.isNaN(bookId)) redirect(`/${locale}${backHref}`);

  const book = await getPublishedBookById(bookId);
  if (!book || !book.fileUrl) redirect(`/${locale}${backHref}`);

  return (
    <>
      <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-900">
        {t("readerHint")}
      </div>
      <BookReaderClient
        bookId={bookId}
        title={book.title}
        format={book.format}
        language={book.language}
        initialLocatorJson={null}
        initialPercent={0}
        pageCount={book.pageCount}
        backHref={backHref}
      />
    </>
  );
}
