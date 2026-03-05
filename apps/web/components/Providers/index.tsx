'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

interface ProvidersProps {
    children: React.ReactNode;
    locale: string;
    messages: any;
}

export function Providers({ children, locale, messages }: ProvidersProps) {
    return (
        <ThemeProvider defaultTheme="system" storageKey="freegeny-theme">
            {children}
            <Toaster />
        </ThemeProvider>
    );
}
