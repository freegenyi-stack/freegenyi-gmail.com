import { db } from "@/db";
import { children, conversationMembers, conversations, users } from "@/db/schema";
import { and, eq, or, sql } from "drizzle-orm";
import { isFamilyAdult } from "@/lib/family/constants";
import {
  buildSchoolSlug,
  channelsForRole,
  getRoomMeta,
  type ChannelSection,
  type FgRole,
  type ProvisionContext,
} from "./channel-catalog";
import { getMessagingUserById, parseUserMetadata, type MessagingUser } from "./session";

function channelDirectKey(slug: string): string {
  return `ch:${slug}`;
}

function toFgRole(role: string | null): FgRole | null {
  if (role === "parent" || role === "coparent") return "parent";
  if (role === "enseignant" || role === "ecole" || role === "ong") return role;
  return null;
}

function teacherSchoolId(meta: Record<string, unknown>): number | null {
  const raw = meta.teacherSchoolId ?? meta.institutionSchoolId ?? meta.schoolId;
  if (raw == null || raw === "") return null;
  const n = typeof raw === "number" ? raw : parseInt(String(raw), 10);
  return Number.isNaN(n) ? null : n;
}

async function classLevelsForUser(user: MessagingUser, schoolId: number): Promise<string[]> {
  const role = user.role || "parent";
  const levels = new Set<string>();

  if (isFamilyAdult(role)) {
    const rows = user.familyId
      ? await db.select({ level: children.educationLevel }).from(children).where(eq(children.familyId, user.familyId))
      : await db.select({ level: children.educationLevel }).from(children).where(eq(children.parentId, user.id));
    for (const row of rows) {
      if (row.level && row.level.trim()) levels.add(row.level.trim());
    }
  }

  if (role === "enseignant") {
    const meta = user.metadata;
    const assigned = meta.teacherLevels ?? meta.classLevels;
    if (Array.isArray(assigned) && assigned.length) {
      assigned.forEach((l) => typeof l === "string" && levels.add(l));
    } else if (typeof meta.teacherLevel === "string" && meta.teacherLevel) {
      levels.add(meta.teacherLevel);
    } else {
      levels.add("classe");
    }
  }

  if (role === "ecole") {
    const atSchool = await db
      .select({ level: children.educationLevel })
      .from(children)
      .where(eq(children.schoolId, schoolId));
    for (const row of atSchool) {
      if (row.level?.trim()) levels.add(row.level.trim());
    }
    if (levels.size === 0) {
      ["1AP", "2AP", "3AP", "4AP", "5AP"].forEach((l) => levels.add(l));
    }
  }

  return [...levels];
}

export async function getSchoolIdForUser(user: MessagingUser): Promise<number | null> {
  const role = user.role || "parent";
  if (role === "enseignant" || role === "ecole") {
    return teacherSchoolId(user.metadata);
  }
  if (isFamilyAdult(role)) {
    const rows = user.familyId
      ? await db.select({ schoolId: children.schoolId }).from(children).where(eq(children.familyId, user.familyId))
      : await db.select({ schoolId: children.schoolId }).from(children).where(eq(children.parentId, user.id));
    const sid = rows.map((r) => r.schoolId).find((id) => id != null && !Number.isNaN(id));
    return sid ?? null;
  }
  if (role === "ong") return null;
  return null;
}

async function usersLinkedToSchool(schoolId: number): Promise<MessagingUser[]> {
  const ids = new Set<number>();

  const teachers = await db
    .select({ id: users.id })
    .from(users)
    .where(or(eq(users.role, "enseignant"), eq(users.role, "ecole")));

  for (const t of teachers) {
    const full = await getMessagingUserById(t.id);
    if (full && teacherSchoolId(full.metadata) === schoolId) ids.add(t.id);
  }

  const childRows = await db
    .select({ parentId: children.parentId, familyId: children.familyId })
    .from(children)
    .where(eq(children.schoolId, schoolId));

  for (const c of childRows) {
    ids.add(c.parentId);
    if (c.familyId) {
      const adults = await db
        .select({ id: users.id })
        .from(users)
        .where(
          and(
            eq(users.familyId, c.familyId),
            or(eq(users.role, "parent"), eq(users.role, "coparent"))
          )
        );
      adults.forEach((a) => ids.add(a.id));
    }
  }

  const out: MessagingUser[] = [];
  for (const id of ids) {
    const u = await getMessagingUserById(id);
    if (u) out.push(u);
  }
  return out;
}

