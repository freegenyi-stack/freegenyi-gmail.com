"use server";

import { redirect } from "next/navigation";
import { startExploreSession, type ExploreSession } from "@/lib/explore/session.server";
import { exploreAtelierPath, type ExploreRole } from "@/lib/explore/constants";

export async function startExploreSessionAction(role: ExploreRole, locale: string): Promise<void> {
  await startExploreSession(role);
  redirect(`/${locale}${exploreAtelierPath(role)}`);
}

export async function getExploreSessionAction(): Promise<ExploreSession | null> {
  const { getExploreSession } = await import("@/lib/explore/session.server");
  return getExploreSession();
}
