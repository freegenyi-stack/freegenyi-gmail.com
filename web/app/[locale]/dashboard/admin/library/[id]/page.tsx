import React from "react";
import { notFound } from "next/navigation";
import { getAdminQuizForBook, listAnnexesForBook } from "@/lib/library/admin.server";
import { getBookById } from "@/lib/library/books.server";
import AdminBookDetailClient from "./AdminBookDetailClient";

export default async function AdminBookDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const bookId = parseInt(id, 10);
  if (Number.isNaN(bookId)) notFound();

  const book = await getBookById(bookId);
  if (!book) notFound();

  const [annexes, quiz] = await Promise.all([listAnnexesForBook(bookId), getAdminQuizForBook(bookId)]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">{book.title}</h1>
        <p className="mt-1 text-sm text-slate-500">Administration — quiz, annexes, métadonnées</p>
      </div>
      <AdminBookDetailClient book={book} annexes={annexes} quiz={quiz} />
    </div>
  );
}
