import { getRequestConfig } from 'next-intl/server';
import { locales } from '../lib/i18n/config';

// Deep merge utility for i18n messages
function deepMerge(target: any, source: any) {
    if (!source) return target;
    const output = { ...target };
    Object.keys(source).forEach(key => {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            if (!(key in target)) {
                output[key] = source[key];
            } else {
                output[key] = deepMerge(target[key], source[key]);
            }
        } else {
            output[key] = source[key];
        }
    });
    return output;
}

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    // Validate that the incoming `locale` parameter is valid
    if (!locales.includes(locale as any)) {
        locale = 'en';
    }

    // Load both current locale and default (en) for fallbacks
    const [localeMessages, defaultMessages] = await Promise.all([
        import(`../messages/${locale}.json`).catch(() => ({ default: {} })),
        import(`../messages/en.json`)
    ]);

    const messages = deepMerge(
        defaultMessages.default || defaultMessages,
        localeMessages.default || localeMessages
    );

    return {
        locale,
        messages,
        onError(error) {
            // Silence missing message errors in production build
            if (error.code !== 'MISSING_MESSAGE') {
                console.error(error);
            }
        },
        getMessageFallback({ namespace, key }) {
            const path = [namespace, key].filter(Boolean).join('.');
            return path;
        }
    };
});

