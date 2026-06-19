import AtelierHubClient from "@/components/atelier/AtelierHubClient";
import ExploreNav from "@/components/explore/ExploreNav";
import { loadExploreAtelierResources } from "@/lib/explore/loaders.server";

export default async function ExploreTeacherAtelierPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { resources, basePath } = await loadExploreAtelierResources("teacher", locale);

  return (
    <>
      <ExploreNav role="teacher" />
      <AtelierHubClient
        resources={resources}
        mode="enseignant"
        basePath={basePath}
        exploreMode
      />
    </>
  );
}
