"use client";

import ReadiumLuxuryReader from "@/components/library/ReadiumLuxuryReader";
import PdfReaderClient from "@/components/library/PdfReaderClient";

type Props = {
  bookId: number;
  title: string;
  format: string;
  language: string | null;
  initialLocatorJson: string | null;
  initialPercent?: number;
  pageCount?: number | null;
  childId?: number | null;
  userId?: number | null;
  backHref: string;
  kioskMode?: boolean;
  readerRole?: "parent" | "teacher" | "child";
};

export default function BookReaderClient({
  bookId,
  title,
  format,
  language,
  initialLocatorJson,
  initialPercent = 0,
  pageCount = null,
  childId = null,
  userId = null,
  backHref,
  kioskMode,
  readerRole,
}: Props) {
  if (format === "pdf") {
    return (
      <PdfReaderClient
        bookId={bookId}
        title={title}
        backHref={backHref}
        userId={userId}
        childId={childId}
        initialPercent={initialPercent}
        initialLocatorJson={initialLocatorJson}
        pageCount={pageCount}
        language={language}
        readerRole={readerRole ?? (childId ? "child" : "parent")}
      />
    );
  }

  return (
    <ReadiumLuxuryReader
      bookId={bookId}
      title={title}
      childId={childId}
      userId={userId}
      language={language}
      backHref={backHref}
      initialLocatorJson={initialLocatorJson}
      kioskMode={kioskMode}
      readerRole={readerRole ?? (childId ? "child" : "parent")}
    />
  );
}
