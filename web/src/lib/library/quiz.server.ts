import { db } from "@/db";
import {
  libraryQuizAttempts,
  libraryQuizQuestions,
  libraryQuizzes,
} from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";

export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
};

export type BookQuiz = {
  id: number;
  bookId: number;
  title: string;
  questions: QuizQuestion[];
};

export async function getQuizForBook(bookId: number): Promise<BookQuiz | null> {
  const [quiz] = await db
    .select()
    .from(libraryQuizzes)
    .where(and(eq(libraryQuizzes.bookId, bookId), eq(libraryQuizzes.isPublished, true)))
    .limit(1);

  if (!quiz) return null;

  const questions = await db
    .select()
    .from(libraryQuizQuestions)
    .where(eq(libraryQuizQuestions.quizId, quiz.id))
    .orderBy(asc(libraryQuizQuestions.sortOrder));

  if (!questions.length) return null;

  return {
    id: quiz.id,
    bookId: quiz.bookId,
    title: quiz.title,
    questions: questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: JSON.parse(q.optionsJson) as string[],
    })),
  };
}

export async function submitQuizAttempt(input: {
  childId: number;
  quizId: number;
  bookId: number;
  answers: number[];
  questions: QuizQuestion[];
}) {
  let score = 0;
  const questions = await db
    .select()
    .from(libraryQuizQuestions)
    .where(eq(libraryQuizQuestions.quizId, input.quizId))
    .orderBy(asc(libraryQuizQuestions.sortOrder));

  questions.forEach((q, i) => {
    if (input.answers[i] === q.correctIndex) score += 1;
  });

  const total = questions.length;
  await db.insert(libraryQuizAttempts).values({
    childId: input.childId,
    quizId: input.quizId,
    bookId: input.bookId,
    score,
    total,
    answersJson: JSON.stringify(input.answers),
  });

  return { score, total };
}

export async function ensureDefaultQuizForBook(bookId: number, bookTitle: string) {
  const existing = await getQuizForBook(bookId);
  if (existing) return existing;

  const [quiz] = await db
    .insert(libraryQuizzes)
    .values({ bookId, title: `Quiz — ${bookTitle}` })
    .returning({ id: libraryQuizzes.id });

  const defaults = [
    {
      question: "As-tu bien compris l'histoire ?",
      options: ["Oui, très bien", "Un peu", "Pas vraiment", "Je ne sais pas"],
      correctIndex: 0,
    },
    {
      question: "Qu'as-tu préféré dans ce livre ?",
      options: ["Les personnages", "L'aventure", "Les images", "La fin"],
      correctIndex: 0,
    },
    {
      question: "Tu relirais ce livre ?",
      options: ["Oui !", "Peut-être", "Non", "Avec maman/papa"],
      correctIndex: 0,
    },
  ];

  for (let i = 0; i < defaults.length; i++) {
    const d = defaults[i];
    await db.insert(libraryQuizQuestions).values({
      quizId: quiz.id,
      question: d.question,
      optionsJson: JSON.stringify(d.options),
      correctIndex: d.correctIndex,
      sortOrder: i,
    });
  }

  return getQuizForBook(bookId);
}
