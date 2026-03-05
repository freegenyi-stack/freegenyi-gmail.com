"use client"

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Cookie } from 'lucide-react';

const FreeGenyCookieBanner: React.FC = () => {
    const t = useTranslations('cookies');
    const [showBanner, setShowBanner] = useState(false);
    const [cookiePreferences, setCookiePreferences] = useState({
        necessary: true,
        analytics: false,
        marketing: false
    });

    useEffect(() => {
        const cookieChoice = localStorage.getItem('freegeny-cookie-consent');
        if (!cookieChoice) {
            setShowBanner(true);
        }
    }, []);

    const handleCookieAccept = (type: 'all' | 'necessary' | 'custom') => {
        switch (type) {
            case 'all':
                setCookiePreferences({ necessary: true, analytics: true, marketing: true });
                localStorage.setItem('freegeny-cookie-consent', 'all');
                break;
            case 'necessary':
                localStorage.setItem('freegeny-cookie-consent', 'necessary');
                break;
            default:
                localStorage.setItem('freegeny-cookie-consent', JSON.stringify(cookiePreferences));
        }
        setShowBanner(false);
    };

    const handleCookieCustomize = () => {
        // Ouvrir modal de personnalisation
        console.log('Ouvrir modal de personnalisation des cookies');
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-6 shadow-lg z-50">
            <div className="container mx-auto">
                <div className="flex flex-col lg:flex-row items-center justify-between">
                    <div className="flex items-start mb-4 lg:mb-0 lg:mr-8">
                        <Cookie className="mr-4 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="text-lg font-semibold mb-2">{t('title')}</h3>
                            <p className="text-gray-300 text-sm">
                                {t('description')}
                                <a href="#" className="text-blue-400 hover:text-blue-300 ml-1">
                                    {t('learnMore')}
                                </a>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => handleCookieAccept('necessary')}
                            className="px-6 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            {t('rejectAll')}
                        </button>
                        <button
                            onClick={handleCookieCustomize}
                            className="px-6 py-2 border border-blue-600 text-blue-400 rounded-lg hover:bg-blue-900/30 transition-colors"
                        >
                            {t('customize')}
                        </button>
                        <button
                            onClick={() => handleCookieAccept('all')}
                            className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {t('acceptAll')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreeGenyCookieBanner;
