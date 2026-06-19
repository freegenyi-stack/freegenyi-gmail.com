/** Lien vers la carte publique d'un enseignant selon le rôle du visiteur. */
export function teacherPublicProfileHref(
  viewerRole: string | null | undefined,
  teacherId: number
): string {
  if (viewerRole === "enseignant") {
    return `/dashboard/enseignant/collegue/${teacherId}`;
  }
  return `/dashboard/parent/enseignant/${teacherId}`;
}

export function teacherProfileBackHref(viewerRole: string | null | undefined): string {
  if (viewerRole === "enseignant") {
    return "/dashboard/enseignant/mur";
  }
  return "/dashboard/parent/mur";
}
