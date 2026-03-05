import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8 card max-w-md mx-4">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">404</h2>
                <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
                <Link href="/" className="btn-primary px-8 py-3">
                    Return Home
                </Link>
            </div>
        </div>
    );
}
