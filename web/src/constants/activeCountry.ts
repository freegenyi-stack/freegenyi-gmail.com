/** Pays où FreeGeny est pleinement disponible (écoles, messagerie, etc.). */
export const ACTIVE_COUNTRY_CODE = "DZ";

export function isCountryActive(code: string): boolean {
  return code.toUpperCase() === ACTIVE_COUNTRY_CODE;
}
