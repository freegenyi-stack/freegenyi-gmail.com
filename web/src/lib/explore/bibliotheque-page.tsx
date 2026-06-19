import { getTranslations } from "next-intl/server";
import BibliothequeClient from "@/app/[locale]/dashboard/parent/bibliotheque/BibliothequeClient";
import ExploreNav from "@/components/explore/ExploreNav";
import { exploreBibliothequePath } from "@/lib/explore/constants";
import { requireExploreSession } from "@/lib/explore/session.server";
import { listPublishedBooks } from "@/lib/library/books.server";
import { audiencesForContext } from "@/lib/library/audience";
import type { ExploreRole } from "@/lib/explore/constants";

export default async function ExploreBibliothequePage({
  params,
  role,
}: {
  params: Promise<{ locale: string }>;
  role: ExploreRole;
}) {
  const { locale } = await params;
  await requireExploreSession(role, locale);
  const t = await getTranslations("Library");
  const audiences = audiencesForContext(role === "teacher" ? "teacher" : "parent");
  const books = await listPublishedBooks(100, audiences);
  const basePath = exploreBibliothequePath(role);

  return (
    <>
      <ExploreNav role={role} />
      <div className="mb-8">
        <h1 className="font-reem text-3xl font-black text-slate-900">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("exploreSubtitle")}</p>
      </div>
      <BibliothequeClient
        books={books}
        assignments={[]}
        continueReading={[]}
        progressMap={{}}
        basePath={basePath}
      />
    </>
  );
}
