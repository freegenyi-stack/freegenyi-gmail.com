import { DevSettings, I18nManager, Platform } from "react-native";
import { setI18nLocale, type Locale } from "@/i18n";

export function isRtlLocale(locale: Locale): boolean {
  return locale === "ar";
}

/** Sync React Native layout direction (call on cold start + language change). */
export function applyNativeRtl(locale: Locale): boolean {
  const rtl = isRtlLocale(locale);
  if (I18nManager.isRTL === rtl) return false;
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(rtl);
  return true;
}

export async function applyAppLocale(locale: Locale): Promise<void> {
  setI18nLocale(locale);
  const needsReload = applyNativeRtl(locale);
  if (needsReload && Platform.OS !== "web") {
    if (__DEV__ && DevSettings?.reload) {
      DevSettings.reload();
    }
  }
}
