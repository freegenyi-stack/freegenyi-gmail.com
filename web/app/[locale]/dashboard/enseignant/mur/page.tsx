import React from "react";
import { getTranslations } from "next-intl/server";
import { requireTeacherPage } from "@/lib/teacher/requireTeacherPage";
import PedagogyWallClient from "@/components/pedagogy/PedagogyWallClient";

export default async function TeacherMurPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("TeacherSpace.verification");
  const { profile, verification } = await requireTeacherPage(locale);

  const publishBlockedMessage = verification.approved
    ? undefined
    : verification.status === "rejected"
      ? t("limitedMurRejected")
      : t("limitedMur");

  return (
    <PedagogyWallClient
      role="enseignant"
      defaultLevel={profile.levels[0] || "3AP"}
      defaultSubject={profile.subjects[0] || ""}
      canPublish={verification.approved}
      publishBlockedMessage={publishBlockedMessage}
    />
  );
}
