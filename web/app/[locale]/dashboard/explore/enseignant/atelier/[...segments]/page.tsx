import ExploreAtelierEditorPage from "@/lib/explore/atelier-editor-page";

export default function Page(props: { params: Promise<{ locale: string; segments: string[] }> }) {
  return <ExploreAtelierEditorPage {...props} role="teacher" />;
}
