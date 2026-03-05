'use client';

import { ReactNode } from 'react';

interface AnalyticsProviderProps {
    children: ReactNode;
    segmentKey: string;
}

export default function AnalyticsProvider({ children, segmentKey }: AnalyticsProviderProps) {
    // TODO: Implement analytics tracking with Segment or similar
    // For now, this is a pass-through provider
    return <>{children}</>;
}
