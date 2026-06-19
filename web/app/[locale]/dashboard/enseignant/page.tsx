import React from "react";
import { requireTeacherPage } from "@/lib/teacher/requireTeacherPage";
import { getTeacherHubCounts } from "@/lib/teacher/hub-counts.server";
import { getTeacherDashboardInsights } from "@/lib/teacher/dashboard-insights.server";
import { teacherSchoolIdFromMetadata } from "@/lib/library/books.server";
import TeacherHomeClient from "@/components/teacher/TeacherHomeClient";

export default async function TeacherDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { user, profile } = await requireTeacherPage(locale);
  const schoolId = teacherSchoolIdFromMetadata(user.metadata);
  const [hubCounts, insights] = await Promise.all([
    getTeacherHubCounts(user.id),
    getTeacherDashboardInsights(user.id, !!schoolId),
  ]);

  return <TeacherHomeClient user={user} profile={profile} hubCounts={hubCounts} insights={insights} />;
}
