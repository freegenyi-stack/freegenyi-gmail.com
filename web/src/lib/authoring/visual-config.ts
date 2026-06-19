import type { AuthoringKind } from "./types";
import { ATELIER_ACTIVITY_PATH } from "./h5p-config";
import { ATELIER_MINDMAP_PATH } from "./mindmap-config";

export { ATELIER_MINDMAP_PATH };
export const ATELIER_VISUAL_PATH = "visuel";

/** Clé locale OpenPolotno — validation interne toujours OK en open source. */
export const OPENPOLOTNO_KEY =
  process.env.NEXT_PUBLIC_OPENPOLOTNO_KEY || process.env.OPENPOLOTNO_KEY || "freegeny-atelier";

/** Panneaux autorisés (modèles + édition locale, pas IA / stock photos). */
export const OPENPOLOTNO_SECTIONS = [
  "templates",
  "text",
  "elements",
  "upload",
  "background",
  "layers",
  "size",
] as const;

export function isVisualKind(kind: string): boolean {
  return kind === "visual";
}

export function isAtelierFocusEditorPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname.includes("/atelier/visuel/") || pathname.includes(`/atelier/${ATELIER_MINDMAP_PATH}/`);
}

export function atelierResourceEditPath(
  kind: AuthoringKind,
  resourceId: number,
  basePath: string
): string {
  if (kind === "document") return `${basePath}/document/${resourceId}`;
  if (kind === "visual") return `${basePath}/${ATELIER_VISUAL_PATH}/${resourceId}`;
  if (kind === "mindmap") return `${basePath}/${ATELIER_MINDMAP_PATH}/${resourceId}`;
  return `${basePath}/${ATELIER_ACTIVITY_PATH}/${resourceId}`;
}
