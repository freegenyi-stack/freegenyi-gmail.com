'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { SmartDashboardNavigation } from '@/components/navigation/SmartDashboardNavigation';
import { AuthStoreSync } from './AuthStoreSync';

import { ChildProvider } from '@/lib/context/ChildContext';

interface ClientProvidersProps {
    children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
    return (
        <SessionProvider>
            <AuthStoreSync>
                <ChildProvider>
                    <ThemeProvider
                        defaultTheme="system"
                        storageKey="freegeny-theme"
                    >
                        <SmartDashboardNavigation />
                        {children}
                        <Toaster />
                    </ThemeProvider>
                </ChildProvider>
            </AuthStoreSync>
        </SessionProvider>
    );
}
