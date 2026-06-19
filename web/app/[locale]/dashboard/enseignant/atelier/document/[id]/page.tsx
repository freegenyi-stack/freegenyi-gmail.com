import React from "react";
import { notFound } from "next/navigation";
import { requireTeacherPage } from "@/lib/teacher/requireTeacherPage";
import { requireAuthoringUser } from "@/lib/authoring/session";
import { getAuthoringResource } from "@/lib/authoring/resources.server";
import { buildSchoolHeader } from "@/lib/authoring/document-header";
import { listAuthoringFolders } from "@/lib/authoring/folders.server";
import {
  listTeacherSchoolChildren,
  teacherSchoolIdFromMetadata,
} from "@/lib/library/books.server";
import AtelierDocumentClient from "@/components/atelier/AtelierDocumentClient";

export default async function AtelierDocumentPage({
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
  if (!resource || resource.kind !== "document") notFound();

  const schoolId = teacherSchoolIdFromMetadata(user.metadata);
  const [header, folders, schoolChildren] = await Promise.all([
    buildSchoolHeader(user),
    listAuthoringFolders(user.id, user.role),
    schoolId ? listTeacherSchoolChildren(schoolId) : Promise.resolve([]),
  ]);

  const teacherLevels = header.levels.filter((l) => l && l !== "—");

  return (
    <AtelierDocumentClient
      resource={resource}
      header={header}
      showActions
      schoolChildren={schoolChildren}
      folders={folders}
      teacherLevels={teacherLevels}
    />
  );
}
