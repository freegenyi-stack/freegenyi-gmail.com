import { withAuth } from "next-auth/middleware"
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, rtlLocales } from './lib/i18n/config';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always',
    localeDetection: true,
});

function getLocaleFromCountry(country: string | null): string {
    if (country === 'DZ') return 'ar';
    return defaultLocale;
}

const authMiddleware = withAuth(
    // Note: If you use withAuth, it augments the request with `nextauth: { token }`
    function onSuccess(req) {
        return intlMiddleware(req);
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const path = req.nextUrl.pathname;
                // Basic check: if attempting to access /dashboard/*, need token
                return !!token;
            },
        },
        pages: {
            signIn: '/auth/signin',
        },
    }
);

export default function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    // Check for password token cookie
    const siteAccessToken = req.cookies.get('site-access-token');

    // Remove locale prefix to check path (handling 2 or 3 chars locales)
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2,3}(\/|$)/, '/') || '/';

    // Allow access to public assets, api, and site-access page itself
    const isPublicPath =
        pathname.startsWith('/api/') ||
        pathname.includes('/site-access') ||
        pathname.includes('/favicon.ico') ||
        pathname.includes('/images/') ||
        pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js)$/);

    if (!siteAccessToken && !isPublicPath) {
        // Redirect to /site-access with the current locale
        // We look for the locale in the URL or default to 'en'
        const localeMatch = pathname.match(/^\/([a-z]{2,3})(\/|$)/);
        const locale = localeMatch ? localeMatch[1] : defaultLocale;
        const redirectUrl = new URL(`/${locale}/site-access`, req.url);
        return NextResponse.redirect(redirectUrl);
    }

    const dashboardRoutes = ['/parent', '/teacher', '/school', '/ngo', '/ong', '/admin', '/ecole'];
    // Use pathWithoutLocale for cleaner check
    const isProtectedRoute = dashboardRoutes.some(route => pathWithoutLocale === route || pathWithoutLocale.startsWith(route + '/'));

    const country = req.headers.get('x-vercel-ip-country');
    const hasLocale = locales.some(l => pathname === `/${l}` || pathname.startsWith(`/${l}/`));

    if (!hasLocale && !isPublicPath) {
        const detectedLocale = getLocaleFromCountry(country);
        if (detectedLocale !== defaultLocale) {
            return NextResponse.redirect(new URL(`/${detectedLocale}${pathname}`, req.url));
        }
    }

    if (isProtectedRoute) {
        return (authMiddleware as any)(req);
    } else {
        return intlMiddleware(req);
    }
}

export const config = {
    // Matcher that excludes static files and internal Next.js paths
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)']
};
