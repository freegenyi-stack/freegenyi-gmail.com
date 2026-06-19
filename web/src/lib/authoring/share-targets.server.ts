import { db } from "@/db";
import { users } from "@/db/schema";
import { and, eq, ne, or } from "drizzle-orm";
import { teacherSchoolIdFromMetadata } from "@/lib/library/books.server";
import type { AuthoringUser } from "./session";

export type AtelierShareTarget = {
  id: number;
  fullName: string | null;
  role: string;
  label: string;
};

export async function listAtelierShareTargets(user: AuthoringUser): Promise<AtelierShareTarget[]> {
  const targets: AtelierShareTarget[] = [];
  const seen = new Set<number>();

  const add = (row: { id: number; fullName: string | null; role: string | null }, label: string) => {
    if (row.id === user.id || seen.has(row.id)) return;
    seen.add(row.id);
    targets.push({ id: row.id, fullName: row.fullName, role: row.role ?? "user", label });
  };

  if (user.role === "enseignant") {
    const schoolId = teacherSchoolIdFromMetadata(user.metadata);
    if (schoolId) {
      const colleagues = await db
        .select({ id: users.id, fullName: users.fullName, role: users.role, metadata: users.metadata })
        .from(users)
        .where(and(eq(users.role, "enseignant"), ne(users.id, user.id)))
        .limit(200);

      for (const col of colleagues) {
        let meta: Record<string, unknown> = {};
        try {
          meta = col.metadata ? (JSON.parse(col.metadata) as Record<string, unknown>) : {};
        } catch {
          meta = {};
        }
        const sid = teacherSchoolIdFromMetadata(meta);
        if (sid === schoolId) {
          add(col, col.fullName ?? "Collègue");
        }
      }
    }
  }

  if (user.role === "parent" || user.role === "enseignant") {
    const [dbUser] = await db
      .select({ familyId: users.familyId })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (dbUser?.familyId) {
      const familyUsers = await db
        .select({ id: users.id, fullName: users.fullName, role: users.role })
        .from(users)
        .where(
          and(
            ne(users.id, user.id),
            or(eq(users.role, "parent"), eq(users.role, "coparent")),
            eq(users.familyId, dbUser.familyId)
          )
        )
        .limit(20);
      for (const u of familyUsers) add(u, u.fullName ?? "Famille");
    }
  }

  return targets;
}
