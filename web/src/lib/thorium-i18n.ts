import { i18n, initI18n } from "@edrlab/thorium-web/reader";
import frShared from "@/lib/thorium-locales/fr/thorium-shared.json";
import frWeb from "@/lib/thorium-locales/fr/thorium-web.json";
import enShared from "@/lib/thorium-locales/en/thorium-shared.json";
import enWeb from "@/lib/thorium-locales/en/thorium-web.json";

const RESOURCES = {
  fr: { "thorium-shared": frShared, "thorium-web": frWeb },
  en: { "thorium-shared": enShared, "thorium-web": enWeb },
} as const;

let initPromise: Promise<typeof i18n> | null = null;

/** Initialise Thorium i18n avec traductions embarquées (pas de fetch HTTP). */
export function initThoriumI18n(): Promise<typeof i18n> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    if (!i18n.isInitialized) {
      await initI18n({
        lng: "fr",
        fallbackLng: "en",
        supportedLngs: ["fr", "en"],
        nonExplicitSupportedLngs: true,
        load: "languageOnly",
        detection: { order: [], caches: [] },
        resources: RESOURCES,
      });
    }

    i18n.addResourceBundle("fr", "thorium-shared", frShared, true, true);
    i18n.addResourceBundle("fr", "thorium-web", frWeb, true, true);
    i18n.addResourceBundle("en", "thorium-shared", enShared, true, true);
    i18n.addResourceBundle("en", "thorium-web", enWeb, true, true);
    await i18n.changeLanguage("fr");
    return i18n;
  })();

  return initPromise;
}
