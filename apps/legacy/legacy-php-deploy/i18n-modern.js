/**
 * i18n-modern.js - Modern translation engine for FreeGeny
 * Loads messages/JSON directly and applies them to elements with [data-i18n]
 */

class I18nManager {
    constructor() {
        this.currentLocale = localStorage.getItem('fg_lang') || this.detectBrowserLang() || 'en';
        this.messages = {};
        this.validLocales = ['en', 'zh', 'hi', 'es', 'ar', 'fr', 'bn', 'pt', 'ru', 'id', 'ur', 'de', 'ja', 'pcm', 'sw', 'tl', 'ha', 'tr', 'pnb', 'fa', 'ko', 'th', 'jv', 'it', 'vi', 'nl', 'pl', 'uk', 'ca', 'ga', 'sv', 'da', 'no', 'ro', 'el', 'cs', 'fi', 'hu', 'gl', 'eu', 'hr', 'sr', 'sl', 'bg', 'et', 'lv', 'lt', 'mt', 'cy', 'be', 'mk', 'sq', 'is'];

        if (!this.validLocales.includes(this.currentLocale)) {
            this.currentLocale = 'en';
        }
    }

    detectBrowserLang() {
        const lang = navigator.language.split('-')[0];
        return lang;
    }

    async init() {
        await this.loadLanguage(this.currentLocale);
        this.updateDOM();
        this.setRTL();
    }

    async loadLanguage(locale) {
        try {
            const response = await fetch(`/messages/${locale}.json`);
            if (!response.ok) throw new Error(`Could not load ${locale}`);
            this.messages = await response.json();
            this.currentLocale = locale;
            localStorage.setItem('fg_lang', locale);

            // Dispatch event for components that need to react
            window.dispatchEvent(new CustomEvent('langChanged', { detail: { locale, dir: this.getDir() } }));
        } catch (error) {
            console.error('i18n init error:', error);
            if (locale !== 'en') await this.loadLanguage('en');
        }
    }

    updateDOM() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.getValue(key);
            if (translation) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translation;
                } else {
                    el.innerHTML = translation;
                }
            }
        });

        // Update active language UI
        const currentLangDisplay = document.querySelector('#current-lang-code');
        if (currentLangDisplay) currentLangDisplay.innerText = this.currentLocale.toUpperCase();

        document.documentElement.lang = this.currentLocale;
    }

    getValue(path) {
        return path.split('.').reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : null, this.messages);
    }

    getDir() {
        return ['ar', 'fa', 'ur'].includes(this.currentLocale) ? 'rtl' : 'ltr';
    }

    setRTL() {
        const dir = this.getDir();
        document.documentElement.dir = dir;
        document.body.className = dir;
    }

    async setLang(locale) {
        await this.loadLanguage(locale);
        this.updateDOM();
        this.setRTL();
    }
}

// Global instance
window.i18n = new I18nManager();
document.addEventListener('DOMContentLoaded', () => window.i18n.init());
