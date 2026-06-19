import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import AtelierActivityClient from "@/components/atelier/AtelierActivityClient";
import AtelierDocumentClient from "@/components/atelier/AtelierDocumentClient";
import AtelierMindmapClient from "@/components/atelier/AtelierMindmapClient";
import AtelierVisualClient from "@/components/atelier/AtelierVisualClient";
import ExploreNav from "@/components/explore/ExploreNav";
import { loadExploreAuthoringResource } from "@/lib/explore/loaders.server";
import type { ExploreRole } from "@/lib/explore/constants";

export default async function ExploreAtelierEditorPage({
  params,
  role,
}: {
  params: Promise<{ locale: string; segments: string[] }>;
  role: ExploreRole;
}) {
  const { locale, segments } = await params;
  if (segments.length !== 2) notFound();

  const [segment, idRaw] = segments;
  const resourceId = parseInt(idRaw, 10);
  if (Number.isNaN(resourceId)) notFound();

  const { resource, backHref, header } = await loadExploreAuthoringResource(role, locale, resourceId, segment);

  let editor: ReactNode = null;

  if (resource.kind === "document") {
    editor = (
      <div className="min-h-screen bg-slate-50 p-6 sm:p-8">
        <div className="mx-auto max-w-4xl">
          <AtelierDocumentClient resource={resource} header={header} backHref={backHref} />
        </div>
      </div>
    );
  } else if (resource.kind === "visual") {
    editor = <AtelierVisualClient resource={resource} backHref={backHref} />;
  } else if (resource.kind === "mindmap") {
    editor = <AtelierMindmapClient resource={resource} backHref={backHref} />;
  } else if (resource.kind === "activity" || resource.kind === "h5p") {
    editor = (
      <div className="min-h-screen bg-slate-50 p-6 sm:p-8">
        <div className="mx-auto max-w-4xl">
          <AtelierActivityClient resource={resource} backHref={backHref} />
        </div>
      </div>
    );
  }

  if (!editor) notFound();

  return (
    <>
      <ExploreNav role={role} />
      {editor}
    </>
  );
}
