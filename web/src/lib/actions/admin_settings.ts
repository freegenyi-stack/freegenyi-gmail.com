"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { appSettings } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin/requireAdmin";

export async function updateAppSettingAction(key: string, value: string) {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  const allowed = new Set(["maintenance_mode", "registration_open", "library_public"]);
  if (!allowed.has(key)) return { error: "Clé non autorisée." };

  await db
    .insert(appSettings)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: appSettings.key,
      set: { value, updatedAt: new Date() },
    });

  revalidatePath("/dashboard/admin/config");
  return { success: true };
}
