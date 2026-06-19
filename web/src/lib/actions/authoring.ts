"use server";

import { revalidatePath } from "next/cache";
import { ATELIER_ACTIVITY_PATH } from "@/lib/authoring/h5p-config";
import { atelierResourceEditPath } from "@/lib/authoring/visual-config";
import { requireAuthoringUser } from "@/lib/authoring/session";
import {
  createDocumentResource,
  createActivityResource,
  createVisualResource,
  createMindmapResource,
  deleteAuthoringResource,
  duplicateAuthoringResource,
  getAuthoringResource,
  updateAuthoringResource,
} from "@/lib/authoring/resources.server";
import { createH5pContent, bootstrapH5pLibraries, updateH5pContent, deleteH5pContent } from "@/lib/authoring/h5p.server";
import { buildH5pContentParams } from "@/lib/authoring/assistant-h5p-params";
import { ensureH5pContentForResource } from "@/lib/authoring/h5p-content-sync.server";
import { H5P_ASSISTANT_TYPES } from "@/lib/authoring/constants";
import { ACTIVITY_TYPES, H5P_LIBRARY_TO_ACTIVITY } from "@/lib/activities/constants";
import {
  buildDefaultEnvelope,
  serializeActivityEnvelope,
  activityLangFromLocale,
} from "@/lib/activities/content";
import type { ActivityResult, ActivityType } from "@/types/activity";
import type { AuthoringResourceType, AuthoringStatus } from "@/lib/authoring/types";
import { isActivityKind } from "@/lib/authoring/types";
import {
  createAuthoringAssignment,
  getAuthoringProgressContext,
  updateAuthoringProgressStatus,
  updateTeacherProgressStatus,
} from "@/lib/authoring/assignments.server";
import { recordActivityAttempt } from "@/lib/authoring/attempts.server";
import { getAttemptDetailForTeacher } from "@/lib/authoring/attempts.server";
import {
  createAuthoringFolder,
  moveResourceToFolder,
  setResourceTags,
  deleteAuthoringFolder,
  renameAuthoringFolder,
} from "@/lib/authoring/folders.server";
import { listAtelierShareTargets } from "@/lib/authoring/share-targets.server";
import { publishAuthoringResourceToMur } from "@/lib/authoring/mur-publish.server";
import { unpublishMurSharesForResource } from "@/lib/pedagogy/shares.server";
import { notifyAuthoringAssignmentReminder } from "@/lib/authoring/assignment-notify.server";
import { getFamilyChildren } from "@/lib/family/server";
import { findOrCreateDirectConversation, sendMessage } from "@/lib/messaging/conversations.server";
import type { MessagingUser } from "@/lib/messaging/session";
import {
  resolveAuthoringActionContext,
  resourceBelongsToExploreSession,
  exploreTagsJson,
  revalidateExploreAtelier,
  type AuthoringActionContext,
} from "@/lib/explore/authoring.server";
import type { ExploreRole } from "@/lib/explore/constants";
import type { AuthoringResourceRow } from "@/lib/authoring/types";

async function actionCtx(): Promise<AuthoringActionContext | null> {
  return resolveAuthoringActionContext();
}

async function scopedResource(ctx: AuthoringActionContext, id: number): Promise<AuthoringResourceRow | null> {
  const resource = await getAuthoringResource(id, ctx.user.id, ctx.user.role);
  if (!resource) return null;
  if (ctx.exploreSessionId && !resourceBelongsToExploreSession(resource.tags, ctx.exploreSessionId)) return null;
  return resource;
}

function revalidateAfter(ctx: AuthoringActionContext) {
  if (ctx.exploreSessionId) {
    const role: ExploreRole = ctx.user.role === "enseignant" ? "teacher" : "parent";
    revalidateExploreAtelier(role);
  } else {
    revalidateAtelier(ctx.user.role);
  }
}

