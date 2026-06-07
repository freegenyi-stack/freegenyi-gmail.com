export const FAMILY_ADULT_ROLES = ["parent", "coparent"] as const;
export type FamilyAdultRole = (typeof FAMILY_ADULT_ROLES)[number];

export function isFamilyAdult(role: string | null | undefined): role is FamilyAdultRole {
  return role === "parent" || role === "coparent";
}

export function familyDashboardPath(role: string | null | undefined): string {
  return isFamilyAdult(role) ? "parent" : role === "enseignant" ? "enseignant" : "parent";
}
