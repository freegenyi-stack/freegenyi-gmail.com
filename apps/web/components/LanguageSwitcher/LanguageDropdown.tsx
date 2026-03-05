'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { languageMetadata, locales } from '@/lib/i18n/config';
import { Check } from 'lucide-react';

interface LanguageDropdownProps {
    isOpen: boolean;
    currentLocale: string;
    onLanguageChange: (locale: any) => void;
}

export default function LanguageDropdown({
    isOpen,
    currentLocale,
    onLanguageChange,
}: LanguageDropdownProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden rtl:right-auto rtl:left-0"
                >
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-900">
                            Select Language
                        </h3>
                    </div>

                    <div className="max-h-96 overflow-y-auto scrollbar-thin">
                        <div className="grid grid-cols-1 divide-y divide-gray-100">
                            {locales.map((locale) => {
                                const language = languageMetadata[locale];
                                const isActive = locale === currentLocale;

                                return (
                                    <button
                                        key={locale}
                                        onClick={() => onLanguageChange(locale)}
                                        className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 flex items-center justify-between group ${isActive ? 'bg-blue-50' : ''
                                            }`}
                                    >
                                        <div>
                                            <div className="font-medium text-gray-900 group-hover:text-blue-600">
                                                {language.nativeName}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                {language.name}
                                            </div>
                                        </div>
                                        {isActive && <Check className="w-4 h-4 text-blue-600" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
