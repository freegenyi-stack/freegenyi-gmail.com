import type { ParentHomeChildToday, ParentHomeExtras } from "@/lib/parent/parent-home.types";

export function getSelectedChildToday(
  extras: ParentHomeExtras,
  selectedChildId: number | null
): ParentHomeChildToday | null {
  if (!selectedChildId) return extras.childrenToday[0] ?? null;
  return extras.childrenToday.find((c) => c.childId === selectedChildId) ?? extras.childrenToday[0] ?? null;
}
