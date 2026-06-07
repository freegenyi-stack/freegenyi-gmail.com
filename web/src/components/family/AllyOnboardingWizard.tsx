"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { signIn, useSession } from "next-auth/react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { checkUserAvailability } from "@/lib/actions/auth_elite";
import { completeCoparentOnboardingAction } from "@/lib/actions/family";

const MOBILE = {
  shell: "flex min-h-[calc(100dvh-72px)] flex-col overflow-hidden bg-white touch-manipulation",
  padX: "px-4 sm:px-5",
  title: "text-[22px] font-extrabold leading-snug text-black sm:text-2xl",
  subtitle: "mt-2 text-[15px] leading-snug text-neutral-600",
  card: "flex w-full min-h-[52px] items-center gap-3 rounded-2xl border-2 border-b-[5px] px-4 py-3.5 text-start transition-all active:border-b-2 active:translate-y-[2px]",
  cardIdle: "border-neutral-300 border-b-neutral-400 bg-white text-black",
  input: "h-12 text-base text-black placeholder:text-neutral-400 sm:h-11 sm:text-sm",
  label: "text-[13px] font-bold text-black sm:text-xs",
  cta: "min-h-[52px] w-full rounded-2xl border-b-[5px] border-orange-800 bg-orange-500 py-3.5 text-base font-extrabold uppercase tracking-wide text-white transition active:border-b-2 active:translate-y-[2px] disabled:opacity-50 sm:text-sm",
  footer: "shrink-0 border-t border-neutral-200 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5",
} as const;

type Props = {
  locale: string;
  token: string;
  invitedEmail: string;
  inviterName: string;
};

export default function AllyOnboardingWizard({ locale, token, invitedEmail, inviterName }: Props) {
  const t = useTranslations("AllyWizard");
  const { data: session, status } = useSession();
  const isRTL = locale.endsWith("-ar") || locale === "ar";

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [usernameOk, setUsernameOk] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const callbackUrl = `/${locale}/auth/invite?token=${token}`;
  const sessionEmail = session?.user?.email?.toLowerCase();
  const emailMatches = sessionEmail === invitedEmail.toLowerCase();

  useEffect(() => {
    if (session?.user?.name) setFullName(session.user.name);
  }, [session]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (username.length >= 3) {
        const r = await checkUserAvailability("username", username);
        setUsernameOk(r.available ?? false);
      } else setUsernameOk(null);
    }, 450);
    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = async () => {
    if (!username.trim() || !fullName.trim()) {
      toast.error(t("errRequired"));
      return;
    }
    if (usernameOk === false) {
      toast.error(t("errUsername"));
      return;
    }

    setIsSubmitting(true);
    const fd = new FormData();
    fd.set("username", username.trim().toLowerCase());
    fd.set("fullName", fullName.trim());
    fd.set("phone", phone ? "+213" + phone.replace(/\D/g, "") : "");

    const result = await completeCoparentOnboardingAction(fd, token);
    if ("error" in result && result.error) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }

    toast.success(t("welcome"));
    window.location.href = `/${locale}/dashboard/parent`;
  };

  if (status === "loading") {
    return (
      <div className={cn(MOBILE.shell, "items-center justify-center")}>
        <p className="text-neutral-500">{t("loading")}</p>
      </div>
    );
  }

  if (!session || !emailMatches) {
    return (
      <div className={MOBILE.shell} dir={isRTL ? "rtl" : "ltr"}>
        <div className={cn("mx-auto w-full max-w-lg flex-1 pt-8", MOBILE.padX)}>
          <h1 className={cn(MOBILE.title, isRTL && "font-amiri text-right")}>{t("title")}</h1>
          <p className={cn(MOBILE.subtitle, isRTL && "font-lateef text-right")}>
            {t("invitedBy", { name: inviterName })}
          </p>
          <p className={cn("mt-4 rounded-xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-900", isRTL && "font-amiri text-right")}>
            {t("useEmail", { email: invitedEmail })}
          </p>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl })}
              className={cn(MOBILE.card, MOBILE.cardIdle, "justify-center font-bold", isRTL && "font-amiri flex-row-reverse")}
            >
              <img src="https://www.google.com/favicon.ico" className="h-5 w-5 shrink-0" alt="" />
              <span>{t("google")}</span>
            </button>
            <p className={cn("text-center text-xs text-neutral-500", isRTL && "font-amiri")}>{t("googleHint")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={MOBILE.shell} dir={isRTL ? "rtl" : "ltr"}>
      <div className={cn("mx-auto w-full max-w-lg flex-1 pt-8", MOBILE.padX)}>
        <h1 className={cn(MOBILE.title, isRTL && "font-amiri text-right")}>{t("profileTitle")}</h1>
        <p className={cn(MOBILE.subtitle, isRTL && "font-lateef text-right")}>{t("profileSubtitle")}</p>

        <div className="mt-6 space-y-3">
          <Field label={t("fullName")} isRTL={isRTL}>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={cn(MOBILE.input, isRTL && "font-amiri text-right")}
            />
          </Field>
          <Field label={t("email")} isRTL={isRTL}>
            <Input value={invitedEmail} readOnly dir="ltr" className={cn(MOBILE.input, "bg-neutral-50 text-neutral-600")} />
          </Field>
          <Field label={t("username")} isRTL={isRTL}>
            <div className="relative">
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                dir="ltr"
                className={cn(MOBILE.input, "pe-11")}
                placeholder="mon.identifiant"
              />
              {usernameOk === true && (
                <Check className="absolute end-3 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-600" />
              )}
              {usernameOk === false && (
                <X className="absolute end-3 top-1/2 h-5 w-5 -translate-y-1/2 text-red-600" />
              )}
            </div>
          </Field>
          <Field label={t("phoneOptional")} isRTL={isRTL}>
            <div className="flex gap-2">
              <span className="flex h-12 shrink-0 items-center rounded-xl border border-neutral-300 bg-neutral-100 px-3 text-sm font-bold" dir="ltr">
                +213
              </span>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                dir="ltr"
                className={cn(MOBILE.input, "flex-1")}
              />
            </div>
          </Field>
        </div>
      </div>

      <div className={MOBILE.footer}>
        <div className="mx-auto w-full max-w-lg">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => void handleSubmit()}
            className={cn(MOBILE.cta, isRTL && "font-amiri normal-case text-lg")}
          >
            {isSubmitting ? t("submitting") : t("submit")}
          </button>
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
