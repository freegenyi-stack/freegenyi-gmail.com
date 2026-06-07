import { db } from "@/db";
import { children, messageSuggestions, users } from "@/db/schema";
import { and, eq, ne, or, sql } from "drizzle-orm";
import { isFamilyAdult } from "@/lib/family/constants";
import { getSchoolIdsForUser } from "./permissions";
import {
  displayName,
  getMessagingUserById,
  parseUserMetadata,
  toUserPreview,
  type MessagingUser,
} from "./session";
import { notifyUser } from "./notify";
import { syncSchoolChannels } from "./channels.server";

function teacherSchoolId(meta: Record<string, unknown>): number | null {
  const raw = meta.teacherSchoolId ?? meta.schoolId;
  if (raw == null || raw === "") return null;
  const n = typeof raw === "number" ? raw : parseInt(String(raw), 10);
  return Number.isNaN(n) ? null : n;
}

function reasonLabel(key: SuggestionReasonKey, params: Record<string, string>, locale: string): string {
  const isAr = locale === "ar" || locale.endsWith("-ar");
  switch (key) {
    case "teacher_of_child":
      return isAr
        ? `أستاذ(ة) ${params.childName ? `لـ ${params.childName}` : "لطفلك"} — ${params.schoolName || "مدرستكم"}`
        : `Enseignant(e) de ${params.childName || "votre enfant"} · ${params.schoolName || "votre école"}`;
    case "parent_at_school":
      return isAr
        ? `ولي أمر في ${params.schoolName || "مدرستكم"}`
        : `Parent à ${params.schoolName || "votre établissement"}`;
    case "colleague_teacher":
      return isAr
        ? `زميل(ة) في ${params.schoolName || "مدرستكم"}`
        : `Collègue · ${params.schoolName || "votre établissement"}`;
    case "family_ally":
      return isAr ? "شريكك في التربية" : "Votre allié familial";
    default:
      return isAr ? "اقتراح جهة اتصال" : "Suggestion de contact";
  }
}

async function upsertSuggestion(
  userId: number,
  targetUserId: number,
  reasonKey: SuggestionReasonKey,
  params: Record<string, string>,
  sortOrder: number
) {
  if (userId === targetUserId) return;

  await db
    .insert(messageSuggestions)
    .values({
      userId,
      targetUserId,
      reasonKey,
      reasonParams: JSON.stringify(params),
      sortOrder,
      dismissed: false,
    })
    .onConflictDoUpdate({
      target: [messageSuggestions.userId, messageSuggestions.targetUserId, messageSuggestions.reasonKey],
      set: {
        reasonParams: JSON.stringify(params),
        sortOrder,
        dismissed: false,
      },
    });
}

export async function regenerateSuggestionsForUser(user: MessagingUser, locale = "fr"): Promise<void> {
  const role = user.role || "parent";
  const schoolIds = await getSchoolIdsForUser(user);
  let order = 0;

  if (isFamilyAdult(role) && user.familyId) {
    const familyMembers = await db
      .select({ id: users.id, fullName: users.fullName, role: users.role })
      .from(users)
      .where(and(eq(users.familyId, user.familyId), ne(users.id, user.id), or(eq(users.role, "parent"), eq(users.role, "coparent"))));

    for (const fm of familyMembers) {
      await upsertSuggestion(user.id, fm.id, "family_ally", { name: fm.fullName || "" }, order++);
    }
  }

  if (schoolIds.length === 0) return;

  const childRows = user.familyId
    ? await db.select().from(children).where(eq(children.familyId, user.familyId))
    : await db.select().from(children).where(eq(children.parentId, user.id));

  if (isFamilyAdult(role)) {
    const teachers = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        username: users.username,
        role: users.role,
        metadata: users.metadata,
      })
      .from(users)
      .where(eq(users.role, "enseignant"));

    for (const teacher of teachers) {
      const meta = parseUserMetadata(teacher.metadata);
      const tSchool = teacherSchoolId(meta);
      if (!tSchool || !schoolIds.includes(tSchool)) continue;

      const matchingChild = childRows.find((c) => c.schoolId === tSchool);
      await upsertSuggestion(
        user.id,
        teacher.id,
        "teacher_of_child",
        {
          childName: matchingChild?.fullName?.split(" ")[0] || "",
          schoolName: matchingChild?.schoolName || "",
          teacherName: teacher.fullName || "",
        },
        order++
      );
    }
  }

  if (role === "enseignant") {
    const mySchool = teacherSchoolId(user.metadata);
    if (!mySchool) return;
    const schoolName = String(user.metadata.teacherSchoolName || user.metadata.schoolName || "");

    const parents = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        familyId: users.familyId,
      })
      .from(users)
      .where(or(eq(users.role, "parent"), eq(users.role, "coparent")));

    for (const parent of parents) {
      const pChildren = parent.familyId
        ? await db.select().from(children).where(eq(children.familyId, parent.familyId))
        : await db.select().from(children).where(eq(children.parentId, parent.id));

      if (pChildren.some((c) => c.schoolId === mySchool)) {
        await upsertSuggestion(
          user.id,
          parent.id,
          "parent_at_school",
          { schoolName, parentName: parent.fullName || "" },
          order++
        );
      }
    }

    const colleagues = await db
      .select({ id: users.id, fullName: users.fullName, metadata: users.metadata })
      .from(users)
      .where(and(eq(users.role, "enseignant"), ne(users.id, user.id)));

    for (const col of colleagues) {
      const meta = parseUserMetadata(col.metadata);
      const sid = teacherSchoolId(meta);
      if (sid === mySchool) {
        await upsertSuggestion(user.id, col.id, "colleague_teacher", { schoolName }, order++);
      }
    }
  }
}

