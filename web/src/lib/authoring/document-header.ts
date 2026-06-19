import { buildTeacherFormState } from "@/lib/teacher/profile.server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { currentSchoolYear } from "./constants";
import type { AuthoringUser } from "./session";
import type { SchoolHeaderInfo } from "./types";

export async function buildSchoolHeader(user: AuthoringUser): Promise<SchoolHeaderInfo> {
  const [row] = await db
    .select({
      phone: users.phone,
      image: users.image,
      avatarConfig: users.avatarConfig,
      metadata: users.metadata,
    })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  const form = await buildTeacherFormState({
    id: user.id,
    fullName: user.fullName,
    phone: row?.phone ?? null,
    image: row?.image ?? null,
    avatarConfig: row?.avatarConfig ?? null,
    metadata: row?.metadata ?? JSON.stringify(user.metadata),
  });

  return {
    schoolName: form.schoolName || "Établissement scolaire",
    teacherName: user.fullName?.trim() || user.email.split("@")[0],
    subjects: form.subjects?.length ? form.subjects : ["—"],
    levels: form.levels?.length ? form.levels : ["—"],
    schoolYear: currentSchoolYear(),
    logoUrl: row?.image ?? null,
  };
}

export function headerLines(header: SchoolHeaderInfo): string[] {
  return [
    header.schoolName,
    header.teacherName,
    `${header.subjects.join(", ")} · ${header.levels.join(", ")}`,
    `Année scolaire ${header.schoolYear}`,
  ];
}