async function tagExploreResource(ctx: AuthoringActionContext, resourceId: number) {
  if (!ctx.exploreSessionId) return;
  await setResourceTags({
    resourceId,
    ownerUserId: ctx.user.id,
    ownerRole: ctx.user.role,
    tags: exploreTagsJson(ctx.exploreSessionId),
  });
}

function toActivityResult(resourceId: number, result: ActivityResult): ActivityResult {
  const stars = Math.min(3, Math.max(1, result.nbEtoiles)) as 1 | 2 | 3;
  return {
    activityId: String(resourceId),
    score: result.score,
    xpGagne: result.xpGagne,
    nbEtoiles: stars,
    tempsSecondes: result.tempsSecondes ?? 0,
    erreurs: result.erreurs ?? 0,
    answers: result.answers,
  };
}
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

function revalidateAtelier(role: "enseignant" | "parent" = "enseignant") {
  if (role === "parent") {
    revalidatePath("/dashboard/parent/atelier");
  } else {
    revalidatePath("/dashboard/enseignant/atelier");
    revalidatePath("/dashboard/enseignant/atelier/classe");
    revalidatePath("/dashboard/enseignant/classe");
  }
}

export async function createAtelierDocumentAction(formData: FormData) {
  const ctx = await actionCtx();
  if (!ctx) return { error: "unauthorized" as const };
  const { user } = ctx;

  const title = String(formData.get("title") || "").trim();
  const templateId = String(formData.get("templateId") || "t1");
  const subject = String(formData.get("subject") || "").trim() || undefined;
  const schoolLevel = String(formData.get("schoolLevel") || "").trim() || undefined;
  const folderIdRaw = String(formData.get("folderId") || "").trim();
  const folderId = folderIdRaw ? parseInt(folderIdRaw, 10) : undefined;

  if (!title) return { error: "title_required" as const };

  const row = await createDocumentResource({
    ownerUserId: user.id,
    ownerRole: user.role,
    title,
    templateId,
    subject,
    schoolLevel,
  });

  await tagExploreResource(ctx, row.id);

  if (folderId && !Number.isNaN(folderId) && !ctx.exploreSessionId) {
    await moveResourceToFolder({
      resourceId: row.id,
      ownerUserId: user.id,
      ownerRole: user.role,
      folderId,
    });
  }

  revalidateAfter(ctx);
  return { success: true as const, id: row.id };
}

export async function createAtelierVisualAction(formData: FormData) {
  const ctx = await actionCtx();
  if (!ctx) return { error: "unauthorized" as const };
  const { user } = ctx;

  const title = String(formData.get("title") || "").trim();
  const templateId = String(formData.get("templateId") || "v0");
  const formatId = String(formData.get("formatId") || "a4-portrait");
  const subject = String(formData.get("subject") || "").trim() || undefined;
  const schoolLevel = String(formData.get("schoolLevel") || "").trim() || undefined;
  const folderIdRaw = String(formData.get("folderId") || "").trim();
  const folderId = folderIdRaw ? parseInt(folderIdRaw, 10) : undefined;
  const locale = String(formData.get("locale") || "fr");
  const isAr = locale.startsWith("ar") || locale.endsWith("-ar");

  if (!title) return { error: "title_required" as const };

  const { buildVisualStoreJson } = await import("@/lib/authoring/visual-templates");
  const row = await createVisualResource({
    ownerUserId: user.id,
    ownerRole: user.role,
    title,
    templateId,
    subject,
    schoolLevel,
    contentJson: buildVisualStoreJson(title, templateId, { isAr, formatId }),
  });

  await tagExploreResource(ctx, row.id);

  if (folderId && !Number.isNaN(folderId) && !ctx.exploreSessionId) {
    await moveResourceToFolder({
      resourceId: row.id,
      ownerUserId: user.id,
      ownerRole: user.role,
      folderId,
    });
  }

  revalidateAfter(ctx);
  return { success: true as const, id: row.id };
}

