import { ATELIER_ACTIVITY_PATH } from "./h5p-config";
import { ATELIER_MINDMAP_PATH, ATELIER_VISUAL_PATH } from "./visual-config";
import { buildSchoolHeader, headerLines } from "./document-header";
import { normalizePedagogyLevel } from "./pedagogy-level";
import { getAuthoringResource, updateAuthoringResource } from "./resources.server";
import type { AuthoringUser } from "./session";
import { createPedagogyShare } from "@/lib/pedagogy/shares.server";
import { requireTeacherVerified } from "@/lib/orgVerification.guard";
export type MurPublishResult =  | { ok: true; shareId: number }
  | { ok: false; error: "not_found" | "unauthorized" | "verification" | "mur_failed"; detail?: string };

/** Publie une ressource atelier sur le Mur pédagogique (+ PDF ou pièce jointe). */
export async function publishAuthoringResourceToMur(
  user: AuthoringUser,
  resourceId: number,
  locale: string,
  appOrigin = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000"
): Promise<MurPublishResult> {
  if (user.role !== "enseignant") return { ok: false, error: "unauthorized" };

  const resource = await getAuthoringResource(resourceId, user.id, user.role);
  if (!resource) return { ok: false, error: "not_found" };

  const verified = await requireTeacherVerified(user.id, JSON.stringify(user.metadata));
  if (!verified.ok) return { ok: false, error: "verification", detail: verified.error };

  const header = await buildSchoolHeader(user);
  const teacherLevels = header.levels.filter((l) => l && l !== "—");
  const educationLevel = normalizePedagogyLevel(resource.schoolLevel, teacherLevels);

  const basePath = `/dashboard/enseignant/atelier`;
  const resourcePath =
    resource.kind === "document"
      ? `${basePath}/document/${resource.id}`
      : resource.kind === "visual"
        ? `${basePath}/${ATELIER_VISUAL_PATH}/${resource.id}`
        : resource.kind === "mindmap"
          ? `${basePath}/${ATELIER_MINDMAP_PATH}/${resource.id}`
          : `${basePath}/${ATELIER_ACTIVITY_PATH}/${resource.id}`;
  const shareUrl = `${appOrigin.replace(/\/$/, "")}/${locale}${resourcePath}`;
  const parentPlayUrl =
    resource.kind !== "document" && resource.kind !== "visual" && resource.kind !== "mindmap"
      ? `${appOrigin.replace(/\/$/, "")}/${locale}/dashboard/parent/atelier/activite/${resource.id}`
      : shareUrl;

  const fd = new FormData();
  fd.set("title", resource.title);
  fd.set(
    "post_type",
    resource.kind === "document" || resource.kind === "visual" || resource.kind === "mindmap"
      ? "lesson"
      : "exercise"
  );
  fd.set("education_level", educationLevel);
  if (resource.subject) fd.set("subject", resource.subject);
  fd.set("authoring_resource_id", String(resource.id));

  const levelPart = educationLevel;
  const subjectPart = resource.subject ? ` · ${resource.subject}` : "";
  if (resource.kind === "document") {
    fd.set(
      "description",
      locale.startsWith("ar")
        ? `نشر الأستاذ(ة) درساً — ${resource.title} — ${levelPart}${subjectPart}\n${shareUrl}`
        : `L'enseignant(e) a publié une leçon — ${resource.title} — ${levelPart}${subjectPart}\n${shareUrl}`
    );
  } else if (resource.kind === "visual") {
    fd.set(
      "description",
      locale.startsWith("ar")
        ? `نشر الأستاذ(ة) ملصقاً مرئياً — ${resource.title} — ${levelPart}${subjectPart}\n${shareUrl}`
        : `L'enseignant(e) a publié une affiche — ${resource.title} — ${levelPart}${subjectPart}\n${shareUrl}`
    );
  } else if (resource.kind === "mindmap") {
    fd.set(
      "description",
      locale.startsWith("ar")
        ? `نشر الأستاذ(ة) خريطة ذهنية — ${resource.title} — ${levelPart}${subjectPart}\n${shareUrl}`
        : `L'enseignant(e) a publié une carte mentale — ${resource.title} — ${levelPart}${subjectPart}\n${shareUrl}`
    );
  } else {
    fd.set(
      "description",
      locale.startsWith("ar")
        ? `نشر الأستاذ(ة) نشاطاً تفاعلياً — ${resource.title} — ${levelPart}${subjectPart}\n${parentPlayUrl}`
        : `L'enseignant(e) a publié un exercice interactif — ${resource.title} — ${levelPart}${subjectPart}\n${parentPlayUrl}`
    );
  }

  if (resource.kind === "document") {
    const headerBlock = headerLines(header).join("\n");
    let enriched = resource.contentJson;
    try {
      const doc = JSON.parse(resource.contentJson) as { type?: string; content?: unknown[] };
      if (doc.type === "doc") {
        const headerNodes = headerBlock.split("\n").map((line) => ({
          type: "paragraph",
          content: [{ type: "text", text: line }],
        }));
        enriched = JSON.stringify({ ...doc, content: [...headerNodes, ...(doc.content ?? [])] });
      }
    } catch {
      /* keep original */
    }
    const { renderDocumentPdf } = await import("@/lib/teacher/document-export.server");
    const pdfBuf = await renderDocumentPdf(resource.title, enriched);
    fd.append("files", new File([new Uint8Array(pdfBuf)], `${resource.title}.pdf`, { type: "application/pdf" }));
  }
  // Activités interactives : pas de pièce jointe .txt — le bouton « Jouer » suffit

  const result = await createPedagogyShare(user.id, fd);
  if ("error" in result) return { ok: false, error: "mur_failed", detail: result.error };

  await updateAuthoringResource(resourceId, user.id, user.role, { status: "published" });
  return { ok: true, shareId: result.id };
}
