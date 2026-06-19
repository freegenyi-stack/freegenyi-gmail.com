import { redirect } from "next/navigation";

export default async function ParentPrintablesRedirectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/dashboard/parent/atelier?tab=geny`);
}
