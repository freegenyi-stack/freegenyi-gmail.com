import React from "react";
import { requireTeacherPage } from "@/lib/teacher/requireTeacherPage";
import TeacherProfileClient from "@/components/teacher/TeacherProfileClient";
import { buildTeacherFormState, getTeacherPublicProfile } from "@/lib/teacher/profile.server";
import { getUserReadingStats } from "@/lib/library/user-library.server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function TeacherProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { user: sessionUser, verification } = await requireTeacherPage(locale);

  const [user] = await db.select().from(users).where(eq(users.email, sessionUser.email)).limit(1);
  if (!user) return null;

  const initial = await buildTeacherFormState(user);
  const publicPreview = await getTeacherPublicProfile(user.id, user.id);
  if (!publicPreview) return null;

  const readingStats = await getUserReadingStats(user.id);

  return (
    <TeacherProfileClient
      initial={initial}
      publicPreview={publicPreview}
      verificationApproved={verification.approved}
      readingStats={readingStats}
    />
  );
}
