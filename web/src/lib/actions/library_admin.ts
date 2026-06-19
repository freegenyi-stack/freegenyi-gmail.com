"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin/requireAdmin";
import {
  deleteAnnex,
  deleteBook,
  deleteQuizQuestion,
  listAnnexesForBook,
  getAdminQuizForBook,
  setBookFeatured,
  upsertAnnex,
  upsertQuiz,
  upsertQuizQuestion,
} from "@/lib/library/admin.server";
import { getBookById, toggleBookPublished, upsertLibraryBook } from "@/lib/library/books.server";
import { parseAudience } from "@/lib/library/audience";

function revalidateLibrary() {
  revalidatePath("/dashboard/admin/library");
  revalidatePath("/dashboard/parent/bibliotheque");
  revalidatePath("/dashboard/enseignant/bibliotheque");
}

export async function createLibraryBookAction(formData: FormData) {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  const title = (formData.get("title") as string)?.trim();
  if (!title) return { error: "Titre obligatoire." };

  const ageMinStr = formData.get("ageMin") as string;
  const ageMaxStr = formData.get("ageMax") as string;

  await upsertLibraryBook({
    title,
    author: (formData.get("author") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
    fileUrl: (formData.get("fileUrl") as string) || undefined,
    coverUrl: (formData.get("coverUrl") as string) || undefined,
    subject: (formData.get("subject") as string) || undefined,
    language: (formData.get("language") as string) || "fr",
    audience: parseAudience(formData.get("audience") as string),
    ageMin: ageMinStr ? parseInt(ageMinStr, 10) : null,
    ageMax: ageMaxStr ? parseInt(ageMaxStr, 10) : null,
    isPublished: formData.get("isPublished") === "true",
  });

  revalidateLibrary();
  return { success: true };
}

export async function updateLibraryBookAction(formData: FormData) {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  const id = parseInt((formData.get("id") as string) || "", 10);
  if (Number.isNaN(id)) return { error: "ID invalide." };

  const title = (formData.get("title") as string)?.trim();
  if (!title) return { error: "Titre obligatoire." };

  const ageMinStr = formData.get("ageMin") as string;
  const ageMaxStr = formData.get("ageMax") as string;

  await upsertLibraryBook({
    id,
    title,
    author: (formData.get("author") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
    fileUrl: (formData.get("fileUrl") as string) || undefined,
    coverUrl: (formData.get("coverUrl") as string) || undefined,
    subject: (formData.get("subject") as string) || undefined,
    language: (formData.get("language") as string) || "fr",
    audience: parseAudience(formData.get("audience") as string),
    ageMin: ageMinStr ? parseInt(ageMinStr, 10) : null,
    ageMax: ageMaxStr ? parseInt(ageMaxStr, 10) : null,
    isPublished: formData.get("isPublished") === "true",
  });

  revalidateLibrary();
  revalidatePath(`/dashboard/admin/library/${id}`);
  return { success: true };
}

export async function toggleLibraryBookAction(id: number, isPublished: boolean) {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  await toggleBookPublished(id, isPublished);
  revalidateLibrary();
  return { success: true };
}

export async function deleteLibraryBookAction(id: number) {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  await deleteBook(id);
  revalidateLibrary();
  return { success: true };
}

export async function toggleFeaturedBookAction(bookId: number, featured: boolean) {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  await setBookFeatured(bookId, featured);
  revalidateLibrary();
  return { success: true };
}

export async function saveAnnexAction(formData: FormData) {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  const bookId = parseInt((formData.get("bookId") as string) || "", 10);
  const idStr = formData.get("id") as string;
  const id = idStr ? parseInt(idStr, 10) : undefined;
  const title = (formData.get("title") as string)?.trim();
  const url = (formData.get("url") as string)?.trim();

  if (Number.isNaN(bookId) || !title || !url) return { error: "Champs invalides." };

  await upsertAnnex({
    id: id && !Number.isNaN(id) ? id : undefined,
    bookId,
    title,
    url,
    kind: (formData.get("kind") as string) || "link",
    sortOrder: parseInt((formData.get("sortOrder") as string) || "0", 10) || 0,
  });

  revalidatePath(`/dashboard/admin/library/${bookId}`);
  return { success: true };
}

export async function removeAnnexAction(id: number, bookId: number) {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  await deleteAnnex(id);
  revalidatePath(`/dashboard/admin/library/${bookId}`);
  return { success: true };
}

export async function saveQuizMetaAction(formData: FormData) {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  const bookId = parseInt((formData.get("bookId") as string) || "", 10);
  const title = (formData.get("title") as string)?.trim();
  if (Number.isNaN(bookId) || !title) return { error: "Champs invalides." };

  await upsertQuiz({
    bookId,
    title,
    isPublished: formData.get("isPublished") === "true",
  });

  revalidatePath(`/dashboard/admin/library/${bookId}`);
  return { success: true };
}

export async function saveQuizQuestionAction(formData: FormData) {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  const quizId = parseInt((formData.get("quizId") as string) || "", 10);
  const bookId = parseInt((formData.get("bookId") as string) || "", 10);
  const idStr = formData.get("id") as string;
  const id = idStr ? parseInt(idStr, 10) : undefined;
  const question = (formData.get("question") as string)?.trim();
  const optionsRaw = (formData.get("options") as string) || "";
  const options = optionsRaw.split("\n").map((o) => o.trim()).filter(Boolean);
  const correctIndex = parseInt((formData.get("correctIndex") as string) || "0", 10);

  if (Number.isNaN(quizId) || Number.isNaN(bookId) || !question) return { error: "Champs invalides." };

  try {
    await upsertQuizQuestion({
      id: id && !Number.isNaN(id) ? id : undefined,
      quizId,
      question,
      options,
      correctIndex,
      sortOrder: parseInt((formData.get("sortOrder") as string) || "0", 10) || 0,
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur quiz" };
  }

  revalidatePath(`/dashboard/admin/library/${bookId}`);
  return { success: true };
}

export async function removeQuizQuestionAction(id: number, bookId: number) {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  await deleteQuizQuestion(id);
  revalidatePath(`/dashboard/admin/library/${bookId}`);
  return { success: true };
}

export async function loadAdminBookDetailAction(bookId: number) {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  const book = await getBookById(bookId);
  if (!book) return { error: "Livre introuvable." };

  const [annexes, quiz] = await Promise.all([listAnnexesForBook(bookId), getAdminQuizForBook(bookId)]);

  return { book, annexes, quiz };
}
