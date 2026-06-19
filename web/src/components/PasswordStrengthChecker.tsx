"use client";

import { useLocale, useTranslations } from "next-intl";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPasswordChecks } from "@/lib/passwordPolicy";

type Props = {
  password: string;
  className?: string;
  compact?: boolean;
};

export default function PasswordStrengthChecker({ password, className, compact }: Props) {
  const locale = useLocale();
  const isRTL = locale === "ar" || locale.endsWith("-ar");
  const t = useTranslations("PasswordPolicy");
  const checks = getPasswordChecks(password);

  const rules: { key: keyof typeof checks; label: string }[] = [
    { key: "minLength", label: t("length") },
    { key: "uppercase", label: t("upper") },
    { key: "lowercase", label: t("lower") },
    { key: "digit", label: t("digit") },
    { key: "special", label: t("special") },
  ];

  return (
    <ul
      className={cn(
        "grid gap-1.5",
        compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1",
        className
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {rules.map(({ key, label }) => {
        const ok = checks[key];
        return (
          <li
            key={key}
            className={cn(
              "flex items-center gap-2 text-[11px] font-bold",
              ok ? "text-emerald-600" : "text-slate-400",
              isRTL && "flex-row-reverse font-ui-ar"
            )}
          >
            <span
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                ok ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-200 bg-white"
              )}
            >
              {ok ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5 opacity-40" />}
            </span>
            {label}
          </li>
        );
      })}
    </ul>
  );
}
