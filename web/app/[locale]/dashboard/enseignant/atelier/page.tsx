import React from "react";
import { requireTeacherPage } from "@/lib/teacher/requireTeacherPage";
import { requireAuthoringUser } from "@/lib/authoring/session";
import { listAuthoringResources } from "@/lib/authoring/resources.server";
import { buildSchoolHeader } from "@/lib/authoring/document-header";
import { listAuthoringFolders } from "@/lib/authoring/folders.server";
import { listTeacherAuthoringAssignments } from "@/lib/authoring/assignments.server";
import {
  listTeacherSchoolChildren,
  teacherSchoolIdFromMetadata,
} from "@/lib/library/books.server";
import AtelierHubClient from "@/components/atelier/AtelierHubClient";

export default async function TeacherAtelierPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireTeacherPage(locale);
  const user = await requireAuthoringUser();
  if (!user || user.role !== "enseignant") {
    return null;
  }

  const schoolId = teacherSchoolIdFromMetadata(user.metadata);
  const [resources, folders, assignments, schoolChildren, header] = await Promise.all([
    listAuthoringResources(user.id, user.role),
    listAuthoringFolders(user.id, user.role),
    listTeacherAuthoringAssignments(user.id),
    schoolId ? listTeacherSchoolChildren(schoolId) : Promise.resolve([]),
    buildSchoolHeader(user),
  ]);

  const profileLevels = header.levels.filter((l) => l && l !== "—");
  const childLevels = [
    ...new Set(schoolChildren.map((c) => c.educationLevel).filter(Boolean) as string[]),
  ];
  const teacherLevels = profileLevels.length > 0 ? profileLevels : childLevels.sort((a, b) => a.localeCompare(b));

  return (
    <AtelierHubClient
      resources={resources}
      schoolChildren={schoolChildren}
      folders={folders}
      assignments={assignments}
      teacherLevels={teacherLevels}
      hasSchool={!!schoolId}
    />
  );
}
