"use client";

import { Link } from "@/i18n/routing";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { loginAction } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { resolveDashboardSegment } from "@/lib/auth/dashboard-route";

const MOBILE = {
  shell: "flex h-[calc(100dvh-72px)] flex-col overflow-hidden bg-white touch-manipulation",
  padX: "px-4 sm:px-5",
  title: "text-[22px] font-extrabold leading-snug text-black sm:text-2xl",
  subtitle: "mt-2 text-[15px] leading-snug text-neutral-600",
  card: "flex w-full min-h-[52px] items-center gap-3 rounded-2xl border-2 border-b-[5px] px-4 py-3.5 text-start transition-all active:border-b-2 active:translate-y-[2px] sm:gap-4 sm:px-5 sm:py-4",
  cardIdle: "border-neutral-300 border-b-neutral-400 bg-white text-black",
  cardActive: "border-orange-500 border-b-orange-600 bg-orange-50 text-black",
  input: "h-12 text-base text-black placeholder:text-neutral-400 sm:h-11 sm:text-sm",
  label: "text-[13px] font-bold text-black sm:text-xs",
  cta: "min-h-[52px] w-full rounded-2xl border-b-[5px] border-orange-800 bg-orange-500 py-3.5 text-base font-extrabold uppercase tracking-wide text-white transition active:border-b-2 active:translate-y-[2px] disabled:opacity-50 sm:text-sm",
  footer: "shrink-0 border-t border-neutral-200 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5",
} as const;

export default function LoginClient({ locale }: { locale: string }) {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRTL = locale === "ar" || locale.endsWith("-ar");
  const googleCallback = `/${locale}/auth/google-bridge`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await loginAction(formData);

    if ("error" in res && res.error) {
      toast.error(t("loginError"));
      setIsSubmitting(false);
      return;
    }

    toast.success(t("loginSuccess"));
    const userRole = "role" in res ? res.role : "parent";
    const onboardingStep = "onboardingStep" in res ? res.onboardingStep : 4;
    const dash = resolveDashboardSegment(userRole);

    if ((onboardingStep ?? 4) < 4) {
      const onboardingType =
        userRole === "enseignant"
          ? "?type=enseignant"
          : userRole === "ecole" || userRole === "ong"
            ? `?type=${userRole}`
            : "";
      router.push(`/${locale}/dashboard/onboarding${onboardingType}`);
    } else {
      router.push(`/${locale}/dashboard/${dash}`);
    }
    router.refresh();
    setIsSubmitting(false);
  };

  return (
    <div className={MOBILE.shell} dir={isRTL ? "rtl" : "ltr"}>
      <div className={cn("mx-auto w-full max-w-lg min-h-0 flex-1 overflow-hidden pt-6 sm:justify-center sm:pt-8", MOBILE.padX)}>
        <div className={cn("mb-5 sm:mb-6", isRTL && "text-right")}>
          <h1 className={cn(MOBILE.title, isRTL && "font-amiri text-[24px] sm:text-[26px]")}>{t("welcomeBack")}</h1>
          <p className={cn(MOBILE.subtitle, isRTL && "font-lateef text-base")}>{t("credentials")}</p>
        </div>

        <form id="login-form" onSubmit={handleSubmit} className="space-y-3">
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: googleCallback })}
            className={cn(
              MOBILE.card,
              MOBILE.cardIdle,
              "justify-center font-bold",
              isRTL && "font-amiri flex-row-reverse"
            )}
          >
            <img src="https://www.google.com/favicon.ico" className="h-5 w-5 shrink-0" alt="" />
            <span className="text-[15px]">{t("googleSignIn")}</span>
          </button>

          <p
            className={cn(
              "py-1 text-center text-xs font-bold uppercase tracking-wider text-neutral-500",
              isRTL && "font-amiri normal-case"
            )}
          >
            {t("orEmail")}
          </p>

          <Field label={t("email")} isRTL={isRTL}>
            <Input
              type="email"
              name="email"
              required
              placeholder={t("Placeholders.Email")}
              dir="ltr"
              className={MOBILE.input}
            />
          </Field>

          <Field label={t("password")} isRTL={isRTL}>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                dir="ltr"
                className={cn(MOBILE.input, "pe-11")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-neutral-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className={cn("pt-1", isRTL ? "text-left" : "text-right")}>
              <Link href="/auth/forgot" className="text-xs font-bold text-orange-600 hover:underline">
                {t("forgot")}
              </Link>
            </div>
          </Field>
        </form>
      </div>

      <div className={MOBILE.footer}>
        <div className="mx-auto w-full max-w-lg space-y-3">
          <button
            type="submit"
            form="login-form"
            disabled={isSubmitting}
            className={cn(MOBILE.cta, isRTL && "font-amiri normal-case text-lg")}
          >
            {isSubmitting ? t("connecting") : t("signIn")}
          </button>
          <p className={cn("text-center text-[15px] text-neutral-600", isRTL && "font-lateef")}>
            {t("noAccount")}{" "}
            <Link href="/auth/register" className="font-extrabold text-orange-600 hover:underline">
              {t("startAdventure")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, isRTL }: { label: string; children: React.ReactNode; isRTL?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className={cn(MOBILE.label, "block", isRTL && "font-amiri text-right text-sm")}>{label}</label>
      {children}
    </div>
  );
}
