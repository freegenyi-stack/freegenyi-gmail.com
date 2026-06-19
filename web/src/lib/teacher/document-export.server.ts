import fs from "fs";
import path from "path";
import {
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { headerLines } from "@/lib/authoring/document-header";
import { isTipTapDocument, tiptapToExportBlocks, type TipTapExportBlock } from "@/lib/authoring/tiptap-templates";
import type { SchoolHeaderInfo } from "@/lib/authoring/types";
import { assertPdfKitDataAvailable, createPdfDocument, PDF_FONT } from "@/lib/pdf/pdfkit-server";

type DocBlock = { type?: string; text?: string };

export function parseDocumentBlocks(contentJson: string): DocBlock[] {
  if (isTipTapDocument(contentJson)) {
    return tiptapToExportBlocks(contentJson).flatMap((block) => {
      if (block.kind === "heading") return [{ type: "heading", text: block.text }];
      if (block.kind === "paragraph" || block.kind === "listItem") return [{ type: "paragraph", text: block.text }];
      if (block.kind === "image") return [{ type: "paragraph", text: block.alt ? `[Image: ${block.alt}]` : "[Image]" }];
      if (block.kind === "table") return block.rows.map((row) => ({ type: "paragraph", text: row.join(" | ") }));
      return [];
    });
  }
  try {
    const parsed = JSON.parse(contentJson) as { blocks?: DocBlock[]; body?: string };
    if (Array.isArray(parsed.blocks) && parsed.blocks.length > 0) {
      return parsed.blocks;
    }
    if (typeof parsed.body === "string" && parsed.body.trim()) {
      return [{ type: "paragraph", text: parsed.body }];
    }
  } catch {
    /* ignore */
  }
  return [{ type: "paragraph", text: "Document FreeGeny — contenu à compléter." }];
}

function exportBlocksFromJson(contentJson: string): TipTapExportBlock[] {
  if (isTipTapDocument(contentJson)) return tiptapToExportBlocks(contentJson);
  return parseDocumentBlocks(contentJson).map((b) =>
    b.type === "heading"
      ? { kind: "heading" as const, level: 2, text: b.text ?? "" }
      : { kind: "paragraph" as const, text: b.text ?? "" }
  );
}

function resolveLocalImagePath(src: string): string | null {
  if (src.startsWith("data:")) return null;
  if (src.startsWith("/")) {
    const local = path.join(process.cwd(), "public", src.replace(/^\//, ""));
    return fs.existsSync(local) ? local : null;
  }
  if (src.startsWith("http://") || src.startsWith("https://")) return null;
  return null;
}

function loadImageBuffer(src: string): Buffer | null {
  if (src.startsWith("data:")) {
    const match = src.match(/^data:image\/\w+;base64,(.+)$/);
    if (!match) return null;
    try {
      return Buffer.from(match[1], "base64");
    } catch {
      return null;
    }
  }
  const local = resolveLocalImagePath(src);
  if (!local) return null;
  try {
    return fs.readFileSync(local);
  } catch {
    return null;
  }
}

function drawPdfHeader(doc: ReturnType<typeof createPdfDocument>, header: SchoolHeaderInfo) {
  const logoBuf = header.logoUrl ? loadImageBuffer(header.logoUrl) : null;
  if (logoBuf) {
    try {
      doc.image(logoBuf, doc.page.width / 2 - 30, doc.y, { fit: [60, 60], align: "center" });
      doc.moveDown(3.5);
    } catch {
      /* ignore bad image */
    }
  }
  doc.fontSize(11).font(PDF_FONT.bold).text(header.schoolName, { align: "center" });
  doc.font(PDF_FONT.regular).text(header.teacherName, { align: "center" });
  doc
    .fontSize(9)
    .fillColor("#555555")
    .text(`${header.subjects.join(", ")} · ${header.levels.join(", ")}`, { align: "center" });
  doc.text(`Année scolaire ${header.schoolYear}`, { align: "center" });
  doc.fillColor("#000000").moveDown(1);
  doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke("#CCCCCC");
  doc.moveDown(1);
}

function renderPdfBlock(doc: ReturnType<typeof createPdfDocument>, block: TipTapExportBlock) {
  if (block.kind === "heading") {
    const size = block.level <= 1 ? 16 : 13;
    doc.moveDown(0.5).fontSize(size).font(PDF_FONT.bold).text(block.text);
    doc.fontSize(11).font(PDF_FONT.regular);
    return;
  }
  if (block.kind === "paragraph" || block.kind === "listItem") {
    doc.text(block.text, { align: "left", lineGap: 4 });
    doc.moveDown(0.4);
    return;
  }
  if (block.kind === "image") {
    const buf = loadImageBuffer(block.src);
    if (buf) {
      try {
        doc.moveDown(0.5);
        doc.image(buf, { fit: [400, 280], align: "center" });
        doc.moveDown(0.5);
      } catch {
        doc.text(block.alt ? `[Image: ${block.alt}]` : "[Image]", { align: "center" });
      }
    } else {
      doc.text(block.alt ? `[Image: ${block.alt}]` : `[Image: ${block.src}]`, { align: "center", oblique: true });
    }
    doc.moveDown(0.4);
    return;
  }
  if (block.kind === "table") {
    doc.moveDown(0.3).font(PDF_FONT.bold);
    for (const row of block.rows) {
      doc.font(PDF_FONT.regular).text(row.join("  |  "), { lineGap: 2 });
    }
    doc.moveDown(0.5);
  }
}

function imageTypeFromBuffer(buf: Buffer, src?: string): "png" | "jpg" | "gif" | "bmp" {
  if (buf[0] === 0x89 && buf[1] === 0x50) return "png";
  if (buf[0] === 0xff && buf[1] === 0xd8) return "jpg";
  if (buf[0] === 0x47 && buf[1] === 0x49) return "gif";
  const lower = src?.toLowerCase() ?? "";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "jpg";
  if (lower.endsWith(".gif")) return "gif";
  if (lower.endsWith(".bmp")) return "bmp";
  return "png";
}

function docxImageRun(buf: Buffer, src: string, width: number, height: number): ImageRun {
  return new ImageRun({
    type: imageTypeFromBuffer(buf, src),
    data: buf,
    transformation: { width, height },
  });
}

function docxBlockToChildren(block: TipTapExportBlock): (Paragraph | Table)[] {
  if (block.kind === "heading") {
    const level =
      block.level <= 1 ? HeadingLevel.HEADING_1 : block.level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3;
    return [new Paragraph({ heading: level, children: [new TextRun({ text: block.text, bold: true })] })];
  }
  if (block.kind === "paragraph" || block.kind === "listItem") {
    return [new Paragraph({ children: [new TextRun(block.text)] })];
  }
  if (block.kind === "image") {
    const buf = loadImageBuffer(block.src);
    if (!buf) {
      return [new Paragraph({ children: [new TextRun({ text: block.alt ? `[Image: ${block.alt}]` : "[Image]", italics: true })] })];
    }
    return [
      new Paragraph({
        children: [docxImageRun(buf, block.src, 320, 220)],
      }),
    ];
  }
  if (block.kind === "table") {
    return [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: block.rows.map(
          (cells) =>
            new TableRow({
              children: cells.map(
                (text) =>
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun(text)] })],
                  })
              ),
            })
        ),
      }),
    ];
  }
  return [];
}

