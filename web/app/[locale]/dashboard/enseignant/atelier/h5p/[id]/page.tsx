import { redirect } from "next/navigation";

export default async function LegacyAtelierH5pRedirect({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  redirect(`/${locale}/dashboard/enseignant/atelier/activite/${id}`);
}
