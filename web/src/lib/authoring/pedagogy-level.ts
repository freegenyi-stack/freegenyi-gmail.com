import { PEDAGOGY_LEVELS } from "@/lib/pedagogy/constants";

/** Niveau valide pour le Mur pédagogique (1AP–5AP). */
export function normalizePedagogyLevel(
  resourceLevel: string | null | undefined,
  teacherLevels: string[]
): string {
  const candidate = resourceLevel?.trim();
  if (candidate && (PEDAGOGY_LEVELS as readonly string[]).includes(candidate)) {
    return candidate;
  }
  for (const level of teacherLevels) {
    if (level && level !== "—" && (PEDAGOGY_LEVELS as readonly string[]).includes(level)) {
      return level;
    }
  }
  return "3AP";
}
