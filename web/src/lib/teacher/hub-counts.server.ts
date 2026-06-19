import { db } from "@/db";
import { authoringAssignments, authoringProgress, authoringResources, pedagogyShares, teacherCourseProgress, teacherCourses } from "@/db/schema";
import { countTeacherLibraryNew } from "@/lib/child/gamification.server";
import { listNewsForUser } from "@/lib/news/articles.server";
import { getTotalUnreadMessageCount } from "@/lib/messaging/notify";
import { and, eq, inArray, sql } from "drizzle-orm";

export type TeacherHubCounts = {
  news: number;
  training: number;
  workshop: number;
  library: number;
  wall: number;
  messages: number;
  classroom: number;
};

export async function getTeacherHubCounts(userId: number): Promise<TeacherHubCounts> {
  const [newsItems, courseRows, progressRows, resourceRows, pendingProgress, messages, libraryNew, wallRows] = await Promise.all([
    listNewsForUser(userId, { limit: 50 }),
    db.select({ id: teacherCourses.id }).from(teacherCourses).where(eq(teacherCourses.isPublished, true)),
    db.select({ courseId: teacherCourseProgress.courseId }).from(teacherCourseProgress).where(eq(teacherCourseProgress.userId, userId)),
    db
      .select({ id: authoringResources.id, status: authoringResources.status })
      .from(authoringResources)
      .where(and(eq(authoringResources.ownerUserId, userId), eq(authoringResources.ownerRole, "enseignant"))),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(authoringProgress)
      .innerJoin(authoringAssignments, eq(authoringProgress.assignmentId, authoringAssignments.id))
      .where(
        and(eq(authoringAssignments.assignedByUserId, userId), inArray(authoringProgress.status, ["pending", "in_progress"]))
      ),
    getTotalUnreadMessageCount(userId),
    countTeacherLibraryNew(userId),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(pedagogyShares)
      .where(and(eq(pedagogyShares.authorId, userId), eq(pedagogyShares.isRemoved, false))),
  ]);

  const startedCourses = new Set(progressRows.map((p) => p.courseId));
  const trainingNew = courseRows.filter((c) => !startedCourses.has(c.id)).length;
  const workshopDrafts = resourceRows.filter((r) => r.status === "draft").length;
  const workshopPending = pendingProgress[0]?.count ?? 0;

  return {
    news: newsItems.filter((n) => n.unread).length,
    training: trainingNew,
    workshop: workshopDrafts + workshopPending,
    library: libraryNew,
    wall: wallRows[0]?.count ?? 0,
    messages,
    classroom: workshopPending,
  };
}
