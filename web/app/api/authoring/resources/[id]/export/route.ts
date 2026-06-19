import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getFamilyChildren } from "@/lib/family/server";
import { getAuthoringResource, getAuthoringResourceForFamily } from "@/lib/authoring/resources.server";
import { renderDocumentDocx, renderDocumentPdf } from "@/lib/teacher/document-export.server";
import { buildSchoolHeader } from "@/lib/authoring/document-header";
import { requireAuthoringUser } from "@/lib/authoring/session";
import type { AuthoringResourceRow } from "@/lib/authoring/types";
import type { AuthoringUser } from "@/lib/authoring/session";

const EXPORT_ERRORS: Record<string, Record<string, string>> = {
  fr: {
    unauthorized: "Non autorisé",
    invalid_id: "ID invalide",
    not_found: "Document introuvable",
  },
  en: {
    unauthorized: "Unauthorized",
    invalid_id: "Invalid ID",
    not_found: "Document not found",
  },
  ar: {
    unauthorized: "غير مصرح",
    invalid_id: "معرف غير صالح",
    not_found: "المستند غير موجود",
  },
};

function exportError(code: keyof (typeof EXPORT_ERRORS)["fr"], locale: string, status: number) {
  const lang = locale.startsWith("ar") ? "ar" : locale.startsWith("en") ? "en" : "fr";
  const msg = EXPORT_ERRORS[lang]?.[code] ?? EXPORT_ERRORS.fr[code];
  return NextResponse.json({ error: code, message: msg }, { status });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const locale = req.nextUrl.searchParams.get("locale") ?? req.headers.get("accept-language")?.split(",")[0] ?? "fr";
  const session = await auth();
  if (!session?.user?.email) {
    return exportError("unauthorized", locale, 401);
  }

  const docId = parseInt((await params).id, 10);
  const format = req.nextUrl.searchParams.get("format") || "pdf";

  if (Number.isNaN(docId)) {
    return exportError("invalid_id", locale, 400);
  }

  const authoringUser = await requireAuthoringUser();
  let doc: AuthoringResourceRow | null = null;
  let headerUser: AuthoringUser | null = authoringUser;

  if (authoringUser) {
    doc = await getAuthoringResource(docId, authoringUser.id, authoringUser.role);
  }

  if (!doc) {
    const [user] = await db.select().from(users).where(eq(users.email, session.user.email.toLowerCase())).limit(1);
    if (!user) {
      return exportError("unauthorized", locale, 401);
    }
    const children = await getFamilyChildren(user);
    doc = await getAuthoringResourceForFamily(docId, children.map((c) => c.id));
    if (doc) {
      const [owner] = await db
        .select({ id: users.id, email: users.email, fullName: users.fullName, role: users.role, metadata: users.metadata })
        .from(users)
        .where(eq(users.id, doc.ownerUserId))
        .limit(1);
      if (owner) {
        let metadata: Record<string, unknown> = {};
        try {
          metadata = owner.metadata ? (JSON.parse(owner.metadata) as Record<string, unknown>) : {};
        } catch {
          metadata = {};
        }
        headerUser = {
          id: owner.id,
          email: owner.email,
          fullName: owner.fullName,
          role: "enseignant",
          metadata,
        };
      }
    }
  }

  if (!doc || doc.kind !== "document") {
    return exportError("not_found", locale, 404);
  }

  const header = headerUser
    ? await buildSchoolHeader(headerUser)
    : { schoolName: "", teacherName: "", subjects: [], levels: [], schoolYear: "" };

  const safeName = doc.title.replace(/[^\w\s-àâäéèêëïîôùûüç]/gi, "").trim() || "document";

  if (format === "docx" || format === "word") {
    const buf = await renderDocumentDocx(doc.title, doc.contentJson, header);
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${safeName}.docx"`,
      },
    });
  }

  const buf = await renderDocumentPdf(doc.title, doc.contentJson, header);
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeName}.pdf"`,
    },
  });
}
