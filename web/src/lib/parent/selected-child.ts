import { cookies } from "next/headers";

export const PARENT_CHILD_COOKIE = "fg_parent_child_id";

export async function getSelectedChildId(availableIds: number[]): Promise<number | null> {
  if (availableIds.length === 0) return null;
  const jar = await cookies();
  const raw = jar.get(PARENT_CHILD_COOKIE)?.value;
  const parsed = raw ? parseInt(raw, 10) : NaN;
  if (!Number.isNaN(parsed) && availableIds.includes(parsed)) return parsed;
  return availableIds[0] ?? null;
}
