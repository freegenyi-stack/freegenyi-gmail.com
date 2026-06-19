import { db } from "@/db";
import {
  authoringAssignments,
  authoringProgress,
  authoringResources,
  children,
  libraryBooks,
  libraryQuizAttempts,
  libraryReadingProgress,
} from "@/db/schema";
import { and, desc, eq, inArray, lt, sql } from "drizzle-orm";
import { assertPdfKitDataAvailable, createPdfDocument, PDF_FONT } from "@/lib/pdf/pdfkit-server";
import { pickGenyExerciseBlocks, type PrintableExerciseBlock } from "@/lib/parent/printable-exercises";
import type { PrintableWeakness } from "@/lib/parent/printable-types";

export async function analyzeChildWeaknesses(childId: number, limit = 8): Promise<PrintableWeakness[]> {
  const items: PrintableWeakness[] = [];

  const [pendingMissions, readingRows, quizRows] = await Promise.all([
    db
      .select({
        title: authoringResources.title,
        subject: authoringResources.subject,
        status: authoringProgress.status,
      })
      .from(authoringProgress)
      .innerJoin(authoringAssignments, eq(authoringProgress.assignmentId, authoringAssignments.id))
      .innerJoin(authoringResources, eq(authoringAssignments.resourceId, authoringResources.id))
      .where(
        and(
          eq(authoringProgress.childId, childId),
          inArray(authoringProgress.status, ["pending", "in_progress"])
        )
      )
      .orderBy(desc(authoringAssignments.createdAt))
      .limit(5),
    db
      .select({
        percent: libraryReadingProgress.percent,
        bookId: libraryReadingProgress.bookId,
      })
      .from(libraryReadingProgress)
      .where(and(eq(libraryReadingProgress.childId, childId), lt(libraryReadingProgress.percent, 100)))
      .orderBy(desc(libraryReadingProgress.updatedAt))
      .limit(5),
    db
      .select({
        score: libraryQuizAttempts.score,
        bookId: libraryQuizAttempts.bookId,
      })
      .from(libraryQuizAttempts)
      .where(and(eq(libraryQuizAttempts.childId, childId), lt(libraryQuizAttempts.score, 60)))
      .orderBy(desc(libraryQuizAttempts.createdAt))
      .limit(5),
  ]);

  for (const m of pendingMissions) {
    items.push({
      kind: "mission",
      subject: m.subject || "Général",
      label: m.title,
      detail: m.status === "in_progress" ? "Mission commencée — à finaliser" : "Mission assignée — à démarrer",
    });
  }

  const bookIds = [...new Set([...readingRows.map((r) => r.bookId), ...quizRows.map((q) => q.bookId)])];
  const bookMap = new Map<number, { title: string; subject: string | null }>();
  if (bookIds.length > 0) {
    const books = await db
      .select({ id: libraryBooks.id, title: libraryBooks.title, subject: libraryBooks.subject })
      .from(libraryBooks)
      .where(inArray(libraryBooks.id, bookIds));
    for (const b of books) bookMap.set(b.id, { title: b.title, subject: b.subject });
  }

  for (const r of readingRows.filter((x) => x.percent > 0)) {
    const book = bookMap.get(r.bookId);
    if (!book) continue;
    items.push({
      kind: "reading",
      subject: book.subject || "Lecture",
      label: book.title,
      detail: `Progression ${r.percent}% — reprise conseillée`,
    });
  }

  for (const q of quizRows) {
    const book = bookMap.get(q.bookId);
    if (!book) continue;
    items.push({
      kind: "quiz",
      subject: book.subject || "Quiz",
      label: book.title,
      detail: `Score quiz ${q.score}% — révision recommandée`,
    });
  }

  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.kind}:${item.label}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, limit);
}

type PdfDoc = ReturnType<typeof createPdfDocument>;

function sampleExerciseLabels(isAr: boolean) {
  return isAr
    ? { sampleTitle: "تمرين جاهز للطباعة", sampleSubject: "المادة", sampleInstructions: "التعليمات" }
    : { sampleTitle: "Exercice prêt à imprimer", sampleSubject: "Matière", sampleInstructions: "Consignes" };
}

