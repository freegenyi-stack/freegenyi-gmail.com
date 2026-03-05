'use client';

import { ReactNode } from 'react';

interface StripeProviderProps {
    children: ReactNode;
}

export default function StripeProvider({ children }: StripeProviderProps) {
    // TODO: Implement Stripe Elements provider when needed
    // For now, this is a pass-through provider
    return <>{children}</>;
}
