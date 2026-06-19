import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { children, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { userCanAccessChild } from "@/lib/family/server";
import { isFamilyAdult } from "@/lib/family/constants";
import { getUnifiedParentHistory } from "@/lib/parent/parent-history.server";
import { assertPdfKitDataAvailable, createPdfDocument, PDF_FONT } from "@/lib/pdf/pdfkit-server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = parseInt(session.user.id, 10);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || !isFamilyAdult(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const format = url.searchParams.get("format") || "csv";
  const locale = url.searchParams.get("locale") || "fr";
  const isAr = locale.startsWith("ar");

  const childRows = await db.select().from(children).where(eq(children.parentId, userId));
  const accessible: typeof childRows = [];
  for (const c of childRows) {
    if (await userCanAccessChild(user, c)) accessible.push(c);
  }

  const childIds = accessible.map((c) => c.id);
  const childNames = Object.fromEntries(accessible.map((c) => [c.id, c.fullName]));
  const history = await getUnifiedParentHistory(userId, childIds, childNames, 500);

  if (format === "csv") {
    const header = "date,source,type,title,detail,child\n";
    const lines = history.map((h) => {
      const cols = [
        h.date.toISOString(),
        h.source,
        h.type,
        h.title.replace(/"/g, '""'),
        (h.detail || "").replace(/"/g, '""'),
        (h.childName || "").replace(/"/g, '""'),
      ];
      return cols.map((c) => `"${c}"`).join(",");
    });
    const body = header + lines.join("\n");
    return new NextResponse(body, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="historique-freegeny.csv"',
      },
    });
  }

  assertPdfKitDataAvailable();
  const pdf = await new Promise<Buffer>((resolve, reject) => {
    const doc = createPdfDocument({ margin: 50, size: "A4" });
    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(18).font(PDF_FONT.bold).fillColor("#0F766E").text(
      isAr ? "أرشيف النشاط — FreeGeny" : "Archive d'activité — FreeGeny",
      { align: "center" }
    );
    doc.moveDown(0.5);
    doc.fontSize(9).font(PDF_FONT.regular).fillColor("#64748B").text(
      new Date().toLocaleDateString(isAr ? "ar-DZ" : "fr-FR"),
      { align: "center" }
    );
    doc.moveDown(1);

    for (const item of history.slice(0, 120)) {
      doc.fontSize(10).font(PDF_FONT.bold).fillColor("#0F172A").text(item.title);
      doc.fontSize(8).font(PDF_FONT.regular).fillColor("#64748B").text(
        `${item.date.toLocaleString(isAr ? "ar-DZ" : "fr-FR")} · ${item.type} · ${item.childName || item.source}`
      );
      if (item.detail) doc.fontSize(8).text(item.detail);
      doc.moveDown(0.4);
      if (doc.y > doc.page.height - 60) doc.addPage();
    }

    doc.end();
  });

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="historique-freegeny.pdf"',
    },
  });
}
