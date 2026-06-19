/** Estimation du nombre de pages PDF (sans dépendance externe). */
export function countPdfPages(buffer: Buffer): number {
  const raw = buffer.toString("latin1");
  const typePages = raw.match(/\/Type\s*\/Page\b(?!s)/g);
  if (typePages?.length) return typePages.length;
  const countMatch = raw.match(/\/Count\s+(\d+)/);
  if (countMatch) return Math.max(1, parseInt(countMatch[1], 10));
  return 1;
}
