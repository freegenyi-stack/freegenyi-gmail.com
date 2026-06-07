"use client";

import { GraduationCap, Heart, School, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { HIDDEN_REGISTER_ROLES } from "@/constants/publicNav";

export type AuthRole = "parent" | "enseignant" | "ecole" | "ong";

const ALL_ROLES: Array<{
  id: AuthRole;
  icon: typeof Heart;
  color: string;
  activeColor: string;
}> = [
  { id: "parent", icon: Heart, color: "text-orange-600", activeColor: "bg-orange-600 border-orange-600 text-white" },
  { id: "enseignant", icon: GraduationCap, color: "text-teal-600", activeColor: "bg-teal-600 border-teal-600 text-white" },
  { id: "ecole", icon: School, color: "text-indigo-600", activeColor: "bg-indigo-600 border-indigo-600 text-white" },
  { id: "ong", icon: Users, color: "text-amber-600", activeColor: "bg-amber-600 border-amber-600 text-white" },
];

const ROLES = ALL_ROLES.filter((r) => !HIDDEN_REGISTER_ROLES.includes(r.id as (typeof HIDDEN_REGISTER_ROLES)[number]));

type Props = {
  value: AuthRole;
  onChange: (role: AuthRole) => void;
  isRTL?: boolean;
};

export default function AuthRolePicker({ value, onChange, isRTL }: Props) {
  const t = useTranslations("Auth");

  const label = (id: AuthRole) => {
    if (id === "parent") return t("roleParent");
    if (id === "enseignant") return t("roleTeacher");
    if (id === "ecole") return t("roleSchool");
    return t("roleNgo");
  };

  return (
    <div className="space-y-2">
      <p className={cn("text-xs font-semibold text-slate-500", isRTL && "font-amiri text-sm text-right")}>
        {t("chooseRole")}
      </p>
      <div className={cn("grid grid-cols-2 gap-2", isRTL && "direction-rtl")}>
        {ROLES.map(({ id, icon: Icon, color, activeColor }) => {
          const active = value === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={cn(
                "flex items-center gap-2 rounded-xl border-2 px-3 py-3 text-left text-xs font-bold transition-all",
                active ? activeColor : "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200 hover:bg-white",
                isRTL && "flex-row-reverse text-right font-amiri text-sm"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", !active && color)} />
              <span className="truncate">{label(id)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function registerHrefForRole(role: AuthRole, locale: string): string {
  if (role === "enseignant") return `/${locale}/auth/register/teacher`;
  const type = role === "parent" ? "parent" : role;
  return `/${locale}/auth/register?type=${type}`;
}
