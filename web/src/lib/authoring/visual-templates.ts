import type { AuthoringResourceType } from "./types";
import { visualFormatById } from "./visual-formats";

export type VisualTemplateDef = {
  id: string;
  titleFr: string;
  titleAr: string;
  resourceType: AuthoringResourceType;
  /** blank = page blanche ; starter = bandeau + textes d'aide */
  layout: "blank" | "starter";
  /** Format suggéré à la création */
  defaultFormatId?: string;
};

export const VISUAL_TEMPLATES: VisualTemplateDef[] = [
  {
    id: "v0",
    titleFr: "Page blanche",
    titleAr: "صفحة فارغة",
    resourceType: "other",
    layout: "blank",
  },
  {
    id: "v1",
    titleFr: "Affiche classe",
    titleAr: "ملصق القسم",
    resourceType: "lesson",
    layout: "starter",
  },
  {
    id: "v2",
    titleFr: "Info parents",
    titleAr: "معلومات للأولياء",
    resourceType: "parent_sheet",
    layout: "starter",
  },
  {
    id: "v3",
    titleFr: "Planning semaine",
    titleAr: "خطة الأسبوع",
    resourceType: "planning",
    layout: "starter",
    defaultFormatId: "a4-landscape",
  },
];

function rid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function textEl(
  id: string,
  text: string,
  opts: {
    x: number;
    y: number;
    width: number;
    fontSize: number;
    fill?: string;
    align?: string;
    fontWeight?: string;
  }
) {
  return {
    id,
    type: "text",
    name: "",
    opacity: 1,
    visible: true,
    selectable: true,
    removable: true,
    alwaysOnTop: false,
    showInExport: true,
    animations: [],
    filters: {},
    x: opts.x,
    y: opts.y,
    width: opts.width,
    height: opts.fontSize * 2.5,
    rotation: 0,
    text,
    fontSize: opts.fontSize,
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: opts.fontWeight ?? "normal",
    fill: opts.fill ?? "#0f172a",
    align: opts.align ?? "center",
    lineHeight: 1.2,
    letterSpacing: 0,
  };
}

function headerBar(id: string, width: number, color: string) {
  return {
    id,
    type: "figure",
    subType: "rect",
    name: "",
    animations: [],
    filters: {},
    x: 0,
    y: 0,
    width,
    height: 100,
    rotation: 0,
    opacity: 1,
    fill: color,
    strokeWidth: 0,
    dash: [],
    cornerRadius: 0,
    visible: true,
    selectable: true,
    removable: true,
    showInExport: true,
  };
}

export function visualTemplateDefaultFormat(templateId: string): string {
  return VISUAL_TEMPLATES.find((t) => t.id === templateId)?.defaultFormatId ?? "a4-portrait";
}

export function visualTemplateToResourceType(templateId: string): AuthoringResourceType {
  return VISUAL_TEMPLATES.find((t) => t.id === templateId)?.resourceType ?? "other";
}

export function buildVisualStoreJson(
  title: string,
  templateId: string,
  opts?: { subtitle?: string; isAr?: boolean; formatId?: string }
): string {
  const tpl = VISUAL_TEMPLATES.find((t) => t.id === templateId) ?? VISUAL_TEMPLATES[0];
  const format = visualFormatById(opts?.formatId ?? "a4-portrait");
  const w = format.width;
  const h = format.height;
  const pageId = rid("page");

  const children: Record<string, unknown>[] = [];

  if (tpl.layout === "starter") {
    const subtitle =
      opts?.subtitle?.trim() ||
      (opts?.isAr ? "عدّل النص والصور ثم صدّر PDF" : "Modifiez le texte et les images, puis exportez en PDF");
    const accent = templateId === "v2" ? "#7c3aed" : templateId === "v3" ? "#0369a1" : "#0d9488";
    children.push(
      headerBar(rid("bar"), w, accent),
      textEl(rid("title"), title, {
        x: 40,
        y: 24,
        width: w - 80,
        fontSize: templateId === "v3" ? 36 : 42,
        fill: "#ffffff",
        fontWeight: "bold",
      }),
      textEl(rid("sub"), subtitle, {
        x: 48,
        y: 130,
        width: w - 96,
        fontSize: 18,
        fill: "#475569",
        align: opts?.isAr ? "right" : "left",
      }),
      textEl(
        rid("body"),
        opts?.isAr
          ? "• أضف نقاطك هنا\n• صورة أو شعار المؤسسة\n• تاريخ أو موعد"
          : "• Ajoutez vos points ici\n• Image ou logo de l'établissement\n• Date ou échéance",
        {
          x: 48,
          y: 220,
          width: w - 96,
          fontSize: 16,
          fill: "#334155",
          align: opts?.isAr ? "right" : "left",
        }
      )
    );
  }

  const store = {
    width: w,
    height: h,
    fonts: [],
    audios: [],
    pages: [
      {
        id: pageId,
        width: "auto",
        height: "auto",
        background: "white",
        children,
      },
    ],
    unit: "px",
    dpi: 72,
    schemaVersion: 2,
  };

  return JSON.stringify(store);
}
