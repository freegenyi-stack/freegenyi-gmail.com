import { fr } from "./fr";
import { ar } from "./ar";

export type Locale = "fr" | "ar";

const catalogs = { fr, ar } as const;
let currentLocale: Locale = "fr";

export function getLocale(): Locale {
  return currentLocale;
}

export function setI18nLocale(locale: Locale) {
  currentLocale = locale;
}

function getNested(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in (cur as object)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  return typeof cur === "string" ? cur : undefined;
}

export function t(scope: string, vars?: Record<string, string>): string {
  let value =
    getNested(catalogs[currentLocale] as unknown as Record<string, unknown>, scope) ||
    getNested(fr as unknown as Record<string, unknown>, scope) ||
    scope;
  if (vars) {
    for (const [key, val] of Object.entries(vars)) {
      value = value.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), val);
    }
  }
  return value;
}
