import { redirect } from "next/navigation";

export default async function ParentGenyRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const query = new URLSearchParams();
  query.set("tab", "geny");
  for (const [key, value] of Object.entries(sp)) {
    if (key === "tab" || value == null) continue;
    query.set(key, Array.isArray(value) ? value[0]! : value);
  }
  redirect(`/${locale}/dashboard/parent/atelier?${query.toString()}`);
}
