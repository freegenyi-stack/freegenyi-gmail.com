import React from "react";
import ParentChildNeedsClient from "@/components/parent/ParentChildNeedsClient";
import { getChildScreenTimeMinutes } from "@/lib/parent/parent-worksheets.server";
import { requireParentPage } from "@/lib/parent/requireParentPage";

export default async function ParentNeedsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { children, selectedChildId } = await requireParentPage(locale);
  const country = locale.includes("-") ? locale.split("-")[0] : "DZ";

  const screenEntries = await Promise.all(
    children.map(async (c) => [c.id, await getChildScreenTimeMinutes(c.id)] as const)
  );
  const screenMinutesToday = Object.fromEntries(screenEntries) as Record<number, number>;

  return (
    <ParentChildNeedsClient
      country={country}
      selectedChildId={selectedChildId}
      screenMinutesToday={screenMinutesToday}
      children={children.map((c) => ({
        id: c.id,
        fullName: c.fullName,
        birthDate: c.birthDate,
        learningProfile: c.learningProfile,
        schoolId: c.schoolId,
        schoolName: c.schoolName,
      }))}
    />
  );
}
