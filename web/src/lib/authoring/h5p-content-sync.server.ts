import { buildH5pContentParams } from "./assistant-h5p-params";
import {
  bootstrapH5pLibraries,
  createH5pContent,
  h5pServerFetch,
  isH5pConfigured,
  resolveH5pLibrary,
} from "./h5p.server";
import { patchAuthoringResourceH5pContentId, updateAuthoringResource } from "./resources.server";
import type { AuthoringOwnerRole, AuthoringResourceRow } from "./types";

export type EnsureH5pContentResult = {
  contentId: string | null;
  repaired: boolean;
  error?: string;
};

function parseAssistantContent(contentJson: string): {
  instructions: string;
  assistantParams: Record<string, unknown>;
} {
  try {
    const parsed = JSON.parse(contentJson) as {
      instructions?: string;
      assistantParams?: Record<string, unknown>;
    };
    return {
      instructions: parsed.instructions ?? "",
      assistantParams: parsed.assistantParams ?? {},
    };
  } catch {
    return { instructions: "", assistantParams: {} };
  }
}

export async function h5pContentExists(contentId: string): Promise<boolean> {
  if (!isH5pConfigured() || !contentId) return false;
  try {
    const res = await h5pServerFetch(
      `/internal/content/${encodeURIComponent(contentId)}/exists`,
      { method: "GET" }
    );
    if (!res.ok) return false;
    const data = (await res.json()) as { exists?: boolean };
    return Boolean(data.exists);
  } catch {
    return false;
  }
}

async function resolveLibrary(machineName: string): Promise<string> {
  let library = (await resolveH5pLibrary(machineName)) ?? machineName;
  if (library.includes(" ")) return library;
  await bootstrapH5pLibraries(false).catch(() => {});
  library = (await resolveH5pLibrary(machineName)) ?? machineName;
  return library;
}

/** Vérifie le contenu interactif et le recrée si absent (ex. après rebuild Docker). */
export async function ensureH5pContentForResource(
  resource: AuthoringResourceRow,
  ownerUserId: number,
  ownerRole: AuthoringOwnerRole
): Promise<EnsureH5pContentResult> {
  if (resource.kind !== "h5p" || !isH5pConfigured()) {
    return { contentId: resource.h5pContentId, repaired: false };
  }

  if (!resource.h5pLibrary) {
    return { contentId: null, repaired: false, error: "library_missing" };
  }

  // Chemin rapide : contenu déjà en base + présent côté moteur
  if (resource.h5pContentId) {
    const exists = await h5pContentExists(resource.h5pContentId);
    if (exists) return { contentId: resource.h5pContentId, repaired: false };
  }

  const library = await resolveLibrary(resource.h5pLibrary);
  if (!library.includes(" ")) {
    return { contentId: null, repaired: false, error: "library_not_installed" };
  }

  const { instructions, assistantParams } = parseAssistantContent(resource.contentJson);
  const params = buildH5pContentParams(
    resource.h5pLibrary,
    assistantParams,
    instructions,
    resource.title
  );

  let created = await createH5pContent({
    library,
    title: resource.title,
    params,
  });
  if (!created.ok) {
    created = await createH5pContent({
      library,
      title: resource.title,
      params: {},
    });
  }

  if (!created.ok) {
    return {
      contentId: null,
      repaired: false,
      error: created.error || "create_failed",
    };
  }

  const updated = await updateAuthoringResource(resource.id, ownerUserId, ownerRole, {
    h5pContentId: created.contentId,
  });
  if (!updated) {
    await patchAuthoringResourceH5pContentId(resource.id, created.contentId);
  }

  return { contentId: created.contentId, repaired: true };
}
