import AtelierHubClient from "@/components/atelier/AtelierHubClient";
import ExploreNav from "@/components/explore/ExploreNav";
import { loadExploreAtelierResources } from "@/lib/explore/loaders.server";

export default async function ExploreParentAtelierPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { resources, basePath } = await loadExploreAtelierResources("parent", locale);

  return (
    <>
      <ExploreNav role="parent" />
      <AtelierHubClient
        resources={resources}
        mode="parent"
        basePath={basePath}
        exploreMode
      />
    </>
  );
}
