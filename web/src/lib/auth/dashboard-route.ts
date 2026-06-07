/** Segment de chemin dashboard selon le rôle en base (incl. valeurs legacy). */
export function resolveDashboardSegment(role: string | null | undefined): string {
  switch (role) {
    case "parent":
    case "coparent":
      return "parent";
    case "enseignant":
      return "enseignant";
    case "ecole":
    case "school":
      return "ecole";
    case "ong":
    case "ngo":
      return "ong";
    case "admin":
      return "admin";
    default:
      return "parent";
  }
}

export function isUserFullyOnboarded(
  role: string | null | undefined,
  onboardingStep: number | null | undefined
): boolean {
  const step = onboardingStep ?? 1;
  if (role === "ecole" || role === "school" || role === "ong" || role === "ngo") {
    return step >= 3;
  }
  return step >= 4;
}
