"use client";

import { useState, useEffect } from 'react';
import { TRANSLATIONS } from '../data/translations';

export function useTranslation() {
    const [lang, setLangState] = useState('en');

    useEffect(() => {
        // 1. Initial Load
        const stored = localStorage.getItem('fg_lang');
        if (stored && TRANSLATIONS[stored]) {
            setLangState(stored);
        } else {
            // Browser detection
            const browserLang = navigator.language.split('-')[0].toLowerCase();
            if (TRANSLATIONS[browserLang]) {
                setLangState(browserLang);
            }
        }

        // 2. Listen for storage changes (sync across tabs)
        const handleStorage = () => {
            const stored = localStorage.getItem('fg_lang');
            if (stored && TRANSLATIONS[stored]) setLangState(stored);
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const setLang = (newLang: string) => {
        if (!TRANSLATIONS[newLang]) return;
        setLangState(newLang);
        localStorage.setItem('fg_lang', newLang);
        document.documentElement.lang = newLang;
        document.documentElement.dir = ['ar', 'fa', 'ur'].includes(newLang) ? 'rtl' : 'ltr';
    };

    const t = (key: string) => {
        return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en']?.[key] || key;
    };

    return { lang, setLang, t };
}
