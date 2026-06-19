import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { children, curriculumAssignments, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const userId = parseInt(session.user.id, 10);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || user.role !== "teacher") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const rows = await db
    .select({
      id: curriculumAssignments.id,
      sessionKey: curriculumAssignments.sessionKey,
      childId: curriculumAssignments.childId,
      childName: children.fullName,
      maqtaId: curriculumAssignments.maqtaId,
      subjectCode: curriculumAssignments.subjectCode,
      competencyId: curriculumAssignments.competencyId,
      status: curriculumAssignments.status,
      assignedAt: curriculumAssignments.assignedAt,
      completedAt: curriculumAssignments.completedAt,
    })
    .from(curriculumAssignments)
    .innerJoin(children, eq(children.id, curriculumAssignments.childId))
    .where(eq(curriculumAssignments.assignedByUserId, userId))
    .orderBy(desc(curriculumAssignments.assignedAt))
    .limit(50);

  return NextResponse.json({ assignments: rows });
}
