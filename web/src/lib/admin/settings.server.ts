import { db } from "@/db";
import { appSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export type AppSettingRow = { key: string; value: string };

export async function listAppSettings(): Promise<AppSettingRow[]> {
  return db.select({ key: appSettings.key, value: appSettings.value }).from(appSettings);
}

export async function getAppSetting(key: string, fallback = ""): Promise<string> {
  const [row] = await db.select().from(appSettings).where(eq(appSettings.key, key)).limit(1);
  return row?.value ?? fallback;
}

export async function isMaintenanceMode(): Promise<boolean> {
  const v = await getAppSetting("maintenance_mode", "false");
  return v === "true" || v === "1";
}

export async function isRegistrationOpen(): Promise<boolean> {
  const v = await getAppSetting("registration_open", "true");
  return v !== "false" && v !== "0";
}