export function appendSampleExerciseToPdf(
  doc: PdfDoc,
  locale: string | undefined,
  weaknessSubject?: string | null,
  educationLevel?: string | null
): PrintableExerciseBlock[] {
  const isAr = locale?.startsWith("ar");
  const labels = sampleExerciseLabels(!!isAr);
  const weaknesses = weaknessSubject
    ? [{ kind: "mission" as const, subject: weaknessSubject, label: "", detail: "" }]
    : [];
  const blocks = pickGenyExerciseBlocks(weaknesses, educationLevel ?? null, 3);

  if (doc.y > doc.page.height - 280) doc.addPage();
  doc.moveDown(0.6);
  doc.fontSize(13).font(PDF_FONT.bold).fillColor("#0D9488").text(labels.sampleTitle);
  doc.moveDown(0.4);

  for (const block of blocks) {
    doc.fontSize(10).font(PDF_FONT.bold).fillColor("#0F172A").text(
      `${labels.sampleSubject} : ${isAr ? block.subjectAr : block.subjectFr}`
    );
    doc.fontSize(11).font(PDF_FONT.bold).fillColor("#334155").text(isAr ? block.titleAr : block.titleFr);
    doc.moveDown(0.3);
    doc.fontSize(9).font(PDF_FONT.regular).fillColor("#64748B").text(
      `${labels.sampleInstructions} : ${isAr ? block.instructionsAr : block.instructionsFr}`
    );
    doc.moveDown(0.5);

    block.questions.forEach((q, i) => {
      doc.fontSize(10).font(PDF_FONT.bold).fillColor("#0F172A").text(`${i + 1}. ${isAr ? q.ar : q.fr}`);
      doc.moveDown(0.15);
      doc.moveTo(70, doc.y).lineTo(doc.page.width - 50, doc.y).stroke("#CBD5E1");
      doc.moveDown(0.55);
      if (doc.y > doc.page.height - 80) doc.addPage();
    });
    doc.moveDown(0.5);
  }

  return blocks;
}