export async function createAtelierMindmapAction(formData: FormData) {
  const ctx = await actionCtx();
  if (!ctx) return { error: "unauthorized" as const };
  const { user } = ctx;

  const title = String(formData.get("title") || "").trim();
  const templateId = String(formData.get("templateId") || "m0");
  const editorModeRaw = String(formData.get("editorMode") || "excalidraw");
  const editorMode = editorModeRaw === "markmap" ? "markmap" : "excalidraw";
  const subject = String(formData.get("subject") || "").trim() || undefined;
  const schoolLevel = String(formData.get("schoolLevel") || "").trim() || undefined;
  const folderIdRaw = String(formData.get("folderId") || "").trim();
  const folderId = folderIdRaw ? parseInt(folderIdRaw, 10) : undefined;
  const locale = String(formData.get("locale") || "fr");
  const isAr = locale.startsWith("ar") || locale.endsWith("-ar");

  if (!title) return { error: "title_required" as const };

  const { buildMindmapJson } = await import("@/lib/authoring/mindmap-templates");
  const row = await createMindmapResource({
    ownerUserId: user.id,
    ownerRole: user.role,
    title,
    templateId,
    subject,
    schoolLevel,
    contentJson: buildMindmapJson(title, templateId, { isAr, mode: editorMode }),
  });

  await tagExploreResource(ctx, row.id);

  if (folderId && !Number.isNaN(folderId) && !ctx.exploreSessionId) {
    await moveResourceToFolder({
      resourceId: row.id,
      ownerUserId: user.id,
      ownerRole: user.role,
      folderId,
    });
  }

  revalidateAfter(ctx);
  return { success: true as const, id: row.id };
}

export async function saveAtelierMindmapAction(id: number, contentJson: string, title?: string) {
  const ctx = await actionCtx();
  if (!ctx) return { error: "unauthorized" as const };
  const { user } = ctx;

  const existing = await scopedResource(ctx, id);
  if (!existing) return { error: "not_found" as const };

  const row = await updateAuthoringResource(id, user.id, user.role, {
    contentJson,
    ...(title ? { title } : {}),
  });
  if (!row) return { error: "not_found" as const };

  revalidateAfter(ctx);
  const exploreRole = user.role === "enseignant" ? "enseignant" : "parent";
  const base = ctx.exploreSessionId ? `/dashboard/explore/${exploreRole}` : `/dashboard/${exploreRole}`;
  revalidatePath(`${base}/atelier/carte-mentale/${id}`);
  return { success: true as const };
}

export async function saveAtelierVisualAction(id: number, contentJson: string, title?: string) {
  const ctx = await actionCtx();
  if (!ctx) return { error: "unauthorized" as const };
  const { user } = ctx;

  const existing = await scopedResource(ctx, id);
  if (!existing) return { error: "not_found" as const };

  const row = await updateAuthoringResource(id, user.id, user.role, {
    contentJson,
    ...(title ? { title } : {}),
  });
  if (!row) return { error: "not_found" as const };

  revalidateAfter(ctx);
  const exploreRole = user.role === "enseignant" ? "enseignant" : "parent";
  const base = ctx.exploreSessionId ? `/dashboard/explore/${exploreRole}` : `/dashboard/${exploreRole}`;
  revalidatePath(`${base}/atelier/visuel/${id}`);
  return { success: true as const };
}

export async function saveAtelierDocumentAction(id: number, contentJson: string, title?: string) {
  const ctx = await actionCtx();
  if (!ctx) return { error: "unauthorized" as const };
  const { user } = ctx;

  const existing = await scopedResource(ctx, id);
  if (!existing) return { error: "not_found" as const };

  const row = await updateAuthoringResource(id, user.id, user.role, {
    contentJson,
    ...(title ? { title } : {}),
  });
  if (!row) return { error: "not_found" as const };

  revalidateAfter(ctx);
  const exploreRole = user.role === "enseignant" ? "enseignant" : "parent";
  const base = ctx.exploreSessionId ? `/dashboard/explore/${exploreRole}` : `/dashboard/${exploreRole}`;
  revalidatePath(`${base}/atelier/document/${id}`);
  return { success: true as const };
}