async function findOrCreateChannel(
  slug: string,
  schoolId: number | null
): Promise<number> {
  const dkey = channelDirectKey(slug);
  const [existing] = await db
    .select({ id: conversations.id })
    .from(conversations)
    .where(eq(conversations.directKey, dkey))
    .limit(1);

  if (existing) return existing.id;

  const [conv] = await db
    .insert(conversations)
    .values({
      type: "channel",
      name: slug,
      directKey: dkey,
      schoolId,
      updatedAt: new Date(),
    })
    .returning({ id: conversations.id });

  return conv.id;
}

async function ensureMember(conversationId: number, userId: number): Promise<void> {
  const [existing] = await db
    .select({ id: conversationMembers.id })
    .from(conversationMembers)
    .where(and(eq(conversationMembers.conversationId, conversationId), eq(conversationMembers.userId, userId)))
    .limit(1);
  if (existing) return;
  await db.insert(conversationMembers).values({ conversationId, userId });
}

export async function provisionChannelsForUser(user: MessagingUser): Promise<void> {
  const fgRole = toFgRole(user.role);
  if (!fgRole) return;

  const schoolId = await getSchoolIdForUser(user);
  if (!schoolId && fgRole !== "ong") return;

  const ctx: ProvisionContext = {
    schoolSlug: schoolId ? `school-${schoolId}` : buildSchoolSlug(user.metadata, user.id),
    classLevels: schoolId ? await classLevelsForUser(user, schoolId) : [],
  };

  const channelDefs = channelsForRole(fgRole, ctx);

  for (const ch of channelDefs) {
    const convId = await findOrCreateChannel(ch.name, schoolId);
    await ensureMember(convId, user.id);
  }
}

/** Crée les salons d'une école et inscrit tous les utilisateurs éligibles. */
export async function syncSchoolChannels(schoolId: number): Promise<void> {
  const linked = await usersLinkedToSchool(schoolId);
  for (const user of linked) {
    await provisionChannelsForUser(user);
  }
}

export function channelTopicFromSlug(slug: string, locale: string): string {
  const meta = getRoomMeta(slug, "c");
  const isAr = locale === "ar" || locale.endsWith("-ar");
  const topics: Record<string, { fr: string; ar: string }> = {
    annonces: { fr: "Annonces officielles", ar: "إعلانات رسمية" },
    "ecole-parents": { fr: "École & parents", ar: "المدرسة وأولياء الأمور" },
    "parents-communaute": { fr: "Communauté parents", ar: "مجتمع الأولياء" },
    enseignants: { fr: "Équipe enseignante", ar: "فريق الأساتذة" },
    personnel: { fr: "Personnel", ar: "الطاقم" },
    externe: { fr: "Partenaires externes", ar: "شركاء خارجيون" },
    direction: { fr: "Direction", ar: "الإدارة" },
    docs: { fr: "Documents", ar: "وثائق" },
    classe: { fr: "Ma classe", ar: "صفّي" },
  };
  const t = topics[meta.key];
  if (t) return isAr ? t.ar : t.fr;
  return slug.replace(/^fg-/, "").replace(/-/g, " ");
}

export function channelSectionLabel(section: ChannelSection, locale: string): string {
  const isAr = locale === "ar" || locale.endsWith("-ar");
  const labels: Record<ChannelSection, { fr: string; ar: string }> = {
    announcements: { fr: "Annonces", ar: "إعلانات" },
    school: { fr: "École", ar: "المدرسة" },
    class: { fr: "Classes", ar: "الأقسام" },
    community: { fr: "Communauté", ar: "المجتمع" },
    staff: { fr: "Équipe", ar: "الفريق" },
    external: { fr: "Externe", ar: "خارجي" },
    documents: { fr: "Documents", ar: "وثائق" },
    direct: { fr: "Privé", ar: "خاص" },
  };
  const l = labels[section];
  return isAr ? l.ar : l.fr;
}

export { getRoomMeta, type ChannelSection };
