import { assertPdfKitDataAvailable, createPdfDocument, PDF_FONT } from "@/lib/pdf/pdfkit-server";
import type { ParentChildInsights } from "@/lib/parent/dashboard-insights.server";

export async function renderParentWeeklyReportPdf(input: {
  parentName: string;
  locale?: string;
  children: ParentChildInsights[];
}): Promise<Buffer> {
  const isAr = input.locale?.startsWith("ar");
  assertPdfKitDataAvailable();

  const labels = isAr
    ? {
        title: "تقرير FreeGeny الأسبوعي",
        subtitle: "ملخص تقدم أطفالك",
        child: "الطفل",
        streak: "سلسلة",
        level: "المستوى",
        books: "كتب",
        pending: "مهام معلقة",
        xp: "XP",
        footer: "FreeGeny — Rapport parent",
      }
    : {
        title: "Rapport hebdomadaire FreeGeny",
        subtitle: `Résumé pour ${input.parentName}`,
        child: "Enfant",
        streak: "Série",
        level: "Niveau",
        books: "Livres",
        pending: "Missions en attente",
        xp: "XP total",
        footer: "FreeGeny — Rapport parent",
      };

  return new Promise((resolve, reject) => {
    const doc = createPdfDocument({ margin: 50, size: "A4" });
    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(20).font(PDF_FONT.bold).fillColor("#0F766E").text(labels.title);
    doc.fontSize(10).font(PDF_FONT.regular).fillColor("#64748B").text(labels.subtitle);
    doc.moveDown(0.5);
    doc.fontSize(9).fillColor("#94A3B8").text(new Date().toLocaleDateString(isAr ? "ar-DZ" : "fr-FR"));
    doc.moveDown(1.5);

    for (const c of input.children) {
      doc.fontSize(12).font(PDF_FONT.bold).fillColor("#0F172A").text(c.fullName);
      doc.fontSize(10).font(PDF_FONT.regular).fillColor("#475569");
      doc.text(
        `${labels.streak}: ${c.readingStats.readingStreakDays}j · ${labels.level}: ${c.stats.level} (${c.stats.progress}%) · ${labels.books}: ${c.stats.booksRead} · ${labels.pending}: ${c.stats.pendingMissions} · ${labels.xp}: ${c.stats.totalXp}`
      );
      doc.moveDown(0.8);
      if (doc.y > doc.page.height - 80) doc.addPage();
    }

    doc.fontSize(8).fillColor("#94A3B8").text(labels.footer, 50, doc.page.height - 40, {
      align: "center",
      width: doc.page.width - 100,
    });

    doc.end();
  });
}
