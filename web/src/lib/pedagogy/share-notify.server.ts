import { db } from "@/db";
import { children, users } from "@/db/schema";
import { notifyUser } from "@/lib/messaging/notify";
import { isFamilyAdult } from "@/lib/family/constants";
import { extractTeacherProfile, parseMetadata } from "@/lib/teacher/profile.server";
import { teacherPushAllowed } from "@/lib/teacher/profile-complete";
import { eq, ne, and, inArray } from "drizzle-orm";
import type { PedagogyPostType } from "./constants";

const TYPE_LABELS_FR: Record<PedagogyPostType, string> = {
  lesson: "Leçon",
  exercise: "Exercices",
  exam: "Examen",
  resource: "Ressource",
};

export async function notifyNewPedagogyShare(opts: {
  shareId: number;
  authorId: number;
  authorName: string;
  title: string;
  educationLevel: string;
  postType: PedagogyPostType;
  locale?: string;
}): Promise<void> {
  const { shareId, authorId, authorName, title, educationLevel, postType, locale = "fr" } = opts;
  const isAr = locale.startsWith("ar");
  const typeLabel = TYPE_LABELS_FR[postType] || postType;
  const murLinkTeacher = "/dashboard/enseignant/mur";
  const murLinkParent = "/dashboard/parent/mur";

  const teacherTitle = isAr ? "منشور جديد على الجدار التربوي" : "Nouveau sur le Mur pédagogique";
  const parentTitle = isAr ? "مورد جديد لأطفالكم" : "Nouvelle ressource pour votre enfant";
  const teacherBody = isAr
    ? `${authorName} · ${typeLabel} · ${educationLevel} — ${title}`
    : `${authorName} · ${typeLabel} · ${educationLevel} — ${title}`;
  const parentBody = isAr
    ? `أستاذ نشر ${typeLabel} للمستوى ${educationLevel} — ${title}`
    : `Un enseignant a publié : ${typeLabel} (${educationLevel}) — ${title}`;

  const teacherRows = await db
    .select({ id: users.id, metadata: users.metadata })
    .from(users)
    .where(and(eq(users.role, "enseignant"), ne(users.id, authorId)));

  const notified = new Set<number>();

  for (const row of teacherRows) {
    if (!teacherPushAllowed(row.metadata, "enseignant", "mur")) continue;
    const tp = extractTeacherProfile(parseMetadata(row.metadata));
    const levels = tp.levels || [];
    if (levels.length > 0 && !levels.includes(educationLevel)) continue;

    await notifyUser({
      recipientUserId: row.id,
      type: "system",
      title: teacherTitle,
      content: teacherBody,
      link: murLinkTeacher,
      locale,
      push: true,
      pushCategory: "mur",
    });
    notified.add(row.id);
  }

  const childRows = await db
    .select({ parentId: children.parentId, familyId: children.familyId })
    .from(children)
    .where(eq(children.educationLevel, educationLevel));

  const parentIds = new Set<number>();
  for (const c of childRows) {
    if (c.parentId) parentIds.add(c.parentId);
  }

  if (parentIds.size > 0) {
    const parentUsers = await db
      .select({ id: users.id })
      .from(users)
      .where(
        and(
          inArray(users.id, [...parentIds]),
          ne(users.id, authorId)
        )
      );

    for (const p of parentUsers) {
      if (notified.has(p.id)) continue;
      await notifyUser({
        recipientUserId: p.id,
        type: "system",
        title: parentTitle,
        content: parentBody,
        link: murLinkParent,
        locale,
        push: true,
      });
      notified.add(p.id);
    }
  }

  const coparentRows = await db
    .select({ id: users.id, familyId: users.familyId, role: users.role })
    .from(users)
    .where(and(eq(users.role, "coparent"), ne(users.id, authorId)));

  const familyIds = new Set<string>();
  for (const c of childRows) {
    if (c.familyId) familyIds.add(String(c.familyId));
  }
  for (const cp of coparentRows) {
    if (!cp.familyId || !familyIds.has(String(cp.familyId)) || notified.has(cp.id)) continue;
    if (!isFamilyAdult(cp.role)) continue;
    await notifyUser({
      recipientUserId: cp.id,
      type: "system",
      title: parentTitle,
      content: parentBody,
      link: murLinkParent,
      locale,
      push: true,
    });
  }
}