/** Recalcule les suggestions + notifie les parents/enseignants liés à une école. */
export async function refreshSchoolMessagingGraph(schoolId: number, locale = "fr"): Promise<void> {
  const affectedUserIds = new Set<number>();

  const teachers = await db
    .select({ id: users.id, metadata: users.metadata })
    .from(users)
    .where(eq(users.role, "enseignant"));

  for (const teacher of teachers) {
    const meta = parseUserMetadata(teacher.metadata);
    const sid = teacherSchoolId(meta);
    if (sid === schoolId) affectedUserIds.add(teacher.id);
  }

  const childRows = await db
    .select({ parentId: children.parentId, familyId: children.familyId })
    .from(children)
    .where(eq(children.schoolId, schoolId));

  for (const child of childRows) {
    affectedUserIds.add(child.parentId);
    if (child.familyId) {
      const familyAdults = await db
        .select({ id: users.id })
        .from(users)
        .where(
          and(
            eq(users.familyId, child.familyId),
            or(eq(users.role, "parent"), eq(users.role, "coparent"))
          )
        );
      for (const adult of familyAdults) affectedUserIds.add(adult.id);
    }
  }

  for (const userId of affectedUserIds) {
    const user = await getMessagingUserById(userId);
    if (!user) continue;
    await regenerateSuggestionsForUser(user, locale);
    await notifyNewSuggestions(user, locale);
  }

  try {
    await syncSchoolChannels(schoolId);
  } catch (e) {
    console.warn("Sync salons école (non bloquant):", e);
  }
}

export async function listSuggestions(user: MessagingUser, locale: string): Promise<MessageSuggestionDto[]> {
  let rows = await db
    .select()
    .from(messageSuggestions)
    .where(and(eq(messageSuggestions.userId, user.id), eq(messageSuggestions.dismissed, false)))
    .orderBy(messageSuggestions.sortOrder);

  if (rows.length === 0) {
    await regenerateSuggestionsForUser(user, locale);
    rows = await db
      .select()
      .from(messageSuggestions)
      .where(and(eq(messageSuggestions.userId, user.id), eq(messageSuggestions.dismissed, false)))
      .orderBy(messageSuggestions.sortOrder);
  }

  const out: MessageSuggestionDto[] = [];
  for (const row of rows.slice(0, 12)) {
    const target = await getMessagingUserById(row.targetUserId);
    if (!target) continue;
    let params: Record<string, string> = {};
    try {
      params = row.reasonParams ? JSON.parse(row.reasonParams) : {};
    } catch {
      params = {};
    }
    out.push({
      id: row.id,
      targetUser: toUserPreview(target),
      reasonKey: row.reasonKey,
      reasonParams: params,
      reasonLabel: reasonLabel(row.reasonKey as SuggestionReasonKey, params, locale),
    });
  }
  return out;
}

export async function dismissSuggestion(userId: number, suggestionId: number): Promise<boolean> {
  const result = await db
    .update(messageSuggestions)
    .set({ dismissed: true })
    .where(and(eq(messageSuggestions.id, suggestionId), eq(messageSuggestions.userId, userId)));
  return true;
}

/** Notifie l'utilisateur des nouvelles suggestions (max 1/jour par batch). */
export async function notifyNewSuggestions(user: MessagingUser, locale: string): Promise<void> {
  const suggestions = await listSuggestions(user, locale);
  if (suggestions.length === 0) return;

  const top = suggestions[0];
  await notifyUser({
    recipientUserId: user.id,
    type: "suggestion",
    title: locale.startsWith("ar") ? "اقتراحات للمراسلة" : "Suggestions de contact",
    content: top.reasonLabel,
    link: `/dashboard/messages?u=${top.targetUser.id}`,
    push: true,
  });
}

export { reasonLabel };
