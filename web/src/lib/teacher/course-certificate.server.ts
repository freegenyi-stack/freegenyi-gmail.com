import { assertPdfKitDataAvailable, createPdfDocument, PDF_FONT } from "@/lib/pdf/pdfkit-server";

export type CourseCertificateInput = {
  teacherName: string;
  courseTitle: string;
  completedAt: Date;
  certificateCode: string;
  locale?: string;
};

export async function renderCourseCertificatePdf(input: CourseCertificateInput): Promise<Buffer> {
  const isAr = input.locale?.startsWith("ar");
  assertPdfKitDataAvailable();

  const labels = isAr
    ? {
        header: "شهادة إتمام",
        subtitle: "FreeGeny — مسار التكوين",
        awarded: "تُمنح هذه الشهادة إلى",
        completed: "لإتمام التكوين",
        date: "تاريخ الإتمام",
        code: "رمز الشهادة",
      }
    : {
        header: "Certificat de réussite",
        subtitle: "FreeGeny — Parcours de formation",
        awarded: "Ce certificat est décerné à",
        completed: "Pour avoir complété la formation",
        date: "Date d'achèvement",
        code: "Code certificat",
      };

  const dateStr = input.completedAt.toLocaleDateString(isAr ? "ar-DZ" : "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return new Promise((resolve, reject) => {
    const doc = createPdfDocument({ margin: 60, size: "A4" });
    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const w = doc.page.width - 120;
    doc.lineWidth(2).roundedRect(40, 40, w + 40, doc.page.height - 80, 12).stroke("#0D9488");

    doc.moveDown(2);
    doc.fontSize(28).font(PDF_FONT.bold).fillColor("#0F766E").text(labels.header, { align: "center" });
    doc.fontSize(12).font(PDF_FONT.regular).fillColor("#64748B").text(labels.subtitle, { align: "center" });
    doc.moveDown(2);

    doc.fontSize(11).fillColor("#475569").text(labels.awarded, { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(22).font(PDF_FONT.bold).fillColor("#0F172A").text(input.teacherName, { align: "center" });
    doc.moveDown(1.5);

    doc.fontSize(11).font(PDF_FONT.regular).fillColor("#475569").text(labels.completed, { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(18).font(PDF_FONT.bold).fillColor("#0F172A").text(input.courseTitle, { align: "center" });
    doc.moveDown(2);

    doc.fontSize(10).fillColor("#64748B").text(`${labels.date} : ${dateStr}`, { align: "center" });
    doc.text(`${labels.code} : ${input.certificateCode}`, { align: "center" });

    doc.end();
  });
}

export function makeCertificateCode(userId: number, courseId: number): string {
  const year = new Date().getFullYear();
  const suffix = Date.now().toString(36).toUpperCase().slice(-6);
  return `FG-${year}-${courseId}-${userId}-${suffix}`;
}
