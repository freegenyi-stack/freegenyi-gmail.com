import { NextRequest, NextResponse } from "next/server";
import { assertChildLibraryAccess } from "@/lib/library/library-access.server";
import { ensureDefaultQuizForBook, getQuizForBook, submitQuizAttempt } from "@/lib/library/quiz.server";
import { getPublishedBookById } from "@/lib/library/books.server";
import { awardChildBadges } from "@/lib/library/badges.server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bookId = parseInt(id, 10);
  const childId = parseInt(req.nextUrl.searchParams.get("childId") || "", 10);
  if (Number.isNaN(bookId) || Number.isNaN(childId)) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const access = await assertChildLibraryAccess(childId, bookId);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: 403 });

  const book = await getPublishedBookById(bookId);
  if (!book) return NextResponse.json({ error: "Livre introuvable" }, { status: 404 });

  let quiz = await getQuizForBook(bookId);
  if (!quiz && req.nextUrl.searchParams.get("ensure") === "1") {
    quiz = await ensureDefaultQuizForBook(bookId, book.title);
  }

  if (!quiz) return NextResponse.json({ quiz: null });

  return NextResponse.json({
    quiz: {
      id: quiz.id,
      title: quiz.title,
      questions: quiz.questions.map((q) => ({ id: q.id, question: q.question, options: q.options })),
    },
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bookId = parseInt(id, 10);
  const body = (await req.json()) as {
    childId?: number;
    quizId?: number;
    answers?: number[];
  };

  if (!body.childId || !body.quizId || !body.answers || Number.isNaN(bookId)) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const access = await assertChildLibraryAccess(body.childId, bookId);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: 403 });

  const quiz = await getQuizForBook(bookId);
  if (!quiz || quiz.id !== body.quizId) {
    return NextResponse.json({ error: "Quiz introuvable" }, { status: 404 });
  }

  const result = await submitQuizAttempt({
    childId: body.childId,
    quizId: body.quizId,
    bookId,
    answers: body.answers,
    questions: quiz.questions,
  });

  const badges = await awardChildBadges(body.childId);

  return NextResponse.json({ ...result, badges });
}
