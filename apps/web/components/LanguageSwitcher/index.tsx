'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/lib/i18n/navigation';
import { languageMetadata, Locale } from '@/lib/i18n/config';
import LanguageDropdown from './LanguageDropdown';
import { setLocaleCookie } from '@/lib/utils/cookies';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const currentLocale = useLocale() as Locale;
    const router = useRouter();
    const t = useTranslations('common');

    const currentLanguage = languageMetadata[currentLocale];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (locale: Locale) => {
        setIsOpen(false);
        setLocaleCookie(locale);
        router.refresh();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rtl:space-x-reverse"
                aria-label={t('language')}
                aria-expanded={isOpen}
            >
                <Globe className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                    {currentLanguage?.nativeName || currentLocale}
                </span>
                <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <LanguageDropdown
                isOpen={isOpen}
                currentLocale={currentLocale}
                onLanguageChange={handleLanguageChange}
            />
        </div>
    );
}
