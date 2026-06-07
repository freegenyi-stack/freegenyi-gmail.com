import React, { Suspense } from "react";
import RegisterTeacherClient from "@/components/teacher/RegisterTeacherClient";

export default async function RegisterTeacherPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center text-slate-400 font-bold">…</div>}>
      <RegisterTeacherClient locale={locale} />
    </Suspense>
  );
}
