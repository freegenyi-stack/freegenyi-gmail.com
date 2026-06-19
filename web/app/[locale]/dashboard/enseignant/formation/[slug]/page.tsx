import React from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { requireTeacherPage } from "@/lib/teacher/requireTeacherPage";
import { getTeacherCourseBySlug } from "@/lib/teacher/workspace.server";
import TeacherCoursePlayerClient from "@/components/teacher/TeacherCoursePlayerClient";

export default async function TeacherCoursePlayerPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  await requireTeacherPage(locale);

  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : 0;
  if (!userId) redirect(`/${locale}/auth/login`);

  const course = await getTeacherCourseBySlug(slug, userId);
  if (!course) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <TeacherCoursePlayerClient course={course} />
    </div>
  );
}
