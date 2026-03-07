export const locales = [
    'en', 'ar', 'fr', 'es', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'hi',
    'bn', 'tr', 'vi', 'th', 'id', 'nl', 'sv', 'no', 'da', 'fi', 'pl', 'cs',
    'hu', 'ro', 'el', 'uk', 'fa', 'ur', 'sw', 'ha', 'ga', 'ca', 'fil', 'pcm',
    'bg', 'ka', 'nb', 'sr', 'uz', 'hy', 'az', 'mr', 'pa', 'as', 'my', 'gu',
    'kn', 'kk', 'km', 'ky', 'lv', 'lt', 'mn', 'ta', 'dari', 'ms', 'te', 'xh', 'zu'
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

export const rtlLocales: Locale[] = ['ar', 'fa', 'ur', 'dari'];

export function getLocaleFromCountry(country: string | null): string {
    // Pour l'Algérie, utiliser l'arabe par défaut
    if (country === 'DZ') return 'ar';
    // Pour les autres pays du Maghreb, utiliser le français
    if (country === 'MA' || country === 'TN') return 'fr';
    return defaultLocale;
}

export const languageMetadata: Record<Locale, { name: string; nativeName: string; flag: string }> = {
    en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
    ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
    fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    it: { name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    pt: { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
    ru: { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    ko: { name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    hi: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    bn: { name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
    tr: { name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
    vi: { name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
    th: { name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
    id: { name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
    nl: { name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
    sv: { name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
    no: { name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
    da: { name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
    fi: { name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
    pl: { name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
    cs: { name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
    hu: { name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺' },
    ro: { name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
    el: { name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' },
    uk: { name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
    fa: { name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷' },
    ur: { name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
    sw: { name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
    ha: { name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬' },
    ga: { name: 'Irish', nativeName: 'Gaeilge', flag: '🇮🇪' },
    ca: { name: 'Catalan', nativeName: 'Català', flag: '🇪🇸' },
    fil: { name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭' },
    pcm: { name: 'Nigerian Pidgin', nativeName: 'Naijá', flag: '🇳🇬' },
    bg: { name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬' },
    ka: { name: 'Georgian', nativeName: 'ქართული', flag: '🇬🇪' },
    nb: { name: 'Norwegian Bokmål', nativeName: 'Norsk bokmål', flag: '🇳🇴' },
    sr: { name: 'Serbian', nativeName: 'Српски', flag: '🇷🇸' },
    uz: { name: 'Uzbek', nativeName: 'Oʻzbekcha', flag: '🇺🇿' },
    hy: { name: 'Armenian', nativeName: 'Հայերեն', flag: '🇦🇲' },
    az: { name: 'Azerbaijani', nativeName: 'Azərbaycanca', flag: '🇦🇿' },
    mr: { name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
    pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    as: { name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
    my: { name: 'Burmese', nativeName: 'မြန်မာစာ', flag: '🇲🇲' },
    gu: { name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
    kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
    kk: { name: 'Kazakh', nativeName: 'Қазақ tili', flag: '🇰🇿' },
    km: { name: 'Khmer', nativeName: 'ខ្មែរ', flag: '🇰🇭' },
    ky: { name: 'Kyrgyz', nativeName: 'Кыргызча', flag: '🇰🇬' },
    lv: { name: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻' },
    lt: { name: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹' },
    mn: { name: 'Mongolian', nativeName: 'Монгол', flag: '🇲🇳' },
    ta: { name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
    dari: { name: 'Dari', nativeName: 'دری', flag: '🇦🇫' },
    ms: { name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
    te: { name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
    xh: { name: 'Xhosa', nativeName: 'isiXhosa', flag: '🇿🇦' },
    zu: { name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦' }
};
