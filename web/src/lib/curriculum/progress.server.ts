import { db } from "@/db";
import {
  curriculumBundles,
  curriculumChildProgress,
  curriculumSessions,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import type { ChildSessionPayload, CurriculumLevel, CurriculumSubject } from "./types";

export async function getCompletedCompetencyIds(
  childId: number,
  bundleId: number
): Promise<Set<string>> {
  const rows = await db
    .select({ competencyId: curriculumChildProgress.competencyId })
    .from(curriculumChildProgress)
    .where(
      and(
        eq(curriculumChildProgress.childId, childId),
        eq(curriculumChildProgress.bundleId, bundleId),
        eq(curriculumChildProgress.status, "mastered")
      )
    );
  return new Set(rows.map((r) => r.competencyId));
}

export async function findActiveBundle(
  country: string,
  level: string,
  subject: string
) {
  const [row] = await db
    .select()
    .from(curriculumBundles)
    .where(
      and(
        eq(curriculumBundles.countryCode, country),
        eq(curriculumBundles.levelCode, level),
        eq(curriculumBundles.subjectCode, subject),
        eq(curriculumBundles.status, "active")
      )
    )
    .orderBy(curriculumBundles.version)
    .limit(1);
  return row ?? null;
}

export async function persistSession(
  childId: number,
  bundleId: number | null,
  payload: ChildSessionPayload
) {
  await db.insert(curriculumSessions).values({
    sessionKey: payload.sessionId,
    childId,
    bundleId: bundleId ?? undefined,
    source: payload.source,
    competencyId: payload.competencyId,
    payloadJson: payload as unknown as Record<string, unknown>,
    status: "pending",
  });
}

export async function completeSession(
  sessionKey: string,
  childId: number,
  input: {
    score: number;
    xpEarned: number;
    stars: number;
    competencyId: string;
    bundleId?: number;
    answersJson?: Record<string, unknown>;
  }
) {
  await db
    .update(curriculumSessions)
    .set({
      status: "completed",
      score: input.score,
      xpEarned: input.xpEarned,
      answersJson: input.answersJson,
      completedAt: new Date(),
    })
    .where(
      and(eq(curriculumSessions.sessionKey, sessionKey), eq(curriculumSessions.childId, childId))
    );

  const { curriculumAssignments } = await import("@/db/schema");
  await db
    .update(curriculumAssignments)
    .set({ status: "completed", completedAt: new Date() })
    .where(eq(curriculumAssignments.sessionKey, sessionKey));

  if (input.bundleId) {
    await db
      .insert(curriculumChildProgress)
      .values({
        childId,
        bundleId: input.bundleId,
        competencyId: input.competencyId,
        stars: input.stars,
        xpEarned: input.xpEarned,
        status: input.stars >= 2 ? "mastered" : "completed",
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [
          curriculumChildProgress.childId,
          curriculumChildProgress.bundleId,
          curriculumChildProgress.competencyId,
        ],
        set: {
          stars: input.stars,
          xpEarned: input.xpEarned,
          status: input.stars >= 2 ? "mastered" : "completed",
          updatedAt: new Date(),
        },
      });
  }
}

export function normalizeChildLevel(educationLevel: string | null | undefined): CurriculumLevel {
  const raw = (educationLevel ?? "1AP").toUpperCase().replace(/\s/g, "");
  const allowed = ["1AP", "2AP", "3AP", "4AP", "5AP"] as const;
  return (allowed.includes(raw as CurriculumLevel) ? raw : "1AP") as CurriculumLevel;
}

export function parseSubjectParam(s: string | null): CurriculumSubject | null {
  if (s === "ar_islam_civique" || s === "math_est") return s;
  return null;
}
