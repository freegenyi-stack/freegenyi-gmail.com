import { db } from "@/db";
import {
  libraryBookAnnexes,
  libraryBooks,
  libraryQuizQuestions,
  libraryQuizzes,
} from "@/db/schema";
import { deleteLibraryFiles } from "@/lib/library/library-upload.server";
import type { BookQuiz } from "@/lib/library/quiz.server";
import { and, asc, eq } from "drizzle-orm";

export type AdminAnnex = {
  id: number;
  bookId: number;
  title: string;
  url: string;
  kind: string;
  sortOrder: number;
};

export async function listAnnexesForBook(bookId: number): Promise<AdminAnnex[]> {
  const rows = await db
    .select()
    .from(libraryBookAnnexes)
    .where(eq(libraryBookAnnexes.bookId, bookId))
    .orderBy(asc(libraryBookAnnexes.sortOrder));
  return rows.map((r) => ({
    id: r.id,
    bookId: r.bookId,
    title: r.title,
    url: r.url,
    kind: r.kind,
    sortOrder: r.sortOrder,
  }));
}

export async function upsertAnnex(input: {
  id?: number;
  bookId: number;
  title: string;
  url: string;
  kind?: string;
  sortOrder?: number;
}) {
  const values = {
    bookId: input.bookId,
    title: input.title.trim(),
    url: input.url.trim(),
    kind: input.kind?.trim() || "link",
    sortOrder: input.sortOrder ?? 0,
  };
  if (input.id) {
    await db.update(libraryBookAnnexes).set(values).where(eq(libraryBookAnnexes.id, input.id));
    return { id: input.id };
  }
  const [row] = await db.insert(libraryBookAnnexes).values(values).returning({ id: libraryBookAnnexes.id });
  return { id: row.id };
}

export async function deleteAnnex(id: number) {
  await db.delete(libraryBookAnnexes).where(eq(libraryBookAnnexes.id, id));
}

export async function getAdminQuizForBook(bookId: number): Promise<(BookQuiz & { isPublished: boolean }) | null> {
  const [quiz] = await db.select().from(libraryQuizzes).where(eq(libraryQuizzes.bookId, bookId)).limit(1);
  if (!quiz) return null;

  const questions = await db
    .select()
    .from(libraryQuizQuestions)
    .where(eq(libraryQuizQuestions.quizId, quiz.id))
    .orderBy(asc(libraryQuizQuestions.sortOrder));

  return {
    id: quiz.id,
    bookId: quiz.bookId,
    title: quiz.title,
    isPublished: quiz.isPublished,
    questions: questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: JSON.parse(q.optionsJson) as string[],
      correctIndex: q.correctIndex,
      sortOrder: q.sortOrder,
    })),
  };
}

export async function upsertQuiz(input: { bookId: number; title: string; isPublished?: boolean }) {
  const [existing] = await db
    .select()
    .from(libraryQuizzes)
    .where(eq(libraryQuizzes.bookId, input.bookId))
    .limit(1);

  if (existing) {
    await db
      .update(libraryQuizzes)
      .set({
        title: input.title.trim(),
        isPublished: input.isPublished ?? existing.isPublished,
      })
      .where(eq(libraryQuizzes.id, existing.id));
    return { id: existing.id };
  }

  const [row] = await db
    .insert(libraryQuizzes)
    .values({
      bookId: input.bookId,
      title: input.title.trim(),
      isPublished: input.isPublished ?? true,
    })
    .returning({ id: libraryQuizzes.id });
  return { id: row.id };
}

export async function upsertQuizQuestion(input: {
  id?: number;
  quizId: number;
  question: string;
  options: string[];
  correctIndex: number;
  sortOrder?: number;
}) {
  const options = input.options.map((o) => o.trim()).filter(Boolean);
  if (options.length < 2) throw new Error("Au moins 2 options requises");

  const values = {
    quizId: input.quizId,
    question: input.question.trim(),
    optionsJson: JSON.stringify(options),
    correctIndex: Math.min(Math.max(0, input.correctIndex), options.length - 1),
    sortOrder: input.sortOrder ?? 0,
  };

  if (input.id) {
    await db.update(libraryQuizQuestions).set(values).where(eq(libraryQuizQuestions.id, input.id));
    return { id: input.id };
  }
  const [row] = await db.insert(libraryQuizQuestions).values(values).returning({ id: libraryQuizQuestions.id });
  return { id: row.id };
}

export async function deleteQuizQuestion(id: number) {
  await db.delete(libraryQuizQuestions).where(eq(libraryQuizQuestions.id, id));
}

export async function deleteBook(id: number) {
  await deleteLibraryFiles(id);
  await db.delete(libraryBooks).where(eq(libraryBooks.id, id));
}

export async function setBookFeatured(bookId: number, featured: boolean) {
  await db
    .update(libraryBooks)
    .set({
      isFeatured: featured,
      updatedAt: new Date(),
    })
    .where(eq(libraryBooks.id, bookId));
}
