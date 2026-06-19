import React from "react";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { requireTeacherPage } from "@/lib/teacher/requireTeacherPage";
import { listSchoolReadingOverview, teacherSchoolIdFromMetadata } from "@/lib/library/books.server";
import TeacherClassReadingClient from "@/components/teacher/TeacherClassReadingClient";

export default async function TeacherClassReadingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireTeacherPage(locale);

  const session = await auth();
  if (!session?.user?.email) redirect(`/${locale}/auth/login`);

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));
  if (!user) redirect(`/${locale}/auth/login`);

  const schoolId = teacherSchoolIdFromMetadata(user.metadata);
  const rows = schoolId ? await listSchoolReadingOverview(schoolId) : [];

  return <TeacherClassReadingClient rows={rows} />;
}
