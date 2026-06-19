import ExploreBibliothequePage from "@/lib/explore/bibliotheque-page";

export default function Page(props: { params: Promise<{ locale: string }> }) {
  return <ExploreBibliothequePage {...props} role="teacher" />;
}
