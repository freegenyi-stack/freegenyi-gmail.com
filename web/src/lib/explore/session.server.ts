import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  EXPLORE_COOKIE_ROLE,
  EXPLORE_COOKIE_SESSION,
  EXPLORE_PARENT_EMAIL,
  EXPLORE_TEACHER_EMAIL,
  type ExploreRole,
} from "./constants";

export type ExploreSession = {
  sessionId: string;
  role: ExploreRole;
};

async function ensureExploreSystemUser(role: ExploreRole): Promise<number> {
  const email = role === "teacher" ? EXPLORE_TEACHER_EMAIL : EXPLORE_PARENT_EMAIL;
  const dbRole = role === "teacher" ? "enseignant" : "parent";

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) return existing.id;

  const [created] = await db
    .insert(users)
    .values({
      email,
      fullName: role === "teacher" ? "Exploration Enseignant" : "Exploration Parent",
      role: dbRole,
      onboardingStep: 4,
      metadata: JSON.stringify({ exploreSystem: true, noHistory: true }),
    })
    .returning({ id: users.id });

  return created.id;
}

export async function getExploreSession(): Promise<ExploreSession | null> {
  const jar = await cookies();
  const sessionId = jar.get(EXPLORE_COOKIE_SESSION)?.value;
  const roleRaw = jar.get(EXPLORE_COOKIE_ROLE)?.value;
  if (!sessionId || (roleRaw !== "parent" && roleRaw !== "teacher")) return null;
  return { sessionId, role: roleRaw };
}

export async function startExploreSession(role: ExploreRole): Promise<ExploreSession> {
  await ensureExploreSystemUser(role);
  const sessionId = randomUUID();
  const jar = await cookies();
  jar.set(EXPLORE_COOKIE_SESSION, sessionId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
  jar.set(EXPLORE_COOKIE_ROLE, role, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
  return { sessionId, role };
}

export async function requireExploreSession(
  expectedRole: ExploreRole,
  locale: string
): Promise<ExploreSession> {
  const session = await getExploreSession();
  if (!session || session.role !== expectedRole) {
    redirect(`/${locale}/dashboard/explore`);
  }
  return session;
}

export async function getExploreSystemUserId(role: ExploreRole): Promise<number> {
  return ensureExploreSystemUser(role);
}
