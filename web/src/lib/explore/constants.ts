export const EXPLORE_COOKIE_SESSION = "fg_explore_sid";
export const EXPLORE_COOKIE_ROLE = "fg_explore_role";

export type ExploreRole = "parent" | "teacher";

export const EXPLORE_PARENT_EMAIL =
  process.env.EXPLORE_PARENT_EMAIL || "explore-parent@freegeny.internal";
export const EXPLORE_TEACHER_EMAIL =
  process.env.EXPLORE_TEACHER_EMAIL || "explore-teacher@freegeny.internal";

export function exploreBasePath(role: ExploreRole): string {
  return role === "teacher" ? "/dashboard/explore/enseignant" : "/dashboard/explore/parent";
}

export function exploreAtelierPath(role: ExploreRole): string {
  return `${exploreBasePath(role)}/atelier`;
}

export function exploreBibliothequePath(role: ExploreRole): string {
  return `${exploreBasePath(role)}/bibliotheque`;
}
