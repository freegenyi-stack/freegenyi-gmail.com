import { db } from "@/db";
import {
  authoringActivityAttempts,
  authoringAssignments,
  authoringProgress,
  authoringResources,
  pedagogyShares,
} from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

export type TeacherDashboardInsights = {
  pendingAssignments: number;
  inProgressAssignments: number;
  draftResources: number;
  wallPosts: number;
  /** Devoirs marqués terminés sur les 7 derniers jours */
  recentCompletions: number;
  /** Moyenne des scores d'activité (tentatives) sur 7 jours, ou null si aucune */
  avgScore7d: number | null;
  hasSchool: boolean;
};

export async function getTeacherDashboardInsights(
  userId: number,
  hasSchool: boolean
): Promise<TeacherDashboardInsights> {
  const [pendingRow, inProgressRow, draftRow, wallRow, completionsRow, avgScoreRow] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(authoringProgress)
      .innerJoin(authoringAssignments, eq(authoringProgress.assignmentId, authoringAssignments.id))
      .where(and(eq(authoringAssignments.assignedByUserId, userId), eq(authoringProgress.status, "pending"))),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(authoringProgress)
      .innerJoin(authoringAssignments, eq(authoringProgress.assignmentId, authoringAssignments.id))
      .where(and(eq(authoringAssignments.assignedByUserId, userId), eq(authoringProgress.status, "in_progress"))),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(authoringResources)
      .where(
        and(
          eq(authoringResources.ownerUserId, userId),
          eq(authoringResources.ownerRole, "enseignant"),
          eq(authoringResources.status, "draft")
        )
      ),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(pedagogyShares)
      .where(and(eq(pedagogyShares.authorId, userId), eq(pedagogyShares.isRemoved, false))),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(authoringProgress)
      .innerJoin(authoringAssignments, eq(authoringProgress.assignmentId, authoringAssignments.id))
      .where(
        and(
          eq(authoringAssignments.assignedByUserId, userId),
          eq(authoringProgress.status, "done"),
          sql`${authoringProgress.updatedAt} > now() - interval '7 days'`
        )
      ),
    db
      .select({ avg: sql<number | null>`round(avg(${authoringActivityAttempts.score})::numeric, 0)::int` })
      .from(authoringActivityAttempts)
      .where(
        and(
          eq(authoringActivityAttempts.teacherUserId, userId),
          sql`${authoringActivityAttempts.completedAt} > now() - interval '7 days'`
        )
      ),
  ]);

  const avgRaw = avgScoreRow[0]?.avg;

  return {
    pendingAssignments: pendingRow[0]?.count ?? 0,
    inProgressAssignments: inProgressRow[0]?.count ?? 0,
    draftResources: draftRow[0]?.count ?? 0,
    wallPosts: wallRow[0]?.count ?? 0,
    recentCompletions: completionsRow[0]?.count ?? 0,
    avgScore7d: avgRaw != null ? Number(avgRaw) : null,
    hasSchool,
  };
}
