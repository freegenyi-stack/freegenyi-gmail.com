import React from "react";
import { notFound } from "next/navigation";
import { requireTeacherPage } from "@/lib/teacher/requireTeacherPage";
import { requireAuthoringUser } from "@/lib/authoring/session";
import { getAuthoringResource } from "@/lib/authoring/resources.server";
import { listAuthoringFolders } from "@/lib/authoring/folders.server";
import { listTeacherSchoolChildren, teacherSchoolIdFromMetadata } from "@/lib/library/books.server";
import { buildSchoolHeader } from "@/lib/authoring/document-header";
import AtelierMindmapClient from "@/components/atelier/AtelierMindmapClient";

export const dynamic = "force-dynamic";

export default async function TeacherAtelierMindmapPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const { user } = await requireTeacherPage(locale);
  const authoringUser = await requireAuthoringUser();
  if (!authoringUser) notFound();

  const resourceId = parseInt(id, 10);
  if (Number.isNaN(resourceId)) notFound();

  const resource = await getAuthoringResource(resourceId, user.id, "enseignant");
  if (!resource || resource.kind !== "mindmap") notFound();

  const schoolId = teacherSchoolIdFromMetadata(user.metadata);
  const [folders, schoolChildren, header] = await Promise.all([
    listAuthoringFolders(user.id, "enseignant"),
    schoolId ? listTeacherSchoolChildren(schoolId) : Promise.resolve([]),
    buildSchoolHeader(authoringUser),
  ]);
  const teacherLevels = header.levels.filter((l) => l && l !== "—");

  return (
    <AtelierMindmapClient
      resource={resource}
      showActions
      schoolChildren={schoolChildren}
      folders={folders}
      teacherLevels={teacherLevels}
    />
  );
}
