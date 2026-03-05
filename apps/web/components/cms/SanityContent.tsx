'use client';

import { useEffect, useState } from 'react';
import { client, homepageQuery } from '@/lib/cms/sanity';

export default function SanityContent() {
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchContent() {
            try {
                const data = await client.fetch(homepageQuery);
                setContent(data);
            } catch (error) {
                console.error('Error fetching Sanity content:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchContent();
    }, []);

    if (loading) return <div className="animate-pulse h-20 bg-gray-100 rounded-xl" />;
    if (!content) return null;

    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold">{content.heroTitle}</h2>
            <p className="text-gray-600">{content.heroSubtitle}</p>
        </div>
    );
}
