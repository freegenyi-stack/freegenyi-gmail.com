import React from "react";
import RegisterClient from "./RegisterClient";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="h-[100dvh] w-full overflow-hidden bg-slate-50 font-dm-sans selection:bg-orange-600 selection:text-white relative">
      {/* Background Ornaments */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-orange-100 rounded-full blur-[150px] opacity-40"></div>
      </div>

      <RegisterClient locale={locale} />
    </main>
  );
}