export async function createAtelierActivityAction(formData: FormData) {
  const ctx = await actionCtx();
  if (!ctx) return { error: "unauthorized" as const };
  const { user } = ctx;

  const title = String(formData.get("title") || "").trim();
  const activityTypeRaw = String(formData.get("activityType") || "QCM").trim();
  const subject = String(formData.get("subject") || "").trim() || undefined;
  const schoolLevel = String(formData.get("schoolLevel") || "").trim() || undefined;
  const instructions = String(formData.get("instructions") || "").trim();

  if (!title) return { error: "title_required" as const };

  const activityType = (
    ACTIVITY_TYPES.some((t) => t.id === activityTypeRaw) ? activityTypeRaw : "QCM"
  ) as ActivityType;

  const meta = ACTIVITY_TYPES.find((t) => t.id === activityType);
  const lang = activityLangFromLocale("fr");
  const envelope = buildDefaultEnvelope(activityType, title, lang);
  if (instructions) {
    envelope.instructions_fr = instructions;
    envelope.instructions_ar = instructions;
  }
  envelope.titre_fr = title;
  envelope.titre_ar = title;

  const row = await createActivityResource({
    ownerUserId: user.id,
    ownerRole: user.role,
    title,
    activityType,
    resourceType: activityType === "FLASHCARDS" ? "revision" : "activity",
    subject,
    schoolLevel,
    contentJson: serializeActivityEnvelope(envelope),
  });

  await tagExploreResource(ctx, row.id);

  revalidateAfter(ctx);
  return { success: true as const, id: row.id, activityType: meta?.id ?? activityType };
}

export async function saveAtelierActivityAction(resourceId: number, contentJson: string) {
  const ctx = await actionCtx();
  if (!ctx) return { error: "unauthorized" as const };
  const { user } = ctx;

  const existing = await scopedResource(ctx, resourceId);
  if (!existing) return { error: "not_found" as const };

  const row = await updateAuthoringResource(resourceId, user.id, user.role, { contentJson });
  if (!row) return { error: "not_found" as const };

  revalidateAfter(ctx);
  const exploreRole = user.role === "enseignant" ? "enseignant" : "parent";
  const base = ctx.exploreSessionId ? `/dashboard/explore/${exploreRole}` : `/dashboard/${exploreRole}`;
  revalidatePath(`${base}/atelier/activite/${resourceId}`);
  return { success: true as const };
}

/** @deprecated Utiliser createAtelierActivityAction — conservé pour compatibilité routes. */
export async function createAtelierH5pAction(formData: FormData) {
  const activityType =
    H5P_LIBRARY_TO_ACTIVITY[String(formData.get("library") || "").split(" ")[0] ?? ""] ??
    H5P_LIBRARY_TO_ACTIVITY[String(formData.get("library") || "")] ??
    "QCM";
  formData.set("activityType", activityType);
  return createAtelierActivityAction(formData);
}

export async function deleteAtelierResourceAction(id: number) {
  const ctx = await actionCtx();
  if (!ctx) return { error: "unauthorized" as const };
  const { user } = ctx;

  const resource = await scopedResource(ctx, id);
  if (!resource) return { error: "not_found" as const };

  if (isActivityKind(resource.kind) && resource.h5pContentId) {
    await deleteH5pContent(resource.h5pContentId).catch(() => false);
  }

  const ok = await deleteAuthoringResource(id, user.id, user.role);
  if (!ok) return { error: "not_found" as const };

  revalidateAfter(ctx);
  return { success: true as const };
}

