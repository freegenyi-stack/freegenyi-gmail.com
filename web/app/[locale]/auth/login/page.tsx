import React from "react";
import LoginClient from "./LoginClient";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="min-h-[100dvh] w-full">
      <LoginClient locale={locale} />
    </main>
  );
}
