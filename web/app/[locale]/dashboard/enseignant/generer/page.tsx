import { redirect } from "next/navigation";

export default async function LegacyGenererRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/dashboard/enseignant/atelier`);
}