export async function duplicateAtelierResourceAction(resourceId: number, locale: string) {
  const ctx = await actionCtx();
  if (!ctx) return { error: "unauthorized" as const };
  const { user } = ctx;

  const existing = await scopedResource(ctx, resourceId);
  if (!existing) return { error: "not_found" as const };

  const copy = await duplicateAuthoringResource(resourceId, user.id, user.role);
  if (!copy) return { error: "not_found" as const };

  await tagExploreResource(ctx, copy.id);

  revalidateAfter(ctx);
  const exploreRole = user.role === "enseignant" ? "enseignant" : "parent";
  const base = ctx.exploreSessionId
    ? `/dashboard/explore/${exploreRole}/atelier`
    : user.role === "parent"
      ? "/dashboard/parent/atelier"
      : "/dashboard/enseignant/atelier";
  const path = `/${locale}${atelierResourceEditPath(copy.kind, copy.id, base)}`;
  return { success: true as const, id: copy.id, path };
}

export async function getAtelierAttemptDetailAction(attemptId: number) {
  const user = await requireAuthoringUser();
  if (!user || user.role !== "enseignant") return { error: "unauthorized" as const };

  const detail = await getAttemptDetailForTeacher(attemptId, user.id);
  if (!detail) return { error: "not_found" as const };

  return {
    success: true as const,
      detail: {
      ...detail,
      completedAt: detail.completedAt.toISOString(),
      envelope: detail.envelope ? JSON.stringify(detail.envelope) : null,
      answers: detail.answers ? JSON.stringify(detail.answers) : null,
    },
  };
}

/** Resynchronise le contenu interactif d'une ressource (réparation automatique). */
export async function repairH5pContentAction(resourceId: number) {
  const user = await requireAuthoringUser();
  if (!user) return { error: "unauthorized" as const };

  const resource = await getAuthoringResource(resourceId, user.id, user.role);
  if (!resource || resource.kind !== "h5p") return { error: "not_found" as const };

  const ensured = await ensureH5pContentForResource(resource, user.id, user.role);
  revalidateAtelier(user.role);
  revalidatePath(`/dashboard/${user.role === "parent" ? "parent" : "enseignant"}/atelier/${ATELIER_ACTIVITY_PATH}/${resourceId}`);

  if (ensured.contentId) {
    return { success: true as const, contentId: ensured.contentId, repaired: ensured.repaired };
  }
  return { error: "repair_failed" as const, detail: ensured.error || "create_failed" };
}

export async function publishAtelierResourceAction(
  resourceId: number,
  publish: boolean,
  locale?: string
) {
  const user = await requireAuthoringUser();
  if (!user) return { error: "unauthorized" as const };

  if (!publish) {
    const row = await updateAuthoringResource(resourceId, user.id, user.role, { status: "draft" });
    if (!row) return { error: "not_found" as const };
    if (user.role === "enseignant") {
      await unpublishMurSharesForResource(user.id, resourceId);
    }
    revalidateAtelier(user.role);
    revalidatePath("/dashboard/enseignant/mur");
    return { success: true as const, status: "draft" as const };
  }

  const loc = locale || "fr";
  const mur = await publishAuthoringResourceToMur(user, resourceId, loc);
  if (mur.ok) {
    revalidateAtelier(user.role);
    revalidatePath("/dashboard/enseignant/mur");
    return {
      success: true as const,
      status: "published" as const,
      murPosted: true as const,
      shareId: mur.shareId,
    };
  }

  if (mur.error === "verification") {
    const row = await updateAuthoringResource(resourceId, user.id, user.role, { status: "published" });
    if (!row) return { error: "not_found" as const };
    revalidateAtelier(user.role);
    return {
      success: true as const,
      status: "published" as const,
      murSkipped: true as const,
      murReason: mur.detail || "verification",
    };
  }

  if (mur.error === "not_found") return { error: "not_found" as const };
  return { error: "mur_failed" as const, detail: mur.detail };
}

