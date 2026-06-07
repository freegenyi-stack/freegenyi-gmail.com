"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const TEST_EMAIL = "ecole-test@freegeny.com";
const TEST_PASSWORD = "Test@FreeGeny2026!";

/** Connexion test école/ONG — uniquement en mode dev local */
export async function devLoginTestAction(
  locale: string,
  role: "ecole" | "ong" = "ecole"
): Promise<{ success: true; redirectTo: string } | { error: string }> {
  if (process.env.FREEGENY_DEV_AUTO_APPROVE !== "true") {
    return { error: "Mode test désactivé." };
  }

  try {
    await signIn("credentials", {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      redirect: false,
    });
    return { success: true, redirectTo: `/${locale}/dashboard/${role}` };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error:
          "Connexion refusée. Dans le terminal : cd web && npm run db:seed:ecole-test",
      };
    }
    return {
      error: error instanceof Error ? error.message : "Erreur de connexion.",
    };
  }
}
