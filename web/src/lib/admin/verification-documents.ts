/** Libellés admin pour les pièces jointes de vérification */
export const VERIFICATION_DOC_LABELS: Record<string, string> = {
  identity: "Pièce d'identité",
  licence: "Licence / autorisation",
  statuts: "Statuts",
  kbis: "Extrait Kbis",
  agreement: "Convention",
};

export type VerificationDocItem =
  | { kind: "dev"; message: string }
  | { kind: "file"; key: string; label: string; path: string; href: string };

export function parseVerificationDocuments(raw: string | null): VerificationDocItem[] {
  if (!raw) return [];
  let docs: Record<string, string>;
  try {
    docs = JSON.parse(raw) as Record<string, string>;
  } catch {
    return [];
  }

  const items: VerificationDocItem[] = [];

  for (const [key, value] of Object.entries(docs)) {
    if (key === "devMode") {
      items.push({
        kind: "dev",
        message: "Mode développement — pièce d'identité non jointe (tests locaux).",
      });
      continue;
    }
    if (!value || typeof value !== "string") continue;
    items.push({
      kind: "file",
      key,
      label: VERIFICATION_DOC_LABELS[key] || key,
      path: value,
      href: `/api/admin/verification-document?path=${encodeURIComponent(value)}`,
    });
  }

  return items;
}
