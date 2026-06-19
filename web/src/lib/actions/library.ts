"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { users, children } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { saveReadingProgress } from "@/lib/library/books.server";
import { userCanAccessChild } from "@/lib/family/server";
import { isFamilyAdult } from "@/lib/family/constants";

export async function saveReadingProgressAction(
  childId: number,
  bookId: number,
  location: string,
  percent: number,
  locatorJson?: string
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autorisé" };

  const userId = parseInt(session.user.id, 10);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || !isFamilyAdult(user.role)) return { error: "Non autorisé" };

  const [child] = await db.select().from(children).where(eq(children.id, childId)).limit(1);
  if (!child) return { error: "Enfant introuvable" };

  const allowed = await userCanAccessChild(user, child);
  if (!allowed) return { error: "Accès refusé" };

  await saveReadingProgress({ childId, bookId, location, percent, locatorJson });
  return { success: true };
}

export async function syncCalibreAction() {
  const { requireAdminSession } = await import("@/lib/admin/requireAdmin");
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  const { syncBooksFromCalibre } = await import("@/lib/library/calibre.server");
  const result = await syncBooksFromCalibre();
  if (!result.error) {
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/dashboard/admin/library");
    revalidatePath("/dashboard/parent/bibliotheque");
    revalidatePath("/dashboard/enseignant/bibliotheque");
  }
  return result;
}

export async function checkCalibreConnectionAction() {
  const { requireAdminSession } = await import("@/lib/admin/requireAdmin");
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  const { checkCalibreConnection } = await import("@/lib/library/calibre.server");
  const result = await checkCalibreConnection();
  return result.ok ? { message: result.message } : { error: result.message };
}

export async function assignBookToStudentAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autorisé" };

  const userId = parseInt(session.user.id, 10);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || user.role !== "enseignant") return { error: "Réservé aux enseignants." };

  const bookId = parseInt(String(formData.get("bookId") || ""), 10);
  const childIdRaw = String(formData.get("childId") || "").trim();
  const note = String(formData.get("note") || "").trim();
  const childId = childIdRaw ? parseInt(childIdRaw, 10) : null;

  if (Number.isNaN(bookId)) return { error: "Livre invalide." };

  const { createLibraryAssignment, teacherSchoolIdFromMetadata } = await import("@/lib/library/books.server");
  const schoolId = teacherSchoolIdFromMetadata(user.metadata);

  if (childId && schoolId) {
    const [child] = await db
      .select({ id: children.id })
      .from(children)
      .where(and(eq(children.id, childId), eq(children.schoolId, schoolId)))
      .limit(1);
    if (!child) return { error: "Élève non rattaché à votre établissement." };
  }

  const res = await createLibraryAssignment({
    teacherId: userId,
    bookId,
    childId,
    note: note || null,
  });

  if ("error" in res && res.error) return res;

  revalidatePath("/dashboard/enseignant/bibliotheque");
  return { success: true };
}
