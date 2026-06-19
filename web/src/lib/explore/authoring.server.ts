import { requireAuthoringUser, type AuthoringUser } from "@/lib/authoring/session";
import type { AuthoringOwnerRole } from "@/lib/authoring/types";
import { getExploreSession, getExploreSystemUserId, type ExploreSession } from "./session.server";
import type { ExploreRole } from "./constants";
import { exploreAtelierPath } from "./constants";
import { revalidatePath } from "next/cache";

export type AuthoringActionContext = {
  user: AuthoringUser;
  exploreSessionId?: string;
};

function exploreRoleToOwner(role: ExploreRole): AuthoringOwnerRole {
  return role === "teacher" ? "enseignant" : "parent";
}

export async function resolveAuthoringActionContext(): Promise<AuthoringActionContext | null> {
  const loggedIn = await requireAuthoringUser();
  if (loggedIn) return { user: loggedIn };

  const explore = await getExploreSession();
  if (!explore) return null;

  const userId = await getExploreSystemUserId(explore.role);
  return {
    user: {
      id: userId,
      email: explore.role === "teacher" ? "explore-teacher@internal" : "explore-parent@internal",
      fullName: explore.role === "teacher" ? "Exploration" : "Exploration",
      role: exploreRoleToOwner(explore.role),
      metadata: { explore: true },
    },
    exploreSessionId: explore.sessionId,
  };
}

export function exploreTagsJson(sessionId: string, extra?: Record<string, unknown>): string {
  return JSON.stringify({ exploreSession: sessionId, ...extra });
}

export function parseExploreSessionFromTags(tags: string | null): string | null {
  if (!tags) return null;
  try {
    const parsed = JSON.parse(tags) as { exploreSession?: string };
    return parsed.exploreSession ?? null;
  } catch {
    return null;
  }
}

export function resourceBelongsToExploreSession(
  tags: string | null,
  sessionId: string | undefined
): boolean {
  if (!sessionId) return true;
  return parseExploreSessionFromTags(tags) === sessionId;
}

export function revalidateExploreAtelier(role: ExploreRole) {
  revalidatePath(`/[locale]${exploreAtelierPath(role)}`, "page");
}

export async function requireExploreAuthoringUser(
  expectedRole: ExploreRole
): Promise<{ user: AuthoringUser; session: ExploreSession } | null> {
  const explore = await getExploreSession();
  if (!explore || explore.role !== expectedRole) return null;

  const userId = await getExploreSystemUserId(explore.role);
  return {
    session: explore,
    user: {
      id: userId,
      email: expectedRole === "teacher" ? "explore-teacher@internal" : "explore-parent@internal",
      fullName: "Exploration",
      role: exploreRoleToOwner(expectedRole),
      metadata: { explore: true },
    },
  };
}
