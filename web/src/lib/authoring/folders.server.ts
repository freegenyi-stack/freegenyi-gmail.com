import { db } from "@/db";
import { authoringFolders, authoringResources } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import type { AuthoringOwnerRole } from "./types";
import { currentSchoolYear } from "./constants";

export type AuthoringFolderRow = {
  id: number;
  name: string;
  parentId: number | null;
  schoolYear: string | null;
  createdAt: Date;
};

export async function listAuthoringFolders(
  ownerUserId: number,
  ownerRole: AuthoringOwnerRole
): Promise<AuthoringFolderRow[]> {
  const rows = await db
    .select()
    .from(authoringFolders)
    .where(and(eq(authoringFolders.ownerUserId, ownerUserId), eq(authoringFolders.ownerRole, ownerRole)))
    .orderBy(desc(authoringFolders.createdAt));
  return rows;
}

export async function createAuthoringFolder(input: {
  ownerUserId: number;
  ownerRole: AuthoringOwnerRole;
  name: string;
  parentId?: number | null;
}): Promise<AuthoringFolderRow> {
  const [row] = await db
    .insert(authoringFolders)
    .values({
      ownerUserId: input.ownerUserId,
      ownerRole: input.ownerRole,
      name: input.name.trim(),
      parentId: input.parentId ?? null,
      schoolYear: currentSchoolYear(),
    })
    .returning();
  return row;
}

export async function moveResourceToFolder(input: {
  resourceId: number;
  ownerUserId: number;
  ownerRole: AuthoringOwnerRole;
  folderId: number | null;
}): Promise<boolean> {
  const result = await db
    .update(authoringResources)
    .set({ folderId: input.folderId, updatedAt: new Date() })
    .where(
      and(
        eq(authoringResources.id, input.resourceId),
        eq(authoringResources.ownerUserId, input.ownerUserId),
        eq(authoringResources.ownerRole, input.ownerRole)
      )
    );
  return (result.rowCount ?? 0) > 0;
}

export async function setResourceTags(input: {
  resourceId: number;
  ownerUserId: number;
  ownerRole: AuthoringOwnerRole;
  tags: string;
}): Promise<boolean> {
  const result = await db
    .update(authoringResources)
    .set({ tags: input.tags.trim() || null, updatedAt: new Date() })
    .where(
      and(
        eq(authoringResources.id, input.resourceId),
        eq(authoringResources.ownerUserId, input.ownerUserId),
        eq(authoringResources.ownerRole, input.ownerRole)
      )
    );
  return (result.rowCount ?? 0) > 0;
}

export async function renameAuthoringFolder(
  folderId: number,
  ownerUserId: number,
  ownerRole: AuthoringOwnerRole,
  name: string
): Promise<boolean> {
  const result = await db
    .update(authoringFolders)
    .set({ name: name.trim() })
    .where(
      and(
        eq(authoringFolders.id, folderId),
        eq(authoringFolders.ownerUserId, ownerUserId),
        eq(authoringFolders.ownerRole, ownerRole)
      )
    );
  return (result.rowCount ?? 0) > 0;
}

export async function deleteAuthoringFolder(
  folderId: number,
  ownerUserId: number,
  ownerRole: AuthoringOwnerRole
): Promise<boolean> {
  await db
    .update(authoringResources)
    .set({ folderId: null, updatedAt: new Date() })
    .where(
      and(
        eq(authoringResources.folderId, folderId),
        eq(authoringResources.ownerUserId, ownerUserId),
        eq(authoringResources.ownerRole, ownerRole)
      )
    );

  const result = await db
    .delete(authoringFolders)
    .where(
      and(
        eq(authoringFolders.id, folderId),
        eq(authoringFolders.ownerUserId, ownerUserId),
        eq(authoringFolders.ownerRole, ownerRole)
      )
    );
  return (result.rowCount ?? 0) > 0;
}
