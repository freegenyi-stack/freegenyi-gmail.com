import React from "react";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireTeacherPage } from "@/lib/teacher/requireTeacherPage";
import { listTeacherCoursesWithProgress } from "@/lib/teacher/workspace.server";
import TeacherTrainingClient from "@/components/teacher/TeacherTrainingClient";

export default async function TeacherTrainingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireTeacherPage(locale);
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : 0;
  const courses = userId ? await listTeacherCoursesWithProgress(userId) : [];

  return <TeacherTrainingClient courses={courses} />;
}
