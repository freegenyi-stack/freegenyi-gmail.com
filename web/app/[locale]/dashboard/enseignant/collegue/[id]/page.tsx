import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getTeacherPublicProfile } from "@/lib/teacher/profile.server";
import TeacherPublicProfileView from "@/components/teacher/TeacherPublicProfileView";

export default async function TeacherColleagueProfilePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const session = await auth();
  if (!session?.user?.email) redirect(`/${locale}/auth/login`);

  const [viewer] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  if (!viewer) redirect(`/${locale}/auth/login`);

  if (viewer.role !== "enseignant") {
    const teacherId = parseInt(id, 10);
    if (!Number.isNaN(teacherId)) {
      redirect(`/${locale}/dashboard/parent/enseignant/${teacherId}`);
    }
    redirect(`/${locale}/dashboard/parent`);
  }

  const teacherId = parseInt(id, 10);
  if (Number.isNaN(teacherId)) redirect(`/${locale}/dashboard/enseignant/mur`);

  const profile = await getTeacherPublicProfile(teacherId, viewer.id);
  if (!profile) redirect(`/${locale}/dashboard/enseignant/mur`);

  return <TeacherPublicProfileView profile={profile} viewerRole="enseignant" />;
}
