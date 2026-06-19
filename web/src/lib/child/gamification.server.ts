import { db } from "@/db";
import {
  authoringAssignments,
  authoringProgress,
  authoringResources,
  libraryBooks,
  libraryQuizAttempts,
  libraryReadingBadges,
  libraryReadingProgress,
  libraryUserProgress,
  users,
} from "@/db/schema";
import type { AuthoringResourceRow } from "@/lib/authoring/types";
import type { AuthoringOwnerRole, AuthoringKind, AuthoringStatus, AuthoringResourceType } from "@/lib/authoring/types";
import { and, desc, eq, gte, notInArray, sql } from "drizzle-orm";

export type ChildGamificationStats = {
  totalXp: number;
  level: number;
  progress: number;
  breakdown: {
    reading: number;
    exercises: number;
    badges: number;
    quizzes: number;
  };
  pendingMissions: number;
  booksRead: number;
  exercisesDone: number;
};

export type ChildMissionRow = {
  progressId: number;
  resourceId: number;
  resourceTitle: string;
  resourceKind: string;
  teacherName: string | null;
  status: string;
  note: string | null;
  xpEarned: number | null;
};

const BADGE_XP = 50;
const QUIZ_XP = 25;

export function levelFromXp(totalXp: number): { level: number; progress: number } {
  let level = 1;
  while (totalXp >= xpForLevel(level + 1)) level++;
  const currentMin = xpForLevel(level);
  const nextMin = xpForLevel(level + 1);
  const progress = nextMin > currentMin ? Math.round(((totalXp - currentMin) / (nextMin - currentMin)) * 100) : 100;
  return { level, progress: Math.min(100, Math.max(0, progress)) };
}

function xpForLevel(level: number): number {
  return (level - 1) * (level - 1) * 100 + (level - 1) * 50;
}

export async function getChildGamificationStats(childId: number): Promise<ChildGamificationStats> {
  const [readingRows, progressRows, badges, quizzes] = await Promise.all([
    db.select({ percent: libraryReadingProgress.percent }).from(libraryReadingProgress).where(eq(libraryReadingProgress.childId, childId)),
    db
      .select({ status: authoringProgress.status, xpEarned: authoringProgress.xpEarned })
      .from(authoringProgress)
      .where(eq(authoringProgress.childId, childId)),
    db.select({ id: libraryReadingBadges.id }).from(libraryReadingBadges).where(eq(libraryReadingBadges.childId, childId)),
    db.select({ score: libraryQuizAttempts.score }).from(libraryQuizAttempts).where(eq(libraryQuizAttempts.childId, childId)),
  ]);

  const readingXp = readingRows.reduce((s, r) => s + Math.round((r.percent / 100) * 80), 0);
  const booksRead = readingRows.filter((r) => r.percent >= 100).length;
  const exerciseXp = progressRows.reduce((s, r) => s + (r.xpEarned ?? 0), 0);
  const exercisesDone = progressRows.filter((r) => r.status === "done").length;
  const badgeXp = badges.length * BADGE_XP;
  const quizXp = quizzes.reduce((s, q) => s + QUIZ_XP + Math.round((q.score ?? 0) / 10), 0);
  const pendingMissions = progressRows.filter((r) => r.status === "pending" || r.status === "in_progress").length;

  const totalXp = readingXp + exerciseXp + badgeXp + quizXp;
  const { level, progress } = levelFromXp(totalXp);

  return {
    totalXp,
    level,
    progress,
    breakdown: { reading: readingXp, exercises: exerciseXp, badges: badgeXp, quizzes: quizXp },
    pendingMissions,
    booksRead,
    exercisesDone,
  };
}

export async function listChildAtelierMissions(childId: number, limit = 30): Promise<ChildMissionRow[]> {
  const rows = await db
    .select({
      progressId: authoringProgress.id,
      resourceId: authoringResources.id,
      resourceTitle: authoringResources.title,
      resourceKind: authoringResources.kind,
      teacherName: users.fullName,
      status: authoringProgress.status,
      note: authoringAssignments.note,
      xpEarned: authoringProgress.xpEarned,
    })
    .from(authoringProgress)
    .innerJoin(authoringAssignments, eq(authoringProgress.assignmentId, authoringAssignments.id))
    .innerJoin(authoringResources, eq(authoringAssignments.resourceId, authoringResources.id))
    .innerJoin(users, eq(authoringAssignments.assignedByUserId, users.id))
    .where(eq(authoringProgress.childId, childId))
    .orderBy(desc(authoringAssignments.createdAt))
    .limit(limit);

  return rows;
}

export async function getChildMissionResource(progressId: number, childId: number) {
  const [row] = await db
    .select({
      progressId: authoringProgress.id,
      childId: authoringProgress.childId,
      status: authoringProgress.status,
      resource: authoringResources,
    })
    .from(authoringProgress)
    .innerJoin(authoringAssignments, eq(authoringProgress.assignmentId, authoringAssignments.id))
    .innerJoin(authoringResources, eq(authoringAssignments.resourceId, authoringResources.id))
    .where(and(eq(authoringProgress.id, progressId), eq(authoringProgress.childId, childId)))
    .limit(1);

  if (!row) return null;

  const r = row.resource;
  const resource: AuthoringResourceRow = {
    id: r.id,
    ownerUserId: r.ownerUserId,
    ownerRole: r.ownerRole as AuthoringOwnerRole,
    kind: r.kind as AuthoringKind,
    title: r.title,
    resourceType: r.resourceType as AuthoringResourceType,
    subject: r.subject,
    schoolLevel: r.schoolLevel,
    schoolYear: r.schoolYear,
    folderId: r.folderId,
    status: r.status as AuthoringStatus,
    contentJson: r.contentJson,
    h5pContentId: r.h5pContentId,
    h5pLibrary: r.h5pLibrary,
    templateId: r.templateId,
    tags: r.tags,
    legacyDocumentId: r.legacyDocumentId,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };

  return { progressId: row.progressId, childId: row.childId, status: row.status, resource };
}

/** Livres récents non commencés par l'enseignant (badge bibliothèque). */
export async function countTeacherLibraryNew(userId: number): Promise<number> {
  const since = new Date();
  since.setDate(since.getDate() - 14);

  const startedRows = await db
    .select({ bookId: libraryUserProgress.bookId })
    .from(libraryUserProgress)
    .where(and(eq(libraryUserProgress.userId, userId), sql`${libraryUserProgress.percent} > 0`));

  const startedIds = startedRows.map((r) => r.bookId);
  const conditions = [eq(libraryBooks.isPublished, true), gte(libraryBooks.createdAt, since)];
  if (startedIds.length > 0) {
    conditions.push(notInArray(libraryBooks.id, startedIds));
  }

  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(libraryBooks)
    .where(and(...conditions));

  return row?.count ?? 0;
}
