'use client';
import { useEffect } from 'react';

export default function LocaleManager({ locale, dir }: { locale: string; dir: string }) {
    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.lang = locale;
            document.documentElement.dir = dir;
        }
    }, [locale, dir]);
    return null;
}
