import { redirect } from "next/navigation";

export default async function LegacyParentAtelierH5pRedirect({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  redirect(`/${locale}/dashboard/parent/atelier/activite/${id}`);
}
