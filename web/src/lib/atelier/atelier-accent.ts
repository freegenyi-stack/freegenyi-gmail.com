export type AtelierAccent = "parent" | "teacher";

export function atelierAccentFromBackHref(backHref: string): AtelierAccent {
  return backHref.includes("/parent/") ? "parent" : "teacher";
}

export function atelierAccentClasses(accent: AtelierAccent) {
  const isParent = accent === "parent";
  return {
    linkHover: isParent ? "hover:text-orange-700" : "hover:text-teal-700",
    badge: isParent
      ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
      : "bg-teal-100 text-teal-800 hover:bg-teal-100",
    tabActive: isParent ? "bg-orange-600 text-white" : "bg-teal-600 text-white",
    btnPrimary: isParent ? "bg-orange-600 hover:bg-orange-500" : "bg-teal-600 hover:bg-teal-500",
    btnPrimaryText: isParent ? "text-orange-600" : "text-teal-600",
    panelHover: isParent ? "hover:bg-orange-50" : "hover:bg-slate-50",
  };
}
