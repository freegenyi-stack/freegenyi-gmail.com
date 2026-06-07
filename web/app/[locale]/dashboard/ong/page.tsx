import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { Heart, MapPin, Globe, Users, ShieldCheck } from "lucide-react";
import { getVerificationForUser } from "@/lib/actions/org_verification";
import { getOrgProductName } from "@/lib/orgVerification.shared";
import OrgVerificationDashboard from "@/components/org/OrgVerificationDashboard";

export default async function OngDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("OrgDashboard");
  const session = await auth();
  if (!session?.user?.email) {
    redirect(`/${locale}/auth/login`);
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));

  if (!user || user.role !== "ong") {
    redirect(`/${locale}/dashboard/parent`);
  }

  if (user.onboardingStep! < 3) {
    redirect(`/${locale}/dashboard/onboarding`);
  }

  const metadata = user.metadata ? JSON.parse(user.metadata) : {};
  const verification = await getVerificationForUser(user.id);
  const status = (verification?.status ?? metadata.verificationStatus ?? "pending") as "pending" | "approved" | "rejected";
  const showFullDashboard = status === "approved" && user.onboardingStep! >= 4;

  const labels = {
    pendingTitle: t("pendingTitle"),
    pendingDesc: t("pendingDesc"),
    rejectedTitle: t("rejectedTitle"),
    rejectedDesc: t("rejectedDesc"),
    approvedTitle: t("approvedTitle"),
    approvedDesc: t("approvedDescNgo"),
    trackingLabel: t("trackingLabel"),
    accessErp: t("accessErp"),
    resubmit: t("resubmit"),
    resubmitting: t("resubmitting"),
    docPv: t("docPv"),
    docLicence: t("docLicence"),
    docDeclaration: t("docDeclaration"),
    docId: t("docId"),
    docStatuts: t("docStatuts"),
    docRecepisse: t("docRecepisse"),
    privateLicence: t("privateLicence"),
    privateDeclaration: t("privateDeclaration"),
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-dm-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight font-jakarta uppercase">
              FreeGeny <span className="text-amber-500">ONG</span>
            </h1>
            <p className="text-slate-500 font-medium mt-2 text-lg italic">{t("ngoSubtitle")}</p>
          </div>
          <div className="bg-white border-2 border-amber-100 p-4 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t("organization")}</p>
              <p className="text-sm font-black text-slate-900">{user.fullName}</p>
            </div>
          </div>
        </div>

        {!showFullDashboard ? (
          <OrgVerificationDashboard
            variant="ong"
            status={status}
            trackingCode={verification?.trackingCode ?? metadata.trackingCode ?? "—"}
            rejectionReason={verification?.rejectionReason}
            productName={getOrgProductName("ong")}
            labels={labels}
          />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-[3rem] p-12 shadow-xl border border-slate-50">
              <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter">{t("solidarityImpact")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center">
                  <Users className="w-8 h-8 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-lg font-black text-slate-900 mb-1">{t("familiesHelped")}</h3>
                  <p className="text-3xl font-black text-amber-600">0</p>
                </div>
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center">
                  <ShieldCheck className="w-8 h-8 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-lg font-black text-slate-900 mb-1">{t("activeMissions")}</h3>
                  <p className="text-3xl font-black text-amber-600">0</p>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-slate-50">
                <h3 className="text-sm font-black uppercase text-slate-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500" /> {t("headquarters")}
                </h3>
                <p className="text-xs text-slate-500 font-bold leading-relaxed">
                  {metadata.ngoAddress || t("addressMissing")}
                </p>
              </div>
              <div className="bg-amber-500 rounded-[2.5rem] p-8 text-white shadow-lg shadow-amber-200">
                <h3 className="text-sm font-black uppercase mb-4 tracking-widest">{t("statusApproved")}</h3>
                <p className="text-xl font-black mb-2 italic">FreeGeny ONG</p>
                <Globe className="w-10 h-10 opacity-40 mt-4" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
