'use client';

import { ReactNode } from 'react';

interface ABTestProviderProps {
    children: ReactNode;
}

export function ABTestProvider({ children }: ABTestProviderProps) {
    // TODO: Implement A/B testing logic
    // For now, this is a pass-through provider
    return <>{children}</>;
}
