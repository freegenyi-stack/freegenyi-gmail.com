import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const originalLocale = await requestLocale;
  let locale = originalLocale;

  if (locale && locale.includes("-")) {
    locale = locale.split("-")[1];
  }

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  let messages;
  try {
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    console.warn(`[i18n] Missing translations for locale ${locale}, falling back to ${routing.defaultLocale}.`);
    messages = (await import(`../messages/${routing.defaultLocale}.json`)).default;
  }

  return {
    locale: originalLocale || locale,
    messages,
  };
});
