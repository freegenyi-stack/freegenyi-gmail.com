import { db } from "@/db";
import { pedagogyShares, users } from "@/db/schema";
import { getTeacherShareStats } from "@/lib/pedagogy/shares.server";
import { canUsersMessage } from "@/lib/messaging/permissions";
import { getMessagingUserById } from "@/lib/messaging/session";
import type {
  TeacherProfileData,
  TeacherProfileFormState,
  TeacherPublicProfile,
} from "@/lib/teacher/profile.types";
import { and, eq, sql } from "drizzle-orm";
import { isFamilyAdult } from "@/lib/family/constants";
import type { MessagingUser } from "@/lib/messaging/session";
import {
  getUserVerificationStatus,
  isVerificationApproved,
} from "@/lib/orgVerification.guard";

const DEFAULT_PUSH = { mur: true, messages: true, digest: false, news: true };
const DEFAULT_AVAILABILITY = { enabled: false, acceptsTutoring: false, slots: [] };

export function parseMetadata(raw: string | null): Record<string, unknown> {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export function extractTeacherProfile(meta: Record<string, unknown>): TeacherProfileData {
  const tp = (meta.teacherProfile as TeacherProfileData) || {};
  return {
    bio: (tp.bio as string) || (meta.teacherBio as string) || "",
    subjects: tp.subjects?.length
      ? tp.subjects
      : meta.teacherSubject
        ? [String(meta.teacherSubject)]
        : [],
    levels: tp.levels?.length
      ? tp.levels
      : meta.teacherLevel
        ? [String(meta.teacherLevel)]
        : [],
    contactEnabled: tp.contactEnabled ?? false,
    contactAllowParents: tp.contactAllowParents !== false,
    contactAllowTeachers: tp.contactAllowTeachers ?? false,
    contactNote: tp.contactNote || "",
    contactChannels: tp.contactChannels || {},
    pushPrefs: { ...DEFAULT_PUSH, ...tp.pushPrefs },
    notificationInterests: (tp.notificationInterests as string[]) || (meta.notificationInterests as string[]) || [],
    availability: { ...DEFAULT_AVAILABILITY, ...tp.availability },
    avatarMode: tp.avatarMode || "catalog",
  };
}

export async function getTeacherRanking(authorId: number) {
  const rows = await db
    .select({
      authorId: pedagogyShares.authorId,
      posts: sql<number>`count(*)::int`,
      likes: sql<number>`coalesce(sum(${pedagogyShares.likeCount}), 0)::int`,
    })
    .from(pedagogyShares)
    .where(eq(pedagogyShares.isRemoved, false))
    .groupBy(pedagogyShares.authorId);

  const totalTeachers = rows.length || 1;
  const byPosts = [...rows].sort((a, b) => b.posts - a.posts || b.likes - a.likes);
  const byLikes = [...rows].sort((a, b) => b.likes - a.likes || b.posts - a.posts);

  const rankPosts = byPosts.findIndex((r) => r.authorId === authorId) + 1 || totalTeachers;
  const rankLikes = byLikes.findIndex((r) => r.authorId === authorId) + 1 || totalTeachers;

  return { rankPosts: rankPosts || totalTeachers, rankLikes: rankLikes || totalTeachers, totalTeachers };
}

export async function buildTeacherFormState(user: {
  id: number;
  fullName: string | null;
  phone: string | null;
  image: string | null;
  avatarConfig: string | null;
  metadata: string | null;
}): Promise<TeacherProfileFormState> {
  const meta = parseMetadata(user.metadata);
  const tp = extractTeacherProfile(meta);
  let avatarConfig = null;
  try {
    avatarConfig = user.avatarConfig ? JSON.parse(user.avatarConfig) : null;
  } catch {
    avatarConfig = null;
  }

  return {
    fullName: user.fullName || "",
    phone: user.phone || "",
    bio: tp.bio || "",
    subjects: tp.subjects || [],
    levels: tp.levels || [],
    schoolName: (meta.teacherSchoolName as string) || "",
    contactEnabled: tp.contactEnabled ?? false,
    contactAllowParents: tp.contactAllowParents !== false,
    contactAllowTeachers: tp.contactAllowTeachers ?? false,
    contactNote: tp.contactNote || "",
    contactChannels: {
      phone: tp.contactChannels?.phone || { value: user.phone || "", visible: false },
      whatsapp: tp.contactChannels?.whatsapp || { value: user.phone || "", visible: false },
      facebook: tp.contactChannels?.facebook || { value: "", visible: false },
      linkedin: tp.contactChannels?.linkedin || { value: "", visible: false },
      emailPro: tp.contactChannels?.emailPro || { value: "", visible: false },
    },
    pushPrefs: tp.pushPrefs || DEFAULT_PUSH,
    notificationInterests: tp.notificationInterests || [],
    availability: tp.availability || DEFAULT_AVAILABILITY,
    avatarMode: tp.avatarMode || "catalog",
    avatarConfig,
    image: user.image,
  };
}

/** Contact via carte publique (Mur / profil) — hors contrainte école stricte. */
export async function canContactTeacherViaProfile(
  viewer: MessagingUser,
  teacherId: number
): Promise<boolean> {
  if (viewer.id === teacherId) return false;

  const [teacher] = await db
    .select({ role: users.role, metadata: users.metadata })
    .from(users)
    .where(eq(users.id, teacherId))
    .limit(1);

  if (!teacher || teacher.role !== "enseignant") return false;

  const status = await getUserVerificationStatus(teacherId, teacher.metadata);
  if (!isVerificationApproved(status)) return false;

  const tp = extractTeacherProfile(parseMetadata(teacher.metadata));
  if (!tp.contactEnabled) return false;

  const role = viewer.role || "parent";
  if (isFamilyAdult(role)) return tp.contactAllowParents !== false;
  if (role === "enseignant") return tp.contactAllowTeachers === true;

  return false;
}

export async function getTeacherPublicProfile(
  teacherId: number,
  viewerId: number
): Promise<TeacherPublicProfile | null> {
  const [user] = await db.select().from(users).where(eq(users.id, teacherId)).limit(1);
  if (!user || user.role !== "enseignant") return null;

  const isOwnProfile = viewerId === teacherId;
  const status = await getUserVerificationStatus(teacherId, user.metadata);
  if (!isVerificationApproved(status) && !isOwnProfile) return null;

  const meta = parseMetadata(user.metadata);
  const tp = extractTeacherProfile(meta);
  const stats = await getTeacherShareStats(teacherId);
  const ranking = await getTeacherRanking(teacherId);

  let avatarConfig = null;
  try {
    avatarConfig = user.avatarConfig ? JSON.parse(user.avatarConfig) : null;
  } catch {
    avatarConfig = null;
  }

  const viewer = await getMessagingUserById(viewerId);
  let canMessage = false;
  if (viewer && viewerId !== teacherId) {
    canMessage = await canContactTeacherViaProfile(viewer, teacherId);
    if (!canMessage && viewer) {
      const target = await getMessagingUserById(teacherId);
      if (target && tp.contactEnabled) {
        const perm = await canUsersMessage(viewer, target);
        canMessage = perm.allowed;
      }
    }
  }

  const publicChannels = tp.contactEnabled
    ? Object.fromEntries(
        Object.entries(tp.contactChannels || {}).filter(([, v]) => v?.visible && v?.value?.trim())
      )
    : {};

  return {
    id: user.id,
    fullName: user.fullName || "Enseignant",
    username: user.username,
    image: user.image,
    avatarConfig,
    avatarMode: tp.avatarMode || "catalog",
    bio: tp.bio || null,
    schoolName: (meta.teacherSchoolName as string) || null,
    subjects: tp.subjects || [],
    levels: tp.levels || [],
    contactEnabled: tp.contactEnabled ?? false,
    contactNote: tp.contactNote || null,
    contactChannels: publicChannels as TeacherProfileData["contactChannels"],
    stats: {
      publications: stats.publications,
      views: stats.views,
      likes: stats.likes,
      rankPosts: ranking.rankPosts,
      rankLikes: ranking.rankLikes,
      totalTeachers: ranking.totalTeachers,
    },
    availability: tp.availability,
    isOwnProfile: viewerId === teacherId,
    canMessage,
    verificationApproved: isVerificationApproved(status),
  };
}

export function mergeTeacherProfileIntoMetadata(
  prev: Record<string, unknown>,
  profile: TeacherProfileData
): Record<string, unknown> {
  return {
    ...prev,
    teacherBio: profile.bio,
    teacherSubject: profile.subjects?.[0] || prev.teacherSubject,
    teacherLevel: profile.levels?.[0] || prev.teacherLevel,
    notificationInterests: profile.notificationInterests,
    teacherProfile: profile,
  };
}