export async function assignAtelierResourceAction(formData: FormData) {
  const user = await requireAuthoringUser();
  if (!user || user.role !== "enseignant") return { error: "unauthorized" as const };

  const resourceId = parseInt(String(formData.get("resourceId") || ""), 10);
  const childRaw = String(formData.get("childId") || "").trim();
  const childId = childRaw ? parseInt(childRaw, 10) : null;
  const assignLevel = String(formData.get("assignLevel") || "").trim() || null;
  const note = String(formData.get("note") || "").trim() || null;
  const dueRaw = String(formData.get("dueAt") || "").trim();
  const locale = String(formData.get("locale") || "fr");
  const dueAt = dueRaw ? new Date(dueRaw) : null;

  if (Number.isNaN(resourceId)) return { error: "invalid_resource" as const };

  const result = await createAuthoringAssignment({
    teacherId: user.id,
    teacherMetadata: user.metadata,
    resourceId,
    childId: childId && !Number.isNaN(childId) ? childId : null,
    assignLevel,
    note,
    dueAt,
    locale,
  });

  if ("error" in result) {
    const err = result.error;
    if (err === "school_required") return { error: "school_required" as const };
    if (err === "no_students") return { error: "no_students" as const };
    return { error: err as "resource_not_found" };
  }

  revalidateAtelier("enseignant");
  return { success: true as const, assignmentId: result.assignmentId };
}

export async function createAtelierFolderAction(name: string) {
  const user = await requireAuthoringUser();
  if (!user) return { error: "unauthorized" as const };
  if (!name.trim()) return { error: "name_required" as const };

  const folder = await createAuthoringFolder({
    ownerUserId: user.id,
    ownerRole: user.role,
    name: name.trim(),
  });
  revalidateAtelier(user.role);
  return { success: true as const, id: folder.id, name: folder.name };
}

export async function moveAtelierResourceFolderAction(resourceId: number, folderId: number | null) {
  const user = await requireAuthoringUser();
  if (!user) return { error: "unauthorized" as const };

  const ok = await moveResourceToFolder({
    resourceId,
    ownerUserId: user.id,
    ownerRole: user.role,
    folderId,
  });
  if (!ok) return { error: "not_found" as const };
  revalidateAtelier(user.role);
  return { success: true as const };
}

export async function tagAtelierResourceAction(resourceId: number, tags: string) {
  const user = await requireAuthoringUser();
  if (!user) return { error: "unauthorized" as const };

  const ok = await setResourceTags({
    resourceId,
    ownerUserId: user.id,
    ownerRole: user.role,
    tags,
  });
  if (!ok) return { error: "not_found" as const };
  revalidateAtelier(user.role);
  return { success: true as const };
}

export async function shareAtelierResourceMessageAction(formData: FormData) {
  const user = await requireAuthoringUser();
  if (!user) return { error: "unauthorized" as const };

  const resourceId = parseInt(String(formData.get("resourceId") || ""), 10);
  const targetUserId = parseInt(String(formData.get("targetUserId") || ""), 10);
  const locale = String(formData.get("locale") || "fr");

  if (Number.isNaN(resourceId) || Number.isNaN(targetUserId)) return { error: "invalid" as const };

  const resource = await getAuthoringResource(resourceId, user.id, user.role);
  if (!resource) return { error: "not_found" as const };

  const messagingUser: MessagingUser = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    username: null,
    role: user.role,
    familyId: null,
    image: null,
    lastLoginAt: null,
    lastSeenAt: null,
    metadata: user.metadata,
  };

  const conv = await findOrCreateDirectConversation(messagingUser, targetUserId);
  if (!("conversationId" in conv)) return { error: "cannot_message" as const };

  const base = user.role === "parent" ? "/dashboard/parent/atelier" : "/dashboard/enseignant/atelier";
  const path = atelierResourceEditPath(resource.kind, resource.id, base);
  const link = `/${locale}${path}`;
  const text =
    locale.startsWith("ar")
      ? `📎 ${resource.title}\n${link}`
      : `📎 Ressource partagée : ${resource.title}\n${link}`;

  await sendMessage(conv.conversationId, messagingUser, text, { locale });
  return { success: true as const };
}

