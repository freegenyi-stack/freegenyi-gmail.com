import type { AuthoringResourceType } from "./types";
import {
  buildEmptyMindmapContent,
  type MindmapEditorMode,
  serializeMindmapContent,
} from "./mindmap-content";

export type MindmapTemplateDef = {
  id: string;
  titleFr: string;
  titleAr: string;
  resourceType: AuthoringResourceType;
  layout: "blank" | "lesson" | "revision";
};

export const MINDMAP_TEMPLATES: MindmapTemplateDef[] = [
  {
    id: "m0",
    titleFr: "Carte vide",
    titleAr: "خريطة فارغة",
    resourceType: "other",
    layout: "blank",
  },
  {
    id: "m1",
    titleFr: "Leçon",
    titleAr: "درس",
    resourceType: "lesson",
    layout: "lesson",
  },
  {
    id: "m2",
    titleFr: "Révision",
    titleAr: "مراجعة",
    resourceType: "revision",
    layout: "revision",
  },
];

function lessonMarkdown(title: string, isAr?: boolean): string {
  if (isAr) {
    return `# ${title}

## مقدمة
- 

## تطوير
### نقطة 1
- 
### نقطة 2
- 

## خلاصة
- 
`;
  }
  return `# ${title}

## Introduction
- 

## Développement
### Point 1
- 
### Point 2
- 

## Conclusion
- 
`;
}

function revisionMarkdown(title: string, isAr?: boolean): string {
  if (isAr) {
    return `# ${title}

## مفاهيم أساسية
- 

## صعوبات
- 

## تمارين
- 
`;
  }
  return `# ${title}

## Concepts clés
- 

## Points difficiles
- 

## Exercices
- 
`;
}

export function mindmapTemplateToResourceType(templateId: string): AuthoringResourceType {
  return MINDMAP_TEMPLATES.find((t) => t.id === templateId)?.resourceType ?? "other";
}

export function buildMindmapJson(
  title: string,
  templateId: string,
  opts?: { isAr?: boolean; mode?: MindmapEditorMode }
): string {
  const tpl = MINDMAP_TEMPLATES.find((t) => t.id === templateId) ?? MINDMAP_TEMPLATES[0];
  const mode = opts?.mode ?? "excalidraw";
  const isAr = opts?.isAr;
  const root = title.trim() || (isAr ? "الموضوع" : "Sujet");

  if (mode === "markmap") {
    let markdown = `# ${root}\n\n## ${isAr ? "فكرة 1" : "Idée 1"}\n- \n\n## ${isAr ? "فكرة 2" : "Idée 2"}\n- \n`;
    if (tpl.layout === "lesson") markdown = lessonMarkdown(root, isAr);
    if (tpl.layout === "revision") markdown = revisionMarkdown(root, isAr);
    return serializeMindmapContent({ schemaVersion: 2, mode: "markmap", markdown });
  }

  if (tpl.layout === "blank") {
    return serializeMindmapContent(buildEmptyMindmapContent("excalidraw", root, { isAr }));
  }

  // Excalidraw starter: titre centré via markdown fallback note in app - keep blank canvas;
  // teachers use Excalidraw tools freely. Markmap templates are richer for structured starts.
  return serializeMindmapContent(buildEmptyMindmapContent("excalidraw", root, { isAr }));
}
