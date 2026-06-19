import type { AuthoringKind } from "./types";

export const ATELIER_MINDMAP_PATH = "carte-mentale";

export function isMindmapKind(kind: string): boolean {
  return kind === "mindmap";
}

export function atelierMindmapEditPath(basePath: string, resourceId: number): string {
  return `${basePath}/${ATELIER_MINDMAP_PATH}/${resourceId}`;
}