export async function markParentAtelierProgressAction(
  progressId: number,
  status: "pending" | "in_progress" | "done",
  result?: ActivityResult
) {
  const user = await requireAuthoringUser();
  if (!user || user.role !== "parent") return { error: "unauthorized" as const };

  const [dbUser] = await db.select({ familyId: users.familyId }).from(users).where(eq(users.id, user.id)).limit(1);
  const childrenData = await getFamilyChildren({ id: user.id, familyId: dbUser?.familyId ?? null });
  const childIds = childrenData.map((c) => c.id);

  const res = await updateAuthoringProgressStatus({
    progressId,
    userId: user.id,
    childIds,
    status,
    score: result?.score,
    xpEarned: result?.xpGagne,
    stars: result?.nbEtoiles,
  });
  if ("error" in res) return { error: res.error as "not_found" };

  if (status === "done" && result) {
    const ctx = await getAuthoringProgressContext(progressId);
    if (ctx) {
      await recordActivityAttempt({
        resourceId: ctx.resourceId,
        teacherUserId: ctx.teacherUserId,
        childId: ctx.childId,
        submittedByUserId: user.id,
        progressId,
        source: "assignment",
        result: toActivityResult(ctx.resourceId, result),
      });
    }
  }

  revalidateAtelier("parent");
  revalidateAtelier("enseignant");
  return { success: true as const };
}

export async function markTeacherAtelierProgressAction(progressId: number, status: "pending" | "in_progress" | "done") {
  const user = await requireAuthoringUser();
  if (!user || user.role !== "enseignant") return { error: "unauthorized" as const };

  const result = await updateTeacherProgressStatus({
    progressId,
    teacherId: user.id,
    status,
  });
  if ("error" in result) return { error: result.error as "not_found" };

  revalidateAtelier("enseignant");
  return { success: true as const };
}

export async function saveAtelierAssistantAction(resourceId: number, assistantParams: string, instructions?: string) {
  const user = await requireAuthoringUser();
  if (!user) return { error: "unauthorized" as const };

  let parsed: Record<string, unknown> = {};
  try {
    parsed = JSON.parse(assistantParams) as Record<string, unknown>;
  } catch {
    return { error: "invalid_json" as const };
  }

  const resource = await getAuthoringResource(resourceId, user.id, user.role);
  if (!resource || resource.kind !== "h5p") return { error: "not_found" as const };

  const row = await updateAuthoringResource(resourceId, user.id, user.role, {
    contentJson: JSON.stringify({ instructions: instructions ?? "", assistantParams: parsed }),
  });
  if (!row) return { error: "not_found" as const };

  if (resource.h5pContentId && resource.h5pLibrary) {
    const h5pParams = buildH5pContentParams(
      resource.h5pLibrary,
      parsed,
      instructions,
      resource.title
    );
    const synced = await updateH5pContent({
      contentId: resource.h5pContentId,
      library: resource.h5pLibrary,
      title: resource.title,
      params: h5pParams,
    });
    if (!synced.ok) {
      return { success: true as const, syncWarning: synced.error };
    }
  }

  revalidatePath("/dashboard/enseignant/atelier/classe");
  revalidatePath(`/dashboard/enseignant/atelier/${ATELIER_ACTIVITY_PATH}/${resourceId}`);
  return { success: true as const };
}

export async function listAtelierShareTargetsAction() {
  const user = await requireAuthoringUser();
  if (!user) return { error: "unauthorized" as const };
  const targets = await listAtelierShareTargets(user);
  return { success: true as const, targets };
}

