import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { locales } from './i18n/config';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .use(
        resourcesToBackend(async (language: string, namespace: string) => {
            if (['fr', 'en', 'es', 'ar'].includes(language)) {
                try {
                    return await import(`../messages/i18n/${language}/${namespace}.json`);
                } catch (e) {
                    console.warn(`Failed to load namespace ${namespace} for ${language}, falling back to flat file.`);
                }
            }
            const mod = await import(`../messages/${language}.json`);
            // Handle flat files where namespaces are keys: { "home": {...}, "common": {...} }
            return mod.default ? (mod.default[namespace] || mod.default) : (mod[namespace] || mod);
        })
    )
    .init({
        fallbackLng: 'fr',
        supportedLngs: locales as unknown as string[],
        ns: ['common', 'navigation', 'home', 'footer', 'cookies'],
        defaultNS: 'common',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['path', 'cookie', 'htmlTag', 'localStorage', 'subdomain'],
            caches: ['localStorage', 'cookie'],
        },
        react: {
            useSuspense: false,
        }
    });

export default i18n;
