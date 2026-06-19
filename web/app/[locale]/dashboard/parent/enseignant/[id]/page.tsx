import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getTeacherPublicProfile } from "@/lib/teacher/profile.server";
import TeacherPublicProfileView from "@/components/teacher/TeacherPublicProfileView";
import { ParentPageHeader } from "@/components/parent/ParentShell";
import { getTranslations } from "next-intl/server";

export default async function ParentTeacherProfilePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations("ParentSpace.teacherProfile");
  const session = await auth();
  if (!session?.user?.email) redirect(`/${locale}/auth/login`);

  const [viewer] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  if (!viewer) redirect(`/${locale}/auth/login`);

  const teacherId = parseInt(id, 10);
  if (Number.isNaN(teacherId)) redirect(`/${locale}/dashboard/parent`);

  if (viewer.role === "enseignant") {
    redirect(`/${locale}/dashboard/enseignant/collegue/${teacherId}`);
  }

  const profile = await getTeacherPublicProfile(teacherId, viewer.id);
  if (!profile) redirect(`/${locale}/dashboard/parent`);

  return (
    <div className="mx-auto max-w-lg">
      <ParentPageHeader
        badge={t("badge")}
        title={profile.fullName}
        subtitle={t("subtitle")}
        premium
      />
      <TeacherPublicProfileView profile={profile} viewerRole={viewer.role || "parent"} />
    </div>
  );
}