export async function publishAtelierToMurAction(resourceId: number, locale: string) {
  const user = await requireAuthoringUser();
  if (!user || user.role !== "enseignant") return { error: "unauthorized" as const };

  const mur = await publishAuthoringResourceToMur(user, resourceId, locale);
  if (mur.ok) {
    revalidateAtelier(user.role);
    revalidatePath("/dashboard/enseignant/mur");
    return { success: true as const, shareId: mur.shareId };
  }
  if (mur.error === "not_found") return { error: "not_found" as const };
  if (mur.error === "verification") return { error: "verification" as const, detail: mur.detail };
  return { error: "mur_failed" as const, detail: mur.detail };
}

export async function bulkAtelierResourcesAction(formData: FormData) {
  const ctx = await actionCtx();
  if (!ctx) return { error: "unauthorized" as const };
  const { user, exploreSessionId } = ctx;

  const action = String(formData.get("action") || "").trim();
  const locale = String(formData.get("locale") || "fr");
  const ids = formData
    .getAll("ids")
    .map((v) => parseInt(String(v), 10))
    .filter((n) => !Number.isNaN(n));

  if (ids.length === 0) return { error: "empty" as const };
  if (exploreSessionId && (action === "publish" || action === "draft")) {
    return { error: "invalid_action" as const };
  }
  if (!["delete", "archive", "publish", "draft"].includes(action)) {
    return { error: "invalid_action" as const };
  }

  let done = 0;
  let murFailed = 0;

  for (const id of ids) {
    if (action === "delete") {
      const resource = await scopedResource(ctx, id);
      if (!resource) continue;
      if (isActivityKind(resource.kind) && resource.h5pContentId) {
        await deleteH5pContent(resource.h5pContentId).catch(() => false);
      }
      const ok = await deleteAuthoringResource(id, user.id, user.role);
      if (ok) done++;
    } else if (action === "archive") {
      const resource = await scopedResource(ctx, id);
      if (!resource) continue;
      const row = await updateAuthoringResource(id, user.id, user.role, { status: "archived" });
      if (row) done++;
    } else if (action === "draft") {
      const resource = await scopedResource(ctx, id);
      if (!resource) continue;
      const row = await updateAuthoringResource(id, user.id, user.role, { status: "draft" });
      if (row && user.role === "enseignant") await unpublishMurSharesForResource(user.id, id);
      if (row) done++;
    } else if (action === "publish") {
      const resource = await scopedResource(ctx, id);
      if (!resource) continue;
      const mur = await publishAuthoringResourceToMur(user, id, locale);
      if (mur.ok) done++;
      else if (mur.error === "verification") {
        const row = await updateAuthoringResource(id, user.id, user.role, { status: "published" });
        if (row) done++;
      } else {
        murFailed++;
      }
    }
  }

  revalidateAfter(ctx);
  if (!exploreSessionId) revalidatePath("/dashboard/enseignant/mur");
  return { success: true as const, done, total: ids.length, murFailed };
}

export async function remindAtelierProgressAction(progressId: number, locale: string) {
  const user = await requireAuthoringUser();
  if (!user || user.role !== "enseignant") return { error: "unauthorized" as const };

  const result = await notifyAuthoringAssignmentReminder({
    progressId,
    teacherId: user.id,
    locale,
  });
  if ("error" in result) return { error: result.error as "not_found" | "no_parent" | "already_done" };
  return { success: true as const };
}

export async function renameAtelierFolderAction(folderId: number, name: string) {
  const user = await requireAuthoringUser();
  if (!user) return { error: "unauthorized" as const };
  const ok = await renameAuthoringFolder(folderId, user.id, user.role, name);
  if (!ok) return { error: "not_found" as const };
  revalidateAtelier(user.role);
  return { success: true as const };
}

export async function deleteAtelierFolderAction(folderId: number) {
  const user = await requireAuthoringUser();
  if (!user) return { error: "unauthorized" as const };
  const ok = await deleteAuthoringFolder(folderId, user.id, user.role);
  if (!ok) return { error: "not_found" as const };
  revalidateAtelier(user.role);
  return { success: true as const };
}
