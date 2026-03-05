'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Global error:', error);
    }, [error]);

    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <div className="min-h-screen flex items-center justify-center bg-red-50">
                    <div className="text-center p-8 card max-w-md mx-4 border-red-100">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
                        <p className="text-gray-600 mb-8">An unexpected error has occurred.</p>
                        <button
                            onClick={() => reset()}
                            className="btn-primary bg-red-600 hover:bg-red-700 px-8 py-3"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