export async function renderParentWorkbookPdf(input: {
  childName: string;
  educationLevel: string | null;
  weaknesses: PrintableWeakness[];
  locale?: string;
}): Promise<Buffer> {
  const isAr = input.locale?.startsWith("ar");
  assertPdfKitDataAvailable();

  const labels = isAr
    ? {
        title: "دفتر مراجعة FreeGeny",
        subtitle: "مخصص حسب تقدم طفلك",
        level: "المستوى",
        section: "محاور للمراجعة",
        exercise: "تمرين / ملاحظات",
        empty: "لا توجد نقاط ضعف محددة — استمر في القراءة واللعب التعليمي!",
        sampleTitle: "تمرين جاهز للطباعة",
        sampleSubject: "المادة",
        sampleInstructions: "التعليمات",
        footer: "FreeGeny — Printable Factory",
      }
    : {
        title: "Cahier de révision FreeGeny",
        subtitle: "Personnalisé selon la progression de votre enfant",
        level: "Niveau",
        section: "Points à renforcer",
        exercise: "Exercice / notes",
        empty: "Aucun point faible identifié — continuez la lecture et les missions !",
        sampleTitle: "Exercice prêt à imprimer",
        sampleSubject: "Matière",
        sampleInstructions: "Consignes",
        footer: "FreeGeny — Printable Factory",
      };

  return new Promise((resolve, reject) => {
    const doc = createPdfDocument({ margin: 50, size: "A4" });
    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(22).font(PDF_FONT.bold).fillColor("#0F766E").text(labels.title, { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(11).font(PDF_FONT.regular).fillColor("#64748B").text(labels.subtitle, { align: "center" });
    doc.moveDown(1);

    doc.fontSize(14).font(PDF_FONT.bold).fillColor("#0F172A").text(input.childName);
    doc.fontSize(10).font(PDF_FONT.regular).fillColor("#475569").text(
      `${labels.level} : ${input.educationLevel || "—"} · ${new Date().toLocaleDateString(isAr ? "ar-DZ" : "fr-FR")}`
    );
    doc.moveDown(1);

    doc.fontSize(12).font(PDF_FONT.bold).fillColor("#0D9488").text(labels.section);
    doc.moveDown(0.5);

    if (input.weaknesses.length === 0) {
      doc.fontSize(10).font(PDF_FONT.regular).fillColor("#475569").text(labels.empty);
    } else {
      for (const [i, w] of input.weaknesses.entries()) {
        doc.fontSize(11).font(PDF_FONT.bold).fillColor("#0F172A").text(`${i + 1}. [${w.subject}] ${w.label}`);
        doc.fontSize(9).font(PDF_FONT.regular).fillColor("#64748B").text(w.detail);
        doc.moveDown(0.3);
        doc.fontSize(9).font(PDF_FONT.regular).fillColor("#94A3B8").text(`${labels.exercise} :`);
        doc.moveDown(0.2);
        for (let line = 0; line < 4; line++) {
          doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke("#E2E8F0");
          doc.moveDown(0.6);
        }
        doc.moveDown(0.4);
        if (doc.y > doc.page.height - 120) doc.addPage();
      }
    }

    if (doc.y > doc.page.height - 280) doc.addPage();
    doc.moveDown(1);
    appendSampleExerciseToPdf(doc, input.locale, input.weaknesses[0]?.subject ?? null, input.educationLevel);

    doc.fontSize(8).font(PDF_FONT.regular).fillColor("#94A3B8").text(labels.footer, 50, doc.page.height - 40, {
      align: "center",
      width: doc.page.width - 100,
    });

    doc.end();
  });
}

export async function buildChildWorkbook(childId: number, locale?: string) {
  const [childRow] = await db.select().from(children).where(eq(children.id, childId)).limit(1);
  if (!childRow) return null;

  const weaknesses = await analyzeChildWeaknesses(childId);
  const pdf = await renderParentWorkbookPdf({
    childName: childRow.fullName,
    educationLevel: childRow.educationLevel,
    weaknesses,
    locale,
  });

  return { pdf, weaknesses, child: childRow };
}

export async function buildFamilyWorkbook(childIds: number[], locale?: string) {
  const sections: { childName: string; educationLevel: string | null; weaknesses: PrintableWeakness[] }[] = [];

  for (const childId of childIds) {
    const [childRow] = await db.select().from(children).where(eq(children.id, childId)).limit(1);
    if (!childRow) continue;
    const weaknesses = await analyzeChildWeaknesses(childId, 6);
    sections.push({ childName: childRow.fullName, educationLevel: childRow.educationLevel, weaknesses });
  }

  if (sections.length === 0) return null;

  const isAr = locale?.startsWith("ar");
  assertPdfKitDataAvailable();

  const pdf = await new Promise<Buffer>((resolve, reject) => {
    const doc = createPdfDocument({ margin: 50, size: "A4" });
    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(20).font(PDF_FONT.bold).fillColor("#0F766E").text(isAr ? "دفتر العائلة FreeGeny" : "Cahier famille FreeGeny");
    doc.moveDown(1);

    for (const section of sections) {
      doc.addPage();
      doc.fontSize(14).font(PDF_FONT.bold).fillColor("#0F172A").text(section.childName);
      doc.moveDown(0.5);
      if (section.weaknesses.length === 0) {
        doc.fontSize(10).font(PDF_FONT.regular).fillColor("#475569").text(
          isAr ? "لا نقاط ضعف — bravo !" : "Aucun point faible — bravo !"
        );
      } else {
        section.weaknesses.forEach((w, i) => {
          doc.fontSize(10).font(PDF_FONT.bold).fillColor("#0F172A").text(`${i + 1}. [${w.subject}] ${w.label}`);
          doc.fontSize(9).font(PDF_FONT.regular).fillColor("#64748B").text(w.detail);
          doc.moveDown(0.5);
        });
      }
      appendSampleExerciseToPdf(doc, locale, section.weaknesses[0]?.subject ?? null, section.educationLevel);
    }

    doc.fontSize(8).font(PDF_FONT.regular).fillColor("#94A3B8").text(
      isAr ? "FreeGeny — Printable Factory" : "FreeGeny — Printable Factory",
      50,
      doc.page.height - 40,
      { align: "center", width: doc.page.width - 100 }
    );

    doc.end();
  });

  return { pdf, sections };
}
