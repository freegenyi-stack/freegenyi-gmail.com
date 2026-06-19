import React, { Suspense } from "react";
import { auth } from "@/auth";
import RegisterWizard from "@/components/register/RegisterWizard";

export default async function RegisterPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ google?: string; type?: string }>;
}) {
  const { locale } = await params;
  const { google, type } = await searchParams;
  const session = await auth();
  const isGoogleResume = google === "1" && Boolean(session?.user?.email);
  const initialRole = type === "enseignant" ? ("enseignant" as const) : ("parent" as const);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100dvh-64px)] items-center justify-center text-slate-400 text-sm">
          …
        </div>
      }
    >
      <RegisterWizard
        locale={locale}
        mode={isGoogleResume ? "google" : "register"}
        initialRole={
          type === "enseignant" ? "enseignant" : type === "parent" ? "parent" : isGoogleResume ? initialRole : undefined
        }
      />
    </Suspense>
  );
}
