import fs from "fs";
import path from "path";

export const PDF_FONT = {
  regular: "Helvetica",
  bold: "Helvetica-Bold",
} as const;

let cachedDataDir: string | null = null;

/** Résout le dossier AFM de pdfkit sans createRequire (compatible bundles Next). */
function getPdfKitDataDir(): string {
  if (cachedDataDir) return cachedDataDir;

  const roots = [
    process.cwd(),
    path.join(process.cwd(), "web"),
    path.dirname(require.main?.filename ?? process.cwd()),
  ];

  for (const root of roots) {
    const dir = path.join(root, "node_modules", "pdfkit", "js", "data");
    if (fs.existsSync(path.join(dir, "Helvetica.afm"))) {
      cachedDataDir = dir;
      return dir;
    }
  }

  throw new Error(
    "PDFKit introuvable — exécutez npm install dans le dossier web/ ou redémarrez le serveur Node."
  );
}

function loadPdfKit(): typeof import("pdfkit") {
  // Chargement à l'exécution uniquement (serveur Node)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mod = require("pdfkit") as typeof import("pdfkit") & { default?: typeof import("pdfkit") };
  return (mod.default ?? mod) as typeof import("pdfkit");
}

/** PDFDocument — polices standard via node_modules/pdfkit (serverExternalPackages). */
export function createPdfDocument(options: Record<string, unknown> = {}) {
  assertPdfKitDataAvailable();
  const PDFDocument = loadPdfKit();
  return new PDFDocument({
    margin: 50,
    size: "A4",
    ...options,
  });
}

export function assertPdfKitDataAvailable(): void {
  getPdfKitDataDir();
}

export function pdfFontPath(name: keyof typeof PDF_FONT): string {
  const file = name === "bold" ? "Helvetica-Bold.afm" : "Helvetica.afm";
  return path.join(getPdfKitDataDir(), file);
}