export async function renderDocumentPdf(
  title: string,
  contentJson: string,
  header?: SchoolHeaderInfo | null
): Promise<Buffer> {
  const blocks = exportBlocksFromJson(contentJson);
  assertPdfKitDataAvailable();

  return new Promise((resolve, reject) => {
    const doc = createPdfDocument({ margin: 50, size: "A4" });
    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    if (header) {
      drawPdfHeader(doc, header);
    }

    doc.fontSize(20).font(PDF_FONT.bold).text(title, { align: "center" });
    doc.moveDown(1.2);
    doc.fontSize(11).font(PDF_FONT.regular);

    for (const block of blocks) {
      renderPdfBlock(doc, block);
    }

    doc.end();
  });
}

export async function renderDocumentDocx(
  title: string,
  contentJson: string,
  header?: SchoolHeaderInfo | null
): Promise<Buffer> {
  const blocks = exportBlocksFromJson(contentJson);
  const headerParagraphs: Paragraph[] = [];

  if (header) {
    const logoBuf = header.logoUrl ? loadImageBuffer(header.logoUrl) : null;
    if (logoBuf) {
      headerParagraphs.push(
        new Paragraph({
          alignment: "center",
          children: [docxImageRun(logoBuf, header.logoUrl ?? "", 64, 64)],
        })
      );
    }
    for (const line of headerLines(header)) {
      headerParagraphs.push(
        new Paragraph({
          alignment: "center",
          children: [new TextRun({ text: line, size: line === header.schoolName ? 24 : 20 })],
        })
      );
    }
    headerParagraphs.push(new Paragraph({ children: [new TextRun("")] }));
  }

  const children: (Paragraph | Table)[] = [
    ...headerParagraphs,
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: title, bold: true })],
    }),
    ...blocks.flatMap((block) => docxBlockToChildren(block)),
  ];

  const doc = new Document({
    sections: [{ properties: {}, children }],
  });

  return Packer.toBuffer(doc);
}
