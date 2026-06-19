import { notFound } from "next/navigation";
import { getAuthoringResource } from "@/lib/authoring/resources.server";
import { listAuthoringResourcesForExploreSession } from "@/lib/authoring/resources.server";
import type { AuthoringKind, AuthoringOwnerRole, AuthoringResourceRow } from "@/lib/authoring/types";
import { isActivityKind } from "@/lib/authoring/types";
import { ATELIER_ACTIVITY_PATH } from "@/lib/authoring/h5p-config";
import { ATELIER_MINDMAP_PATH, ATELIER_VISUAL_PATH } from "@/lib/authoring/visual-config";
import { resourceBelongsToExploreSession } from "./authoring.server";
import { exploreAtelierPath, exploreBibliothequePath, type ExploreRole } from "./constants";
import { getExploreSystemUserId, requireExploreSession } from "./session.server";

const EMPTY_HEADER = {
  schoolName: "",
  teacherName: "",
  subjects: [] as string[],
  levels: [] as string[],
  schoolYear: "",
};

export async function loadExploreAtelierResources(role: ExploreRole, locale: string) {
  const session = await requireExploreSession(role, locale);
  const userId = await getExploreSystemUserId(role);
  const ownerRole: AuthoringOwnerRole = role === "teacher" ? "enseignant" : "parent";
  const resources = await listAuthoringResourcesForExploreSession(userId, ownerRole, session.sessionId);
  return { session, resources, ownerRole, basePath: exploreAtelierPath(role) };
}

export async function loadExploreAuthoringResource(
  role: ExploreRole,
  locale: string,
  resourceId: number,
  segment: string
): Promise<{
  resource: AuthoringResourceRow;
  backHref: string;
  header: typeof EMPTY_HEADER;
}> {
  const session = await requireExploreSession(role, locale);
  const userId = await getExploreSystemUserId(role);
  const ownerRole: AuthoringOwnerRole = role === "teacher" ? "enseignant" : "parent";
  const resource = await getAuthoringResource(resourceId, userId, ownerRole);

  if (!resource || !resourceBelongsToExploreSession(resource.tags, session.sessionId)) {
    notFound();
  }

  const kindOk = segmentMatchesKind(segment, resource.kind);
  if (!kindOk) notFound();

  return {
    resource,
    backHref: exploreAtelierPath(role),
    header: EMPTY_HEADER,
  };
}

function segmentMatchesKind(segment: string, kind: AuthoringKind): boolean {
  if (segment === "document") return kind === "document";
  if (segment === ATELIER_VISUAL_PATH) return kind === "visual";
  if (segment === ATELIER_MINDMAP_PATH) return kind === "mindmap";
  if (segment === ATELIER_ACTIVITY_PATH || segment === "h5p") return isActivityKind(kind);
  return false;
}

export { exploreBibliothequePath, exploreAtelierPath };
