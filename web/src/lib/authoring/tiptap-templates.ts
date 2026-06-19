import type { JSONContent } from "@tiptap/core";

export type TipTapExportBlock =
  | { kind: "heading"; level: number; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "listItem"; text: string; ordered: boolean }
  | { kind: "image"; src: string; alt?: string }
  | { kind: "table"; rows: string[][] };

function textNode(text: string, marks?: { type: string }[]) {
  return marks?.length ? { type: "text", text, marks } : { type: "text", text };
}

function heading(level: number, text: string): JSONContent {
  return {
    type: "heading",
    attrs: { level },
    content: [textNode(text)],
  };
}

function paragraph(text: string): JSONContent {
  return { type: "paragraph", content: text ? [textNode(text)] : [] };
}

function bulletList(items: string[]): JSONContent {
  return {
    type: "bulletList",
    content: items.map((item) => ({
      type: "listItem",
      content: [paragraph(item)],
    })),
  };
}

const TEMPLATE_INTROS: Record<string, { fr: string[]; sections: string[] }> = {
  t1: {
    fr: ["Objectifs pédagogiques", "Déroulement de la séance", "Évaluation / clôture"],
    sections: ["Objectifs", "Séance", "Évaluation"],
  },
  t2: {
    fr: ["Consignes générales", "Exercices", "Barème"],
    sections: ["Consignes", "Exercices", "Barème"],
  },
  t3: {
    fr: ["Points clés à retenir", "Exemples", "Auto-évaluation"],
    sections: ["Essentiel", "Exemples", "Auto-évaluation"],
  },
  t4: {
    fr: ["Sujet", "Corrigé type"],
    sections: ["Sujet", "Corrigé"],
  },
  t5: {
    fr: ["Message aux parents", "Travail à la maison", "Contacts"],
    sections: ["Message", "Devoirs", "Contact"],
  },
  t6: {
    fr: ["Lundi", "Mercredi", "Vendredi"],
    sections: ["Lun", "Mer", "Ven"],
  },
};

export function defaultTipTapDocument(
  title: string,
  templateId: string,
  subject?: string,
  level?: string
): JSONContent {
  const tpl = TEMPLATE_INTROS[templateId] ?? TEMPLATE_INTROS.t1;
  const meta = [
    subject ? `Matière : ${subject}` : null,
    level ? `Niveau : ${level}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const content: JSONContent[] = [
    heading(1, title),
    paragraph(meta || "Document FreeGeny — Mon Atelier"),
    heading(2, tpl.sections[0] ?? "Section 1"),
    paragraph("…"),
  ];

  for (let i = 1; i < tpl.sections.length; i++) {
    content.push(heading(2, tpl.sections[i]));
    content.push(paragraph("…"));
  }

  content.push(
    bulletList([
      "Personnalisez ce contenu dans l'éditeur intégré.",
      "L'en-tête école est ajouté automatiquement à l'export.",
    ])
  );

  return { type: "doc", content };
}

/** Extrait du texte plat depuis JSON TipTap (export PDF legacy). */
export function tiptapToPlainBlocks(contentJson: string): { type?: string; text?: string }[] {
  return tiptapToExportBlocks(contentJson).flatMap((block) => {
    if (block.kind === "heading") return [{ type: "heading", text: block.text }];
    if (block.kind === "paragraph" || block.kind === "listItem") return [{ type: "paragraph", text: block.text }];
    if (block.kind === "image") return [{ type: "paragraph", text: block.alt ? `[Image: ${block.alt}]` : "[Image]" }];
    if (block.kind === "table") {
      return block.rows.map((row) => ({ type: "paragraph" as const, text: row.join(" | ") }));
    }
    return [];
  });
}

/** Blocs structurés pour export PDF/Word (titres, listes, images, tableaux). */
export function tiptapToExportBlocks(contentJson: string): TipTapExportBlock[] {
  try {
    const doc = JSON.parse(contentJson) as JSONContent;
    if (doc.type !== "doc" || !Array.isArray(doc.content)) {
      return [{ kind: "paragraph", text: contentJson }];
    }

    const blocks: TipTapExportBlock[] = [];

    function inlineText(node: JSONContent): string {
      if (node.type === "text") {
        const marks = node.marks ?? [];
        let text = node.text ?? "";
        if (marks.some((m) => m.type === "bold")) text = text;
        if (marks.some((m) => m.type === "link")) {
          const href = marks.find((m) => m.type === "link")?.attrs?.href;
          if (href) text = `${text} (${href})`;
        }
        return text;
      }
      return (node.content ?? []).map(inlineText).join("");
    }

    function walk(node: JSONContent, listOrdered = false) {
      if (node.type === "heading") {
        const level = (node.attrs as { level?: number })?.level ?? 2;
        const text = inlineText(node);
        if (text) blocks.push({ kind: "heading", level, text });
        return;
      }
      if (node.type === "paragraph") {
        const text = inlineText(node);
        if (text) blocks.push({ kind: "paragraph", text });
        return;
      }
      if (node.type === "bulletList" || node.type === "orderedList") {
        const ordered = node.type === "orderedList";
        for (const item of node.content ?? []) {
          if (item.type === "listItem") {
            const text = (item.content ?? []).map((c) => inlineText(c)).join(" ").trim();
            if (text) blocks.push({ kind: "listItem", text: ordered ? text : `• ${text}`, ordered });
          }
        }
        return;
      }
      if (node.type === "image") {
        const src = (node.attrs as { src?: string })?.src;
        const alt = (node.attrs as { alt?: string })?.alt;
        if (src) blocks.push({ kind: "image", src, alt });
        return;
      }
      if (node.type === "table") {
        const rows: string[][] = [];
        for (const rowNode of node.content ?? []) {
          if (rowNode.type !== "tableRow") continue;
          const cells: string[] = [];
          for (const cell of rowNode.content ?? []) {
            if (cell.type === "tableCell" || cell.type === "tableHeader") {
              cells.push((cell.content ?? []).map((c) => inlineText(c)).join(" ").trim());
            }
          }
          if (cells.length) rows.push(cells);
        }
        if (rows.length) blocks.push({ kind: "table", rows });
        return;
      }
      for (const child of node.content ?? []) walk(child, listOrdered);
    }

    for (const node of doc.content) walk(node);
    return blocks.length ? blocks : [{ kind: "paragraph", text: "Document vide." }];
  } catch {
    return [{ kind: "paragraph", text: "Document FreeGeny." }];
  }
}

/** @deprecated use inlineText via tiptapToExportBlocks */
function nodeText(node: JSONContent): string {
  if (!node.content) return "";
  return node.content
    .map((c) => {
      if (c.type === "text") return c.text ?? "";
      return nodeText(c);
    })
    .join("")
    .trim();
}

export function isTipTapDocument(contentJson: string): boolean {
  try {
    const parsed = JSON.parse(contentJson) as { type?: string };
    return parsed.type === "doc";
  } catch {
    return false;
  }
}
