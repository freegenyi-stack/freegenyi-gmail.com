import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import TeacherDashboardClient from "@/components/teacher/TeacherDashboardClient";

export default async function TeacherDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("TeacherDashboard");
  const session = await auth();

  if (!session?.user?.email) {
    redirect(`/${locale}/auth/login`);
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));

  if (!user || user.role !== "enseignant") {
    redirect(`/${locale}/dashboard/parent`);
  }

  if (user.onboardingStep! < 4) {
    redirect(`/${locale}/dashboard/onboarding?type=enseignant`);
  }

  const metadata = user.metadata ? JSON.parse(user.metadata) : {};

  return (
    <TeacherDashboardClient
      locale={locale}
      user={{
        fullName: user.fullName || session.user.name || "",
        email: user.email,
        image: user.image || session.user.image,
      }}
      profile={{
        schoolName: metadata.teacherSchoolName || "",
        subject: metadata.teacherSubject || "",
        level: metadata.teacherLevel || "",
        bio: metadata.teacherBio || "",
        interests: metadata.interests || { creative: true, training: true },
      }}
      labels={{
        title: t("title"),
        subtitle: t("subtitle"),
        creativeTitle: t("creativeTitle"),
        creativeDesc: t("creativeDesc"),
        creativeCta: t("creativeCta"),
        trainingTitle: t("trainingTitle"),
        trainingDesc: t("trainingDesc"),
        trainingCta: t("trainingCta"),
        school: t("school"),
        subject: t("subject"),
        level: t("level"),
        comingSoon: t("comingSoon"),
      }}
    />
  );
}
