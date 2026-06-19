/** Liens masqués temporairement dans la navigation publique (déploiement progressif). */
export const HIDDEN_NAV_HREFS = ["/schools", "/ngos"] as const;

/** Rôles masqués dans les formulaires d'inscription / connexion. */
export const HIDDEN_REGISTER_ROLES = ["ecole", "ong"] as const;

export type RegisterRoleId = "parent" | "enseignant" | "ecole" | "ong";

export function isRegisterRoleHidden(role: string): boolean {
  return (HIDDEN_REGISTER_ROLES as readonly string[]).includes(role);
}
