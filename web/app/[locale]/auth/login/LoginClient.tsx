"use client";

import { Link } from "@/i18n/routing";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { getSession, signIn } from "next-auth/react";
import { loginAction } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { resolveDashboardSegment } from "@/lib/auth/dashboard-route";
import "./login-theme.css";

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
      toast.error(res.error);
      setIsSubmitting(false);
      return;
    }

    toast.success(t("loginSuccess"));
    await getSession();
    const isAdmin = "isAdmin" in res && res.isAdmin;
    const userRole = "role" in res ? res.role : "parent";
    const onboardingStep = "onboardingStep" in res ? res.onboardingStep : 4;

    if (isAdmin) {
      router.push(`/${locale}/dashboard/admin`);
      router.refresh();
      setIsSubmitting(false);
      return;
    }

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
    <div
      className="login-shell flex h-[calc(100dvh-72px)] flex-col overflow-hidden touch-manipulation"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mx-auto flex min-h-0 w-full max-w-lg flex-1 flex-col overflow-hidden px-4 pt-6 sm:justify-center sm:px-5 sm:pt-8">
        <div className={cn("mb-5 sm:mb-6", isRTL && "text-right")}>
          <h1
            className={cn(
              "login-shell__title",
              isRTL && "font-ui-ar text-[24px] sm:text-[26px]"
            )}
          >
            {t("welcomeBack")}
          </h1>
          <p className={cn("login-shell__subtitle", isRTL && "font-lateef text-base")}>
            {t("credentials")}
          </p>
        </div>

        <form id="login-form" onSubmit={handleSubmit} className="space-y-3">
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: googleCallback })}
            className={cn(
              "login-shell__btn-outline",
              isRTL && "font-ui-ar flex-row-reverse"
            )}
          >
            <img src="https://www.google.com/favicon.ico" className="h-5 w-5 shrink-0" alt="" />
            <span>{t("googleSignIn")}</span>
          </button>

          <p className={cn("login-shell__divider", isRTL && "font-ui-ar normal-case")}>
            {t("orEmail")}
          </p>

          <Field label={t("email")} isRTL={isRTL}>
            <input
              type="text"
              name="email"
              required
              autoComplete="username"
              placeholder={t("Placeholders.Email")}
              dir="ltr"
              className="login-shell__input"
            />
          </Field>

          <Field label={t("password")} isRTL={isRTL}>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                dir="ltr"
                className="login-shell__input pe-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="login-shell__toggle-pw"
                aria-label={showPassword ? t("password") : t("password")}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className={cn("pt-1", isRTL ? "text-left" : "text-right")}>
              <Link href="/auth/forgot" className="login-shell__link">
                {t("forgot")}
              </Link>
            </div>
          </Field>
        </form>
      </div>

      <div className="login-shell__footer">
        <div className="mx-auto w-full max-w-lg space-y-3 px-4 sm:px-5">
          <button
            type="submit"
            form="login-form"
            disabled={isSubmitting}
            className={cn("login-shell__btn-primary", isRTL && "font-ui-ar text-base")}
          >
            {isSubmitting ? t("connecting") : t("signIn")}
          </button>
          <p className={cn("login-shell__footer-note", isRTL && "font-lateef")}>
            {t("noAccount")}{" "}
            <Link href="/auth/register">{t("startAdventure")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, isRTL }: { label: string; children: React.ReactNode; isRTL?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className={cn("login-shell__label", isRTL && "font-ui-ar text-right text-sm")}>
        {label}
      </label>
      {children}
    </div>
  );
}
