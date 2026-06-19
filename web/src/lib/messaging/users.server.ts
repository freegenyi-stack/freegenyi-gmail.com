import { db } from "@/db";
import { schools, users } from "@/db/schema";
import { and, eq, ilike, ne, or } from "drizzle-orm";
import { canUsersMessage, getSchoolIdsForUser } from "./permissions";
import { canContactTeacherViaProfile, extractTeacherProfile } from "@/lib/teacher/profile.server";
import { teacherPublicProfileHref } from "@/lib/teacher/profile-links";
import { displayName, getMessagingUserById, isOnline, toUserPreview, type MessagingUser } from "./session";
import { notifyUser } from "./notify";
import { MESSAGING_ERROR, messagingError, type MessagingErrorResult } from "./messaging-errors";

export type MessagingUserProfile = {
  id: number;
  fullName: string | null;
  username: string | null;
  role: string | null;
  image: string | null;
  isOnline: boolean;
  schoolName: string | null;
  canMessage: boolean;
  teacherCard?: {
    bio: string | null;
    subjects: string[];
    levels: string[];
    publicProfileHref: string;
  };
};

function schoolNameFromMeta(meta: Record<string, unknown>): string | null {
  const name = meta.teacherSchoolName || meta.schoolName || meta.institutionName;
  return typeof name === "string" && name.trim() ? name.trim() : null;
}

async function resolveSchoolName(user: MessagingUser): Promise<string | null> {
  const fromMeta = schoolNameFromMeta(user.metadata);
  if (fromMeta) return fromMeta;

  const schoolIds = await getSchoolIdsForUser(user);
  if (schoolIds.length === 0) return null;

  const [school] = await db
    .select({ nameLocal: schools.nameLocal, nameFr: schools.nameFr })
    .from(schools)
    .where(eq(schools.id, schoolIds[0]))
    .limit(1);

  return school?.nameFr || school?.nameLocal || null;
}

export async function getMessagingUserProfile(
  viewer: MessagingUser,
  targetUserId: number
): Promise<MessagingUserProfile | null> {
  const target = await getMessagingUserById(targetUserId);
  if (!target) return null;

  const perm = await canUsersMessage(viewer, target);
  let canMessage = perm.allowed;
  if (!canMessage && target.role === "enseignant") {
    canMessage = await canContactTeacherViaProfile(viewer, targetUserId);
  }

  const schoolName = await resolveSchoolName(target);

  let teacherCard: MessagingUserProfile["teacherCard"];
  if (target.role === "enseignant") {
    const tp = extractTeacherProfile(target.metadata);
    teacherCard = {
      bio: tp.bio || null,
      subjects: tp.subjects || [],
      levels: tp.levels || [],
      publicProfileHref: teacherPublicProfileHref(viewer.role, targetUserId),
    };
  }

  return {
    id: target.id,
    fullName: target.fullName,
    username: target.username,
    role: target.role,
    image: target.image,
    isOnline: isOnline(target.lastLoginAt),
    schoolName,
    canMessage,
    teacherCard,
  };
}

export async function searchMessagingUsers(
  viewer: MessagingUser,
  query: string,
  limit = 20
): Promise<MessagingUserProfile[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const pattern = `%${q.replace(/[%_]/g, "")}%`;
  const rows = await db
    .select({ id: users.id })
    .from(users)
    .where(
      and(
        ne(users.id, viewer.id),
        or(ilike(users.fullName, pattern), ilike(users.username, pattern))
      )
    )
    .limit(40);

  const out: MessagingUserProfile[] = [];
  for (const row of rows) {
    const profile = await getMessagingUserProfile(viewer, row.id);
    if (!profile) continue;
    if (!profile.canMessage && !profile.schoolName) continue;
    out.push(profile);
    if (out.length >= limit) break;
  }
  return out;
}

export async function sendContactInvite(
  from: MessagingUser,
  targetUserId: number,
  locale = "fr"
): Promise<{ ok: true } | MessagingErrorResult> {
  if (from.id === targetUserId) return messagingError(MESSAGING_ERROR.ACTION_NOT_ALLOWED);

  const target = await getMessagingUserById(targetUserId);
  if (!target) return messagingError(MESSAGING_ERROR.USER_NOT_FOUND);

  const perm = await canUsersMessage(from, target);
  if (perm.allowed) return messagingError(MESSAGING_ERROR.ALREADY_CAN_CONTACT);

  const isAr = locale.startsWith("ar");
  const sender = displayName(from);
  await notifyUser({
    recipientUserId: target.id,
    type: "suggestion",
    title: isAr ? "طلب تواصل" : "Demande de contact",
    content: isAr
      ? `${sender} يريد التواصل معك على FreeGeny`
      : `${sender} souhaite vous contacter sur FreeGeny`,
    link: `/dashboard/messages?u=${from.id}`,
    push: true,
  });

  return { ok: true };
}
