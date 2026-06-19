import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { teacherCourseProgress, teacherCourses, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { renderCourseCertificatePdf } from "@/lib/teacher/course-certificate.server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const userId = parseInt(session.user.id, 10);
  const courseId = parseInt((await params).id, 10);
  const locale = req.nextUrl.searchParams.get("locale") || "fr";

  if (Number.isNaN(courseId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  const [user] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!user || user.role !== "enseignant") {
    return NextResponse.json({ error: "Réservé aux enseignants" }, { status: 403 });
  }

  const [row] = await db
    .select({
      certificateCode: teacherCourseProgress.certificateCode,
      completedAt: teacherCourseProgress.completedAt,
      titleFr: teacherCourses.titleFr,
      titleAr: teacherCourses.titleAr,
      fullName: users.fullName,
      email: users.email,
    })
    .from(teacherCourseProgress)
    .innerJoin(teacherCourses, eq(teacherCourses.id, teacherCourseProgress.courseId))
    .innerJoin(users, eq(users.id, teacherCourseProgress.userId))
    .where(and(eq(teacherCourseProgress.userId, userId), eq(teacherCourseProgress.courseId, courseId)))
    .limit(1);

  if (!row?.certificateCode || !row.completedAt) {
    return NextResponse.json({ error: "Certificat introuvable" }, { status: 404 });
  }

  const isAr = locale.startsWith("ar");
  const courseTitle = isAr ? row.titleAr : row.titleFr;
  const teacherName = row.fullName?.trim() || row.email.split("@")[0];
  const safeName = courseTitle.replace(/[^\w\s-àâäéèêëïîôùûüç]/gi, "").trim() || "formation";

  const buf = await renderCourseCertificatePdf({
    teacherName,
    courseTitle,
    completedAt: row.completedAt,
    certificateCode: row.certificateCode,
    locale,
  });

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="freegeny-${safeName}.pdf"`,
    },
  });
}
