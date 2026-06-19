import React from "react";
import { redirect } from "next/navigation";
import { requireTeacherPage } from "@/lib/teacher/requireTeacherPage";
import { requireAuthoringUser } from "@/lib/authoring/session";
import { listSchoolAtelierOverview } from "@/lib/authoring/assignments.server";
import { listTeacherActivityAttempts } from "@/lib/authoring/attempts.server";
import { buildSchoolHeader } from "@/lib/authoring/document-header";
import { teacherSchoolIdFromMetadata, listTeacherSchoolChildren, listSchoolReadingOverview, summarizeSchoolReading } from "@/lib/library/books.server";
import { getTeacherDashboardInsights } from "@/lib/teacher/dashboard-insights.server";
import TeacherClassHubClient from "@/components/teacher/TeacherClassHubClient";

export default async function TeacherClassHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { user } = await requireTeacherPage(locale);
  const authoringUser = await requireAuthoringUser();
  if (!authoringUser) redirect(`/${locale}/auth/login`);

  const schoolId = teacherSchoolIdFromMetadata(user.metadata);
  const [rows, attemptRows, schoolChildren, header, insights, readingRows] = await Promise.all([
    listSchoolAtelierOverview(user.id, user.metadata),
    listTeacherActivityAttempts(user.id, 100),
    schoolId ? listTeacherSchoolChildren(schoolId) : Promise.resolve([]),
    buildSchoolHeader(authoringUser),
    getTeacherDashboardInsights(user.id, !!schoolId),
    schoolId ? listSchoolReadingOverview(schoolId, 200) : Promise.resolve([]),
  ]);
  const readingSummary = summarizeSchoolReading(readingRows);

  const teacherLevels = header.levels.filter((l) => l && l !== "—");

  return (
    <TeacherClassHubClient
      rows={rows}
      attemptRows={attemptRows}
      teacherLevels={teacherLevels}
      schoolChildren={schoolChildren}
      readingSummary={readingSummary}
      insights={insights}
    />
  );
}
