import React from "react";
import LoginClient from "./LoginClient";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="w-full flex-1 overflow-hidden">
      <LoginClient locale={locale} />
    </main>
  );
}
