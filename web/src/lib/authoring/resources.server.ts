import { db } from "@/db";
import { authoringAssignments, authoringProgress, authoringResources } from "@/db/schema";
import { and, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { currentSchoolYear, templateToResourceType } from "./constants";
import { defaultTipTapDocument } from "./tiptap-templates";
import type {
  AuthoringKind,
  AuthoringOwnerRole,
  AuthoringResourceDto,
  AuthoringResourceRow,
  AuthoringResourceType,
  AuthoringStatus,
} from "./types";
import { isActivityKind } from "./types";

function mapRow(row: typeof authoringResources.$inferSelect): AuthoringResourceRow {
  return {
    id: row.id,
    ownerUserId: row.ownerUserId,
    ownerRole: row.ownerRole as AuthoringOwnerRole,
    kind: row.kind as AuthoringKind,
    title: row.title,
    resourceType: row.resourceType as AuthoringResourceType,
    subject: row.subject,
    schoolLevel: row.schoolLevel,
    schoolYear: row.schoolYear,
    folderId: row.folderId,
    status: row.status as AuthoringStatus,
    contentJson: row.contentJson,
    h5pContentId: row.h5pContentId,
    h5pLibrary: row.h5pLibrary,
    templateId: row.templateId,
    tags: row.tags,
    legacyDocumentId: row.legacyDocumentId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function toResourceDto(row: AuthoringResourceRow): AuthoringResourceDto {
  return {
    id: row.id,
    kind: row.kind,
    title: row.title,
    resourceType: row.resourceType,
    subject: row.subject,
    schoolLevel: row.schoolLevel,
    schoolYear: row.schoolYear,
    folderId: row.folderId,
    status: row.status,
    tags: row.tags,
    h5pContentId: row.h5pContentId,
    h5pLibrary: row.h5pLibrary,
    templateId: row.templateId,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function listAuthoringResources(
  ownerUserId: number,
  ownerRole: AuthoringOwnerRole,
  options?: { q?: string; kind?: AuthoringKind }
): Promise<AuthoringResourceDto[]> {
  const conditions = [
    eq(authoringResources.ownerUserId, ownerUserId),
    eq(authoringResources.ownerRole, ownerRole),
  ];

  if (options?.kind) {
    conditions.push(eq(authoringResources.kind, options.kind));
  }

  let query = db
    .select()
    .from(authoringResources)
    .where(and(...conditions))
    .orderBy(desc(authoringResources.updatedAt))
    .limit(100);

  const rows = await query;

  let filtered = rows.map(mapRow);
  if (options?.q?.trim()) {
    const q = options.q.trim().toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        (r.subject ?? "").toLowerCase().includes(q) ||
        r.resourceType.toLowerCase().includes(q)
    );
  }

  return filtered.map(toResourceDto);
}

export async function listAuthoringResourcesForExploreSession(
  ownerUserId: number,
  ownerRole: AuthoringOwnerRole,
  sessionId: string,
  options?: { q?: string; kind?: AuthoringKind }
): Promise<AuthoringResourceDto[]> {
  const all = await listAuthoringResources(ownerUserId, ownerRole, options);
  return all.filter((r) => {
    if (!r.tags) return false;
    try {
      const parsed = JSON.parse(r.tags) as { exploreSession?: string };
      return parsed.exploreSession === sessionId;
    } catch {
      return false;
    }
  });
}

export async function getAuthoringResource(
  id: number,
  ownerUserId: number,
  ownerRole: AuthoringOwnerRole
): Promise<AuthoringResourceRow | null> {
  const [row] = await db
    .select()
    .from(authoringResources)
    .where(
      and(
        eq(authoringResources.id, id),
        eq(authoringResources.ownerUserId, ownerUserId),
        eq(authoringResources.ownerRole, ownerRole)
      )
    )
    .limit(1);
  return row ? mapRow(row) : null;
}

/** Ressource assignée à un enfant de la famille (lecture parent). */
export async function getAuthoringResourceForFamily(
  resourceId: number,
  childIds: number[]
): Promise<AuthoringResourceRow | null> {
  if (childIds.length === 0) return null;

  const [row] = await db
    .select({ resource: authoringResources })
    .from(authoringProgress)
    .innerJoin(authoringAssignments, eq(authoringProgress.assignmentId, authoringAssignments.id))
    .innerJoin(authoringResources, eq(authoringAssignments.resourceId, authoringResources.id))
    .where(
      and(
        eq(authoringResources.id, resourceId),
        inArray(authoringProgress.childId, childIds)
      )
    )
    .limit(1);

  return row ? mapRow(row.resource) : null;
}

export async function createDocumentResource(input: {
  ownerUserId: number;
  ownerRole: AuthoringOwnerRole;
  title: string;
  templateId?: string;
  resourceType?: AuthoringResourceType;
  subject?: string;
  schoolLevel?: string;
  schoolYear?: string;
  contentJson?: string;
}): Promise<AuthoringResourceRow> {
  const templateId = input.templateId ?? "t1";
  const resourceType = input.resourceType ?? templateToResourceType(templateId);
  const contentJson =
    input.contentJson ??
    JSON.stringify(defaultTipTapDocument(input.title, templateId, input.subject, input.schoolLevel));

  const [row] = await db
    .insert(authoringResources)
    .values({
      ownerUserId: input.ownerUserId,
      ownerRole: input.ownerRole,
      kind: "document",
      title: input.title,
      resourceType,
      subject: input.subject ?? null,
      schoolLevel: input.schoolLevel ?? null,
      schoolYear: input.schoolYear ?? currentSchoolYear(),
      templateId,
      contentJson,
      status: "draft",
      updatedAt: new Date(),
    })
    .returning();

  return mapRow(row);
}

export async function createVisualResource(input: {
  ownerUserId: number;
  ownerRole: AuthoringOwnerRole;
  title: string;
  templateId?: string;
  resourceType?: AuthoringResourceType;
  subject?: string;
  schoolLevel?: string;
  contentJson?: string;
}): Promise<AuthoringResourceRow> {
  const templateId = input.templateId ?? "v0";
  const { buildVisualStoreJson, visualTemplateToResourceType } = await import("./visual-templates");
  const resourceType = input.resourceType ?? visualTemplateToResourceType(templateId);
  const contentJson =
    input.contentJson ?? buildVisualStoreJson(input.title, templateId, { isAr: false });

  const [row] = await db
    .insert(authoringResources)
    .values({
      ownerUserId: input.ownerUserId,
      ownerRole: input.ownerRole,
      kind: "visual",
      title: input.title,
      resourceType,
      subject: input.subject ?? null,
      schoolLevel: input.schoolLevel ?? null,
      schoolYear: currentSchoolYear(),
      templateId,
      contentJson,
      status: "draft",
      updatedAt: new Date(),
    })
    .returning();

  return mapRow(row);
}

export async function createMindmapResource(input: {
  ownerUserId: number;
  ownerRole: AuthoringOwnerRole;
  title: string;
  templateId?: string;
  resourceType?: AuthoringResourceType;
  subject?: string;
  schoolLevel?: string;
  contentJson?: string;
}): Promise<AuthoringResourceRow> {
  const templateId = input.templateId ?? "m0";
  const { buildMindmapJson, mindmapTemplateToResourceType } = await import("./mindmap-templates");
  const resourceType = input.resourceType ?? mindmapTemplateToResourceType(templateId);
  const contentJson =
    input.contentJson ?? buildMindmapJson(input.title, templateId, { isAr: false });

  const [row] = await db
    .insert(authoringResources)
    .values({
      ownerUserId: input.ownerUserId,
      ownerRole: input.ownerRole,
      kind: "mindmap",
      title: input.title,
      resourceType,
      subject: input.subject ?? null,
      schoolLevel: input.schoolLevel ?? null,
      schoolYear: currentSchoolYear(),
      templateId,
      contentJson,
      status: "draft",
      updatedAt: new Date(),
    })
    .returning();

  return mapRow(row);
}

/** Crée une activité interactive native (moteur React, sans H5P). */
export async function createActivityResource(input: {
  ownerUserId: number;
  ownerRole: AuthoringOwnerRole;
  title: string;
  activityType: string;
  resourceType: AuthoringResourceType;
  subject?: string;
  schoolLevel?: string;
  contentJson?: string;
}): Promise<AuthoringResourceRow> {
  const [row] = await db
    .insert(authoringResources)
    .values({
      ownerUserId: input.ownerUserId,
      ownerRole: input.ownerRole,
      kind: "activity",
      title: input.title,
      resourceType: input.resourceType,
      subject: input.subject ?? null,
      schoolLevel: input.schoolLevel ?? null,
      schoolYear: currentSchoolYear(),
      h5pLibrary: input.activityType,
      h5pContentId: null,
      contentJson: input.contentJson ?? "{}",
      status: "draft",
      updatedAt: new Date(),
    })
    .returning();

  return mapRow(row);
}

export async function createH5pResource(input: {
  ownerUserId: number;
  ownerRole: AuthoringOwnerRole;
  title: string;
  h5pLibrary: string;
  resourceType: AuthoringResourceType;
  subject?: string;
  schoolLevel?: string;
  h5pContentId?: string | null;
  contentJson?: string;
}): Promise<AuthoringResourceRow> {
  const [row] = await db
    .insert(authoringResources)
    .values({
      ownerUserId: input.ownerUserId,
      ownerRole: input.ownerRole,
      kind: "h5p",
      title: input.title,
      resourceType: input.resourceType,
      subject: input.subject ?? null,
      schoolLevel: input.schoolLevel ?? null,
      schoolYear: currentSchoolYear(),
      h5pLibrary: input.h5pLibrary,
      h5pContentId: input.h5pContentId ?? null,
      contentJson: input.contentJson ?? "{}",
      status: "draft",
      updatedAt: new Date(),
    })
    .returning();

  return mapRow(row);
}

/** Met à jour l’identifiant contenu interactif (réparation système). */
export async function patchAuthoringResourceH5pContentId(
  resourceId: number,
  h5pContentId: string
): Promise<void> {
  await db
    .update(authoringResources)
    .set({ h5pContentId, updatedAt: new Date() })
    .where(eq(authoringResources.id, resourceId));
}

export async function updateAuthoringResource(
  id: number,
  ownerUserId: number,
  ownerRole: AuthoringOwnerRole,
  patch: {
    title?: string;
    contentJson?: string;
    subject?: string;
    schoolLevel?: string;
    status?: AuthoringStatus;
    h5pContentId?: string | null;
  }
): Promise<AuthoringResourceRow | null> {
  const existing = await getAuthoringResource(id, ownerUserId, ownerRole);
  if (!existing) return null;

  const [row] = await db
    .update(authoringResources)
    .set({
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.contentJson !== undefined ? { contentJson: patch.contentJson } : {}),
      ...(patch.subject !== undefined ? { subject: patch.subject } : {}),
      ...(patch.schoolLevel !== undefined ? { schoolLevel: patch.schoolLevel } : {}),
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      ...(patch.h5pContentId !== undefined ? { h5pContentId: patch.h5pContentId } : {}),
      updatedAt: new Date(),
    })
    .where(eq(authoringResources.id, id))
    .returning();

  return row ? mapRow(row) : null;
}

export async function deleteAuthoringResource(
  id: number,
  ownerUserId: number,
  ownerRole: AuthoringOwnerRole
): Promise<boolean> {
  const result = await db
    .delete(authoringResources)
    .where(
      and(
        eq(authoringResources.id, id),
        eq(authoringResources.ownerUserId, ownerUserId),
        eq(authoringResources.ownerRole, ownerRole)
      )
    );
  return (result.rowCount ?? 0) > 0;
}

export async function searchPublishedResources(q: string, limit = 20): Promise<AuthoringResourceDto[]> {
  const term = `%${q.trim()}%`;
  if (!q.trim()) return [];

  const rows = await db
    .select()
    .from(authoringResources)
    .where(
      and(
        eq(authoringResources.status, "published"),
        or(
          ilike(authoringResources.title, term),
          ilike(authoringResources.subject, term),
          ilike(authoringResources.tags, term)
        )
      )
    )
    .orderBy(desc(authoringResources.updatedAt))
    .limit(limit);

  return rows.map((r) => toResourceDto(mapRow(r)));
}

export async function duplicateAuthoringResource(
  id: number,
  ownerUserId: number,
  ownerRole: AuthoringOwnerRole
): Promise<AuthoringResourceRow | null> {
  const existing = await getAuthoringResource(id, ownerUserId, ownerRole);
  if (!existing) return null;

  const copyTitle = `${existing.title} (copie)`;

  if (existing.kind === "document") {
    return createDocumentResource({
      ownerUserId,
      ownerRole,
      title: copyTitle,
      templateId: existing.templateId ?? "t1",
      subject: existing.subject ?? undefined,
      schoolLevel: existing.schoolLevel ?? undefined,
      contentJson: existing.contentJson,
    });
  }

  if (isActivityKind(existing.kind)) {
    const activityType = existing.h5pLibrary ?? "QCM";
    return createActivityResource({
      ownerUserId,
      ownerRole,
      title: copyTitle,
      activityType,
      resourceType: existing.resourceType,
      subject: existing.subject ?? undefined,
      schoolLevel: existing.schoolLevel ?? undefined,
      contentJson: existing.contentJson,
    });
  }

  if (existing.kind === "visual") {
    return createVisualResource({
      ownerUserId,
      ownerRole,
      title: copyTitle,
      templateId: existing.templateId ?? "v1",
      resourceType: existing.resourceType,
      subject: existing.subject ?? undefined,
      schoolLevel: existing.schoolLevel ?? undefined,
      contentJson: existing.contentJson,
    });
  }

  if (existing.kind === "mindmap") {
    return createMindmapResource({
      ownerUserId,
      ownerRole,
      title: copyTitle,
      templateId: existing.templateId ?? "m0",
      resourceType: existing.resourceType,
      subject: existing.subject ?? undefined,
      schoolLevel: existing.schoolLevel ?? undefined,
      contentJson: existing.contentJson,
    });
  }

  return null;
}
