import React from "react";
import { notFound } from "next/navigation";
import { requireTeacherPage } from "@/lib/teacher/requireTeacherPage";
import { requireAuthoringUser } from "@/lib/authoring/session";
import { getAuthoringResource } from "@/lib/authoring/resources.server";
import { isActivityKind } from "@/lib/authoring/types";
import { buildSchoolHeader } from "@/lib/authoring/document-header";
import { listAuthoringFolders } from "@/lib/authoring/folders.server";
import { listTeacherSchoolChildren, teacherSchoolIdFromMetadata } from "@/lib/library/books.server";
import AtelierActivityClient from "@/components/atelier/AtelierActivityClient";

export const dynamic = "force-dynamic";

export default async function AtelierActivitePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  await requireTeacherPage(locale);
  const user = await requireAuthoringUser();
  if (!user) notFound();

  const resourceId = parseInt(id, 10);
  if (Number.isNaN(resourceId)) notFound();

  const resource = await getAuthoringResource(resourceId, user.id, user.role);
  if (!resource || !isActivityKind(resource.kind)) notFound();

  const schoolId = teacherSchoolIdFromMetadata(user.metadata);
  const [folders, schoolChildren, header] = await Promise.all([
    listAuthoringFolders(user.id, user.role),
    schoolId ? listTeacherSchoolChildren(schoolId) : Promise.resolve([]),
    buildSchoolHeader(user),
  ]);
  const profileLevels = header.levels.filter((l) => l && l !== "—");
  const childLevels = [
    ...new Set(schoolChildren.map((c) => c.educationLevel).filter(Boolean) as string[]),
  ];
  const teacherLevels = profileLevels.length > 0 ? profileLevels : childLevels.sort((a, b) => a.localeCompare(b));

  return (
    <AtelierActivityClient
      resource={resource}
      showActions
      schoolChildren={schoolChildren}
      folders={folders}
      teacherLevels={teacherLevels}
    />
  );
}
