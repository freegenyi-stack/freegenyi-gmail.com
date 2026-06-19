import React from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getFamilyChildren } from "@/lib/family/server";
import { getAuthoringResource, getAuthoringResourceForFamily } from "@/lib/authoring/resources.server";
import { buildSchoolHeader } from "@/lib/authoring/document-header";
import { resolveFamilyProgressForResource } from "@/lib/authoring/assignments.server";
import { requireAuthoringUser } from "@/lib/authoring/session";
import type { AuthoringUser } from "@/lib/authoring/session";
import AtelierDocumentClient from "@/components/atelier/AtelierDocumentClient";
import ParentAtelierFocusFrame from "@/components/parent/ParentAtelierFocusFrame";

async function teacherHeaderFromResource(ownerUserId: number) {
  const [teacher] = await db
    .select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      role: users.role,
      metadata: users.metadata,
    })
    .from(users)
    .where(eq(users.id, ownerUserId))
    .limit(1);

  if (!teacher) {
    return { schoolName: "", teacherName: "", subjects: [], levels: [], schoolYear: "" };
  }

  let metadata: Record<string, unknown> = {};
  try {
    metadata = teacher.metadata ? (JSON.parse(teacher.metadata) as Record<string, unknown>) : {};
  } catch {
    metadata = {};
  }

  const authoringUser: AuthoringUser = {
    id: teacher.id,
    email: teacher.email,
    fullName: teacher.fullName,
    role: "enseignant",
    metadata,
  };

  return buildSchoolHeader(authoringUser);
}

export default async function ParentAtelierDocumentPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ assignment?: string }>;
}) {
  const { locale, id } = await params;
  const { assignment: assignmentParam } = await searchParams;
  const session = await auth();
  if (!session?.user?.email) redirect(`/${locale}/auth/login`);

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));
  if (!user) redirect(`/${locale}/auth/login`);

  const resourceId = parseInt(id, 10);
  if (Number.isNaN(resourceId)) notFound();

  const authoringUser = await requireAuthoringUser();
  let resource = authoringUser ? await getAuthoringResource(resourceId, authoringUser.id, "parent") : null;
  let readOnly = false;

  if (!resource) {
    const children = await getFamilyChildren(user);
    const childIds = children.map((c) => c.id);
    resource = await getAuthoringResourceForFamily(resourceId, childIds);
    readOnly = true;
  }

  if (!resource || resource.kind !== "document") notFound();

  let progressId: number | null = null;
  if (readOnly) {
    const children = await getFamilyChildren(user);
    const childIds = children.map((c) => c.id);
    const assignmentId = assignmentParam ? parseInt(assignmentParam, 10) : null;
    progressId = await resolveFamilyProgressForResource({
      childIds,
      resourceId,
      assignmentId: assignmentId != null && !Number.isNaN(assignmentId) ? assignmentId : null,
    });
  }

  const header = readOnly
    ? await teacherHeaderFromResource(resource.ownerUserId)
    : authoringUser
      ? await buildSchoolHeader(authoringUser)
      : await teacherHeaderFromResource(resource.ownerUserId);

  return (
    <ParentAtelierFocusFrame>
      <AtelierDocumentClient
        resource={resource}
        header={header}
        backHref="/dashboard/parent/atelier"
        readOnly={readOnly}
        progressId={progressId}
      />
    </ParentAtelierFocusFrame>
  );
}
