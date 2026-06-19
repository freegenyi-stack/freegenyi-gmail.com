import React from "react";
import { auth } from "@/auth";
import { isMaintenanceMode } from "@/lib/admin/settings.server";
import { isAdminEmail } from "@/lib/admin/requireAdmin";

export default async function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const maintenance = await isMaintenanceMode();
  const isAdmin = session?.user?.email && isAdminEmail(session.user.email);

  if (maintenance && !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-white">
        <div className="max-w-md space-y-4">
          <p className="text-xs font-black uppercase tracking-widest text-orange-400">FreeGeny</p>
          <h1 className="text-3xl font-black">Maintenance en cours</h1>
          <p className="text-slate-400">Nous revenons très bientôt. Merci de votre patience.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
